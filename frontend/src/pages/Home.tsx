import {
  Box,
  VStack,
  HStack,
  Image as ReactImage,
  Flex,
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
import ChartDataLabels, { Context } from "chartjs-plugin-datalabels";
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
  var binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const result = "data:image/image/png;base64," + window.btoa(binary);
  return result;
}

function getBestClasses(newClassification: any): Map<number, number> {
  if (newClassification === undefined) return new Map();
  const maxValues: Map<number, number> = new Map();
  var transientArray = [...newClassification];
  for (let index = 0; index < 5; index++) {
    const element = Math.max(...transientArray);
    const elementIndex = newClassification.indexOf(element);
    maxValues.set(elementIndex, element * 100);
    transientArray.splice(transientArray.indexOf(element), 1);
  }
  console.log(Array.from(maxValues.keys()));
  return maxValues;
}

const socket = io({
  path: "/api/socket.io",
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
  const [image, setImage] = useState(undefined);
  const [classification, setClassification] = useState(undefined);
  const [heatmap, setHeatmap] = useState(undefined);

  useEffect(() => {
    const interval = setInterval(() => {
      socket.emit("image");
      socket.emit("classification");
      socket.emit("heatmap");
    }, 100);

    socket.on("image", (value) => {
      setImage(value);
    });

    socket.on("classification", (value) => {
      setClassification(value[0]);
    });

    socket.on("heatmap", (value) => {
      setHeatmap(value);
    });

    return () => {
      socket.off("image");
      socket.off("classification");
      socket.off("heatmap");
      clearInterval(interval);
    };
  }, [classification]);

  const data = {
    labels: Array.from(getBestClasses(classification).keys()),
    datasets: [
      {
        label: "Image labels",
        data: Array.from(getBestClasses(classification).values()),
        backgroundColor: [
          "#ffee00",
          "#ffffff",
          "#ffffff",
          "#ffffff",
          "#ffffff",
        ],
      },
    ],
  };

  const options: any = {
    indexAxis: "x" as const,
    elements: {
      bar: {
        borderWidth: 0,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.3)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 1)",
          padding: 30,
        },
      },
      y: {
        suggestedMax: 100,
        grid: {
          color: "rgba(255, 255, 255, 0.3)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 1)",
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
        color: "#e84911",
        backgroundColor: function (context: Context) {
          return context.dataset.backgroundColor;
        },
        borderColor: "white",
        borderRadius: 4,
        borderWidth: 2,
        font: { size: 14, weight: "bold" },
        anchor: "end",
        align: "end",
        z: 100,
        padding: { top: 3, bottom: 3, left: 5, right: 5 },
        formatter: Math.round,
      },
    },
    maintainAspectRatio: false,
  };

  const imageAsLabel: Plugin = {
    id: "imageAsLabel",
    afterDraw: (chart) => {
      const ctx = chart.ctx;
      const xAxis = chart.scales["x"];
      const yAxis = chart.scales["y"];
      xAxis.ticks.forEach((value, index) => {
        var x = xAxis.getPixelForTick(index);
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
      bgImage={"/images/robota_bauwand.jpg"}
      justifyContent="center"
    >
      <VStack spacing={"5vh"} justifyContent="center">
        <HStack spacing={"5vh"}>
          <Box
            h={"55vh"}
            w={"55vh"}
            borderRadius="30px"
            overflow={"hidden"}
            border="2px solid #ffee00"
          >
            <ReactImage src={convertToBase64(image)} h="100%" w="100%" />
          </Box>
          <Box
            h={"55vh"}
            w={"55vh"}
            borderRadius="30px"
            overflow={"hidden"}
            border="2px solid #ffee00"
          >
            <ReactImage src={convertToBase64(heatmap)} h="100%" w="100%" />
          </Box>
        </HStack>
        <Box
          h={"30vh"}
          w={"115vh"}
          borderRadius="30px"
          border="2px solid #ffee00"
          background={"#e84911"}
          p="20px"
        >
          <Bar
            color="white"
            options={options}
            data={data}
            plugins={[ChartDataLabels, imageAsLabel]}
          />
        </Box>
      </VStack>
    </Flex>
  );
}
