import { apiRequest } from "@/helpers/ApiRequestHandler";
import { GenericResponse, User } from "@/interfaces/app";
import { useQuery } from "@tanstack/react-query";

export const useGetUser  = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => apiRequest<GenericResponse<User>>({
        url: "/user/me",
        method: "GET",
      }),
  });
};