# proveruje dataJsonFiles

class checkDataInCsv:

    def __init__(self, poleMezi, nazevKlice, vratPoleMeziNew, reqv):

        adresaCsv = 'C:\\Users\\jonas\\OneDrive\\Dokumenty\\2023\\myW3Schools\\myW3schools-main\\sources\\csv\\dataJsonFiles.csv'
        poleCsv = self.nactiHtml(adresaCsv)
        poleCsvArr = self.prevedPoleCsvNaPole(poleCsv)
        poleHodnot = self.ziskejDataDleKlice(poleCsvArr, nazevKlice)

        if(nazevKlice == 'attachedJs' or nazevKlice == 'pathDebug' ):
            poleHodnotPathJson = self.ziskejDataDleKlice(poleCsvArr, 'pathJson')
            poleHodnotActual = self.proverHodnotyPodleAttachedJs(poleHodnotPathJson, poleHodnot)

            poleHodnotGenJs = self.odfiltrujDataProGenJs(poleHodnotActual, nazevKlice)
            self.poleHodnotGenJs = self.pridejScriptType(poleHodnotGenJs)


        if(vratPoleMeziNew == True):
            if(reqv == True):
                poleMeziReqv = self.vratPouzeAdekvatniPoleMezi(poleMezi)
                poleMeziSources = self.vratPouzeDataZeSlozkySources(poleMeziReqv)
            else:
                poleMeziSources = poleMezi

            boolArr = self.vratBoolArrDel(poleMeziSources, poleHodnot)
            self.poleMeziNew = self.vytvorPoleMeziNew(poleMezi, boolArr)
            self.boolArr = boolArr

        else:
            self.poleHodnot = poleHodnot


    def getPoleMeziNew(self):
        return(self.poleMeziNew)

    def getPoleHodnot(self):
        return(self.poleHodnot)

    def getBoolArr(self):
        return(self.boolArr)

    def getPoleHodnotGenJs(self):
        return(self.poleHodnotGenJs)



    def pridejScriptType(self, poleHodnotGenJs):

        poleHodnotGenJsNew = []

        for i in range(0, len(poleHodnotGenJs)):
            radek = poleHodnotGenJs[i]
            radekNew = '\t\t<script type="text/javascript" src="../../' + radek + '"></script>\n'
            poleHodnotGenJsNew.append(radekNew)

        return(poleHodnotGenJsNew)


    def proverHodnotyPodleAttachedJs(self, poleHodnotPathJson, poleHodnotAttachedJs):

        poleHodnotNew = []

        for i in range(0, len(poleHodnotPathJson)):
            attachedJs = poleHodnotAttachedJs[i]
            if(attachedJs != ""):
                hodnotaPathJson = poleHodnotPathJson[i]
                poleHodnotNew.append(hodnotaPathJson)


        return(poleHodnotNew)


    def odfiltrujDataProGenJs(self, poleHodnot, nazevKlice):

        vyfiltrovanePolozky = []

        for i in range(0, len(poleHodnot)):
            adresa = poleHodnot[i]
            adresaSpl = adresa.split('/')
            nazevPosledniSlozky = adresaSpl[len(adresaSpl)-2]

            if(nazevPosledniSlozky == 'js'):
                if(nazevKlice == 'attachedJs'):
                    adresaNew = self.sestavAdresuSJs(adresaSpl)
                    adresaNew = adresaNew.replace('generatedJson/js', 'generatedJs')
                else:
                    adresaNew = adresa.replace('generatedJson/js', 'treeDebug')
                    adresaNew = adresaNew.replace('.json', 'Debug.json')

                vyfiltrovanePolozky.append(adresaNew)


        return(vyfiltrovanePolozky)


    def sestavAdresuSJs(self, adresaSpl):

        nazevSouboru = adresaSpl[len(adresaSpl)-1]
        nazevSouboruNew = nazevSouboru.replace('json', 'js')
        adresaNew = ""

        for i in range(0, len(adresaSpl)-1):
            slozka = adresaSpl[i]
            adresaNew = adresaNew + slozka + '/'

        adresaNew = adresaNew + nazevSouboruNew

        return(adresaNew)


    def vytvorPoleMeziNew(self, poleMezi, boolArr):

        poleMeziNew = []

        for i in range(0, len(poleMezi)):
            radek = poleMezi[i]
            bool = boolArr[i]

            if(bool == False):
                poleMeziNew.append(radek)

        return(poleMeziNew)


    # vrati pole boolean k odstraneni
    #kdyz je true, pak dany radek se bude odstranovat
    def vratBoolArrDel(self, poleMeziSources, poleHodnot):

        boolArr = []

        for i in range(0, len(poleMeziSources)):
            radekHtml = poleMeziSources[i]
            radekHtml = radekHtml.replace('"', '')

            bool = False
            if(radekHtml != ''):
                ind = self.ziskejIndexPole(poleHodnot, radekHtml)
                if(ind == -1):
                    bool = True

            boolArr.append(bool)

        return(boolArr)


    def vratPouzeDataZeSlozkySources(self, poleMeziReqv):

        poleMeziSources = []
        #poleMeziSources.append('')

        for i in range(0, len(poleMeziReqv)):
            radek = poleMeziReqv[i]
            radekNew = radek.replace('../../', '')

            if(len(radekNew) < len(radek)):
                poleMeziSources.append(radekNew)
            else:
                poleMeziSources.append('')

        return(poleMeziSources)


    def vratPouzeAdekvatniPoleMezi(self, poleMezi):

        poleMeziReqv = []
        #poleMeziReqv.append('')

        for i in range(0, len(poleMezi)):
            radek = poleMezi[i]
            radekSpl = radek.split(' src=')

            if(len(radekSpl) == 2):
                radekNew = radekSpl[1]
            else:
                radekNew = ""

            radekNew = radekNew.replace('></script>', '')
            radekNew = radekNew.replace('\n', '')

            poleMeziReqv.append(radekNew)

        return(poleMeziReqv)




    def ziskejDataDleKlice(self, poleCsvArr, nazevKlice):

        poleCsvArr0 = poleCsvArr[0]
        indexKlice = self.ziskejIndexPole(poleCsvArr0, nazevKlice)
        poleHodnot = []

        for i in range(0, len(poleCsvArr)):
            hodnota = poleCsvArr[i][indexKlice]
            hodnota = hodnota.strip()
            poleHodnot.append(hodnota)

        return(poleHodnot)


    def prevedPoleCsvNaPole(self, poleCsv):

        poleCsvArr = []

        for i in range(0, len(poleCsv)):
            radek = poleCsv[i]
            radekSpl = radek.split(',')
            poleCsvArr.append(radekSpl)

        return(poleCsvArr)


    def nactiHtml(self, adresaCsv):
        pole = []

        r = -1
        with open(adresaCsv, 'r') as f:
            for line in f:
                r = r + 1

                pole.append(line)

        return (pole)


    def ziskejIndexPole(self, pole, substr):

        try:
            ind = pole.index(substr)

        except:
            ind = -1

        return (ind)