import socketio from "socket.io-client";
import React from "react";

export const socket = socketio.connect("http://127.0.0.1:5000");
export const SocketContext = React.createContext();