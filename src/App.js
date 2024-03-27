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
} from "@chakra-ui/react";
import ReactPlayer from "react-player";
import { StarIcon } from "@chakra-ui/icons";

const RadioBrowser = () => {
  const [stations, setStations] = useState([]);
  const [currentStationUrl, setCurrentStationUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState("");
  const [favorites, setFavorites] = useState(() => {
    // Cargar favoritos del almacenamiento local al iniciar
    const localData = localStorage.getItem("favorites");
    return localData ? JSON.parse(localData) : [];
  });
  const toast = useToast();

  useEffect(() => {
    fetch(
      "http://de1.api.radio-browser.info/json/stations/bycountrycodeexact/ar?limit=20"
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
    const isFavorite = favorites.some((fav) => fav.id === station.id);
    if (isFavorite) {
      // Si ya es favorito, lo removemos de la lista de favoritos.
      const updatedFavorites = favorites.filter((fav) => fav.id !== station.id);
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } else {
      // Si no es favorito, lo agregamos a la lista de favoritos.
      const updatedFavorites = [...favorites, station];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  return (
    <ChakraProvider>
      <Box
        padding="4"
        maxW="xl"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg="gray.50"
      >
        <Heading as="h3" size="lg" mb="4">
          Tomillo radio
        </Heading>
        <ReactPlayer
          url={currentStationUrl}
          playing
          controls
          width="100%"
          height="50px"
        />
        <VStack spacing="4" mt="4">
          {stations.map((station) => (
            <Box
              key={station.id}
              p="5"
              shadow="md"
              borderWidth="1px"
              bg="white"
              gap={2}
              width="full"
            >
              <Text fontWeight="bold">{station.name}</Text>
              <Button
                mr={1}
                size={"sm"}
                colorScheme={isPlaying === station.id ? "red" : "blue"}
                onClick={() => playStation(station.url, station.id)}
                mt="2"
              >
                {isPlaying === station.id ? "Playing" : "Play"}
              </Button>
              <IconButton
              size={'sm'}
                aria-label="Favorite"
                icon={<StarIcon />}
                colorScheme={
                  favorites.some((fav) => fav.id === station.id)
                    ? "yellow"
                    : "gray"
                }
                onClick={() => toggleFavorite(station)}
                mt="2"
              />
            </Box>
          ))}
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default RadioBrowser;
