

class ziskejPoleTextProSoubor{

    constructor(comboWord, selectOptionObj){

        //pokud "selectOptionObj" je object, pak vytvari combo rovnou
        if (typeof selectOptionObj === 'object'){
            this.vytvorComboZObjektu(selectOptionObj);
        }

        //pak se samozrejme "comboWord" neuvazuje, muze byt "undefined"
        else{
            
            if(comboWord == undefined){ //zavola se pri spusteni appky
                console.log(klicovaSlovaArr);
                // pokud jsou globalni data "undefined", pak vytvori pouze globalni data
                // tzn. tato sekce bude spustena z "$(document).ready(function(){" ostatni budou spousteny pomoci uzivatelovy akce
                if(klicovaSlovaArr == undefined){
        
                    var objKey = JSON.parse(keyWords);
                    klicovaSlovaArr = objKey.keyWords;
                    seznamProjektuAll = this.ziskejPoleVsechKlicovychSlov(klicovaSlovaArr, false);
                    seznamAdresAll = this.ziskejPoleVsechKlicovychSlov(klicovaSlovaArr, true);

                    console.log(seznamProjektuAll);
                    console.log(seznamAdresAll);

                }
                else{
                    this.vytvorSelectOptionCombo('keywordSelectWord', klicovaSlovaArr, '#filterKeyWord', 'Keyword');
                    seznamAdresAll = this.ziskejPoleVsechKlicovychSlov(klicovaSlovaArr, true);
                }

            }

            else{  
                //zavola se pri vyberu komba na vyber slova
                var comboWordSpl = comboWord.split('_');
                var comboIndex = comboWordSpl[comboWordSpl.length-1];
            //  console.log(seznamProjektuAll);
                var seznamProjektu = seznamProjektuAll[comboIndex];
                
                //nastavi seznam adres, ktere jsu v combu - jako glob. promenna
                //kdyz pak vybira z comba, pak nehleda polozky v "seznamProjektuAll", ale v "seznamAdressCombo"
                seznamAdressCombo = seznamAdresAll[comboIndex];
                
                //prida combo nove
                this.vytvorSelectOptionCombo('keywordSelectProject', seznamProjektu, '#filterWordProject', 'Project');
            }

        }
        
    }


    vytvorComboZObjektu(selectOptionObj){

        var comboId = selectOptionObj.comboId;
        var optionValues = selectOptionObj.optionValues;
        var idAppend = selectOptionObj.idAppend;
        var wordProject = selectOptionObj.wordProject;

        if(optionValues != undefined){
            this.vytvorSelectOptionCombo(comboId, optionValues, idAppend, wordProject);
        }

    }

    
    vytvorSelectOptionCombo(comboId, optionValues, idAppend, wordProject){

        var filterKeyWordAppendStr = this.pripravSelectOptionAppendStr(comboId, optionValues, wordProject);
       // console.log(filterKeyWordAppendStr);
        
        $(idAppend).append(filterKeyWordAppendStr);
        
    }


    pripravSelectOptionAppendStr(id, optionValues, wordProject){

        var wordProjectLower = wordProject.toLowerCase();
       // console.log(wordProject)
        var appendStrSelect = '';

        if(wordProject == "Keyword"){
            appendStrSelect = '<p class="filterKeyWord">Filter project by keywords:</p>\n';
        }
  
        appendStrSelect = appendStrSelect + '<div class="filterKeyWord" id="selectOption' + wordProject + '">\n' +
                                        '<label>Choose a ' + wordProjectLower + ':</label>\n' +
                                        '<select id="' + id + '">\n';

        for (let i = 0; i < optionValues.length; i++) {
            var polozka = optionValues[i];
            var i1 = '_' + i;
            var optionRadek = '    <option value="' + polozka + i1 + '">' + polozka + '</option>\n';
            appendStrSelect = appendStrSelect + optionRadek;
        }

        appendStrSelect = appendStrSelect + '</select>\n' + 
                                            '</div>\n';

        return(appendStrSelect);

    }
    

