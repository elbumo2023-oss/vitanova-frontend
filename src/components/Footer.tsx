import { Flex, HStack, VStack , Image, Container, Box, Text, Link, Stack, IconButton, Icon} from "@chakra-ui/react"
import { FaEnvelope, FaLinkedin } from "react-icons/fa";

type Props = {}

function Footer({}: Props) {
  return (
    <>
      <Box
      bg="#244E61" 
      color="#E8F4FA"
      py={{ base: "3rem", md: "4rem" }}
      mt="auto"
      boxShadow="0 -2px 6px rgba(0,0,0,0.15)"
    >
      <Container maxW="7xl">
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          gap={{ base: "2rem", md: "0" }}
          flexWrap="wrap"
        >
          {/* Logo y descripción */}
          <HStack align="center" gap="0.8rem">
            <Image
              src="https://storage.googleapis.com/imagenes-biomedicas-sistema/dadprofileimage.jpg"
              boxSize={{ base: "3rem", md: "4rem" }}
              borderRadius="full"
              alt="Imagen de mi padre"
            />
            <VStack align="flex-start" gap="0.25rem">
              <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }}>
                JOSE FELIX MORAN AGUSTO
              </Text>
              <Text fontSize={{ base: "sm", md: "md" }} color="#B7DBF2">
                Ingeniero Electrónico y Magister en Gerencia Hospitalaria
              </Text>
            </VStack>
          </HStack>
          <HStack gap={{ base: "0.8rem", md: "2rem" }} flexWrap="wrap">
            <Link href="/" color={"#d1cfcf"} _hover={{ color: "#9ED8FF" }}>
              Inicio
            </Link>
            <Link href="/products" color={"#d1cfcf"}  _hover={{ color: "#9ED8FF" }}>
              Productos
            </Link>
            <Link href="/services" color={"#d1cfcf"}  _hover={{ color: "#9ED8FF" }}>
              Servicios
            </Link>
            <Link href="/chat" color={"#d1cfcf"}  _hover={{ color: "#9ED8FF" }}>
              Chat
            </Link>
          </HStack>
          <VStack align="flex-start" gap="0.5rem">
            <HStack gap="0.4rem">
              <Icon as={FaEnvelope} color="#9ED8FF" />
              <Link color={"#d1cfcf"}  _hover={{ color: "#9ED8FF" }}>
                jfmorag@gmail.com
              </Link>
            </HStack>
            <HStack gap="0.4rem">
              <Icon as={FaLinkedin} color="#9ED8FF" />
              <Link
                href="https://www.linkedin.com/in/josé-felix-moran-agusto-19424571/"
                color={"#d1cfcf"} 
                target="_blank"
                rel="noopener noreferrer"
                _hover={{ color: "#9ED8FF" }}
              >
                LinkedIn
              </Link>
            </HStack>
          </VStack>
        </Flex>
        <Box borderTop="1px solid #3E6B83" mt="2rem" pt="1.5rem">
          <Text fontSize="sm" textAlign="center" color="#B7DBF2">
            © 2025 VITANOVA. Todos los derechos reservados.
          </Text>
          <br/>
          <Text fontSize={"0.7rem"}>This page is made by J.Moran</Text>
        </Box>
      </Container>
    </Box>
    </>
  )
}

export default Footer