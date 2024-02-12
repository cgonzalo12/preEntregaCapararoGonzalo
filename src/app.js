import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils/utils.js";
import { productsRoutes } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.routes.js";
import { productManager } from "./ProductManager.js";
const port = 8080;
//inicializo express
const app = express();

//socket
const mensajes = [];

const httpServer = app.listen(port, (req, res) => {
  console.log(`escuchando el puerto ${port}`);
});
const socketServer = new Server(httpServer);
socketServer.on("connection", (socket) => {
  console.log("nuevo cliente conectado!");

  socket.on("message", (data) => {
    mensajes.push({ socketId: socket.id, mensaje: data });
    socketServer.emit("message", data);
    socketServer.emit("messages", mensajes);
  });
  socket.emit("messages", mensajes);

  //lista de productos
  socketServer.emit("listaProd", async () => {
    try {
      let products = await productManager.getProducts();
      socketServer.emit("lista", products);
    } catch (error) {
      console.log(`error al cargar productos, ${{ error }} `);
    }
  });

  //eventop para el acutal
  socket.emit(
    "evento_para_socket_individual",
    "este mensaje solo lo debe recibir el socket actual!"
  );
  //evento para los demas, menos para el actual
  socket.broadcast.emit(
    "evento_para_todos_menos_actual",
    "se conecto otro cliente!"
  );
  //evento para todos
  socketServer.emit(
    "evento_para_todos",
    "este evento esta sicneod escuchado por todos!!!"
  );
});
//view engine
app.engine("handlebars", handlebars.engine()); //motor de plantilla
app.set("views", __dirname + "/views"); //indico donde estan las vi stas
app.set("view engine", "handlebars"); //indica el motor de plantilla q ya iniciamos arriba

//public folder
app.use(express.static(__dirname + "/public"));

//milwares request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//router products
app.use("/products", productsRoutes);
//routes catrs
app.use("/api/carts", cartsRouter);
//routes realtime
app.use("/realtimeproducts", viewsRouter);
