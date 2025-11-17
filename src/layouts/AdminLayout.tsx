import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";

function AdminLayout() {
  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Sidebar fijo */}
      <Box position="fixed" top={0} left={0} h="100vh" zIndex={100}>
        <Sidebar />
      </Box>

      {/* Contenido principal */}
      <Box
        ml={{ base: "220px", md: "260px" }} // deja espacio igual al ancho del sidebar
        w="100%"
        h="100vh"
        overflowY="auto"
        bg="#F9FCFF"
        p={6}
      >
        <Outlet />
      </Box>
    </Flex>
  );
}

export default AdminLayout;