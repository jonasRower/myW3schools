
class vykresliStrom{

    constructor(){

        //var jsonFilesObj = JSON.parse(jsonFiles);

        //var jsonFilesObj = JSON.parse(prvniJsDebug);
        //console.log(jsonFilesObj);

        //tady na tom pokracovat
        var json = prvniJsDebug;
        //console.log(json);
        this.stromDebug = JSON.parse(json);

        

        /*
        $('#tree').jstree({
            "core": {
                "check_callback": true
            },
            "plugins": ["dnd"]
        });
        */
        
        var jsTreeDataJsonTxt = this.prevedStromDebugNaJsonTreeData(this.stromDebug);
        var jsTreeDataJson = this.ziskejJsonObject(jsTreeDataJsonTxt);

        console.log(jsTreeDataJson);
        
        //odebere predchozi strom
        //$('#usingJsonTree').remove();

        //prida strom novy
        //$('.tree').append('<div id="usingJsonTree"></div>');
        var myTree = $('#stromDebug').jstree(jsTreeDataJson);


        //vykresli strom jako tabulku
        var stromVTabulce = new vykresliStromJakoTabulku(jsTreeDataJson);


        /*
        myTree.on('changed.jstree', function(e, data) {
            var selected = data.instance.get_selected();
            var kliknutiDoStromu = new nastavComboboxyDleKliknutiDoStromu(inputTreeJson, selected, jsonFilesObj)
        });
        */
    }


    //prevadi stromDebug na jsonTreeData
    prevedStromDebugNaJsonTreeData(stromDebug){

        var poleVar = this.ziskejPoleVsechHodnot(stromDebug, 'var');
        var poleValue = this.ziskejPoleVsechHodnot(stromDebug, 'value');
        var pocetUrovni = this.ziskejPocetUrovniZanoreni(poleVar);
        var poleVarSamostatne = this.ziskejPoleVarSamostatne(poleVar);
        var promennaARodicAll = this.ziskejRodiceVar(poleVar, poleValue, poleVarSamostatne);
        var clenTreeId = this.vratClenyTreeId(promennaARodicAll, pocetUrovni);
       
        //sestavi data pro vykresleni stromu
        var jsTreeDataJson = this.vytvorPoleRadkuJsonTreeData(clenTreeId);


        return(jsTreeDataJson);

    }


    //budou-li nejake urovne vnorene, pak bude potreba opakovvane zanorovat
    //metoda nize zjisti pocet nejhlubsiho zanoreni
    ziskejPocetUrovniZanoreni(poleVar){

        var pocetUrovniMax = 0;

        for (let r = 0; r < poleVar.length; r++) {
            var prom = poleVar[r];
            var promSpl = prom.split('.');
            var pocetUrovni = promSpl.length;

            if(pocetUrovni > pocetUrovniMax){
                pocetUrovniMax = pocetUrovni;
            }
        }

        return(pocetUrovniMax);

    }


    rozsirPromennaARodicAllOValue(promennaARodicAll, promTeckaRodicArr, poleVar, poleValue){

        //vytvori vetsi pole
        var promennaARodicAllNew = this.vytvorPoleORozmerech(promennaARodicAll.length, 3)
        
        //vytvori kopii "promennaARodicAll"
        for (let r = 0; r < promennaARodicAll.length; r++) {
            for (let s = 0; s < 2; s++){
                promennaARodicAllNew[r][s] = promennaARodicAll[r][s];
            }
        }

        //ziska pole indexu, podle kterych bude prirazovat polozky
        var poleInd = this.ziskejPoleIndexuPolozek(promTeckaRodicArr, poleVar);

        //doplni pole "promennaARodicAllNew" o polozky values
        for (let i = 0; i < poleValue.length; i++) {
            var ind = poleInd[i];
            var value = poleValue[i];
            //console.log(value);
            promennaARodicAllNew[ind][2] = value;
        }

        return(promennaARodicAllNew);

    }


