import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Flex,
  List,
  ListItem,
} from "@chakra-ui/react";
import { FaFileInvoice, FaTrash, FaSave, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SkeletonLoader from "../components/SkeletonLoader";
import useQuotes from "../hooks/useQuotes";
import type { Quote } from "../types";
import { useState } from "react";

export default function QuotesAdmin() {
  const { getAll, update, remove } = useQuotes();
  const { data: quotes, isLoading, refetch } = getAll();

  const [statusChanges, setStatusChanges] = useState<Record<number, string>>({});
  const [openClient, setOpenClient] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await remove.mutateAsync(id);
      toast.info("Cotización eliminada correctamente", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
      });
      refetch();
    } catch {
      toast.error("Error al eliminar cotización", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
      });
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setStatusChanges((prev) => ({ ...prev, [id]: newStatus }));
  };

  const handleSaveStatus = async (quote: Quote) => {
    const newStatus = statusChanges[quote.id];
    if (!newStatus || newStatus === quote.status) {
      toast.warning("No hay cambios que guardar", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    try {
      const updatedQuote: Quote = { ...quote, status: newStatus };
      await update.mutateAsync(updatedQuote);
      toast.success("Estado actualizado correctamente", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
      });
      refetch();
    } catch {
      toast.error("Error al actualizar estado", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
      });
    }
  };

  // Agrupar cotizaciones por cliente (A-Z)
  const groupedQuotes = quotes
    ? quotes.reduce((groups: Record<string, Quote[]>, quote:Quote) => {
        const clientName = quote.client?.name || "Sin nombre";
        if (!groups[clientName]) groups[clientName] = [];
        groups[clientName].push(quote);
        return groups;
      }, {})
    : {};

  const sortedClients = Object.keys(groupedQuotes).sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <Box>
      {/* ENCABEZADO */}
      <HStack justify="space-between" mb={6} flexWrap="wrap">
        <Heading color="#1E4460" fontSize="2xl">
          <HStack>
            <Icon as={FaFileInvoice} />
            <Text>Gestión de Cotizaciones</Text>
          </HStack>
        </Heading>
      </HStack>
      

      {/* LISTADO */}
      {isLoading ? (
        <SkeletonLoader lines={3} height="80px" />
      ) : (
        <VStack align="stretch" gap={8}>
          {sortedClients.length > 0 ? (
            sortedClients.map((clientName) => {
              const isOpen = openClient === clientName;

              return (
                <Box key={clientName}>
                  {/* Encabezado cliente */}
                    <Flex
                    justify="space-between"
                    align="center"
                    bg="#F0F6FA"
                    p={3}
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => setOpenClient(isOpen ? null : clientName)}
                    _hover={{ bg: "#E4EFF6" }}
                    >
                    <Box>
                        <Text fontWeight="semibold" color="#1E4460" fontSize="lg">
                        Cliente: {groupedQuotes[clientName][0].client?.name}{" "}
                        {groupedQuotes[clientName][0].client?.lastName}
                        </Text>

                        <Text color="gray.600" fontSize="sm">
                        País: {groupedQuotes[clientName][0].client?.country ?? "No especificado"}
                        </Text>

                        <Text color="gray.600" fontSize="sm">
                        Identificación:{" "}
                        {groupedQuotes[clientName][0].client?.identification ?? "N/A"}
                        </Text>
                    </Box>

                    <Icon
                        as={isOpen ? FaChevronUp : FaChevronDown}
                        color="#1E4460"
                        boxSize={4}
                    />
                    </Flex>
                  {/* Cotizaciones del cliente */}
                  {isOpen && (
                    <VStack align="stretch" gap={4} mt={4}>
                      {groupedQuotes[clientName].map((quote: Quote) => (
                        <Box
                          key={quote.id}
                          bg="white"
                          p={4}
                          borderRadius="lg"
                          boxShadow="md"
                          _hover={{
                            boxShadow: "xl",
                            transform: "scale(1.01)",
                          }}
                          transition="all 0.2s ease"
                        >
                          <Flex
                            justify="space-between"
                            align="center"
                            direction={{ base: "column", md: "row" }}
                            gap={3}
                          >
                            <VStack align="start" gap={2}>
                              <HStack>
                                <Icon as={FaFileInvoice} color="#1E4460" />
                                <Text
                                  fontWeight="bold"
                                  color="#1E4460"
                                  fontSize="lg"
                                >
                                  Cotización #{quote.id}
                                </Text>
                              </HStack>

                              <Text color="gray.500" fontSize="sm">
                                Fecha:{" "}
                                {new Date(
                                  quote.date
                                ).toLocaleDateString("es-EC")}
                              </Text>

                              {/* CAMBIO DE ESTADO */}
                              <HStack align="center" gap={2}>
                                <Text color="gray.600" fontSize="sm">
                                  Estado:
                                </Text>

                                <select
                                  value={
                                    statusChanges[quote.id] || quote.status
                                  }
                                  onChange={(e) =>
                                    handleStatusChange(
                                      quote.id,
                                      e.target.value
                                    )
                                  }
                                  style={{
                                    border: "1px solid #1E4460",
                                    borderRadius: "6px",
                                    padding: "4px 8px",
                                    fontSize: "0.9rem",
                                    width: "150px",
                                    color: "#1E4460",
                                    backgroundColor: "white",
                                    cursor: "pointer",
                                  }}
                                >
                                  <option value="Pendiente">Pendiente</option>
                                  <option value="Pagada">Pagada</option>
                                  <option value="Cancelada">Cancelada</option>
                                </select>

                                <Button
                                  size="xs"
                                  color="white"
                                  bg="#1E4460"
                                  _hover={{ bg: "#244E61" }}
                                  onClick={() => handleSaveStatus(quote)}
                                >
                                  <HStack gap={1}>
                                    <Icon as={FaSave} color="white" />
                                    <Text fontSize="sm">Guardar</Text>
                                  </HStack>
                                </Button>
                              </HStack>

                              {/* PRODUCTOS */}
                              {quote.products?.length > 0 && (
                                <Box>
                                  <Text color="#1E4460" fontWeight="semibold">
                                    Productos:
                                  </Text>
                                  <List.Root
                                    gap={1}
                                    color="gray.600"
                                    fontSize="sm"
                                    ml={4}
                                  >
                                    {quote.products.map((p) => (
                                      <ListItem key={p.id}>
                                        • {p.name}
                                      </ListItem>
                                    ))}
                                  </List.Root>
                                </Box>
                              )}

                              {/* SERVICIOS */}
                              {quote.services?.length > 0 && (
                                <Box>
                                  <Text color="#1E4460" fontWeight="semibold">
                                    Servicios:
                                  </Text>
                                  <List.Root
                                    gap={1}
                                    color="gray.600"
                                    fontSize="sm"
                                    ml={4}
                                  >
                                    {quote.services.map((s) => (
                                      <ListItem key={s.id}>
                                        • {s.name}
                                      </ListItem>
                                    ))}
                                  </List.Root>
                                </Box>
                              )}
                            </VStack>

                            {/* BOTÓN ELIMINAR */}
                            <Button
                              size="sm"
                              variant="outline"
                              color="red.500"
                              borderColor="red.500"
                              _hover={{ bg: "red.500", color: "white" }}
                              onClick={() => handleDelete(quote.id)}
                            >
                              <HStack gap={1}>
                                <Icon as={FaTrash} />
                                <Text>Eliminar</Text>
                              </HStack>
                            </Button>
                          </Flex>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </Box>
              );
            })
          ) : (
            <Text color="gray.500" textAlign="center">
              No hay cotizaciones registradas aún.
            </Text>
          )}
        </VStack>
      )}
    </Box>
  );
}