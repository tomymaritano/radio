import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    Select: {
      variants: {
        filled: {
          field: {
            bg: "#1a1a1a",
            color: "white",
            _hover: {
              bg: "#333",
            },
            _expanded: {
              bg: "#555",
            }
          },
          icon: {
            color: "white",
          },
        },
      },
    },
  },
});

export default theme