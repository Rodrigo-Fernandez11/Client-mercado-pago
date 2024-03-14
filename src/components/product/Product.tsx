// Importamos el archivo de estilos para este componente
import "./Product.css";
import camiseta from "../../assets/camiseta-seleccion.webp";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from "axios";
import { useState } from "react";

// Componente principal que representa un producto
export const Product = () => {
  // Estado local para almacenar el ID de la preferencia de MercadoPago
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  // Inicializamos MercadoPago con nuestras credenciales y configuración
  initMercadoPago(`${import.meta.env.VITE_API_KEY}`, {
    locale: "es-AR",
  });

  // Función asincrónica para crear y obtener la preferencia del producto desde el servidor
  const createPreference = async () => {
    try {
      // Realizamos una solicitud POST al servidor para obtener la preferencia
      const response = await axios.post(
        "http://localhost:3000/create_preference",
        // Propiedades del producto que se enviarán al servidor
        {
          title: "Camiseta Argentina",
          quantity: 1,
          price: 350,
        }
      );

      // Extraemos el ID de la preferencia de la respuesta del servidor
      const { id } = response.data;

      // Retornamos el ID de la preferencia
      return id;
    } catch (error) {
      // En caso de error, mostramos el error en la consola
      console.error("Error al crear la preferencia:", error);
    }
  };

  // Función para manejar el evento de compra
  const handleBuy = async () => {
    try {
      // Invocamos la función createPreference para obtener el ID de la preferencia
      const id = await createPreference();

      // Verificamos si se obtuvo correctamente el ID de la preferencia y lo actualizamos en el estado
      if (id) {
        setPreferenceId(id);
      }
    } catch (error) {
      // En caso de error, mostramos el error en la consola
      console.error("Error al procesar la compra:", error);
    }
  };

  // Renderizamos el componente del producto con su información y botón de compra
  return (
    <div className="card-product-container">
      <div className="card-product">
        <div className="card">
          <img src={camiseta} alt="Product image" />
          <h3>Camiseta Selección Argentina</h3>
          <p className="price">$350</p>
          <button onClick={handleBuy}>Comprar</button>
          {/* Mostramos el componente Wallet si se ha obtenido el ID de la preferencia */}
          {preferenceId && <Wallet initialization={{ preferenceId }} />}
        </div>
      </div>
    </div>
  );
};
