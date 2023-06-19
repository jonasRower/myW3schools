# prigenerovava combo (selectOption) do hlavniho Jsonu


class generujSelectOption:

    def __init__(self, kliceAHodnoty, klicExp):

        self.selectKey = self.nastavSelectKey()
        self.selectValue = self.nastavSelectValue()
        self.optionValue = self.nastavOptionValue()

        kliceAHodnotySel = self.vratKliceAHodnotyDleKlice(kliceAHodnoty, klicExp)

        # pokud nenalezne zadny klic
        if(kliceAHodnotySel == False):
            self.selectOptionJson = False
        else:
            self.selectOptionJson = self.vytvorSelectOptionJson(kliceAHodnotySel)


    def getSelectOptionJson(self):
        return(self.selectOptionJson)


    def vytvorSelectOptionJson(self, kliceAHodnotyAll):

        selectOptionJson = []

        for i in range(0, len(kliceAHodnotyAll)):
            kliceAHodnoty = kliceAHodnotyAll[i]

            klic = kliceAHodnoty[0]
            selectKey = []
            selectValue = []
            optionValue = []

            selectKey.append('id')
            selectValue.append(klic)

            for iKey in range(1, len(kliceAHodnoty)):
                hodnota = kliceAHodnoty[iKey]
                optionValue.append(hodnota)

            selectOptionHeader = self.vratSelectOptionJson(selectKey, selectValue, optionValue)
            selectOptionJson = selectOptionJson + selectOptionHeader

        return(selectOptionJson)



    def vratKliceAHodnotyDleKlice(self, kliceAHodnotyAll, klicExp):

        vratKliceAHodnoty = False

        for i in range(0, len(kliceAHodnotyAll)):
            kliceAHodnoty = kliceAHodnotyAll[i]
            klic = kliceAHodnoty[0][0]
            klic = klic.replace('_1', '')

            if(klic == klicExp):
                vratKliceAHodnoty = kliceAHodnoty
                break


        return(vratKliceAHodnoty)



    def vratSelectOptionJson(self, selectKey, selectValue, optionValue):

        selectArr = self.vratDilciJson(selectKey, selectValue)
        optionArr = self.vratDilciJson(False, optionValue)

        #selectArr = self.odsadRadekOPocetTabulatoru(selectArr, 17)
        #optionArr = self.odsadRadekOPocetTabulatoru(selectArr, 17)

        selectArrHeader = self.pridejHeader(selectArr, 'select', True)
        optionArrHeader = self.pridejHeader(optionArr, 'option', False)

        selectOption = selectArrHeader
        selectOption = selectOption + optionArrHeader

        selectOptionHeader = self.pridejHeader(selectOption, 'selectOption', True)

        return(selectOptionHeader)





    def pridejHeader(self, arr, header, carkaBool):

        posledniRadek = ']}'
        if(carkaBool == True):
            posledniRadek = posledniRadek + ','

        arrHeader = []
        arrHeader.append('{"' + header + '": 	[')
        arrHeader = arrHeader + arr
        arrHeader.append(posledniRadek)

        return(arrHeader)


    def vratDilciJson(self, keys, values):

        keyValueArr = []

        for i in range(0, len(values)):
            if(keys == False):
                key = 'value'
            else:
                key = keys[i]

            value = values[i]
            keyValueRadek = '{"' + key + '": "' + value + '"}'

            if(i < len(values)-1):
                keyValueRadek = keyValueRadek + ','

            keyValueArr.append(keyValueRadek)

        return(keyValueArr)


    #######################################################
    #   ZDE NASTAV DATA
    #######################################################

    def nastavSelectKey(self):

        selectKey = []
        selectKey.append('name')
        selectKey.append('id')

        return(selectKey)


    # data se nastavuji rucne
    def nastavSelectValue(self):
        selectValue = []
        selectValue.append('car')
        selectValue.append('cars')

        return (selectValue)


    # data se nastavuji rucne
    def nastavOptionValue(self):
        optionValue = []
        optionValue.append('volvo')
        optionValue.append('saab')
        optionValue.append('mercedes')
        optionValue.append('audi')

        return (optionValue)