    //vytvor promTecku pro posledni 2 cleny
    vytvorPromTeckuProPosledniDvaCleny(radek){

        var radekSpl = radek.split('.')
        var iStart = radekSpl.length-2;
        var posledniDvaCleny = ''

        //console.log(radek);
        //console.log(radekSpl.length-2);

        if(iStart > 0){
            for (var i = iStart; i < radekSpl.length; i++) {
                var clen = radekSpl[i];
                posledniDvaCleny = posledniDvaCleny + clen;

                if(i < radekSpl.length-1){
                    posledniDvaCleny = posledniDvaCleny + '.'
                }
            }
        }
        else{
            posledniDvaCleny = radek;
        }

        return(posledniDvaCleny);

    }



    ziskejPoleIndexuPolozek(promTeckaRodicArr, poleVar){

        var poleInd = [];
        for (var i = 0; i < poleVar.length; i++) {

            var promenna = poleVar[i];
            var posledniDvaCleny = this.vytvorPromTeckuProPosledniDvaCleny(promenna);
            //console.log(posledniDvaCleny);

            var ind = promTeckaRodicArr.indexOf(posledniDvaCleny);
            poleInd.push(ind);

        }

        return(poleInd);

    }


    vytvorPoleORozmerech(vyska, delka){

        var x = new Array(delka);

        for (var i = 0; i < vyska; i++) {
          x[i] = new Array(delka);
        }
        
        return(x);
      
    }


    //ziska data nazpet na zaklade razeni promennaARodicAll
    vratRodicTeckaPromennaArr(poleVar, poleValue, promennaARodicAll){

        //console.log(poleVar);
        //console.log(poleValue);
        //console.log(promennaARodicAll);

        var promTeckaRodicArr = [];

        for (let i = 0; i < promennaARodicAll.length; i++) {
            var promennaARodic = promennaARodicAll[i];
            var promenna = promennaARodic[1];
            var rodic = promennaARodic[0];
            var promTeckaRodic;
            
            if(promenna == rodic){
                promTeckaRodic = promenna;
            }
            else{
                promTeckaRodic = promenna + '.' + rodic;
            }

            promTeckaRodicArr.push(promTeckaRodic);
        }

        return(promTeckaRodicArr);

    }


    vytvorPoleRadkuJsonTreeData(clenTreeId){

        var radkyPole = [];

        radkyPole.push('{"core": {');
        radkyPole.push('   "data": [');
        radkyPole.push('        {"id": "tree_0", "parent": "#", "text": "project"},');
  
        for (let i = 0; i < clenTreeId.length; i++) {
            var clen = clenTreeId[i][0];
            var id = clenTreeId[i][1];
            var value = clenTreeId[i][2];

            var clenValue;
            if(value == undefined){
                clenValue = clen;
            }
            else{
                clenValue = clen + ' = ' + value;
            }
            
            var radek = this.vratRadekTreeJsonData(id, clenValue);

            if(i < clenTreeId.length-1){
                radek = radek + ',';
            }

            radkyPole.push(radek);

        }

        radkyPole.push('    ]');
        radkyPole.push('}}');

        return(radkyPole);

    }


    ziskejJsonObject(radkyPole){

        var jsonObjTxt = '';
        for (let i = 0; i < radkyPole.length; i++) {
            var radek = radkyPole[i];
            jsonObjTxt = jsonObjTxt + radek + '\n';
        }

        //console.log(jsonObjTxt);
        var jsonObj = JSON.parse(jsonObjTxt);

        return(jsonObj);

    }


    vratRadekTreeJsonData(id, value){
        
        var parent = this.vratParent(id);
        var radek = '       {"id": "' + id + '", "parent": "' + parent + '", "text": "' + value + '"}'
        return(radek);

    }


    vratParent(id){

        var idSpl = id.split('_');
        var parent = '';

        for (let i = 0; i < idSpl.length-1; i++) {
            var idSpl1 = idSpl[i];
            parent = parent + idSpl1;

            if(i < idSpl.length-2){
                parent = parent + '_';
            }
        }

        return(parent);

    }


