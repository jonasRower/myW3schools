# nacte key-values z csv, tak aby mohl vytvaret jednotlive komboboxy

class nactiKeyValue:

    def __init__(self):

        self.cestaCsv = 'C:\\Users\\jonas\\OneDrive\\Dokumenty\\HTML\\2022\\CSS Html\\sources\\csv\\keyValue.csv'
        obsahCsv = self.nactiHtml(self.cestaCsv)

        rozmeziKeyValueArr = self.ziskejRozmeziKeyValue(obsahCsv)
        self.kliceAHodnoty = self.nactiKeyValueRadky(obsahCsv, rozmeziKeyValueArr)

    
    def getKliceAHodnoty(self):
        return(self.kliceAHodnoty)


    def nactiKeyValueRadky(self, obsahCsv, rozmeziKeyValueArr):

        prvniRadek = rozmeziKeyValueArr[0] + 1
        kliceAHodnotyAll = []

        for i in range(1, len(rozmeziKeyValueArr)):
            posledniRadek = rozmeziKeyValueArr[i]

            keyValueRadky = obsahCsv[prvniRadek:posledniRadek:1]
            kliceAHodnoty = self.vratKliceAHodnoty(keyValueRadky)
            kliceAHodnotyAll.append(kliceAHodnoty)

            prvniRadek = posledniRadek + 1

        return(kliceAHodnotyAll)


    def vratKliceAHodnoty(self, keyValueRadky):

        pocetKlicu = self.vratPocetKlicu(keyValueRadky)
        keyRadek = keyValueRadky[0].replace('\n', '')
        keyOrig = self.vratValueProDanyKlic(keyRadek, 0)
        valuesRadkyAll = []

        for iKey in range(0, pocetKlicu):
            valuesRadky = []

            if(pocetKlicu > 1):
                keyInd = iKey + 1
                key = keyOrig + '_' + str(keyInd)
            else:
                key = keyOrig

            valuesRadky.append(key)

            for i in range(2, len(keyValueRadky)):
                radek = keyValueRadky[i]
                radek = radek.replace('\n', '')
                value = self.vratValueProDanyKlic(radek, iKey)

                valuesRadky.append(value)

            valuesRadkyAll.append(valuesRadky)


        return(valuesRadkyAll)


    # vraci value pro klic, jelikoz klicu muze byt vice
    def vratValueProDanyKlic(self, radekValue, index):

        radekSplit = radekValue.split(',')
        value = radekSplit[index]

        return(value)


    def vratPocetKlicu(self, keyValueRadky):

        pocetKlicu = 0

        prvniValue = keyValueRadky[2].replace('\n', '')
        prvniValueSplit = prvniValue.split(',')

        for i in range(0, len(prvniValueSplit)):
            val = prvniValueSplit[i]
            if(val != ''):
                pocetKlicu = pocetKlicu + 1

        return(pocetKlicu)


    def ziskejRozmeziKeyValue(self, obsahCsv):

        rozmeziKeyValueArr = []

        for i in range(0, len(obsahCsv)):
            radekCsv = obsahCsv[i]
            rozmeziKeyValue = self.detekujZdaRadekObsahujeSubstr(radekCsv, '%%%%%%%%')

            if(rozmeziKeyValue == True):
                rozmeziKeyValueArr.append(i)

        return(rozmeziKeyValueArr)


    def detekujZdaRadekObsahujeSubstr(self, radek, substr):

        try:
            ind = radek.index(substr)
            if(ind > -1):
                radekObsahujeSubstr = True
            else:
                radekObsahujeSubstr = False

        except:
            radekObsahujeSubstr = False

        return(radekObsahujeSubstr)



    def nactiHtml(self, adresaHtml):

        pole = []

        r = -1
        with open(adresaHtml, 'r') as f:
            for line in f:
                r = r + 1

                pole.append(line)

        return (pole)