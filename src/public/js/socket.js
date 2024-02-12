const socket = io();
// socket.emit("message", "hola me estoy comunicando desde un websocket");

//escucho evento para socket actual y no los demas
socket.on("evento_para_socket_individual", (data) => {
  console.log(data);
});

//escucho evento para los demas socket pero no para el actual
socket.on("evento_para_todos_menos_actual", (data) => {
  console.log(data);
});

//evento para todos
socket.on("evento_para_todos", (data) => {
  console.log(data);
});

const productContainer = document.getElementById("productContainer");
//lista de productos
socket.on("lista", (data) => {
  const productoHTML = data
    .map((element) => {
      return `<h3>Producto: </h3>
      <p> Nombre: ${element.title} </p>
      <p> Descripcion: ${element.description} </p>
      <p> Stick: ${element.stock} </p>
      <p> Precio: ${element.price} </p>
      <p> Codigo: ${element.code} </p>
      `;
    })
    .join("");
  productContainer.innerHTML = productoHTML;
});

const messageInput = document.getElementById("messageInput");
const sendMessageButton = document.getElementById("sendMessageButton");
const messageContainer = document.getElementById("messageContainer");

//productos

sendMessageButton.addEventListener("click", () => {
  const inputText = messageInput.value;
  socket.emit("message", inputText);
  messageInput.value = "";
});

socket.on("messages", (mensajes) => {
  const mensajesHTML = mensajes
    .map((mensaje) => {
      console.log(mensaje.mensaje);
      return `<p> ID: ${mensaje.socketId} : ${mensaje.mensaje} </p>`;
    })
    .join("");
  messageContainer.innerHTML = mensajesHTML;
});

socket.on("products", (product) => {
  console.log("entre");
  console.log(product);
});
