import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Quote, QuoteRequest } from "../types";

// Ruta del backend 
const BASE_URL = "/api/invoices";

//Interceptor global: agrega el token JWT automáticamente a mis peticiones
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function useQuotes() {
  const queryClient = useQueryClient();

  //Obtener todas las cotizaciones (solo admin)
  const getAll = () =>
    useQuery({
      queryKey: ["quotes"],
      queryFn: async () => (await axios.get(BASE_URL)).data,
    });

  // Obtener las cotizaciones del cliente logueado (usa el token JWT)
  const getMyQuotes = () =>
    useQuery({
      queryKey: ["myQuotes"],
      queryFn: async () => (await axios.get(`${BASE_URL}/my`)).data,
    });

  //Obtener una cotización específica por ID (solo admin)
  const getById = (id: number) =>
    useQuery({
      queryKey: ["quote", id],
      queryFn: async () => (await axios.get(`${BASE_URL}/${id}`)).data,
      enabled: !!id,
    });

  // Obtener cotizaciones por cliente
  const getByClient = (clientId: number) =>
    useQuery({
      queryKey: ["quotes", "client", clientId],
      queryFn: async () =>
        (await axios.get(`${BASE_URL}/search/client/${clientId}`)).data,
      enabled: !!clientId,
    });

  // Obtener cotizaciones por estado
  const getByStatus = (status: string) =>
    useQuery({
      queryKey: ["quotes", "status", status],
      queryFn: async () =>
        (await axios.get(`${BASE_URL}/search/status/${status}`)).data,
      enabled: !!status,
    });

  // Crear nueva cotización (InvoiceRequest)
  // Body esperado:
  // { status: "PENDIENTE", clientId: 1, serviceIds: [3], productIds: [2, 4] }
  const create = useMutation({
    mutationFn: async (quote: QuoteRequest) =>
      (await axios.post(BASE_URL, quote)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      queryClient.invalidateQueries({ queryKey: ["myQuotes"] });
    },
  });

  // Actualizar una cotización existente (solo admin)
  const update = useMutation({
    mutationFn: async (quote: Quote) =>
      (await axios.put(`${BASE_URL}/${quote.id}`, quote)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
  });

  // Eliminar una cotización (solo admin)
  const remove = useMutation({
    mutationFn: async (id: number) =>
      (await axios.delete(`${BASE_URL}/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
  });

  return {
    getAll,
    getMyQuotes,
    getById,
    getByClient,
    getByStatus,
    create,
    update,
    remove,
  };
}