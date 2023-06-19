
class originalSrc{

    constructor(){

        var x = 5;
        var y = 6;
        var z = x + y;
        document.getElementById("demo").innerHTML = "The value of z is: " + z;

    }

}




$(document).ready(function(){

    //spusti jen p pripade, ze se jedna o ten spravny script
    var inputRunJs = $('#runJs').val();

    if(inputRunJs == 'js_js_prvniJs.js'){
        var runOriginalSrc = new originalSrc();
    }
    
   
});