import { Box, Button, VStack, Heading, Text, Input, HStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaLock } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type PasswordForm = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const BASE_URL = "/api/user/change-password";


export default function ChangePassword() {
  const { register, handleSubmit, reset } = useForm<PasswordForm>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Las contraseñas nuevas no coinciden.", { theme: "colored" });
      return;
    }

    try {
      await axios.post(BASE_URL, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Contraseña actualizada correctamente.", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
      });

      reset();
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al cambiar la contraseña.";
      toast.error(msg, { theme: "colored" });
    }
  };

  return (
    <Box bg="#F9FCFF" minH="100vh" display="flex" justifyContent="center" alignItems="center" py="6rem">
      <Box
        bg="white"
        p="3.5rem"
        borderRadius="1rem"
        boxShadow="xl"
        w={{ base: "92%", md: "440px" }}
        transition="all 0.3s ease"
        _hover={{ transform: "scale(1.02)", boxShadow: "2xl" }}
      >
        <VStack gap={"2rem"} align="stretch">
          <Heading textAlign="center" color="#1E4460">
            Cambiar contraseña
          </Heading>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4}>
              {[
                { name: "oldPassword", label: "Contraseña actual" },
                { name: "newPassword", label: "Nueva contraseña" },
                { name: "confirmPassword", label: "Confirmar nueva contraseña" },
              ].map((field) => (
                <Box key={field.name} minW="15rem">
                  <HStack mb="0.5rem">
                    <FaLock color="#1E4460" />
                    <Text color="gray.700" fontWeight="semibold">
                      {field.label}
                    </Text>
                  </HStack>
                  <Input
                    type="password"
                    placeholder="********"
                    {...register(field.name as keyof PasswordForm, { required: true })}
                  />
                </Box>
              ))}

              <Button
                type="submit"
                bg="#1E4460"
                color="white"
                w="100%"
                mt="1rem"
                transition="all 0.2s"
                _hover={{ bg: "#285a7a", transform: "translateY(-2px)" }}
              >
                Guardar nueva contraseña
              </Button>

              <Text
                fontSize="sm"
                textAlign="center"
                color="gray.600"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
                onClick={() => navigate("/profile")}
              >
                Volver al perfil
              </Text>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  );
}