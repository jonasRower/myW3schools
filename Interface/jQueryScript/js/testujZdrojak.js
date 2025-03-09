//testuje zdrojak, zda obsahuje vsechny uzavrene tagy
//slouzi pro prohlizeni dat na consoli, jelikoz zdrojak je neprehledny
//radek cca 100 ukazuje jednotlive radky v poli (na konzoli)
//radek cca 24 ukazuje vsechna data

class testSrc {

    constructor(){

        this.posledniChybaNaRadku;

        var srcData = $('#tableSrc').html();
        
        //vymaze prazdne radky
        var srcDataRadky = this.vymazPrazdneRadky(srcData);
        
        //opravi data
        var srcDataRadkyRepair = this.opravRadky(srcDataRadky);
        var srcDataNew = this.prevedRadkyNaStr(srcDataRadkyRepair);
       


        //zde jsou vsecha data
       // console.log(srcDataRadky);
       

        //$("tbody").remove();
        //$("table").append(srcDataNew);

       // console.log(this.posledniChybaNaRadku);
        
    }


    //prevede zpet radky na string
    prevedRadkyNaStr(srcRadky){

        var srcDataNew = '';

        for (let i = 0; i < srcRadky.length; i++) {
            var radek = srcRadky[i];
            srcDataNew = srcDataNew + radek + '\n';
        }

        return(srcDataNew);

    }


    //aby byly data prehlednejsi odmazava prazdne radky
    vymazPrazdneRadky(srcData){

        var srcDataRadky = srcData.split('\n');
        var srcDataRadkyNew = [];

        for (let i = 0; i < srcDataRadky.length; i++) {
            
            var radek = srcDataRadky[i];
            if(radek.trim() != ''){
                srcDataRadkyNew.push(radek);
            }

        }
        
        return(srcDataRadkyNew);
        
    }


    //opravuje radky, kde detekuje chybu
    opravRadky(srcDataRadky){

        var srcDataRadkyRepair = [];

        for (let i = 0; i < srcDataRadky.length; i++) {
            var radek = srcDataRadky[i];
            var radekNew = this.vratOpravenyRadek(radek, i);

            srcDataRadkyRepair.push(radekNew);
        }

        return(srcDataRadkyRepair);

    }


    vratOpravenyRadek(radek, indexRadku){

        //console.log(indexRadku);
        var radekNewComplet = '';

        var rozdelenyRadek = this.rozdelRadek(radek);
        var odsazeniArr = this.ziskejOdsazeniArr(rozdelenyRadek);

        //console.log(rozdelenyRadek);
        var rozdelenyRadekOdsaz = this.odsadRozdelenyRadek(rozdelenyRadek, odsazeniArr);

        //opraví poslední řádek
        //rozdelenyRadekOdsaz = this.opravEndTd(rozdelenyRadekOdsaz, odsazeniArr, indexRadku);

        if(indexRadku == 351){
            //console.log(indexRadku);
            console.log(rozdelenyRadekOdsaz);
        }
        

        /*
        //pokud nebylo nic opraveno, pak radekNewComplet = radek;
        if(rozdelenyRadekOdsaz == false){
            radekNewComplet = radek;
        }
        else{   //pokud bylo neco opraveno, pak se slozi radek znovu
            for (let i = 0; i < rozdelenyRadekOdsaz.length; i++) {
                var radekNew = rozdelenyRadekOdsaz[i];
                radekNewComplet = radekNewComplet + radekNew;
            }
        }

        console.log(rozdelenyRadekOdsaz);
        */

        return(radekNewComplet);

    }


    //opravuje, pokud detekuje, ze chybi </td>
    opravEndTd(rozdelenyRadekOdsaz, odsazeniArr, indexRadku){

        var jeTamChyba = false;
        console.log(indexRadku);
        console.log(rozdelenyRadekOdsaz);

        var posledniOdsazeni = odsazeniArr[odsazeniArr.length-1];
        var posledniRadek = rozdelenyRadekOdsaz[rozdelenyRadekOdsaz.length-1];
        
        //f(posledniOdsazeni > 0){
            
            //if(posledniRadek.trim() == ''){
            
                var jeTamTd = this.detekujSubstr(rozdelenyRadekOdsaz, '</td>');
             //   console.log(jeTamTd);
                if(jeTamTd == false){
                    //posledniRadek = posledniRadek + '</td>';

                    //prepise posledni radek
                    rozdelenyRadekOdsaz[rozdelenyRadekOdsaz.length-1] = posledniRadek;
                    jeTamChyba = true;

                    this.posledniChybaNaRadku = indexRadku;    
                }

            //}
        //}

        //kdyz tam je chyba, pak vraci opravena data
        if(jeTamChyba == true){
            return(rozdelenyRadekOdsaz);
        }
        else{
            return(false); //jinak vraci false, aby vedel, ze nic nebylo opraveno
        }

    }


