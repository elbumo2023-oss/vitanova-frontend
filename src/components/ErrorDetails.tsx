import {
  Box,
  Button,
  Container,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

function ErrorDetails() {
  const navigate = useNavigate();

  return (
    <Container
      maxW="lg"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <MotionBox
        textAlign="center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        p="2rem"
        borderRadius="xl"
        boxShadow="0 0 20px rgba(30,68,96,0.2)"
        bg="white"
      >
        <Image
          src="https://storage.googleapis.com/imagenes-biomedicas-sistema/errordetails.png"
          alt="Error"
          mx="auto"
          mb="2rem"
          boxSize={{ base: "10rem", md: "12rem" }}
        />
        <Heading color="#1E4460" mb="1rem" fontSize={{ base: "2xl", md: "3xl" }}>
          ¡Ups! Algo salió mal
        </Heading>
        <Text color="gray.600" mb="1.5rem">
          Puede que la página no exista o haya ocurrido un error inesperado.
        </Text>
        <VStack gap={4}>
          <Button
            bg="#1E4460"
            color="white"
            _hover={{ bg: "#244E61" }}
            onClick={() => navigate("/")}
          >
            Volver al inicio
          </Button>
          <Button
            variant="outline"
            borderColor="#1E4460"
            color="#1E4460"
            _hover={{ bg: "#E6F0FA" }}
            onClick={() => window.location.reload()}
          >
            Reintentar
          </Button>
        </VStack>
      </MotionBox>
    </Container>
  );
}

export default ErrorDetails;