
class vytvorMenu{

    constructor(settings){

        
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
                                        '<input type="radio" name="filterSet" value="keywords">Filter by keywords<br>\n' + 
                                        '<input type="radio" name="filterSet" value="family">Filter by family<br>\n' + 
                                        '<input type="radio" name="filterSet" value="category">Filter by category<br>\n' + 
                                        '\n' + 
                                        '<button class="radioConfirm" id="filterSetConfirm">Confirm</button>\n' + 
                                    '</div>';

        $('.setRadio').remove();                            
        $('#filterCardSettings').append(filterSetAppendStr);

    }

    //prida card setttings do menu
    vytvorCardSetAppendString(){

        var cardSetAppendStr =    '<div class="setRadio" id=cardSetRadio>' +
                                        '<input type="radio" name="cardSet" value="debug">Debug mode<br>\n' + 
                                        '<input type="radio" name="cardSet" value="view">View mode<br>\n' + 
                                        '<input type="radio" name="cardSet" value="debugView">Debug + View mode<br>\n' + 
                                        '\n' + 
                                        '<button class="radioConfirm" id="cardSetConfirm">Confirm</button>\n' + 
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
