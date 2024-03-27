import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  Heading,
  Button,
  useToast,
  IconButton,
  ChakraProvider,
  Container,
  Input,
  SimpleGrid,
  HStack,
} from "@chakra-ui/react";
import ReactPlayer from "react-player";
import { StarIcon } from "@chakra-ui/icons";

const RadioBrowser = () => {
  const [stations, setStations] = useState([]);
  const [currentStationUrl, setCurrentStationUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [favorites, setFavorites] = useState(() => {
    // Cargar favoritos del almacenamiento local al iniciar
    const localData = localStorage.getItem("favorites");
    console.log("Cargando favoritos", localData);
    return localData ? JSON.parse(localData) : [];
  });
  const toast = useToast();

  useEffect(() => {
    fetch(
      "https://de1.api.radio-browser.info/json/stations/bycountrycodeexact/ar?limit=20"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setStations(data))
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
  const filteredStations = searchTerm
    ? stations.filter((station) =>
        station.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : stations;

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
        <Heading textAlign={"center"} as="h3" size="lg" mb="4">
          Tomillo radio
        </Heading>
        <Container>
          <Input
            placeholder="Buscar estación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb="4"
          />
        </Container>
        <Container maxW={"4xl"}>
          <ReactPlayer
            url={currentStationUrl}
            playing
            controls
            width="100%"
            height="50px"
          />
          <SimpleGrid columns={[1, 2]} spacing="40px">
            {filteredStations.map((station) => (
              <Box
                key={station.changeuuid}
                p="5"
                shadow="md"
                borderWidth="1px"
                bg="white"
                gap={2}
                width="full"
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Text fontWeight="bold">{station.name}</Text>

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
