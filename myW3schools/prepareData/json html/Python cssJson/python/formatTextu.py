
# zatim se nepouziva
# bude predelano pres highlight.js


# generuje format individualni
class generujFormat:

    # trida je volana s kazdym zapisem radku 'text' do Jsonu
    # jelikoz zde se pripadne doplnuje format
    # pokud format textu neni definovan globalne, pak se vraci pole radku 'format'
    # ktery se pak prida do jsonu daneho souboru


    # zatím jen detekuje html soubory

    def __init__(self):

        #text = "___<p class=mix el=papa>A mixed border.</p>"
        text = '<p>'

        souborFormatJsonAdresa = 'C:\\Users\\jonas\\OneDrive\\Dokumenty\\HTML\\2022\\CSS Html\\Interface\\jQueryScript\\json\\format.json'
        nactenyFormatJson = self.nactiJson(souborFormatJsonAdresa)

        # nacte jiz existujici hodnoty span v globalnich datech
        # pokud existuji, netiskne je do lokalniho jsonu
        self.poleHodnotSpan = self.ziskejPoleSpanZExistujicihoFormatJson(nactenyFormatJson)

        jsonSpanArrTot = self.vratFormatTextuProRadek(text)

        print()


    def ziskejPoleSpanZExistujicihoFormatJson(self, nactenyFormatJson):

        poleHodnotSpan = []

        for i in range(0, len(nactenyFormatJson)):
            radek = nactenyFormatJson[i]
            indSpan = self.vratIndexSubstr(radek, '"span": "', 0)
            if(indSpan > -1):
                hodnota = self.ziskejHodnotuSpan(radek)
                poleHodnotSpan.append(hodnota)

        return(poleHodnotSpan)


    def ziskejHodnotuSpan(self, radek):

        radekBezNepotrebnychZnaku = radek.replace('+\n', '')
        radekBezNepotrebnychZnaku = radekBezNepotrebnychZnaku.replace('\t', '')
        radekBezNepotrebnychZnaku = radekBezNepotrebnychZnaku.replace('\'', '')
        radekBezNepotrebnychZnaku = radekBezNepotrebnychZnaku.replace('", ', '"')

        radekSpl = radekBezNepotrebnychZnaku.split(':')
        hodnota = radekSpl[1]
        hodnota = hodnota.replace('"', '')
        hodnota = hodnota.strip()

        return(hodnota)


    def vratFormatTextuProRadek(self, text):

        poleRozdelovacu = ['<', '>', '</', '>']
        #poleRozdelovacu = [' ', '=', ' ']
        self.rozlozenyTagJakoRozdelovace = []

        poleIndexuRozdelovacu = self.rozdelPoleRozdelovacuNaRozdelovaceSamostatne(text, poleRozdelovacu)
        startTag = self.vratSubStringMeziOddelovaci(text, poleRozdelovacu, poleIndexuRozdelovacu, '<', '>', False)
        textTag = self.vratSubStringMeziOddelovaci(text, poleRozdelovacu, poleIndexuRozdelovacu, '>', '</', True)
        endTag = self.vratSubStringMeziOddelovaci(text, poleRozdelovacu, poleIndexuRozdelovacu, '</', '>', False)


        jsonSpanArrStart = self.ziskejJsonSpanArr(startTag, text, True)
        jsonSpanArrText = self.ziskejJsonSpanArr(textTag, text, False)
        jsonSpanArrEnd = self.ziskejJsonSpanArr(endTag, text, True)

        # seskupi jsonSpanArr
        jsonSpanArrTot = []
        prvniRadek = '\'"format": [\''
        posledniRadek = '\']\''

        # vytvori pole Jsonu Format
        jsonSpanArrTot.append(prvniRadek)
        jsonSpanArrTot = jsonSpanArrTot + jsonSpanArrStart
        jsonSpanArrTot = jsonSpanArrTot + jsonSpanArrText
        jsonSpanArrTot = jsonSpanArrTot + jsonSpanArrEnd
        jsonSpanArrTot.append(posledniRadek)

        #doplni carky, pokud chybeji
        jsonSpanArrTot = self.doplnCarkyDoJsonu(jsonSpanArrTot)


        return(jsonSpanArrTot)



    # nektere uzly nejsou oddeleny carkami, proto carky dodatecne doplnuje
    def doplnCarkyDoJsonu(self, jsonSpanArr):

        for i in range(1, len(jsonSpanArr)):
            radek1 = jsonSpanArr[i-1]
            radek2 = jsonSpanArr[i]

            #opravi data
            if(radek1 == '\'}\''):
                if(radek2 == '\'{\''):
                    jsonSpanArr[i-1] = '\'},\''

        return(jsonSpanArr)


    def ziskejJsonSpanArr(self, tag, text, rozlozit):

        rozlozenyTag = self.rozlozTagNaTag(tag, rozlozit)

        if(len(rozlozenyTag) > 1):
            poleIndexuRozlozenehoTagu = self.rozdelPoleRozdelovacuNaRozdelovaceSamostatne(text, self.rozlozenyTagJakoRozdelovace)
            rozlozenyTagSousedi = self.vratPrvniAPosledniIndexyDleSlov(text, poleIndexuRozlozenehoTagu, self.rozlozenyTagJakoRozdelovace)
        else:
            rozlozenyTagSousedi = ''    # data nejsou potreba, sousedi jsou '>' a '<'

        jsonSpanArr = self.vytvorFormatJson(rozlozenyTag, rozlozenyTagSousedi)

        return(jsonSpanArr)


    def vytvorFormatJson(self, rozlozenyTag, rozlozenyTagSousedi):

        jsonSpanArr = []

        if (len(rozlozenyTag) > 1):

            jsonNazevTagu = self.vytvorFormatJsonProJedenSpan(rozlozenyTag[0], rozlozenyTagSousedi[0], 'class:tagName')
            jsonSpanArr = jsonSpanArr + jsonNazevTagu

            atributyAParametry = self.vytvorJsonProRozlozeneTagy(rozlozenyTag, rozlozenyTagSousedi)
            jsonSpanArr = jsonSpanArr + atributyAParametry

        else:
            soused = '>' + rozlozenyTag[0] + '<'
            jsonNazevTagu = self.vytvorFormatJsonProJedenSpan(rozlozenyTag[0], soused, 'class:text')
            jsonSpanArr = jsonSpanArr + jsonNazevTagu



        return(jsonSpanArr)


    def vytvorJsonProRozlozeneTagy(self, rozlozenyTag, rozlozenyTagSousedi):

        atributyPole = rozlozenyTag[1]
        atributyPoleSousedi = rozlozenyTagSousedi[1]

        parametryPole = rozlozenyTag[2]
        parametryPoleSousedi = rozlozenyTagSousedi[2]

        jsonSpanArr = []

        for i in range(0, len(atributyPole)):

            # vrati json pro atribut
            atribut = atributyPole[i]
            atributSousedi = atributyPoleSousedi[i]
            jsonJedenAtribut = self.vytvorFormatJsonProJedenSpan(atribut, atributSousedi, 'class:attr')
            jsonSpanArr = jsonSpanArr + jsonJedenAtribut

            # vrati json pro parametr
            parametr = parametryPole[i]
            parametrSousedi = parametryPoleSousedi[i]
            jsonJedenParametr = self.vytvorFormatJsonProJedenSpan(parametr, parametrSousedi, 'class:par')
            jsonSpanArr = jsonSpanArr + jsonJedenParametr

        return(jsonSpanArr)


    def vytvorFormatJsonProJedenSpan(self, span, spanSoused, style):

        spanArr = []

        generujSpan = self.detekujZdaSpanNeniObsazenVGlobalnichDatech(span)


        if(generujSpan == True):

            prvniRadek = '\'{\''

            spanRadek = '\'"span": "' + span + '",\''
            spanSousedRadek = '\'"spanNeighbors": "' + spanSoused + '",\''
            styleRadek = '\'"style": "' + style + '"\''
            posledniRadek = '\'}\''


            # prida radky do pole
            spanArr.append(prvniRadek)
            spanArr.append(spanRadek)
            spanArr.append(spanSousedRadek)
            spanArr.append(styleRadek)
            spanArr.append(posledniRadek)

        return(spanArr)


    # pokud span je v format.json, pak se jiz negeneruje zde v lokalnim souboru
    def detekujZdaSpanNeniObsazenVGlobalnichDatech(self, span):

        indSpan = self.vratIndexSubstr(self.poleHodnotSpan, span, 0)

        if(indSpan == -1):
            generujSpan = True      # tzn. span neni nalezen v globalnich datech a proto se generuje
        else:
            generujSpan = False     # span je v globalnich datech (format.json) a tudiz se negeneruje

        return(generujSpan)


    def vratPrvniAPosledniIndexyDleSlov(self, text, poleVsechIndexuVsechZnaku, poleSlov):

        prvniIndex = poleVsechIndexuVsechZnaku[0]
        slovaSousedArr = []

        for i in range(0, len(poleSlov)):
            slovo = poleSlov[i]
            delkaSlova = len(slovo)
            posledniIndex = prvniIndex + delkaSlova

            slovoSoused = text[prvniIndex-1:posledniIndex+1:1]
            slovaSousedArr.append(slovoSoused)

            prvniIndex = self.vyhledejPrvniIndex(poleVsechIndexuVsechZnaku, posledniIndex)

        # seskupi data, tak aby struktura odpovidala poli 'rozlozenyTag'
        slovaSousedArr = self.seskupPole(slovaSousedArr)

        return(slovaSousedArr)


    # je treba preskupit data, tak aby se v nich dalo vyznat
    # tj. pole obsahujici vsechny prvky za sebou se vkladaji do poli, ktere obsahuji
    # 1. index - nazev tagu
    # 2. index - pole atributu
    # 3. index - pole parametru

    def seskupPole(self, pole1D):

        pole2D = []
        poleAtributu = []
        poleParametru = []

        pocetAtributu = int((len(pole1D) - 1) / 2)

        # prida polozku odpovidajici nazvu tagu
        pole2D.append(pole1D[0])

        for i in range(0, pocetAtributu):
            indexAtr = i * 2 + 1
            indexPar = indexAtr + 1

            poleAtributu.append(pole1D[indexAtr])
            poleParametru.append(pole1D[indexPar])

        pole2D.append(poleAtributu)
        pole2D.append(poleParametru)

        return(pole2D)


    #vrati index z poleIndexu, ktery je prvni vetsi, nez indexMinExp
    def vyhledejPrvniIndex(self, poleIndexu, indexMinExp):

        indexMin = -1

        for i in range(1, len(poleIndexu)):
            index = poleIndexu[i]
            if(index > indexMinExp):
                indexMin = index
                break

        return(indexMin)


    # vrati z tagu tag
    def rozlozTagNaTag(self, tag, rozlozit):

        if(rozlozit == True):
            tagSplit = tag.split(' ')
            tagZav = tagSplit[0]
            tagZavSpl = tagZav.split('<')
            nazevTagu = tagZavSpl[1]
            nazevTagu = self.odeberZattrParSplNepotrebneZnaky(nazevTagu)


            self.rozlozenyTagJakoRozdelovace.append(nazevTagu)

            poleAtr = []
            polePar = []

            for i in range(1, len(tagSplit)):
                atrPar = tagSplit[i]
                attrParSpl = atrPar.split('=')
                attrParSpl = self.odeberZattrParSplNepotrebneZnaky(attrParSpl)

                poleAtr.append(attrParSpl[0])
                polePar.append(attrParSpl[1])

                self.rozlozenyTagJakoRozdelovace.append(attrParSpl[0])
                self.rozlozenyTagJakoRozdelovace.append(attrParSpl[1])

            rozlozenyTag = []
            rozlozenyTag.append(nazevTagu)
            rozlozenyTag.append(poleAtr)
            rozlozenyTag.append(polePar)

        else:
            # pokud se nic nerozklada
            rozlozenyTag = []
            rozlozenyTag.append(tag)


        return(rozlozenyTag)


    def odeberZattrParSplNepotrebneZnaky(self, attrParSpl):

        jeToPole = type(attrParSpl) is list

        if(jeToPole == True):

            for i in range(1, len(attrParSpl)):
                attrParSpl[i] = attrParSpl[i].replace('<', '')
                attrParSpl[i] = attrParSpl[i].replace('/', '')
                attrParSpl[i] = attrParSpl[i].replace('>', '')

        else:
            attrParSpl = attrParSpl.replace('<', '')
            attrParSpl = attrParSpl.replace('/', '')
            attrParSpl = attrParSpl.replace('>', '')

        return(attrParSpl)


    def odeberZnak(self, text, znak):

        try:
            textNew = text.replace(znak, '')
        except:
            textNew = text

        return(textNew)


    def vratSubStringMeziOddelovaci(self, radek, poleRozdelovacu, poleIndexuRozdelovacu, rozdelVlevo, rozdelVpravo, mezi):

        iVlevo = poleRozdelovacu.index(rozdelVlevo, 0)
        iVpravo = poleRozdelovacu.index(rozdelVpravo, iVlevo)

        indexVlevo = poleIndexuRozdelovacu[iVlevo]
        indexVpravo = poleIndexuRozdelovacu[iVpravo] + 1

        if(mezi == True):
            indexVlevo = indexVlevo + 1
            indexVpravo = indexVpravo - 1

        subString = radek[indexVlevo:indexVpravo:1]

        return(subString)


    def rozdelPoleRozdelovacuNaRozdelovaceSamostatne(self, radek, poleRozdelovacu):

        rozlozeneRozdelovace = []

        for i in range(0, len(poleRozdelovacu)):
            rozdelovac = poleRozdelovacu[i]
            znakyRozdelovace = list(rozdelovac)
            rozlozeneRozdelovace = rozlozeneRozdelovace + znakyRozdelovace

        poleIndexuRozdelovacu = self.vratPoleRozdelovacuPoZnacich(radek, rozlozeneRozdelovace)
        poleIndexuRozdelovacu = self.vratPoleIndexuRozdelovacu(poleRozdelovacu, poleIndexuRozdelovacu)

        return(poleIndexuRozdelovacu)



    # jelikoz oddelovac obsahuje 2 znaky '<' a '/' je treba sjednotil pole indexu
    def vratPoleIndexuRozdelovacu(self, poleRozdelovacu, poleIndexuRozdelovacu):

        try:
            indexOddelovaZavLom = poleRozdelovacu.index('</')
            indexRozdelovace1 = poleIndexuRozdelovacu[indexOddelovaZavLom]
            indexRozdelovace2 = poleIndexuRozdelovacu[indexOddelovaZavLom+1]

            if(indexRozdelovace1 == indexRozdelovace2-1):
                poleIndexuRozdelovacu.remove(indexRozdelovace2)

        except:
            poleIndexuRozdelovacu = poleIndexuRozdelovacu


        return(poleIndexuRozdelovacu)



    # vrati pole
    def vratPoleRozdelovacuPoZnacich(self, radek, znaky):

        arr = list(radek)

        iZnak = 0
        hledejOdIndexu = 0
        poleIndexuZnaku = []


        for i in range(0, len(arr)):

            if(iZnak == len(znaky)):
                break
            else:
                znak = znaky[iZnak]
                indZnaku = self.vratIndexSubstr(arr, znak, hledejOdIndexu)

                if (indZnaku == -1):
                    break
                else:
                    hledejOdIndexu = indZnaku + 1
                    iZnak = iZnak + 1

                    poleIndexuZnaku.append(indZnaku)

        return(poleIndexuZnaku)


    def vratIndexSubstr(self, radek, substr, hledejOd):

        try:
            index = radek.index(substr, hledejOd)
        except:
            index = -1


        return (index)










    def ziskejObsahStartTagu(self, text):

        indexStartStartTagu = text.index('<')
        indexEndStartTagu = text.index('>', indexStartStartTagu)+1

        tagStart = text[indexStartStartTagu:indexEndStartTagu:1]
        textMeziTagy = text[indexEndStartTagu:indexStartEndTagu:1]


        print()


    def ziskejObsahEndTagu(self, text, indexEndStartTagu):

        indexStartEndTagu = text.index('<', indexEndStartTagu)
        indexEndEndTagu = text.index('>', indexEndStartTagu) + 1

        tagEnd = text[indexStartEndTagu:indexEndEndTagu:1]


    def nactiJson(self, adresaHtml):

        pole = []

        r = -1
        with open(adresaHtml, 'r') as f:
            for line in f:
                r = r + 1

                pole.append(line)

        return (pole)