
# dopocita meritko grafu, tak aby se JSON zobrazil v meritku a byl citelny

import keyValuesCsv
import jsonCombo
import jsonFiles
import poleOdsazeni
import externiJs
import logNodeJs
import os


class generujJson:

    def __init__(self, cestaHtmlSrc, idMulti):

        self.cestaHtmlSrc = cestaHtmlSrc
        self.cestaKTisku = self.ziskejAdresuProGenerovani(self.cestaHtmlSrc)
        self.cestaProVytvoreniSlozky = self.ziskejAdresuProVytvoreniSlozky(self.cestaKTisku)

        nazevJsonuProGen = self.ziskejNazevSouboruProGenerovani(self.cestaKTisku)
        nazevSouboruProGen = nazevJsonuProGen.replace('.json', '')

        self.ziskejAdresuProGenerovani(self.cestaHtmlSrc)

        keyVal = keyValuesCsv.nactiKeyValue()
        self.kliceAHodnoty = keyVal.getKliceAHodnoty()

        obsahHtml = self.nactiHtml(self.cestaHtmlSrc)
        rowTypeArr = self.vratPoleRowType(obsahHtml)

        # vytvari data do logu do nodeJs - ZATIM SE NEBUDE POUZIVAT
        # logNodeJs.logujNodeJs(obsahHtml, rowTypeArr, self.cestaKTisku)

        # externiJs se bude spoustet pokud bude detekovan "js" v "rowTypeArr"
        obsahujeJs = self.detekujZdaGenerovatExterniJs(rowTypeArr)
        runJs = ''
        if(obsahujeJs == True):
            externiJs.generujExterniJs(obsahHtml, rowTypeArr, cestaHtmlSrc, self.cestaKTisku)
            runJs = self.ziskejRunJs(nazevSouboruProGen)

        # ziska pole indexu odsazeni, aby urcil o kolik budou jednotlive radky odsazene
        odsazeni = poleOdsazeni.odsadRadky(obsahHtml)
        poleIndexuZanoreni = odsazeni.getPoleIndexuZanoreni()

        jsonArr = self.vytvorJson(obsahHtml, nazevSouboruProGen, poleIndexuZanoreni, rowTypeArr)
        self.tiskniJSON(jsonArr, self.cestaKTisku)

        jsonFiles.generujJsonFiles(self.cestaHtmlSrc, self.cestaKTisku, nazevSouboruProGen, idMulti, runJs)
        print()





    def ziskejRunJs(self, nazevSouboruProGen):

        runJs = ''
        nazevSouboruProGenSpl = nazevSouboruProGen.split('_')
        for i in range(1, len(nazevSouboruProGenSpl)):
            slozka = nazevSouboruProGenSpl[i]
            runJs = runJs + slozka
            if(i < len(nazevSouboruProGenSpl)-1):
                runJs = runJs + '_'

        runJs = runJs + '.js'

        return(runJs)


    def detekujZdaGenerovatExterniJs(self, rowTypeArr):

        obsahujeJs = False

        for i in range(0, len(rowTypeArr)):
            rowType = rowTypeArr[i]
            if(rowType == 'js'):
                obsahujeJs = True
                break

        return (obsahujeJs)


    # v sekci <script> je potreba nahradit uvozovky procentem, jelikoz v teto casti zdrojaku si s tim javascript poradi a prevede zpet % na uvozovky
    def opravUvozovkyUScriptu(self, rowTypeArr):

        print()


    def vratPoleRowType(self, obsahHtml):

        rowTypeArr = []

        for i in range(0, len(obsahHtml)):
            radek = obsahHtml[i]

            radekObsahujeDocType = self.detekujZdaRadekObsahujeSubstr(radek, '<!doctype html>')
            radekObsahujeScript = self.detekujZdaRadekObsahujeSubstr(radek, '<script>')
            radekObsahujeScriptEnd = self.detekujZdaRadekObsahujeSubstr(radek, '</script>')
            radekObsahujeStyle = self.detekujZdaRadekObsahujeSubstr(radek, '<style>')
            radekObsahujeStyleEnd = self.detekujZdaRadekObsahujeSubstr(radek, '</style>')


            if(radekObsahujeDocType == True):
                rowType = 'html'

            if (radekObsahujeScript == True):
                rowType = 'js'

            if (radekObsahujeStyle == True):
                rowType = 'css'

            rowTypeArr.append(rowType)

            # pokud se jedna o endTag, zjistuje rowType do dalsiho cyklu
            if (radekObsahujeScriptEnd == True):
                rowType = 'html'

            if (radekObsahujeStyleEnd == True):
                rowType = 'html'

        return(rowTypeArr)



    def ziskejAdresuProVytvoreniSlozky(self, cestaKTisku):

        cestaKTiskuSpl = cestaKTisku.split('\\')
        cestaKTiskuNew = ''

        for i in range(0, len(cestaKTiskuSpl)-1):
            radek = cestaKTiskuSpl[i]
            cestaKTiskuNew = cestaKTiskuNew + radek + '/'
            try:
                os.mkdir(cestaKTiskuNew)
            except:
                a = 5
                #do nothing


        return(cestaKTiskuNew)


    def ziskejNazevSouboruProGenerovani(self, cestaKTisku):

        cestaSpl = cestaKTisku.split('\\')
        indSources = cestaSpl.index('generatedJson')
        nazevSouboruProGen = ''

        for i in range(indSources+1, len(cestaSpl)):
            adresar = cestaSpl[i]
            nazevSouboruProGen = nazevSouboruProGen + adresar

            if(i < len(cestaSpl)-1):
                nazevSouboruProGen = nazevSouboruProGen + '_'

        return(nazevSouboruProGen)



    def ziskejAdresuProGenerovani(self, cestaHtmlSrc):

        cestaSpl = cestaHtmlSrc.split('\\')
        indSources = cestaSpl.index('language')
        cestaSpl[indSources] = 'generatedJson'
        nazevSouboruOrig = cestaSpl[len(cestaSpl)-1]
        nazevSouboruSpl = nazevSouboruOrig.split('.')
        nazevSouboruJson = nazevSouboruSpl[0] + '.json'
        cestaProGenerovani = ''


        for i in range(0, len(cestaSpl)-1):
            adresar = cestaSpl[i]
            cestaProGenerovani = cestaProGenerovani + adresar + '\\'

        cestaProGenerovani = cestaProGenerovani + nazevSouboruJson

        return(cestaProGenerovani)


    def vytvorJson(self, obsahHtml, nazevSouboru, poleIndexuZanoreni, rowTypeArr):

        jsonArr = []
        jsonArr.append(nazevSouboru + ' = \'{"rows": [\'')

        for i in range(0, len(obsahHtml)):
            radekHtml = self.vytvorOdsazeniRadku(i, obsahHtml, poleIndexuZanoreni)
            radekHtml = radekHtml.replace('\n', '')
            keyValSpl = self.detekujRadekCombo(radekHtml)
            rowType = rowTypeArr[i]

            #pokusi se vlozit combo
            if(keyValSpl != False):
                klicExp = keyValSpl[0]
                comboBox = jsonCombo.generujSelectOption(self.kliceAHodnoty, klicExp)
                selectOptionJson = comboBox.getSelectOptionJson()
                print()

                # vlozi combo, pokud neni False (pokud nalezne klic)
                if(selectOptionJson != False):
                    selectOptionJson = self.vytvorRadkyCombo(selectOptionJson, i + 1, radekHtml, rowType)
                    jsonArr = jsonArr + selectOptionJson
                    print()

                else: # pokud klic nenalezne pokracuje jako by se o combo nejednalo
                    radekJson = self.vytvorRadekJson(i + 1, 'noCombo', radekHtml, len(obsahHtml), rowType)
                    jsonArr = jsonArr + radekJson
                    print()

            else: # o combo se nejedna
                radekJson = self.vytvorRadekJson(i+1, 'noCombo', radekHtml, len(obsahHtml), rowType)
                jsonArr = jsonArr + radekJson
                print()


        # odsadi mezery u comboboxu
        # je treba provest az na konci, jelikoz je potreba znat zanoreni comboboxu predchozich
        jsonArr = self.opravRadkyTextUComboboxu(jsonArr)
        jsonArr.append('\']}\'')

        # opravi json, jelikoz je potreba odmazat zavorky u "select"
        jsonArr = self.opravJsonArrSelect(jsonArr)

        return(jsonArr)


    # opravi jsonArr, odmaze zavorky u select
    def opravJsonArrSelect(self, jsonArr):

        for i in range(0, len(jsonArr)-2):
            radek0 = jsonArr[i]

            jednaSeORadek0 = self.detekujZdaRadekObsahujeSubstr(radek0, ']}\'')
            if( jednaSeORadek0 == True ):

                radek1 = jsonArr[i + 1]
                jednaSeORadek1 = self.detekujZdaRadekObsahujeSubstr(radek1, ']},\'')

                if (jednaSeORadek1 == True ):
                    radek2 = jsonArr[i + 2]

                    jednaSeORadek2 = self.detekujZdaRadekObsahujeSubstr(radek2, '{"select":')
                    if (jednaSeORadek2 == True):

                        jsonArr[i] = ''

        return(jsonArr)


    def vytvorOdsazeniRadku(self, index, obsahHtml, poleIndexuZanoreni):

        radekHtml = obsahHtml[index]
        radekHtml = radekHtml.strip()
        zanoreni = poleIndexuZanoreni[index]
        odsazeniPocetMezer = zanoreni
        odsazeni = ''

        if(radekHtml != ''):
            for i in range(0, odsazeniPocetMezer):
                odsazeni = odsazeni + '_'

        odsazeniRadekHtml = odsazeni + radekHtml

        return(odsazeniRadekHtml)


    def vytvorRadkyCombo(self, selectOptionJson, rowNum, radekHtml, rowType):

        selectOptionJson = self.pridejIdDoCelehoSelectOption(selectOptionJson, rowNum)

        data = '{"data": {'
        rowType = '"rowType": "' + rowType + '",'
        rowNum = '"rowNum": ' + str(rowNum) + ','
        type = '"type": "combo",'
        text1 = '"text": ['
        keyValSpl = self.detekujRadekCombo(radekHtml)
        key = keyValSpl[0]
        text2 = '{"text": \t"' + key + '"},'

        textArr = []
        textArr.append(data)
        textArr.append(rowType)
        textArr.append(rowNum)
        textArr.append(type)
        textArr.append(text1)
        textArr.append(text2)
        textArr = textArr + selectOptionJson

        textArrNew = self.posunRadkyOTabulatory(textArr)
        textArrNew = self.opravRadkySelect(textArrNew)

        return(textArrNew)



    # pred radek slect vlozi carku
    def opravRadkySelect(self, textArrNew):

        substrPredchArr = []
        substrPredchArr.append(']}')
        substrPredchArr.append('{"select": \t[')

        vsechnyIndexyRadku = self.vratIndexDlePredchozichRadku(textArrNew, substrPredchArr, 0)
        textArrNew = self.nahradIndexyRadku(textArrNew, vsechnyIndexyRadku, ']}', ']},')

        return(textArrNew)


    def opravRadkyTextUComboboxu(self, jsonArr):

        substrPredchArr = []
        substrPredchArr.append('{"data": {')
        substrPredchArr.append('"rowNum":')
        substrPredchArr.append('"type": "combo",')
        substrPredchArr.append('"text": [')
        substrPredchArr.append('{"text":')

        vsechnyIndexyRadku = self.vratIndexDlePredchozichRadku(jsonArr, substrPredchArr, 4)
        radkyPodtrzitka = self.vratRadkyPodtrzitka(jsonArr, vsechnyIndexyRadku)


        # prepise jsonArr s opravenymi radky
        for i in range(0, len(vsechnyIndexyRadku)):
            indexRadku = vsechnyIndexyRadku[i]
            radekNew = radkyPodtrzitka[i]

            jsonArr[indexRadku] = radekNew


        return(jsonArr)


    def vratRadkyPodtrzitka(self, jsonArr, vsechnyIndexyRadku):

        podtrzitkaNadrazenychUrovni = self.vratPodtrzitkaNadrazenychUrovni(jsonArr, vsechnyIndexyRadku)

        radkyPodtrzitka = []

        for i in range(0, len(vsechnyIndexyRadku)):
            indexRadku = vsechnyIndexyRadku[i]
            radek = jsonArr[indexRadku]
            podtrzitkoNadrazene = podtrzitkaNadrazenychUrovni[i]

            # jelikoz je treba zanorit o jednu uroven, je potreba pridat podtrzitko
            podtrzitkoZanorene = podtrzitkoNadrazene + '_'

            radekPodtrzitko = self.pridejPodtrzitkoKHodnote(radek, podtrzitkoZanorene)
            radkyPodtrzitka.append(radekPodtrzitko)

        return(radkyPodtrzitka)


    def pridejPodtrzitkoKHodnote(self, radek, podtrzitko):

        radekBezT = radek.replace('\t', '')
        klicHodnota = radekBezT.split(':')
        hodnota = klicHodnota[1]
        hodnota = hodnota.replace('"', '')
        hodnota = hodnota.replace('},\'', '')
        hodnota = hodnota.strip()
        hodnotaPodtrzitko = podtrzitko + hodnota

        radekNew = radek.replace(hodnota, hodnotaPodtrzitko)

        return(radekNew)


    def vratPodtrzitkaNadrazenychUrovni(self, jsonArr, vsechnyIndexyRadku):

        indexyAPodtrzitkaArr = self.vratVsechnyIndexyRadkuSPodrtzitky(jsonArr)

        # ziska seznam vsech nadrazenych podtrzitek
        podtrzitkaArr = []

        for i in range(0, len(vsechnyIndexyRadku)):
            indexRadku = vsechnyIndexyRadku[i]
            nadrazenePodtrzitko = self.ziskejNejblizeNadrazenouPolozku(indexyAPodtrzitkaArr, indexRadku)
            podtrzitkaArr.append(nadrazenePodtrzitko)

        return(podtrzitkaArr)


    def ziskejNejblizeNadrazenouPolozku(self, polozkyArr, polozkaExp):

        nadrazenyPodtrzitko = ''

        for i in range(0, len(polozkyArr)):
            polozka = polozkyArr[i][0]
            rozdilPolozek = polozkaExp - polozka
            if(rozdilPolozek < 0):
                nejblizsiPolozka = polozkyArr[i-1][0]
                nadrazenyPodtrzitko = polozkyArr[i-1][1]
                break

        return(nadrazenyPodtrzitko)


    # vrati pole o 2 sloupcich
    # 1. sloupec - indexy radku
    # 2. sloupec - podtrzitka
    def vratVsechnyIndexyRadkuSPodrtzitky(self, jsonArr):

        substrPredchArr = []
        substrPredchArr.append('{"data": {')
        substrPredchArr.append('"rowNum":')
        substrPredchArr.append('"type": "noCombo",')
        substrPredchArr.append('"text":')

        indexyRadkuSPodtrzitky = self.vratIndexDlePredchozichRadku(jsonArr, substrPredchArr, 3)
        indexyAPodtrzitkaArr = []

        for i in range(0, len(indexyRadkuSPodtrzitky)):
            indexRadku = indexyRadkuSPodtrzitky[i]
            radek = jsonArr[indexRadku]
            hodnota = radek.replace('"text":', '')
            hodnota = hodnota.replace('\'\t\t "', '')

            hodnotaBezPodtrzitka = hodnota.replace('_', '')
            podtrzitka = hodnota.replace(hodnotaBezPodtrzitka, '')

            if(podtrzitka != ''):
                indexAPodtrzika = []
                indexAPodtrzika.append(indexRadku)
                indexAPodtrzika.append(podtrzitka)

                indexyAPodtrzitkaArr.append(indexAPodtrzika)

        return(indexyAPodtrzitkaArr)



    def nahradIndexyRadku(self, pole, indexyRadku, substrOld, substrNew):

        for i in range(0, len(indexyRadku)):
            indexRadku = indexyRadku[i]
            radek = pole[indexRadku]
            radekNew = radek.replace(substrOld, substrNew)
            pole[indexRadku] = radekNew

        return(pole)


    # na zaklade substringu v poli 'substrPredchArr', vrati index posledniho radku (pole 'substrPredchArr')
    def vratIndexDlePredchozichRadku(self, pole, substrPredchArr, prictiIndex):

        substr0 = substrPredchArr[0]
        delkaSubstrPredch = len(substrPredchArr)
        vsechnyIndexyRadku = []

        for i in range(0, len(pole)):
            radek = pole[i]
            radekObsahujeSubstr = self.detekujZdaRadekObsahujeSubstr(radek, substr0)
            if(radekObsahujeSubstr == True):
                subPole = pole[i : i + delkaSubstrPredch : 1]

                subRadekObsahujeSubstring = self.zkontrolujZdaSubStrPredchJeSubStringy(subPole, substrPredchArr)
                if(subRadekObsahujeSubstring == True):
                    indexRadku = i + prictiIndex
                    vsechnyIndexyRadku.append(indexRadku)

        return(vsechnyIndexyRadku)


    # zkontroluje, zda vsechny radky "substrPredchArr" jsou substringy radku "subPole"
    def zkontrolujZdaSubStrPredchJeSubStringy(self, subPole, substrPredchArr):

        subRadekObsahujeSubstring = True

        for i in range(0, len(subPole)):
            subRadek = subPole[i]
            subRadekPredch = substrPredchArr[i]

            if(subRadekObsahujeSubstring == True):
                subRadekObsahujeSubstring = self.detekujZdaRadekObsahujeSubstr(subRadek, subRadekPredch)
            else:
                break

        return(subRadekObsahujeSubstring)


    def pridejSubstrProPredchoziRadek(self, pole, obsahExp, obsahExpPredch, nahradStr):

        poleNew = []

        for i in range(0, len(pole)):
            radek = pole[i]
            poleNew.append(radek)

            radekObsahujeObsahExp = self.detekujZdaRadekObsahujeSubstr(radek, obsahExp)
            if(radekObsahujeObsahExp == True):
                radekPredchozi = pole[i-1]
                radekObsahujeObsahExpPredch = self.detekujZdaRadekObsahujeSubstr(radekPredchozi, obsahExpPredch)

                if(radekObsahujeObsahExpPredch == True):
                    radekPredchoziNew = radekPredchozi.replace(obsahExpPredch, nahradStr)
                    poleNew[i-1] = radekPredchoziNew

        return(poleNew)


    # proleze vsechny radky select Option a prida "|id"
    def pridejIdDoCelehoSelectOption(self, selectOptionJson, id):

        selectOptionNew = []

        for i in range(0, len(selectOptionJson)):
            radek = selectOptionJson[i]
            radekObsahujeId = self.detekujZdaRadekZacinaStrExp(radek, '{"id":', 0)
            if(radekObsahujeId == True):
                radek = self.pridejRowNumjakoId(radek, id)

            selectOptionNew.append(radek)

        return(selectOptionNew)


    def pridejRowNumjakoId(self, radek, id):
        radekNew = radek.replace('"}', '|' + str(id) + '"}')

        return(radekNew)


    def posunRadkyOTabulatory(self, textArr):

        rowTypeNew = self.vyhledejSubPole(textArr, '"rowType":', '"rowType":', 2)
        rowNumNew = self.vyhledejSubPole(textArr, '"rowNum":', '"rowNum":', 2)
        typeNew = self.vyhledejSubPole(textArr, '"type":', '"type":', 2)
        textNew = self.vyhledejSubPole(textArr, '"text":', '"text":', 2)
        selecteOptionNew = self.vyhledejSubPole(textArr, '{"text":', '{"selectOption":', 5)
        selectNew = self.vyhledejSubPole(textArr, '{"select":', '{"select":', 11)
        idNew = self.vyhledejSubPole(textArr, '{"id":', ']},', 15)
        optionNew = self.vyhledejSubPole(textArr, '{"option":', '{"option":', 11)
        valueNew = self.vyhledejSubPole(textArr, '{"value":', ']}', 15)


        if(len(valueNew) > 1):
            valueNew[0] = self.opravPole(valueNew[0], '', 3)


        textArrNew = []
        textArrNew.append('{"data": {')
        textArrNew = textArrNew + rowTypeNew[0]
        textArrNew = textArrNew + rowNumNew[0]
        textArrNew = textArrNew + typeNew[0]
        textArrNew = textArrNew + textNew[0]
        textArrNew = textArrNew + selecteOptionNew[0]

        for i in range(0, len(selectNew)):
            textArrNew = textArrNew + selectNew[i]
            textArrNew = textArrNew + idNew[i]
            textArrNew = textArrNew + optionNew[i]
            textArrNew = textArrNew + valueNew[i]
            textArrNew.append('\t\t\t\t\t\t\t\t\t\t]}')      # jeste otestovat !!!


        textArrNew.append(']')
        textArrNew.append('}},')


        textArrNew = self.doplnUvozovkyDoPole(textArrNew)

        return(textArrNew)


    def opravPole(self, poleOrig, pridejStr, radekExp):

        poleNew = []
        for i in range(0, len(poleOrig)):
            radekNew = poleOrig[i]

            if(i == radekExp):
                if(pridejStr != ''):
                    radekNew = radekNew + pridejStr

                else:
                    radekNew = ''

            if(radekNew != ''):
                poleNew.append(radekNew)

        return(poleNew)




    # doplni uvozovky pro vsechny radky
    def doplnUvozovkyDoPole(self, textArr):

        textArrNew = []

        for i in range(0, len(textArr)):
            if(i == 15):
                print()

            radek = textArr[i]
            radekNew = '\'' + radek + '\''
            textArrNew.append(radekNew)

        return(textArrNew)



    # vyhleda cast pole - resp. radky obsahujici stejnou zavorku
    def vyhledejSubPole(self, jsonArr, klicZavorkyOt, klicZavorkyZav, odsazeni):

        subPoleNewAll = []

        # prvni radek hleda jen v pripade, ze index radku se nenachazi mezi prvnim a poslednim radkem predchoziho subpole
        hledejPrvniRadek = True
        prvniZapis = True
        indPoslRadku = -1

        for i in range(0, len(jsonArr)):

            if(i > indPoslRadku):
                radek = jsonArr[i]
                jeToPrvniRadek = self.detekujZdaRadekZacinaStrExp(radek, klicZavorkyOt, 0)
                if(jeToPrvniRadek == True):

                    prvniRadek = i
                    indPoslRadku = self.vyhledejPosledniRadek(jsonArr, prvniRadek, klicZavorkyZav)
                    subPole = jsonArr[prvniRadek:indPoslRadku:1]
                    subPoleNew = self.odsadRadekOPocetTabulatoru(subPole, odsazeni)
                    subPoleNewAll.append(subPoleNew)
                    prvniZapis = False

        return(subPoleNewAll)


    def vyhledejPosledniRadek(self, jsonArr, hledejOdRadku, klicZavorkyZav):

        for i in range(hledejOdRadku, len(jsonArr)):
            radek = jsonArr[i]
            jeToPosledniRadek = self.detekujZdaRadekZacinaStrExp(radek, klicZavorkyZav, 0)
            if(jeToPosledniRadek):
                indPoslRadku = i + 1
                break

        return(indPoslRadku)

    def detekujZdaRadekZacinaStrExp(self, radek, strExp, indExp):

        try:
            ind = radek.index(strExp)
            if (ind == indExp):
                radekObsahujeSubstr = True
            else:
                radekObsahujeSubstr = False

        except:
            radekObsahujeSubstr = False

        return(radekObsahujeSubstr)


    # jelikoz pole neni doposud odsazene, radky se odsazji zde
    def odsadRadekOPocetTabulatoru(self, pole, pocetTab):

        tab = ''
        for i in range(0, pocetTab):
            tab = tab + '\t'

        poleNew = []
        for i in range(0, len(pole)):
            radek = pole[i]
            radekNew = tab + radek
            poleNew.append(radekNew)

        return(poleNew)


    # aby vlozil combo, je treba nejdrive detekovat combobox
    def detekujRadekCombo(self, radekHtml):

        radekHtmlTrim = radekHtml.strip()
        radekHtmlBezPodtrzika = self.odeberPodtrzitkoZeStringu(radekHtmlTrim)
        radekHtmlBezPodtrzika = radekHtmlBezPodtrzika.replace('\t', '')
        try:
            indKeyVal = radekHtmlBezPodtrzika.index(':')
            keyValSpl = radekHtmlBezPodtrzika.split(':')
        except:
            keyValSpl = False


        return(keyValSpl)


    # podtrzitka symbolizuji mezery ve stringu
    # metoda je odebira, pokud jsou na zacatku
    def odeberPodtrzitkoZeStringu(self, radekHtml):

        radekReverse = radekHtml[::-1]
        try:
            indexPodtrzitkaReverse = radekReverse.index('_')
            indexPoslednihoPodtrzitka = len(radekHtml)-indexPodtrzitkaReverse
            radekHtmlBezPodtrzika = radekHtml[indexPoslednihoPodtrzitka:len(radekHtml):1]
        except:
            radekHtmlBezPodtrzika = radekHtml

        return(radekHtmlBezPodtrzika)



    def vytvorRadekJson(self, cisloRadku, noCombo, radekHtml, indexPosledni, rowType):

        radekJson = []

        #opravi radek html
        radekHtml = self.odmazUvozovkyZradekHtml(radekHtml, rowType)

        prvniRadek = '\'\t{"data": {\''
        posledniRadek = '\'\t}}'

        if(cisloRadku < indexPosledni):
            posledniRadek = posledniRadek + ',\''
        else:
            posledniRadek = posledniRadek + '\''

        rowType = '\'\t\t"rowType": "' + rowType + '",\''
        rowNum = '\'\t\t' + self.vratRadekKlicHodnota('rowNum', cisloRadku) + ',\''
        type = '\'\t\t' + self.vratRadekKlicHodnota('type', noCombo) + ',\''
        text = '\'\t\t' + self.vratRadekKlicHodnota('text', radekHtml) + '\''

        radekJson.append(prvniRadek)
        radekJson.append(rowType)
        radekJson.append(rowNum)
        radekJson.append(type)
        radekJson.append(text)
        radekJson.append(posledniRadek)

        return(radekJson)


    #pokud napr. obsahuje class="one", pak vraci class=one
    #JSON nema rad uvozovky a javascript si je znovu doplnuje

    def odmazUvozovkyZradekHtml(self, radekHtml, rowType):

        # pokud se jedna o rowType == 'js', pak nahrazuje uvozovky procentem
        if (rowType == 'js'):
            radekHtmlBezUvozovek = radekHtml.replace('"', '%')
        else:   # pro vsechny ostatni typy radku se uvozovky opdmazou, javascript pak si je prida sam
            radekHtmlBezUvozovek = radekHtml.replace('"', '')

        return(radekHtmlBezUvozovek)


    def vratRadekKlicHodnota(self, klic, hodnota):

        if type(hodnota) == str:

            # nahradi vsechny mezery s podtrzitky
            # jelikoz mezery '\t' nema JSON rad
            hodnota = hodnota.replace('\t', '_')

            klicHodnota = '"' + klic + '": "' + hodnota + '"'

        else:
            klicHodnota = '"' + klic + '": ' + str(hodnota)


        return(klicHodnota)


    def test(self):

        dataKTisku = []
        dataKTisku.append("1")
        dataKTisku.append("1")
        dataKTisku.append("1")
        dataKTisku.append("1")
        dataKTisku.append("1")
        dataKTisku.append("1")
        dataKTisku.append("1")

        #cetaKTisku = 'C:\\Users\\jonas\\OneDrive\\Dokumenty\\HTML\\2022\\Python cssJson\\html_src\\general.json'

        self.tiskniJSON(dataKTisku, self.cetaKTisku)


    def detekujZdaRadekObsahujeSubstr(self, radek, substr):

        radek = radek.lower()

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

            if(radek != ''):
                if(i < len(dataKTisku) - 1):
                    radek = radek + ' +'
                else:
                    radek = radek + ';'

                dataWrite = dataWrite + radek + '\n'

        f.write(dataWrite)
        f.close()

    print("")


    def nactiHtml(self, adresaHtml):

        pole = []

        r = -1
        with open(adresaHtml, 'r') as f:
            for line in f:
                r = r + 1

                pole.append(line)

        return (pole)
