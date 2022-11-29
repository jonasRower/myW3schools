# vrati pole odsazení, tzn. odsadi zanorene radky html automaticky

from collections import Counter

class odsadRadky:

    def __init__(self, obsahHtml):

        indexyRadkuStartEnd = self.vratStartEndIndexyTagu(obsahHtml)
        nadrazeneUrovneAll = self.vratVsechnyNadrazeneUrovneVsechUrovni(indexyRadkuStartEnd)

        self.poleIndexuZanoreni = self.vratPoleUrovniZanoreni(len(obsahHtml), nadrazeneUrovneAll)


    def getPoleIndexuZanoreni(self):
        return(self.poleIndexuZanoreni)


    def vratPoleUrovniZanoreni(self, pocetRadku, nadrazeneUrovneAll):

        poleIndexuZanoreni = []

        for i in range(0, pocetRadku):
            indexZanoreni = self.vratUrovenZanoreniDleIndexuRadku(i, nadrazeneUrovneAll)
            poleIndexuZanoreni.append(indexZanoreni)

        return(poleIndexuZanoreni)



    def vratUrovenZanoreniDleIndexuRadku(self, indexRadku, nadrazeneUrovneAll):

        prvniUrovneAll = self.ziskejRozdilPrvniUrovne(nadrazeneUrovneAll)
        urovneProDanyIndex = self.vratVsechnyUrovneProDanyIndex(indexRadku, prvniUrovneAll)
        indexUrovne = self.vratIndexUzsiUrovne(urovneProDanyIndex)
        nejuzsiUroven = nadrazeneUrovneAll[indexUrovne]
        indexZanoreni = len(nejuzsiUroven)

        return(indexZanoreni)


    def vratIndexUzsiUrovne(self, urovneProDanyIndex):

        rozdilIndexuMin = urovneProDanyIndex[0][1]
        indexMin = 0

        for i in range(0, len(urovneProDanyIndex)):
            uroven = urovneProDanyIndex[i]
            rozdilIndexu = uroven[1]

            if(rozdilIndexu < rozdilIndexuMin):
                indexMin = i

        indexUrovne = urovneProDanyIndex[indexMin][2]

        return(indexUrovne)


    def vratVsechnyUrovneProDanyIndex(self, index, prvniUrovneAll):

        urovneProDanyIndex = []

        for i in range(0, len(prvniUrovneAll)):
            uroven = prvniUrovneAll[i]
            indexStart = uroven[0][0]
            indexEnd = uroven[0][1]

            if(index >= indexStart):
                if(index <= indexEnd):
                    urovneProDanyIndex.append(uroven)

        return(urovneProDanyIndex)


    def ziskejRozdilPrvniUrovne(self, nadrazeneUrovneAll):

        prvniUrovneAll = []

        for i in range(0, len(nadrazeneUrovneAll)):
            nadrazeneUrovne = nadrazeneUrovneAll[i]
            prvniUroven = nadrazeneUrovne[0]
            indexStart = prvniUroven[0]
            indexEnd = prvniUroven[1]
            rozdil = indexEnd - indexStart

            prvniUrovenRozdil = []
            prvniUrovenRozdil.append(prvniUroven)
            prvniUrovenRozdil.append(rozdil)
            prvniUrovenRozdil.append(i)

            prvniUrovneAll.append(prvniUrovenRozdil)

        return(prvniUrovneAll)


    def vratVsechnyNadrazeneUrovneVsechUrovni(self, indexyRadkuStartEnd):

        nadrazeneUrovneAll = []

        for i in range(0, len(indexyRadkuStartEnd)):
            vsechnyNadrazeneUrovneDaneUrovne = self.vratVsechnyNadrazeneUrovne(i, indexyRadkuStartEnd)
            nadrazeneUrovneAll.append(vsechnyNadrazeneUrovneDaneUrovne)

        return(nadrazeneUrovneAll)


    def vratVsechnyNadrazeneUrovne(self, index, indexyRadkuStartEnd):

        vsechnyNadrazeneUrovne = []
        urovenAktualni = indexyRadkuStartEnd[index]

        vsechnyNadrazeneUrovne.append(urovenAktualni)

        for i in range(0, index):
            urovenNadrazena = indexyRadkuStartEnd[i]
            jednaSeONadrazenouUroven = self.detekujZdaSeJednaONadrazenouUroven(urovenAktualni, urovenNadrazena)
            if(jednaSeONadrazenouUroven == True):
                vsechnyNadrazeneUrovne.append(urovenNadrazena)

        return(vsechnyNadrazeneUrovne)


    def detekujZdaSeJednaONadrazenouUroven(self, urovenPodrazena, urovenNadrazena):

        startNadrazena = urovenNadrazena[0]
        endNadrazena = urovenNadrazena[1]
        startPodrazena = urovenPodrazena[0]
        endPodrazena = urovenPodrazena[1]

        jednaSeONadrazenouUroven = False


        if(startNadrazena < startPodrazena):
            if(endNadrazena > endPodrazena):
                jednaSeONadrazenouUroven = True

        return(jednaSeONadrazenouUroven)


    def vratStartEndIndexyTagu(self, obsahHtml):

        poleIndexuStart = self.vratIndxyRadkuStartEnd(obsahHtml, True)
        poleIndexuEnd = self.vratIndxyRadkuStartEnd(obsahHtml, False)

        poleTaguStart = self.vratPolePrvnichSlov(poleIndexuStart, obsahHtml)
        poleTaguEnd = self.vratPolePrvnichSlov(poleIndexuEnd, obsahHtml)

        poleTaguStartEnd = self.ziskejPoleStartEndTagu(poleTaguStart, poleTaguEnd)
        indexyRadkuStartEnd = self.ziskejIndexyRadkuStartEnd(poleTaguStartEnd, poleIndexuStart, obsahHtml)
        jednaSeOSkupiny = self.detekujRadkyKtereTvoriSkupiny(indexyRadkuStartEnd)

        indexyEndTag = self.vratSkupinyIndexuEndTag(jednaSeOSkupiny, indexyRadkuStartEnd)
        cislaSkupin = self.vratPoleCiselSkupin(jednaSeOSkupiny, indexyRadkuStartEnd, indexyEndTag)
        pocetSkupin = max(cislaSkupin) + 1

        radkyStartEndArr = self.ziskejPoleIndexuProVsechnySkupiny(indexyRadkuStartEnd, cislaSkupin, pocetSkupin)
        indexyRadkuStartEndNew = self.opravOdsazeni(indexyRadkuStartEnd, radkyStartEndArr)
        indexyRadkuStartEndNew = self.opravData(indexyRadkuStartEndNew)


        return(indexyRadkuStartEndNew)



    # nekdy je koncovy tag jako pole o jednom prvku, proto prevede na cislo, aby byl format konzistentni pro vsechny radky
    def opravData(self, pole):

        poleNew = []

        for i in range(0, len(pole)):
            radek = pole[i]
            startIndex = radek[0]
            endIndex = radek[1]

            if (isinstance(endIndex, list)):
                endIndex = endIndex[0]

            radekNew = []
            radekNew.append(startIndex)
            radekNew.append(endIndex)

            poleNew.append(radekNew)

        return(poleNew)


    def opravOdsazeni(self, indexyRadkuStartEnd, radkyStartEndArr):

        for i in range(0, len(radkyStartEndArr)):
            radkySkupina = radkyStartEndArr[i]

            indexyRadku = radkySkupina[0]
            startEndTags = radkySkupina[1]

            for r in range(0, len(indexyRadku)):
                indexRadku = indexyRadku[r]
                startEndTag = startEndTags[r]

                # prepise data
                indexyRadkuStartEnd[indexRadku] = startEndTag
                print()


        return(indexyRadkuStartEnd)



    def ziskejPoleIndexuProVsechnySkupiny(self, indexyRadkuStartEnd, cislaSkupin, pocetSkupin):

        radkyStartEndArr = []

        for i in range(0, pocetSkupin):
            indexyRadkuSkupiny = self.ziskejIndexyRadkuDaneSkupiny(cislaSkupin, i)
            indexyStartEndArr = self.ziskejMinimalniRozdilProIndexyRadkuSkupiny(indexyRadkuSkupiny, indexyRadkuStartEnd)

            radkyStartEnd = []
            radkyStartEnd.append(indexyRadkuSkupiny)
            radkyStartEnd.append(indexyStartEndArr)

            radkyStartEndArr.append(radkyStartEnd)

        return(radkyStartEndArr)


    def ziskejMinimalniRozdilProIndexyRadkuSkupiny(self, indexyRadkuSkupiny, indexyRadkuStartEnd):

        indexyStartEndArr = []

        indexyStart = self.ziskejSkupinuIndexuStartEndTagu(indexyRadkuSkupiny, indexyRadkuStartEnd, 0)
        indexyEnd = self.ziskejSkupinuIndexuStartEndTagu(indexyRadkuSkupiny, indexyRadkuStartEnd, 1)

        for i in range(0, len(indexyRadkuSkupiny)):

            rozdilyArr = self.dopocitejRozdilyPoleRadku(indexyStart, indexyEnd)
            sloupecHodnotaMin = self.vratIndexStartEndMin(rozdilyArr, indexyRadkuSkupiny, indexyEnd)
            indexStartEnd = self.ziskejPrvniAPosledniIndex(sloupecHodnotaMin, indexyStart, indexyEnd)
            indexyStartEndArr.append(indexStartEnd)

            #odebere z pole index a opakuje znovu
            indexyStart.remove(indexStartEnd[0])
            indexyEnd = self.odeberPrvekZPole2D(indexyEnd, indexStartEnd[1])


        return(indexyStartEndArr)



    def odeberPrvekZPole2D(self, pole2D, prvek):

        pole2DNew = []

        for i in range(0, len(pole2D)):
            radek = pole2D[i]
            radek.remove(prvek)
            pole2DNew.append(radek)

        return(pole2DNew)


    def ziskejPrvniAPosledniIndex(self, sloupecHodnotaMin, indexyStart, indexyEnd):

        indR = sloupecHodnotaMin[3]
        indS = sloupecHodnotaMin[1]
        indexStart = indexyStart[indR]
        indexEnd = indexyEnd[indR][indS]

        indexStartEnd = []
        indexStartEnd.append(indexStart)
        indexStartEnd.append(indexEnd)

        return(indexStartEnd)


    def vratIndexStartEndMin(self, rozdilyArr, indexyRadkuSkupiny, indexyEnd):

        sloupecHodnotaMin = []
        sloupecHodnotaMin.append(rozdilyArr[0][0])
        sloupecHodnotaMin.append(0)
        sloupecHodnotaMin.append(indexyEnd[0][0])

        minR = -1
        rozdilMinPrev = -1

        for r in range(0, len(rozdilyArr)):
            radek = rozdilyArr[r]
            radekIndexyEnd = indexyEnd[r]
            sloupecHodnotaMin = self.vratRozdilMinRadek(radek, sloupecHodnotaMin, radekIndexyEnd)

            rozdilMin = sloupecHodnotaMin[0]
            if(rozdilMin != rozdilMinPrev):
                minR = minR + 1

        sloupecHodnotaMin.append(minR)

        return(sloupecHodnotaMin)


    def vratRozdilMinRadek(self, radekRozdil, sloupecHodnotaMin, radekIndexyEnd):

        sloupecHodnotaMinNew = []
        hodnotaMin = sloupecHodnotaMin[0]
        sloupec = sloupecHodnotaMin[1]
        indexEndMin = radekIndexyEnd[0]

        for s in range(0, len(radekRozdil)):
            hodnota = radekRozdil[s]
            indexEnd = radekIndexyEnd[s]

            if(hodnota < hodnotaMin):
                hodnotaMin = hodnota
                sloupec = s
                indexEndMin = indexEnd

        sloupecHodnotaMinNew.append(hodnotaMin)
        sloupecHodnotaMinNew.append(sloupec)
        sloupecHodnotaMinNew.append(indexEndMin)

        return(sloupecHodnotaMinNew)


    def dopocitejRozdilyPoleRadku(self, indStartArr, indexyEnd):

        rozdilyArr = []

        for i in range(0, len(indStartArr)):
            indStart = indStartArr[i]
            indEndArr = indexyEnd[i]
            rozdilyRadek = self.dopocitejRozdilyRadku(indStart, indEndArr)
            rozdilyArr.append(rozdilyRadek)

        return(rozdilyArr)


    def dopocitejRozdilyRadku(self, indStart, indEndArr):

        rozdilArr = []

        for i in range(0, len(indEndArr)):
            indEnd = indEndArr[i]
            rozdil = indEnd - indStart
            rozdilArr.append(rozdil)

        return(rozdilArr)


    def ziskejSkupinuIndexuStartEndTagu(self, indexyRadku, indexyRadkuStartEnd, indStartEnd):

        indexyStartEnd = []

        for i in range(0, len(indexyRadku)):
            indexRadku = indexyRadku[i]
            startEnd = indexyRadkuStartEnd[indexRadku][indStartEnd]

            indexyStartEnd.append(startEnd)

        return(indexyStartEnd)


    def ziskejIndexyRadkuDaneSkupiny(self, cislaSkupin, cisloSkupinyExp):

        indexyRadkuSkupiny = []

        for i in range(0, len(cislaSkupin)):
            cisloSkupiny = cislaSkupin[i]
            if(cisloSkupinyExp == cisloSkupiny):
                indexyRadkuSkupiny.append(i)

        return(indexyRadkuSkupiny)



    def vratSkupinyIndexuEndTag(self, jednaSeOSkupiny, indexyRadkuStartEnd):

        vsechnyIndexyEndTag = []

        for i in range(0, len(jednaSeOSkupiny)):
            jednaSeOSkupinu = jednaSeOSkupiny[i]
            if(jednaSeOSkupinu == True):
                indexRadkuStartEnd = indexyRadkuStartEnd[i]
                indexRadkuEnd = indexRadkuStartEnd[1]

                vsechnyIndexyEndTag.append(indexRadkuEnd)

        indexyEndTag = self.unique(vsechnyIndexyEndTag)

        return(indexyEndTag)



    def vratPoleCiselSkupin(self, jednaSeOSkupiny, indexyRadkuStartEnd, indexyEndTag):

        cislaSkupin = []

        for i in range(0, len(jednaSeOSkupiny)):
            jednaSeOSkupinu = jednaSeOSkupiny[i]
            if(jednaSeOSkupinu == True):
                startEnd = indexyRadkuStartEnd[i]
                end = startEnd[1]
                cisloSkupiny = self.ziskejIndexPole(indexyEndTag, end)
            else:
                cisloSkupiny = -1

            cislaSkupin.append(cisloSkupiny)

        return(cislaSkupin)



    def unique(self, list1):

        # initialize a null list
        unique_list = []

        # traverse for all elements
        for x in list1:
            # check if exists in unique_list or not
            if x not in unique_list:
                unique_list.append(x)

        return(unique_list)


    # tam kde bude skupina vraci True, jinak False
    def detekujRadkyKtereTvoriSkupiny(self, indexyRadkuStartEnd):

        jednaSeOSkupiny = []

        for i in range(0, len(indexyRadkuStartEnd)):
            startEnd = indexyRadkuStartEnd[i]
            end = startEnd[1]

            try:
                if(len(end) > 1):
                    jednaSeOSkupinu = True
                else:
                    jednaSeOSkupinu = False
            except:
                jednaSeOSkupinu = False

            jednaSeOSkupiny.append(jednaSeOSkupinu)


        return(jednaSeOSkupiny)


    def ziskejIndexyRadkuStartEnd(self, poleTaguStartEnd, poleIndexuStart, obsahHtml):

        indexyStartEndPole = []

        for i in range(0, len(poleTaguStartEnd)):
            indexStart = poleIndexuStart[i]
            tagStartEnd = poleTaguStartEnd[i]
            tagEnd = tagStartEnd[1]

            indexStartEnd = []
            indexStartEnd.append(indexStart)

            if(tagEnd != ''):
                tagEnd = tagStartEnd[1]

                poleVsechIndexuEndTagu = self.vratVsehnyIndexyRadkuPodleSlova(tagEnd, obsahHtml, indexStart)
                indexStartEnd.append(poleVsechIndexuEndTagu)

            else:
                indexStartEnd.append(indexStart)

            indexyStartEndPole.append(indexStartEnd)

        return(indexyStartEndPole)


    def vratVsehnyIndexyRadkuPodleSlova(self, slovo, obsahHtml, hledejOdIndexu):

        indexyRadkuDleSlova = []

        for i in range(hledejOdIndexu, len(obsahHtml)):
            radek = obsahHtml[i]
            radekTrim = radek.strip()

            radekZacinaSlovem = self.detekujZdaRadekZacinaSlovem(radekTrim, slovo)
            if(radekZacinaSlovem == True):
                indexyRadkuDleSlova.append(i)

        return(indexyRadkuDleSlova)



    def detekujZdaRadekZacinaSlovem(self, radek, slovo):

        indSlovo = self.ziskejIndexPole(radek, slovo)
        if(indSlovo == 0):
            radekZacinaSlovem = True
        else:
            radekZacinaSlovem = False

        return(radekZacinaSlovem)



    def ziskejPoleStartEndTagu(self, poleTaguStart, poleTaguEnd):

        #detekujZdaRadekObsahujeSubstr
        poleTaguStartEnd = []

        for i in range(0, len(poleTaguStart)):
            tagStartEnd = []
            tagStart = poleTaguStart[i]
            tagStartEnd.append('<' + tagStart)

            indexEnd = self.ziskejIndexPole(poleTaguEnd, tagStart)
            if(indexEnd > -1):
                tagEnd = poleTaguEnd[indexEnd]
                tagStartEnd.append('</' + tagEnd)
            else:
                tagStartEnd.append('')

            poleTaguStartEnd.append(tagStartEnd)


        return(poleTaguStartEnd)


    def vratIndxyRadkuStartEnd(self, obsahHtml, startEnd):

        indexyRadku = []

        for i in range(0, len(obsahHtml)):
            radek = obsahHtml[i]
            radektrim = radek.strip()

            if (startEnd == True):
                tagStart = self.detekujZdaStrObsahujePrvniZnaky(radektrim, 1, '<')
                if(tagStart == True):

                    # musi vyloucit, ze neobsahuje '</')
                    tagEnd = self.detekujZdaStrObsahujePrvniZnaky(radektrim, 2, '</')
                    if(tagEnd == False):
                        indexyRadku.append(i)

            if (startEnd == False):
                tagEnd = self.detekujZdaStrObsahujePrvniZnaky(radektrim, 2, '</')
                if (tagEnd == True):
                    indexyRadku.append(i)



        return(indexyRadku)



    def detekujZdaStrObsahujePrvniZnaky(self, radek, pocetZnaku, subStrExp):

        subStr = radek[0:pocetZnaku:1]
        if(subStr == subStrExp):
            jednaSeOSubstr = True
        else:
            jednaSeOSubstr = False


        return(jednaSeOSubstr)



    def vratPolePrvnichSlov(self, poleIndexu, obsahHtml):

        poleSlov = []

        for i in range(0, len(poleIndexu)):
            index = poleIndexu[i]
            radek = obsahHtml[index]

            radekTrim = radek.strip()
            radekTrim = radekTrim.replace('</', '')
            radekTrim = radekTrim.replace('<', '')
            radekTrim = radekTrim.replace('>', ' ')

            radekSpl = radekTrim.split(' ')
            prvniSlovo = radekSpl[0]
            poleSlov.append(prvniSlovo)


        return(poleSlov)


    def ziskejIndexPole(self, pole, substr):

        try:
            ind = pole.index(substr)

        except:
            ind = -1

        return(ind)
