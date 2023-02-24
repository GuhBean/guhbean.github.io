jQuery(function($) {
  
    // starting dimensions
    var $window = $(window),
        startingSize = $window.width();

    // ending dimensions
    $window.resize(function(e) {
       var endingSize = $window.width();
      
      // -------- MAKING WINDOW BIGGER -------- //
      if ((endingSize > startingSize) & (endingSize < 980)) {
        $("#js-speech").text("Hello!");
      }
      else if ((endingSize > startingSize) & (endingSize > 981) & (endingSize < 1325)) {
        $("#js-speech").text("Um");
      }
      else if ((endingSize > startingSize) & (endingSize > 1326) & (endingSize < 1400)) {
        $("#js-speech").text("Wait a minute!");
      }
      else if ((endingSize > startingSize) & (endingSize > 1401) & (endingSize < 1450)) {
        $("#js-speech").text("*gasp*");
      }
      else if ((endingSize > startingSize) & (endingSize > 1451) & (endingSize < 1650)) {
        $("#js-speech").text("No!");
      }
      else if ((endingSize > startingSize) & (endingSize > 1651) & (endingSize < 2000)) {
        $("#js-speech").text("wwwaaahhhh");
      }
      else if ((endingSize > startingSize) & (endingSize > 2001)) {
        $(window.location.href = '../../escape/me.html');
      }
      
      
      // -------- MAKING WINDOW SMALLER -------- //
      else if ((endingSize < startingSize) & (endingSize < 800)) {
        $("#js-speech").text("♥♡♥");
      }
      else if ((endingSize < startingSize) & (endingSize > 801) & (endingSize < 1000)) {
        $("#js-speech").text("Hey!");
      }
      else if ((endingSize < startingSize) & (endingSize > 1001) & (endingSize < 1340)) {
        $("#js-speech").text("Look");
      }
      else if ((endingSize < startingSize) & (endingSize > 1001) & (endingSize < 1340)) {
        $("#js-speech").text("Look");
      }
      else if ((endingSize < startingSize) & (endingSize > 1341) & (endingSize < 1650)) {
        $("#js-speech").text("*sniff sniff*");
      }
      else if ((endingSize < startingSize) & (endingSize > 1651) & (endingSize < 2000)) {
        $("#js-speech").text("go any further and i will send you away.");
      }
      else if ((endingSize < startingSize) & (endingSize > 2001)) {
        $(window.location.href = '../../escape/me.html');
      }
      else {
        $("#js-speech").html("&nbsp;");
      }

        // Store the new dimensions
        startingSize = endingSize;
    });
});