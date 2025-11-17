import { useEffect, useState, useRef } from "react";
import {
  Box,
  Flex,
  Input,
  VStack,
  Spinner,
  Heading,
  Text,
  Button,
} from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import useClients from "../hooks/useClients";
import type { Message } from "../types";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";



export default function Chat() {

  const { token, identification } = useAuth();
  const { getByIdentification } = useClients();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);

  const adminId = 1;

  const { data: clientData, isLoading } = getByIdentification(identification!);
  const userId = clientData?.user?.id ?? null;

  const lastSeen = useRef<string | null>(null);

  // Proteger el chat
  useEffect(() => {
    if (!token) {
      toast.dismiss();
      toast.error("Debes iniciar sesión para acceder al chat");
      navigate("/login");
    }
  }, [token, navigate]);

  // Cargar historial
  useEffect(() => {
    if (isLoading || !userId) return;
    loadHistory(false);
  }, [userId]);

  // Polling
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      loadHistory(true);
    }, 1300);

    return () => clearInterval(interval);
  }, [userId]);

  const sendWelcomeMessage = async () => {
    const welcomeMsg: Message = {
      content:
        "Hola, gracias por contactarnos. Estamos aquí para acompañarle en su proyecto biomédico 😊",
      localDateTime: new Date().toISOString(),
      sender: { id: adminId } as any,
      receiver: { id: userId } as any,
    };

    await axios.post(
      "/api/messages",
      welcomeMsg,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await loadHistory(false);
  };

  const loadHistory = async (checkNotification = true) => {
    if (!userId) return;

    const res = await axios.get<Message[]>(
      `/api/messages/${userId}/${adminId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const newMessages = res.data;

    // 1. Bienvenida
    if (newMessages.length === 0) {
      await sendWelcomeMessage();
      return;
    }

    const lastMsg = newMessages[newMessages.length - 1];

    // 2. Notificación
    if (checkNotification) {
      if (lastSeen.current !== lastMsg.localDateTime) {
        lastSeen.current = lastMsg.localDateTime;

        if (lastMsg.sender.id === adminId) {
          toast.info("Nuevo mensaje del asesor");
          new Audio("/notify.mp3").play();
        }
      }
    }

    setMessages(newMessages);
  };

  const sendMessage = async () => {
    if (!input.trim() || !userId) return;

    const msg: Message = {
      content: input,
      localDateTime: new Date().toISOString(),
      sender: { id: userId } as any,
      receiver: { id: adminId } as any,
    };

    await axios.post(
      "/api/messages",
      msg,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setInput("");
    loadHistory(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isLoading || !userId)
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="#1E4460" />
      </Flex>
    );

    return (
    <Box position="relative" zIndex="1">
      <Box
        minH="calc(100vh - 80px)"
        py="3rem"
        bgImage="url('https://storage.googleapis.com/imagenes-biomedicas-sistema/messageUserBackground.jpg')"
        bgSize="cover"
        bgPos="center"
        bgAttachment="fixed"
        position="relative"
      >
        {/* Overlay */}
        <Box
          position="absolute"
          inset="0"
          bg="whiteAlpha.700"
          backdropFilter="blur(4px)"
        />

        <Box position="relative">
          <Heading
            size="lg"
            textAlign="center"
            mb="2rem"
            color="#1E4460"
            textShadow="0 1px 2px rgba(0,0,0,0.3)"
          >
            Estamos aquí para acompañarle en su proyecto biomédico
          </Heading>

          <Box
            maxW="750px"
            mx="auto"
            bg="whiteAlpha.900"
            shadow="xl"
            borderRadius="2xl"
            p="1.5rem"
            border="1px solid rgba(255,255,255,0.4)"
            backdropFilter="blur(8px)"
          >
            <VStack
              bg="whiteAlpha.600"
              p="1rem"
              borderRadius="2xl"
              height="65vh"
              overflowY="auto"
              pb="4rem"
              gap={4}
              boxShadow="inner"
            >
              {messages.map((msg, i) => {
                const isMine = msg.sender.id === userId;

                return (
                  <Flex
                    key={i}
                    w="100%"
                    justify={isMine ? "flex-end" : "flex-start"}
                  >
                    <Box
                      bg={isMine ? "#1E4460" : "gray.200"}
                      color={isMine ? "white" : "black"}
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

            <Flex mt="1.2rem" align="center" gap={2}>
              <Input
                placeholder="Escriba su mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                bg="white"
                borderRadius="full"
                px="1.5rem"
                py="1.2rem"
                boxShadow="md"
              />

              <Button
                colorScheme="teal"
                borderRadius="full"
                px="4"
                h="3rem"
                type="button"
                onClick={sendMessage}
                boxShadow="md"
              >
                <FaPaperPlane />
              </Button>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}