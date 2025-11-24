console.log("Bienvenido a la app del clima!");

 	
$(document).ready(function() {
    // *** ¡NO NECESITAMOS API_KEY! ***
    
    $('#search-button').on('click', getWeather); 

    const WMO_CODES = {
        0: 'Despejado ☀️', 1: 'Mayormente Despejado', 2: 'Parcialmente Nublado 🌥️', 
        3: 'Nublado ☁️', 45: 'Niebla 🌫️', 48: 'Niebla con Escarcha',
        51: 'Llovizna Ligera', 61: 'Lluvia Ligera 🌧️', 63: 'Lluvia Moderada',
        80: 'Chubascos Ligeros', 95: 'Tormenta Eléctrica ⛈️'
    };

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

        // **************** PASO 1: GEOCODIFICACIÓN (Usando Nominatim, sin clave) ****************
        const geocodingUrl = `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`;

        $.ajax({
            url: geocodingUrl,
            method: 'GET',
            dataType: 'json',
            headers: {
            'Accept': 'application/json'
            },
            success: function(data) {
                
                if (data.length === 0) {
                    $resultDiv.html('<h3>Ciudad no encontrada.</h3>');
                    return;
                }
                
                // Nominatim devuelve 'lat' y 'lon' como strings
                const lat = data[0].lat;
                const lon = data[0].lon;

                // EXTRAEMOS EL NOMBRE COMPLETO DE LA UBICACIÓN DE NOMINATIM
                const locationName = data[0].display_name;
                
                // Continuar al Paso 2
                getOpenMeteoData(lat, lon, locationName, $resultDiv);
            },
            error: function() {
                $resultDiv.html('<h3>Error al obtener coordenadas.</h3>');
            }
        });
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
            headers: {
            'Accept': 'application/json'
            },
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
        
        const weatherData = data.current_weather; 
        
        const temperature = weatherData.temperature;
        const windspeed = weatherData.windspeed;
        
        // CORRECCIÓN FINAL: Accedemos al código WMO y usamos el mapeo
        const weatherCode = weatherData.weather_code;
        const description = WMO_CODES[weatherCode] || `Código WMO: ${weatherCode}`; // Si el código no está en la lista, muestra el número.

        // Limpiamos el nombre de la ubicación para mostrar solo la ciudad y el país
        const parts = locationName.split(', ');
        // Tomamos el primer elemento (ciudad) y el último (país)
        const cityAndCountry = `${parts[0]}, ${parts[parts.length - 1]}`;
        
        const html = `
            <h2>Clima actual en ${cityAndCountry}</h2>
            <div class="weather-info">
                <p>Temperatura: **${temperature}°C**</p>
                <p>Velocidad del Viento: **${windspeed} km/h**</p>
                <p>Condición: **${description}**</p>
            </div>
        `;
        $resultDiv.html(html);
    }
});