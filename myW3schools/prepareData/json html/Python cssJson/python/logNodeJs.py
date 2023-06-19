
# vytvari data rovnou, NodeJs se nepouziva!!
# vytvori kostru, data je potreba rucne poupravit !!

class logujNodeJs:

    def __init__(self, obsahHtml, rowTypeArr, cestaKTiskuHlavnihoJsonu):

        jsZdrojArr = self.ziskejZdrojJavascriptu(obsahHtml, rowTypeArr)
        varValRowStartArr = self.ziskejVarValRowStartArr(jsZdrojArr)

        nazevSouboru = self.zjistiNazevSouboru(cestaKTiskuHlavnihoJsonu)
        stromStrArr = self.generujStromDebugJson(varValRowStartArr, nazevSouboru)
        cestaNew = self.zjistiCestuKTisku(cestaKTiskuHlavnihoJsonu, nazevSouboru)

        self.tiskniJSON(stromStrArr, cestaNew)

        print()
 

    def zjistiNazevSouboru(self, cestaKTiskuHlavnihoJsonu):

        cestaSpl = cestaKTiskuHlavnihoJsonu.split('\\')
        nazevSouboru = cestaSpl[len(cestaSpl) - 1]
        nazevSouboruNew = nazevSouboru.replace('.json', 'Debug.json')

        return(nazevSouboruNew)


    # modifikuje cestu k tisku, jelikoz ta stavajici se tyka hlavniho jsonu
    def zjistiCestuKTisku(self, cestaKTiskuHlavnihoJsonu, nazevSouboruNew):

        cestaModif = cestaKTiskuHlavnihoJsonu.replace('\\generatedJson\\', '\\treeDebug\\')
        cestaSpl = cestaModif.split('\\')

        cestaNew = ''
        for i in range(0, len(cestaSpl)-2):
            cestaNew = cestaNew + cestaSpl[i] + '\\'

        cestaNew = cestaNew + nazevSouboruNew

        return(cestaNew)


    def generujStromDebugJson(self, varValRowStartArr, nazevSouboru):

        stromStrArr = []
        stromStrArr.append(nazevSouboru + ' = \'{"stromDebug": [\'')

        for i in range(0, len(varValRowStartArr)):
            varValRowStartRadek = varValRowStartArr[i]

            if(i == len(varValRowStartArr)-1):
                pridatCarku = False
            else:
                pridatCarku = True

            uzelStrArr = self.generujUzelDebugJson(varValRowStartRadek, pridatCarku)
            stromStrArr = stromStrArr + uzelStrArr

        stromStrArr.append('	]}')

        return(stromStrArr)


    def generujUzelDebugJson(self, varValRowStartRadek, pridatCarku):

        var = varValRowStartRadek[0]
        val = varValRowStartRadek[1]
        rowSatart = varValRowStartRadek[2]

        uzelStrArr = []
        uzelStrArr.append('	{"variable": {')
        uzelStrArr.append('       "var": "' + var + '",')
        uzelStrArr.append('       "rowStart": ' + str(rowSatart) + ',')
        uzelStrArr.append('       "rowEnd": ' + str(999) + ',')
        uzelStrArr.append('       "value": "' + val + '",')

        if(pridatCarku == True):
            uzelStrArr.append('   }},')
        else:
            uzelStrArr.append('   }}')

        return(uzelStrArr)


    def ziskejZdrojJavascriptu(self, obsahHtml, rowTypeArr):

        jsZdrojArr = []

        for i in range(0, len(rowTypeArr)):
            rowType = rowTypeArr[i]

            if(rowType == 'js'):
                radekJs = obsahHtml[i]
            else:
                radekJs = ''

            jsZdrojArr.append(radekJs)

        return(jsZdrojArr)


    # ziska pole s promennou, hodnotou, rowStart
    def ziskejVarValRowStartArr(self, jsZdrojArr):

        varValRowStartArr = []

        for i in range(0, len(jsZdrojArr)):
            radek = jsZdrojArr[i]
            radekObsahujePromennou = self.detekujZdaRadekObsahujeSubstr(radek, '=')
            if(radekObsahujePromennou == True):
                varValRowStart = self.ziskejVarValRowStartRadek(radek, i)
                varValRowStartArr.append(varValRowStart)

        return(varValRowStartArr)


    # ziska radek s konkretni promennou, hodnotou, rowStart
    def ziskejVarValRowStartRadek(self, radek, index):

        radekSpl = radek.split('=')
        var = radekSpl[0]
        var = var.replace('var', '')
        var = var.strip()

        val = radekSpl[1]
        val = val.replace(';', '')
        val = val.strip()
        rowStart = index

        varValRowStart = []
        varValRowStart.append(var)
        varValRowStart.append(val)
        varValRowStart.append(rowStart)

        return(varValRowStart)


    def detekujZdaRadekObsahujeSubstr(self, radek, substr):

        try:
            ind = radek.index(substr)
            if (ind > -1):
                radekObsahujeSubstr = True
            else:
                radekObsahujeSubstr = False

        except:
            radekObsahujeSubstr = False

        return (radekObsahujeSubstr)


    def tiskniJSON(self, dataKTisku, nazevSouboru):

        dataWrite = ""

        f = open(nazevSouboru, 'w')

        for i in range(0, len(dataKTisku)):
            radek = str(dataKTisku[i])
            if(i > 0):
                radek = '\'' + radek + '\''

            if (i < len(dataKTisku) - 1):
                radek = radek + ' +'
            else:
                radek = radek + ';'

            dataWrite = dataWrite + radek + '\n'

        f.write(dataWrite)
        f.close()



