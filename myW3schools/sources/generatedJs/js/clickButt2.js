
// jelikoz nejde pouzit syntaxi <script>...</script>
// ve vykreslovani view, pak se spousti js soubor externě, s tim ze je generovan pythonem dopredu
// aby se spustil vzdy ten spravny soubor a ne zadny jiny,
// to je zajisteno indikaci v inputu (#runJs) s nazvem tohoto souboru


class srcclickButt2{

    constructor(){

        //tohle je originalni script, ktery byl puvodne v html
        
        $( ".nahledHtml p" ).click(function() {
          $( this ).slideUp();
        });
        
    }

}


//tohle se generuje pythonem
$(document).on('DOMNodeInserted', '#runJs', function () {

    //spusti jen pripade, ze se jedna o ten spravny script
    var inputRunJs = $('#runJs').val();

    if(inputRunJs == 'js_clickButt2.js'){
        setTimeout(function(){
            var runOriginalSrc = new srcclickButt2();
        });
    }

	$('#runJs').remove();
});
