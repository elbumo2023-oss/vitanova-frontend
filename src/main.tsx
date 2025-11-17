import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const system = createSystem(defaultConfig)
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <QueryClientProvider client={queryClient} >
        <App />
        <ToastContainer 
          position="top-right" // Puedes cambiar la posición
          autoClose={5000}     // Opciones de configuración
          hideProgressBar={false} 
        />
      </QueryClientProvider>
    </ChakraProvider>
  </StrictMode>,
)
