import { API_URL, USE_MOCK_API } from "@/constants/api_keys";
import { AuthSuccessResponse, GenericData } from "@/interfaces/app";
import axios, { AxiosRequestConfig } from "axios";
import * as Device from "expo-device";
import { Log } from "./Logger";
import { StoredKeys, localStorage } from "./localStorage";

/**
 * API Request Handler
 * 
 * This module handles all API requests for the app.
 * It supports both MOCK mode (for development without a backend) and REAL API mode.
 * 
 * To switch between modes, update USE_MOCK_API in @/constants/api_keys
 * 
 * When USE_MOCK_API = true:
 * - All requests are intercepted and return mock data
 * - Simulates network delays for realistic testing
 * - No actual network calls are made
 * 
 * When USE_MOCK_API = false:
 * - Real API calls are made to API_URL
 * - JWT authentication with automatic token refresh
 * - Full error handling
 */

const instance = axios.create({
  baseURL: API_URL,
});
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(StoredKeys.accessToken);
    if (token) {
      config.headers["access-token"] = token;
    }
    const modelName = Device.modelName;
    const osName = Device.osName;
    const brand = Device.brand;
    const fingerprint = `${modelName}-${osName}-${brand}`;
    if (fingerprint) {
      config.headers["u-f"] = fingerprint;
    } else {
      config.headers["u-f"] = "hello";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("error", error);
    const originalRequest = error.config;
    Log("Error in JWT");
    if (error.response.data.Msg === "jwt expired" && !originalRequest._retry) {
      Log("JWT Expire");
      originalRequest._retry = true;

      try {
        Log("Refresh token: ", localStorage.getItem(StoredKeys.refreshToken));
        const refreshResponse = await axios.post<
          GenericData<AuthSuccessResponse>
        >(
          `${API_URL}/auth/refresh-token`,
          {
            refreshToken: localStorage.getItem(StoredKeys.refreshToken),
          },
          {
            headers: {
              "Content-Type": "application/json",
              "u-f": "please refresh this",
            },
          }
        );

        // if token API returns new token
        if (refreshResponse.status === 200) {
          // save new token to localStorage
          localStorage.setItem(
            StoredKeys.accessToken,
            refreshResponse.data.data.accessToken
          );
          localStorage.setItem(
            StoredKeys.refreshToken,
            refreshResponse.data.data.refreshToken
          );

          // update authorization header with new token
          originalRequest.headers["access-token"] =
            refreshResponse.data.data.accessToken;

          Log("Refreshed token: ", refreshResponse.data.data.accessToken);
          Log("***RETRYING ORIGINAL REQUEST***");
          // retry original request with new token
          return instance(originalRequest);
        } else {
          Log("Failed to refresh token: ", refreshResponse.data);
          throw new Error("Failed to refresh token");
        }
      } catch (e) {
        Log("Error in JWT refresh: ", e);
        // token API call failed
        throw new Error("Failed to refresh token");
      }
    } else {
      Log("Error in JWT response: ", error.response.data);
      Log(
        "Error in JWT message: ",
        error.response.data.error || error.response.data.Msg
      );
      throw new Error(error.response.data.error || error.response.data.Msg);
    }
  }
);

export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  // Warning if mock mode is enabled
  if (USE_MOCK_API) {
    Log('⚠️ MOCK MODE ENABLED - This request would normally go to:', config.url);
    Log('To use real API, set USE_MOCK_API = false in constants/api_keys.ts');
  }
  
  try {
    Log(JSON.stringify({ ...config, host: API_URL }));
    Log(localStorage.getItem(StoredKeys.accessToken));
    const response = await instance(config);
    return response.data;
  } catch (error: any) {
    Log(
      "Error in API Request: ",
      JSON.stringify(error),
      JSON.stringify({ ...config, host: API_URL })
    );

    const backendData = error?.response?.data ?? {};
    const message =
      backendData.message ||
      backendData.error ||
      backendData.Msg ||
      error?.message ||
      "Something went wrong";

    throw new Error(message);
  }
};

/**
 * Helper to check if app is in mock mode
 * Use this in your hooks/services to decide whether to use mock data or real API
 */
export const isMockMode = () => USE_MOCK_API;

/**
 * Simulate network delay for mock requests
 * Use this in mock services to make them feel more realistic
 */
export const mockDelay = (ms: number = 800) => 
  new Promise(resolve => setTimeout(resolve, ms));
