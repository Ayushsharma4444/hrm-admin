import { io } from "socket.io-client";
const token = localStorage.getItem("Token");

const socket = io("http://localhost:5000/", {
  query: {
    cookie: token,
  },
});

export default socket;
