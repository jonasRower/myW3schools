
# nacte vsechny jsony a vyexportuje tabulku do csv
# cimz je mozne vsechny soubory hromadne upravovat v Excelu

class transformAllDataToCsv:

    def __init__(self):

        adresaJson = 'C:\\Users\\jonas\\OneDrive\\Dokumenty\\2023\\myW3Schools\\myW3schools-main\\Interface\\jQueryScript\\json\\jsonFiles.json'
        poleJson = self.nactiHtml(adresaJson)
        poleJson = self.vratPoleBezSpecZnaku(poleJson)
        self.ziskejPoleIndexuVsechOddelujicichRadku(poleJson)

        print()


    def ziskejPoleIndexuVsechOddelujicichRadku(self, poleJson):

        poleKoncuSekci = self.ziskejPoleKoncuSekci(poleJson)
        zacKonSekceArr = self.ziskejPoleZacatkuSekci(poleKoncuSekci)
        kliceHodnotySubSekci = self.ziskejKliceHodnotySubSekci(poleJson, zacKonSekceArr)
        vsechnyKliceUniq = self.ziskejPoleVsechKlicu(kliceHodnotySubSekci)
        hodnotyDleKlicuArr = self.vratVsechnyHodnotyDleKlicuArr(kliceHodnotySubSekci, vsechnyKliceUniq)
        poleRadkuDoCsv = self.ziskejObsahCsvJakoPole(hodnotyDleKlicuArr)

        self.tiskniCsv(poleRadkuDoCsv, 'C:\\Users\jonas\\OneDrive\\Dokumenty\\2023\\myW3Schools\\myW3schools-main\\sources\csv\\dataJsonFiles.csv')

        print()


    def ziskejObsahCsvJakoPole(self, hodnotyDleKlicuArr):

        poleRadkuDoCsv = []

        for i in range(0, len(hodnotyDleKlicuArr[0])):
            indexRadku = i
            radek = self.vytvorRadekDoCsv(hodnotyDleKlicuArr, indexRadku)
            poleRadkuDoCsv.append(radek)

        return(poleRadkuDoCsv)


    def vytvorRadekDoCsv(self, hodnotyDleKlicuArr, indexRadku):

        radek = ""

        for i in range(0, len(hodnotyDleKlicuArr)):
            hodnota = hodnotyDleKlicuArr[i][indexRadku]
            hodnota = hodnota.replace('"','')
            radek = radek + hodnota + ','

        return(radek)



    def vratVsechnyHodnotyDleKlicuArr(self, kliceHodnotySubSekci, vsechnyKliceUniq):

        hodnotyDleKlicuArr = []

        for i in range(0, len(vsechnyKliceUniq)):
            nazevKlice = vsechnyKliceUniq[i]
            poleHodnot = self.vratVsechnyHodnotyDleNazvuKlice(kliceHodnotySubSekci, nazevKlice)

            hodnotyDleKlicuArr.append(poleHodnot)

        return(hodnotyDleKlicuArr)


    def vratVsechnyHodnotyDleNazvuKlice(self, kliceHodnotySubSekci, nazevKlice):

        poleHodnot = []
        poleHodnot.append(nazevKlice)

        for i in range(0, len(kliceHodnotySubSekci)):
            subSekce = kliceHodnotySubSekci[i]
            kliceSubSekce = self.vratDataSloupcePole(subSekce, 0)
            indexKlice = self.ziskejIndexPole(kliceSubSekce, nazevKlice)

            if(indexKlice == -1):
                hodnota = ""
            else:
                hodnota = subSekce[indexKlice][1]

            poleHodnot.append(hodnota)

        return(poleHodnot)



    def ziskejPoleVsechKlicu(self, kliceHodnotySubSekci):

        vsechnyKlice = []

        for i in range(0, len(kliceHodnotySubSekci)):
            subSekce = kliceHodnotySubSekci[i]
            kliceSubSekce = self.vratDataSloupcePole(subSekce, 0)
            vsechnyKlice = vsechnyKlice + kliceSubSekce

        vsechnyKliceUniq = self.unique(vsechnyKlice)

        return(vsechnyKliceUniq)


    def unique(self, list1):

        # initialize a null list
        unique_list = []

        # traverse for all elements
        for x in list1:
            # check if exists in unique_list or not
            if x not in unique_list:
                unique_list.append(x)

        return(unique_list)


    #vrati 1D z pole 2D na danem indexu sloupce
    def vratDataSloupcePole(self, subSekce, index):

        data1D = []

        for i in range(0, len(subSekce)):
            polozka = subSekce[i][index]
            data1D.append(polozka)

        return(data1D)


    def ziskejKliceHodnotySubSekci(self, poleJson, zacKonSekceArr):

        kliceHodnotyArr = []

        for i in range(0, len(zacKonSekceArr)):
            indZac = zacKonSekceArr[i][0]+1
            indKon = zacKonSekceArr[i][1]

            subSekce = self.vratSubSekci(indZac, indKon, poleJson)
            kliceHodnoty = self.vratPoleDvojicKlicHodnota(subSekce)

            kliceHodnotyArr.append(kliceHodnoty)


        return(kliceHodnotyArr)


    def vratPoleDvojicKlicHodnota(self, subSekce):

        kliceHodnoty = []

        for i in range(0, len(subSekce)):
            radek = subSekce[i]
            radek = radek.replace(',', '')
            klicHodnota = []

            klicHodnota = radek.split(':')
            kliceHodnoty.append(klicHodnota)

        return(kliceHodnoty)


    def vratSubSekci(self, indZac, indKon, poleJson):

        subSekce = []

        for i in range(indZac, indKon):
            radek = poleJson[i]
            subSekce.append(radek)

        return(subSekce)


    def ziskejPoleZacatkuSekci(self, poleKoncuSekci):

        indexZacatkuSekce = 1
        zacKonSekceArr = []

        for i in range(0, len(poleKoncuSekci)):
            indexKonecSekce = poleKoncuSekci[i]

            zacKon = []
            zacKon.append(indexZacatkuSekce)
            zacKon.append(indexKonecSekce)
            zacKonSekceArr.append(zacKon)

            #ulozi data do dalsi smycky
            indexZacatkuSekce = indexKonecSekce + 1

        return(zacKonSekceArr)



    def ziskejPoleKoncuSekci(self, poleJson):

        poleKoncuSekci = []

        for i in range(0, len(poleJson)):
            radek = poleJson[i]
            if (radek == '}}, +'):
                poleKoncuSekci.append(i)

            if (radek == '}} +'):
                poleKoncuSekci.append(i)

        return (poleKoncuSekci)


    def vratPoleBezSpecZnaku(self, poleJson):

        poleNew = []

        for i in range(0, len(poleJson)):
            radek = poleJson[i]
            radekNew = radek.replace('\t', '')
            radekNew = radekNew.replace('\n', '')
            radekNew = radekNew.replace('\'', '')
            radekNew = radekNew.replace('" +', '"')
            radekNew = radekNew.replace('", +', '",')

            poleNew.append(radekNew)


        return(poleNew)


    def nactiHtml(self, adresaJson):
        pole = []

        r = -1
        with open(adresaJson, 'r') as f:
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


    def tiskniCsv(self, dataKTisku, nazevSouboru):

        dataWrite = ""

        f = open(nazevSouboru, 'w')

        for i in range(0, len(dataKTisku)):
            radek = str(dataKTisku[i])
            dataWrite = dataWrite + radek + '\n'

        f.write(dataWrite)
        f.close()