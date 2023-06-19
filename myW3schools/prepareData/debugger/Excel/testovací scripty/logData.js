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

        var adresaKamTisknoutData = 'C://Users//jonas//OneDrive//Dokumenty//JAVASCRIPT//Javascript po KCT//GET-POST//4//views//test.json'

        fs.writeFile(adresaKamTisknoutData, tiskniDoLogu, function (err) {
            if (err) return console.log(err);
           
        })
    }

}



//data, ktera budou vytisknuta do logu
var tiskniDoLogu;

//spusti script
var start = new nactiJson();
var loguj = new logData(false);