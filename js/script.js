console.log("Bienvenido a la app del clima!");

 	
$(document).ready(function() {
    // ⚠️ ATENCIÓN: Esta clave es la que proporcionaste.
    const API_KEY = "c519a267c1ad46828ec202236252411"; 
    
    // Asumiendo que el ID de tu botón es 'search-button'
    $('#search-button').on('click', getWeather); 

    function getWeather() {
        const city = $('#city-input').val().trim(); 
        const $resultDiv = $('#weather-result');

        if (city === '') {
            $resultDiv.html('<h3>Por favor, ingresa una ciudad.</h3>');
            return;
        }

        $resultDiv.html('<p>Buscando datos del clima...</p>');

        // URL robusta de WeatherAPI
        const weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`;

        // **************** LLAMADA AJAX LIMPIA ****************
        $.ajax({
            url: weatherApiUrl,
            method: 'GET',
            dataType: 'json',
            
            success: function(data) {
                // Verificar errores (ej: clave inválida o ciudad no encontrada)
                if (data.error) {
                    // Muestra el mensaje de error de la API
                    $resultDiv.html(`<h3>Error: ${data.error.message}</h3>`);
                    return;
                }
                
                displayWeather(data, $resultDiv);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // Si esto falla, verifica la consola para errores 401 o 403
                console.error("Fallo en la conexión de la API:", jqXHR.status, textStatus);
                $resultDiv.html(`<h3>Error ${jqXHR.status}: No se pudo obtener la información.</h3>`);
            }
        });
    }

    // ************************************************
    // FUNCIÓN DE EXTRACCIÓN Y RENDERIZADO
    // ************************************************
    function displayWeather(data, $resultDiv) {
        const cityName = data.location.name;
        const country = data.location.country;
        
        const temperature = data.current.temp_c; 
        const humidity = data.current.humidity;
        const weatherDescription = data.current.condition.text;

        const html = `
            <h2>Clima actual en ${cityName}, ${country}</h2>
            <div class="weather-info">
                <p>Temperatura: **${temperature}°C**</p>
                <p>Humedad: **${humidity}%**</p>
                <p>Condiciones: **${weatherDescription}**</p>
            </div>
        `;
        $resultDiv.html(html);
    }
});