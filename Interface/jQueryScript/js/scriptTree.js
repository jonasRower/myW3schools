//C:\Users\jonas\OneDrive\Dokumenty\HTML\2022\test2
class vykresliStromFolder{

    constructor(inputTreeJson){

        var jsonFilesObj = JSON.parse(jsonFiles);

        $('#tree').jstree({
            "core": {
                "check_callback": true
            },
            "plugins": ["dnd"]
        });
        
        console.log(inputTreeJson);
        var jsTreeDataJson = this.vratJsTreeData(inputTreeJson);

        console.log(jsTreeDataJson);
        
        //odebere predchozi strom
        $('#usingJsonTree').remove();

        //prida strom novy
        $('.tree').append('<div id="usingJsonTree"></div>');
        var myTree = $('#usingJsonTree').jstree(jsTreeDataJson);

        myTree.on('changed.jstree', function(e, data) {
            var selected = data.instance.get_selected();
            var kliknutiDoStromu = new nastavComboboxyDleKliknutiDoStromu(inputTreeJson, selected, jsonFilesObj)
        });

    }


    vratJsTreeData(inputTreeJson){
        
        var dataArr = this.vratIdParentTextArr(inputTreeJson);
        var jsTreeDataStr = '{ "core" : { \n' + 
                            '       "data" : [ ' + 
                            '               \n{ "id" : "tree_0", "parent" : "#", "text" : "project" },';


        for (var i = 0; i < dataArr.length; i++){

            var id = dataArr[i][0];
            var parent = dataArr[i][1];
            var text = dataArr[i][2];

            var radek = '\n{ "id" : "' + id + '", "parent" : "' + parent + '", "text" : "' + text + '" }';

            jsTreeDataStr = jsTreeDataStr + radek;
            if(i < dataArr.length-1){
                jsTreeDataStr = jsTreeDataStr + ',';
            }

        }

        jsTreeDataStr = jsTreeDataStr + ']\n';
        jsTreeDataStr = jsTreeDataStr + '} }';
        var jsTreeDataJson = JSON.parse(jsTreeDataStr);

        
        return(jsTreeDataJson);

    }


    vratIdParentTextArr(inputTreeJson){

        var pocetUrovni = this.ziskejPocetUrovni(inputTreeJson);
        var idParentTextArr = undefined;

        for (var i = 1; i < pocetUrovni+1; i++){
            idParentTextArr = this.vratRadkyStejneUrovne(inputTreeJson, i, idParentTextArr);
        }

        return(idParentTextArr)

    }


    ziskejPocetUrovni(inputTreeJson){

        var pocetUrovni = inputTreeJson[inputTreeJson.length-1][1] + 1;
        
        return(pocetUrovni);

    }


    ziskejPolozkyDaneUrovne(inputTreeJson, urovenExp){

        var vratPoslednipolozky = false;
        var polozkyDaneUrovne = [];

        if(urovenExp == 3){
            urovenExp = 2;
            vratPoslednipolozky = true;
        }

        for (let i = 0; i < inputTreeJson.length; i++){

            var polozkyRadek = inputTreeJson[i];
            var uroven = polozkyRadek[1];

            if(uroven == urovenExp){
                if(vratPoslednipolozky == false){
                    var polozka = polozkyRadek[0];
                    polozkyDaneUrovne.push(polozka);
                }
                else{
                    var polozkyChild = this.ziskejPolozkyChild(polozkyRadek);
                    polozkyDaneUrovne = polozkyDaneUrovne.concat(polozkyChild);
                }
            }
        }

        return(polozkyDaneUrovne);

    }



    vratRadkyStejneUrovne(inputTreeJson, urovenExp, idParentTextArr){

        var polozkyDaneUrovne = this.ziskejPolozkyDaneUrovne(inputTreeJson, urovenExp);

        var urovenPrev = urovenExp - 1;
        
        if(urovenPrev > 0){
            for (var i = 0; i < polozkyDaneUrovne.length; i++){
                
                var polozkaUrovne = polozkyDaneUrovne[i];
                var idParentTextPrev = this.ziskejIdParentTextPredchudce(polozkaUrovne, inputTreeJson, idParentTextArr, urovenPrev);
                var radekChildArr = this.ziskejRadekOdPredchudce(polozkaUrovne, idParentTextPrev, urovenPrev);

                //console.log(polozkaUrovne);
                //console.log(idParentTextPrev);

                idParentTextArr.push(radekChildArr);

            }
            //console.log(idParentTextArr);
        }
        else{

            var idParentTextArr = [];

            for (var i = 0; i < polozkyDaneUrovne.length; i++){
                var i1 = i + 1;
                var parent = 'tree_' + urovenPrev;
                var id = parent + '_' + i1;
                var text = polozkyDaneUrovne[i];

                var idParentTextRadek = [];
                idParentTextRadek.push(id);
                idParentTextRadek.push(parent);
                idParentTextRadek.push(text);

                //to bude asi nekde jinde
                //var radek = '{ "id" : "' + id + '", "parent" : "' + parent + '", "text" : "' + text + '" }\n';
                //radkyStejneUrovne = radkyStejneUrovne + radek;

                idParentTextArr.push(idParentTextRadek);
            }

        }

        
        return(idParentTextArr);

    }


