
// jelikoz nejde pouzit syntaxi <script>...</script>
// ve vykreslovani view, pak se spousti js soubor externě, s tim ze je generovan pythonem dopredu
// aby se spustil vzdy ten spravny soubor a ne zadny jiny,
// to je zajisteno indikaci v inputu (#runJs) s nazvem tohoto souboru


class originalSrc{

    constructor(){

        //tohle je originalni script, ktery byl puvodne v html
        
        var x = 5;
        var y = 6;
        var z = x + y;
        $('.nahledHtml #demo').append( "The value of z is: " + z);        
    }

}


//tohle se generuje pythonem
$(document).on('change', '.comboFile', function (e) {

    //spusti jen pripade, ze se jedna o ten spravny script
    var inputRunJs = $('#runJs').val();

    if(inputRunJs == 'js_prvniJs2.js'){
        setTimeout(function(){
            var runOriginalSrc = new originalSrc();
        });
    }

});
