 # generuje htmlFile  getPoleMeziNew

from pathlib import Path
import proverExistenciDatCsv

class generujHtmlFile:

    def __init__(self, pathJson):

        self.pathJson = pathJson
        self.adresaHtmlFile = self.ziskejCestu()
        poleHtml =self.nactiHtml(self.adresaHtmlFile)

        # vytvori hlavni html
        poleHtmlHlavni = self.vytvorHlavnniHtml(poleHtml, pathJson, '<div class="json">')

        # prida obsah <div class="genJs">
        poleHtmlGenJs = self.vytvorHlavnniHtml(poleHtmlHlavni, pathJson, '<div class="genJs">')

        # prida obsah <div class="jsonDebug">
        poleHtmlDebug = self.vytvorHlavnniHtml(poleHtmlGenJs, pathJson, '<div class="jsonDebug">')

        # prida k hlavnimu html "<div class="genJs">"


        # getPoleHodnotGenJs
        # vytiskne html
        # vypada to, ze se tiskne html vicekrat.
        self.tiskniHtml(poleHtmlDebug, self.adresaHtmlFile)


    def vytvorHlavnniHtml(self, poleHtml, pathJson, jsonJs):

        prvniAPosledniRadekJson = self.vratIndexRadkuObsahujiciSubString(poleHtml, jsonJs)
        cestaPathJson = '<script type="text/javascript" src="../../' + pathJson + '"></script>'
        poleHtmlNew = self.vytvorHtmlNew(poleHtml, prvniAPosledniRadekJson, cestaPathJson, jsonJs)

        return(poleHtmlNew)


    #def pridejGenJs(self):


    def ziskejCestu(self):

        cesta = Path.cwd()
        cestaSpl = cesta.parts

        cestaNew = "C:\\"

        for i in range(1, len(cestaSpl)):
            polozka = cestaSpl[i]
            if(polozka == 'prepareData'):
                break
            else:
                cestaNew = cestaNew + polozka + '\\'

        cestaNew = cestaNew + 'Interface\\jQueryScript\\index.html'

        return(cestaNew)


    def vytvorHtmlNew(self, poleHtml, prvniAPosledniRadek, cestaPathJson, jsonJs):

        prvniIndex = prvniAPosledniRadek[0]+1
        posledniIndex = prvniAPosledniRadek[1]

        polePred = poleHtml[0:prvniIndex:1]
        poleMezi = poleHtml[prvniIndex:posledniIndex:1]
        poleZa = poleHtml[posledniIndex:len(poleHtml):1]

        if(jsonJs == '<div class="json">'):
            poleMezi = self.vratPoleMeziProDivClassJson(poleMezi, cestaPathJson)

        if(jsonJs == '<div class="genJs">'):
            prover = proverExistenciDatCsv.checkDataInCsv(poleMezi, 'attachedJs', True, True)
            poleMezi = prover.getPoleHodnotGenJs()

        if(jsonJs == '<div class="jsonDebug">'):
            prover = proverExistenciDatCsv.checkDataInCsv(poleMezi, 'pathDebug', True, True)
            poleMezi = prover.getPoleHodnotGenJs()
            print()

            # Zkontroluj zda poleMezi je spravne, rekl bych ze spravne neni.


        poleHtmlNew = []
        poleHtmlNew = poleHtmlNew + polePred
        poleHtmlNew = poleHtmlNew + poleMezi

        # je potreba modifikovat poleZa, data jsou zde:
        # nacitejDataJsonFilesCsv -> poleHodnotGenJs
        poleHtmlNew = poleHtmlNew + poleZa


        return(poleHtmlNew)


    def vratPoleMeziProDivClassJson(self, poleMezi, cestaPathJson):

        poleMeziJizObsahujeCestaPathJson = self.detekujZdaPoleObsahujeSubString(poleMezi, cestaPathJson)
        if (poleMeziJizObsahujeCestaPathJson == False):
            poleMezi.append('\t\t' + cestaPathJson + '\n')

        # proveruje, zda skutecne vsechny radky poleMezi, skutecne existuji
        # to zjistuje v dataJsonFiles.csv
        prover = proverExistenciDatCsv.checkDataInCsv(poleMezi, 'pathJson', True, True)
        poleMezi = prover.getPoleMeziNew()

        return(poleMezi)


    def detekujZdaPoleObsahujeSubString(self, pole, subString):

        poleObsahujeSubString = False

        for i in range(0, len(pole)):
            radek = pole[i]
            poleObsahujeSubString = self.detekujZdaSeJednaOPotrebnyRadek(radek, subString)
            if(poleObsahujeSubString == True):
                break

        return(poleObsahujeSubString)


    def vratIndexRadkuObsahujiciSubString(self, poleHtml, divString):

        prvniAPosledniRadek = []
        prvniRadek = -1
        posledniRadek = -1

        for i in range(0, len(poleHtml)):
            radek = poleHtml[i]
            radekObsahujeExp = self.detekujRadekExp(radek, divString)
            if(radekObsahujeExp == True):
                prvniRadek = i
                posledniRadek = self.vratNejblizsiRadekKonecDivu(poleHtml, prvniRadek)
                break

        prvniAPosledniRadek.append(prvniRadek)
        prvniAPosledniRadek.append(posledniRadek)

        return(prvniAPosledniRadek)


    def vratNejblizsiRadekKonecDivu(self, poleHtml, hledejOdRadku):

        indexRadku = -1

        for i in range(hledejOdRadku, len(poleHtml)):
            radek = poleHtml[i]
            radekObsahujeEndDiv = self.detekujRadekExp(radek, '</div>')

            if(radekObsahujeEndDiv == True):
                indexRadku = i
                break

        return(indexRadku)


    def detekujRadekExp(self, radek, radekExp):

        radekObsahujeExp = False

        radekTrim = radek.strip()
        radekTrim = radekTrim.replace('\n', '')
        if(radekTrim == radekExp):
            radekObsahujeExp = True

        return(radekObsahujeExp)


    def nactiHtml(self, adresaHtml):
        pole = []

        r = -1
        with open(adresaHtml, 'r') as f:
            for line in f:
                r = r + 1

                pole.append(line)

        return (pole)


    def tiskniHtml(self, dataKTisku, nazevSouboru):

        dataWrite = ""
        f = open(nazevSouboru, 'w')

        for i in range(0, len(dataKTisku)):
            radek = str(dataKTisku[i])
            dataWrite = dataWrite + radek

        f.write(dataWrite)
        f.close()

    print("")


    # vrati true, pokud se jedna o potrebny radek
    def detekujZdaSeJednaOPotrebnyRadek(self, radek, polozka):

        try:
            radek.index(polozka)
        except ValueError:
            jednaSeOPotrebnyRadek = False
        else:
            jednaSeOPotrebnyRadek = True

        return (jednaSeOPotrebnyRadek)
