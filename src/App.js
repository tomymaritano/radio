import React, { useState } from "react"; // Importa useState
import ReactPlayer from "react-player"; // Asegúrate de que ReactPlayer esté importado correctamente
import { Box, ChakraProvider, Container, Select } from "@chakra-ui/react"; // Asegúrate de que ChakraProvider esté importado correctamente

function App() {
  const radios = [
    {
      name: "Classic FM",
      url: "http://media-ice.musicradio.com/ClassicFMMP3",
      img: "https://radiotoday.co.uk/wp-content/uploads/2023/01/1000radioplayer.jpg",
    },
    {
      name: "KEXP 90.3 FM",
      url: "http://live-mp3-128.kexp.org/kexp128.mp3",
      img: "https://radiotoday.co.uk/wp-content/uploads/2023/01/1000radioplayer.jpg",
    },
    {
      name: "BBC Radio 1",
      url: "http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p",
      img: "https://radiotoday.co.uk/wp-content/uploads/2023/01/1000radioplayer.jpg",
    },
    {
      name: "Radio Swiss Jazz",
      url: "http://stream.srg-ssr.ch/m/rsj/mp3_128",
      img: "https://radiotoday.co.uk/wp-content/uploads/2023/01/1000radioplayer.jpg",
    },
    {
      name: "WFMU",
      url: "http://stream0.wfmu.org/freeform-128k",
      img: "https://radiotoday.co.uk/wp-content/uploads/2023/01/1000radioplayer.jpg",
    },
    {
      name: "Music For Work",
      url: "https://www.youtube.com/watch?v=ofXre8MuI9A",
    },
    {
      name: "Deep Music",
      url: "https://www.youtube.com/watch?v=8onzNnr5Z9o",
    },
    { name: "Chill Music", url: "https://www.youtube.com/watch?v=UbEpM-VwOU8" },
  ];

  const [currentRadioUrl, setCurrentRadioUrl] = useState(radios[0].url); // Estado para manejar la URL de la radio actual

  const handleRadioChange = (event) => {
    const url = event.target.value;
    setCurrentRadioUrl(url);
  };

  return (
    <ChakraProvider>
      <Box
        bg={"white"}
        height={"100vh"}
        p={4}
        display={"flex"}
        flexDir={"column"}
      >
        <Container>
          <Select
            bg={"tomato"}
            onChange={handleRadioChange}
            value={currentRadioUrl}
          >
            {radios.map((radio, index) => (
              <option key={index} value={radio.url}>
                {radio.name}
              </option>
            ))}
          </Select>

          <ReactPlayer url={currentRadioUrl} playing controls width="100%" />
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
