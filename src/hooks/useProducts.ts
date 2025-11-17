import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios  from "axios";
import type { Product } from "../types";

const BASE_URL = "/api/products"

export default function useProducts(){
    const queryClient = useQueryClient()

    //GET: todos los productos
    const getAll = () => {
        return useQuery<Product[]>({
            queryKey: ["products"],
            queryFn: async () => (await axios.get<Product[]>(BASE_URL)).data
        })
    }

    //GET: busqueda por nombre
    const getByName = (name:string) =>{
      return  useQuery<Product[]>({
            queryKey: ["products", name],
            queryFn: async () => (await axios.get<Product[]>(`${BASE_URL}/search/name/${name}`)).data,
            enabled: !!name
        })
    }

    //GET: busqueda por categoria
    const getByCategory = (category:string) =>{
       return useQuery<Product[]>({
            queryKey: ["products", category],
            queryFn: async () => (await axios.get<Product[]>(`${BASE_URL}/search/category/${category}`)).data,
            enabled: !!category
        })
    }

    //GET: busqueda por marca
    const getByBrand = (brand: string)=>{
      return  useQuery<Product[]>({
            queryKey: ["products", brand],
            queryFn: async ()=> (await axios.get<Product[]>(`${BASE_URL}/search/brand/${brand}`)).data,
            enabled: !!brand
        })
    }

    //GET: obtener por stock
    const getByStock = (stock:number)=>{
      return  useQuery<Product[]>({
            queryKey: ["products", stock],
            queryFn: async () => (await axios.get<Product[]>(`${BASE_URL}/search/stock/less/${stock}`)).data
        })
    }


    //POST: crear producto
    const create = useMutation({
        mutationFn: (data:Omit<Product, "id">) => axios.post<Product>(BASE_URL, data),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["products"]})
    })

    // PUT: actualizar producto
  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) => axios.put(`${BASE_URL}/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({queryKey:["products"]}),
  })

  const remove = useMutation({
    mutationFn: (id:number) => axios.delete(`${BASE_URL}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["products"]})  
  })

  return {getAll, getByName, getByCategory, getByBrand, getByStock, create, update, remove}
}