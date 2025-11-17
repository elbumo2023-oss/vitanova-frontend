import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import SkeletonLoader from "../components/SkeletonLoader";
import { useAuth } from "../contexts/AuthContext";
import useProducts from "../hooks/useProducts";
import { useServices } from "../hooks/useService";
import useQuotes from "../hooks/useQuotes";
import useClients from "../hooks/useClients";
import { toast } from "react-toastify";
import type { Product, Service, QuoteRequest } from "../types";

function Quotes() {
  const { token, identification } = useAuth();
const navigate = useNavigate();
const warnedRef = useRef(false);

// hooks
const { getAll: getProducts } = useProducts();
const { data: products, isLoading: loadingProducts } = getProducts();

const { getAll: getServices } = useServices();
const { data: services, isLoading: loadingServices } = getServices();

const { getByIdentification } = useClients();
const { data: client, isLoading: loadingClient, isError } = getByIdentification(
  identification || ""
);

const { create } = useQuotes();

const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
const [selectedServices, setSelectedServices] = useState<number[]>([]);

// 🚫 Verificar sesión solo una vez
useEffect(() => {
  if (!token && !warnedRef.current) {
    warnedRef.current = true;
    toast.warn("Debes iniciar sesión para solicitar una cotización", {
      position: "top-center",
      autoClose: 2000,
    });
    navigate("/login");
  }
}, [token, navigate]);

// ⚠️ Error al cargar cliente (una vez)
useEffect(() => {
  if (isError && !warnedRef.current) {
    warnedRef.current = true;
    toast.error("Error al obtener la información del cliente.", {
      position: "top-center",
    });
  }
}, [isError]);

const clientId = client?.id || null;
const loading = loadingProducts || loadingServices || loadingClient;
const isSubmitDisabled =
  selectedProducts.length === 0 && selectedServices.length === 0;

const toggleProduct = (id: number) => {
  setSelectedProducts((prev) =>
    prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
  );
};

const toggleService = (id: number) => {
  setSelectedServices((prev) =>
    prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
  );
};

const handleSubmit = async () => {
  if (!clientId) {
    toast.error("No se pudo determinar el cliente asociado.", {
      position: "top-center",
    });
    return;
  }

  const quoteRequest: QuoteRequest = {
    clientId,
    productIds: selectedProducts,
    serviceIds: selectedServices,
    status: "PENDIENTE",
  };

  try {
    await create.mutateAsync(quoteRequest);
    toast.success("Cotización enviada con éxito", {
      position: "top-center",
      autoClose: 2500,
    });

    setTimeout(() => {
      toast.info("Serás redirigido a tus cotizaciones para que puedas hablar con nuestros asesores...", {
        position: "top-center",
        autoClose: 3000,
      });
    }, 1000);

    setTimeout(() => navigate("/my-quotes"), 4000);
  } catch {
    toast.error("Error al enviar la cotización. Inténtalo nuevamente.", {
      position: "top-center",
    });
  }
};

  //  Interfaz
  return (
    <>
    <Box bg="#F9FCFF" minH="100vh" py="4rem">
      <Container maxW="7xl">
        <VStack gap={6} mb="3rem">
          <Heading color="#1E4460" textAlign="center">
            Solicitud de Cotización
          </Heading>
          <Text color="gray.600" maxW="3xl" textAlign="center">
            Selecciona los productos o servicios que deseas incluir en tu
            cotización y uno de nuestros asesores técnicos te atenderá.
          </Text>
        </VStack>

        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="2rem">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonLoader key={i} />
            ))}
          </SimpleGrid>
        ) : (
          <>
            {/* Productos */}
          <Heading size="md" mb="1rem" color="#1E4460">
            Productos disponibles
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="2rem" mb="3rem">
            {products?.map((product: Product) => {
              const isSelected = selectedProducts.includes(product.id);
              return (
                <Box
                  key={product.id}
                  borderWidth={isSelected ? "3px" : "1px"}
                  borderColor={isSelected ? "#1E4460" : "gray.200"}
                  borderRadius="lg"
                  p="1rem"
                  cursor="pointer"
                  onClick={() => toggleProduct(product.id)}
                  transition="all 0.3s"
                  bg="white"
                  _hover={{ shadow: "lg", transform: "scale(1.02)" }}
                  boxShadow={isSelected ? "0 0 12px rgba(30,68,96,0.4)" : "md"}
                  textAlign="center"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "cover",
                      borderRadius: "0.6rem",
                      marginBottom: "0.8rem",
                      transition: "transform 0.3s ease-in-out",
                    }}
                  />
                  <Text fontWeight="bold" color="#1E4460" fontSize="lg">
                    {product.name}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {product.description}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>

          {/* Servicios */}
          <Heading size="md" mb="1rem" color="#1E4460">
            Servicios disponibles
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="2rem" mb="3rem">
            {services?.map((service: Service) => {
              const isSelected = selectedServices.includes(service.id);
              return (
                <Box
                  key={service.id}
                  borderWidth={isSelected ? "3px" : "1px"}
                  borderColor={isSelected ? "#1E4460" : "gray.200"}
                  borderRadius="lg"
                  p="1rem"
                  cursor="pointer"
                  onClick={() => toggleService(service.id)}
                  transition="all 0.3s"
                  bg="white"
                  _hover={{ shadow: "lg", transform: "scale(1.02)" }}
                  boxShadow={isSelected ? "0 0 12px rgba(30,68,96,0.4)" : "md"}
                  textAlign="center"
                >
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "cover",
                      borderRadius: "0.6rem",
                      marginBottom: "0.8rem",
                      transition: "transform 0.3s ease-in-out",
                    }}
                  />
                  <Text fontWeight="bold" color="#1E4460" fontSize="lg">
                    {service.name}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {service.description}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>
          {/* Resumen de selección */}
        <VStack gap={2} mt="2rem" mb="1.5rem">
          <Text color="gray.700" fontSize="md">
            🧾 Has seleccionado{" "}
            <strong>{selectedProducts.length}</strong> producto(s) y{" "}
            <strong>{selectedServices.length}</strong> servicio(s)
          </Text>
        </VStack>
            {/* Botón de envío */}
            <Box textAlign="center" mt="3rem">
              <Button
                colorScheme="blue"
                bg="#1E4460"
                _hover={{ bg: "#244E61" }}
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
              >
                Crear cotización
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
    </>
  );
}

export default Quotes;