
// zkusit to, jak je to udelane tady:
// https://www.geeksforgeeks.org/how-to-access-variables-from-another-file-using-javascript/

// jak vytvořit nové okno je zde a vytvořit html je zde:
// https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_win_open3

//            text = text.replaceAll('<', '&lt;');
//text = text.replaceAll('>', '&gt;');

var srcNewWindow;

class vytvorNahledSrc{

    constructor(){

        srcNewWindow = this.ziskejSrcNewWindow(poleTextSrc, poleRowTypeSrc);

        var myWindow = window.open('', "mozillaTab");
        myWindow.document.write(srcNewWindow);
   
    }


    ziskejSrcNewWindow(poleTextSrc, poleRowType){

        var srcNewWindow = '';

        //test:
        //var data = this.ziskejPoleOdsazeniCss(poleTextSrc, poleRowType)
        
        var poleTextSrcBezTag = this.ziskejPoleRadkuNewTag(poleTextSrc, poleRowType);

        var ziskejDataCss = new ziskejIndexyCss(poleTextSrcBezTag, poleRowType);
        var indexyOtZav = ziskejDataCss.getIndexyOtZav();
        var indexyOt = ziskejDataCss.getIndexyOt();

        var pocetMezerOt = this.zjistiPocetMezerUZavOt(indexyOt, poleTextSrcBezTag);
        var odsazeniVsechnyRadkyPole = this.ziskejOdsazeniProVsechnyRadky(poleTextSrc, indexyOtZav, pocetMezerOt);
        

        for (let i = 0; i < poleTextSrcBezTag.length; i++) {

            var radek = poleTextSrcBezTag[i];
            var pocetMezer = odsazeniVsechnyRadkyPole[i];

            var radekNew = this.vytvorMezeruNaZacatkuRadku(radek, pocetMezer);
            radekNew = radekNew.replaceAll('_', '');
            radekNew = radekNew.replaceAll('</td>', '');
            radekNew = radekNew.replaceAll('<td>', '');
            
            //radekNew = poleTextSrcBezTag[i];
            
            srcNewWindow = srcNewWindow + radekNew + '<br>';

        }

        return(srcNewWindow);

    }


    ziskejOdsazeniProVsechnyRadky(poleTextSrc, indexyOtZav, pocetMezerOt){

        var odsazeniVsechnyRadkyPole = [];

        for (let i = 0; i < poleTextSrc.length; i++) {
            var indexVpoliOdDo = this.detekujIndexVJakemRozmezi(indexyOtZav, i);
            var pocetMezer = -1;
            if(indexVpoliOdDo > -1){
                pocetMezer = pocetMezerOt[indexVpoliOdDo] + 1;
            }

            odsazeniVsechnyRadkyPole.push(pocetMezer);
        }

        return(odsazeniVsechnyRadkyPole);

    }


    detekujIndexVJakemRozmezi(indexyOtZav, index){

        var indexVpoliOdDo = -1;

        for (let i = 0; i < indexyOtZav.length; i++) {

            var indexOd = indexyOtZav[i][0];
            var indexDo = indexyOtZav[i][1];

            if(index > indexOd){
                if(index < indexDo){
                    indexVpoliOdDo = i;
                    break;
                }
            }

        }

        return(indexVpoliOdDo);

    }


    ziskejPoleRadkuNewTag(poleTextSrc, poleRowType){

        var poleTextSrcBezTag = [];

        for (let i = 0; i < poleTextSrc.length; i++) {
            
            var rowType = poleRowType[i];
            var radek = poleTextSrc[i];
            var radekNew = radek;

            if(rowType == 'css'){
                radekNew = radekNew.replaceAll('<td>', '');
                radekNew = radekNew.replaceAll('</td>', '');
            }
            
            radekNew = radekNew.replaceAll('<', '&lt;');
            radekNew = radekNew.replaceAll('>', '&gt;');

            

            poleTextSrcBezTag.push(radekNew);

        }

        return(poleTextSrcBezTag);

    }


    zjistiPocetMezerUZavOt(indexyOt, poleTextSrc){

        var pocetMezerOt = [];

        for (let i = 0; i < indexyOt.length; i++) {
            var indexRadku = indexyOt[i];
            var radek = poleTextSrc[indexRadku];
            var pocetMezer = this.vratPocetMezerProRadek(radek);
            pocetMezerOt.push(pocetMezer);
        }

        return(pocetMezerOt);

    }


    vytvorMezeruNaZacatkuRadku(radek, pocetMezer){

        //je-li pocetMezer = -1, pak se nejedna o css, ale bezne html
        //pak se pocet mezer stanovuje v 'this.vratPocetMezerProRadek(radek)'
        if(pocetMezer == -1){
            pocetMezer = this.vratPocetMezerProRadek(radek);
        }

        var mezera = '';
        for (let i = 0; i < pocetMezer; i++) {
            mezera = mezera + '&emsp;';
        }

        var radekNew = mezera + radek;

        return(radekNew);

    }


    vratPocetMezerProRadek(radek){

        var textSpl = radek.split('');
        var pocetMezer = 0;

        for (let i = 0; i < textSpl.length; i++) {
            var znak = textSpl[i];
            if(znak != '_'){
                pocetMezer = i;
                break;
            }
        }

        return(pocetMezer);

    }

