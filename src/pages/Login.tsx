import { Box, Button, VStack, Heading, Text, Input, HStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";


type LoginForm = {
  email: string;
  password: string;
};

const BASE_URL = "/auth/login";

export default function Login() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const navigate = useNavigate();
  const {login} = useAuth()

  const onSubmit = async (data: LoginForm) => {
  try {
    const res = await axios.post(BASE_URL, data);
    const { token, username } = res.data;

    // Guardar datos en el contexto
    login(token);

    // Decodificar el token localmente para verificar roles
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    const roles = payload.roles || [];

    toast.success(`Bienvenido ${username}`, {
      position: "top-right",
      autoClose: 2500,
      theme: "colored",
    });

    // Redirección automática según rol
    if (roles.includes("ROLE_ADMIN")) {
      navigate("/admin");
    } else {
      navigate("/");
    }
  } catch (err: any) {
    toast.error("Credenciales inválidas o error de conexión", {
      position: "top-right",
      autoClose: 2500,
      theme: "colored",
    });
  }
};

  return (
    <Box
      bg="#F9FCFF"
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      py="6rem"
    >
      <Box
        bg="white"
        p="3.5rem"
        borderRadius="1rem"
        boxShadow="xl"
        w={{ base: "92%", md: "440px" }}
        transition="all 0.3s ease"
        _hover={{
          transform: "scale(1.02)",
          boxShadow: "2xl",
        }}
      >
        <VStack gap={"2rem"} align="stretch">
          <Heading textAlign="center" color="#1E4460">
            Iniciar sesión
          </Heading>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4}>
              {/* Campo Email */}
              <Box minW="15rem">
                <HStack mb="0.5rem">
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

              {/* Campo Contraseña */}
              <Box minW="15rem">
                <HStack mb="0.5rem">
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

              <Button
                type="submit"
                bg="#1E4460"
                color="white"
                w="100%"
                transition="all 0.2s"
                mt="1rem"
                _hover={{
                  bg: "#285a7a",
                  transform: "translateY(-2px)",
                }}
              >
                Entrar
              </Button>
            </VStack>
          </form>
          <Text
            fontSize="sm"
            textAlign="center"
            color="#1E4460"
            fontWeight="bold"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
            onClick={() => navigate("/recover-password")}
          >
            ¿Olvidaste tu contraseña?
          </Text>
          <Text fontSize="sm" textAlign="center" color="gray.600">
            ¿Aún no tienes cuenta?{" "}
            <Text
              as="span"
              color="#1E4460"
              fontWeight="bold"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
              onClick={() => navigate("/register")}
            >
              Regístrate aquí
            </Text>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}