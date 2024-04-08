function deleteTheCart(cartId,productId) {
  console.log("/carts/"+cartId+"/product/" + productId);
    if (confirm("¿Estás seguro de que deseas agregar este producto?")) {
      fetch("/carts/"+cartId+"/product/" + productId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            window.location.href = "/carts/cart/"+cartId;
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

  const btnClearCart=document.getElementById("btnClearCart")

  btnClearCart.addEventListener("click", async ()=>{
    let cartId=btnClearCart.dataset.cid;
    if (confirm("¿Estás seguro de que deseas borrar lo productos?")) {
      fetch("/carts/cart/"+cartId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            window.location.href = "/carts/cart/"+cartId;
          } else {
            alert("Hubo un error al eliminar el producto.");
          }
        })
        .catch((error) => {
          console.error("Error al eliminar el producto:", error);
          alert("Hubo un error al eliminar el producto.");
        });
    }
  })