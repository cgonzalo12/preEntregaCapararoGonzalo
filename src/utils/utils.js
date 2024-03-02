import { fileURLToPath } from "url";
import { dirname } from "path";
//__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

function confirmDelete() {
  if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
    // Si el usuario hace clic en "Aceptar", envía el formulario
    document.getElementById("deleteForm").submit();
  } else {
    // Si el usuario hace clic en "Cancelar", no hace nada
    return false;
  }
}
