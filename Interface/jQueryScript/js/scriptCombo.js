
class vytvorComboboxy{

    constructor(idMulti){

        this.objCombo = JSON.parse(jsonFiles);
        var poleSouboru;

        if(idMulti == undefined){ //ziskava data pro zobtrazeni comboboxu
            poleSouboru = this.vytvorPoleSouboru();
        }
        else{ //ziska data pro vykresleni stromu
            poleSouboru = this.vytvorPoleSouboruMulti(idMulti);
        }
        
        //kod bezi jak pro comboboxy, tak i pro strom
        this.vsechnySlozkyNaUrovnichArr = this.vratVsechnySlozkyVsechUrovni(poleSouboru);
        this.polePodSlozekAll = this.vratVsechnyPodSlozky(this.vsechnySlozkyNaUrovnichArr, poleSouboru);

        //kod bezi dal, jen kdyz se ziskavaji data pro comboboxy, nikoliv pro strom
        if(idMulti == undefined){
            this.appendStrCombo = this.vytvorAppendStrVsechnaComba(this.vsechnySlozkyNaUrovnichArr);
            this.selAppendStrAll = this.kPoliPodSlozekAllVratAppendStringy(this.polePodSlozekAll);
        }    

    }


    //getry
    getVsechnySlozkyNaUrovnichArr(){
        return(this.vsechnySlozkyNaUrovnichArr);
    }

    getPolePodSlozekAll(){
        return(this.polePodSlozekAll)
    }
    
    getSelAppendStrAll(){
        return(this.selAppendStrAll);
    }

    getAppendStrCombo(){
        return(this.appendStrCombo);
    }


    kPoliPodSlozekAllVratAppendStringy(polePodSlozekAll){

        console.log(polePodSlozekAll);
        var selAppendStrAll = [];

        for (let i = 0; i < polePodSlozekAll.length; i++){

            var polePodSlozek = polePodSlozekAll[i];
            var select = polePodSlozek[0];
            var selectId = polePodSlozek[1];
            var selectIdStr = 'combo_' + selectId;

            var values = [];
            for (let iVal = 2; iVal < polePodSlozek.length; iVal++){
                values.push(polePodSlozek[iVal]);
            }

            var appendStr = this.vytvorAppendStrCombo(selectIdStr, values, select, appendStrCombo);
            //console.log(appendStr);

            var selAppendStr = [];
            selAppendStr.push(select);
            selAppendStr.push(appendStr);

            selAppendStrAll.push(selAppendStr);
        
        }

        console.log(selAppendStrAll);
        return(selAppendStrAll)

    }


    vytvorAppendStrVsechnaComba(vsechnySlozkyNaUrovnichArr){

        var appendStrCombo1;
        var appendStrCombo;
        
        //vytvori appendString pro 1. combo
        appendStrCombo1 = this.vytvorAppendStrCombo('combo_0', vsechnySlozkyNaUrovnichArr[1]);

        //sestavi appendString pro vsechny comboboxy
        appendStrCombo = appendStrCombo1;

        //prida appendString do html
        $('#chooseFile').append(appendStrCombo);

        return(appendStrCombo);

    }


    vytvorAppendStrCombo(selectId, values, select){

        var optionStr = ''
        var appendStr;

        for (let i = 0; i < values.length; i++){

            var value = values[i];
            var optionRadek = '    <option value="' + value + '">' + value + '</option>\n';
            optionStr = optionStr + optionRadek

        }

        //sestavi appendString
        appendStr = '<select class="comboFile" id="' + selectId + '" prevSel="' + select + '">\n' + optionStr + '</select>\n';

        return(appendStr);

    }


    //vytvari pole souboru, pokud neni multi
    vytvorPoleSouboru(){

        var poleSouboru = [];
        
        for (let i = 0; i < this.objCombo.files.length; i++) {

            var jsonName = this.objCombo.files[i].jsonHtml.jsonName;
            var htmlName = this.objCombo.files[i].jsonHtml.htmlName;

            var adresaPole = this.vratAdresuJakoPole(htmlName, jsonName);
            poleSouboru.push(adresaPole);
            
        }

        return(poleSouboru);
    }