    /*
    //u radku s css nejsou podtrzitka, takze se odsazuje v kodu zde:
    ziskejPoleOdsazeniCss(poleTextSrc, poleRowType){

        var poleZavOt = this.ziskejPoleZavOt(poleTextSrc, poleRowType);
        var indexyZav = this.ziskejPoleIndsexuZav(poleZavOt);
        var dvojiceIndexyZav = this.ziskejDvojiceIndexuZav(indexyZav);
        var indexyOt = this.ziskejIndexyOt(dvojiceIndexyZav, poleTextSrc);

        var indexyOtZav = this.sparujPole(indexyOt, indexyZav);

        //u indexu s otevrenyma zavorkama pokracovat - zde zjistit odsazeni a pouzit pro celou zavorku
        //return(indexyOtZav);

    }
    */

}


class ziskejIndexyCss{

    constructor(poleTextSrc, poleRowType){

        var poleZavOt = this.ziskejPoleZavOt(poleTextSrc, poleRowType);
        var indexyZav = this.ziskejPoleIndsexuZav(poleZavOt);
        var dvojiceIndexyZav = this.ziskejDvojiceIndexuZav(indexyZav);

        this.indexyOt = this.ziskejIndexyOt(dvojiceIndexyZav, poleTextSrc);
        this.indexyOtZav = this.sparujPole(this.indexyOt, indexyZav);

    }


    getIndexyOtZav(){
        return(this.indexyOtZav);
    }


    getIndexyOt(){
        return(this.indexyOt);
    }





    ziskejPoleZavOt(poleTextSrc, poleRowType){

        var jednaSeOOtevrenouZavorku = false;
        var data = []

        for (let i = 0; i < poleTextSrc.length; i++) {
            
            var rowType = poleRowType[i];
            if(rowType == 'css'){
                var radek = poleTextSrc[i];

                if(jednaSeOOtevrenouZavorku == false){
                    var jednaSeOZavrenouZavorku = this.detekujSubstr(radek, '}');

                    if(jednaSeOZavrenouZavorku == true){
                        var jednaSeOOtevrenouZavorku = this.detekujSubstr(radek, '{');

                        data.push('zav ' + rowType + ' ' + i);
                    }

                    else{
                        data.push('ot ' + rowType + ' ' + i);
                    }
                }

            }

            else{
                data.push('-1 ' + rowType + ' ' + i);
            }
            
        }

        return(data);

    }


    sparujPole(indexyOt, indexyZav){

        var seznamDvojic = [];

        for (let i = 0; i <indexyOt.length; i++) {
            var dvojice = [];
            dvojice.push(indexyOt[i]);
            dvojice.push(indexyZav[i]);

            seznamDvojic.push(dvojice);
        }

        return(seznamDvojic);

    }


    ziskejIndexyOt(dvojiceIndexyZav, poleTextSrc){

        var indexyOt = [];

        for (let i = 0; i <dvojiceIndexyZav.length; i++) {

            var indexOd = dvojiceIndexyZav[i][0];
            var indexDo = dvojiceIndexyZav[i][1];

            var indexOt = this.ziskejIndexyOtMeziIndexy(indexOd, indexDo, poleTextSrc);
            indexyOt.push(indexOt);

        }

        return(indexyOt);

    }


    ziskejIndexyOtMeziIndexy(indexOd, indexDo, poleTextSrc){

        var indexOt = -1;

        for (let i = indexOd; i <indexDo; i++) {

            var radek = poleTextSrc[i];
            var radekObsahujeZavOt = this.detekujSubstr(radek, '{');
            
            if(radekObsahujeZavOt == true){
                indexOt = i;
                break;
            }

        }

        return(indexOt);

    }


    ziskejDvojiceIndexuZav(indexyZav){

        var dvojiceArrZav = [];
        var zac = 0;

        for (let i = 0; i < indexyZav.length; i++) {

            var kon = indexyZav[i];
            var zacKon = [];

            zacKon.push(zac);
            zacKon.push(kon);
            dvojiceArrZav.push(zacKon);

            zac = kon + 1;

        }

        return(dvojiceArrZav);

    }


    ziskejPoleIndsexuZav(poleZavOt){

        var indexyZav = [];

        for (let i = 0; i < poleZavOt.length; i++) {
            var zavOtRadek = poleZavOt[i];
            var zavOtSpl = zavOtRadek.split(' ');
            if(zavOtSpl[0] == 'zav'){
                indexyZav.push(parseInt(zavOtSpl[2]));
            } 
        }

        return(indexyZav);

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




class generujSrc{

    constructor(){

        //setTimeout(function(){
            //alert(poleTextSrc);
        //});

        $('#generatedSrc').append(srcNewWindow);

    }

}



$(document).ready(function(){
    //alert('');
    var srcInNewWindow = new generujSrc();
});


/*
$(document).on('change', '#combo_2', function (e) {
    alert(poleTextSrc);
});
*/


//klikne na tlačítko "showSrc" a vytvori pozadovanou stranku
$(document).on('click', '#showSrc', function (e) {
    data = $('.poleTextInput').val();
    var nahledSrc = new vytvorNahledSrc();
});