    vratClenyTreeId(promennaARodicAll, pocetUrovni){

        var clenTreeId = [];

        var seznamClenuBezRodicu = this.ziskejSeznamClenuBezRodicu(promennaARodicAll);
        var seznamClenuSRodici = this.ziskejSeznamClenuSRodici(promennaARodicAll, seznamClenuBezRodicu);
        var clenATreeIdAllBezRodice = this.priradTreeIdKClenumBezRodicu(seznamClenuBezRodicu);
        clenTreeId = clenTreeId.concat(clenATreeIdAllBezRodice);

        for (let i = 0; i < pocetUrovni; i++) {

            if(i == 0){
                var seznamNenalezenychPromennych = seznamClenuSRodici;
            }
            else{
                var seznamNenalezenychPromennych = this.vratSeznamnenalezenychPromennych(promennaARodicAll, clenTreeId);
            }

            var clenATreeIdAllSRodicem = this.priradTreeIdKClenumSRodici(seznamNenalezenychPromennych, clenTreeId, promennaARodicAll);
            clenTreeId = clenTreeId.concat(clenATreeIdAllSRodicem);

        }

        return(clenTreeId);

    }


    vratSeznamnenalezenychPromennych(promennaARodicAll, clenTreeId){

        var seznamNenalezenychPromennych = []
        var promenneSeznam = [];

        for (let r = 0; r < clenTreeId.length; r++) {
            var promenna = clenTreeId[r][0];
            promenneSeznam.push(promenna);
        }

        for (let i = 0; i < promennaARodicAll.length; i++) {
            var clen = promennaARodicAll[i][0];
            var ind = promenneSeznam.indexOf(clen);

            if(ind == -1){
                var clenVal = [];
                var value = promennaARodicAll[i][2];

                clenVal.push(clen);
                clenVal.push(value);

                seznamNenalezenychPromennych.push(clenVal);
            }
        }

        return(seznamNenalezenychPromennych);

    }


    priradTreeIdKClenumBezRodicu(seznamClenuBezRodicu){

        var clenATreeIdAll = []

        for (let i = 0; i < seznamClenuBezRodicu.length; i++) {
            var clenBezRodice = seznamClenuBezRodicu[i][0];
            var value = seznamClenuBezRodicu[i][1];
            var i1 = i + 1;
            var treeId = 'tree_0_' + i1;

            var clenATreeId = [];
            clenATreeId.push(clenBezRodice);
            clenATreeId.push(treeId);
            clenATreeId.push(value);

            clenATreeIdAll.push(clenATreeId);
        }

        return(clenATreeIdAll);

    }


    priradTreeIdKClenumSRodici(seznamClenuSRodici, clenATreeIdAllBezRodice, promennaARodicAll){

        var clenATreeIdAll = []
        
        //console.log(clenATreeIdAllBezRodice);

        for (let i = 0; i < seznamClenuSRodici.length; i++) {

            var clen = seznamClenuSRodici[i][0];
            var value = seznamClenuSRodici[i][1];
            var rodic = this.vratRodiceOdPromenne(promennaARodicAll, clen);
            var treeIdRodic = this.vratRodiceOdPromenne(clenATreeIdAllBezRodice, rodic);

          //  console.log(rodic);
           // console.log(treeIdRodic);
/*
            if(treeIdRodic == -1){
                var rodic = this.vratRodiceOdPromenne(promennaARodicAll, rodic);
                var treeIdRodic = this.vratRodiceOdPromenne(clenATreeIdAllBezRodice, rodic);
                console.log('*******');
                console.log(treeIdRodic);
            }

            
            console.log(promennaARodicAll);
            console.log(seznamClenuSRodici);
            console.log(clenATreeIdAllBezRodice);
            console.log(rodic);
            console.log(treeIdRodic);
            */

            if(treeIdRodic != -1){

                var i1 = i + 1;
                var treeIdChild = treeIdRodic + '_' + i1;

                var clenATreeId = [];
                clenATreeId.push(clen);
                clenATreeId.push(treeIdChild);
                clenATreeId.push(value);

                clenATreeIdAll.push(clenATreeId);

            }    
        }

        return(clenATreeIdAll);

    }


