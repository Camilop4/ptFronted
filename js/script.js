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
        const geocodingUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;

        $.ajax({
            url: geocodingUrl,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
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
        // La descripción requiere un mapeo del código WMO, pero para simplificar:
        const description = data.current_weather.weather_code;
        
        const html = `
            <h2>Clima Actual (Lat: ${lat}, Lon: ${lon})</h2>
            <div class="weather-info">
                <p>Temperatura: **${data.current_weather.temperature}°C**</p>
                <p>Velocidad del Viento: **${data.current_weather.windspeed} km/h**</p>
                <p>Código de Condición: **${description}**</p>
            </div>
        `;
        $resultDiv.html(html);
    }
});