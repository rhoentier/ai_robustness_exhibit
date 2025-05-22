import {
  Box,
  VStack,
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
          "#e2b799",
          "#e2b799",
          "#e2b799",
          "#e2b799",
          "#e2b799",
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
          color: "#00000000",
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
      bgColor={"#faece0"}
      justifyContent="center"
    >
      <Flex
        marginTop={"5vh"}
        marginBottom={"4vh"}
        marginX={"80px"}
        borderBottom={"1px"}
        borderTop={"1px"}
        paddingY={"5vh"}
        width={"100%"}
      >
        <Grid
          templateRows="repeat(6, 1fr)"
          templateColumns="repeat(6, 1fr)"
          gap="5vh"
          width={"100%"}
        >
          <GridItem rowSpan={6} colSpan={2}>
            <VStack
              justifyContent={"space-between"}
              alignItems={"flex-start"}
              height={"100%"}
              pr={"20px"}
              pb={"0px"}
            >
              <Heading fontSize={"60px"} fontWeight={"bold"}>
                {language === "de"
                  ? "LÄSST SICH DIESE KI TÄUSCHEN?"
                  : "CAN THIS AI BE FOOLED?"}
              </Heading>

              <VStack alignItems={"flex-start"} gap="50px">
                <Text fontSize={"16px"} lineHeight={"30px"}>
                  {language === "de"
                    ? "Die KI wurde mit vielen Verkehrszeichen trainiert. Sie analysiert das Kamerabild und zeigt ihre Vorhersagen als Balken an. Je höher der Balken, desto sicherer ist sich die KI, dass es sich um dieses Verkehrszeichen handelt."
                    : "The AI was trained on many traffic sign images. It analyzes the live camera feed and shows its predictions as bars. The taller the bar, the more confident the AI is in recognizing that sign."}
                </Text>
                <Button
                  backgroundColor={"#e2b799"}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#e2b799",
                      cursor: "none",
                    },
                  }}
                  fontSize={"22px"}
                  fontWeight={"400"}
                  px="35px"
                  borderRadius={"30px"}
                  height={"50px"}
                  cursor={"none"}
                  onClick={() => setLanguage(language === "de" ? "en" : "de")}
                >
                  {language === "de" ? "ENGLISH" : "DEUTSCH"}
                </Button>
              </VStack>
            </VStack>
          </GridItem>
          <GridItem rowSpan={5} colSpan={3}>
            <Box
              h={"55vh"}
              w={"55vh"}
              borderRadius="30px"
              overflow={"hidden"}
              border={"solid 0px yellow"}
            >
              <img
                src={imageBase64}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  margin: 0,
                  padding: 0,
                  border: "solid 0px transparent",
                  borderRadius: "30px",
                  backgroundColor: "#e2b799",
                }}
              />
            </Box>
          </GridItem>
          <GridItem
            rowSpan={5}
            colSpan={1}
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"flex-end"}
          >
            <img
              src={
                language === "de"
                  ? "/images/arrow/Arrow_DE.png"
                  : "/images/arrow/Arrow_EN.png"
              }
              alt=""
            />
          </GridItem>
          <GridItem
            display={"flex"}
            rowSpan={1}
            colSpan={4}
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
