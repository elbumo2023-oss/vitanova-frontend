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
import { useServices } from "../hooks/useService";
import { useNavigate } from "react-router-dom";
import type { Service } from "../types";

function Services() {
  const { getAll } = useServices();
  const { data: services, isLoading } = getAll();
  const navigate = useNavigate();

  return (
    <Box bg="#F9FCFF" minH="100vh" py="4rem">
      <Container maxW="7xl">
        {/* Encabezado */}
        <VStack gap={6} mb="3rem">
          <Heading color="#1E4460" textAlign="center">
            Nuestros Servicios Biomédicos
          </Heading>
          <Text color="gray.600" maxW="3xl" textAlign="center">
            En VITANOVA ofrecemos soluciones integrales para hospitales y
            clínicas que buscan eficiencia, seguridad y tecnología de punta.
            Cada servicio combina conocimiento técnico con una atención humana
            y cercana.
          </Text>
        </VStack>

        {/* Skeleton Loader */}
        {isLoading ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="2.5rem">
            {[1, 2, 3, 4].map((i) => (
              <Stack
                key={i}
                shadow="md"
                borderRadius="xl"
                p="1rem"
                bg="white"
                gap={4}
              >
                <Skeleton height="220px" borderRadius="lg" />
                <Skeleton height="25px" width="70%" />
                <SkeletonText noOfLines={3} gap="3" />
                <Skeleton height="40px" width="50%" borderRadius="md" mx="auto" />
              </Stack>
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="2.5rem">
            {services?.map((service: Service) => (
              <Card.Root
                key={service.id}
                bg="white"
                shadow="md"
                borderRadius="xl"
                overflow="hidden"
                _hover={{ shadow: "xl", transform: "scale(1.02)" }}
                transition="all 0.3s"
              >
                <Image
                  src={service.imageUrl}
                  alt={service.name}
                  objectFit="cover"
                  h="220px"
                  w="100%"
                />
                <CardHeader>
                  <Heading size="md" color="#1E4460">
                    {service.name}
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Text color="gray.700" mb={3}>
                    {service.description}
                  </Text>
                  <Text color="gray.600" fontWeight="medium">
                    Fecha de servicio:{" "}
                    <Text as="span" color="gray.700">
                      Con fecha programable a su disposición ⏱️
                    </Text>
                  </Text>
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
                      Solicitar cotización
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

export default Services;