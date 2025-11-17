import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Image,
  VStack,
  Card,
  CardBody,
  CardHeader,
  Container,
  Skeleton,
  SkeletonText,
  Stack,
} from "@chakra-ui/react";
import useProducts from "../hooks/useProducts";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types";

function Products() {
  const { getAll } = useProducts();
  const { data: products, isLoading } = getAll();
  const navigate = useNavigate();

  return (
    <Box bg="#F9FCFF" minH="100vh" py="4rem">
      <Container maxW="7xl">
        <VStack gap={6} mb="3rem">
          <Heading color="#1E4460" textAlign="center">
            Catálogo de Productos
          </Heading>
          <Text color="gray.600" maxW="3xl" textAlign="center">
            Equipos y soluciones seleccionadas por su calidad, precisión y
            respaldo técnico. Cada producto está pensado para fortalecer la
            confianza y eficiencia de tu institución médica.
          </Text>
        </VStack>

        {isLoading ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="2.5rem">
            {[1, 2].map((i) => (
              <Stack
                key={i}
                shadow="md"
                borderRadius="xl"
                p="1rem"
                bg="white"
                gap={4}
              >
                <Skeleton height="260px" borderRadius="lg" />
                <Skeleton height="25px" width="70%" />
                <SkeletonText noOfLines={3} gap="3" />
                <Skeleton height="40px" width="50%" borderRadius="md" mx="auto" />
              </Stack>
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="2.5rem">
            {products?.map((product: Product) => (
              <Card.Root
                key={product.id}
                bg="white"
                shadow="md"
                borderRadius="xl"
                overflow="hidden"
                _hover={{ shadow: "xl", transform: "scale(1.02)" }}
                transition="all 0.3s"
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  objectFit="cover"
                  h="260px"
                  w="100%"
                />
                <CardHeader>
                  <Heading size="md" color="#1E4460">
                    {product.name}
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Text color="gray.700" mb={3}>
                    {product.description}
                  </Text>

                  {product.brand && (
                    <Text color="gray.600" fontWeight="medium">
                      Marca: {product.brand}
                    </Text>
                  )}
                  {product.category && (
                    <Text color="gray.600" fontWeight="medium">
                      Categoría: {product.category}
                    </Text>
                  )}
                  <Box textAlign="center" mt="1.5rem">
                    <Box
                      as="button"
                      bg="#1E4460"
                      color="white"
                      px="1.5rem"
                      py="0.6rem"
                      borderRadius="md"
                      fontWeight="medium"
                      _hover={{ bg: "#244E61" }}
                      onClick={() => navigate("/quote")}
                    >
                      Hablar con un asesor técnico
                    </Box>
                  </Box>
                </CardBody>
              </Card.Root>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}

export default Products;