    //vytvari pole souboru, pokud je multi
    vytvorPoleSouboruMulti(idMultiExp){

        var poleSouboru = [];

        for (let i = 0; i < this.objCombo.files.length; i++) {
            var idMulti = this.objCombo.files[i].jsonHtml.idMulti;
            if(idMulti == idMultiExp){
                var typeOfProject =  this.objCombo.files[i].jsonHtml.typeOfProject;
                if(typeOfProject =="multiFile" ){ //bude pravdepodobne vzdy splneno
                    var jsonName = this.objCombo.files[i].jsonHtml.jsonName;
                    var folderPath =  this.objCombo.files[i].jsonHtml.folderPath;

                    var adresaPole = this.vratAdresuJakoPole(folderPath, jsonName);
                    poleSouboru.push(adresaPole);
                }
            }
        }

        return(poleSouboru);

    }


    vratVsechnyPodSlozky(vsechnySlozkyNaUrovnichArr, poleSouboru){

        var polePodSlozekAll = []

        for (let r = 1; r < vsechnySlozkyNaUrovnichArr.length-1; r++){
            var delka = vsechnySlozkyNaUrovnichArr[r].length;
            for (let s = 0; s < delka; s++){
                var nadSlozka = vsechnySlozkyNaUrovnichArr[r][s];
                var polePodSlozek = this.vratPolePodSlozek(poleSouboru, nadSlozka, r);
                
                polePodSlozekAll.push(polePodSlozek);
            }
        }

        return(polePodSlozekAll);

    }


    //k vychozi slozce vrati vsechny mozne podslozky
    vratPolePodSlozek(poleSouboru, nazevNadSlozkyExp, uroven){

        var nazvyPodSlozekArr = [];
        nazvyPodSlozekArr.push(nazevNadSlozkyExp);
        nazvyPodSlozekArr.push(uroven);

        for (let r = 0; r < poleSouboru.length; r++){
            var nazevNadSlozky = poleSouboru[r][uroven];
            if(nazevNadSlozky == nazevNadSlozkyExp){
                var nazevPodSlozky = poleSouboru[r][uroven+1];
                nazvyPodSlozekArr.push(nazevPodSlozky);
            }
        }

        var unique = nazvyPodSlozekArr.filter(this.onlyUnique);
        return(unique);

    }


    // vrati pole vsech slozek na jednotlivych urovnich
    vratVsechnySlozkyVsechUrovni(poleSouboru){

        var vsechnySlozkyNaUrovnichArr = [];
        var pocetUrovni = poleSouboru[0].length;
        
        for (let i = 0; i < pocetUrovni; i++){
            var vsechnySlozkyNaUrovni = this.vratVsechnySlozky(poleSouboru, i);
            vsechnySlozkyNaUrovnichArr.push(vsechnySlozkyNaUrovni);
        }

        return(vsechnySlozkyNaUrovnichArr);

    }


    //vrati vsechny slozky na dane urovni
    vratVsechnySlozky(poleSouboru, uroven){

        var vsechnySlozkyNaUrovni = []

        for (let i = 0; i < poleSouboru.length; i++){

            var slozkaUroven = poleSouboru[i][uroven];
            vsechnySlozkyNaUrovni.push(slozkaUroven);

            var unique = vsechnySlozkyNaUrovni.filter(this.onlyUnique);
            
        }

        return(unique);

    }


    //vrati pole unikatnich polozek
    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }



    //vrati adresu jako pole + predradi nazevJsonu
    vratAdresuJakoPole(adresa, jsonName){

        var adresaSplit = adresa.split('/');
        var adresaPole = [];

        //jako prvni polozka je vzdy nazev jsonu
        adresaPole.push(jsonName);

        for (let i = 0; i < adresaSplit.length; i++) {
            var slozka = adresaSplit[i];
            adresaPole.push(slozka);
        }

        return(adresaPole);

    }

}


//vytvari appendString dle aktualne vybranehoComboboxu
class vytvorAppendStrCombo{

