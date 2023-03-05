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

const socket = io({
  path: "/api/socket.io",
  transports: ["websocket"],
});

export default function Home() {
  useEffect(() => {
    const interval = setInterval(() => {
      // socket.emit("image");
      // socket.emit("classification");
      // socket.emit("heatmap");
      socket.emit("message");
    }, 100);

    socket.on("image", (value) => {
      console.log(value);
    });

    socket.on("classification", (value) => {
      console.log(value);
    });

    socket.on("heatmap", (value) => {
      console.log(value);
    });

    socket.on("message", (value) => {
      console.log(value);
    });

    return () => {
      socket.off("image");
      socket.off("classification");
      socket.off("heatmap");
      clearInterval(interval);
    };
  }, []);

  const data = {
    labels: ["1", "2", "3", "4", "5"],
    datasets: [
      {
        label: "Image labels",
        data: [70, 20, 10, 5, 5],
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

  const images = [
    "/images/schild.jpeg",
    "/images/schild.jpeg",
    "/images/schild.jpeg",
    "/images/schild.jpeg",
    "/images/schild.jpeg",
  ].map((src) => {
    const image = new Image();
    image.src = src;
    return image;
  });

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
        ctx.drawImage(images[index], x - 25, yAxis.bottom + 25, 50, 50);
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
            <ReactImage src="/images/schild.jpeg" h="100%" w="100%" />
          </Box>
          <Box
            h={"55vh"}
            w={"55vh"}
            borderRadius="30px"
            overflow={"hidden"}
            border="2px solid #ffee00"
          >
            <ReactImage src="/images/schild.jpeg" h="100%" w="100%" />
          </Box>
        </HStack>
        <Box
          h={"30vh"}
          w={"115vh"}
          borderRadius="30px"
          overflow={"hidden"}
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
