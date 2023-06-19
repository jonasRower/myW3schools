# nacita vsechny data z "dataJsonFiles.csv" a opakovane je zapisuje pomoci tohoto python-projektu

import proverExistenciDatCsv
import jsonMain
from pathlib import Path

class nacitejCsvAZapisujData:

    def __init__(self):

        zacatekCesty = self.nactiCestu()

        pathSrcClass = proverExistenciDatCsv.checkDataInCsv(False, 'pathSrc', False, True)
        idMultiClass = proverExistenciDatCsv.checkDataInCsv(False, 'idMulti', False, True)
        pathJsonClass = proverExistenciDatCsv.checkDataInCsv(False, 'pathJson', False, True)

        pathSrc = pathSrcClass.getPoleHodnot()
        idMultiArr = idMultiClass.getPoleHodnot()

        # treeDebug se smaze a nebude se pouzivat
        # tady jsou data, ktera se budou tisknout do html, do  <div class="genJs">
        # poleHodnotGenJs = pathJsonClass.getPoleHodnotGenJs()

        self.zapisujVsechnaData(pathSrc, idMultiArr, zacatekCesty)


    #def ziskejAdresu(self):


    def zapisujVsechnaData(self, pathSrc, idMultiArr, zacatekCesty):

        for i in range(1, len(pathSrc)):
            cestaHtmlSrc = pathSrc[i]

            if(cestaHtmlSrc != ''):
                cetaUplna = zacatekCesty + cestaHtmlSrc
                idMulti = idMultiArr[i]

                # normalni beh programu
                jsonMain.generujJson(cetaUplna, idMulti)


    #pokud neni uplna cesta, pak ji doplnuje
    def nactiCestu(self):

        cesta = Path.cwd()
        cestaSpl = cesta.parts
        cestaNew = ""

        for i in range(0, len(cestaSpl)):
            polozka = cestaSpl[i]
            if(polozka == 'prepareData'):
                break
            else:
                polozka = polozka.replace('\\', '/')
                cestaNew = cestaNew + polozka
                if (i > 0):
                    cestaNew = cestaNew + '/'

        return(cestaNew)