    constructor(idCombo, prevSel, polePodSlozekAll, appendStrCombo1){

        //ponecha jen potrebny pocet comboboxu, ostatni smaze
        //var appendStrCombo1 = this.ponechPotrebnySelect(appendStrCombo1, idCombo);

        /*
        console.log('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
        console.log(idCombo);
        console.log(prevSel);
        console.log(polePodSlozekAll);
        console.log(appendStrCombo1);
        console.log('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
        */

        this.comboSelAll = [];
        this.polePodSlozekAll = polePodSlozekAll;
        this.main(appendStrCombo1, prevSel, idCombo);
        
        //zjisti nove vsechny startEndTags
        if(this.appendStrComboAll != undefined){

            var appendStrComboAllArr = this.appendStrComboAll.split('\n');
            var najdiStartEndTags = new ponechPotrebneSelecty(appendStrComboAllArr, undefined);
            var startEndTags = najdiStartEndTags.getStartEndTags();
            //var startEndTags = this.vratPrvniAPosledniIndexyRadkuSelect(appendStrComboAllArr);
            //console.log(appendStrComboAllArr);
    
            //zjisti pocet option v poslednim selectu
            var pocetOption = this.vratPocetOption(appendStrComboAllArr, startEndTags);
    
            if(pocetOption == 1){
                var prevSel = this.vratPrevSel(startEndTags, appendStrComboAllArr);
                //zatim je 'combo_1' natvrdo, pokud bude v budoucnosti vice combo, pak bude nutno predelat
                this.main(this.appendStrComboAll, prevSel, 'combo_1');
            }
            
    
            //nastavi aktualne vybrane comboboxy
            this.nastavAktualniComboboxy(this.comboSelAll);

        }

        //test
        this.test(appendStrCombo1);
       
    }


    //geter
    getAppendStrComboAll(){
        return(this.appendStrComboAll)
    }


    test(appendStrCombo1){

        this.ziskejAppendStringDleCesty(appendStrCombo1, 'kateg1/kateg2/test22.html');

    }


    ziskejAppendStringDleCesty(appendStrCombo1, cesta){

        var cestaSpl = cesta.split('/');
        var comboSel1 = cestaSpl[0];
        var comboSel2 = cestaSpl[1];
        var appendStrCesta = appendStrCombo1;

        if(comboSel1 != undefined){
            var appendStrComboCl = new pridejComboStr('combo_0', comboSel1, this.polePodSlozekAll);
            var appendCombo1 = appendStrComboCl.getAppendStrCombo();            
            //var appendCombo1 = this.vytvorComboStr('combo_0', comboSel1);
            appendStrCesta = appendStrCesta + appendCombo1;

            if(comboSel1 != undefined){
                var appendStrComboCl = new pridejComboStr('combo_1', comboSel2, this.polePodSlozekAll);
                var appendCombo2 = appendStrComboCl.getAppendStrCombo();
                //var appendCombo2 = this.vytvorComboStr('combo_1', comboSel2);
                appendStrCesta = appendStrCesta + appendCombo2;
            }

        }

        return(appendStrCesta);

    }


    main(appendStrCombo1, prevSel, idCombo){
        
        //idCombo = 'combo_0';
        //prevSel = 'kateg1';

        //var appendStrCombo = this.vytvorComboStr(idCombo, prevSel);
        var appendStrComboCl = new pridejComboStr(idCombo, prevSel, this.polePodSlozekAll);
        var appendStrCombo = appendStrComboCl.getAppendStrCombo();

        if(appendStrCombo != undefined){
            
            /*
            console.log('&&&&&&&&&&&&&&&&&&&&&&&');
            console.log(idCombo);
            console.log(prevSel);
            console.log(appendStrCombo1);
            console.log(appendStrCombo);
            console.log(idCombo);
            console.log('&&&&&&&&&&&&&&&&&&&&&&&');
            */

            //asi nejaka chyba, tak se vygeneruji comboboxy znovu
            if(appendStrCombo1 == undefined){

                comboSel0 = $('#combo_0').val();
                comboSel1 = $('#combo_1').val();

                //vytvori 1. combo znovu
                var spustScript = new hlavniTrida();
                var appendStrCombo0 = spustScript.getAppendStrCombo();
                console.log(appendStrCombo1);

                var cesta = comboSel0 + '/' + comboSel1 + '/';
                var appendStrCestaCl = new ziskejCestuZeStromu(appendStrCombo0, cesta, polePodSlozekAll);
                var appendStrCesta = appendStrCestaCl.getAppendStrCesta();

                //var appendStrCesta = this.ziskejAppendStringDleCesty(appendStrCombo0, cesta)
                //console.log(appendStrCesta);

                //odmaze soucasne comboboxy
                $('.comboFile').remove();

                //prida novy string s comboboxy
                $('#chooseFile').append(appendStrCesta);

            }
            else{

                this.appendStrComboAll = this.vytvorAppendStrAll(appendStrCombo1, appendStrCombo, idCombo);

                //odmaze soucasne comboboxy
                $('.inputTree').remove();
                $('.comboFile').remove();

                //prida novy string s comboboxy
                $('#chooseFile').append(this.appendStrComboAll);

                //console.log('&__&&&&&&&&&&&&&&&&&&&&&&');
               // console.log(this.appendStrComboAll);
                //console.log('&__&&&&&&&&&&&&&&&&&&&&&&');

            }
            

            //nastavuje znovu posledni combobox, jelikoz s prepsanim appendRtringu je treba nastavit combo znovu
            //$('#'+idCombo).val(prevSel);
            this.nastavPosledniCombo(idCombo, prevSel);

            //nastavi jiz nabrane combo
            $('#combo_0').val(comboSel0);
            console.log(comboSel1);
            $('#combo_1').val(comboSel1);

        }

    }


