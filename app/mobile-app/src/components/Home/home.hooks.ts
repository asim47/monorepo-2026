import { apiRequest } from "@/helpers/ApiRequestHandler";
import { CreatePlacePayload, GenericResponse, Place } from "@/interfaces/app";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePlaces = () => {
  return useQuery({
    queryKey: ["places"],
    queryFn: () => apiRequest<GenericResponse<Place[]>>({
      url: "/user/places",
      method: "GET",
    }),
  });
};

export const useCreatePlace = ({onSuccess, onError}: {onSuccess: () => void, onError: (error: Error) => void}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePlacePayload) => apiRequest<GenericResponse<Place>>({
      url: "/user/places",
      method: "POST",
      data,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] });
      onSuccess();
    },
    onError,
  });
};

export const useUpdatePlace = () => {
  return useMutation({
    mutationFn: (data: Place) => apiRequest<GenericResponse<Place>>({
      url: `/user/places/${data.id}`,
      method: "PUT",
      data,
    }),
  });
};

export const useDeletePlace = () => {
  return useMutation({
    mutationFn: (id: string) => apiRequest<GenericResponse<Place>>({
      url: `/user/places/${id}`,
      method: "DELETE",
    }),
  });
};