    vratRodiceOdPromenne(promennaARodicAll, promennaExp){

        var rodic = '-1';   

        for (let i = 0; i < promennaARodicAll.length; i++) {

            var promennaARodic = promennaARodicAll[i];
            var promenna = promennaARodic[0];
            if(promenna == promennaExp){
                rodic = promennaARodic[1];
                break;
            }

        }

        return(rodic);

    }


    ziskejSeznamClenuBezRodicu(promennaARodicAll){

        var seznamHlavnichClenu = [];

        for (let i = 0; i < promennaARodicAll.length; i++) {
            var promennaRodic = promennaARodicAll[i];
            var pomenna = promennaRodic[0];
            var rodic = promennaRodic[1];
            var value = promennaRodic[2];
            
            if(pomenna == rodic){

                var promVal = [];
                promVal.push(pomenna);
                promVal.push(value);

                seznamHlavnichClenu.push(promVal);
            }
        }

        return(seznamHlavnichClenu);

    }


    ziskejSeznamClenuSRodici(vsichniCleny, clenyBezRodicu){

        var seznamClenuSRodici = []
        var clenyBezRodicu1D = []

        //prevede pole na 1D
        for (let i = 0; i < clenyBezRodicu.length; i++) {
            var bezRodice = clenyBezRodicu[i][0];
            clenyBezRodicu1D.push(bezRodice);
        }

        for (let i = 0; i < vsichniCleny.length; i++) {
            var clen = vsichniCleny[i][0];
            var indOf = clenyBezRodicu1D.indexOf(clen);

            if(indOf == -1){
                var value = vsichniCleny[i][2];

                var clenVal = [];
                clenVal.push(clen);
                clenVal.push(value);
                seznamClenuSRodici.push(clenVal);
            }

        }

        return(seznamClenuSRodici);

    }


    ziskejPoleVsechHodnot(stromDebug, klic){

        var poleHodnot = [];

        for (let i = 0; i < stromDebug.stromDebug.length; i++) {

            var hodnota;

            if(klic == 'var'){
               hodnota = stromDebug.stromDebug[i].variable.var;
            }
            if(klic == 'rowStart'){
                hodnota = stromDebug.stromDebug[i].variable.rowStart;
            }
            if(klic == 'rowEnd'){
                hodnota = stromDebug.stromDebug[i].variable.rowEnd;
            }
            if(klic == 'value'){
                hodnota = stromDebug.stromDebug[i].variable.value;
            }
            
            poleHodnot.push(hodnota);
        }

        return(poleHodnot);

    }


    //ziska seznam vsech promennych
    ziskejPoleVarSamostatne(poleVar){

        var promenneAll = []
        var promenneAllUnique;

        for (let i = 0; i < poleVar.length; i++) {
            var promenne = poleVar[i];
            var promenneSplit = promenne.split('.');
            promenneAll = promenneAll.concat(promenneSplit);
        }

        promenneAllUnique = promenneAll.filter(this.onlyUnique);

        return(promenneAllUnique);

    }


    //ziska rodice k poli var
    ziskejRodiceVar(poleVar, poleValue, poleVarSamostatne){

        var promennaARodicAll = [];

        for (let i = 0; i < poleVarSamostatne.length; i++) {
            var promennaSam = poleVarSamostatne[i];
            var rodicPromenne;
            for (let iVar = 0; iVar < poleVar.length; iVar++) {
                var promenna = poleVar[iVar];
                rodicPromenne = this.vratRodicePromenne(promennaSam, promenna);
               
                if(rodicPromenne != undefined){
                    break;
                }
            }

            var promennaARodic = [];
            promennaARodic.push(promennaSam);
            promennaARodic.push(rodicPromenne);

            promennaARodicAll.push(promennaARodic);
            
        }

        //rozsiri "promennaARodicAll" o "poleValue"
        var promTeckaRodicArr = this.vratRodicTeckaPromennaArr(poleVar, poleValue, promennaARodicAll);
        promennaARodicAll = this.rozsirPromennaARodicAllOValue(promennaARodicAll, promTeckaRodicArr, poleVar, poleValue);
        
        return(promennaARodicAll);
    }