    //nastavi posledni combo, aby vedel jake combo ma prenastavit, jelikoz s prepsanim appendStringu se vyber smaze
    nastavPosledniCombo(idCombo, prevSel){

        var comboSel = []
        comboSel.push(idCombo)
        comboSel.push(prevSel)

        this.comboSelAll.push(comboSel);
        this.nastavAktualniComboboxy(this.comboSelAll);

    }


    //nastavi aktualni comboboxy
    nastavAktualniComboboxy(comboSelAll){

        //console.log(comboSelAll);

        for (let i = 0; i < comboSelAll.length; i++){

            var idCombo = comboSelAll[i][0];
            var prevSel = comboSelAll[i][1];

            $('#' + idCombo).val(prevSel);

        }

    }


    //vrati pocet option
    vratPocetOption(appendStrComboAllArr, startEndTags){

        var prvniIndex = startEndTags[startEndTags.length-1][0];
        var posledniIndex = startEndTags[startEndTags.length-1][1];
        var appendStrComboAllArr = this.appendStrComboAll.split('\n');
        var pocetOption = 0;

        for (let i = prvniIndex; i < posledniIndex + 1; i++){

            var radek = appendStrComboAllArr[i];
            var radekObsahujeOption = radek.includes('<option');
            if(radekObsahujeOption == true){
                pocetOption = pocetOption + 1;
            }

        }

        return(pocetOption)

    }


    //ziska prevSel, pokud je v combu pouze 1 polozka
    vratPrevSel(startEndTags, appendStrComboAllArr){

        var prvniIndex = startEndTags[startEndTags.length-1][0];
        var posledniIndex = startEndTags[startEndTags.length-1][1];
        var optionIndex = (prvniIndex + posledniIndex)/2;

        var radekOption = appendStrComboAllArr[optionIndex];
        var rad = radekOption.replace('<option value="','');
        rad = rad.trim();
        var radSpl = rad.split('"');
        var prevSel = radSpl[0];

        return(prevSel);

    }


    //sestavi appendStrProVsechnaComba
    vytvorAppendStrAll(appendStrCombo1, appendStrCombo, idCombo){
        
        //var appendStrComboAllPonech = this.ponechPotrebnySelect(appendStrCombo1, idCombo);
        var ponechComboboxy = new ponechPotrebneSelecty(appendStrCombo1, idCombo);
        var appendStrComboAllPonech = ponechComboboxy.getAppendStrComboAllNew();


        var appendStrComboAll = appendStrComboAllPonech + appendStrCombo; 

        return(appendStrComboAll);

    }

    vytvorComboStr(idCombo, prevSel){

        var indexSloupce = parseInt(idCombo.replace('combo_', '')) + 1;
        var appendStrCombo;

        if(indexSloupce < 3){

            var polePodSlozekPotrebne = this.ziskejPolozkyDleComba(indexSloupce, 1, this.polePodSlozekAll);
            

            var polePodSlozekDleSel = this.ziskejPolozkyDleComba(prevSel, 0, polePodSlozekPotrebne);
            if(polePodSlozekDleSel.length > 0){
                var polozkyCombo = this.ziskejPolozkyComba(polePodSlozekDleSel);
                appendStrCombo = this.vytvorAppendStrCombo('combo_' + indexSloupce, polozkyCombo, prevSel);
            }
            
        }
        else{
            appendStrCombo = undefined;
        }
       
        //console.log(appendStrCombo);
        return(appendStrCombo);

    }
    
}


class pridejComboStr{

