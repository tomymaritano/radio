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
  VStack,
  Select,
} from "@chakra-ui/react";
import ReactPlayer from "react-player";
import { StarIcon } from "@chakra-ui/icons";
import { FaPlay, FaStop } from "react-icons/fa";

const RadioBrowser = () => {
  const [stations, setStations] = useState([]);
  const [currentStationUrl, setCurrentStationUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [limit] = useState(10); // Número de estaciones por página
  const [offset, setOffset] = useState(0); // Punto de inicio para la carga de estaciones
  const [favorites, setFavorites] = useState(() => {
    // Cargar favoritos del almacenamiento local al iniciar

    const localData = localStorage.getItem("favorites");
    console.log("Cargando favoritos", localData);
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    fetch("https://de1.api.radio-browser.info/json/countries")
      .then((response) => response.json())
      .then((data) => {
        setCountries(data);
      })
      .catch((error) => console.log("Error fetching countries:", error));
  }, []);

  const toast = useToast();
  const defaultImage =
    "https://logo.com/image-cdn/images/kts928pd/production/b36725aaacffc347ce5339d6782fbfd731fa2de6-731x731.jpg?w=1080&q=72"; // Cambia esto por tu URL de imagen predeterminada

  // Fetch de países
  useEffect(() => {
    fetch("https://de1.api.radio-browser.info/json/countries")
      .then((response) => response.json())
      .then((data) => {

        setCountries(data);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Fetch de estaciones basado en el país seleccionado
  useEffect(() => {
    let baseUrl =
      "https://de1.api.radio-browser.info/json/stations/bycountrycodeexact/ar";
    if (selectedCountry) {
      baseUrl = `https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(
        selectedCountry
      )}`;
    }

    // Incluye parámetros de paginación en la URL
    const url = `${baseUrl}?limit=${limit}&offset=${offset}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setStations(data);
      })
      .catch((error) => {
        console.error("Error fetching stations:", error);
        toast({
          title: "Error fetching stations",
          description: "Couldn't retrieve stations. Please try again later.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  }, [selectedCountry, limit, offset, toast]); // Añade limit y offset como dependencias

  useEffect(() => {
    setOffset(0);
  }, [selectedCountry]);

  const handlePlaybackEnded = () => {
    setIsPlaying(""); // Restablece el estado de reproducción
  };

const toggleFavorite = (station) => {
  const isFavorite = favorites.some(fav => fav.stationuuid === station.stationuuid);
  let updatedFavorites;
  if (isFavorite) {
    updatedFavorites = favorites.filter(fav => fav.stationuuid !== station.stationuuid);
  } else {
    updatedFavorites = [...favorites, station];
  }
  setFavorites(updatedFavorites);
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  console.log(updatedFavorites)
};
useEffect(() => {
  const handleSearch = (searchTerm) => {
    const stationsPerPage = 20;
    const offset = 0;
  
    let searchUrl = `https://de1.api.radio-browser.info/json/stations/search?limit=${stationsPerPage}&offset=${offset}&`;
  
    if (selectedCountry) {
      searchUrl += `country=${encodeURIComponent(selectedCountry)}&`;
    }
  
    if (searchTerm) {
      searchUrl += `name=${encodeURIComponent(searchTerm)}`;
    }
  
    fetch(searchUrl)
      .then(response => response.json())
      .then(data => {
        setStations(data);
      })
      .catch(error => console.error("Error fetching stations:", error));
  };

  const timerId = setTimeout(() => {
    handleSearch(searchTerm);
  }, 500);

  return () => clearTimeout(timerId);
}, [searchTerm, selectedCountry]);


  // Primero, filtra las estaciones según el término de búsqueda.
  const filteredBySearchTerm = searchTerm
    ? stations.filter((station) =>
        station.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : stations;

  // Luego, de ese conjunto filtrado, elige mostrar todas o solo las favoritas según el estado de showFavorites.
  const stationsToShow = showFavorites
    ? filteredBySearchTerm.filter((station) =>
        favorites.some((fav) => fav.stationuuid === station.stationuuid)
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
                size={"sm"}
                bg={"white"}
                placeholder="Buscar estación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </FormControl>
            <Container maxW={"sm"}>
              <VStack spacing={5}>
                {/* Menú desplegable para seleccionar país */}
                <FormControl>
                  <Select
                    size={"sm"}
                    placeholder="Seleccione un país"
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    value={selectedCountry}
                  >
                    {countries.map((country) => (
                      <option key={country.id} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                {/* Continúa con los demás elementos de UI como antes... */}
              </VStack>
            </Container>
          </HStack>
        </Container>
        <Container maxW={"4xl"}>
          <Box p={4} color={"red"}>
            <ReactPlayer
              url={currentStationUrl}
              playing={isPlaying !== ""}
              controls
              width="100%"
              height="50px"
              onEnded={handlePlaybackEnded}
              onError={() => handlePlaybackEnded()} // Opcionalmente maneja errores de la misma manera
            />
          </Box>

          <SimpleGrid columns={[1, 2]} spacing={4}>
            {stationsToShow.map((station) => (
              <Box
                borderRadius={"6px"}
                key={station.stationuuid}
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
                      isPlaying === station.stationuuid ? "red" : "teal"
                    }
                    onClick={() => {
                      if (isPlaying === station.stationuuid) {
                        // Si se está reproduciendo esta estación, detén la reproducción.
                        setCurrentStationUrl("");
                        setIsPlaying(null);
                      } else {
                        // Si no se está reproduciendo esta estación, inicia la reproducción.
                        setCurrentStationUrl(station.url);
                        setIsPlaying(station.stationuuid);
                      }
                    }}
                  >
                    {isPlaying === station.stationuuid ? <FaStop /> : <FaPlay />}
                  </Button>

                  <IconButton
                    bg={"none"}
                    size={"sm"}
                    aria-label="Favorite"
                    icon={<StarIcon />}
                    color={
                      favorites.some(
                        (fav) => fav.stationuuid === station.stationuuid
                      )
                        ? "yellow.500"
                        : "gray"
                    }
                    onClick={() => toggleFavorite(station)}
                  />
                </HStack>
                
              </Box>
            ))}
          </SimpleGrid>
<Button colorScheme="red" m={4} onClick={() => setOffset(offset + limit)}>Cargar más</Button>
        </Container>
        
      </Box>
    </ChakraProvider>
  );
};

export default RadioBrowser;
