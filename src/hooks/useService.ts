import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import type { Service } from "../types"


const BASE_URL = "/api/services"

export function useServices() {
  const queryClient = useQueryClient()

  // GET: todos los servicios
  const getAll = () => {
    return  useQuery<Service[]>({
      queryKey: ["services"],
      queryFn: async () => (await axios.get<Service[]>(BASE_URL)).data,
    })
}

  // GET: búsqueda por nombre
  const getByName = (name: string) => {
    return  useQuery<Service[]>({
      queryKey: ["services", name],
      queryFn: async () => (await axios.get<Service[]>(`${BASE_URL}/search/name/${name}`)).data,
      enabled: !!name,
    })
}

  //GET: obtener por Id
  const getById = (id:number) => {
   return useQuery<Service>({
        queryKey: ["services", id],
        queryFn: async () => (await axios.get<Service>(`${BASE_URL}/${id}`)).data,
        enabled: !!id
    })
  } 

  //GET: obtener por cliente
  const getByClientId = (clientId:number) =>{
   return useQuery<Service>({
        queryKey: ["services", clientId],
        queryFn: async () => (await axios.get<Service>(`${BASE_URL}/search/client/${clientId}`)).data,
        enabled: !!clientId
    })
  }

  //GET: obtener por rango de costo
  const getByRangeCost = (minPrice: number, maxPrice: number) => {
    return useQuery<Service[]>({
        queryKey: ["services", minPrice, maxPrice],
        queryFn: async () => (await axios.get<Service[]>(`${BASE_URL}/search/cost/${minPrice}/${maxPrice}`)).data,
        enabled: !! minPrice
    })
  }

  // POST: crear servicio
  const create =  useMutation({
    mutationFn: (data: Omit<Service, "id">) => axios.post<Service>(BASE_URL, data),
    onSuccess: () => queryClient.invalidateQueries({queryKey:["services"]}),
  })

  // PUT: actualizar servicio
  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Service>}) => axios.put(`${BASE_URL}/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({queryKey:["services"]}),
  })

  // DELETE: eliminar servicio
  const remove = useMutation({
    mutationFn: (id: number) => axios.delete(`${BASE_URL}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({queryKey:["services"]}),
  })

  return { getAll, getByName, getById, getByClientId, getByRangeCost, create, update, remove }
}