    ziskejIdParentTextPredchudce(textChild, inputTreeJson, idParentTextArr, urovenExp){

        
        var idParentTextPrev = undefined;

        for (let i = 0; i < inputTreeJson.length; i++){

            var polozkyJsonRadek = inputTreeJson[i];
            var uroven = polozkyJsonRadek[1];
            
            if(uroven == urovenExp){
            
                var polozkyChild = this.ziskejPolozkyChild(polozkyJsonRadek);
                var textChildJeVPoli = polozkyChild.includes(textChild);

                if(textChildJeVPoli == true){
                    idParentTextPrev = idParentTextArr[i];
                    
                    if(textChildJeVPoli.length == 3){
                        idParentTextPrev.push(0);
                    }

                    var index = polozkyChild.indexOf(textChild)+1;
                    idParentTextPrev[3] = index;
                    break;
                }

            }
        
        }
        
        return(idParentTextPrev);

    }


    ziskejRadekOdPredchudce(textChild, idParentTextPrev, index1){

        var idPrev = idParentTextPrev[0];
        var parentPrev = idParentTextPrev[1];
        var index = idParentTextPrev[3];

        var id = idPrev + '_' + index;
        var parent = idPrev;
        
        var radekChildArr = [];
        radekChildArr.push(id);
        radekChildArr.push(parent);
        radekChildArr.push(textChild);

        return(radekChildArr);

    }


    ziskejPolozkyChild(polozkyJsonRadek){

        var polozkyChild = [];

        for (let i = 2; i < polozkyJsonRadek.length; i++){
            var polozka = polozkyJsonRadek[i];
            polozkyChild.push(polozka);
        }

        return(polozkyChild);

    }

}


//na zaklade kliknuti do stromu, vyhleda prislusne comboboxy a nastavi je
class nastavComboboxyDleKliknutiDoStromu{

    constructor(inputTreeJson, selected, jsonFilesObj){

        var folderPath = this.sestavfolderPath(inputTreeJson, selected[0], jsonFilesObj);
        var htmlName = this.vyhledejHtmlName(jsonFilesObj, folderPath);
       // this.nastavComboBoxy(htmlName);

    }


    //prida jsonName do inputBoxu, aby mohl vykreslit zdrojak a nahled
    zapisJsonNameJakoInputAppendStr(jsonName, htmlName){

        $('.tree').append('<input type="text" class="inputHtmlName" value="' + htmlName + '"></input>');
        //$('.tree').append('<input type="text" class="inputJsonName" value="' + jsonName + '"></input>');

    }


    nastavComboBoxy(htmlName){

        if(htmlName != undefined){

            var htmlNameSpl = htmlName.split("/");

            var value1 = htmlNameSpl[0];
            var value2 = htmlNameSpl[1];
            var value3 = htmlNameSpl[2];

            $('#combo_0').val(value1);
            $('#combo_1').val(value2);
            $('#combo_2').val(value3);
            
        }
        
    }


    sestavfolderPath(inputTreeJson, selected){

        var sel2 = selected.replace('tree_0_1_','');
        var selSpl = sel2.split('_');
        var radek = parseInt(selSpl[0]);
        var slouec = parseInt(selSpl[1]) + 1;

        var slozka1 = inputTreeJson[0][0]
        var slozka2 = inputTreeJson[radek][0]
        var slozka3 = inputTreeJson[radek][slouec]

        var folderPath = slozka1 + '/' + slozka2 + '/' + slozka3
        
        return(folderPath);

    }


    vyhledejHtmlName(jsonFilesObj, folderPathExp){

        var htmlName = undefined;

        for (let i = 2; i < jsonFilesObj.files.length; i++){
      
            var typeOfProject = jsonFilesObj.files[i].jsonHtml.typeOfProject;

            if(typeOfProject == 'multiFile'){
                var folderPath = jsonFilesObj.files[i].jsonHtml.folderPath;
                if(folderPath == folderPathExp){
        
                    var jsonName = jsonFilesObj.files[i].jsonHtml.jsonName;
                    var htmlName = jsonFilesObj.files[i].jsonHtml.htmlName;


                    //vyhleda jsonName, tak aby mohl zapsat inputAppend, aby mohl vykreslit pomoci script.js
                    var zapisJsonName = this.zapisJsonNameJakoInputAppendStr(jsonName, htmlName);
                }
            }

        }

        return(htmlName);

    }

}



//udalost, ktera prijima data do tohoto scriptu, pres inputBox
$(document).on('DOMNodeInserted', '.inputTree', function () {

    var inputTreeVal = $('.inputTree').last().val();
    var inputTreeJson = JSON.parse(inputTreeVal);

    var jsTree = new vykresliStromFolder(inputTreeJson);

    //odebere '#inputTree', jelikoz data jiz prevzal
    $('.inputTree').remove();

});




//klikani do stromu
$(document).on('click', '#usingJsonTree', function () {

    //NEJAK TO NEFUNGUJE - VYZKOUSET NA PUVODNICH DATECH DOLE

    //var data = $('#usingJsonTree').jstree().get_selected(true)[0].id;
    //console.log(data);
})


/*

  var jsTreeData = { 'core' : {
            'data' : [
               { "id" : "ajson1", "parent" : "#", "text" : "Simple root node" },
               { "id" : "ajson2", "parent" : "#", "text" : "Root node 2" },
               { "id" : "ajson3", "parent" : "ajson2", "text" : "Child 1" },
               { "id" : "ajson4", "parent" : "ajson2", "text" : "Child 2" },
               { "id" : "ajson40", "parent" : "ajson4", "text" : "Child 20" },
            ]
        } }

*/
