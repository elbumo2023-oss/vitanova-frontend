import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Input,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { FaPlus, FaTrash, FaEdit, FaUser, FaEnvelope, FaPhoneAlt, FaCity, FaGlobeAmericas, FaIdCard, FaHome } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import axios from "axios";
import SkeletonLoader from "../components/SkeletonLoader";
import useClients from "../hooks/useClients";
import type { Client } from "../types";
import { useNavigate } from "react-router-dom";

const REGISTER_URL = "/auth/register";

export default function ClientsAdmin() {
  const { getAll, update, remove } = useClients();
  const { data: clients, isLoading } = getAll();
  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    identification: "",
  });

  const openModal = (client: any | null = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name || "",
        lastname: client.lastname || "",
        email: client.user?.email || "",
        password: "",
        phone: client.phone || "",
        address: client.address || "",
        city: client.city || "",
        country: client.country || "",
        identification: client.identification || "",
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: "",
        lastname: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        identification: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSubmit = async () => {
    try {
      // Filtrar campos vacíos antes de enviar
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== "")
      );

      if (editingClient) {
        // Si editamos, sincronizamos el email con el username del User relacionado
        const updatedData = {
          ...filteredData,
          user: {
            ...editingClient.user,
            username: formData.email || editingClient.user?.username,
          },
        };

        await update.mutateAsync({ id: editingClient.id, ...updatedData });

        toast.success("Cliente actualizado correctamente", {
          position: "top-right",
          autoClose: 2500,
          theme: "colored",
        });
      } else {
        // Si es un nuevo cliente
        await axios.post(REGISTER_URL, filteredData);
        toast.success("Cliente registrado correctamente", {
          position: "top-right",
          autoClose: 2500,
          theme: "colored",
        });
      }

      closeModal();
      navigate("/admin");
    } catch (err) {
      toast.error("Error al guardar el cliente", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await remove.mutateAsync(id);
      toast.info("Cliente eliminado correctamente", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
      });
    } catch {
      toast.error("Error al eliminar cliente", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
      });
    }
  };

  return (
    <Box>
      {/* ENCABEZADO */}
      <HStack justify="space-between" mb={6} flexWrap="wrap">
        <Heading color="#1E4460" fontSize="2xl">
          <HStack>
            <Icon as={FaUser} />
            <Text>Gestión de Clientes</Text>
          </HStack>
        </Heading>
        <Button
          onClick={() => openModal()}
          bg="#1E4460"
          color="white"
          _hover={{ bg: "#244E61" }}
        >
          <HStack>
            <Icon as={FaPlus} />
            <Text>Nuevo cliente</Text>
          </HStack>
        </Button>
      </HStack>
      {isLoading ? (
        <SkeletonLoader lines={3} height="80px" />
      ) : (
        <VStack align="stretch" gap={4}>
          {clients && clients.length > 0 ? (
            clients.map((client: Client) => (
              <Box
                key={client.id}
                bg="white"
                p={4}
                borderRadius="lg"
                boxShadow="md"
                _hover={{ boxShadow: "xl", transform: "scale(1.01)" }}
                transition="all 0.2s ease"
              >
                <Flex
                  justify="space-between"
                  align="center"
                  direction={{ base: "column", md: "row" }}
                  gap={3}
                >
                  <VStack align="start" gap={1}>
                <HStack>
                    <Icon as={FaUser} color="#1E4460" />
                    <Text fontWeight="bold" color="#1E4460" fontSize="lg">
                    {client.name} {client.lastName}
                    </Text>
                </HStack>

                <HStack>
                    <Icon as={FaEnvelope} color="gray.600" />
                    <Text color="gray.600" fontSize="sm">
                    {client.email || "Sin correo"}
                    </Text>
                </HStack>

                <HStack>
                    <Icon as={FaPhoneAlt} color="gray.500" />
                    <Text color="gray.500" fontSize="sm">
                    {client.phone || "Sin teléfono registrado"}
                    </Text>
                </HStack>

                <HStack>
                    <Icon as={FaCity} color="gray.500" />
                    <Text color="gray.500" fontSize="sm">
                    {client.city || "Sin ciudad registrada"}
                    </Text>
                </HStack>

                <HStack>
                    <Icon as={FaGlobeAmericas} color="gray.500" />
                    <Text color="gray.500" fontSize="sm">
                    {client.country || "Sin país registrado"}
                    </Text>
                </HStack>

                <HStack>
                    <Icon as={FaIdCard} color="gray.500" />
                    <Text color="gray.500" fontSize="sm">
                    {client.identification || "Sin ID nacional"}
                    </Text>
                </HStack>

                <HStack align="start">
                    <Icon as={FaHome} color="gray.500" mt="3px" />
                    <Text color="gray.500" fontSize="sm">
                    {client.address || "Sin dirección registrada"}
                    </Text>
                </HStack>
                </VStack>

                  <HStack gap={3}>
                    <Button
                      size="sm"
                      variant="outline"
                      color="#1E4460"
                      borderColor="#1E4460"
                      _hover={{ bg: "#1E4460", color: "white" }}
                      onClick={() => openModal(client)}
                    >
                      <HStack gap={1}>
                        <Icon as={FaEdit} />
                        <Text>Editar</Text>
                      </HStack>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      color="red.500"
                      borderColor="red.500"
                      _hover={{ bg: "red.500", color: "white" }}
                      onClick={() => handleDelete(client.id)}
                    >
                      <HStack gap={1}>
                        <Icon as={FaTrash} />
                        <Text>Eliminar</Text>
                      </HStack>
                    </Button>
                  </HStack>
                </Flex>
              </Box>
            ))
          ) : (
            <Text color="gray.500" textAlign="center">
              No hay clientes registrados aún.
            </Text>
          )}
        </VStack>
      )}
      {isModalOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          bg="rgba(0,0,0,0.55)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={9999}
        >
          <Box
            bg="white"
            borderRadius="lg"
            boxShadow="2xl"
            w={{ base: "90%", md: "500px" }}
            p={6}
          >
            <Heading size="md" mb={4} color="#1E4460">
              {editingClient ? "Editar Cliente" : "Registrar Cliente"}
            </Heading>

            <VStack gap={4} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Input
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Apellido"
                  value={formData.lastname}
                  onChange={(e) =>
                    setFormData({ ...formData, lastname: e.target.value })
                  }
                />
              </SimpleGrid>

              <Input
                placeholder="Correo electrónico"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              {!editingClient && (
                <Input
                  placeholder="Contraseña"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              )}

              <Input
                placeholder="Teléfono"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <Input
                placeholder="Dirección"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Input
                  placeholder="Ciudad"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
                <Input
                  placeholder="País"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                />
              </SimpleGrid>
              <Input
                placeholder="Identificación"
                value={formData.identification}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    identification: e.target.value,
                  })
                }
              />
            </VStack>

            <Flex justify="flex-end" gap={3} mt={6} flexWrap="wrap">
              <Button
                variant="outline"
                borderColor="gray.400"
                color="gray.600"
                _hover={{ bg: "gray.100" }}
                onClick={closeModal}
              >
                Cancelar
              </Button>
              <Button
                bg="#1E4460"
                color="white"
                _hover={{ bg: "#244E61" }}
                onClick={handleSubmit}
              >
                {editingClient ? "Actualizar" : "Registrar"}
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Box>
  );
}