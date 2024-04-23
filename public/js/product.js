
function eliminarProducto(productId) {
  if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
    fetch("/products/del/" + productId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/products/";
        } else {
          alert("Hubo un error al eliminar el producto.");
        }
      })
      .catch((error) => {
        console.error("Error al eliminar el producto:", error);
        alert("Hubo un error al eliminar el producto.");
      });
  }
}
const btnAgregarCart = document.getElementById("btnAgregarCart");

btnAgregarCart.addEventListener("click", async () => {
    let oid=btnAgregarCart.dataset.pid;
    try {
      const agregarCart = await fetch("/carts/661072a4b54f0e51af586bfa/product/"+oid,{
        method: 'PUT'
      })
      window.location.href = "/products/"
    } catch (error) {
      console.log(error);
    }
});

async function addThoCart(productId,cartId) {
  if (confirm("¿Estás seguro de que deseas agregar este producto? ")) {
    fetch("/carts/"+cartId+"/product/" + productId, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/products/";
        } else {
          alert("Hubo un error al eliminar el producto.");
        }
      })
      .catch((error) => {
        console.error("Error al eliminar el producto:", error);
        alert("Hubo un error al eliminar el producto.");
      });
  }
}