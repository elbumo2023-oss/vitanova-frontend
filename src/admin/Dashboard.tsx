import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Icon,
} from "@chakra-ui/react";
import {
  FaUsers,
  FaBox,
  FaServicestack,
  FaFileInvoice,
  FaComments,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import SkeletonLoader from "../components/SkeletonLoader";
import useClients from "../hooks/useClients";
import useProducts from "../hooks/useProducts";
import { useServices } from "../hooks/useService";
import useQuotes from "../hooks/useQuotes";

function Dashboard() {
  const { getAll: getClients } = useClients();
  const { data: clientsData, isLoading: loadingClients } = getClients();

  const { getAll: getProducts } = useProducts();
  const { data: productsData, isLoading: loadingProducts } = getProducts();

  const { getAll: getServices } = useServices();
  const { data: servicesData, isLoading: loadingServices } = getServices();

  const { getAll: getQuotes } = useQuotes();
  const { data: quotesData, isLoading: loadingQuotes } = getQuotes();

  const loading =
    loadingClients || loadingProducts || loadingServices || loadingQuotes;

  const stats = [
    {
      title: "Clientes",
      value: clientsData?.length ?? 0,
      icon: FaUsers,
      color: "#2B6CB0",
      desc: "Clientes registrados en el sistema",
    },
    {
      title: "Productos",
      value: productsData?.length ?? 0,
      icon: FaBox,
      color: "#00A3C4",
      desc: "Productos activos en la base de datos",
    },
    {
      title: "Servicios",
      value: servicesData?.length ?? 0,
      icon: FaServicestack,
      color: "#38A169",
      desc: "Servicios ofrecidos por VITANOVA",
    },
    {
      title: "Cotizaciones",
      value: quotesData?.length ?? 0,
      icon: FaFileInvoice,
      color: "#DD6B20",
      desc: "Cotizaciones registradas",
    },
    {
      title: "Chats activos",
      value: 3, // temporal, luego puedes conectar useMessages()
      icon: FaComments,
      color: "#805AD5",
      desc: "Conversaciones recientes con clientes",
    },
  ];

  return (
    <Box>
      {/* ENCABEZADO */}
      <Box mb={10} textAlign="center">
        <Heading color="#1E4460" mb={3}>
          Panel Administrativo
        </Heading>
        <br/>
        <Text fontSize="lg" color="gray.600">
          Bienvenido al panel de gestión de{" "}
          <Text as="span" color="#1E4460" fontWeight="bold">
            VITANOVA
          </Text>
          . Aquí puedes visualizar métricas en tiempo real de tu plataforma.
        </Text>
      </Box>

      {/* MÉTRICAS */}
      {loading ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={8}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonLoader key={i} />
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={8}>
          {stats.map((stat) => (
            <Card.Root
              key={stat.title}
              bg="white"
              boxShadow="xl"
              borderRadius="2xl"
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "2xl",
              }}
              transition="all 0.3s ease"
            >
              <CardHeader pb={0}>
                <Flex justify="space-between" align="center">
                  <Heading size="md" color="#1E4460">
                    {stat.title}
                  </Heading>
                  <Icon as={stat.icon} boxSize={7} color={stat.color} />
                </Flex>
              </CardHeader>
              <CardBody>
                <Text fontSize="3xl" fontWeight="bold" color={stat.color}>
                  {stat.value}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {stat.desc}
                </Text>
              </CardBody>
            </Card.Root>
          ))}
        </SimpleGrid>
      )}

      {/* SECCIÓN INFORMATIVA */}
      {!loading && (
        <Box
          mt={16}
          textAlign="center"
          bg="#F9FCFF"
          py={10}
          borderRadius="2xl"
          boxShadow="md"
        >
          <Heading size="md" color="#1E4460" mb={3}>
            “Soluciones Biomédicas con Propósito”
          </Heading>
          <Text maxW="3xl" mx="auto" color="gray.600" fontSize="md">
            En VITANOVA trabajamos cada día para ofrecer soluciones técnicas confiables
            en ingeniería biomédica, mantenimiento hospitalario y consultoría
            estratégica. Este panel te permite monitorear y administrar cada aspecto del
            sistema con precisión y eficiencia.
          </Text>
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;