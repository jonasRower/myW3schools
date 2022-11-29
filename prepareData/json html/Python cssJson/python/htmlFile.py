 # generuje htmlFile

class generujHtmlFile:

    def __init__(self, pathJson, jsonJs):

        self.pathJson = pathJson
        self.adresaHtmlFile = 'C:\\Users\\jonas\\OneDrive\\Dokumenty\\HTML\\2022\\CSS Html\\Interface\\jQueryScript\\index.html'
        self.poleHtml =self.nactiHtml(self.adresaHtmlFile)
        prvniAPosledniRadekJson = self.vratIndexRadkuObsahujiciSubString(self.poleHtml, jsonJs)
        #prvniAPosledniRadekGenJs = self.vratIndexRadkuObsahujiciSubString(self.poleHtml, '<div class="genJs">')

        cestaPathJson = '<script type="text/javascript" src="../../' + pathJson + '"></script>'
        poleHtmlNew = self.vytvorHtmlNew(self.poleHtml, prvniAPosledniRadekJson, cestaPathJson)


        # vytiskne html
        self.tiskniHtml(poleHtmlNew, self.adresaHtmlFile)


    def vytvorHtmlNew(self, poleHtml, prvniAPosledniRadek, cestaPathJson):

        prvniIndex = prvniAPosledniRadek[0]
        posledniIndex = prvniAPosledniRadek[1]

        polePred = poleHtml[0:prvniIndex:1]
        poleMezi = poleHtml[prvniIndex:posledniIndex:1]
        poleZa = poleHtml[posledniIndex:len(poleHtml):1]

        poleMeziJizObsahujeCestaPathJson = self.detekujZdaPoleObsahujeSubString(poleMezi, cestaPathJson)
        if(poleMeziJizObsahujeCestaPathJson == False):
            poleMezi.append('\t\t' + cestaPathJson + '\n')

        poleHtmlNew = []
        poleHtmlNew = poleHtmlNew + polePred
        poleHtmlNew = poleHtmlNew + poleMezi
        poleHtmlNew = poleHtmlNew + poleZa

        return(poleHtmlNew)


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
