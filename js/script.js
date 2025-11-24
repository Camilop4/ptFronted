console.log("Bienvenido a la app del clima!");

 	
$(document).ready(function(){
    const API_KEY = "9a990d6d44b08e346466f5d460b67d0e"

    //Evento de click boton
    $('#search-button').on('click', getWeather);

    //Evento emter
    //13 codigo de la tecla enter
    $('#city-input').on('keypress', function(e){
        if(e.which == 13) {
            getWeather();
        }
    });

    function getWeather(){
        const city = $('#city-input').val().trim();

        if (city === ""){
            alert("Por favor, introduce el nombre de una ciudad.");
            return;
        }

        const $resultDiv = $('#weather-result');
        $resultDiv.html('<p> Buscando cordenadas para' + city +'...</p>');

        //Paso 1 Geocodificacion
        const geocodinUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
        console.log(geocodinUrl);

        $.ajax({
            url: geocodinUrl,
            method: 'GET',
            dataType: 'json',
            cache: false,
            crossDomain: true,
            success: function(data){
                //Verificamos si se encontraron datos y nos da los resultados
                if(data.length == 0){
                    $resultDiv.html('<h3> Ciudad no encontrada </h3>');
                    return;
                }

                //obtenemos las cordenadas de la primera conincidencia
                const lat = data[0].lat;
                const lon = data[0].lon;

                console.log("Coordenadas extraídas:", lat, lon); // AÑADE ESTA LÍNEA

                $resultDiv.html('<p> Coordenas obtenidas. Buscando datos del clima...</p>');

                //Obtenemos el los datos del clima
                getWeatherData(lat, lon, $resultDiv);
            },
            /*error: function(error){
                console.error("Error en el API de Geocodificacion: ", error);
                $resultDiv.html('<h3> Error al obtener las coordenadas. </h3>');
            }*/
            error: function(jqXHR, textStatus, errorThrown) {
                // ESTE ES EL BLOQUE QUE ESTÁ SALTANDO ACTUALMENTE
                console.error("DETALLE DE ERROR EN GEOCODIFICACIÓN:");
                console.error("jqXHR readyState:", jqXHR.readyState); // Debe ser 0
                console.error("Estado del Texto:", textStatus); 
                console.error("Error Lanzado:", errorThrown);

                const errorMessage = `Error de conexión: [${textStatus}]. Revisa tu API Key.`;
                $resultDiv.html(`<h3>${errorMessage}</h3>`);
            }
        });

    }

    function getWeatherData(lat, lon, $resultDiv){
        // units=metric para Celsius, lang=es para resultados en español
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`;

        console.log(weatherUrl);

        $.ajax({
            url: weatherUrl,
            method: 'GET',
            dataType: 'json',
            success: function(data){
                //Extraemos datos requeridos
                const cityName = data.name;
                const temp = data.main.temp.toFixed(1);
                const description = data.weather[0].description;
                const iconCode = data.weather[0].icon;

                // Url para el icono
                const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

                //Renderizamos el resultdado
                const htmlResult = `
                <h3 style="text-transform: capitalize;"> Clima en ${cityName}</h3
                <img src="${iconUrl}" alt="${description}">
                <p>Temperatura: <strong>${temp}°C</strong></p>
                <p>Condicion: <strong>${description}</strong></p>
                <p>Sensacion termica: <strong>${data.main.feels_like.toFixed(1)}°C</strong></p>`;

                $resultDiv.html(htmlResult);
            },
            error: function(error){
                console.log("Error al obtener los datos del clima:", error);
                $resultDiv.html('<h3>Error al obtener los datos del clima.</h3>')
            }
        });
    }
});