    constructor(idCombo, prevSel, polePodSlozekAll){
        this.appendStrCombo = this.vytvorComboStr(idCombo, prevSel, polePodSlozekAll);
    }


    getAppendStrCombo(){
        return(this.appendStrCombo);
    }


    vytvorComboStr(idCombo, prevSel, polePodSlozekAll){

        var indexSloupce = parseInt(idCombo.replace('combo_', '')) + 1;
        var appendStrCombo;

        if(indexSloupce < 3){

            var polePodSlozekPotrebne = this.ziskejPolozkyDleComba(indexSloupce, 1, polePodSlozekAll);
            var polePodSlozekDleSel = this.ziskejPolozkyDleComba(prevSel, 0, polePodSlozekPotrebne);

            if(polePodSlozekDleSel.length > 0){
                var polozkyCombo = this.ziskejPolozkyComba(polePodSlozekDleSel);
                appendStrCombo = this.vytvorAppendStrCombo('combo_' + indexSloupce, polozkyCombo, prevSel);
            }
            
        }
        else{
            appendStrCombo = undefined;
        }
       
        //console.log(appendStrCombo);
        return(appendStrCombo);

    }


    ziskejPolozkyDleComba(itemExp, s, pole){

        var polePodSlozekPotrebne = [];

        for (let i = 0; i < pole.length; i++){
            var polePodSlozek = pole[i];
            var indexSloupce = '' + polePodSlozek[s];

            if(indexSloupce == itemExp){
                polePodSlozekPotrebne.push(polePodSlozek)
            }
        }

        return(polePodSlozekPotrebne);

    }


    ziskejPolozkyComba(polePodSlozekDleSel){

        var polozkyCombo = [];

        for (let i = 2; i < polePodSlozekDleSel[0].length; i++){
            var polozkaCombo = polePodSlozekDleSel[0][i];
            polozkyCombo.push(polozkaCombo);
        }
  
        return(polozkyCombo);

    }


    vytvorAppendStrCombo(selectId, values, select){

        var optionStr = ''
        var appendStr;

        for (let i = 0; i < values.length; i++){

            var value = values[i];
            var optionRadek = '    <option value="' + value + '">' + value + '</option>\n';
            optionStr = optionStr + optionRadek

        }

        //sestavi appendString
        appendStr = '<select class="comboFile" id="' + selectId + '" prevSel="' + select + '">\n' + optionStr + '</select>\n';

        return(appendStr);

    }

}




//zkrati appendStr na combo, cimz odebere pozadovane nadbytecne comboboxy
class ponechPotrebneSelecty{

    constructor(appendStrComboAll, idCombo){

        if(idCombo == undefined){
            this.startEndTags = this.vratPrvniAPosledniIndexyRadkuSelect(appendStrComboAll);
        }
        else{
            this.appendStrComboAllNew = this.ponechPotrebnySelect(appendStrComboAll, idCombo)
        }    
    }


    //vrati data
    getAppendStrComboAllNew(){
        return(this.appendStrComboAllNew);
    }

    getStartEndTags(){
        return(this.startEndTags);
    }


    //z appendStringuAll odebere po pozadovane id jednotlive comba
    ponechPotrebnySelect(appendStrComboAll, idCombo){

        //vytvori data znovu, pokud je smazal
        if(appendStrComboAll == undefined){
            var comboBoxy = new vytvorComboboxy(undefined);
            appendStrComboAll = comboBoxy.getAppendStrCombo();
        }
        
        var appendStrComboAllArr = appendStrComboAll.split('\n');
        var startEndTags = this.vratPrvniAPosledniIndexyRadkuSelect(appendStrComboAllArr);
        var startEndTagsPotrebne = this.ponechPouzeIndexy(startEndTags, idCombo);
        var posledniRadek = this.vratPosledniRadekProPonechani(startEndTagsPotrebne);
        var appendStrComboAllNew = this.ponechPotrebneSelecty(appendStrComboAllArr, posledniRadek);

        return(appendStrComboAllNew);

    }


