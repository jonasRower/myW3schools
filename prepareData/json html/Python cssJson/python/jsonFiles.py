# generuje data do jsonFiles

import htmlFile

class generujJsonFiles:

    def __init__(self, cestaHtmlSrc, cestaKTisku, nazevSouboruProGen, IdMulti, runJs):

        self.IdMulti = IdMulti
        self.runJs = runJs
        self.adresaJsonFile = 'C:\\Users\\jonas\\OneDrive\\Dokumenty\\HTML\\2022\\CSS Html\\Interface\\jQueryScript\\json\\jsonFiles.json'
        jsonFiles = self.ziskejJsonFilesArr(self.adresaJsonFile)
        deliciRadky = self.vratSeznamDelicichRadku(jsonFiles)

        kategorie = []
        kategorie.append('css')
        kategorie.append('border')

        jsonName = nazevSouboruProGen
        pathJson = self.ziskejPath(cestaKTisku)
        pathSrc = self.ziskejPath(cestaHtmlSrc)
        htmlName = self.ziskejHtmlName(kategorie, cestaHtmlSrc)

        jsonFilesSekce = self.rozdelJsonFilesNaSubPole(jsonFiles, deliciRadky)
        jsonNameAll = self.ziskejJsonNameProVsechnySekce(jsonFilesSekce)
        jsonNameBool = self.vratPoleObsahujiciJsonNameBool(jsonNameAll, jsonName)

        # aby nepridal duplicitu, odebira puvodni data
        jsonFilesSekcePredPridanim = self.vratSekceBezDuplicitnihoJsonName(jsonFilesSekce, jsonNameBool)
        jsonFilesSekceNew = self.pridejSekciNew(jsonFilesSekcePredPridanim, jsonName, pathJson, pathSrc, htmlName, self.IdMulti)



        #####################    otestovat   ########################

        #vytvori novy jsonFileArr
        jsonFilesArrNew = self.vytvorJsonFileNew(jsonFilesSekceNew)

        # vytiskne soubor
        self.tiskniJSON(jsonFilesArrNew, self.adresaJsonFile)
        jsonFilesArrNew = self.opravJsonFile(jsonFilesArrNew)

        # tiskne html
        htmlFile.generujHtmlFile(pathJson, '<div class="json">')

        print('')



    def opravJsonFile(self, jsonFilesArr):

        prvniRadek = 'jsonFiles = \'{"files": [\''
        predposledniRadek = '\'	}}\''
        posledniRadek = '\'	]}\''

        jsonFilesArrNew = []

        jsonFilesArrNew.append(prvniRadek)
        jsonFilesArrNew = jsonFilesArrNew + jsonFilesArr
        jsonFilesArrNew[len(jsonFilesArrNew)-1] = predposledniRadek
        jsonFilesArrNew.append(posledniRadek)

        #doplni do pole carky
        self.doplnDoPoleCarky(jsonFilesArrNew, '\'	}}\'')

        return(jsonFilesArrNew)


    # doplniDoPoleCarky
    def doplnDoPoleCarky(self, pole, radekExp):

        for i in range(0, len(pole)-2):

            radek = pole[i]
            if(radek == radekExp):
                pole = self.doplnCarkuDoRadku(i, pole, 2)

        return(pole)


    def vytvorJsonFileNew(self, jsonFilesSekceNew):

        jsonFilesArrNew = []

        for i in range(0, len(jsonFilesSekceNew)):
            sekce = jsonFilesSekceNew[i]
            jsonFilesArrNew = jsonFilesArrNew + sekce

        #opravi json
        jsonFilesArrNew = self.opravJsonFile(jsonFilesArrNew)

        # doplnCarkuDoRadku
        return(jsonFilesArrNew)




    def pridejSekciNew(self, jsonFilesSekce, jsonName, pathJson, pathSrc, htmlName, idMulti):

        folderPath = ''

        if(idMulti != ''):
            typeOfProject = 'multiFile'
            folderPath = self.ziskejDefaultniFolderPath(pathSrc)
        else:
            typeOfProject = 'singleFile'

        sekceNew = self.vytvorSekciNew(jsonName, pathJson, pathSrc, htmlName, typeOfProject, folderPath, idMulti)
        jsonFilesSekce.append(sekceNew)

        return(jsonFilesSekce)


    def ziskejDefaultniFolderPath(self, pathSrc):

        pathSrcSpl = pathSrc.split('/')
        folderPath = ''

        for i in range(len(pathSrcSpl)-3, len(pathSrcSpl)):
            polozka = pathSrcSpl[i]
            folderPath = folderPath + polozka
            if(i < len(pathSrcSpl)-1):
                folderPath = folderPath + '/'

        return(folderPath)



    def vytvorSekciNew(self, jsonName, pathJson, pathSrc, htmlName, typeOfProject, folderPath, idMulti):

        sekceNew = []

        radek = '\'	{"jsonHtml": {\''
        sekceNew.append(radek)

        radek = '\'		"jsonName": "' + jsonName + '",\''
        sekceNew.append(radek)

        radek = '\'		"htmlName": "' + htmlName + '",\''
        sekceNew.append(radek)

        radek = '\'		"pathJson": "' + pathJson + '",\''
        sekceNew.append(radek)

        radek = '\'		"pathSrc": "' + pathSrc + '",\''
        sekceNew.append(radek)

        radek = '\'		"typeOfProject": "' + typeOfProject + '"\''
        sekceNew.append(radek)

        self.sestavAdresuDebugPath(pathJson)

        #otestovat toto!!
        if(folderPath != ''):
            sekceNew = self.doplnCarkuDoRadku(None, sekceNew, 1)
            radek = '\'		"folderPath": "' + folderPath + '"\''
            sekceNew.append(radek)

        if(idMulti != ''):
            sekceNew = self.doplnCarkuDoRadku(None, sekceNew, 1)
            radek = '\'		"idMulti": "' + idMulti + '"\''
            sekceNew.append(radek)

        if(self.runJs != ''):
            sekceNew = self.doplnCarkuDoRadku(None, sekceNew, 1)
            radek = '\'		"attachedJs": "' + self.runJs + '"\''
            sekceNew.append(radek)

            # doplni pathDebug - je vzdy, kdyz je sekceNew
            pathDebug = self.sestavAdresuDebugPath(pathJson)
            sekceNew = self.doplnCarkuDoRadku(None, sekceNew, 1)
            radek = '\'		"pathDebug": "' + pathDebug + '"\''
            sekceNew.append(radek)


        radek = '\'	}},\''
        sekceNew.append(radek)


        return(sekceNew)



    def sestavAdresuDebugPath(self, pathJson):

        pathJsonNew = pathJson.replace('generatedJson/js', 'treeDebug')
        pathJsonSpl = pathJsonNew.split('/')
        nazevSouboru = pathJsonSpl[len(pathJsonSpl)-1]
        nazevSouboruNew = nazevSouboru.replace('.json', 'Debug.json')

        # slozi cestu nazpet
        pathDebug = ''

        for i in range(0, len(pathJsonSpl)-1):
            pathDebug = pathDebug + pathJsonSpl[i] + '/'

        pathDebug = pathDebug + nazevSouboruNew

        return(pathDebug)



    def doplnCarkuDoRadku(self, indexRadku, sekceNew, typ):

        if(indexRadku == None):
            indexRadku = len(sekceNew)-1

        radek = sekceNew[indexRadku]

        if (typ == 1):
            radekNew = radek.replace('"\'', '",\'')

        if (typ == 2):
            radekNew = radek.replace('\'	}}\'', '\'	}},\'')


        sekceNew[indexRadku] = radekNew

        return(sekceNew)


    def vratSekceBezDuplicitnihoJsonName(self, jsonFilesSekce, jsonNameBoolArr):

        jsonFilesSekceNew = []

        for i in range(0, len(jsonFilesSekce)):
            sekce = jsonFilesSekce[i]
            jsonNameBool = jsonNameBoolArr[i]
            if(jsonNameBool == False):
                jsonFilesSekceNew.append(sekce)

        return(jsonFilesSekceNew)



    def vratPoleObsahujiciJsonNameBool(self, jsonNameAll, jsonNameExp):

        jsonNameBool = []

        for i in range(0, len(jsonNameAll)):
            jsonBool = False
            jsonName = jsonNameAll[i]

            if(jsonName == jsonNameExp):
                jsonBool = True

            jsonNameBool.append(jsonBool)

        return(jsonNameBool)


    def ziskejJsonNameProVsechnySekce(self, jsonFilesSekce):

        jsonNameAll = []

        for i in range(0, len(jsonFilesSekce)):
            sekce = jsonFilesSekce[i]
            radekJsonName = sekce[1]
            klicHodnota = self.ziskejKlicHodnotu(radekJsonName)

            hodnota = klicHodnota[1]
            hodnota = hodnota.replace('",', '')
            hodnota = hodnota.replace('"', '')

            jsonNameAll.append(hodnota)

        return(jsonNameAll)



    def ziskejKlicHodnotu(self, radek):

        radek1 = radek.replace('\'', '')
        radek1 = radek1.replace('\t', '')
        radek1 = radek1.strip()
        klicHodnota = radek1.split(': ')

        return(klicHodnota)




    def rozdelJsonFilesNaSubPole(self, jsonFiles, deliciRadky):

        jsonFilesSekce = []

        for i in range(0, len(deliciRadky)-1):
            prvniIndex = deliciRadky[i]
            posledniIndex = deliciRadky[i+1]

            subPole = jsonFiles[prvniIndex:posledniIndex:1]
            jsonFilesSekce.append(subPole)


        # prida posledni sekci
        prvniIndex = posledniIndex
        posledniIndex = len(jsonFiles)-1

        subPole = jsonFiles[prvniIndex:posledniIndex:1]
        jsonFilesSekce.append(subPole)


        return(jsonFilesSekce)


    def vratSeznamDelicichRadku(self, jsonFiles):

        deliciRadky = []

        for i in range(0, len(jsonFiles)):
            radek = jsonFiles[i]

            if(radek == '\'	{"jsonHtml": {\''):
                deliciRadky.append(i)

        return(deliciRadky)


    # ziska jsonFiles jako pole, s tim ze odebere nepotrebne znaky
    def ziskejJsonFilesArr(self, adresaJsonFile):

        jsonFiles = self.nactiJson(adresaJsonFile)
        jsonFilesNew = []

        for i in range(0, len(jsonFiles)):
            radek = jsonFiles[i]
            radekNew = radek.replace('\n', '')
            radekNew = radekNew.replace('\' +', '\'')
            jsonFilesNew.append(radekNew)

        return(jsonFilesNew)


    def ziskejHtmlName(self, kategorie, cestaHtmlSrc):

        cestaSplit = cestaHtmlSrc.split('\\')
        nazevSouboru = cestaSplit[len(cestaSplit)-1]
        htmlName = ''

        for i in range(0, len(kategorie)):
            kat = kategorie[i]
            htmlName = htmlName + kat + '/'

        htmlName = htmlName + nazevSouboru

        return(htmlName)


    def ziskejPath(self, cestaKTisku):

        cestaSpl = cestaKTisku.split('\\')
        indGenJson = cestaSpl.index('sources')
        jsonName = ''

        for i in range(indGenJson, len(cestaSpl)):
            polozka = cestaSpl[i]
            jsonName = jsonName + polozka

            if(i < len(cestaSpl)-1):
                jsonName = jsonName + '/'

        return(jsonName)


    def nactiJson(self, adresaJson):

        pole = []

        r = -1
        with open(adresaJson, 'r') as f:
            for line in f:
                r = r + 1

                pole.append(line)

        return (pole)


    def tiskniJSON(self, dataKTisku, nazevSouboru):

        dataWrite = ""
        f = open(nazevSouboru, 'w')

        for i in range(0, len(dataKTisku)):
            radek = str(dataKTisku[i])
            if(i < len(dataKTisku) - 1):
                radek = radek + ' +'
            else:
                radek = radek + ';'

            dataWrite = dataWrite + radek + '\n'

        f.write(dataWrite)
        f.close()

    print("")
