
class vytvorMenu{

    constructor(settings){

        //jelikoz se jedna o docasnou verzi a GUI bude nakonec stejne asi predelano,
        //zatim disabluji moznosti pod kterymi nebude zadny kod

  

        
        if(settings == "default"){
            this.vytvorVychoziMenu();
        }

        if(settings == "filterSetRadio"){
            this.vytvorFilterSetAppendString();
        }

        if(settings == "cardSetRadio"){
            this.vytvorCardSetAppendString();
        }
        
    }


    //prida vychozi menu
    vytvorVychoziMenu(){

        var filterCardSetAppendStr =    '<div id="filterCardButtSettings">\n' + 
                                        '    <button id="filterSet">Filter Settings</button>\n' + 
                                        '    <button id="cardSet">Card Settings</button>\n' + 
                                        '</div>\n' ;

        $('#filterCardSettings').append(filterCardSetAppendStr);

    }


    //prida filter setttings do menu
    vytvorFilterSetAppendString(){

        var filterSetAppendStr =    '<div class="setRadio" id=filterSetRadio>' +
                                        '<input type="radio" name="filterSet" value="keywords" checked>Filter by keywords<br>\n' + 
                                        '<input type="radio" name="filterSet" value="family" disabled>Filter by family <br>\n' + 
                                        '<input type="radio" name="filterSet" value="category" disabled>Filter by category<br>\n' + 
                                        '\n' + 
                                        '<button class="radioConfirm" id="filterSetConfirm">Confirm</button>\n' + 
                                    '</div>';

        //skryje kod + comba a nahled kodu (pokud je zobrazene, pak se projevi).
        $('.comboFile').remove();
        $("tr").remove();
        $(".nahledHtml").remove();
        $('#showSrc').prop('disabled', true);

        $('.setRadio').remove();                            
        $('#filterCardSettings').append(filterSetAppendStr);

    }

    //prida card setttings do menu
    vytvorCardSetAppendString(){

        var cardSetAppendStr =    '<div class="setRadio" id=cardSetRadio>' +
                                        '<input type="radio" name="cardSet" value="debug" disabled>Debug mode<br>\n' + 
                                        '<input type="radio" name="cardSet" value="view" disabled>View mode<br>\n' + 
                                        '<input type="radio" name="cardSet" value="debugView" disabled>Debug + View mode<br>\n' + 
                                        '\n' + 
                                        '<button class="radioConfirm" id="cardSetConfirm" disabled>Confirm</button>\n' + 
                                    '</div>';
        
        $('.setRadio').remove();  
        $('#filterCardSettings').append(cardSetAppendStr);

    }

}


//ovlada menu pri kliknuti na butt
//pricemz nacita nastaveni
class ovladejMenu{

    constructor(name){
        
        var radioValue = $('input[name=' + name + ']:checked').val();
        //if(radioValue){
        //    alert(radioValue);
        //}

        $('.setRadio').remove();  
        $('#filterCardSettings').append('<input type="text" class="input' + name + '" value="' + radioValue + '"></input>');
        
    }

}


//klikne na tlačítko "Filter Settings"
$(document).on('click', '#filterSet', function (e) {
    $('.filterKeyWord').remove();
    var menu = new vytvorMenu("filterSetRadio");
});

//potvrdí "Filter Settings"
$(document).on('click', '#filterSetConfirm', function (e) {
    var menu = new ovladejMenu("filterSet");
});



//klikne na tlacitko "Card Settings"
$(document).on('click', '#cardSet', function (e) {
    $('.filterKeyWord').remove();
    var menu = new vytvorMenu("cardSetRadio");
});

//potvrdí "Card Settings"
$(document).on('click', '#cardSetConfirm', function (e) {
    var menu = new ovladejMenu("cardSet");
});


$(document).ready(function(){
    var menu = new vytvorMenu("default");
});
