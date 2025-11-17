import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Badge,
  Button,
  Flex,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import useClients from "../hooks/useClients";
import useQuotes from "../hooks/useQuotes";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type Props = {}

function MyQuotes({}: Props) {
  
  const{token} = useAuth()
  const navigate = useNavigate()
  const{getMyQuotes} =useQuotes()

  if(!token){
    toast.warn("Debes iniciar sesión para ver las cotizaciones", {
      position: "top-center",
      autoClose: 2000
    })
    navigate("/login")
    return null;
  }

  const{data: quotes, isLoading, isError} = getMyQuotes()
  if(isError){
    toast.error("Error al obtener sus cotizaciones", {
      position: "top-center"
    })
  }

  return (
  <>
    <Box bg="#F9FCFF" minH="100vh" py="4rem">
      <Container maxW="7xl">
        <VStack gap={6} mb="3rem">
          <Heading color="#1E4460" textAlign="center">
            Mis Cotizaciones
          </Heading>
          <Text color="gray.600" textAlign="center" maxW="3xl">
            Aquí podrás revisar todas las cotizaciones que has solicitado y su estado actual.
          </Text>
        </VStack>

        {isLoading ? (
          <Flex justify="center" align="center" minH="50vh">
            <Spinner size="xl" color="#1E4460" />
          </Flex>
        ) : quotes && quotes.length > 0 ? (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="2rem">
              {quotes.map((quote: any) => (
                <Box
                  key={quote.id}
                  bg="white"
                  borderRadius="lg"
                  boxShadow="md"
                  p="1.5rem"
                  h="450px"
                  overflowY="auto"
                  _hover={{ transform: "scale(1.02)", transition: "0.3s" }}
                >
                  <VStack align="start" gap={3}>
                    <Badge
                      colorScheme={
                        quote.status === "PENDIENTE"
                          ? "yellow"
                          : quote.status === "APROBADA"
                          ? "green"
                          : "red"
                      }
                    >
                      {quote.status}
                    </Badge>

                    <Text fontWeight="bold" color="#1E4460">
                      Fecha: {quote.date}
                    </Text>

                    {/* Productos */}
                    {quote.products?.length > 0 && (
                      <>
                        <Text fontWeight="medium" color="gray.700">
                          Productos:
                        </Text>
                        {quote.products.map((p: any) => (
                          <Flex
                            key={p.id}
                            align="center"
                            gap={3}
                            border="1px solid #E2E8F0"
                            borderRadius="md"
                            p="0.5rem"
                            w="100%"
                          >
                            <Image
                              src={p.imageUrl}
                              alt={p.name}
                              boxSize="60px"
                              borderRadius="md"
                              objectFit="cover"
                            />
                            <Text>{p.name}</Text>
                          </Flex>
                        ))}
                      </>
                    )}

                    {/* Servicios */}
                    {quote.services?.length > 0 && (
                      <>
                        <Text fontWeight="medium" color="gray.700" mt={2}>
                          Servicios:
                        </Text>
                        {quote.services.map((s: any) => (
                          <Flex
                            key={s.id}
                            align="center"
                            gap={3}
                            border="1px solid #E2E8F0"
                            borderRadius="md"
                            p="0.5rem"
                            w="100%"
                          >
                            <Image
                              src={s.imageUrl}
                              alt={s.name}
                              boxSize="60px"
                              borderRadius="md"
                              objectFit="cover"
                            />
                            <Text>{s.name}</Text>
                          </Flex>
                        ))}
                      </>
                    )}
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>

            {/* Botón solo si existen cotizaciones */}
            <Flex justify="center" mt="3rem">
              <Button
                bg="#1E4460"
                color="white"
                _hover={{ bg: "#244E61" }}
                size="lg"
                onClick={() => navigate("/chat")}
              >
                Contactar asesor
              </Button>
            </Flex>
          </>
        ) : (
          <>
            <Text textAlign="center" color="gray.500" mt="3rem">
              Aún no tienes cotizaciones registradas.
            </Text>
            <Flex justify="center" mt="2rem">
              <Button
                bg="#1E4460"
                color="white"
                _hover={{ bg: "#244E61" }}
                size="lg"
                onClick={() => navigate("/quote")}
              >
                Solicitar cotización
              </Button>
            </Flex>
          </>
        )}
      </Container>
    </Box>
  </>
);
}

export default MyQuotes