    //z appendStringuAll odebere po pozadovane id jednotlive comba
    vratPrvniAPosledniIndexyRadkuSelect(appendStrComboAllArr){

        var indSelStart = -1;
        var indSelEnd = -1;

        var startEndTags = []

        for (let i = 0; i < appendStrComboAllArr.length; i++){
            var radekAppendStr = appendStrComboAllArr[i];
            var radekObsahujeSelectStart = (radekAppendStr.includes('<select'));
            var radekObsahujeSelectEnd = (radekAppendStr.includes('</select'));

            if(radekObsahujeSelectStart == true){
                indSelStart = i;
            }
            if(radekObsahujeSelectEnd == true){
                indSelEnd = i;
                
                var startEndTag = []
                startEndTag.push(indSelStart);
                startEndTag.push(indSelEnd);

                startEndTags.push(startEndTag);

                indSelStart = -1;
                indSelEnd = -1;

            }
        }

        return(startEndTags);

    }


    ponechPouzeIndexy(startEndTags, idCombo){

        var idStr = idCombo.replace('combo_', '');
        var idInt = parseInt(idStr);

        var startEndTagsPotrebne = [];
     
        for (let i = 0; i < idInt+1; i++){
            var startEnd = startEndTags[i];

            if(startEnd != undefined){
                startEndTagsPotrebne.push(startEnd);
            }

        }

        return(startEndTagsPotrebne);

    }


    vratPosledniRadekProPonechani(startEndTagsPotrebne){

        console.log(startEndTagsPotrebne);
        var posledniStartEnd = startEndTagsPotrebne[startEndTagsPotrebne.length-1];
        var posledniRadek = posledniStartEnd[1];

        return(posledniRadek);

    }


    ponechPotrebneSelecty(appendStrComboAllArr, posledniRadek){

        var appendStrComboAllNew = '';

        for (let i = 0; i < posledniRadek+1; i++){
            var radek = appendStrComboAllArr[i];
            appendStrComboAllNew = appendStrComboAllNew + radek + '\n';
        }

        return(appendStrComboAllNew);

    }

}


class hlavniTrida{

    constructor(){
  
        var comboBoxy = new vytvorComboboxy(undefined);
        
        vsechnySlozkyNaUrovnichArr = comboBoxy.getVsechnySlozkyNaUrovnichArr();
        polePodSlozekAll = comboBoxy.getPolePodSlozekAll();
        console.log(polePodSlozekAll);

        selAppendStrAll = comboBoxy.getSelAppendStrAll();
        appendStrCombo = comboBoxy.getAppendStrCombo();
        this.appendStrCombo =appendStrCombo;
        
    }


    getAppendStrCombo(){
        //console.log(this.appendStrCombo);
        return(this.appendStrCombo);
    }

}


class ziskejCestuZeStromu{

    constructor(appendStrCombo1, cesta, polePodSlozekAll){
        this.appendStrCesta = this.ziskejAppendStringDleCesty(appendStrCombo1, cesta, polePodSlozekAll);
    }


    getAppendStrCesta(){
        return( this.appendStrCesta);
    }

    
    ziskejAppendStringDleCesty(appendStrCombo1, cesta){

        var cestaSpl = cesta.split('/');
        var comboSel1 = cestaSpl[0];
        var comboSel2 = cestaSpl[1];
        var appendStrCesta = appendStrCombo1;

        console.log(cesta)

        if(comboSel1 != undefined){
            var appendStrComboCl = new pridejComboStr('combo_0', comboSel1, polePodSlozekAll);
            var appendCombo1 = appendStrComboCl.getAppendStrCombo();            
            appendStrCesta = appendStrCesta + appendCombo1;

            if(comboSel1 != undefined){
                var appendStrComboCl = new pridejComboStr('combo_1', comboSel2, polePodSlozekAll);
                var appendCombo2 = appendStrComboCl.getAppendStrCombo();
                appendStrCesta = appendStrCesta + appendCombo2;
            }

        }
       
       
        return(appendStrCesta);

    }
 

    
}



//##################################################################
//              KOD PRO ZISKANI DAT PRO STROM
// data se ziskaji, pokud pro dany vyber je "typeOfProject": "multiFile" a je k dispozici "folderPath" v 'jsonFile.json'


class ziskejDataProVykresleniStromu{

