import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  VStack,
  Field,
  FieldLabel,
  Text,
  HStack,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import useClients from "../hooks/useClients";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Update() {
  const { identification } = useAuth();
  const { getByIdentification, update } = useClients();
  const { data: client, isLoading, isError } = getByIdentification(identification || "");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    city: "",
    country: "",
  });

  // Cargar datos existentes
  useEffect(() => {
    if (client) {
      setFormData({
        phone: client.phone || "",
        address: client.address || "",
        city: client.city || "",
        country: client.country || "",
      });
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
  if (!client?.id) {
    toast.error("No se pudo determinar el ID del cliente.", {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
    });
    return;
  }

  // 🔹 Elimina campos vacíos (""), para no sobreescribir con nulls
  const cleanedData = Object.fromEntries(
    Object.entries(formData).filter(([_, v]) => v !== "")
  );

  try {
    await update.mutateAsync({
      id: client.id,
      ...cleanedData, // 👈 mandamos solo los campos llenos
    });

    toast.success("Perfil actualizado correctamente.", {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
    });
    navigate("/profile");
  } catch (error) {
    toast.error("No se pudo actualizar el perfil.", {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
    });
  }
};

  if (isLoading)
    return (
      <Box textAlign="center" mt="10">
        <Spinner size="xl" color="#1E4460" />
        <Text mt={3}>Cargando datos...</Text>
      </Box>
    );

  if (isError)
    return (
      <Text textAlign="center" mt="5" color="red.500">
        Error al cargar perfil
      </Text>
    );

  return (
    <Box bg="#daf5ee" minH="100vh" py="5rem">
      <Container maxW="lg" bg="white" boxShadow="xl" borderRadius="2xl" p="3rem">
        <VStack gap={6} align="stretch">
          <HStack justify="space-between" mb={2}>
            <Heading size="lg" color="#1E4460">
              Editar perfil
            </Heading>
            <Button
              variant="outline"
              borderColor="#1E4460"
              color="#1E4460"
              _hover={{ bg: "#1E4460", color: "white" }}
              onClick={() => navigate("/profile")}
            >
              Volver
            </Button>
          </HStack>

          <Field.Root>
            <FieldLabel>Teléfono</FieldLabel>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ej: +593984487490"
            />
          </Field.Root>

          <Field.Root>
            <FieldLabel>Dirección</FieldLabel>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ej: Urbanización San Felipe mz 127 s13"
            />
          </Field.Root>

          <Field.Root>
            <FieldLabel>Ciudad</FieldLabel>
            <Input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ej: Guayaquil"
            />
          </Field.Root>

          <Field.Root>
            <FieldLabel>País</FieldLabel>
            <Input
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Ej: Ecuador"
            />
          </Field.Root>

          <Button
            mt="1rem"
            color="white"
            bg="#1E4460"
            _hover={{ bg: "#285a7a" }}
            onClick={handleSave}
            loading={update.isPending}
          >
            Guardar cambios
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}