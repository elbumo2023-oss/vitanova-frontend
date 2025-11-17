import { Box, Button, VStack, Heading, Text, Input, SimpleGrid, Container, HStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { Client, RegisterForm } from "../types";
import { FaUser, FaLock, FaEnvelope, FaPhone, FaCity, FaIdCard } from "react-icons/fa";
import { MdHome, MdPublic } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";

const BASE_URL = "/auth/register";

export default function Register(){

    const{register, handleSubmit, reset} = useForm<RegisterForm>();
    const navigate = useNavigate()
    const {login} = useAuth()

    const onSubmit = async (data:RegisterForm) => {
      try{
        const res = await axios.post(BASE_URL, data);
        toast.success("Cliente registrado exitosamente", {
          position: "top-right",
          autoClose: 2500,
          theme: "colored"
        }) 

        login(res?.data?.token)

        reset()
        navigate("/")
      }catch(err:any){
         toast.error("El usuario ya existe o los datos son inválidos", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
      });
      }
    }

    return (
      <>
        <Box
      bg="#F9FCFF"
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      py="5rem"
    >
      <Container
        maxW="700px"
        bg="white"
        p={{ base: "2.5rem", md: "3.5rem" }}
        borderRadius="1rem"
        boxShadow="xl"
        transition="all 0.3s ease"
        _hover={{
          transform: "translateY(-4px)",
          boxShadow: "2xl",
        }}
      >
        <VStack gap={6} align="stretch">
          <Heading
            textAlign="center"
            color="#1E4460"
            fontWeight="bold"
            fontSize="2xl"
          >
            Crear cuenta
          </Heading>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={5} align="stretch">
              {/* Nombre y apellido */}
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
                <Box>
                  <HStack>
                    <FaUser color="#1E4460" />
                    <Text color="gray.700" fontWeight="semibold">
                      Nombre
                    </Text>
                  </HStack>
                  <Input
                    type="text"
                    placeholder="Tu nombre"
                    {...register("name", { required: true })}
                  />
                </Box>

                <Box>
                  <HStack>
                    <FaUser color="#1E4460" />
                    <Text color="gray.700" fontWeight="semibold">
                      Apellido
                    </Text>
                  </HStack>
                  <Input
                    type="text"
                    placeholder="Tu apellido"
                    {...register("lastname", { required: true })}
                  />
                </Box>
              </SimpleGrid>

              {/* Email */}
              <Box>
                <HStack>
                  <FaEnvelope color="#1E4460" />
                  <Text color="gray.700" fontWeight="semibold">
                    Email
                  </Text>
                </HStack>
                <Input
                  type="email"
                  placeholder="tuemail@gmail.com"
                  {...register("email", { required: true })}
                />
              </Box>

              {/* Contraseña */}
              <Box>
                <HStack>
                  <FaLock color="#1E4460" />
                  <Text color="gray.700" fontWeight="semibold">
                    Contraseña
                  </Text>
                </HStack>
                <Input
                  type="password"
                  placeholder="********"
                  {...register("password", { required: true })}
                />
              </Box>

              {/* Teléfono */}
              <Box>
                <HStack>
                  <FaPhone color="#1E4460" />
                  <Text color="gray.700" fontWeight="semibold">
                    Teléfono
                  </Text>
                </HStack>
                <Input
                  type="tel"
                  placeholder="+593 ..."
                  {...register("phone", { required: true })}
                />
              </Box>

              {/* Dirección */}
              <Box>
                <HStack>
                  <MdHome color="#1E4460" />
                  <Text color="gray.700" fontWeight="semibold">
                    Dirección
                  </Text>
                </HStack>
                <Input
                  type="text"
                  placeholder="Av. Principal #123"
                  {...register("address", { required: true })}
                />
              </Box>

              {/* Ciudad y país */}
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
                <Box>
                  <HStack>
                    <FaCity color="#1E4460" />
                    <Text color="gray.700" fontWeight="semibold">
                      Ciudad
                    </Text>
                  </HStack>
                  <Input
                    type="text"
                    placeholder="Guayaquil"
                    {...register("city", { required: true })}
                  />
                </Box>

                <Box>
                  <HStack>
                    <MdPublic color="#1E4460" />
                    <Text color="gray.700" fontWeight="semibold">
                      País
                    </Text>
                  </HStack>
                  <Input
                    type="text"
                    placeholder="Ecuador"
                    {...register("country", { required: true })}
                  />
                </Box>
              </SimpleGrid>

              {/* Identificación */}
              <Box>
                <HStack>
                  <FaIdCard color="#1E4460" />
                  <Text color="gray.700" fontWeight="semibold">
                    Identificación
                  </Text>
                </HStack>
                <Input
                  type="text"
                  placeholder="Número de cédula o Pasaporte"
                  {...register("identification", { required: true })}
                />
              </Box>

              {/* Botón */}
              <Button
                type="submit"
                bg="#1E4460"
                color="white"
                fontWeight="semibold"
                w="100%"
                py="1.5rem"
                borderRadius="0.75rem"
                transition="all 0.2s"
                _hover={{
                  bg: "#285a7a",
                  transform: "translateY(-2px)",
                }}
              >
                Registrarse
              </Button>
            </VStack>
          </form>

          <Text fontSize="sm" textAlign="center" color="gray.600">
            ¿Ya tienes cuenta?{" "}
            <Text
              as="span"
              color="#1E4460"
              fontWeight="bold"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
              onClick={() => navigate("/login")}
            >
              Inicia sesión aquí
            </Text>
          </Text>
        </VStack>
      </Container>
      </Box>
      </>
    )
}