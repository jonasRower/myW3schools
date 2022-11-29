class nactiJson{

                constructor(){

                    var x = 5;
                    var loguj = new logData(x , "x ", 5, 9);
                    var y = 6;
                    var loguj = new logData(y , "y ", 6, 9);
		var z = x + y;
var loguj = new logData(		z , "		z ", 7, 0);

                }

}

var fs = require('fs');

class logData{

                constructor(value, variable, rowStart, rowEnd){

                    if(value == false){
                        this.vytiskniData();
                    }
                    else{
                        this.zapisDataJakoGlobalni(value, variable, rowStart, rowEnd);
                    }

                }


                zapisDataJakoGlobalni(value, variable, rowStart, rowEnd){

                    var jsonVariable;
                    jsonVariable =  '\'	{"variable": {\n' +
                        						'\'       "var": "' + variable + '",\' +\n' +
                        						'\'       "rowStart": ' + rowStart + ',\' +\n' +
                        						'\'       "rowEnd": ' + rowEnd + ',\' +\n' +
                        						'\'       "value": "' + value + '"\' +\n' +
                        						'\'   }},\' +\n';

                    if(tiskniDoLogu == undefined){
                        tiskniDoLogu = jsonVariable;
                    }
                    else{
                        tiskniDoLogu = tiskniDoLogu + jsonVariable;
                    }

                }


                vytiskniData(){

                    var adresaKamTisknoutData = 'C://Users//jonas//OneDrive//Dokumenty//HTML//2022//CSS Html//prepareData//debugger//NodeJs//prvniJsDebug.json'

                    fs.writeFile(adresaKamTisknoutData, tiskniDoLogu, function (err) {
                        if (err) return console.log(err);

                    })
                }

}




var tiskniDoLogu;


var start = new nactiJson();
var loguj = new logData(false);