    constructor(jsonName){

        this.objCombo = JSON.parse(jsonFiles);
        var idMulti = this.ziskejIdMulti(jsonName);
      
        //ziska data pro vykresleni stromu
        var dataProStrom = new vytvorComboboxy(idMulti);

        //ziska data nazpet
        var polePodSlozekStrom = dataProStrom.getPolePodSlozekAll();

        //prepise data do comboboxu, aby mohl vykreslit strom
        var polePodSlozekStrStrom = JSON.stringify(polePodSlozekStrom);
            
        //do InputBoxu se musi vkladat uvozovky jako '&quot;', proto je nahrazuji nize
        var polePodSlozekStrQuotStrom = polePodSlozekStrStrom.replaceAll('"', '&quot;');
    
        //vlozi data do comboboxu, tak aby je mohl nacist v dalsim scriptu
        $('.tree').append('<input type="text" class="inputTree" value="' + polePodSlozekStrQuotStrom + '"></input>');
        

        //var spustScript = new hlavniTrida();
     
    }


    ziskejIdMulti(jsonNameExp){    

        var idMulti = undefined;

        for (let i = 0; i < this.objCombo.files.length; i++) {
            var jsonName = this.objCombo.files[i].jsonHtml.jsonName;
       
            if(jsonName == jsonNameExp){
                var typeOfProject = this.objCombo.files[i].jsonHtml.typeOfProject;
                if(typeOfProject == 'multiFile'){
                    idMulti =  this.objCombo.files[i].jsonHtml.idMulti;
                    break;
                }
            }
        }

        return(idMulti)

    }

}


class vyckejNaComboboxy{

    constructor(pouzePredejAdresu){

        //pokud je "pouzePredejAdresu==true", pak pouze preda adresu pro dalsi filtry

        this.objCombo = JSON.parse(jsonFiles);
        this.ziskejFolderPath(this.objCombo, pouzePredejAdresu);

    }


    ziskejFolderPath(objCombo, pouzePredejAdresu){

        //vycka nez se updatuji comboboxy a pak zjisti nastaveny json
        setTimeout(function(){
 
            var combo0 = $('#combo_0').val();
            var combo1 = $('#combo_1').val();
            var combo2 = $('#combo_2').val();

            console.log('#######################################')
            console.log(combo0);
            console.log(combo1);
            console.log('#######################################')
   
            var adresaProJson = combo0 + '/' + combo1 + '/' + combo2;

            if(pouzePredejAdresu == true){

                //odebere fitry podle klice
                $('.filterKeyWord').remove();

                $('.inputAdresFile').remove();
                $('#filterCardSettings').append('<input type="text" class="inputAdresFile" value="' + adresaProJson + '"></input>');
            }
            else{

                var jsonFilesObj = JSON.parse(jsonFiles);
                var poleSouboru = [];
    
                for (let i = 0; i < jsonFilesObj.files.length; i++) {
                    var htmlName = jsonFilesObj.files[i].jsonHtml.htmlName;
                    if(htmlName == adresaProJson){
    
                        var typeOfProject = jsonFilesObj.files[i].jsonHtml.typeOfProject;
                        if(typeOfProject == "multiFile"){
                           
                            var jsonName = objCombo.files[i].jsonHtml.jsonName;
                            var dataProVykresleniStromu = new ziskejDataProVykresleniStromu(jsonName);
    
                        }
                        if(typeOfProject == "singleFile"){
    
                            //odebere predchozi strom
                            $('#usingJsonTree').remove();
                            
                        }
    
                    }
                }
            }
           
        })

    }

}



//##################################################################
//   KOD NA ZISKANI APPEND-STRINGU PRI KLIKNUTI DO STROMU 



class appendStringZeStromu{

    constructor(htmlName){

        //ziska appendstring z adresy
        var appendStr = this.sestavAppendString(htmlName);
       
        //odmaze soucasne comboboxy
        $('.comboFile').remove();

        //prida novy string s comboboxy
        //console.log(appendStr);
        $('#chooseFile').append(appendStr);

        //nastavi prislusne comboboxy dle cesty
        this.nastavComboboxyDleCesty(htmlName);

    }


    nastavComboboxyDleCesty(cesta){

        var cestaSpl = cesta.split('/');
        comboSel0 = cestaSpl[0];
        comboSel1 = cestaSpl[1];
        comboSel2 = cestaSpl[2];

        //nastavi comboboxy
        $('#combo_0').val(comboSel0);
        $('#combo_1').val(comboSel1);
        $('#combo_2').val(comboSel2);

    }


