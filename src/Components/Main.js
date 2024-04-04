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
  theme,
} from "@chakra-ui/react";
import { DownloadIcon, StarIcon } from "@chakra-ui/icons";
import { FaPlay, FaStop } from "react-icons/fa";
import ReactPlayer from "react-player";

const RadioBrowser = () => {
  const [stations, setStations] = useState([]);
  const [currentStationUrl, setCurrentStationUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [limit] = useState(20); // Número de estaciones por página
  const [offset, setOffset] = useState(0); // Punto de inicio para la carga de estaciones
  const [favorites, setFavorites] = useState(() => {
    // Cargar favoritos del almacenamiento local al iniciar

    const localData = localStorage.getItem("favorites");
    console.log("Cargando favoritos", localData);
    return localData ? JSON.parse(localData) : [];
  });
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setInstallPrompt(null);
      });
    }
  };
  useEffect(() => {
    fetch("https://de1.api.radio-browser.info/json/countries")
      .then((response) => response.json())
      .then((data) => {
        setCountries(
          data.map((country) => ({
            name: country.name,
            id: country.stationcount,
          }))
        ); // Asumiendo que quieres usar `stationcount` como id, ajusta según sea necesario
      })
      .catch((error) => console.error("Error fetching countries:", error));
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
    const isFavorite = favorites.some(
      (fav) => fav.stationuuid === station.stationuuid
    );
    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter(
        (fav) => fav.stationuuid !== station.stationuuid
      );
    } else {
      updatedFavorites = [...favorites, station];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    console.log(updatedFavorites);
  };

  useEffect(() => {
    // Solo busca estaciones si no estamos mostrando favoritos
    if (!showFavorites) {
      const handleSearch = () => {
        let searchUrl = `https://de1.api.radio-browser.info/json/stations/search?limit=${limit}&offset=${offset}&`;

        if (selectedCountry) {
          searchUrl += `country=${encodeURIComponent(selectedCountry)}&`;
        }

        if (searchTerm) {
          searchUrl += `name=${encodeURIComponent(searchTerm)}`;
        }

        fetch(searchUrl)
          .then((response) => response.json())
          .then((data) => {
            setStations(data);
          })
          .catch((error) => console.error("Error fetching stations:", error));
      };

      const timerId = setTimeout(() => {
        handleSearch();
      }, 500);

      return () => clearTimeout(timerId);
    }
  }, [searchTerm, selectedCountry, showFavorites, limit, offset]);

  // Primero, filtra las estaciones según el término de búsqueda.
  const filteredBySearchTerm = searchTerm
    ? stations.filter((station) =>
        station.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : stations;

  // Luego, de ese conjunto filtrado, elige mostrar todas o solo las favoritas según el estado de showFavorites.
  // Decide qué estaciones mostrar
  const stationsToShow = showFavorites ? favorites : filteredBySearchTerm;

  return (
    <ChakraProvider theme={theme}>
      <Box
        maxW="100%"
        position={"sticky"}
        overflow={"scroll"}
        height="100vh"
        bg="#1A1A1A"
      >
        {" "}
        <Container
          maxW={"4xl"}
          bgColor={"#212121"}
          p={8}
          position={"sticky"}
          top={0}
          zIndex={3}
        >
          <Box
            display="flex"
            flexDirection={{ base: "column", md: "row" }} // 'base' es para móviles, 'md' es para tablets y arriba
            gap={{ base: "5", md: "2" }} // Añade más espacio en móvil y menos en pantallas más grandes
            justifyContent={{ base: "flex-start", md: "space-evenly" }} // Alinea al comienzo en móviles, distribuye de forma equitativa en pantallas más grandes
            alignItems={{ base: "flex-start", md: "center" }} // Alinea al comienzo en móviles, centra en pantallas más grandes
            width="100%"
          >
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="favorites-switch" mb="0" color={"white"}>
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
                bg={"white"}
                size={"sm"}
                border={0}
                placeholder="Buscar estación..."
                _placeholder={{ color: "black" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </FormControl>

            <Container maxW={"sm"}>
              <VStack spacing={5}>
                {/* Menú desplegable para seleccionar país */}
                <FormControl>
                  <Select
                    w={"100%"}
                    bg={"white"}
                    border={0}
                    size={"sm"}
                    placeholder="Seleccione un país"
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    value={selectedCountry}
                  >
                    {countries
                      // Filtra países sin nombre
                      .filter((country) => country.name)
                      // Elimina duplicados basándose en el nombre del país
                      .filter(
                        (country, index, self) =>
                          index ===
                          self.findIndex((c) => c.name === country.name)
                      )
                      // Ordena los países restantes alfabéticamente
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((country) => (
                        <option key={country.stationuuid} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                  </Select>
                </FormControl>

                {/* Continúa con los demás elementos de UI como antes... */}
              </VStack>
            </Container>

            <Box>
              {installPrompt && (
                <Button
                  rounded={"full"}
                  _hover={{
                    bg: "whiteAlpha.100",
                    color: "white",
                  }}
                  bg={"#e00091"}
                  size={"sm"}
                  onClick={handleInstallClick}
                >
                  <DownloadIcon />
                </Button>
              )}
            </Box>
          </Box>
        </Container>
        <Container maxW={"4xl"} bg={"whiteAlpha.100"}>
          <Box p={4} color={"red"}>
            <ReactPlayer
              url={currentStationUrl}
              playing={isPlaying !== ""}
              controls
              style={{ bg: "black" }}
              width="100%"
              border={"1px solid red"}
              height="0px"
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
                bg="#212121"
                color={"white"}
                gap={2}
                _hover={{
                  bg: "whiteAlpha.300",
                  color: "#1a1a1a",
                  fontWeight: "bold",
                  filter: "blur(0px)", // Elimina el desenfoque al hacer hover
                }}
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

                  <Text fontSize={"sm"} ml="4">
                    {station.name}
                  </Text>
                  {/* Otros elementos de la estación */}
                </Box>
                <HStack>
                  <IconButton
                    rounded={"full"}
                    size={"md"}
                    _hover={{
                      bg: "#1a1a1a",
                      color: "#d1e500",
                      transform: "matrix(1.1, 0, 0, 1.1, 0, 0)",
                    }}
                    bg={
                      isPlaying === station.stationuuid ? "#f4fc99" : "#D1E500"
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
                    {isPlaying === station.stationuuid ? (
                      <FaStop />
                    ) : (
                      <FaPlay />
                    )}
                  </IconButton>

                  <IconButton
                    bg={"none"}
                    size={"sm"}
                    _hover={{
                      bg: "transparent",
                      transform: "rotate(360deg) scale(1.5)", // Combina rotación y escalado
                    }}
                    transition="transform 0.5s ease-in-out" // Aplica una transición suave}}
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
          <Button
            size={"sm"}
            colorScheme="purple"
            m={4}
            onClick={() => setOffset(offset + limit)}
          >
            Cargar más
          </Button>
          <Button
            size={"sm"}
            colorScheme="purple"
            m={4}
            onClick={() => setOffset(offset - limit)}
          >
            Volver
          </Button>
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default RadioBrowser;