    ziskejPoleVsechKlicovychSlov(klicovaSlovaArr, adresy){

        var seznamProjektuAll = []

        for (let i = 0; i < klicovaSlovaArr.length; i++) {

            var klicoveSlovo = klicovaSlovaArr[i];
            var detekujSoubory = new detekujZdaSouboryObsahujeKlicoveSlovo(klicoveSlovo);

            var htmlNameSKlicSlovem;

            //zapise data do globalni promenne
            if(adresy == false){
                htmlNameSKlicSlovem = detekujSoubory.getHtmlNameSKlicovymiSlovy();
            }
            else{
                htmlNameSKlicSlovem = detekujSoubory.getHtmlNameAdresy();
            }
            
            seznamProjektuAll.push(htmlNameSKlicSlovem);

        }

        return(seznamProjektuAll);

    }

}



class detekujZdaSouboryObsahujeKlicoveSlovo{

    constructor(klicoveSlovo){

        this.objJsonFiles = JSON.parse(jsonFiles);
        this.ziskejPoleJsonName(this.objJsonFiles);

        poleJsonName = this.ziskejPoleJsonName(this.objJsonFiles);
       // console.log(poleJsonName);
        var poleTextAll = this.ziskejPoleVsechTextu(poleJsonName);
      //  console.log(poleTextAll);

        var nameAdresaArr = this.projdiVsechnyPoleADetekujKlicoveSlovo(poleTextAll, klicoveSlovo);
        this.htmlNameSKlicovymiSlovy = this.vratSubPoleDleIndexu(nameAdresaArr, 0);
        this.htmlNameAdresy = this.vratSubPoleDleIndexu(nameAdresaArr, 1);
       

       // console.log(this.htmlNameSKlicovymiSlovy);
    }


    //vrati seznam vsech html s danym klicovym slovem
    getHtmlNameSKlicovymiSlovy(){
      //  console.log(this.htmlNameSKlicovymiSlovy);
        return(this.htmlNameSKlicovymiSlovy);
    }


    getHtmlNameAdresy(){
        return(this.htmlNameAdresy);
    }


    vratSubPoleDleIndexu(pole, index){

        var poleNew = [];

        for (let i = 0; i < pole.length; i++) {
            var polozka = pole[i][index];
            poleNew.push(polozka);
        }

        return(poleNew);

    }


    projdiVsechnyPoleADetekujKlicoveSlovo(poleTextAll, klicoveSlovo){

        var htmlNameSKlicovymiSlovy = []

        for (let i = 0; i < poleTextAll.length; i++) {
            var poleText = poleTextAll[i];
            var poleTextObsahujeKlicoveSlovo = this.detekujZdaPoleTextObsahujeKlicoveSlovo(poleText, klicoveSlovo);
            if(poleTextObsahujeKlicoveSlovo == true){
                
                var nameAdresa = [];
                var htmlName = poleText[0];
                var adresa = poleText[1];

                nameAdresa.push(htmlName);
                nameAdresa.push(adresa);

                htmlNameSKlicovymiSlovy.push(nameAdresa);

            }
        }

        return(htmlNameSKlicovymiSlovy);

    }


    ziskejPoleJsonName(objJsonFiles){

        var jsonNamePole = [];

        for (let i = 0; i < objJsonFiles.files.length; i++) {

            var jsonName = objJsonFiles.files[i].jsonHtml.jsonName;
            var htmlName = objJsonFiles.files[i].jsonHtml.htmlName;
            var jsonNameJson = jsonName.replace('.json', '');
            var htmlNameSpl = htmlName.split('/');
            var htmlNameFile = htmlNameSpl[htmlNameSpl.length-1];

            var jsonHtml = []
            jsonHtml.push(jsonNameJson);
            jsonHtml.push(htmlNameFile);
            jsonHtml.push(htmlName);

            jsonNamePole.push(jsonHtml);
        }

        return(jsonNamePole);

    }


