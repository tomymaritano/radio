import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  HStack,
  Heading,
  Button,
  useToast,
  ChakraProvider,
  VStack,
} from "@chakra-ui/react";
import ReactPlayer from "react-player";

const RadioBrowser = () => {
  const [stations, setStations] = useState([]);
  const [currentStationUrl, setCurrentStationUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState("");
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
          Radio Stations
        </Heading>
        {/* ReactPlayer Component */}
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
              width="full"
            >
              <Text fontWeight="bold" fontSize={'sm'}>{station.name}</Text>
            
              <Button
              size={'sm'}
                colorScheme={isPlaying === station.id ? "red" : "blue"}
                onClick={() => playStation(station.url, station.id)}
                mt="2"
              >
                {isPlaying === station.id ? "Playing" : "Play"}
              </Button>
            </Box>
          ))}
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default RadioBrowser;
