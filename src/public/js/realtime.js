const socket = io();

socket.on("connect", () => {
  console.log("Conexion a Cliente");
});

socket.on("updateProducts", (products) => {
  console.log("Productos actualizados", products);
});