    ziskejPoleVsechTextu(poleJsonName){

        var poleTextAll = [];

        for (let i = 0; i < poleJsonName.length; i++) {

            var jsonName = poleJsonName[i][0];
            var htmlName = poleJsonName[i][1];
            var htmlNameAddr = poleJsonName[i][2];
            var objTxt = eval(jsonName);

            //console.log(jsonName);
            //console.log(objTxt);
            var objSrc = JSON.parse(objTxt);
            
       
            var poleTagBool = this.vratPoleRowNumTypeText('tagBool', undefined, objSrc);
            var poleText = this.vratPoleRowNumTypeText('text', poleTagBool, objSrc);

            var jsonNamePoleText = []
            jsonNamePoleText.push(htmlName);
            jsonNamePoleText.push(htmlNameAddr);
            jsonNamePoleText = jsonNamePoleText.concat(poleText);

            poleTextAll.push(jsonNamePoleText);

        }

        return(poleTextAll);

    }


    detekujZdaPoleTextObsahujeKlicoveSlovo(poleText, klicoveSlovo){

        var poleTextObsahujeKlicoveSlovo = false;

        for (let i = 2; i < poleText.length; i++) {
            var radek = poleText[i];
            var inddWord = radek.indexOf(klicoveSlovo);
            
            if(inddWord > -1){
                poleTextObsahujeKlicoveSlovo = true;
                break;
            }
        }

        return(poleTextObsahujeKlicoveSlovo);

    }


    vratPoleRowNumTypeText(child, poleTagBool, objSrc){

        var pocetRadku = objSrc.rows.length;

        var polePolozek = [];
        var polozka;

        for (let i = 0; i < pocetRadku; i++) {

            if(child == 'tagBool'){
                var polozkaType = objSrc.rows[i].data.type;
                if(polozkaType == 'noCombo'){
                    polozka = true;     //tagBool - ktery vraci
                };
                if(polozkaType == 'combo'){
                    polozka = false;    //tagBool - ktery vraci
                };
            };
            if(child == 'text'){
                var tagBool = poleTagBool[i];   //tagBool - ktery prijima jako parametr
                if(tagBool == true){
                    polozka = objSrc.rows[i].data.text;
                };
                if(tagBool == false){
                    polozka = objSrc.rows[i].data.text[0].text;
                }
            }

            polePolozek.push(polozka);

        }

        return(polePolozek);

    }

}


// reaguje na 2. combo a vykresli zdrojak do html
class vyhledejProjectHtml{

    constructor(comboProject){

        var comboProjectSpl = comboProject.split('_');
        var comboIndex = comboProjectSpl[comboProjectSpl.length-1];
        var jsonNameData = seznamAdressCombo[comboIndex];

        //nastavi adresu, tak aby mohl predat data
        $('.tree').append('<input type="text" class="inputHtmlName" value="' + jsonNameData + '"></input>');
        
    }

}


// pokud se v jiném filtru nastaví projekt, pak by se měl filtr naztavit zpětně zde:
class nastavZpetneFiltr{

    constructor(cestaSouboru){

        //detekuje zda cesta je platna
        var cestaJePlatna = this.detekujPlatnostAdresy(cestaSouboru);

        if(cestaJePlatna == true){

            //zobrazí "Choose a keyword"
            var zobrazPrvniCombo = new ziskejPoleTextProSoubor(undefined, undefined);
            var indexAdresy = this.vyhledejAdresuZeSeznamAdresAll(cestaSouboru);
            
            var seznamProjektu = seznamProjektuAll[indexAdresy];
            var selectOptionObj = {
                                    'comboId': 'keywordSelectProject',
                                    'optionValues': seznamProjektu,
                                    'idAppend': '#filterWordProject',
                                    'wordProject': 'Project'
                                }
    
            //vytvori combo
            var pridejDruheCombo = new ziskejPoleTextProSoubor(undefined, selectOptionObj);

            //nastavi na aktualni polozku
            var nazevSouboru = this.ziskejNazevSouboruZCesty(cestaSouboru, indexAdresy);
            $('#keywordSelectProject').val(nazevSouboru);

        }
       
    }

