import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Image,
  Input,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { FaCogs, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import SkeletonLoader from "../components/SkeletonLoader";
import { useServices } from "../hooks/useService";
import type { Service } from "../types";

export default function ServicesAdmin() {
  const { getAll, create, update, remove } = useServices();
  const { data: services, isLoading } = getAll();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    imageUrl: "",
  });

  const openModal = (service: Service | null = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name || "",
        description: service.description || "",
        category: service.category || "",
        price: service.cost?.toString() || "",
        imageUrl: service.imageUrl || "",
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        imageUrl: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim() || !formData.description.trim()) {
        toast.warn("El nombre y la descripción son obligatorios", {
          position: "top-right",
          autoClose: 2500,
          theme: "colored",
        });
        return;
      }

      if (editingService) {
        await update.mutateAsync({
          id: editingService.id,
          data: {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            cost: Number(formData.price),
            imageUrl: formData.imageUrl || "",
          },
  });
        toast.success("Servicio actualizado correctamente", {
          position: "top-right",
          autoClose: 2500,
          theme: "colored",
        });
      } else {
        const fecha = new Date();
        await create.mutateAsync({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          cost: Number(formData.price),
          imageUrl: formData.imageUrl || "",
          serviceTime: fecha.toLocaleDateString()
        });
        toast.success("Servicio creado correctamente", {
          position: "top-right",
          autoClose: 2500,
          theme: "colored",
        });
      }

      closeModal();
    } catch (err) {
      toast.error("Error al guardar el servicio", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await remove.mutateAsync(id);
      toast.info("Servicio eliminado correctamente", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
      });
    } catch {
      toast.error("Error al eliminar servicio", {
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
            <Icon as={FaCogs} />
            <Text>Gestión de Servicios</Text>
          </HStack>
        </Heading>
        <Button onClick={() => openModal()} bg="#1E4460" color="white" _hover={{ bg: "#244E61" }}>
          <HStack>
            <Icon as={FaPlus} />
            <Text>Nuevo servicio</Text>
          </HStack>
        </Button>
      </HStack>

      {/* LISTADO */}
      {isLoading ? (
        <SkeletonLoader lines={3} height="80px" />
      ) : (
        <VStack align="stretch" gap={4}>
          {services && services.length > 0 ? (
            services.map((s: Service) => (
              <Box
                key={s.id}
                bg="white"
                p={4}
                borderRadius="lg"
                boxShadow="md"
                _hover={{ boxShadow: "xl", transform: "scale(1.01)" }}
                transition="all 0.2s ease"
              >
                <Flex justify="space-between" align="center" direction={{ base: "column", md: "row" }} gap={4}>
                  <HStack align="start" gap={4}>
                    <Image src={s.imageUrl} alt={s.name} boxSize="70px" borderRadius="md" objectFit="cover" />
                    <VStack align="start" gap={1}>
                      <Text fontWeight="bold" color="#1E4460" fontSize="lg">{s.name}</Text>
                      <Text color="gray.600" fontSize="sm">{s.category || "Servicios Biomedicos"}</Text>
                      <Text color="gray.500" fontSize="sm">{s.description}</Text>
                    </VStack>
                  </HStack>
                  <HStack gap={3}>
                    <Button
                      size="sm"
                      variant="outline"
                      color="#1E4460"
                      borderColor="#1E4460"
                      _hover={{ bg: "#1E4460", color: "white" }}
                      onClick={() => openModal(s)}
                    >
                      <HStack gap={1}><Icon as={FaEdit} /><Text>Editar</Text></HStack>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      color="red.500"
                      borderColor="red.500"
                      _hover={{ bg: "red.500", color: "white" }}
                      onClick={() => handleDelete(s.id)}
                    >
                      <HStack gap={1}><Icon as={FaTrash} /><Text>Eliminar</Text></HStack>
                    </Button>
                  </HStack>
                </Flex>
              </Box>
            ))
          ) : (
            <Text color="gray.500" textAlign="center">No hay servicios registrados aún.</Text>
          )}
        </VStack>
      )}

      {/* MODAL PERSONALIZADO */}
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
          <Box bg="white" borderRadius="lg" boxShadow="2xl" w={{ base: "90%", md: "500px" }} p={6}>
            <Heading size="md" mb={4} color="#1E4460">
              {editingService ? "Editar Servicio" : "Nuevo Servicio"}
            </Heading>

            <VStack gap={4} align="stretch">
              <Input placeholder="Nombre" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <Input placeholder="Descripción" value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <Input placeholder="Categoría" value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Input placeholder="Precio" type="number" value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                <Input placeholder="URL de imagen" value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
              </SimpleGrid>
            </VStack>

            <Flex justify="flex-end" gap={3} mt={6}>
              <Button variant="outline" borderColor="gray.400" color="gray.600" _hover={{ bg: "gray.100" }} onClick={closeModal}>
                Cancelar
              </Button>
              <Button bg="#1E4460" color="white" _hover={{ bg: "#244E61" }} onClick={handleSubmit}>
                {editingService ? "Actualizar" : "Registrar"}
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Box>
  );
}