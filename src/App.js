import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  useToast,
  IconButton,
  ChakraProvider,
  Container,
  Input,
  Switch,
  FormLabel,
  FormControl,
  Image,
  SimpleGrid,
  HStack,
  Flex,
} from "@chakra-ui/react";
import ReactPlayer from "react-player";
import { StarIcon } from "@chakra-ui/icons";

const RadioBrowser = () => {
  const [stations, setStations] = useState([]);
  const [currentStationUrl, setCurrentStationUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    // Cargar favoritos del almacenamiento local al iniciar

    const localData = localStorage.getItem("favorites");
    console.log("Cargando favoritos", localData);
    return localData ? JSON.parse(localData) : [];
  });
  const toast = useToast();
  const defaultImage =
    "https://logo.com/image-cdn/images/kts928pd/production/b36725aaacffc347ce5339d6782fbfd731fa2de6-731x731.jpg?w=1080&q=72"; // Cambia esto por tu URL de imagen predeterminada

  useEffect(() => {
    fetch(
      "https://de1.api.radio-browser.info/json/stations/bycountrycodeexact/ar"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Asumiendo que `favicon` es una URL a la imagen de la estación,
        // filtramos solo las estaciones que tienen un favicon definido.
        const stationsWithImages = data.filter((station) => station.name);
        setStations(stationsWithImages);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast({
          title: "Error fetching stations",
          description: "Couldn't retrieve stations. Please try again later.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  }, [toast]);

  const playStation = (url, id) => {
    setCurrentStationUrl(url);
    setIsPlaying(id);
  };

  const toggleFavorite = (station) => {
    const isFavorite = favorites.some(
      (fav) => fav.changeuuid === station.changeuuid
    );
    if (isFavorite) {
      // Si ya es favorito, lo removemos de la lista de favoritos.
      const updatedFavorites = favorites.filter(
        (fav) => fav.changeuuid !== station.changeuuid
      );
      setFavorites(updatedFavorites);
      console.log("Toggling favorite for station", station.changeuuid);

      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      console.log("Favoritos guardados", localStorage.getItem("favorites"));
    } else {
      // Si no es favorito, lo agregamos a la lista de favoritos.
      const updatedFavorites = [...favorites, station];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  // Primero, filtra las estaciones según el término de búsqueda.
  const filteredBySearchTerm = searchTerm
    ? stations.filter((station) =>
        station.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : stations;

  // Luego, de ese conjunto filtrado, elige mostrar todas o solo las favoritas según el estado de showFavorites.
  const stationsToShow = showFavorites
    ? filteredBySearchTerm.filter((station) =>
        favorites.some((fav) => fav.changeuuid === station.changeuuid)
      )
    : filteredBySearchTerm;

  return (
    <ChakraProvider>
      <Box
        padding="4"
        maxW="100%"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg="gray.50"
      >
        {" "}
        <Container maxW={"4xl"}>
          <HStack spacing={5}>
            <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="favorites-switch" mb="0">
                  Favoritos
                </FormLabel>
                <Switch
                  id="favorites-switch"
                  onChange={() => setShowFavorites(!showFavorites)}
                  isChecked={showFavorites}
                />
              </FormControl>
              <FormControl>
              <Input
              size={'sm'}
                bg={"white"}
                placeholder="Buscar estación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              </FormControl>

              
          </HStack>
        </Container>
        <Container maxW={"4xl"}>
          <Box p={4} color={"red"}>
            <ReactPlayer
              url={currentStationUrl}
              playing
              controls
              width="100%"
              height="50px"
            />
          </Box>

          <SimpleGrid columns={[1, 2]} spacing={4}>
            {stationsToShow.map((station) => (
              <Box
                key={station.changeuuid}
                p="5"
                bg="white"
                gap={2}
                width="full"
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Box display="flex" alignItems="center">
                  {station.favicon && (
                    <Image
                      src={station.favicon ? station.favicon : defaultImage}
                      alt={`Logo de ${station.name}`}
                      boxSize="30px"
                      fallbackSrc={defaultImage} // Usa esto si Chakra UI >= v1.4.0 para manejar errores de carga
                      onError={(e) => {
                        if (!e.target.src.endsWith(defaultImage)) {
                          e.target.src = defaultImage; // Cambia a la imagen predeterminada si hay un error al cargar la imagen original
                        }
                      }}
                    />
                  )}
                  <Text ml="4" fontWeight="bold">
                    {station.name}
                  </Text>
                  {/* Otros elementos de la estación */}
                </Box>
                <HStack>
                  <Button
                    size={"sm"}
                    colorScheme={
                      isPlaying === station.changeuuid ? "teal" : "facebook"
                    }
                    onClick={() => playStation(station.url, station.changeuuid)}
                  >
                    {isPlaying === station.changeuuid
                      ? "Reproduciendo"
                      : "Reproducir"}
                  </Button>
                  <IconButton
                    size={"sm"}
                    aria-label="Favorite"
                    icon={<StarIcon />}
                    colorScheme={
                      favorites.some(
                        (fav) => fav.changeuuid === station.changeuuid
                      )
                        ? "yellow"
                        : "gray"
                    }
                    onClick={() => toggleFavorite(station)}
                  />
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default RadioBrowser;