    //pokud adresa obsahuje undefined, pak neni platná, to se zjistí zde
    detekujPlatnostAdresy(cestaSouboru){

        var cestaJePlatna = true;
        var cestaSpl = cestaSouboru.split('/')

        for (let i = 0; i < cestaSpl.length; i++) {

            var slozka = cestaSpl[i];
            if(slozka == 'undefined'){
                cestaJePlatna = false;
            }
        }

        return(cestaJePlatna);
    }

    //aby nastavil spravne combo, vybira polozku bv nem,
    //je tedy treba polozku zjistit z cesty
    ziskejNazevSouboruZCesty(cestaSouboru, indexAdresy){

        var cestaSpl = cestaSouboru.split('/');
        var nazevSouboru = cestaSpl[cestaSpl.length-1];

        //je treba nalezt hodnotu val() a ne nikoliv text, proto je potreba pridat index
        var ind = seznamProjektuAll[indexAdresy].indexOf(nazevSouboru);
        var nazevSouboruInd = nazevSouboru + '_' + ind;

        return (nazevSouboruInd);

    }

    vyhledejAdresuZeSeznamAdresAll(cestaSouboruExp){

        var indexAdresy = -1;
        console.log(seznamAdresAll);
        if(seznamAdresAll != undefined){

            for (let i = 0; i < seznamAdresAll.length; i++) {

                var adresyUrovne = seznamAdresAll[i];
                var indCesta = adresyUrovne.indexOf(cestaSouboruExp)

                if(indCesta > -1){
                    indexAdresy = i;
                    break;
                }

            }
        }


        return(indexAdresy);

    }

}


// globalni promenne se nactou pri startu appky
var klicovaSlovaArr = undefined;      //pokud jsou data naplnena, "undefined" se prepise
var seznamProjektuAll = undefined;
var seznamAdresAll = undefined;
var poleJsonName;
var seznamAdressCombo;


//vola tridu pri zmene comba - tim vyhledava spravny json pro vykreslovani
$(document).on('change', '#keywordSelectWord', function (e) {

    $('#selectOptionProject').remove();

    var comboWord = $('#keywordSelectWord').val();
    var zobrazCombo = new ziskejPoleTextProSoubor(comboWord, undefined);

    //současně se skryjí komba dle kategorie
    $('.comboFile').remove();
    $("tr").remove();
    $(".nahledHtml").remove();
    
});


//vola tridu pri zmene comba - tim vyhledava spravny json pro vykreslovani
$(document).on('change', '#keywordSelectProject', function (e) {

    var comboProject = $('#keywordSelectProject').val();
    var vykresliHtml = new vyhledejProjectHtml(comboProject);

});


//udalost, ktera prijima data do tohoto scriptu, pres inputBox
$(document).on('DOMNodeInserted', '.inputfilterSet', function () {

    var inputFilter = $('.inputfilterSet').val();
    
    if(inputFilter == 'keywords'){
        var zobrazCombo = new ziskejPoleTextProSoubor(undefined, undefined);
        $('.inputfilterSet').remove();
    }
    
});


//udalost, ktera prijima data do tohoto scriptu, pres inputBox
//zpetně se nastavuje filtr, dle cesty odeslané z při výběru kategorie
$(document).on('DOMNodeInserted', '.inputAdresFile', function () {
    
    var cestaSouboru = $('.inputAdresFile').val();
    var nsatevniKeyFilter = new nastavZpetneFiltr(cestaSouboru);

    //odebere '#inputTree', jelikoz data jiz prevzal
    $('.inputAdresFile').remove();

});



$(document).ready(function(){

    //vytvori globalni promenne, tak aby nemusel data naciat znovu, pri kliknuti na "Filter Settings"
    var vytvorGlobalniPromenne = new ziskejPoleTextProSoubor(undefined, undefined);
   
});
