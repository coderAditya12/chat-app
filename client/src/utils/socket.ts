import { API_URL } from "@/lib/api";
import io from "socket.io-client";

export const createSocketConnection = () => {
  return io("http://localhost:5000");
};
