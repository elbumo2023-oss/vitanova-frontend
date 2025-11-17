import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Container,
  Button,
  Image,
  HStack,
  Icon
} from "@chakra-ui/react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
  FaEdit,
  FaSignOutAlt,
  FaIdCard,
  FaLock,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../contexts/AuthContext";
import useClients from "../hooks/useClients";
import { useNavigate } from "react-router-dom";

export default function Profile(){
  const{identification, logout} = useAuth()
  const{getByIdentification } = useClients()
  const navigate = useNavigate()

  const{data: client, isLoading, isError} = getByIdentification(identification||"")

  if (isLoading){
    return (
      <Box textAlign="center" mt="10">
        <Spinner size="xl" color="#1E4460" />
        <Text mt={3}>Cargando tu perfil...</Text>
      </Box>
    );

  }
  if(isError|| !client){
    return(
      <>
        <Box textAlign="center" mt="1rem">
          <Text color="red.500" fontWeight="medium">
            No se pudieron cargar sus datos
          </Text>
        </Box>
      </>
    )
  }

  return (
    <>
     <Box bg="#daf5ee" minH="100vh" py="5rem">
        <Container maxW="6xl">
          <VStack gap={6}
          p="3rem"
          bg="white"
          boxShadow="xl"
          borderRadius="2xl"
          textAlign="center">
             {/* Imagen de perfil genérica */}
            <Image
              src="https://storage.googleapis.com/imagenes-biomedicas-sistema/user.png"
              alt="Foto de perfil"
              boxSize={{ base: "6rem", md: "8rem" }}
              borderRadius="full"
              p={"1rem"}
              shadow="lg"
              mb="0.5rem"
            />
            {/* Nombre y título */}
            <VStack gap={"0.3rem"}>
              <Heading size={"lg"} color="#1E4460">
                {client.name} {client.lastName}
              </Heading>
              <HStack color="gray.500">
              <Icon as={FaIdCard} />
              <Text fontSize="md">ID/Pasaporte: {client.identification}</Text>
            </HStack>
            </VStack>
         {/*Linea de info*/}
          <Box
            textAlign="left"
            w="100%"
            px={{ base: 2, md: 10 }}
            mt="1.5rem"
            fontSize={{ base: "md", md: "lg" }}
            color="gray.700"
          >
              <HStack mb="2">
                <Icon as={FaEnvelope} color="#1E4460" />
                <Text>
                  <strong>Email:</strong> {client.email}
                </Text>
              </HStack>
                <HStack mb="2">
                <Icon as={FaPhone} color="#1E4460" />
                <Text>
                  <strong>Teléfono:</strong> {client.phone || "No especificado"}
                </Text>
              </HStack>
              <HStack mb="2">
                <Icon as={FaMapMarkerAlt} color="#1E4460" />
                <Text>
                  <strong>Dirección:</strong> {client.address || "No especificada"}
                </Text>
              </HStack>
              <HStack mb="2">
                <Icon as={FaCity} color="#1E4460" />
                <Text>
                  <strong>Ciudad:</strong> {client.city || "No especificada"}
                </Text>
              </HStack>
              <HStack mb="2">
                <Icon as={FaGlobe} color="#1E4460" />
                <Text>
                  <strong>País:</strong> {client.country || "No especificado"}
                </Text>
              </HStack>

               {/* Botones */}
              <HStack gap={4} pt="1rem" flexWrap="wrap" justify="center">
                <Button
                  bg="#1E4460"
                  color="white"
                  _hover={{ bg: "#285a7a" }}
                  onClick={() => navigate("/update-profile")}
                >
                  <HStack>
                  <Icon as={FaEdit} />
                  <Text>Editar perfil</Text>
                </HStack>
                </Button>
                <Button
                bg="teal.600"
                color="white"
                _hover={{ bg: "teal.700" }}
                onClick={() => navigate("/change-password")}
              >
                <HStack>
                  <Icon as={FaLock} />
                  <Text>Cambiar contraseña</Text>
                </HStack>
              </Button>

                <Button
                  variant="outline"
                  borderColor="#1E4460"
                  color="#1E4460"
                  _hover={{ bg: "#1E4460", color: "white" }}
                  onClick={() => {
                    logout();
                    toast.success("Has cerrado sesión correctamente.", {
                      position: "top-right",
                      autoClose: 2500,
                      theme: "colored",
                    });
                    navigate("/")
                  }}
                >
                  <HStack>
                  <Icon as={FaSignOutAlt} />
                  <Text>Cerrar sesión</Text>
                </HStack>
                </Button>
              </HStack>
            </Box>
          </VStack>
        </Container>
     </Box>         
    </>
  )

}