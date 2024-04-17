import express from "express";
import { engine } from "express-handlebars";
import __dirname from "./utils/utils.js";
import { productsRoutes } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.routes.js";
import { productManager } from "./ProductManager.js";
import mongoose from "mongoose";
import routeProducts from "./routes/product.routes.js";
import sessionRouter from "./routes/session.routes.js";
//------
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";




//inicializo express
const app = express();

//view engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "src/views");

//public folder
app.use(express.static("public"));

//milwares request
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //queris

//cookie-parser
app.use(cookieParser("secretCode"));


//session
app.use(session({
  store:MongoStore.create({
    mongoUrl:"mongodb://localhost:27017/ecommerce",
    ttl:40000

  }),
  secret:"secretCode",
  resave:true,
  saveUninitialized:true
}))


//---------------------------Router---------------------
//router products
app.use("/productsFile", productsRoutes);
//routes catrs
app.use("/carts", cartsRouter);
//routes realtime
app.use("/realtimeproducts", viewsRouter);
//routes de producto
app.use("/products", routeProducts);
//router de session
app.use("/session",sessionRouter)
// Home del sitio
app.use("/", viewsRouter);


//coneccion a mongoose
mongoose.connect("mongodb://localhost:27017/ecommerce");

const port = 8080;

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