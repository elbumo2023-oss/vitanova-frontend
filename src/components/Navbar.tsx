import { Box, Button, Flex, Heading, HStack , Icon, Image, Text} from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext";
import { FaSignInAlt, FaSignOutAlt, FaUser, FaUserPlus } from "react-icons/fa";

type Props = {}

function Navbar({}: Props) {

  const navigate = useNavigate()  
  const { token, logout , username} = useAuth();
  
  return (
    <>
      <Box bg="#1E4460" color="white" py={{ base: "0.4rem", md: "0.6rem" }}
        px={{ base: "1rem", md: "2rem", lg: "4rem" }}
      position="sticky" top={0} zIndex={10} boxShadow="md" borderBottom="0.25rem solid #244E61">
        <Flex align="center" justify="space-between" maxW="7xl" mx="auto" flexWrap="wrap">
            <HStack gap={{ base: "0.4rem", md: "0.6rem" }} onClick={()=> navigate("/")} cursor={"pointer"}>
                <Image 
                src="https://storage.googleapis.com/imagenes-biomedicas-sistema/VITANOVA.png"
                boxSize={{ base: "3.5rem", md: "4rem", lg: "5rem" }}
                borderRadius="full"/>
                <Heading
                size={{ base: "sm", md: "md" }}
                fontWeight="semibold"
                color="white"
                _hover={{ color: "#A7D3F2" }} ml={{ base: 1, md: 3 }}
                >
                    VITANOVA
                </Heading>
            </HStack>
            {/*Links*/}
            <HStack gap={{ base: "0.5rem", md: "1rem", lg: "2rem" }} fontSize={{ base: "sm", md: "md" }}
            display={{ base: "flex", md: "flex" }}fontWeight={"medium"}>
              <Link to="/products" style={{ color: "white", textDecoration: "none" }} 
              onMouseEnter={(e) => (e.currentTarget.style.color = "#A7D3F2")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "white")} >
              Productos
              </Link>
              <Link to="/services" style={{ color: "white", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#A7D3F2")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "white")}>
              Servicios
              </Link>
              <Link to="/chat" style={{ color: "white", textDecoration: "none" }}
               onMouseEnter={(e) => (e.currentTarget.style.color = "#A7D3F2")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "white")}>
              Chat
              </Link>
              {token && (
                <Link
                  to="/my-quotes"
                  style={{ color: "white", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#A7D3F2")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
                >
                  Cotizaciones
                </Link>
              )}
            </HStack>
          <HStack
            gap={{ base: "0.5rem", md: "1rem" }}
            mt={{ base: 2, md: 0 }}
            fontSize={{ base: "sm", md: "md" }}
            flexShrink={0}
            w={{ base: "100%", md: "auto" }}
            justify={{ base: "center", md: "flex-end" }}
            >
          {!token ? (
            <>
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                borderColor="#A7D3F2"
                color="#A7D3F2"
                _hover={{ bg: "#A7D3F2", color: "#1E4460" }}
                size={{ base: "xs", md: "sm" }}
              >
                <HStack gap="0.4rem" align="center">
                <Icon as={FaSignInAlt} boxSize={4} />
                <Text>Iniciar sesión</Text>
              </HStack>
              </Button>
              <Button
                onClick={() => navigate("/register")}
                bg="#A7D3F2"
                color="#1E4460"
                _hover={{ bg: "#8CC5EB" }}
                size={{ base: "xs", md: "sm" }}
              >
                <HStack gap="0.4rem" align="center">
                <Icon as={FaUserPlus} boxSize={4} />
                <Text>Registrarse</Text>
              </HStack>
              </Button>
            </>
          ) : (
          <>
            <Button
              onClick={() => navigate("/profile")}
              bg="white"
              color="#1E4460"
              _hover={{ bg: "#E6F0FA" }}
              size={{ base: "xs", md: "sm" }}
            >
              <HStack gap="0.4rem" align="center">
                <Icon as={FaUser} boxSize={4} />
                <Text>Perfil</Text>
                {username && <Text fontSize="sm" fontStyle={"italic"}>{username}</Text>}
              </HStack>
            </Button>
            <Button
              onClick={() => {
                logout();
                navigate("/");
              }}
              variant="outline"
              borderColor="#A7D3F2"
              color="#A7D3F2"
              _hover={{ bg: "#A7D3F2", color: "#1E4460" }}
              size={{ base: "xs", md: "sm" }}
            >
              <HStack gap="0.4rem" align="center">
                <Icon as={FaSignOutAlt} boxSize={4} />
                <Text>Cerrar sesión</Text>
              </HStack>
        </Button>
      </>
    )}
  </HStack>
        </Flex>
      </Box>  
    </>
  )
}

export default Navbar