    vratRodicePromenne(promenna, varPole){
        
        var pole = varPole.split('.');
        var indOf = pole.indexOf(promenna);
        var rodic;

        if(indOf == 0){
            rodic = promenna;
        }
        if(indOf > 0){
            rodic = pole[indOf-1];
        }
        if(indOf < 0){
            rodic = undefined;
        }

        return(rodic);
    }


    //vrati pole unikatnich polozek
    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }


}


//vykresli strom jako tabulku
class vykresliStromJakoTabulku{

    constructor(jsTreeDataJson){

        //var appendStr = this.vytvorStromTable();
        //$('#stromTableDebug').append(appendStr);

        var pocetUrovniArr = this.ziskejPoleSPoctyUrovni(jsTreeDataJson);
        //this.ziskejRadkyDaneUrovne(jsTreeDataJson, 2, pocetUrovniArr);

        console.log(pocetUrovniArr);

        var dataUrovneArrParent = this.ziskejRadkyVsechUrovni(jsTreeDataJson);
        var appendStrTab = this.vytvarejTabulku(dataUrovneArrParent);
        
        $('#stromTableDebug').append(appendStrTab);

    }


    //rozdeli 'jsTreeDataJson' dle jednotlivych roodicu
    //tak, aby mohl sestavit tabulku
    ziskejRadkyVsechUrovni(jsTreeDataJson){

        var pocetUrovniArr = this.ziskejPoleSPoctyUrovni(jsTreeDataJson);
        var pocetUrovniArrUnique = pocetUrovniArr.filter(this.onlyUnique);
        var dataUrovneArrParent = [];
               
        for (let i = 0; i < pocetUrovniArrUnique.length; i++) {
            var urovenInd = pocetUrovniArrUnique[i];
            var dataDaneUrovneArr = this.ziskejRadkyDaneUrovne(jsTreeDataJson, urovenInd, pocetUrovniArr);

            var dataUrovneArrParent1 = this.vratIndexyArrPodleParent(dataDaneUrovneArr);

            //slouci data
            dataUrovneArrParent = dataUrovneArrParent.concat(dataUrovneArrParent1);
        }
        
        return(dataUrovneArrParent);

    }


    //rozdeli pole, tak aby kazde pole melo jednoznacneho rodice
    //vraci tedy indexy tech radku dle skupin dle rodicu
    vratIndexyArrPodleParent(dataDaneUrovneArr){

        var parentArr = this.ziskejSeznamRodicu(dataDaneUrovneArr);
        var dataUrovneArrParent = [];

        for (let i = 0; i < parentArr.length; i++) {
            var rodic = parentArr[i];
            var dataDaneUrovneArrParent = this.vratRadkyDaneUrovneArrJenProDanehoRodice(dataDaneUrovneArr, rodic);

            dataUrovneArrParent.push(dataDaneUrovneArrParent);
        }

        return(dataUrovneArrParent);

    }


    vratRadkyDaneUrovneArrJenProDanehoRodice(dataDaneUrovneArr, rodicExp){

        var dataDaneUrovneArrParent = [];

        for (let i = 0; i < dataDaneUrovneArr.length; i++) {
            var uroven = dataDaneUrovneArr[i];
            var rodic = uroven.parent; 
            if(rodic == rodicExp){
                dataDaneUrovneArrParent.push(uroven);
            }
        }

        return(dataDaneUrovneArrParent);

    }


    ziskejSeznamRodicu(dataDaneUrovneArr){

        var parentArr = [];

        for (let i = 0; i < dataDaneUrovneArr.length; i++) {
            var uroven = dataDaneUrovneArr[i];
            var rodic = uroven.parent;   
            parentArr.push(rodic);
        }

        var parentArrUnique = parentArr.filter(this.onlyUnique);

        return(parentArrUnique);

    }



    ziskejRadkyDaneUrovne(jsTreeDataJson, urovenIndExp, pocetUrovniArr){

        var dataDaneUrovneArr = [];

        for (let i = 0; i < pocetUrovniArr.length; i++) {
            var urovenInd = pocetUrovniArr[i];
            if(urovenInd == urovenIndExp){
                var dataDaneUrovne = jsTreeDataJson.core.data[i];
                dataDaneUrovneArr.push(dataDaneUrovne);
            }
        }

        return(dataDaneUrovneArr);

    }



