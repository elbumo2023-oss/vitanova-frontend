import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import type { Client } from "../types";

const BASE_URL = "/api/clients";

export default function useClients(){
    const{token} = useAuth()
    const queryClient = useQueryClient()

    const axiosInstance = axios.create({
        baseURL: BASE_URL,
        headers:{
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }) 

    //GET: obtener todos los clientes
    const getAll = () => {
        return useQuery<Client[]>({
            queryKey: ["clients"],
            queryFn: async () => (await axiosInstance.get("")).data,
            enabled: !!token
        })
    }

    //GET: obtener por id
    const getById = (id:number) =>{
        return useQuery<Client>({
            queryKey: ["clients", id],
            queryFn: async () => (await axiosInstance.get(`${id}`)).data,
            enabled: !!token && !!id
        })
    }

    //GET: obtener por identificacion
    const getByIdentification =(identification: string)=>{
        return useQuery<Client>({
            queryKey: ["clients", identification],
            queryFn: async() => (await axiosInstance.get(`/search/identification/${identification}`)).data,
            enabled: !!identification && !!token
        })
    }

    const update = useMutation({
        mutationFn: async (client:Partial<Client>) => 
        (await axiosInstance.put(`/${client.id}`, client)).data,
        onSuccess: () => {
         queryClient.invalidateQueries({queryKey: ["clients"]});
    }
    })

    const remove = useMutation({
        mutationFn: async (id: number) => await axiosInstance.delete(`/${id}`),
        onSuccess: () => {
        queryClient.invalidateQueries({queryKey:["clients"]});
        },
    });

    return{ getAll, getById, getByIdentification, update, remove}

}