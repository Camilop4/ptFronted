# ☁️ WeatherApp | Tu Pronóstico del Clima

Esta es una aplicación web simple y eficiente para consultar el clima actual en cualquier ciudad del mundo. Utiliza un enfoque de dos pasos (Geocodificación $\rightarrow$ Clima) para garantizar resultados precisos y rápidos, sin depender de costosas claves de API con restricciones de dominio.

-----

## ✨ Características Principales

  * **Búsqueda Global:** Encuentra el clima de cualquier ciudad usando su nombre.
  * **Datos Clave:** Muestra la temperatura en Celsius, la velocidad del viento y las condiciones climáticas.
  * **Diseño Responsivo:** Funcional en navegadores de escritorio y dispositivos móviles.
  * **Conexión Robusta:** Utiliza APIs gratuitas y abiertas, eliminando problemas de CORS y bloqueos de red.

-----

## 🚀 Cómo Acceder a la Aplicación Web

La forma más rápida y sencilla de usar la aplicación es a través del despliegue en **GitHub Pages**.

### 🔗 Enlace Directo

Puedes acceder a la versión publicada aquí:

> **[Haz Clic Aquí para Abrir ClimInfo](https://camilop4.github.io/ptFronted/)**

### ➡️ Instrucciones de Uso

1.  **Ingresa la Ciudad:** Escribe el nombre de la ciudad que deseas consultar (ej. `Bogotá`, `Tokio`, `Londres`).
2.  **Presiona el Botón:** Haz clic en el botón **"Buscar"** o presiona `Enter`.
3.  **Visualiza Resultados:** La aplicación se desplazará automáticamente para mostrar la temperatura, la velocidad del viento y la condición climática.

-----

## 🛠️ Estructura del Proyecto y Tecnologías

El proyecto fue desarrollado como un ejercicio de *frontend* puro, utilizando las siguientes tecnologías:

  * **HTML5:** Estructura de la aplicación.
  * **CSS3:** Estilos básicos y diseño de la interfaz.
  * **JavaScript (ES6):** Toda la lógica de la aplicación.
  * **jQuery 3.x:** Utilizado para simplificar las llamadas GET y la manipulación del DOM.

### 🌐 APIs Utilizadas

Hemos implementado una robusta arquitectura de doble API para garantizar la fiabilidad:

| Servicio | Propósito | Protocolo |
| :--- | :--- | :--- |
| **openweathermap.org** | **Geocodificación:** Convierte el nombre de la ciudad a coordenadas (Latitud y Longitud). | HTTPS |
| **openweathermap.org** | **Datos del Clima:** Obtiene la información meteorológica actual usando las coordenadas. | HTTPS |

-----

## ⚙️ Configuración y Ejecución Local

Si deseas descargar el código y ejecutarlo en tu máquina:

1.  **Clonar el Repositorio:**

    ```bash
    git clone https://github.com/camilop4/ptFronted.git
    cd ptFronted
    ```

2.  **Servidor Local:** Debido a las políticas de seguridad de los navegadores (CORS/HTTP), el archivo `index.html` debe servirse a través de un servidor local (no se puede abrir directamente con `file:///`).

      * **Opción A (Recomendada):** Usa la extensión **Live Server** de VS Code.
      * **Opción B (Python):** Inicia un servidor simple desde la terminal:
        ```bash
        python3 -m http.server 8000
        ```

3.  **Acceder:** Abre tu navegador y navega a `http://localhost:8000/` o la URL proporcionada por Live Server.

-----

## 🤝 Contribuciones

Si encuentras algún error o tienes sugerencias de mejora (ej. expandir el mapeo de códigos WMO), ¡las contribuciones son bienvenidas\!

1.  Haz un `Fork` del repositorio.
2.  Crea una rama (`git checkout -b feature/nueva-mejora`).
3.  Comitéa tus cambios (`git commit -m 'feat: Añadir humedad a los resultados'`).
4.  Empuja al *branch* (`git push origin feature/nueva-mejora`).
5.  Abre un *Pull Request*.