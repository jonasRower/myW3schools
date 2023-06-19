# odebira data z jsonFiles dle souboru "dataJsonFiles.csv"

import proverExistenciDatCsv

class odebirejData:

    def __init__(self, jsonFilesSekce):

        pathJsonArr = self.ziskejVsechnyPathJson(jsonFilesSekce)
        proverExistenciDoJsonu = proverExistenciDatCsv.checkDataInCsv(pathJsonArr, 'pathJson', True, False)
        boolArr = proverExistenciDoJsonu.getBoolArr()
        self.jsonFilesSekceNew = self.odebirejJsonFilesSekce(jsonFilesSekce, boolArr)


    def getJsonFilesSekceNew(self):
        return(self.jsonFilesSekceNew)


    def odebirejJsonFilesSekce(self, jsonFilesSekce, boolArr):

        jsonFilesSekceNew = []

        for i in range(0, len(jsonFilesSekce)):
            subPole = jsonFilesSekce[i]
            bool = boolArr[i]
            if(bool == False):
                jsonFilesSekceNew.append(subPole)

        return(jsonFilesSekceNew)


    def ziskejVsechnyPathJson(self, jsonFilesSekce):

        pathJsonArr = []

        for i in range(0, len(jsonFilesSekce)):
            subPole = jsonFilesSekce[i]
            pathJson = self.vratPathJsonZSubPole(subPole)
            pathJsonArr.append(pathJson)

        return(pathJsonArr)


    def vratPathJsonZSubPole(self, subPole):

        pathJson = ""

        for i in range(0, len(subPole)):
            radek = subPole[i]
            radekSpl = radek.split('pathJson": ')
            if(len(radekSpl) == 2):
                pathJson = radekSpl[1]
                pathJson = pathJson.replace('"', '')
                pathJson = pathJson.replace(',\'', '')
                break

        return(pathJson)