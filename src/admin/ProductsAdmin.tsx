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
import { FaBoxOpen, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import SkeletonLoader from "../components/SkeletonLoader";
import useProducts from "../hooks/useProducts";
import type { Product } from "../types";

export default function ProductsAdmin() {
  const { getAll, create, update, remove } = useProducts();
  const { data: products, isLoading } = getAll();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
  });

  const openModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || "",
        brand: product.brand || "",
        category: product.category || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "",
        description: product.description || "",
        imageUrl: product.imageUrl || "",
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        brand: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        imageUrl: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async () => {
    try {
      // Filtrar campos vacíos
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== "")
      );

      if (editingProduct) {
        await update.mutateAsync({
          id: editingProduct.id,
          data: {
            ...filteredData,
            price: Number(formData.price),
            stock: Number(formData.stock),
          },
        });
        toast.success("Producto actualizado correctamente", {
          position: "top-right",
          autoClose: 2500,
          theme: "colored",
        });
      } else {
        await create.mutateAsync({
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        imageUrl: formData.imageUrl || "",
      });
        toast.success("Producto creado correctamente", {
          position: "top-right",
          autoClose: 2500,
          theme: "colored",
        });
      }

      closeModal();
    } catch (err) {
      toast.error("Error al guardar el producto", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await remove.mutateAsync(id);
      toast.info("Producto eliminado correctamente", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
      });
    } catch {
      toast.error("Error al eliminar producto", {
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
            <Icon as={FaBoxOpen} />
            <Text>Gestión de Productos</Text>
          </HStack>
        </Heading>
        <Button onClick={() => openModal()} bg="#1E4460" color="white" _hover={{ bg: "#244E61" }}>
          <HStack>
            <Icon as={FaPlus} />
            <Text>Nuevo producto</Text>
          </HStack>
        </Button>
      </HStack>

      {/* LISTADO */}
      {isLoading ? (
        <SkeletonLoader lines={3} height="80px" />
      ) : (
        <VStack align="stretch" gap={4}>
          {products && products.length > 0 ? (
            products.map((p: Product) => (
              <Box
                key={p.id}
                bg="white"
                p={4}
                borderRadius="lg"
                boxShadow="md"
                _hover={{ boxShadow: "xl", transform: "scale(1.01)" }}
                transition="all 0.2s ease"
              >
                <Flex justify="space-between" align="center" direction={{ base: "column", md: "row" }} gap={4}>
                  <HStack align="start" gap={4}>
                    <Image src={p.imageUrl} alt={p.name} boxSize="70px" borderRadius="md" objectFit="cover" />
                    <VStack align="start" gap={1}>
                      <Text fontWeight="bold" color="#1E4460" fontSize="lg">{p.name}</Text>
                      <Text color="gray.600" fontSize="sm">{p.category}</Text>
                      <Text color="gray.500" fontSize="sm">{p.brand}</Text>
                      <Text color="gray.500" fontSize="sm">${p.price?.toFixed(2)}</Text>
                    </VStack>
                  </HStack>
                  <HStack gap={3}>
                    <Button
                      size="sm"
                      variant="outline"
                      color="#1E4460"
                      borderColor="#1E4460"
                      _hover={{ bg: "#1E4460", color: "white" }}
                      onClick={() => openModal(p)}
                    >
                      <HStack gap={1}><Icon as={FaEdit} /><Text>Editar</Text></HStack>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      color="red.500"
                      borderColor="red.500"
                      _hover={{ bg: "red.500", color: "white" }}
                      onClick={() => handleDelete(p.id)}
                    >
                      <HStack gap={1}><Icon as={FaTrash} /><Text>Eliminar</Text></HStack>
                    </Button>
                  </HStack>
                </Flex>
              </Box>
            ))
          ) : (
            <Text color="gray.500" textAlign="center">No hay productos registrados aún.</Text>
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
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </Heading>

            <VStack gap={4} align="stretch">
              <Input placeholder="Nombre" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <Input placeholder="Marca" value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
              <Input placeholder="Categoría" value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Input placeholder="Precio" type="number" value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                <Input placeholder="Stock" type="number" value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
              </SimpleGrid>
              <Input placeholder="Descripción" value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <Input placeholder="URL de imagen" value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
            </VStack>

            <Flex justify="flex-end" gap={3} mt={6}>
              <Button variant="outline" borderColor="gray.400" color="gray.600" _hover={{ bg: "gray.100" }} onClick={closeModal}>
                Cancelar
              </Button>
              <Button bg="#1E4460" color="white" _hover={{ bg: "#244E61" }} onClick={handleSubmit}>
                {editingProduct ? "Actualizar" : "Registrar"}
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Box>
  );
}