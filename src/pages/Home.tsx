import { Heading, VStack , Text, List, Box, Container, Image, Spinner, SimpleGrid, Card, CardHeader, CardBody, HStack} from "@chakra-ui/react"
import useProducts from "../hooks/useProducts"
import { useServices } from "../hooks/useService"
import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { Skeleton, SkeletonText, Stack } from "@chakra-ui/react";

type Props = {}

function Home({}: Props) {
 
  const {getAll} = useProducts();
  const {data: products, isLoading: loadingProducts} = getAll()

  const{getAll: getServices} = useServices()
  const{data: services, isLoading: loadingServices} = getServices()

  const popularServices = services?.slice(0, 2) || [];
  const popularProduct = products?.slice(0, 1) || [];
  const loadingGlobal = loadingProducts || loadingServices;

  const navigate = useNavigate()

    return (
      <>
        <Box bg="#F9FCFF" minH="100vh">
          {loadingGlobal ? (
          // 🔹 Skeleton global mientras carga todo
          <Container maxW="7xl" py="6rem">
            <VStack gap={8}>
              {/* Hero Skeleton */}
              <Skeleton height="300px" width="100%" borderRadius="xl" />

              {/* About Section Skeleton */}
              <Stack gap="4" w="100%">
                <Skeleton height="40px" width="40%" borderRadius="md" />
                <SkeletonText noOfLines={3} gap="3" />
                <Skeleton height="120px" width="120px" borderRadius="full" mx="auto" />
              </Stack>

              {/* Services Skeleton */}
              <Skeleton height="40px" width="50%" borderRadius="md" mx="auto" />
              <SimpleGrid columns={{ base: 1, md: 2 }} gap="2rem" w="100%">
                {[1, 2].map((i) => (
                  <Stack key={i} p="1rem" shadow="sm" borderRadius="md" bg="white">
                    <Skeleton height="200px" borderRadius="md" />
                    <SkeletonText noOfLines={4} gap="3" />
                  </Stack>
                ))}
              </SimpleGrid>

              {/* Product Skeleton */}
              <Skeleton height="40px" width="50%" borderRadius="md" mx="auto" />
              <Stack p="1rem" shadow="sm" borderRadius="md" bg="white" w="100%">
                <Skeleton height="260px" borderRadius="md" />
                <SkeletonText noOfLines={4} gap="3" />
              </Stack>

              {/* Conclusion Skeleton */}
              <Skeleton height="300px" width="100%" borderRadius="xl" />
            </VStack>
          </Container>
        ): (
          <>
            {/*Hero Section of my dad's website*/}
            <Box
            bgImage="url('https://storage.googleapis.com/imagenes-biomedicas-sistema/hospitalbg.jpeg')"
            bgSize="cover" backgroundPosition="center" py={{ base: "6rem", md: "8rem" }}
            textAlign="center" color="white" _hover={{ shadow: "xl", transform: "scale(1.02)" }}
            transition="all 0.3s" >
              <VStack gap={"0.5rem"} px={"2rem"}  bg="rgba(30, 68, 96, 0.6)" py="3rem" borderRadius="2xl">
                <HStack gapX={"1rem"}>
                <Image src="https://storage.googleapis.com/imagenes-biomedicas-sistema/VITANOVA.png"
                  alt="VITANOVA logo"
                  borderRadius="2rem"
                  boxSize={{ base: "4rem", md: "6rem" }}
                  shadow="lg" _hover={{ shadow: "xl", transform: "scale(1.02)" }}
                  transition="all 0.3s"/>
                <Heading size={{ base: "xl", md: "2xl" }} fontWeight="bold">
                     VITANOVA
                </Heading>
                </HStack>
                 <Text fontStyle="italic" fontSize={{base:"md", md:"lg"}}>"Soluciones Biomédicas Con Propósito"</Text>
                <br/>
                <Text fontSize={{ base: "md", md: "lg" }} maxW="3xl">
                  Liderado por el Ingeniero <strong>José Félix Morán Agusto</strong>, <strong>Magíster en Gerencia Hospitalaria</strong> y especialista en <strong>Ingeniería Biomédica</strong>, con más de 20 años de trayectoria en la Junta de Beneficencia de Guayaquil y en proyectos hospitalarios de alto nivel.
                  Su experiencia abarca la dirección técnica y gerencial de mantenimiento hospitalario, la planificación tecnológica, y la asesoría en adquisición e implementación de equipamiento médico, combinando conocimiento, ética y precisión.
                </Text>
                <Text fontSize={{ base: "md", md: "lg" }} maxW="3xl">
                Ha participado en proyectos clave como la remodelación de quirófanos del Hospital Luis Vernaza y Alfredo Paulson y la implementación de centros de diagnóstico por imágenes, además de liderar equipos multidisciplinarios de ingeniería hospitalaria.
                Su visión: ofrecer soluciones biomédicas confiables, eficientes y sostenibles que fortalezcan la calidad asistencial de hospitales y clínicas en el país.
                </Text>
              </VStack>
            </Box>
            {/*About section*/}
            <Container maxW="7xl" py={"5rem"}>
              <VStack gap={"0.75rem"} textAlign={"center"} >
                <Heading color={"#1E4460"} >
                  Nuestra Visión
                </Heading>
                <Text  maxW="4xl" 
                fontSize={{ base: "md", md: "lg" }}
                color="gray.700" >
                  En VITANOVA, creemos que la tecnología médica debe estar al
                  servicio de la vida. Nuestro objetivo es optimizar los procesos de
                  adquisición, mantenimiento y gestión hospitalaria con soluciones
                  integrales, éticas y personalizadas. Nos diferenciamos por combinar
                  conocimiento técnico con una visión humana del servicio.
                </Text>
                <Image
                  src="https://storage.googleapis.com/imagenes-biomedicas-sistema/dadprofileimage.jpg"
                  alt="Ingeniero José Félix Morán"
                  borderRadius="full"
                  boxSize={{ base: "8rem", md: "10rem" }}
                  shadow="lg" _hover={{ shadow: "xl", transform: "scale(1.02)" }}
                  transition="all 0.3s"
                />
                <Text fontWeight="semibold" color="#1E4460" 
                >
                  José Félix Morán Agusto — Magíster en Gerencia Hospitalaria 
                </Text>
              </VStack>
            </Container>
            {/*Social Proof: Servicios más populares*/}
            <Box bg="#EAF5FA" py="5rem">
            <Container maxW="7xl">
              <VStack gap={8}>
                <Heading color="#1E4460" textAlign="center">
                  Servicios más solicitados
                </Heading>
                {loadingServices ? (
                  <Spinner size="xl" color="#1E4460" />
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2 }}  gap="2rem">
                    {popularServices.map((service: any) => (
                      <Card.Root
                        key={service.id}
                        bg="white"
                        shadow="md"
                        _hover={{ shadow: "xl", transform: "scale(1.02)" }}
                        transition="all 0.3s"
                      >
                        <Image
                          src={service.imageUrl}
                          alt={service.name}
                          borderTopRadius="xl"
                          objectFit="cover"
                          maxH="220px"
                          w="100%"
                        />
                        <CardHeader>
                          <Heading size="md" color="#1E4460">
                            {service.name}
                          </Heading>
                        </CardHeader>
                        <CardBody>
                          <Text color="gray.600" mb={3}>
                            {service.description}
                          </Text>
                          <Text fontWeight="semibold" color="#1E4460">
                            Categoría:{" "}
                            <Text as="span" color="gray.700">
                              {service.category || "General"}
                            </Text>
                          </Text>
                          <Box textAlign="center" mt="1.5rem">
                            <Box
                              as="button"
                              bg="#1E4460"
                              color="white"
                              px="1.5rem"
                              py="0.6rem"
                              borderRadius="md"
                              fontWeight="medium"
                              _hover={{ bg: "#244E61" }}
                              onClick={() => navigate("/services")}
                            >
                              Ver más servicios
                            </Box>
                          </Box>
                        </CardBody>
                      </Card.Root>
                    ))}
                  </SimpleGrid>
                )}
              </VStack>
            </Container>
          </Box>
          {/*Producto destacado*/}
          <Box py="5rem" bg="white">
          <Container maxW="7xl">
            <VStack gap={"0.5rem"}>
              <Heading color="#1E4460" textAlign="center">
                Catálogo de Honor
              </Heading>
              {loadingProducts ? (
                <Spinner size="xl" color="#1E4460" />
              ) : (
                <SimpleGrid columns={{ base: 1, md: 1 }} gap="2rem">
                  {popularProduct.map((product: Product) => (
                    <Card.Root
                      key={product.id}
                      shadow="lg"
                      bg="#F1FAFE"
                      borderLeft="6px solid #1E4460"
                      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
                      transition="all 0.3s"
                    >
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        borderTopRadius="xl"
                        objectFit="cover"
                        h="280px"
                        w="100%"
                      />
                      <CardHeader>
                        <Heading size="md" color="#1E4460">
                          {product.name}
                        </Heading>
                      </CardHeader>
                      <CardBody>
                        <Text color="gray.700" mb={3}>
                          {product.description}
                        </Text>
                        {product.brand && (
                          <Text color="gray.700">Marca: {product.brand}</Text>
                        )}
                        {product.category && (
                          <Text color="gray.700">Categoría: {product.category}</Text>
                        )}
                        <Box mt="1.5rem">
                          <button
                            onClick={() => navigate("/products")}
                            style={{
                              backgroundColor: "#1E4460",
                              color: "white",
                              border: "none",
                              padding: "0.6rem 1.2rem",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = "#285a7a")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = "#1E4460")
                            }
                          >
                            Ver catálogo completo
                          </button>
                        </Box>
                      </CardBody>
                    </Card.Root>
                  ))}
                </SimpleGrid>
              )}
            </VStack>
            </Container>
          </Box>
          {/*Conclusion*/}
          <Box
            bgImage="url('https://storage.googleapis.com/imagenes-biomedicas-sistema/resonator.jpg')"
            bgSize="cover"
            backgroundPosition="center"
            py="6rem"
            color="white"
            textAlign="center"
          >
            <VStack
              bg="rgba(30,68,96,0.18)"        // 🔹 Más sutil: antes era 0.6
              backdropFilter="blur(2px)"      // 🔹 Efecto vidrio moderno
              px="2rem"
              py="3rem"
              borderRadius="2xl"
              gap="0.5rem"
            >
              <Heading textShadow="0 2px 6px rgba(0,0,0,0.6)">
                Comprometidos con la excelencia biomédica
              </Heading>

              <Text maxW="3xl" textShadow="0 1px 4px rgba(0,0,0,0.6)">
                En VITANOVA entendemos que detrás de cada equipo médico hay personas que confían en él.
                Cada proyecto que realizamos nace del diálogo, de escuchar con atención a nuestros clientes
                y comprender lo que realmente necesitan.
              </Text>

              <Text maxW="3xl" textShadow="0 1px 4px rgba(0,0,0,0.6)">
                Nuestra meta no es solo entregar soluciones técnicas, sino acompañarte en el proceso:
                ayudarte a decidir, guiarte con transparencia y asegurarnos de que cada inversión
                mejore la atención de tus pacientes.
              </Text>

              <Text maxW="3xl" textShadow="0 1px 4px rgba(0,0,0,0.6)">
                Si estás buscando un aliado confiable para fortalecer el área biomédica de tu institución,
                conversemos. En VITANOVA, tu confianza es el inicio de cada solución.
              </Text>
            </VStack>
          </Box>
          </>
        )}
        </Box>
      </>
    )
}

export default Home

