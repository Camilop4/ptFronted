console.log("Bienvenido a la app del clima!");

 	
$(document).ready(function() {
    // *** ¡NO NECESITAMOS API_KEY! ***
    
    $('#search-button').on('click', getWeather); 

    function getWeather() {
        const city = $('#city-input').val().trim(); 
        const $resultDiv = $('#weather-result');

        if (city === '') {
            $resultDiv.html('<h3>Por favor, ingresa una ciudad.</h3>');
            return;
        }

        $resultDiv.html('<p>Buscando coordenadas...</p>');

        // **************** PASO 1: GEOCODIFICACIÓN (Usando Nominatim, sin clave) ****************
        const geocodingUrl = `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`;

        $.ajax({
            url: geocodingUrl,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                // **********************************************
                // SOLUCIÓN PARA DISPOSITIVOS MÓVILES/CELULARES
                // **********************************************
                
                // 1. Quita el foco del input para evitar scroll indeseado
                $('#city-input').blur(); 
                
                // 2. Desplazarse suavemente al área de resultados
                $('html, body').animate({
                    scrollTop: $resultDiv.offset().top 
                }, 500); // 500ms de animación
                
                // **********************************************
                if (data.length === 0) {
                    $resultDiv.html('<h3>Ciudad no encontrada.</h3>');
                    return;
                }
                
                // Nominatim devuelve 'lat' y 'lon' como strings
                const lat = data[0].lat;
                const lon = data[0].lon;
                
                // Continuar al Paso 2
                getOpenMeteoData(lat, lon, $resultDiv);
            },
            error: function() {
                $resultDiv.html('<h3>Error al obtener coordenadas.</h3>');
            }
        });
    }

    // ************************************************
    // PASO 2: OBTENER DATOS DEL CLIMA CON OPEN-METEO
    // ************************************************
    function getOpenMeteoData(lat, lon, $resultDiv) {
        $resultDiv.append('<p>Obteniendo datos del clima...</p>');
        
        // Open-Meteo (sin clave, requiere lat/lon)
        const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius&timezone=auto`;

        $.ajax({
            url: openMeteoUrl,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                // Verificar si hay datos
                if (!data.current_weather) {
                    $resultDiv.html('<h3>No hay datos climáticos disponibles para esta ubicación.</h3>');
                    return;
                }
                
                displayWeather(data, lat, lon, $resultDiv);
            },
            error: function() {
                $resultDiv.html('<h3>Error al conectar con la API de Open-Meteo.</h3>');
            }
        });
    }

    // ************************************************
    // FUNCIÓN DE EXTRACCIÓN Y RENDERIZADO
    // ************************************************
    function displayWeather(data, lat, lon, $resultDiv) {
    // Tabla de mapeo para traducir el código WMO de Open-Meteo a texto
    const WMO_CODES = {
        0: 'Despejado ☀️',
        1: 'Mayormente Despejado',
        2: 'Parcialmente Nublado 🌥️',
        3: 'Nublado ☁️',
        45: 'Niebla 🌫️',
        48: 'Niebla con Escarcha',
        51: 'Llovizna Ligera',
        61: 'Lluvia Ligera 🌧️',
        63: 'Lluvia Moderada',
        80: 'Chubascos Ligeros',
        95: 'Tormenta Eléctrica ⛈️'
        // Se pueden añadir más códigos según la necesidad (ver documentación WMO)
    };

    const weatherData = data.current_weather; // Acceso directo al objeto
    
    // Extracción segura
    const temperature = weatherData.temperature;
    const windspeed = weatherData.windspeed;
    const weatherCode = weatherData.weather_code;
    
    // Mapeo de código a descripción; si no se encuentra el código, usa el código numérico.
    const description = WMO_CODES[weatherCode] || `Código WMO: ${weatherCode}`;

    // Crea el HTML con la información
    const html = `
        <h2>Clima Actual (Lat: ${parseFloat(lat).toFixed(2)}, Lon: ${parseFloat(lon).toFixed(2)})</h2>
        <div class="weather-info">
            <p>Temperatura: **${temperature}°C**</p>
            <p>Velocidad del Viento: **${windspeed} km/h**</p>
            <p>Condición: **${description}**</p>
        </div>
    `;
    $resultDiv.html(html);
}
});