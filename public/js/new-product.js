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
