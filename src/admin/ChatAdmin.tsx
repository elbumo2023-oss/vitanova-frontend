import { useEffect, useState, useRef } from "react";
import {
  Box,
  Flex,
  Input,
  VStack,
  Text,
  Spinner,
  Button,
  Avatar,
  HStack,
} from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import useClients from "../hooks/useClients";
import type { Client, Message, Quote } from "../types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



export default function AdminChat() {
   const { token } = useAuth();
  const navigate = useNavigate();

  const adminId = 1;

  const { getAll } = useClients();
  const { data: clients, isLoading: clientsLoading } = getAll();

  const [selectedClient, setSelectedClient] = useState<Client>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const lastSeen = useRef<string | null>(null);

  const [quoteSummary] = useState<Quote>(() => {
    const q = localStorage.getItem("quoteSummary");
    return q ? JSON.parse(q) : null;
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!selectedClient) return;
    loadHistory(selectedClient.user.id, false);
  }, [selectedClient]);

  useEffect(() => {
    if (!selectedClient) return;

    const interval = setInterval(() => {
      loadHistory(selectedClient.user.id, true);
    }, 1500);

    return () => clearInterval(interval);
  }, [selectedClient]);

  const globalLastSeen = useRef<Record<number, string>>({});

useEffect(() => {
  if (!clients) return;

  const interval = setInterval(async () => {
    for (const client of clients) {
      const clientId = client.user.id;

      // Skip admin
      if (clientId === adminId) continue;

      // Obtener último mensaje de ese chat
      try {
        const res = await axios.get<Message[]>(
          `/api/messages/${clientId}/${adminId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const msgs = res.data;
        if (msgs.length === 0) continue;

        const lastMsg = msgs[msgs.length - 1];

        // Si este último mensaje ya fue visto → ignorar
        if (globalLastSeen.current[clientId] === lastMsg.localDateTime) continue;

        // Actualizar registro
        globalLastSeen.current[clientId] = lastMsg.localDateTime;

        // Si el mensaje es del CLIENTE → notificar
        if (lastMsg.sender.id !== adminId) {
          toast.info(
            `${client.name} ${client.lastName} (${client.identification}) ha enviado un mensaje`,
            { autoClose: 3000 }
          );

          new Audio("/notify.mp3").play();
        }

      } catch (error) {
        console.log("Error revisando mensajes globales:", error);
      }
    }
  }, 1300); // velocidad optimizada

  return () => clearInterval(interval);
}, [clients]);

  const loadHistory = async (clientId: number, checkNotification = true) => {
    const res = await axios.get<Message[]>(
      `/api/messages/${clientId}/${adminId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const newMessages = res.data;

    if (newMessages.length === 0) {
      setMessages([]);
      return;
    }

    const lastMsg = newMessages[newMessages.length - 1];

    if (checkNotification) {
      if (lastSeen.current !== lastMsg.localDateTime) {
        lastSeen.current = lastMsg.localDateTime;

        if (lastMsg.sender.id !== adminId) {
          toast.info("Nuevo mensaje del cliente");
          new Audio("/notify.mp3").play();
        }
      }
    }

    setMessages(newMessages);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedClient) return;

    const msg: Message = {
      content: input,
      localDateTime: new Date().toISOString(),
      sender: { id: adminId } as any,
      receiver: { id: selectedClient.user.id } as any,
    };

    await axios.post(
      "/api/messages",
      msg,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setInput("");
    loadHistory(selectedClient.user.id, false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (clientsLoading)
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="#1E4460" />
      </Flex>
    );

  return (
    <Flex h="85vh" mt="1rem" rounded="lg" overflow="hidden" bg="#F1F7FA" shadow="md">
      {/*Panel de clientes de mi padre*/}
      <Box w="30%" bg="#1E4460" color="white" p="1rem" overflowY="auto">
        <Text fontSize="xl" fontWeight="bold" mb="1rem" textAlign="center">
          Chats de Clientes
        </Text>

        <VStack align="stretch" gap={3}>
          {clients?.filter((c: Client) => c.user.id !== adminId)  
          .map((client: Client) => (
            <Box
              key={client.id}
              p="0.9rem"
              rounded="lg"
              bg={selectedClient?.id === client.id ? "#163549" : "#244E61"}
              _hover={{ bg: "#163549", cursor: "pointer" }}
              onClick={() => setSelectedClient(client)}
            >
              <HStack>
                <Avatar.Root size="sm">
                <Avatar.Image
                src="https://storage.googleapis.com/imagenes-biomedicas-sistema/user.png"
                alt="Foto de perfil"
                boxSize={{ base: "0.25rem", md: "0.35rem" }}
                borderRadius="full"
                p={"0.5rem"}
                shadow="lg"
                mb="0.5rem"
                />
                <Avatar.Fallback name={`${client.name}`}/>                  
                </Avatar.Root>
                <Box>
                  <Text fontWeight="semibold">
                    {client.name} {client.lastName}
                  </Text>
                  <Text fontSize="xs" opacity={0.8}>
                    {client.identification}
                  </Text>
                  <Text fontSize="xs" opacity={0.8}>
                    {client.country}
                  </Text>
                </Box>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>

      <Flex direction="column" w="70%" bg="white">
        {!selectedClient ? (
          <Flex justify="center" align="center" flex="1" color="gray.500">
            Selecciona un cliente para ver el chat
          </Flex>
        ) : (
          <>
            {/* HEADER CLIENTE */}
            <Flex p="1rem" bg="#E8F3F8" shadow="sm" align="center" gapX={2}>
              <Avatar.Root size="md">
                <Avatar.Fallback  gapX={3} name={selectedClient.name} mr="1rem" />
                </Avatar.Root> 
              <Box>
                <Text fontSize="lg" fontWeight="bold" color="#1E4460">
                  {selectedClient.name} {selectedClient.lastName}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {selectedClient.identification}{"          "}
                  {selectedClient.city} {" "}{selectedClient.country}
                </Text>
              </Box>
            </Flex>

            {quoteSummary && (
              <Box
                bg="#F0F6FA"
                p="1rem"
                m="1rem"
                rounded="lg"
                shadow="sm"
                borderLeft="4px solid #1E4460"
                _hover={{ bg: "#E4EFF6", cursor: "pointer" }}
                onClick={() => navigate("/admin/quotes")}
              >
                <Text color="#1E4460" fontWeight="bold">
                  📄 Resumen de cotización (clic para ver)
                </Text>
                <Text fontSize="sm">Productos: {quoteSummary.products?.length ?? 0}</Text>
                <Text fontSize="sm">Servicios: {quoteSummary.services?.length ?? 0}</Text>
                <Text fontSize="sm">Fecha: {quoteSummary.date}</Text>
              </Box>
            )}

            {/* HISTORIAL */}
            <VStack
              flex="1"
              overflowY="auto"
              p="1rem"
              gap={4}
              align="stretch"
            >
              {messages.map((msg, i) => {
                const isAdmin = msg.sender.id === adminId;

                return (
                  <Flex
                    key={i}
                    justify={isAdmin ? "flex-end" : "flex-start"}
                  >
                    <Box
                      bg={isAdmin ? "#1E4460" : "gray.200"}
                      color={isAdmin ? "white" : "black"}
                      px="4"
                      py="3"
                      borderRadius="20px"
                      maxW="70%"
                      shadow="md"
                    >
                      <Text>{msg.content}</Text>
                      <Text fontSize="xs" opacity={0.7} mt={1} textAlign="right">
                        {new Date(msg.localDateTime).toLocaleTimeString("es-EC", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </Box>
                  </Flex>
                );
              })}

              <div ref={bottomRef}></div>
            </VStack>

            {/* INPUT */}
            <Flex p="1rem" align="center" gap={2}>
              <Input
                placeholder="Escribe un mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                bg="white"
                borderRadius="full"
                px="1.5rem"
                py="1.2rem"
                shadow="md"
              />
              <Button
                colorScheme="teal"
                borderRadius="full"
                px="4"
                h="3rem"
                onClick={sendMessage}
                shadow="md"
              >
                <FaPaperPlane />
              </Button>
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
}