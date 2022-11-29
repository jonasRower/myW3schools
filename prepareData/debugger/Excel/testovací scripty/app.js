
var fs = require('fs');



class nactiJson{

    constructor(){

        var a = 5;
        var loguj = new logData(a, "a", 9, 13);

        var b = 6;
        var loguj = new logData(b, "b", 11, 13);

        var test = this.test1(a, b);

    }

    test1(a, b){

        a = a + 6;
        var loguj = new logData(a, "a", 19, 24);

        var c = a * b;
        var loguj = new logData(c, "c", 21, 24);

    }

}



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
        jsonVariable =  '	{"variable": {\n' +
                        '		"var": "' + variable + '",\n' +
                        '		"rowStart": ' + rowStart + ',\n' +
                        '		"rowEnd": ' + rowEnd + ',\n' +
                        '		"value": "' + value + '"\n' +
                        '	}},\n';

        if(tiskniDoLogu == undefined){
            tiskniDoLogu = jsonVariable;
        }
        else{
            tiskniDoLogu = tiskniDoLogu + jsonVariable;
        }

    }


    vytiskniData(){

        console.log('tiskniData');

        fs.writeFile('helloworld.txt', tiskniDoLogu, function (err) {
            if (err) return console.log(err);
            console.log('Hello World > helloworld.txt');

        })
    }

}



//data, ktera budou vytisknuta do logu
var tiskniDoLogu;

var start = new nactiJson();
console.log(tiskniDoLogu);
var loguj = new logData(false);