    ziskejOdsazeniArr(rozdelenyRadek){

        var odsazeni = 0;
        var startTagPredch;
        var odsazeniArr = [];

        for (let i = 0; i < rozdelenyRadek.length; i++) {

            var radek = rozdelenyRadek[i];

            var obsahujeEndTag = this.detekujSubstr(radek, '</');
            var obsahujeStartTag = false;

            if(obsahujeEndTag == false){
                obsahujeStartTag = this.detekujSubstr(radek, '<');
            }

            //zjistuje odsazeni
            if(obsahujeStartTag == true){ 
                //odsazeni = odsazeni + 1;
            }

            if(obsahujeEndTag == true){
                odsazeni = odsazeni - 1;
            }

            if(obsahujeStartTag == false){
                if(obsahujeEndTag == false){
                    if(startTagPredch == true){
                        odsazeni = odsazeni + 1;
                    }
                }
            }

            odsazeniArr.push(odsazeni);
            startTagPredch = obsahujeStartTag;

        }

        return(odsazeniArr);

    }


    odsadRozdelenyRadek(rozdelenyRadek, odsazeniArr){

        var rozdelenyRadekOdsaz = [];

        for (let i = 0; i < rozdelenyRadek.length; i++) {

            var odsazeni = odsazeniArr[i];
            var radek = rozdelenyRadek[i];
            var mezera = this.vratMezeryPredOdsazenim(odsazeni, 5);
            var radekOds = mezera + radek;

            rozdelenyRadekOdsaz.push(radekOds);
            odsazeniArr.push(odsazeni);

        }

        return(rozdelenyRadekOdsaz);
        
    }


    vratMezeryPredOdsazenim(odsazeni, nasobekOds){

        var mezera = ''
        for (let i = 0; i < odsazeni*nasobekOds; i++) {
            mezera = mezera + ' ';
        }

        return(mezera);

    }


    rozdelRadek(radek){

        var indexyRozdel = this.ziskejIndexyProZnacekTagu(radek);
        var radekArr = [];
 

        if(indexyRozdel.length > 0 ){

            var indOt = indexyRozdel[0][0];
            var indZav = indexyRozdel[0][1]+1;

            for (let i = 1; i < indexyRozdel.length; i++) {
            
                var substr = radek.substring(indOt, indZav);
                radekArr.push(substr);

                indOt = indexyRozdel[i][0];

                var substr = radek.substring(indZav, indOt);
                radekArr.push(substr);

                indZav = indexyRozdel[i][1]+1;
                

            }

            var substr = radek.substring(indOt, indZav);
            radekArr.push(substr);

        }

        //console.log(radek);
        return(radekArr);

    }


    ziskejIndexyProZnacekTagu(radek){

        var indexyRozdel = []
        var indOt;
        var indZav;

        for (let i = 0; i < radek.length; i++) {
            
            var znak = radek[i];
            
            if(znak == '<'){
                indOt = i;
            }

            if(znak == '>'){

                indZav = i;

                var indexyOtZav = [];
                indexyOtZav.push(indOt);
                indexyOtZav.push(indZav);

                indexyRozdel.push(indexyOtZav);

                //vynuluje do dalsiho cyklu, kdyz by byla chyba aby ji rozpoznal
                indOt = -1;
                indZav = -1;

            }

        }

        return(indexyRozdel)

    }

    detekujSubstr(text, substr){

        var radekObsahujeSubstr = false;
        var ind = text.indexOf(substr)
        if(ind > -1){
            radekObsahujeSubstr = true;
        }

        return(radekObsahujeSubstr);

    }

}


$(document).on('DOMNodeInserted', '#lastRow', function () {

    var testujTabulkuHtml = new testSrc();

});



/*
$(document).ready(function(){
    alert('test');
});
*/

/*
var jizTestovano = true;
var srcJsHtml;
var srcJsHtmlNew = -1;

//udalost prijimajici data z scriptTree (pri kliknuti do stromu)
$(document).on('DOMNodeInserted', 'table', function () {
/*
    //setTimeout(function(){
        if(jizTestovano == true){
            alert('test');
            jizTestovano = false;
        }
    //});
*/

/*
    console.log('testujZdrojak');
    setTimeout(function(){
        srcJsHtmlNew = $('table').html();
        if (srcJsHtmlNew == srcJsHtml){
            srcJsHtml = srcJsHtmlNew;
            console.log(srcJsHtml);
        }
    }, 500);

});

*/