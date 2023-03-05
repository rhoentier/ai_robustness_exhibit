import axios from "axios";
import { useQuery } from "react-query";

const client = axios.create({
  baseURL: "http://localhost:5000/api/",
});

async function fetchImage(): Promise<ArrayBuffer> {
  const { data } = await client.get("get_image", {
    responseType: "arraybuffer",
  });

  return data;
}

export function useGetImage() {
  return useQuery("liveImage", () => fetchImage());
}

async function fetchClassification() {
  const { data } = await client.get("get_classification");

  return data[0];
}

export function useGetClassification() {
  return useQuery("classification", () => fetchClassification());
}

async function updateCameraId(id: number) {
  await client.get(`set_webcam?id=${id}`);
}

export function useSendCameraId(id: number) {
  if (id < 0 || id > 6) return;
  updateCameraId(id);
}

async function fetchCameraId(): Promise<number> {
  const { data } = await client.get(`get_webcam`);
  return data;
}

export function useGetCameraId() {
  return useQuery("webcam_id", () => fetchCameraId());
}

export function convertToBase64(buffer: ArrayBuffer | undefined) {
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

async function updateStartX(id: number) {
  await client.get(`set_rectangle?start_x=${id}`);
}

export function useSendStartX(id: number) {
  updateStartX(id);
}

async function updateStartY(id: number) {
  await client.get(`set_rectangle?start_y=${id}`);
}

export function useSendStartY(id: number) {
  updateStartY(id);
}

async function updateSize(id: number) {
  await client.get(`set_rectangle?size=${id}`);
}

export function useSendSize(id: number) {
  updateSize(id);
}

async function fetchCameraPosition(): Promise<number[]> {
  const { data } = await client.get(`get_webcam_position`);
  return data;
}

export function useGetCameraPosition() {
  return useQuery("webcam_position", () => fetchCameraPosition());
}

async function fetchHeatmap(): Promise<ArrayBuffer> {
  const { data } = await client.get("get_heatmap", {
    responseType: "arraybuffer",
  });

  return data;
}

export function useGetHeatmap() {
  return useQuery("heatmap", () => fetchHeatmap());
}
