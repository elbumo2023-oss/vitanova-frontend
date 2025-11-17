import { Box, Container } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function PublicLayout() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
       <Navbar/>
        <Container maxWidth="6xl" flex={"1"} py={8}>
            <Outlet/>
        </Container>
        <Footer/>
    </Box>
  )
}

export default PublicLayout