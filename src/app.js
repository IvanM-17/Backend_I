import express from "express";
import http from "http";
import { engine } from "express-handlebars";
import { initSocket } from "./socket.js";

import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const server = http.createServer(app);

const io = initSocket(server);

io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);
});

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.json());
app.use(express.static("src/public"));

app.use("/api/products", productsRouter);
app.use("/", viewsRouter);

server.listen(8080, () => {
    console.log("Servidor en puerto 8080");
})