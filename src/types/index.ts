export type Role = {
    id:number,
    name: string
}
export type User = {
    id: number,
    username: string,
    enabled: boolean
    roles: Role[]
}
export type Client = {
    id: number,
    name: string,
    lastName: string,
    identification: string,
    country: string,
    city: string,
    phone: string,
    email: string,
    address: string
    //relaciones
    services?: Service[]
    user: User
}

export type Product = {
    id: number,
    name: string,
    brand: string,
    category: string,
    price: number,
    stock: number,
    description: string
    imageUrl?: string
}

export type Service = {
    id: number,
    name: string,
    description: string,
    cost: number,
    serviceTime: string,
    imageUrl?: string,
    category?: string
}

export interface Message {
    id?: number,
    content: string,
    localDateTime: string,
    sender: User,
    receiver: User
}
export type Quote = {
    id: number,
    date: string,
    total: number,
    status: string,
    client: Client
    services: Service[]
    products: Product[]
}
export type RegisterForm = {
  name: string;
  lastname: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  identification: string;
}
export type QuoteRequest = {
  status: string;        // ej: "PENDIENTE"
  clientId: number;      // ID del cliente autenticado
  serviceIds: number[];  // IDs de servicios seleccionados
  productIds: number[];  // IDs de productos seleccionados
}
