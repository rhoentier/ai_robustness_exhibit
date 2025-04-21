import {
  Box,
  VStack,
  Image as ReactImage,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
} from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Plugin,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { io } from "socket.io-client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function convertToBase64(buffer: ArrayBuffer | undefined) {
  if (buffer === undefined) return "";
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const result = "data:image/image/png;base64," + window.btoa(binary);
  return result;
}

function getBestClasses(newClassification: any): Map<number, number> {
  if (newClassification === undefined) return new Map();
  const maxValues: Map<number, number> = new Map();
  let transientArray = [...newClassification];
  for (let index = 0; index < 5; index++) {
    const element = Math.max(...transientArray);
    const elementIndex = newClassification.indexOf(element);
    maxValues.set(elementIndex, element * 100);
    transientArray.splice(transientArray.indexOf(element), 1);
  }
  return maxValues;
}

const socket = io("http://localhost:9000", {
  path: "/socket.io",
  transports: ["websocket"],
  reconnectionDelayMax: 1000,
  timeout: 1000,
});

const images = (id: number) => {
  const image = new Image();
  image.src = "/images/verkehrszeichen/" + id + ".png";
  return image;
};

export default function Home() {
  const [imageBase64, setImageBase64] = useState<string>("");
  const [classification, setClassification] = useState<Map<number, number>>();
  const [language, setLanguage] = useState<"de" | "en">("de");

  useEffect(() => {
    const image_interval = setInterval(() => {
      socket.emit("image");
    }, 50);

    const classification_interval = setInterval(() => {
      socket.emit("classification");
    }, 500);

    socket.on("image", (value) => {
      setImageBase64(convertToBase64(value));
    });

    socket.on("classification", (value) => {
      setClassification(getBestClasses(value[0]));
    });

    return () => {
      socket.off("image");
      socket.off("classification");
      clearInterval(image_interval);
      clearInterval(classification_interval);
    };
  }, [classification]);

  const data = {
    labels: classification
      ? Array.from(classification.keys())
      : [0, 0, 0, 0, 0],
    datasets: [
      {
        label: "Image labels",
        data: classification
          ? Array.from(classification.values())
          : [0, 0, 0, 0, 0],
        backgroundColor: [
          "#FF6835",
          "#FF6835",
          "#FF6835",
          "#FF6835",
          "#FF6835",
        ],
      },
    ],
  };

  const options: any = {
    indexAxis: "x" as const,
    animation: {
      duration: 2000,
    },
    elements: {},
    scales: {
      x: {
        ticks: {
          color: "rgba(0,0,0,0)",
          padding: 30,
        },
      },
      y: {
        position: "right",
        suggestedMax: 100,
        grid: {
          color: "#b9b2aa",
        },
        ticks: {
          color: "#b9b2aa",
          font: {
            size: 14,
          },
          stepSize: 20,
        },
      },
    },
    layout: {
      padding: {
        top: 30,
      },
    },
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: "black",
        font: { family: "SpaceGrotesk", size: 15, weight: "bold" },
        anchor: "end",
        align: "end",
        z: 100,
        formatter: Math.round,
      },
    },
    maintainAspectRatio: false,
  };

  const imageAsLabel: Plugin = {
    id: "imageAsLabel",
    beforeDatasetDraw: (chart) => {
      const ctx = chart.ctx;
      const xAxis = chart.scales["x"];
      const yAxis = chart.scales["y"];
      
      xAxis.ticks.forEach((value, index) => {
        let x = xAxis.getPixelForTick(index);
        ctx.drawImage(
          images(Number(value.label)),
          x - 25,
          yAxis.bottom + 25,
          50,
          50
        );
      });
    },
  };

  return (
    <Flex
      height={"100vh"}
      width={"100vw"}
      bgColor={"#E8E1D7"}
      justifyContent="center"
    >
      <Flex
        marginTop={"8vh"}
        marginBottom={"5vh"}
        marginX={"80px"}
        borderBottom={"1px"}
        borderTop={"1px"}
        paddingY={"5vh"}
        width={"100%"}
      >
        <Grid
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(3, 1fr)"
          gap="5vh"
          width={"100%"}
        >
          <GridItem rowSpan={2} colSpan={1}>
            <VStack
              justifyContent={"space-between"}
              alignItems={"flex-start"}
              height={"100%"}
              pr={"20px"}
              pb={"00px"}
            >
              {language === "de" ? (
                <Heading fontSize={"80px"} lineHeight={"96px"}>
                  DIE KI FAHRSCHULE
                </Heading>
              ) : (
                <Heading fontSize={"60px"} lineHeight={"86px"}>
                  THE AI DRIVING SCHOOL
                </Heading>
              )}

              <VStack alignItems={"flex-start"} gap="50px">
                {language === "de" ? (
                  <Text fontSize={"18px"} lineHeight={"30px"}>
                    Die Wahrscheinlichkeit, die dieses Exponat anzeigt, basieren
                    auf den Ergebnissen eines KI-Modells, das auf einer Vielzahl
                    von Verkehrszeichen trainiert wurde. Die Werte spiegeln die
                    Unsicherheit und Variabilität wider, die bei der
                    Interpretation von Verkehrszeichen auftreten können.
                  </Text>
                ) : (
                  <Text fontSize={"18px"} lineHeight={"30px"}>
                    The probabilities shown in this exhibit are based on the
                    results of an AI model that has been trained on a large
                    number of traffic signs. The values reflect the uncertainty
                    and variability that can occur when interpreting traffic
                    signs.
                  </Text>
                )}
                <Button
                  backgroundColor={"#DBC0A7"}
                  fontSize={"22px"}
                  fontWeight={"400"}
                  px="35px"
                  borderRadius={"30px"}
                  height={"50px"}
                  onClick={() => setLanguage(language === "de" ? "en" : "de")}
                >
                  {language === "de" ? "ENGLISH" : "DEUTSCH"}
                </Button>
              </VStack>
            </VStack>
          </GridItem>
          <GridItem colSpan={2} rowSpan={1}>
            <Box h={"47vh"} w={"47vh"} borderRadius="30px" overflow={"hidden"}>
              <ReactImage src={imageBase64} h="100%" w="100%" />
            </Box>
          </GridItem>
          <GridItem
            display={"flex"}
            colSpan={2}
            rowSpan={1}
            alignItems={"flex-end"}
          >
            <Box h={"25vh"} w={"100%"} background={"none"}>
              <Bar
                color="#b3aca4"
                options={options}
                data={data}
                plugins={[ChartDataLabels, imageAsLabel]}
              />
            </Box>
          </GridItem>
        </Grid>
      </Flex>
    </Flex>
  );
}
