
//pripravi data pro vykresleni stromDebug
//uchovava indexy radku, na kterych je ulozen breakpoint

class sledujBreakPoints{

    constructor(){

        this.ziskejPoleRadkuProJednotliveButtony();
        this.ulozStromDebugJsonDoGlobProm();

        //console.log(cislaRadkuArr);
        //console.log(idDebugButtArr);

    }

    ziskejPoleRadkuProJednotliveButtony(){

        $('.breakPointButt').each(function () {
            
            var id = this.id;
            var cisloRadkuStr = id.replace('breakPointButt_', '');
            var cisloRadkuInt = parseInt(cisloRadkuStr);

            //zapise id do pole
            idDebugButtArr.push(id)

            //zapise cisla radku do pole
            cislaRadkuArr.push(cisloRadkuInt);

            //pripravi pole, kde nastavi, ze na zadne tlacitko (debug) nebylo jeste kliknuto
            breakPointsArr.push(false);

        });

        return(cislaRadkuArr);

    }

    //ulozi stromDebug.json do globalni promenne
    //to z duvodu, ze kdyz klikne na debugButt, tak aby nenacital strom pokazde znovu a znovu
    ulozStromDebugJsonDoGlobProm(){

        var json = stromDebug;
        stromDebugData = JSON.parse(json);

    }

}


//zapise radek debug do dat, tak aby mohl jednotlive radky ukladat
class zapisDebugRadek{

    constructor(id){

        this.prepniDebugButt(id);
        var cisloRadkuTrue = this.ziskejPoleVsechBreakPointuTrue()
        
        //zapisuje do globalnich dat, tak aby znal data, pri dalsim volani teto tridy
        this.prepniDebugButt(cisloRadkuTrue);

        //pripravy strom debug pro vsechny radky v poli cisloRadkuTrue
        //ulozi je rovnou do globalnich promennych
        stromDebugNew = this.pripravPrislusneStromDebug(cisloRadkuTrue);

    }

    //nastavi pro dany debugButton true nebo false 
    prepniDebugButt(id){

        var indId = idDebugButtArr.indexOf(id);
        var statusBreakPoint = breakPointsArr[indId];

        if(statusBreakPoint == false){
            breakPointsArr[indId] = true;
        }
        else{
            breakPointsArr[indId] = false;
        }

    }

    //ziska pole vsech indexu radku, ktere jsou true
    ziskejPoleVsechBreakPointuTrue(){

        var cislaRadkuTrue = []

        for (let i = 0; i < breakPointsArr.length; i++) {
            var statusBreakPoint = breakPointsArr[i];
            if(statusBreakPoint == true){
                var cisloRadkuTrue = cislaRadkuArr[i];
                cislaRadkuTrue.push(cisloRadkuTrue);
            }
        }

        return(cislaRadkuTrue);

    }

    //vrati stromDebug uroven, dle zadaneho radku
    pripravPrislusneStromDebug(cisloRadkuTrue){

        var stromDebugVybraneAll = []
        var stromDebugNew;

        for (let i = 0; i < cisloRadkuTrue.length; i++) {

            var cisloRadku = cisloRadkuTrue[i];
            var stromDebugVybrane = this.vratStromDebugProDanyRadek(cisloRadku);
            stromDebugVybraneAll = stromDebugVybraneAll.concat(stromDebugVybrane);

        }

        stromDebugNew = {"stromDebug":stromDebugVybraneAll};
        
        return(stromDebugNew);
        
    }

    //vrati prislusne data stromDebug
    vratStromDebugProDanyRadek(cisloRadku){

        var stromDebugVybrane = [];

        for (let i = 0; i < stromDebugData.stromDebug.length; i++) {
            
            var stromDebugVariable = stromDebugData.stromDebug[i].variable;
            var rowStart;
            var rowEnd;

            rowStart = stromDebugVariable.rowStart;
            rowEnd = stromDebugVariable.rowEnd;

            if(cisloRadku > rowStart){
                if(cisloRadku <= rowEnd){
                    stromDebugVybrane.push(stromDebugData.stromDebug[i]);
                }
            }
        }

        return(stromDebugVybrane);

    }

}


var stromDebugData;
var stromDebugNew;
var breakPointsArr = [];
var cislaRadkuArr = [];
var idDebugButtArr = [];


//udalost sledujici klikani na debugButt
$(document).on('click', '.breakPointButt', function () {
   
    //zapise status breakpointu do pole
    var statusBreakPoint = new zapisDebugRadek(this.id);

});


//udalost, ktera spusti script v okamziku, kdyz jsou pridany debugButtony
$(document).on('DOMNodeInserted', 'tr:nth-child(1)', function () {

    //obnovi data
    cislaRadkuArr = [];
    var breakPoint = new sledujBreakPoints("default");

});


$(document).ready(function(){
   // var breakPoint = new sledujBreakPoints("default");
});