    ziskejPoleSPoctyUrovni(jsTreeDataJson){

        var pocetUrovniArr = [];

        for (let i = 0; i < jsTreeDataJson.core.data.length; i++) {
            var uroven = jsTreeDataJson.core.data[i];
            var pocetUrovni = this.stanovJakeUrovneJeId(uroven);

            pocetUrovniArr.push(pocetUrovni);
        }

        return(pocetUrovniArr);

    }


    stanovJakeUrovneJeId(uroven){

        var idUroven = uroven.id;
        var idSplit = idUroven.split('_');
        var pocetUrovni = idSplit.length-1;
        
        return(pocetUrovni);
    }


    vytvarejTabulku(dataUrovneArrParent){

        var tabArr = [];
        var parentArr = [];
        var idArr = [];

        for (let i = 0; i < dataUrovneArrParent.length; i++) {
            var subTabulkaData = dataUrovneArrParent[i];
           
            var parent = subTabulkaData[0].parent;
            var urovenId = this.stanovJakeUrovneJeId(subTabulkaData[0]);
            var textArr = this.ziskejTextProSubTabulku(subTabulkaData);
            var idArr = this.ziskejIdProSubTabulku(subTabulkaData);

            var appendStrTabArr = this.vytvorSubTabulkuOPoctuRadkuASloupcu(idArr, urovenId, textArr);

            tabArr.push(appendStrTabArr);
            parentArr.push(parent);
    
        }

        //posklada radky a vytvori tak tabulku
        var tabArrSestavene = this.poskladejRadkyZaSebe(tabArr, parentArr);

        //vytiskne tabulku do appendStringu
        var appendStrTab = this.vytvorAppendString(tabArrSestavene);

        return(appendStrTab);

    }


    // z poskladanych radku tabulky slozi appendstring, aby mohl tabulku vykreslit
    vytvorAppendString(tabArrSestavene){

        var appendStrTab = '<table class="tableDebug">\n';

        for (let i = 1; i < tabArrSestavene.length; i++) {
            var tabArrRadek = tabArrSestavene[i];
            var appendStrRadek = this.vytvorAppendStrRadek(tabArrRadek);
            appendStrTab = appendStrTab + appendStrRadek;
        }

        appendStrTab = appendStrTab + '</table>\n'

        return(appendStrTab);

    }


    //sestavi z pole radek jako appendstring, z ktereho se vytvori tabulka
    vytvorAppendStrRadek(tabArrRadek){

        var appendStrRadek = '';

        for (let i = 0; i < tabArrRadek.length; i++) {
            var radek = tabArrRadek[i];
            appendStrRadek = appendStrRadek + radek  + '\n';
        }

        return(appendStrRadek);

    }


    //dle rodicu sklada jednotlive radky za sebe
    poskladejRadkyZaSebe(tabArr, parentArr){

        var tabArrSestavene = [];
        var uroven;
        var index;

        //prvni uzel je vzdy stejny
        uroven = tabArr[0][0];
        tabArrSestavene.splice(0, 0, uroven);


        for (let i = 1; i < parentArr.length; i++) {

            index = i;
            var idArrAkt = this.ziskejPoleAktualnichId(tabArrSestavene);
            var vkladatZaId = this.vyhledejZaJakeIdVkladatRodice(idArrAkt, parentArr[index]);
            tabArrSestavene = this.vlozTabArr(tabArrSestavene, tabArr, index, vkladatZaId);

        }

        return(tabArrSestavene);
   
    }


    vyhledejZaJakeIdVkladatRodice(idArrAkt, rodic){

        var vkladatZaId = idArrAkt.indexOf(rodic);
        return(vkladatZaId);

    }


    //vlozi cely uzel tabArr za dany index
    vlozTabArr(tabArrSestavene, tabArr, index, vkladatZaId){

        var delkaSubTabArr = tabArr[index].length;
        var vlozZaIndex = vkladatZaId + 1;

        for (let i = 0; i < delkaSubTabArr; i++) {
            var uroven = tabArr[index][i];
            tabArrSestavene.splice(vlozZaIndex, 0, uroven);
            vlozZaIndex = vlozZaIndex + 1;
        }
        

        return(tabArrSestavene);

    }


