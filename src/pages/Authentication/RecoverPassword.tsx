import { Box, Button, VStack, Heading, Text, Input, HStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type RecoverForm = {
  email: string;
};

const BASE_URL = "/auth/recover-password";

export default function RecoverPassword() {
  const { register, handleSubmit, reset } = useForm<RecoverForm>();
  const navigate = useNavigate();

  const onSubmit = async (data: RecoverForm) => {
    try {
      const res = await axios.post(BASE_URL, data);
      toast.success(res.data.message || "Se envió una nueva contraseña temporal a tu correo.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      reset();
      setTimeout(() => navigate("/login"), 2500);
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Error al enviar el correo. Intenta nuevamente.";
      toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
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
            Recuperar contraseña
          </Heading>

          <Text textAlign="center" color="gray.600">
            Ingresa el correo con el que te registraste. Te enviaremos una nueva contraseña temporal.
          </Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4}>
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

              <Button
                type="submit"
                bg="#1E4460"
                color="white"
                w="100%"
                mt="1rem"
                transition="all 0.2s"
                _hover={{
                  bg: "#285a7a",
                  transform: "translateY(-2px)",
                }}
              >
                Enviar contraseña temporal
              </Button>

              <Text
                fontSize="sm"
                textAlign="center"
                color="gray.600"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
                onClick={() => navigate("/login")}
              >
                Volver al inicio de sesión
              </Text>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  );
}