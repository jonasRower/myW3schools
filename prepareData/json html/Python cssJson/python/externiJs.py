import htmlFile

class generujExterniJs:

    # nacte html soubor obsahujici script a vygeneruje externi js-soubor zvlast
    def __init__(self, obsahHtml, rowTypeArr, cestaHtmlSrc, cestaJson):

        cestaJsSrc = self.ziskejCestuProGenerovaniJs(cestaHtmlSrc)
        inputRunJs = self.ziskejInputRunJs(cestaJsSrc)
        radkyOrigSrcAll = self.ziskejRadkyOrigSrcAll(obsahHtml, rowTypeArr, inputRunJs)
        cestaJs = self.ziskejCestuGenJs(cestaJson)
        jsPath = self.ziskejPath(cestaJs)

        self.tiskniJs(radkyOrigSrcAll, cestaJs)

        # tiskne do html do class="genJs"
        htmlFile.generujHtmlFile(jsPath, '<div class="genJs">')

        # tiskne do html do class="jsonDebug"
        debugPath = jsPath.replace('generatedJs', 'treeDebug')
        debugPath = debugPath.replace('.js', 'Debug.json')
        htmlFile.generujHtmlFile(debugPath, '<div class="jsonDebug">')

        print()


    def ziskejCestuGenJs(self, cestaJson):
        cestaJs = cestaJson.replace('generatedJson\\js', 'generatedJs')
        cestaJs = cestaJs.replace('.json', '.js')

        return(cestaJs)


    def ziskejInputRunJs(self, cestaJsSrc):

        cestaJsSpl = cestaJsSrc.split('\\')
        inputRunJs = cestaJsSpl[len(cestaJsSpl)-2] + '_' + cestaJsSpl[len(cestaJsSpl)-1]

        return(inputRunJs)


    def ziskejCestuProGenerovaniJs(self, cestaHtmlSrc):

        cestaHtmlSpl = cestaHtmlSrc.split('\\')
        cestaBezSouboru = ''

        for i in range(0, len(cestaHtmlSpl)-1):
            slozka = cestaHtmlSpl[i]
            cestaBezSouboru = cestaBezSouboru + slozka + '\\'

        cestaJsBezSouboru = cestaBezSouboru.replace('language\\js', 'generatedJs')
        nazevSouboru = cestaHtmlSpl[len(cestaHtmlSpl)-1]
        nazevSouboruJs = nazevSouboru.replace('.html', '.js')

        cestaJsSrc = cestaJsBezSouboru + nazevSouboruJs

        return(cestaJsSrc)


    def ziskejRadkyOrigSrcAll(self, obsahHtml, rowTypeArr, inputRunJs):

        srcNazev = self.ziskejNazevTridyOriginalSrcipt(inputRunJs)

        radkyOrigSrc = self.ziskejRadkyOrigSrc(obsahHtml, rowTypeArr)
        radkyOrigSrcPred = self.ziskejRadkyPredOrigScript(srcNazev)
        radkyOrigSrcZa = self.ziskejRadkyZaOrigScript(inputRunJs, srcNazev)

        radkyOrigSrcAll = []
        radkyOrigSrcAll = radkyOrigSrcAll + radkyOrigSrcPred
        radkyOrigSrcAll = radkyOrigSrcAll + radkyOrigSrc
        radkyOrigSrcAll = radkyOrigSrcAll + radkyOrigSrcZa

        return(radkyOrigSrcAll)


    # puvodni nazev tridy prepisuje novym nazvem
    def ziskejNazevTridyOriginalSrcipt(self, inputRunJs):

        inputRunJsSpl = inputRunJs.split('_')
        srcNazev = 'src' + inputRunJsSpl[len(inputRunJsSpl)-1]
        srcNazev = srcNazev.replace('.js', '')

        return(srcNazev)


    # ziska radky uvnitr telaScript
    def ziskejRadkyOrigSrc(self, obsahHtml, rowTypeArr):

        radkyOrigSrc = []

        for i in range(0, len(obsahHtml)):
            rowType = rowTypeArr[i]
            if(rowType == 'js'):
                radek = obsahHtml[i]
                radek = radek.replace('\n', '')
                radek = radek.replace('<script>', '')
                radek = radek.replace('</script>', '')

                # doplni .nahledHtml ke kazdemu parametru
                radek = self.doplnKParametruNahledHtml(radek)
                radek = '        ' + radek + '\n'

                self.doplnKParametruNahledHtml(radek)
                radkyOrigSrc.append(radek)

        radkyOrigSrc = self.nahradRadekSJQuery(radkyOrigSrc)

        return(radkyOrigSrc)


    def doplnKParametruNahledHtml(self, radek):

        radekNew = radek
        radekJeJquery = self.detekujZdaRadekObsahujeSubstr(radek, '$(')

        if(radekJeJquery == True):
            radekSpl = radek.split(').')
            radekJQuery = radekSpl[0]
            radekJQuery = radekJQuery.replace('$(', '')
            radekJQuery = radekJQuery.strip()

            radekJQueryObsahujeUvozovky = self.detekujZdaRadekObsahujeSubstr(radekJQuery, '"')

            if(radekJQueryObsahujeUvozovky == True):
                parametr = radekJQuery.replace('"', '')
                parametrNew = '.nahledHtml ' + parametr
                parametrUvozovky = '"' + parametrNew + '"'
                radekNew = radekNew.replace(radekJQuery, parametrUvozovky)

        return(radekNew)

    def nahradRadekSJQuery(self, radkyOrigSrc):

        for i in range(0, len(radkyOrigSrc)):
            radek = radkyOrigSrc[i]
            radekJQuery = self.vratRadekSJQuery(radek)
            if (radekJQuery != ''):
                radkyOrigSrc[i] = radekJQuery

        return (radkyOrigSrc)


    def vratRadekSJQuery(self, radek):

        idNew = ''

        radekObsahujeTiskJavascript = self.detekujZdaRadekObsahujeSubstr(radek, 'document.getElementById("')
        if (radekObsahujeTiskJavascript == True):
            radekSpl = radek.split('=')
            id = radekSpl[0].strip()
            id = id.replace('document.getElementById("', '')
            id = id.replace('").innerHTML', '')
            jQuery = radekSpl[1].replace('\n', '')
            jQuery = jQuery.replace(';', '')

            mezery = radek.split('document.getElementById("')
            idNew = mezery[0] + '$(\'.nahledHtml #' + id + '\').append(' + jQuery + ');'

        return (idNew)


    # ziska radky pred originalnim scriptem
    def ziskejRadkyPredOrigScript(self, srcNazev):

        poleRadku = []
        poleRadku.append('\n')
        poleRadku.append('// jelikoz nejde pouzit syntaxi <script>...</script>\n')
        poleRadku.append('// ve vykreslovani view, pak se spousti js soubor externě, s tim ze je generovan pythonem dopredu\n')
        poleRadku.append('// aby se spustil vzdy ten spravny soubor a ne zadny jiny,\n')
        poleRadku.append('// to je zajisteno indikaci v inputu (#runJs) s nazvem tohoto souboru\n')
        poleRadku.append('\n')
        poleRadku.append('\n')
        poleRadku.append('class ' + srcNazev + '{\n')
        poleRadku.append('\n')
        poleRadku.append('    constructor(){\n')
        poleRadku.append('\n')
        poleRadku.append('        //tohle je originalni script, ktery byl puvodne v html\n')


        return(poleRadku)


    # ziska radky za originalnim scriptem
    def ziskejRadkyZaOrigScript(self, inputRunJs, srcNazev):

        poleRadku = []
        poleRadku.append('    }\n')
        poleRadku.append('\n')
        poleRadku.append('}\n')
        poleRadku.append('\n')
        poleRadku.append('\n')
        poleRadku.append('//tohle se generuje pythonem\n')
        poleRadku.append('$(document).on(\'DOMNodeInserted\', \'#runJs\', function () {\n')
        poleRadku.append('\n')
        poleRadku.append('    //spusti jen pripade, ze se jedna o ten spravny script\n')
        poleRadku.append('    var inputRunJs = $(\'#runJs\').val();\n')
        poleRadku.append('\n')
        poleRadku.append('    if(inputRunJs == \'' + inputRunJs + '\'){\n')
        poleRadku.append('        setTimeout(function(){\n')
        poleRadku.append('            var runOriginalSrc = new ' + srcNazev + '();\n')
        poleRadku.append('        });\n')
        poleRadku.append('    }\n')
        poleRadku.append('\n')
        poleRadku.append('	$(\'#runJs\').remove();')
        poleRadku.append('\n')
        poleRadku.append('});\n')


        return (poleRadku)


    def ziskejPath(self, cestaKTisku):

        cestaSpl = cestaKTisku.split('\\')
        indGenJson = cestaSpl.index('sources')
        jsName = ''

        for i in range(indGenJson, len(cestaSpl)):
            polozka = cestaSpl[i]
            jsName = jsName + polozka

            if(i < len(cestaSpl)-1):
                jsName = jsName + '/'

        return(jsName)



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


    def tiskniJs(self, dataKTisku, nazevSouboru):

        dataWrite = ""
        f = open(nazevSouboru, 'w', encoding="utf-8")

        for i in range(0, len(dataKTisku)):
            radek = str(dataKTisku[i])
            dataWrite = dataWrite + radek

        f.write(dataWrite)
        f.close()

    print("")