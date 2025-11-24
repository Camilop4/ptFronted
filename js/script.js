console.log("Bienvenido a la app del clima!");

 	
$(document).ready(function() {
    // *** ¡NO NECESITAMOS API_KEY! ***
    
    $('#search-button').on('mousedown', getWeather); 

    function getWeather() {
        const city = $('#city-input').val().trim(); 
        const $resultDiv = $('#weather-result');

        if (city === '') {
            alert("Por favor, ingresa una ciudad.");
            return;
        }

        $resultDiv.html('<p>Buscando coordenadas...</p>');

        // SOLUCIÓN PARA DISPOSITIVOS MÓVILES/CELULARES
        $('#city-input').blur(); 
        $('html, body').animate({
            scrollTop: $resultDiv.offset().top 
        }, 500);

        setTimeout(function() {
        
            $resultDiv.html('<p>Buscando coordenadas...</p>'); // Muestra el mensaje aquí

            // **************** PASO 1: GEOCODIFICACIÓN (Usando Nominatim, sin clave) ****************
            const geocodingUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;

            $.ajax({
                url: geocodingUrl,
                method: 'GET',
                dataType: 'json',
                timeout: 15000, 
                success: function(data) {
                    if (data.length === 0) {
                        $resultDiv.html('<h3>Ciudad no encontrada.</h3>');
                        return;
                    }
                    
                    const lat = data[0].lat;
                    const lon = data[0].lon;
                    const locationName = data[0].display_name; 
                    
                    getOpenMeteoData(lat, lon, locationName, $resultDiv);
                },
                error: function(jqXHR, textStatus) {
                    const errorMsg = (textStatus === "timeout") 
                        ? 'El servicio de coordenadas tardó demasiado. Intente de nuevo.'
                        : 'Error al obtener coordenadas.';
                    $resultDiv.html(`<h3>Error: ${errorMsg}</h3>`);
                }
            });

        }, 0); // El delay de 0 milisegundos fuerza la ejecución asíncrona
    }

    // ************************************************
    // PASO 2: OBTENER DATOS DEL CLIMA CON OPEN-METEO
    // ************************************************
    function getOpenMeteoData(lat, lon, locationName, $resultDiv) {
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
                
                displayWeather(data, lat, lon, locationName, $resultDiv);
            },
            error: function() {
                $resultDiv.html('<h3>Error al conectar con la API de Open-Meteo.</h3>');
            }
        });
    }

    // ************************************************
    // FUNCIÓN DE EXTRACCIÓN Y RENDERIZADO
    // ************************************************
    function displayWeather(data, locationName, $resultDiv) {
        
        try {
            const WMO_CODES = {
                0: 'Despejado ☀️', 1: 'Mayormente Despejado', 2: 'Parcialmente Nublado 🌥️', 
                3: 'Nublado ☁️', 45: 'Niebla 🌫️', 48: 'Niebla con Escarcha',
                51: 'Llovizna Ligera', 61: 'Lluvia Ligera 🌧️', 63: 'Lluvia Moderada',
                80: 'Chubascos Ligeros', 95: 'Tormenta Eléctrica ⛈️'
            };

            const weatherData = data.current_weather; 
            
            // ** VERIFICACIÓN ESTRICTA **
            if (!weatherData || weatherData.temperature === undefined) {
                throw new Error("Estructura de datos incompleta de Open-Meteo.");
            }

            const temperature = weatherData.temperature;
            const windspeed = weatherData.windspeed;
            const weatherCode = weatherData.weather_code;
            const description = WMO_CODES[weatherCode] || `Código WMO: ${weatherCode}`;
            
            const parts = locationName.split(', ');
            const cityAndCountry = `${parts[0]}, ${parts[parts.length - 1]}`;
            
            const html = `
                <h2>Clima actual en ${cityAndCountry}</h2>
                <div class="weather-info">
                    <p>Temperatura: **${temperature}°C**</p>
                    <p>Velocidad del Viento: **${windspeed} km/h**</p>
                    <p>Condición: **${description}**</p>
                </div>
                <pre style="font-size: 0.8em; margin-top: 10px;">${JSON.stringify(data, null, 2)}</pre>
            `;
            $resultDiv.html(html);

        } catch (e) {
            // Si hay cualquier error en el renderizado, lo mostramos visiblemente
            $resultDiv.html(`<h3>¡Error de Renderizado!</h3><p>Fallo al procesar los datos recibidos. Mensaje: ${e.message}</p>`);
        }
    }
});