    //ziska pole aktualnich id, aby vedel za ktere id ma vkladat radky tabulky
    ziskejPoleAktualnichId(tabArrSestavene){

        var idArrAkt = [];

        for (let i = 0; i < tabArrSestavene.length; i++) {
            var radekArr = tabArrSestavene[i];
            var trId = radekArr[0];
            var id = this.ziskejZTrIdJenId(trId);
            idArrAkt.push(id);
        }

        return(idArrAkt);

    }


    ziskejZTrIdJenId(trId){

        var id = trId.replace('<tr class="tableDebug" id="', '');
        id = id.replace('">', '');
        id = id.trim();

        return(id);

    }


    ziskejIdProSubTabulku(subTabulkaData){

        var idArr = [];

        for (let i = 0; i < subTabulkaData.length; i++) {
            var radek = subTabulkaData[i];
            var id = radek.id;
            idArr.push(id);
        }

        return(idArr);

    }


    ziskejTextProSubTabulku(subTabulkaData){

        var textArr = [];

        for (let i = 0; i < subTabulkaData.length; i++) {
            var radek = subTabulkaData[i];
            var text = radek.text;
            textArr.push(text);
        }

        return(textArr);

    }


    vytvorSubTabulkuOPoctuRadkuASloupcu(idArr, urovenId, textArr){

        var pocetSloupcu = 7;

        var appendStrTabArr = [];
        var trId;


        for (let i = 0; i < textArr.length; i++) {

            //obsahuje obsah bunky, ktera bude vkladana
            var obsahBunky = textArr[i];
            trId = idArr[i];


            var appendStrRadek = this.vytvorRadekTabulky(pocetSloupcu, urovenId, obsahBunky, trId);
            appendStrTabArr.push(appendStrRadek);
        }
     
        return(appendStrTabArr);

    }


    //vrati sub-appendstring radku dane subtabulky
    vytvorRadekTabulky(pocetSloupcu, indexSloupceObsahBunky, obsahBunky, trId){
        //'indexSloupceObsahBunky' obsahuje index sloupce do ktereho bude vkladat polozky 'obsahBunekArr';

        var appendStrArr = [];
        var id;
        var tr;

        //zapisuje id jen kdyz je nastavene trId;
        if(trId != ''){
            id = ' id="' + trId + '"';
        }
        else{
            id = '';
        }

        tr = '   <tr class="tableDebug"' + id + '>';
        appendStrArr.push(tr);

        for (let i = 0; i < pocetSloupcu; i++) {
            
            //nastavi radek defaultne jako prazdny
            var tdRadek = '       <td></td>';

            //je-li pozadovano zapsani hodnoty do bunky, prepise 'tdRadek';
            if(i == indexSloupceObsahBunky){
                tdRadek = '       <td>' + obsahBunky + '</td>';
            }

            //slouci appendStr, cimz postupne vytvari cely radek;
            appendStrArr.push(tdRadek);
        }


        appendStrArr.push('   </tr>');

        return(appendStrArr);

    }


    //vrati pole unikatnich polozek
    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }



}

/*
//udalost, ktera detekuje jiny pathDebug
$(document).on('DOMNodeInserted', '#pathDebug', function () {
    var pathDebug = $('#pathDebug').val();
    alert(pathDebug);
});
*/

$(document).on('change', '#pathDebug', function()  {
    alert( "Handler for .change() called." );
  });


$(document).ready(function(){

    // zatim jen vykresluje jednoduche Jsony, jakmile "value" obsahuje delší Json, má problém
    // v budoucnosti dodělat tak, aby se zanořený Json přegeneroval na Json již známý - doplnil se tento Json o zanořené položky "pol1.pol2.pol3"
    //
    //  BUDE AKTUÁLNÍ AŽ SE BUDE TESTOVAT JAVASCRIPT !!
    //

    var vv = new vykresliStrom();

});



//vytvorit pole buttonu podle tohoto:
//https://stackoverflow.com/questions/18657106/jquery-find-all-ids-in-a-class