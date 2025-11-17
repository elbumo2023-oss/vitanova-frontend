import { Box, VStack, Button, Icon, HStack, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBox,
  FaServicestack,
  FaFileInvoice,
  FaUserShield,
  FaHome,
  FaComments,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { label: "Dashboard", icon: FaHome, path: "/admin" },
    { label: "Clientes", icon: FaUsers, path: "/admin/clients" },
    { label: "Productos", icon: FaBox, path: "/admin/products" },
    { label: "Servicios", icon: FaServicestack, path: "/admin/services" },
    { label: "Cotizaciones", icon: FaFileInvoice, path: "/admin/quotes" },
    { label: "Chat", icon: FaComments, path: "/admin/chat" },
  ];

  return (
    <>
      <Box
      w={{ base: "220px", md: "260px" }}
      h="100vh"
      bgImage="url('https://storage.googleapis.com/imagenes-biomedicas-sistema/adminBg.jpg')"
      bgSize="cover"
      bgPos="center"
      color="white"
      position="fixed"
      top="0"
      left="0"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      boxShadow="2xl"
      zIndex={100}
    >
      {/* Zona superior */}
      <Box>
        <Box textAlign="center" mt={5}>
          <Image
            src="https://storage.googleapis.com/imagenes-biomedicas-sistema/VITANOVA.png"
            alt="VITANOVA Logo"
            mx="auto"
            w="150px"
            mb={2}
            filter="drop-shadow(0px 0px 5px rgba(255,255,255,0.9))"
          />
        </Box>

        {/* Lista de botones */}
        <VStack align="stretch" gap={3} mt={6} px={3}>
          {menuItems.map(({ label, icon, path }) => (
            <Button
              key={path}
              onClick={() => navigate(path)}
              justifyContent="flex-start"
              bg="rgba(0, 0, 0, 0.65)"
              _hover={{
                bg: "rgba(0, 0, 0, 0.85)",
                transform: "scale(1.03)",
              }}
              color="white"
              fontWeight="medium"
              borderRadius="lg"
              py={4}
              transition="all 0.2s ease"
            >
              <HStack gap={3}>
                <Icon as={icon} boxSize={5} />
                <Text>{label}</Text>
              </HStack>
            </Button>
          ))}
        </VStack>
      </Box>

      {/* Botón rojo siempre visible */}
      <Box px={3} pb={5}>
        <Button
          w="full"
          bg="rgba(255, 80, 80, 0.9)"
          _hover={{ bg: "red.500", transform: "scale(1.05)" }}
          color="white"
          py={5}
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <HStack justify="center" gap={3}>
            <Icon as={FaSignOutAlt} boxSize={5} />
            <Text fontWeight="semibold">Cerrar sesión</Text>
          </HStack>
        </Button>
      </Box>
    </Box>
    </>
  );
}

export default Sidebar;