    sestavAppendString(htmlName){

        var htmlNameSpl = htmlName.split('/');
        var appendStr = '';

        for (let i = 0; i < 3; i++){
            
            if(i == 0){
                var idCombo = '';
            }
            else{
                var idCombo = htmlNameSpl[i-1];
            }

            var appendStrCombo = this.vratAppendStrProDanouSlozku(i, idCombo);
            //console.log(appendStrCombo);
            appendStr = appendStr + appendStrCombo;
 
        }
    
        return(appendStr);
    
    }


    vratAppendStrProDanouSlozku(indexComba, idCombo){

        var appendStrCombo;
        

        if(indexComba == 0){
            var appendStrComboCl = new hlavniTrida();
            appendStrCombo = appendStrComboCl.getAppendStrCombo();
        }
        else{
            var indexComba1 = indexComba - 1
            var comboId = 'combo_' + indexComba1;
            var appendStrComboCl = new pridejComboStr(comboId, idCombo, polePodSlozekAll);
            appendStrCombo = appendStrComboCl.getAppendStrCombo();
        }

        return(appendStrCombo)

    }

}



//----- REAGUJE NA VYBER COMBOBOXU  ------------------------------------
//        vykresluje strom

//vola tridu pri zmene comba - tim vyhledava spravny json pro vykreslovani
$(document).on('change', '#combo_0', function (e) {

    //nastavi combo0
    comboSel0 = $('#combo_0').val();
    var vyckejNaComba = new vyckejNaComboboxy(false);

    //odesle data do dalsich filtru
    var dataOstatniFiltry = new vyckejNaComboboxy(true);

    //pokud se vybira combobox_0 zpetne, vzdy se odstrani combobox_2
    var odeberTretiCombo = new ponechPotrebneSelecty(appendStrCombo, 'combo_2');
    appendStrCombo = odeberTretiCombo.getAppendStrComboAllNew();
   
});

//vola tridu pri zmene comba - tim vyhledava spravny json pro vykreslovani
$(document).on('change', '#combo_1', function (e) {

    //nastavi combo1
    comboSel1 = $('#combo_1').val();
    var vyckejNaComba = new vyckejNaComboboxy(false);

    //odesle data do dalsich filtru
    var dataOstatniFiltry = new vyckejNaComboboxy(true);
   
});

//vola tridu pri zmene comba - tim vyhledava spravny json pro vykreslovani
$(document).on('change', '#combo_2', function (e) {

    //nastavi combo2
    comboSel2 = $('#combo_2').val();
    var vyckejNaComba = new vyckejNaComboboxy(false);

    //odesle data do dalsich filtru
    var dataOstatniFiltry = new vyckejNaComboboxy(true);

});

//udalost prijimajici data z scriptTree (pri kliknuti do stromu), meni se comboboxy
$(document).on('DOMNodeInserted', '.inputHtmlName', function () {
    var htmlName = $('.inputHtmlName').val();
    var appendStrStrom = new appendStringZeStromu(htmlName); 

    $('.inputHtmlName').remove();

});



//##################################################################
//              BEZNY KOD

// Globalni promenne
var vsechnySlozkyNaUrovnichArr;
var polePodSlozekAll;
var selAppendStrAll;
var appendStrCombo;

//aktuane nastavene comboboxy
var comboSel0;
var comboSel1;
var comboSel2;


//udalost pri klikani na comboboxy
$(document).on('change', '.comboFile', function (e) {

    var prevSel = $(e.target).val();
    var idCombo = $(this).attr('id');


    var vytvorNasledujiciCombo = new vytvorAppendStrCombo(idCombo, prevSel, polePodSlozekAll, appendStrCombo);

    //preulozi posledni appandString
    appendStrCombo = vytvorNasledujiciCombo.getAppendStrComboAll();

});


//udalost, ktera prijima data do tohoto scriptu, pres inputBox
$(document).on('DOMNodeInserted', '.inputfilterSet', function () {

    var inputFilter = $('.inputfilterSet').val();
    
    if(inputFilter == 'category'){
        var spustScript = new hlavniTrida();
        $('.inputfilterSet').remove();
    }
    
});


//tento script generuje comboboxy pro vyber souboru
$(document).ready(function(){

    //spusti script, aby zobrazil comboboxy dle kategorie
    //var spustScript = new hlavniTrida();

    //vycka na vyber comboboxu, aby ziskal data pro strom
    //var vyckejNaComba = new vyckejNaComboboxy();


    //spusti script, aby pripravil data pro strom
    //var spustScript = new hlavniTrida("multifile");

});