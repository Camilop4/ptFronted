console.log("Bienvenido a la app del clima!");

$(document).ready(function(){
    const API_KEY = "9a990d6d44b08e346466f5d460b67d0e";

    // cuando se hace click en el botón
    $("#search").click(function(){
       getWeather();
    });

    // cuando se presiona enter en el input
    $("#city").keypress(function(e){
        if(e.which == 13){
            getWeather();
        }
    });

    function getWeather(){
        let city = $("#city").val();

        if(city === ""){
          $("#result").html("<p>Por favor escribe una ciudad</p>");
          return;
        }

        // url de la API
        let url = "https://api.openweathermap.org/data/2.5/weather?q=" 
                  + city + "&units=metric&lang=es&appid=" + API_KEY;

        // llamada ajax
        $.get(url, function(data){
          // datos básicos
          let temp = data.main.temp;
          let desc = data.weather[0].description;
          let hum = data.main.humidity;
          let icon = data.weather[0].icon;

          // icono con https
          let iconUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

          // mostrar resultado
          let html = "<h3>Clima en " + data.name + "</h3>";
          html += "<img src='" + iconUrl + "' alt='icono'>";
          html += "<p>Temperatura: " + temp + " °C</p>";
          html += "<p>Condición: " + desc + "</p>";
          html += "<p>Humedad: " + hum + " %</p>";

          $("#result").html(html);
        })
        .fail(function(){
          $("#result").html("<p>Error: ciudad no encontrada o problema con la API</p>");
        });
    }
});
 	
