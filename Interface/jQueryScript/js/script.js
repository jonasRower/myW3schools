
//this.grafyKCE = eval(zvolenyJSONStr);
//var srcJsHtml = $(srcId).html();


//vykresli zdrojak do html
class vytvorTabulkuSrc{

    constructor(obj, idButt){
        //alert(idButt);

        console.log(obj);
        if(obj != undefined){

            //proveruje, zda bylo stisknuto tlacitko option
            var optionByloStisknuto = this.detekujZdaByloStisknutoButtonOption(idButt);

            var seznamRadkuPuvodni = undefined;
            var seznamRowNum = undefined;

            //kdyz se stiskne tlacitko, pak se nepouzije highlight
            if(optionByloStisknuto == true){
                var prevezmiPuvodniData = new prevezmiPuvodniCss(undefined, undefined, false);
                seznamRadkuPuvodni = prevezmiPuvodniData.getSeznamRadkuPuvodni();
                seznamRowNum = prevezmiPuvodniData.getSeznamRowNum();
                console.log(seznamRadkuPuvodni);
            }

            //obsahuje vsechny individualni formatovani textu
            //to se postupne sem pridava, jak se nacita prislusny json obsahujici data projektu
            this.formatData = [];

            //naplni jen v pripade, ze "predejPoleKeKlicum==true"
            this.poleTextKlice;
            
            this.obj = obj;
            this.cislovaniZapnuto = true;

            //tableSrc = this.vytvorTabulku();
            tableSrc = this.vytvorTabulku(undefined);

            console.log(tableSrc);

            $("tr.tableSrc").remove();
            $("#tableSrc").append(tableSrc);


            //detekuje zda obarvovat text, pokud text neobarvovat (neni nastaveno v jsonu), pak kod nize nebezi
            var obarviText = this.detekujZdaJsonNemaRowType(this.poleRowType);

            
            //kod bezi nize jen, kdyz je nastaveno obarvovani
            if(obarviText == true){
                
                if(optionByloStisknuto == false){
                    
                    //zde obarvuje javascript a html
                    //jinak vytiskne html cernobile
                    var obarveniTextu = new obarviSrcUsingHighLight('js', tableSrc, this.poleText, this.poleRowType);
                    this.nahrazenyPoleText = obarveniTextu.getNahrazenyPoleText();
                    console.log(this.nahrazenyPoleText);
                    tableSrc = this.vytvorTabulku(this.nahrazenyPoleText);

                    //opravi data v tableSrc
                    tableSrc = this.opravujChybyVTableSrc(tableSrc);

                    $("tr.tableSrc").remove();
                    $("#tableSrc").append(tableSrc);
                    
                }
                
                
                
                //obarvuje Css
                if(seznamRowNum != false){

                    //ziska seznamRadkuProCss a seznamRowNumProcss
                    var obarviCss = new vratObarveneRadky(seznamRadkuPuvodni, seznamRowNum, true, tableSrc);

                    //ziska obarvene radky, bud z predchoziho spusteni pred stiskem option, nebo jen prebarvene css
                    tableSrc = obarviCss.getTableSrc();
                

                    $("tr.tableSrc").remove();
                    $("#tableSrc").append(tableSrc);

                }
                
            }

  
            setTimeout(function(){
                $('#srcForColoringjs').remove();
                $('#srcForColoringhtml').remove();
                $('.srcForColoring #html #srcHtml').remove();
            });
            

            //$("table").append(tableSrc);
            //odesle data aby mohl text obarvit
            //var textProObarveni = new odesliDataProObarveniTextu(tableSrc, this.formatData);
            
        }

    }


    getPoleTextKlice(){
        return(this.poleTextKlice);
    }


    predejDataProObarveniTextu(tableSrc){
        this.ziskejDataProObarveniTextu(tableSrc)
    }


    //opravuje chyby v tableSrc, tak ze primo zamenuje substringy
    opravujChybyVTableSrc(tableSrc){

        //opravuje <span> kdyz je tam uvozovka navic
        var b1 = '&lt;span" class="';
        var b2 = '&lt;span class="';

        //opravuje zavorky tagu u <p> (nebo i neceho jineho)
        var c1= '&lt;/&lt;span class=';
        var c2= '&lt;/<span class=';

        //opravuje format u <p id
        var d1 = '&lt;p id="demo"&gt;&lt;/p&gt;';
        var d2= '<span class="hljs-tag">&lt;<span class="hljs-name">p </span><span class="hljs-attr">id</span>=<span class="hljs-string">"demo"</span>&gt;</span><span class="hljs-tag"><span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>';

        //upravuje format u <DOCTYPE html>
        var e1 = '&lt;!DOCTYPE html&gt;';
        var e2 = '<span class="hljs-tag">&lt;<span class="hljs-name">!DOCTYPE html</span>&gt;</span>';

        //upravuje format u </html>
        var f1 = '&lt;/html&gt;';
        var f2 = '<span class="hljs-tag">&lt;/<span class="hljs-name">html</span>&gt;</span>';

        //upravuje format u </div>
        var g1 = '&lt;/div&gt;';
        var g2 = '<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>';

        //maze uvozovku u span
        var h1 = '>script</span>" <span';
        var h2 = '>script</span> <span';

        //upravuje kod u <script src=jquery>
        var i1 = '&lt;span class="language-javascript">&lt;/';
        var i2 = '&lt;/';

        //maze uvozovku u <script>
        var j1 = '>script</span>"&gt;';
        var j2 = '>script</span>&gt;';

        //upravuje format u <doctype html>
        var k1 = '&lt;!doctype html&gt;';
        var k2 = '<span class="hljs-tag">&lt;<span class="hljs-name">!doctype html</span>&gt;</span>';

        //upravuje format u <script src
        var l1 = '&lt;script src=';
        var l2 = '<span class="hljs-tag"><span class="language-javascript">&lt;<span class="hljs-name">script</span> <span class="hljs-attr">src</span>=<span class="hljs-string">';

        //upravuje format u <script src
        var m1 = '&gt;&lt;/script"&gt;';
        var m2 = '&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>';

        //upravuje format u <html lang="en">
        var n1 = '&lt;html lang="en""&gt;';
        var n2 = '<span class="hljs-tag"><span class="language-javascript">&lt;<span class="hljs-name">html</span> <span class="hljs-attr">lang</span>=<span class="hljs-string">"en"</span>&gt;</span>';

        //upravuje format u <meta charset="utf-8">
        var o1 = '&lt;meta charset="utf-8""&gt;';
        var o2 = '<span class="hljs-tag"><span class="language-javascript">&lt;<span class="hljs-name">meta</span> <span class="hljs-attr">charset</span>=<span class="hljs-string">"utf-8"</span>&gt;</span>';
        
        var p1 = '&lt;script&gt';
        var p2 = '<span class="hljs-tag">&lt;<span class="hljs-name">script</span>&gt;</span>';

        var q1 = '&lt;/script&gt;';
        var q2 = '<span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>';

        var r1 = '&lt;/body&gt;';
        var r2 = '<span class="hljs-tag">&lt;/<span class="hljs-name">body</span>&gt;</span>';

        var s1 = '""';
        var s2 = '"';

        

        tableSrc = tableSrc.replaceAll(b1, b2);
        tableSrc = tableSrc.replaceAll(c1, c2);
       // tableSrc = tableSrc.replaceAll(d1, d2);
        tableSrc = tableSrc.replaceAll(e1, e2);
        tableSrc = tableSrc.replaceAll(f1, f2);
        tableSrc = tableSrc.replaceAll(g1, g2);
        tableSrc = tableSrc.replaceAll(h1, h2);
        tableSrc = tableSrc.replaceAll(i1, i2);
        tableSrc = tableSrc.replaceAll(j1, j2);
        tableSrc = tableSrc.replaceAll(k1, k2);
        tableSrc = tableSrc.replaceAll(l1, l2);
        tableSrc = tableSrc.replaceAll(m1, m2);
        tableSrc = tableSrc.replaceAll(n1, n2);
        tableSrc = tableSrc.replaceAll(o1, o2);
        tableSrc = tableSrc.replaceAll(p1, p2);
        tableSrc = tableSrc.replaceAll(q1, q2);
        tableSrc = tableSrc.replaceAll(r1, r2);
        tableSrc = tableSrc.replaceAll(s1, s2);

        console.log(tableSrc);
        return(tableSrc);

    }


    //pokud neni nastaven rowType, pak se kod vykresluje cernobile
    //to se detekuje zde
    detekujZdaJsonNemaRowType(poleRowType){

        var obarviText = false;
        for (let i = 0; i < poleRowType.length; i++) {
            var rowType = poleRowType[i];
            if(rowType != undefined){
                obarviText = true;
                break;
            }
        }

        return(obarviText);

    }


    nahradDataPodleTd(tableSrc, seznamRadkuPuvodni, seznamRowNum){

        var tableSrcArr = tableSrc.split('\n');

        //vytvori kopii dat
        var tableSrcArrNew = [...tableSrcArr];

        for (let i = 0; i < seznamRowNum.length; i++) {
            var rowNumTd = seznamRowNum[i];
            var jednaSeOTd = this.detekujZdaSeJednaOTd(rowNumTd);
            console.log(rowNumTd);
            //obcas nalezne spatne radky, takze dal pokracuje jen , kdyz se opravdu jedna o <td>24</td>
            if(jednaSeOTd == true){
                var indexRadkuTD = tableSrcArr.indexOf(rowNumTd);
                var radekCim = seznamRadkuPuvodni[i];
                var indexRadku = indexRadkuTD + 2;

                //nahradi prislusny radek
                tableSrcArrNew[indexRadku] = radekCim;
            }
        }

        return(tableSrcArrNew);
    }


    //pokud se jedna napr o '<td>24</td>', pak vrati true
    detekujZdaSeJednaOTd(rowNumTd){

        var strBezTd = rowNumTd;
        strBezTd = strBezTd.replace('</td>', '');
        strBezTd = strBezTd.replace('<td>', '');

        var jednaSeOTd = false;

        if(strBezTd.length < rowNumTd.length){
            //pokud se jedna o cislo, pak se jedna o pozadovany string
            jednaSeOTd = Number(parseFloat(strBezTd)) == strBezTd;
        }

        return(jednaSeOTd);

    }


    //prevede pole na string (appendString)
    prevedTableSrcArrNaTableSrc(tableSrcArrOpt){

        var tableSrcOpt = '';

        for (let i = 0; i < tableSrcArrOpt.length; i++) {
            var radek = tableSrcArrOpt[i];
            tableSrcOpt = tableSrcOpt + radek + '\n';
        }

        console.log(tableSrcArrOpt);
      
        return(tableSrcOpt);

    }
    


    //detekuje, zda bylo stisknuto tlacitko, pokud stisknuto neni, pak se pouzije highlight
    //pokud stisknuto je, pouzije se puvodni tableSrc, s tim, ze se prepise pouze css
    //o tom, zda bylo stisknuto tlacitko 'option' se rozhoduje zde
    detekujZdaByloStisknutoButtonOption(idButt){

        var idButtBezIndRadku;
        var idButtSpl;
        var optionByloStisknuto = false;

        if(idButt != undefined){
            idButtSpl = idButt.split('_');
            if(idButtSpl.length == 2){
                idButtBezIndRadku = idButtSpl[0];
                if(idButtBezIndRadku == 'butt'){
                    optionByloStisknuto = true;
                }
            }
        }

        //pokud se jedna o combobox uvnitr css
        if(idButt == '.comboSrc'){
            optionByloStisknuto = true;
        }
        
        return(optionByloStisknuto);

    }


    vytvorTabulku(obarveneHtml){

        var poleText;

        var poleTagBool = this.vratPoleRowNumTypeText('tagBool', undefined);
        var poleText = this.vratPoleRowNumTypeText('text', poleTagBool);
        var poleCislo = this.vratPoleRowNumTypeText('rowNum', undefined);
        var poleRowType = this.vratPoleRowNumTypeText('rowType', undefined);

        //aby mohl obarvit radky html, uklada 'poleText' a 'poleRowType' jako clenskou promennou
        this.poleText = poleText;
        this.poleRowType = poleRowType;

        //uchova data, aby je mohl tisknout na novou stranku 
        poleTextSrc = poleText;
        poleRowTypeSrc = poleRowType;

        //modifikuje pole text, jelikoz se nespravne zobrazuje <script src
        var poleTextModif = new modifikujPoleText(poleText);
        poleText = poleTextModif.getPoleTextNew(poleText);


        var tableStr = this.vytvorTabulkuData(obarveneHtml, poleTagBool, poleText, poleCislo, poleRowType);
        
        console.log(tableStr);
        return(tableStr);

    }


    vytvorTabulkuData(obarveneHtml, poleTagBool, poleText, poleCislo, poleRowType){

        var pocetRadku = this.obj.rows.length;
        var tableStr = '';

        if(obarveneHtml != undefined){
            
            // tohle nevim proc tu je ??
            this.priradIndexyRadkuKObarvenemuHtml(obarveneHtml, poleText);

            //nahradi data za obarveny text
            //console.log(poleText);
            poleText = obarveneHtml;
            //console.log(poleText);
        }
        

        //opravi poleText o uvozovky
        poleText = this.doplnUvozovkyKeVsemRadkum(poleText, poleTagBool);
        var polePerentStyle = this.vratPoleParentTag(poleText, '<style>');


        //prida css-style a tim obarvi text
        this.doplnCssStyle(poleText, poleRowType);  //zatim neuplne funguje


        for (let i = 0; i < pocetRadku; i++) {

            var cislo = poleCislo[i];
            var text = poleText[i];
            var tagBool = poleTagBool[i];
            var parentStyle = polePerentStyle[i];
            var rowType = poleRowType[i];
         
            var tdStr = '';
            var trStr = '<tr class="tableSrc"';

            if(i == pocetRadku-1){
                trStr = trStr + ' id="lastRow"';
            }
            
            var trStr = trStr + '>' + '\n';


            //ziska format pro vytvoreni <span>
            var formatObj = this.obj.rows[i].data.format;
            
            
            //postupne pridava data do 'this.formatData'
            if(formatObj != undefined){

                if(formatObj[2] == undefined){
                    formatObj.push({'cislo':cislo});
                }
                this.formatData.push(formatObj);
            }
            
            
            //console.log(text);
            //opravi chybu
            text = text.replace('</span>">', '</span>');
            text = text.replace('<span" class', '<span class');
            text = text.replace('<div" class', '<div class');
            text = text.replace('</p">', '</p>');

            var tdStr = this.vratRadekTabulky(cislo, text, tagBool, parentStyle, rowType);
            //console.log(tdStr);
            //console.log(tdStr);
            
            trStr = trStr + tdStr + '</tr>' + '\n';
            tableStr = tableStr + trStr;

        }

        //indikuje, ze skoncil s pridavanim tabulky
        tableStr = tableStr + '<div id="end">ble</div>\n';

      
        //console.log(tableStr);
        return(tableStr);

    }


    //css-styl se obarvuje tady
    doplnCssStyle(poleText, poleRowType){

        console.log(poleText);
        //console.log(poleRowType);

        var vnitrekCssBoolArr = this.ziskejBoolArrMeziZavorkami(poleRowType, poleText);
        var vnitrekCssText = this.ziskejVnitrekCss(poleText, vnitrekCssBoolArr);
        var vnitrekCssObarvene = this.doplnCssKVnitrku(vnitrekCssText);
        var poleTextNew = this.nahradPoleTextSCss(vnitrekCssObarvene, poleText);

       // console.log(poleTextNew);

    }


    nahradPoleTextSCss(vnitrekCssObarvene, poleText){

        for (let i = 0; i < vnitrekCssObarvene.length; i++) {
            var radek = vnitrekCssObarvene[i];
            if(radek != false){
                poleText[i] = radek;
            }
        }

        return(poleText);

    }


    doplnCssKVnitrku(vnitrekCssText){

        var vnitrekCssObarvene = [];

        for (let i = 0; i < vnitrekCssText.length; i++) {
            
            var vnitrekRadek = vnitrekCssText[i];
            var vnitrekRadekNew;

            if(vnitrekRadek != false){
                vnitrekRadekNew = this.obarviCssRadek(vnitrekRadek);
            }
            else{
                vnitrekRadekNew = false;    
            }

            vnitrekCssObarvene.push(vnitrekRadekNew);

        }

        return(vnitrekCssObarvene);

    }


    //obarvi css mezi zavorkami
    obarviCssRadek(radekCss){
        
        var klicHodnota = radekCss.split(':');
        var klic = klicHodnota[0];
        var hodnota = klicHodnota[1];

        var klicSpl = klic.split('<select class');
        klic = klicSpl[0];
 
        klic = this.vymazNepotrebneZnakyCss(klic);
        hodnota = this.vymazNepotrebneZnakyCss(hodnota);

        var klicSpan = '<span class="cssKey">' + klic + '</span>';
        var hodnotaSpan = '<span class="cssValue">' + hodnota + '</span>';
        var dvojtecka = '<span class="dvojTecka">:</span>'; 

        var radekNew = radekCss.replace(klic, klicSpan);
        radekNew = radekNew.replace(hodnota, hodnotaSpan);
        radekNew = radekNew.replace(':', dvojtecka);

        return(radekNew);

    }


    vymazNepotrebneZnakyCss(text){

        var textNew = text;

        if(textNew != undefined){
            textNew = textNew.replaceAll('</td>', '');
            textNew = textNew.replaceAll('<td>', '');
            textNew = textNew.replaceAll('&emsp;', '');
            textNew = textNew.trim();
        }
        
        return(textNew);    

    }


    ziskejVnitrekCss(poleText, vnitrekCssBoolArr){

        var vnitrekCssText = [];
        for (let i = 0; i < vnitrekCssBoolArr.length; i++) {
            var cssBool = vnitrekCssBoolArr[i];
            var radek = false;

            if(cssBool == true){
                radek = poleText[i];
            }

            vnitrekCssText.push(radek);
        }

        return(vnitrekCssText);

    }


    //ziska pole boolean, kde je true u tech radku css, ktere jsou mezi zavorkami '{' a  '}'
    ziskejBoolArrMeziZavorkami(poleRowType, poleText){

        var zavZav = false;
        var zavOt = false;
        var jednaSeOVnitrekZav = false;
        var vnitrekCssBoolArr = [];

        for (let i = 0; i < poleRowType.length; i++) {
            
            var rowType = poleRowType[i];
            var radek = poleText[i];

            jednaSeOVnitrekZav = false;
            
            if(rowType == 'css'){   

                if(zavOt == true){
                    zavZav = this.detekujSubstr(radek, '}');
                    
                    if(zavZav == true){
                        zavOt = false
                    }
                    else{
                        jednaSeOVnitrekZav = true;
                    }

                }


                if(zavOt == false){
                    zavOt = this.detekujSubstr(radek, '{');
                }
                
            }

            vnitrekCssBoolArr.push(jednaSeOVnitrekZav);
            
        }

        return(vnitrekCssBoolArr);

    }


    //aby mohl prepsat data obarvenymi radky, je potreba, aby mel prirazená spravna cisla k radkum 'obarveneHtml'
    priradIndexyRadkuKObarvenemuHtml(obarveneHtml, poleText){

        //console.log(obarveneHtml);
        //console.log(poleText);

        for (let i = 0; i < obarveneHtml.length; i++) {
            var barevnyRadek = obarveneHtml[i];
            this.redukujBarevnyRadek(barevnyRadek);
        }

    }


    //odebere nepotrebne tagy z radku, tak aby tam zbyl jen text
    redukujBarevnyRadek(radek){

        var radekSpl = radek.split('</span>');
        for (let iSpl1 = 0; iSpl1 < radekSpl.length; iSpl1++) {
            var radekSpl1 = radekSpl[iSpl1];
           // console.log(radekSpl1);

            //if(radekSpl != undefined){

               // var radekSpl2 = radekSpl.split('<span class=');
               /// for (let iSpl2 = 0; iSpl2 < radekSpl.length; iSpl2++) {
               //     console.log(radekSpl2);
               // }
                
        }

       // console.log('-----------------');
    }

   // }


    doplnUvozovkyKeVsemRadkum(poleText, poleTagBool){

        var textNewArr = [];

        for (let i = 0; i < poleText.length; i++) {
            var text = poleText[i];
            var tagBool = poleTagBool[i];
            var indRovnitka = text.indexOf('=');
            var textNew = text;

            if(tagBool == true){
                if(indRovnitka > -1){
                    textNew = this.doplnUvozovkyKTagum(text);
                }
            }

            textNewArr.push(textNew);

        }

        console.log(textNewArr);
        return(textNewArr);

    }


    doplnUvozovkyKTagum(radek){

        var radekBezZav = radek.replace('>', ' _');
        var radekSpl = radekBezZav.split(' ');
        var radekNew = '';

        for (let i = 0; i < radekSpl.length; i++) {
            var text = radekSpl[i];
            var textNew = this.doplnUvozovky(text);
            radekNew = radekNew + textNew;
            if(i < radekSpl.length-1){
                radekNew = radekNew + ' ';
            }
        }

        if(radekSpl.length > 0){
            radekNew = radekNew + '>';
        }

        radekNew = radekNew.replace('" _', '">');
        radekNew = radekNew.replace('>>', '">');
        radekNew = radekNew.replace('&gt;">', '&gt;');
        radekNew = radekNew.replace('<span" class=', '<span class=');
        radekNew = radekNew.replace('<div" class=', '<div class=');
        radekNew = radekNew.replace('p" </span>', 'p </span>');


        return(radekNew);

    }


    doplnUvozovky(text){

        var textNew = text
        var textSpl = text.split('=')
        if(textSpl.length == 2){
            textSpl[1] = '"' + textSpl[1] + '"';
            textNew = textSpl[0] + '=' + textSpl[1];
        }

        return(textNew);

    }



    vratPoleParentTag(poleText, tag){

        var parentTagStyle;
        var tagStart = tag;
        var tagEnd = tag.replace('<', '</')
        var parentStylePole = []

        var parentTagStyle = false;
        var parentEndTagStyle = false;
        
        for (let i = 0; i < poleText.length; i++) {

            var text = poleText[i];

            //pokud jiz nalezl <style>, pak detekuje konec </style> zde
            if(parentTagStyle == true){
                parentEndTagStyle = this.detekujSubstr(text, tagEnd);
                if(parentEndTagStyle == true){
                    parentTagStyle = false;
                }
            }

            //pokud jeste nenalezl <style>, pak ho detekuje zde
            if(parentTagStyle == false){
                parentTagStyle = this.detekujSubstr(text, tagStart);
            }

            parentStylePole.push(parentTagStyle);

        }

        return(parentStylePole);

    }


    vratPoleRowNumTypeText(child, poleTagBool){

        var pocetRadku = this.obj.rows.length;

        var polePolozek = [];
        var polozka;

        for (let i = 0; i < pocetRadku; i++) {

            if(child == 'rowNum'){
                polozka = this.obj.rows[i].data.rowNum;
            };
            if(child == 'tagBool'){
                var polozkaType = this.obj.rows[i].data.type;
                if(polozkaType == 'noCombo'){
                    polozka = true;     //tagBool - ktery vraci
                };
                if(polozkaType == 'combo'){
                    polozka = false;    //tagBool - ktery vraci
                };
            };
            if(child == 'text'){
                var tagBool = poleTagBool[i];   //tagBool - ktery prijima jako parametr
                if(tagBool == true){
                    polozka = this.obj.rows[i].data.text;
                };
                if(tagBool == false){
                    polozka = this.vratComboStr(i);
                }
            }
            if(child == 'rowType'){
                polozka = this.obj.rows[i].data.rowType;
            };

            polePolozek.push(polozka);

        }

        return(polePolozek);

    }


    detekujSubstr(text, substr){

        var radekObsahujeSubstr = false;
        var ind = text.indexOf(substr)
        if(ind > -1){
            radekObsahujeSubstr = true;
        }

        return(radekObsahujeSubstr);

    }


    vratComboStr(iR){

        //console.log(this.obj);
        //console.log(iR);
        var selectOptionDelka = this.obj.rows[iR].data.text.length;
        var comboStr = '<td>\n';

        //console.log(selectOptionDelka);
        //console.log(obj.rows[iR].data.text);

        //console.log(selectOptionDelka);
        for (let i = 0; i < selectOptionDelka; i++) {

            var keyValueJsonText =  this.obj.rows[iR].data.text[i];
            var klic = Object.keys(keyValueJsonText)[0];
            //console.log(Object.keys(keyValueJsonText));

            if(klic == 'text'){

                var textStr = '    ' + this.vratTextStr(keyValueJsonText);
                textStr = this.vratTdBunky(textStr, false, false, true, '');
                comboStr = comboStr + textStr;
                //console.log(textStr);
            
            }

            if(klic == 'selectOption'){
               
                //zjisti pocet comboboxu
                var pocetSelectId = this.obj.rows[iR].data.text[i].selectOption.length / 2
                //console.log(pocetSelectId);

                for (let iSel = 0; iSel < pocetSelectId; iSel++) {
                    var selectOptionAll = '    ' + this.vratSelectOptionStr(iR, i, iSel);
                    comboStr = comboStr + selectOptionAll;

                    //console.log(iR);
                    //console.log(comboStr);
                    //console.log(selectOptionAll);
                }
            
            }
            
            //console.log(klic);
            comboStr = comboStr + '\n';
            
        }

        comboStr = comboStr + '</td>';

        //console.log('comboStr comboStr comboStr comboStr comboStr comboStr comboStr comboStr comboStr comboStr');
        //console.log(comboStr);
        //console.log('comboStr comboStr comboStr comboStr comboStr comboStr comboStr comboStr comboStr comboStr');

        return(comboStr)

    }


    vratTextStr(keyValueJsonText){

        var TextStr = keyValueJsonText.text;
        TextStr = this.vratTdBunky(TextStr, false, true, '');

        return(TextStr);

    }


    vratSelectOptionStr(iR, i, iSel){

        var iSel0 = iSel * 2 + 0;
        var iSel1 = iSel * 2 + 1;

        //iteruje pro vsechny 'selectOption'
        var keyValueJsonSelect = this.obj.rows[iR].data.text[i].selectOption[iSel0];
        var keyValueJsonOption = this.obj.rows[iR].data.text[i].selectOption[iSel1];

        //console.log(keyValueJsonSelect);
        //console.log(keyValueJsonOption);

        var selectStr =  this.vratSelectOptionStrItem(keyValueJsonSelect);
        var selectOption = this.vratSelectOptionStrItem(keyValueJsonOption);
        var selectOptionAll;

        selectOptionAll = selectStr + '\n' + selectOption;
        selectOptionAll = selectOptionAll + '    </select>';

        return(selectOptionAll);

    }


    vratSelectOptionStrItem(keyValueJson){

        var klic = Object.keys(keyValueJson)[0];
        var comboStr;
        
        //console.log(keyValueJson);
        //console.log(klic);

        if(klic == 'select'){
            var kliceAHodnoty = this.vratKliceAHodnoty(keyValueJson.select);
            comboStr = this.vratSelect(kliceAHodnoty);
        }
        
        if(klic == 'option'){
            var kliceAHodnoty = this.vratKliceAHodnoty(keyValueJson.option);
            comboStr = this.vratOption(kliceAHodnoty);
        }

        return(comboStr);
        
    }


    //vrati jednoradkovy string obsahujici klice a hodnoty
    vratSelect(kliceAHodnoty){

        var selectStr = '<select class="comboSrc"';
        var klice = kliceAHodnoty.klice;
        var hodnoty = kliceAHodnoty.hodnoty;

        for (let i = 0; i < klice.length; i++) {

            var klic = klice[i];
            var hodnota = hodnoty[i];
            var klicHodnota = ' ' + klic + '="' + hodnota + '"';

            selectStr = selectStr + klicHodnota;

        }

        selectStr = selectStr + '>';

        return(selectStr);

    }


    //vrati viceRadkovy string obsahujici klice a hodnoty
    vratOption(kliceAHodnoty){

        var klice = kliceAHodnoty.klice;
        var hodnoty = kliceAHodnoty.hodnoty;

        var optionStr = '';

        for (let i = 0; i < klice.length; i++) {

            var klic = klice[i];
            var hodnota = hodnoty[i];

            var optionRadek = '    ' + this.vratOptionRadek(klic, hodnota);
            optionStr = optionStr + optionRadek + '\n';

        }

        return(optionStr);

    }


    vratOptionRadek(klic, hodnota){

        var optionRadek = '    <option ' + klic + '="' + hodnota + '">' + hodnota + '</option>'

        return(optionRadek);

    }


    //nacte json a vrati klice a hodnoty
    vratKliceAHodnoty(keyValueJson){

        //console.log(keyValueJson);

        var poleKlicu = []
        var poleHodnot = []

        var delka = keyValueJson.length;

        for (let i = 0; i < delka; i++) {

            var klicHodnota = keyValueJson[i];
            var klic = Object.keys(klicHodnota)[0];
            var hodnota = Object.values(klicHodnota)[0];

            poleKlicu.push(klic);
            poleHodnot.push(hodnota);

        }

        //console.log(poleKlicu);
        //console.log(poleHodnot);

        var kliceAHodnoty = {
                                'klice' : poleKlicu,
                                'hodnoty' : poleHodnot
                            }

        return(kliceAHodnoty);

    }


    vratRadekTabulky(cislo, text, tagBool, parentStyle, rowType){

        var breakPointBool = true;
        

        var tdCislo;
        var tdButt;
        var tdText;
        var tdStr = '';
   
        var tdBreakPoint;
        var butt;

        
        if(tagBool == true){
            butt = '';
        }

        if(tagBool == false){
            butt = '<button class="buttCss" id="butt_' + cislo + '">option</button>';
        }


        //vytvori sloupec (jednoho radku) pro breakpoint
        if(breakPointBool == true){

            //prida breakpoint, jen, kdyz se jedna o javascript (zatim)
            if(rowType == 'js'){
                tdBreakPoint = '<td><button class="breakPointButt" id="breakPointButt_' + cislo + '"></button></td>';
            }
            else{
                tdBreakPoint = '<td></td>'
            }
            
        }

        //vytvori sloupce (jednoho radku) standartni tabulky
        tdCislo = this.vratTdBunky(cislo, true, tagBool, parentStyle, '');
        tdButt = this.vratTdBunky(butt, true, tagBool, parentStyle, '');
        tdText = this.vratTdBunky(text, true, tagBool, parentStyle, rowType);
        //console.log(text);
        //console.log(tdText);


        //prebarvuje text, pokud existuje pole 'cimNahradArrJs', resp. neni undefined
        if(rowType == 'js'){
            if(cimNahradArrJs != undefined){
                tdText = this.ziskejObarvenyTdText(tdText, rowType);
            }
        }

        /*
        if(rowType == 'html'){

            if(cimNahradArrHtml != undefined){
                tdText = this.ziskejObarvenyTdText(tdText, rowType);
            }
        }
        */

        //obarvi text
        //tdText = this.obarviText(tdText);
        //console.log(tdText);

        //prida tlacitka na breakpoint - prida append string
        if(breakPointBool == true){
            tdStr = tdStr + tdBreakPoint + '\n'; 
        }


        //prida sloupce (jednoho radku) standartni tabulky 
        //tdStr = tdStr + tdButt + '\n';
        tdStr = tdStr + tdCislo + '\n';
        tdStr = tdStr + tdButt + '\n';
        tdStr = tdStr + tdText + '\n';
        //console.log(tdText);

        //nekde tam je chyba:
        tdStr = tdStr.replace('<td><td>', '<td>');
        tdStr = tdStr.replace('</td></td>', '</td>');


        //dodatecne pridava id
        //tdStr = this.pridejIdDoTd(tdStr);
        
        return(tdStr);

    }


    //vyhleda data z poli 'coNahradArrJs' a 'cimNahradArrJs' a vrati obarveny tdText
    //metoda je spoustena pouze kdyz se jedna o javascript
    ziskejObarvenyTdText(tdText, rowType){

        var textZTdText = this.ziskejTextZTdTextu(tdText);
        var tdTextNew = tdText;

        if(rowType == 'js'){

            var indVPoliCo = coNahradArrJs.indexOf(textZTdText);
            if(indVPoliCo > -1){

                var nahradCoRadek = coNahradArrJs[indVPoliCo];
                var nahradCimRadek = cimNahradArrJs[indVPoliCo];

                var tdTextNew = tdText.replace(nahradCoRadek, nahradCimRadek);
                
            
            }
        
        }

        /*
        if(rowType == 'html'){

            var indVPoliCo = coNahradArrHtml.indexOf(textZTdText);

            console.log('textZTdText = ' + textZTdText)
            console.log(indVPoliCo)
            console.log(coNahradArrHtml)
            console.log(cimNahradArrHtml)

            //var obarviHtml = new obarviRadkyHtml(coNahradArrHtml, cimNahradArrHtml);


        }
        */

        return(tdTextNew);
       
    }


    //je treba upracit data pro 'coNahradArrHtml'
    ziskejDataProCoNahradArrHtml(coNahradArrHtml){

        for (let i = 0; i < coNahradArrHtml.length; i++) {
            var radek = coNahradArrHtml[i];
            //var radekNew = 

        }


    }

    //metoda je spoustena, kdyz se prebarvuje text a jedna se o javascript
    ziskejTextZTdTextu(tdText){

        var text = tdText.replace('<td class="rowType-js">', '');
        text = text.replace('</td>', '');
        text = text.replaceAll('&emsp;', '')
        text = text.trim();

        return(text);

    }


    //rozpoznava, zda pole obsahuje <select>
    detekujZdaPoleObsahujeSelect(tdSplit){

        var jednaSeOSelect = false;

        for (let i = 0; i < tdSplit.length; i++) {

            var radek = tdSplit[i];
            var indSel = radek.indexOf('<select');
            if(indSel > -1){
                jednaSeOSelect = true;
                break;
            }

        } 

        return(jednaSeOSelect);

    }


    //prida do 'tdText' '<span ...>' cimz text obarvi
    obarviText(tdText){

        var tdTextNew;
        tdTextNew = tdText.replace('&lt;', '<span style="color:blue;font-weight:bold">&lt;</span>')

        return(tdTextNew);

    }



    //metoda je dodelavana dodatecne
    //aby nevznikla chyba, tak se string (jako celenk) znovu nacita a dopisuje se znovu id
    pridejIdDoTd(tdStr){

        var tdSplit = tdStr.split('\n');
        var jednaSeOSelect = this.detekujZdaPoleObsahujeSelect(tdSplit);

        //console.log(tdSplit);

        /*
        // tohle je potreba zmenit
        if(tdSplit.length > 4){
            jednaSeOSelect = true;
        }
        else{
            jednaSeOSelect = false;
        }
        */

        var tdRow = tdSplit[0];
        var tdButt = tdSplit[1];
        

        var id = this.ziskejId(tdRow);
        var idText = this.vratIdAtribut('text', id);
        var idRow = this.vratIdAtribut('row', id);
        var tdRowNew = tdRow.replace('<td>', idRow);
        
        var tdStrNew = '';
        var tdTextNew;
        var idButt;

        // pokud se jedna o radek bez comboboxu
        if(jednaSeOSelect == false){
            var tdText = tdSplit[2];
            tdTextNew = tdText.replace('<td>', idText);
            idButt = this.vratIdAtribut('noButt', id);
        }
        else{  //pokud se jedna o radek s comboboxem
            var tdSelect = tdStr.split('<td><button');
            var tdText = tdSelect[1];
            idButt = this.vratIdAtribut('tdButt', id);
            idText = idText + '\n';
            tdTextNew = tdText.replace('<td>\n', idText);

            //v tdTextNew je chyba, oprava je zde
            var tdTextNewSpl = tdTextNew.split('\n')
            var tdTextNew2 = '';
            for (let i = 1; i < tdTextNewSpl.length; i++) {
                tdTextNew2 = tdTextNew2 + tdTextNewSpl[i];
            }
            tdTextNew = tdTextNew2;

        }

        var tdButtNew = tdButt.replace('<td>', idButt);

        if(this.cislovaniZapnuto == true){
            tdStrNew = tdStrNew + tdRowNew + '\n';
        }
        
        tdStrNew = tdStrNew + tdButtNew + '\n';
        tdStrNew = tdStrNew + tdTextNew + '\n';
      
        return(tdStrNew);

    }




    ziskejId(tdRow){

        var id;   
        
        id = tdRow.replace('<td>', '')
        id = id.replace('</td>', '')
        id = id.trim();

        return(id);

    }


    vratIdAtribut(attr, id){

        var IdAttr = '<td id="' + attr + '_' + id + '">'

        return(IdAttr)

    }


    vratTdBunky(textOrig, tdBool, tagBool, parentStyle, rowType){

        var pocetMezer;

        if(parentStyle == true){
            pocetMezer = this.vratPocetMezerStyle(textOrig);
        }
        else{
            pocetMezer = this.vratPocetMezer(textOrig, rowType);
        }

        console.log(textOrig);
        var text = this.vytvorMezeryNaZacatkuRadku(textOrig, pocetMezer);
        console.log(text);

       

        //nahradi '<' a '>' , tak aby mohl zobrazit radky v html jako zdrojak
        if(tagBool == true){

            //pokud obsahuje span s hljs, je treba ignorovat '<' a '>' u prislusnych span
            var obsahujeHljs = this.detekujSubstr(text, 'hljs-');

            if(obsahujeHljs == true){
                //aby nemohl nahrazovat '<' a '>' u 'span' , nahradi je s '$|;' a '$||;'
                text = this.vratTextAbyNebyloMozneNahrazovatTagySpan(text);
            }

            text = text.replaceAll('<', '&lt;');
            text = text.replaceAll('>', '&gt;');

           
            //vrati '$|;' a '$||;' nazpet
            text = text.replaceAll('$|;', '<');
            text = text.replaceAll('$||;', '>');

        }


        var radekTable;

        if(tdBool == true){
            if(rowType == ''){
                radekTable = '    <td>' + text + '</td>'
            }
            else{

                if(rowType == 'js'){

                    //upravi radky uvnitr js scriptu
                    text = this.upravOdsazeniUvnitrScriptu(text);
                    
                }

                //je treba odebrat tag, tak aby se tag nepridaval dovnitr
                text = text.replace('</td>', '');
                text = text.replace('<td>', '');

                //dopise rowType, aby věděl jakou barvou ma zvyraznit background
                radekTable = '    <td class="rowType-' + rowType + '">' + text + '</td>'

            }
            
        }
        else {
            radekTable = text;
        }

        //console.log(radekTable);
        return(radekTable);

    }


    //vrati text, tak aby tag <span> byl zachovan, tj, aby '<' nebo '>' se nenahrazovali
    vratTextAbyNebyloMozneNahrazovatTagySpan(text){

        var textNew = text.replaceAll('""', '"');
        textNew = textNew.replaceAll('<span ', '$|;span ');
        textNew = textNew.replaceAll('</span>', '$|;/span$||;');

        if(text != textNew){

            var hljsArr = this.vratVsechnyHljs(textNew);
            for (let i = 0; i < hljsArr.length; i++) {
                var hljs = hljsArr[i];
                var hljs1 = hljs + '">';
                var hljs2 = hljs + '"$||;';

                textNew = textNew.replaceAll(hljs1, hljs2);
            }

            /*
            console.log('AAAAAAAAAAAAAAAAAAAA');
            console.log(text);
            console.log(textNew);
            console.log('AAAAAAAAAAAAAAAAAAAA');
            */

        }

        return(textNew);
    }


    //vrati pole obsahujici vsechny 'hljs-??' 
    vratVsechnyHljs(text){

        var hljsArr = [];

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        var textSpanSpl = text.split('class');

        for (let i = 0; i < textSpanSpl.length; i++) {
            var splRadek = textSpanSpl[i];
            var hljsSpl = splRadek.split('>');
            var hljs = hljsSpl[0];
            var hljsClear = hljs.replaceAll('=', '');
            hljsClear = hljsClear.replaceAll('"', '');

            hljsArr.push(hljsClear);
        }

        var uniqueHljs = hljsArr.filter(onlyUnique);

        return(uniqueHljs);
        
        
    }



    //vraci pocet mezer pokud je mezi tagy <script> a </script>
    vratPocetMezerProScript(text){

        var textSpl = text.split('');
        var pocetMezer = 0;

        for (let i = 0; i < textSpl.length; i++) {
            var znak = textSpl[i];
            if(znak != '_'){
                pocetMezer = i;
                break;
            }
        }

        return(pocetMezer);

    }


    //pocet mezer je symbolizovan pomoci '_', jelikož json ma problem zobrazovat tabulator ve stringu
    vratPocetMezer(text, rowType){

        console.log(rowType);

        var pocetMezer = 0;
        var pridejMez = 0;
  
        if (typeof text === 'string'){

            //detekuje zda obsahuje vubec nejakou mezeru
            var ind = -1;
            ind = text.indexOf("_<");

            if(ind == -1){

                if(rowType == 'html'){
                    ind = this.ziskejIndOfJinehoNezZav(text);
                }

            }

            if(ind > -1){
                var podtrzitka = text.substring(0, ind+1);
                pocetMezer = podtrzitka.length;
            }

        }

        return(pocetMezer);
        
    }


    //ziska indexOf pokud je tam jiny znak nez '_<'
    ziskejIndOfJinehoNezZav(text){

        const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

        for (let i = 0; i < alphabet.length; i++) {

            var pismeno = alphabet[i];
            var dvojiceVelka = '_' + pismeno;
            var dvojiceMala = pismeno.toLowerCase();

            var indV = text.indexOf(dvojiceVelka);
            var indM = text.indexOf(dvojiceMala);
            var ind = Math.max(indV, indM);

            /*
            if(text == '___F'){
                console.log(text);
                console.log(dvojiceVelka);
                console.log(indV);
                console.log(indM);
                console.log(ind);
            }
            */

            if(ind > -1){
                break;
            }
  

        }
        
        return(ind);

    }


    //upravi odazeni uvnitr scriptu
    upravOdsazeniUvnitrScriptu(text){

        //zrejme je tam asi nekde chyba, opravuji zde
        text = text.replace(';&gt;', ';');

        //jelikoz se jedna o javascriptove radky, je potreba dopocitat pocet Mezer jinak
        var pocetMezer = this.vratPocetMezerProScript(text);

        //znovu se opravi text o mezery
        text = this.vytvorMezeryNaZacatkuRadku(text, pocetMezer);

        //pokud je uvnitr <script> </script>, pak jeste o jednu uroven zanorit
        var jednaSeOScriptTagradek = this.detekujSubstr(text, 'script&gt');

        //pokud se nejedna o jednaSeOScriptTagradek, apk se jedna o telo <scriptu>
        if(jednaSeOScriptTagradek == false){
            text = '&emsp;' + text;
        }

        text = this.opravUvozovkyUvnitrScriptu(text);
        

        return(text);

    }


    //upravi uvozovky uvnitr scriptu
    opravUvozovkyUvnitrScriptu(text){

        var textNew = text.replaceAll('"', '');
        textNew = textNew.replaceAll('%', '"');

        return(textNew);

    }


    //vytvoriMezeryNaZacatkuRadku
    vytvorMezeryNaZacatkuRadku(textOrig, pocetMezer){

        var textBezpodtrzitka;
        var text = '';

        console.log(textOrig);
        console.log(pocetMezer);

        //vytvori mezery
        for (let i = 0; i < pocetMezer; i++) {
            text = text + '&emsp;';
        }

        //ziska text bez podtrzitka
        if (typeof textOrig === 'string'){
            textOrig = textOrig.trim();
            textBezpodtrzitka = textOrig.substring(pocetMezer, textOrig.length);
        }
        else {
            textBezpodtrzitka = textOrig;
        }
    
        //slouci mezery s textem bez podtrzitka
        text = text + textBezpodtrzitka;

        return(text)

    }


    vratPocetMezerStyle(text){

        var pocetMezer = 0;

        if (typeof text === 'string'){
            text = text.trim();
            var textSpl = text.split("");
            var jednaSeOPodtrziko = false;

            if(textSpl[0] == '_'){
                jednaSeOPodtrziko = true;
            }

            for (let i = 1; i < textSpl.length; i++) {
                if(jednaSeOPodtrziko == true){
                    var znak = textSpl[i];
                    if(znak == '_'){
                        jednaSeOPodtrziko = true;
                    }
                    else{
                        jednaSeOPodtrziko = false;
                        pocetMezer = i;
                        break;
                    }
                }
            }
        }

        return(pocetMezer);

    }

}


// jelikoz obcas highlighter nefunguje, zde se vytvari modifikovane poleText
// vysledna obarvena tabulka se pak slozi z vice obarvenych tableStr
class modifikujPoleText {

    constructor(poleText){

        console.log(poleText);

        var nastavBoolTextPole = this.nastavPoleBoolText();
        var poleBoolText = this.ziskejPoleBoolText(poleText, nastavBoolTextPole);
        this.poleTextNew = this.vratPoleTextNew(poleText, poleBoolText);

        var poleTextNewWindow = new vytvorpPoleTextProPredaniNaDalsiStranku(this.poleTextNew);
        
    }


    getPoleTextNew(){
        console.log(this.poleTextNew);
        return(this.poleTextNew);
    }


    //zde nastavuje seznam radku, ktere bude nastavovat v 'poleBoolText' jako false
    nastavPoleBoolText(){

        var nastavBoolTextPole = [];
        nastavBoolTextPole.push('<script src=');

        return(nastavBoolTextPole);

    }


    //ziska pole boolean, kde true je u radku, ktere se budou generovat
    ziskejPoleBoolText(poleText, nastavBoolTextPole){

        var poleBoolText = [];

        for (let i = 0; i < poleText.length; i++) {
            var radek = poleText[i];
            var boolText = this.detekujZdaRadekJeVPoliNastavboolText(radek, nastavBoolTextPole);
            poleBoolText.push(boolText);
        }

        return(poleBoolText);

    }


    detekujZdaRadekJeVPoliNastavboolText(radek, nastavBoolTextPole){

        var boolText = true;

        for (let i = 0; i < nastavBoolTextPole.length; i++) {
            var radekNastav = nastavBoolTextPole[i];
            var ind = radek.indexOf(radekNastav);
            if(ind > -1){
                boolText = false;
                break;
            }
        }

        console.log(boolText);
        return(boolText);

    }


    vratPoleTextNew(poleText, poleBoolText){

        var poleTextNew = [];
        
        for (let i = 0; i < poleText.length; i++) {
            var boolText = poleBoolText[i];
            var text = poleText[i];
            if(boolText == false){
                text = "";
            }

            poleTextNew.push(text);
        }

        return(poleTextNew);

    }

}


//upravi poleText, tak aby data mohl predat na dalsi stranku
//jsou zde tedy data pro nove okno 
class vytvorpPoleTextProPredaniNaDalsiStranku{

    constructor(poleText){

        //$('#poleText').append(this.poleTextNew);
        
        this.upravPoleTextData(poleText);

    }

    upravPoleTextData(poleText){

        var poleTextNew = [];
        var strPoleText = ''

        for (let i = 0; i < poleText.length; i++) {
            var radekNew = poleText[i];
            radekNew = radekNew.replace('<', '&lt;');
            radekNew = radekNew.replace('>', '&gt;');

            strPoleText = strPoleText + radekNew + '\n';

            
        }

        $('.poleTextInput').remove();
        //$('#poleText').append('<input type="text" class="poleTextInput" value="'+ strPoleText +'"></input>');

    }

}


//kdyz se stiskne tlacitko, je potreba prevzit css-style z puvodniho 'tableSrc'
//barevny styl textu se prekopiruje z puvodnich dat, jen css styl se zmeni
class prevezmiPuvodniCss {

    constructor(seznamRadkuPuvodni, seznamRowNum, vratCss){

        //pripravi prazdna data
        this.seznamRadkuCss = [];
        this.seznamRowNumCss = [];
        
        //pokud je 'seznamRadkuPuvodni==undefined', pak vraci vsechny radky
        if(seznamRadkuPuvodni == undefined){
            
            var tableSrcArr = tableSrc.split('\n');
            var poleIndexuTr = this.ziskejPoleIndexuTr(tableSrcArr);
            var indexyRadku = this.ziskejIndexyRadku(tableSrcArr, poleIndexuTr);
            this.seznamRadkuPuvodni = this.ziskejTableSrcArr2(tableSrcArr, indexyRadku, 0);
            this.seznamRowNum = this.ziskejTableSrcArr2(tableSrcArr, indexyRadku, -2);
      
            //je-li pozadovano, vratit pouze css-radky, vraci se zde
            if(vratCss == true){
                //vytvori rovnou tridni data, takze nic nevraci
                this.vratRadkyPouzeCss(this.seznamRadkuPuvodni, this.seznamRowNum);
            }

        }
        else{   //pokud je 'seznamRadkuPuvodni!=undefined', pak vraci pouze radky s css

            //vytvori rovnou tridni data, takze nic nevraci
            this.vratRadkyPouzeCss(seznamRadkuPuvodni, seznamRowNum);

        }

    }


    getSeznamRadkuPuvodni(){
        return(this.seznamRadkuPuvodni);
    }

    getSeznamRowNum(){
        return(this.seznamRowNum);
    }


    //vraci, pokud je 'vratPouzeCss==true'
    getSeznamRadkuCss(){
        console.log(this.seznamRadkuCss);
        return(this.seznamRadkuCss);
    }

    getSeznamRowNumCss(){
        return(this.seznamRowNumCss);
    }


    //vytvori rovnou tridni data, takze nic nevraci
    vratRadkyPouzeCss(seznamRadkuAll, seznamRowNum){

        for (let i = 0; i < seznamRadkuAll.length; i++) {
            
            var radek = seznamRadkuAll[i];
            var radekJeCss = this.detekujZdaNaRadkuJeSlovo(radek, '<td class=\"rowType-css\">');

            if(radekJeCss == true){
                var rowNum = seznamRowNum[i];

                this.seznamRadkuCss.push(radek);
                this.seznamRowNumCss.push(rowNum);

            }

        }
    }


    nahradDataPodleTd(tableSrcArr, seznamRadkuPuvodni, seznamRowNum){

        //vytvori kopii dat
        var tableSrcArrNew = [...tableSrcArr];

        for (let i = 0; i < seznamRowNum.length; i++) {
            var rowNumTd = seznamRowNum[i];
            var jednaSeOTd = this.detekujZdaSeJednaOTd(rowNumTd);

            //obcas nalezne spatne radky, takze dal pokracuje jen , kdyz se opravdu jedna o <td>24</td>
            if(jednaSeOTd == true){
                var indexRadkuTD = tableSrcArr.indexOf(rowNumTd);
                var radekCim = seznamRadkuPuvodni[i];
                var indexRadku = indexRadkuTD + 2;

                //nahradi prislusny radek
                tableSrcArrNew[indexRadku] = radekCim;
            }
        }

        return(tableSrcArrNew);
    }


    //pokud se jedna napr o '<td>24</td>', pak vrati true
    detekujZdaSeJednaOTd(rowNumTd){

        var strBezTd = rowNumTd;
        strBezTd = strBezTd.replace('</td>', '');
        strBezTd = strBezTd.replace('<td>', '');

        var jednaSeOTd = false;

        if(strBezTd.length < rowNumTd.length){
            //pokud se jedna o cislo, pak se jedna o pozadovany string
            jednaSeOTd = Number(parseFloat(strBezTd)) === strBezTd;
        }

        return(jednaSeOTd);

    }


    //odebere radky css, jelikoz ty se prebarvi jinde
    odeberRadkyCss(tableSrcArrPotr){
        
        var radkyBezCss = [];
        for (let i = 0; i < tableSrcArrPotr.length; i++) {
            
            var radek = tableSrcArrPotr[i];
            var radekJeCss = this.detekujZdaNaRadkuJeSlovo(radek, 'rowType-css');
            if(radekJeCss == true){
              //  radek = '';
            }

            radkyBezCss.push(radek);
            
        }

        console.log(radkyBezCss);
        return(radkyBezCss);

    }


    ziskejIndexyRadku(tableSrcArr, poleIndexuTr){

        var indexyRadku = [];

        for (let i = 0; i < tableSrcArr.length; i++) {
            if(poleIndexuTr.includes(i+1) == true){
                var indexRadku = i;
                indexyRadku.push(indexRadku);
            }
        }

        return(indexyRadku);

    }


    ziskejIndexyRadku(tableSrcArr, poleIndexuTr){

        var indexyRadku = [];

        for (let i = 0; i < tableSrcArr.length; i++) {
            if(poleIndexuTr.includes(i+1) == true){
                var indexRadku = i;
                indexyRadku.push(indexRadku);
            }
        }

        return(indexyRadku);

    }


    //ziska jen potrebne radky, ty ktere jsou jako '', ty pak neprepisuje (aby nahradil originalni data)
    ziskejTableSrcArr2(tableSrcArr, indexyRadku, posun){
      
        var seznamRadku = [];

        for (let i = 0; i < indexyRadku.length; i++) {
            
            var indexRadku = indexyRadku[i] + posun;
            var radek = tableSrcArr[indexRadku];

            seznamRadku.push(radek);
            
        }

        
        return(seznamRadku);

    }

    //YYY
    ziskejPoleIndexuTr(tableSrcArr){

        var indexRadkuTr;
        var poleIndexuTr = [];

        for (let i = 0; i < tableSrcArr.length; i++) {
            var radek = tableSrcArr[i];
            if(radek == '</tr>'){
                indexRadkuTr = i;
                if(tableSrcArr[indexRadkuTr-1] == '</td>'){
                    indexRadkuTr = i-1;
                }
                poleIndexuTr.push(indexRadkuTr);
            }
        }

        return(poleIndexuTr)

    }


    detekujZdaNaRadkuJeSlovo(radka, substr){

        var slovoJeNaRadku;
        var indSubstr = radka.indexOf(substr);
        if(indSubstr > -1){
            slovoJeNaRadku = true;
        }
        else{
            slovoJeNaRadku = false;
        }

        return(slovoJeNaRadku);

    }

}


//obarvuje css
class vratObarveneRadky{


    constructor(seznamRadkuPuvodni, seznamRowNum, vratCss, tableSrcLok){
        
        //vychozi, pokud neprobehne uspesne, pak vrati puvodni data
        this.tableSrcLokNew = tableSrcLok;

        //u style je rozhazene odsazeni, opravuje se zde
        this.odsazeni;
        this.odsazeniArr = [];
       
        //kdyz puvodni seznam neni definovan, pak to znamena, ze se jedna o prvni spusteni
        //takze se zde prebarvuje pouze css, jelikoz zbytek se prebarvuje pomoci highlight
        if(seznamRadkuPuvodni == undefined){

            var dataCss = new prevezmiPuvodniCss(seznamRadkuPuvodni, seznamRowNum, vratCss);
            var seznamRadkuCss = dataCss.getSeznamRadkuCss();
            
            //pokud neni css, pak neni co odsazovat
            if(seznamRadkuCss.length > 0){

                var seznamRowNumCss = dataCss.getSeznamRowNumCss();
                var obarveneRadkyCss = this.ziskejDataCss(seznamRadkuCss, seznamRowNumCss, vratCss);
                var obarveneRadkyCssOdsazene = this.odsadObarveneRadky(obarveneRadkyCss, this.odsazeniArr);

                //prepise data  
                seznamRadkuPuvodni = obarveneRadkyCssOdsazene;    
                seznamRowNum = seznamRowNumCss; 

            }
            
        }

        if(seznamRowNum != undefined){

            var tableSrcLokNew = this.obarviDataSPouzitimPredchozichDat(tableSrcLok, seznamRadkuPuvodni, seznamRowNum);
            var zarovnejRadkyOption = new zarovnejRadekKdeJeButton(tableSrcLokNew);
            this.tableSrcLokNew = zarovnejRadkyOption.getTableSrcNew();
        
        }
        
    }


    getTableSrc(){
        return(this.tableSrcLokNew);
    }


    odsadObarveneRadky(obarveneRadkyCss, odsazeniArr){

        console.log(obarveneRadkyCss);
        console.log(odsazeniArr);

        var obarveneRadkyCssOdsazene = [];

        for (let i = 0; i < obarveneRadkyCss.length; i++) {

            var radekObarveny = obarveneRadkyCss[i];
            var pocetOdsazeni = odsazeniArr[i];
            
            var radekBezEmsp = radekObarveny.replaceAll('&emsp;', '');
            var odsazeniStr = this.ziskejOdsazeniEmsp(pocetOdsazeni);

            var radekOdsazeny = radekBezEmsp.replace('<td class=\"rowType-css\">', '<td class=\"rowType-css\">'+ odsazeniStr);
            obarveneRadkyCssOdsazene.push(radekOdsazeny);
            
        }   

        return(obarveneRadkyCssOdsazene);

    }


    //vrati string emsp zpusobujici odsazeni
    ziskejOdsazeniEmsp(pocetOdsazeni){

        var odsazeniStr = '';

        for (let i = 0; i < pocetOdsazeni; i++) {
            odsazeniStr = odsazeniStr + '&emsp;';
        }

        return(odsazeniStr);
    }


    //bud obarvuje s pouzitim predchozich dat, nebo jen css
    //kod je stejny pro obe varianty, rozdil je jen v delkach poli (kdyz obarvuju css, pak pole ma jen css)
    obarviDataSPouzitimPredchozichDat(tableSrcLok, seznamRadkuPuvodni, seznamRowNum){

        //kopiruje css-style, tak aby byl nastaven, jako pred tim, nez se stisklo option
        var tableSrcArrOpt = this.nahradDataPodleTd(tableSrcLok, seznamRadkuPuvodni, seznamRowNum)
        var tableSrcLokNew = this.prevedTableSrcArrNaTableSrc(tableSrcArrOpt);

        return(tableSrcLokNew);
    }


    nahradDataPodleTd(tableSrc, seznamRadkuPuvodni, seznamRowNum){

        var tableSrcArr = tableSrc.split('\n');

        //vytvori kopii dat
        var tableSrcArrNew = [...tableSrcArr];

        for (let i = 0; i < seznamRowNum.length; i++) {
            var rowNumTd = seznamRowNum[i];
            var jednaSeOTd = this.detekujZdaSeJednaOTd(rowNumTd);
        
            //obcas nalezne spatne radky, takze dal pokracuje jen , kdyz se opravdu jedna o <td>24</td>
            if(jednaSeOTd == true){
                var indexRadkuTD = tableSrcArr.indexOf(rowNumTd);
                var radekCim = seznamRadkuPuvodni[i];
                if(radekCim != ''){ //prazdnym radkem nelze nahrazovat, prisel bych o styl originalniho
                    var indexRadku = indexRadkuTD + 2;

                    //nahradi prislusny radek
                    tableSrcArrNew[indexRadku] = radekCim;
                }
            }
        }

        return(tableSrcArrNew);
    }


    //pokud se jedna napr o '<td>24</td>', pak vrati true
    detekujZdaSeJednaOTd(rowNumTd){

        var strBezTd = rowNumTd.trim();
        strBezTd = strBezTd.replace('</td>', '');
        strBezTd = strBezTd.replace('<td>', '');

        var jednaSeOTd = false;

        if(strBezTd.length < rowNumTd.length){
            //pokud se jedna o cislo, pak se jedna o pozadovany string
            jednaSeOTd = Number(parseFloat(strBezTd)) == strBezTd;
        }


        return(jednaSeOTd);

    }


    //sekce mezi <style> je nejak rozhazena, nize se zarovnavaji radky
    zarovnejRadky(){

    }


     //prevede pole na string (appendString)
     prevedTableSrcArrNaTableSrc(tableSrcArrOpt){

        var tableSrcOpt = '';

        for (let i = 0; i < tableSrcArrOpt.length; i++) {
            var radek = tableSrcArrOpt[i];
            tableSrcOpt = tableSrcOpt + radek + '\n';
        }
      
        return(tableSrcOpt);

    }

    
    //ziska data z tridy prevezmiPuvodniCss
    ziskejDataCss(seznamRadkuPuvodni, seznamRowNum, vratCss){

        var dataCss = new prevezmiPuvodniCss(seznamRadkuPuvodni, seznamRowNum, vratCss);
        var seznamRadkuCss = dataCss.getSeznamRadkuCss();
        var seznamRowNumCss = dataCss.getSeznamRowNumCss();
   
        var poleCoNahrad = this.vytvorPoleCoNahraditCss(seznamRadkuCss);
        var flagyRadku = this.vratFlagyRadku(poleCoNahrad);
        var obarveneRadkyCss;
        //console.log(flagyRadku);

        if(flagyRadku.length > 0){
            obarveneRadkyCss = this.obarviJednotliveRadkyCss(poleCoNahrad, flagyRadku);
        }

        
        
        console.log(obarveneRadkyCss);
        return(obarveneRadkyCss);

    }


    //podle flagu se obarvi jednotlive radky
    obarviJednotliveRadkyCss(poleCoNahrad, flagyRadku){

        var poleCimNahrad = [];

        for (let i = 0; i < poleCoNahrad.length; i++) {

            var radek = poleCoNahrad[i];
            var flag = flagyRadku[i];
            var flagPredchozi;
            var radekNew = '';
            
            if( i > 0 ){
                flagPredchozi = flagyRadku[i-1];
            }

            if(flag == '<style>'){

                //ziska novy radek
                radekNew = this.vratCimNahraditStyle(radek);

                //dopocita pocet odsazeni, tak aby dokazal odsazovat i ostatni radky
                var pocetOdsazeni = this.dopocitejPocetOdsazeniZeStyle(radek);

                //nastavi odsazeni pro aktualni radek
                this.odsazeni = pocetOdsazeni;

            }


            if(flag == 'zavorka'){

                //ziska novy radek
                radekNew = this.vratCimNahraditZavorky(radek);

                //dopocita rozdil odsazeni oproti predchozimu radku
                var rozdilOdsazeni = this.dopocitejRozdilOdsazeniDleZavorky(radek, flagPredchozi);

                //nastavi odsazeni pro aktualni radek
                this.odsazeni = this.odsazeni + rozdilOdsazeni;

            }


            if(flag == 'atr'){
                //ziska novy radek
                radekNew = this.vratCimNahraditAtr(radek);

                //dopocita odsazeni
                var rozdilOdsazeni = this.dopocitejRozdilOdsazeniDleAtr(flagPredchozi);

                //nastavi odsazeni pro aktualni radek
                this.odsazeni = this.odsazeni + rozdilOdsazeni;

            }

            poleCimNahrad.push(radekNew);
            this.odsazeniArr.push(this.odsazeni);

        }

        console.log(poleCimNahrad);
        return(poleCimNahrad);

    }


    //vrati cim nahradit - style
    vratCimNahraditStyle(radek){

        //nize vraci upraveny radek
        var radekNew = this.odeberZRadkuTd(radek);
        radekNew = radekNew.replace('&lt;style&gt;', '<span class="hljs-tag">&lt;<span class="hljs-name">style</span>&gt;</span>');
        radekNew = radekNew.replace('&lt;/style&gt;', '<span class="hljs-tag">&lt;/<span class="hljs-name">style</span>&gt;</span>');
        var radekTd = this.pridejKRadkuTd(radekNew);

        return(radekTd);

    }


    //vrati cim nahradit - zavorka
    vratCimNahraditZavorky(radek){

        //nize vraci upraveny radek
        var radekNew = this.odeberZRadkuTd(radek);
        radekNew = radekNew.replaceAll('&emsp;','');
        radekNew = radekNew.replace('{','<span class="cssZavorka">{</span>');
        radekNew = radekNew.replace('}','<span class="cssZavorka">}</span>');
        var radekTd = this.pridejKRadkuTd(radekNew);

        return(radekTd);

    }


    //vrati cim nahradit - atr
    vratCimNahraditAtr(radek){
       
        //nize vraci upraveny radek
        var radekBezTd = this.odeberZRadkuTd(radek); 
        var radekTecka = radekBezTd.replace('.', '<span class="cssTecka">.</span>');
        var radekNew = '<span class="atrr">' + radekTecka + '</span>';
        var radekTd = this.pridejKRadkuTd(radekNew);
    
        return(radekTd);

    }


    odeberZRadkuTd(radek){
        var radekBezTd = radek.replace('<td class="rowType-css">', '');
        radekBezTd = radekBezTd.replace('</td>', '');

        return(radekBezTd);
    }


    pridejKRadkuTd(radek){
        var radekTd = '<td class="rowType-css">' + radek + '</td>';
        return(radekTd);
    }


    //dopocita pocet odsazeni z radku <style>
    dopocitejPocetOdsazeniZeStyle(radek){

        var radekEmsp = radek;
        radekEmsp = radekEmsp.replace('<td class="rowType-css">', '');
        radekEmsp = radekEmsp.replace('&lt;style&gt;','');
        radekEmsp = radekEmsp.replace('&lt;/style&gt;','');
        radekEmsp = radekEmsp.replace('</td>','');

        //ziska pocet odsazeni
        var pocetOdsazeni = this.occurrences(radekEmsp,'&emsp;');
        
        return(pocetOdsazeni);
        
    }


    //dopocita rozdil oidsazeni, pokud je zavorka
    dopocitejRozdilOdsazeniDleZavorky(radek, flagPredchozi){

        var rozdilOdsazeni = 0;

        if(flagPredchozi != 'zavorka'){

            var zavOt = this.detekujZdaNaRadkuJeSlovo(radek, '{');
            var zavZav = this.detekujZdaNaRadkuJeSlovo(radek, '}');

            if(zavOt == true){
                rozdilOdsazeni = 1;
            }

            if(zavZav == true){
                rozdilOdsazeni = 0;
            }   

        } 

        return(rozdilOdsazeni);

    }


    //dopocita rozdil odsazeni, pokud se jedna o atribut
    dopocitejRozdilOdsazeniDleAtr(flagPredchozi){

        var rozdilOdsazeni = 0;  //nap. kdyz je za predchozim style, tj. za '}'

        if(flagPredchozi == '<style>'){
            rozdilOdsazeni = 1;
        }

        return(rozdilOdsazeni);

    }


    //vrati flagy k radku
    vratFlagyRadku(seznamRadkuCss){

        var flagyRadku = [];

        for (let i = 0; i < seznamRadkuCss.length; i++) {
            var radek = seznamRadkuCss[i];
            var flagNaRadku = this.ziskejCoJeNaRadku(radek);
            
            flagyRadku.push(flagNaRadku);
        }
        console.log(flagyRadku);
        return(flagyRadku);

    }


    //vrati flag k danemu radku, aby vedel co ma nahrazovat
    ziskejCoJeNaRadku(radek){
    
        var radekObsahujeZavorku;
        var radekObsahujeStyle;
        var radekObsahujeAtrr;

        radekObsahujeZavorku = this.detekujZdaNaRadkuJeSlovo(radek, '}');
        radekObsahujeStyle = this.detekujZdaNaRadkuJeSlovo(radek, 'style');
        radekObsahujeAtrr = this.detekujZdaNaRadkuJeSlovo(radek, '{');

        var radekObsahuje = '';

        if(radekObsahujeZavorku == true){
            radekObsahuje = 'zavorka';
        }
        if(radekObsahujeStyle == true){
            radekObsahuje = '<style>';
        }
        if(radekObsahujeAtrr == true){
            radekObsahuje = 'atr';
        }
        console.log(radekObsahuje);
        return(radekObsahuje);

    }


    //vytvori pole, aby vedel jake substringy bude nahrazovat
    vytvorPoleCoNahraditCss(poleText){

        var poleCoNahrad = [];
      
        for (let i = 0; i < poleText.length; i++) {
            
            var radek = '';
        
            radek = poleText[i];
            
            //vymaze nepotrebny subString
            //radek = radek.replaceAll('&emsp;', '');
            //radek = radek.replaceAll('_', '');
            radek = radek.replaceAll('\n', '');
            

            poleCoNahrad.push(radek);
        }

        return(poleCoNahrad);

    }



    detekujZdaNaRadkuJeSlovo(radka, substr){

        var slovoJeNaRadku;
        var indSubstr = radka.indexOf(substr);
        if(indSubstr > -1){
            slovoJeNaRadku = true;
        }
        else{
            slovoJeNaRadku = false;
        }

        return(slovoJeNaRadku);

    }


    occurrences(string, subString, allowOverlapping) {

        string += "";
        subString += "";
        if (subString.length <= 0) return (string.length + 1);
    
        var n = 0,
            pos = 0,
            step = allowOverlapping ? 1 : subString.length;
    
        while (true) {
            pos = string.indexOf(subString, pos);
            if (pos >= 0) {
                ++n;
                pos += step;
            } else break;
        }
        return n;
    }

    
}


//zarovna text, na tom radku, kde je button
//zarovnava se az nakonec, tj az po tom, co je na butt kliknuto, nebo i kdyz na button kliknuto neni
class zarovnejRadekKdeJeButton{

    constructor(tableSrcLok1){
        
        //console.log(tableSrcLok1);
        this.tableSrcNew = this.vytvorTableSrcSOdsazenymiRadky(tableSrcLok1);
        //this.tableSrcNew = 'tableSrcLok1';
    }


    getTableSrcNew(){
        return(this.tableSrcNew);
    }


    vytvorTableSrcSOdsazenymiRadky(tableSrcLok){

        var tableSrcArrTr = tableSrcLok.split('</tr>');
        var hodnotyVeSloupciButton = this.ziskejDataZeSloupceTabulky(4, tableSrcArrTr);
        var indexyRadkuOptionArr = this.ziskejIndexyVsechRadkuSButtOption(hodnotyVeSloupciButton);

        var indexyNejblizsichButtBezOpt = this.vratIndexyVyssichRadku(indexyRadkuOptionArr, hodnotyVeSloupciButton);
        var odsazeniButtOptArr = this.vratNadrazeneOdsazeniProVsechnyButtOpt(indexyNejblizsichButtBezOpt, tableSrcArrTr);

        var tableSrcArrTrNew = this.odsadVsechnyButtOpt(tableSrcArrTr, indexyRadkuOptionArr, odsazeniButtOptArr);
        var tableSrcNew = this.vytvorTableSrcNew(tableSrcArrTrNew);

        return(tableSrcNew);

    }


    //znovu vytvori tableSrcNew, s jiz odsazenymi radky
    vytvorTableSrcNew(tableSrcArrTrNew){

        var tableSrcNew = '';

        for (let i = 0; i < tableSrcArrTrNew.length; i++) {
            var radek = tableSrcArrTrNew[i] + '</tr>';
            tableSrcNew = tableSrcNew + radek + '\n';
        }

        return(tableSrcNew);

    }


    //odsadi vsechny radky kodu, u kterych je tlacitko option
    odsadVsechnyButtOpt(tableSrcArrTr, indexyRadkuOptionArr, odsazeniButtOptArr){

        var tableSrcArrTrNew = [...tableSrcArrTr];

        for (let i = 0; i < indexyRadkuOptionArr.length; i++) {

            var indRadkuButt = indexyRadkuOptionArr[i];
            var odsNejbl = odsazeniButtOptArr[i];
            var velikostOdsazeni = odsNejbl + 1;

            var radekButtOptNew = this.odsadPrislusnyRadekSButtOpt(tableSrcArrTr, indRadkuButt, velikostOdsazeni);
            tableSrcArrTrNew[indRadkuButt] = radekButtOptNew;
        }

        return(tableSrcArrTrNew);

    }


    odsadPrislusnyRadekSButtOpt(tableSrcArrTr, indRadkuButt, velikostOdsazeni){

        var radekButtOpt = tableSrcArrTr[indRadkuButt];
        var odsazeniStr = this.vytvorEmspOdsazeniStr(velikostOdsazeni);
        var radekButtOptNew = radekButtOpt.replace('<td class="rowType-css">', '<td class="rowType-css">' +  odsazeniStr)

        return(radekButtOptNew);

    }


    vytvorEmspOdsazeniStr(pocetOdsazeni){

        var odsazeniStr = '';

        for (let i = 0; i < pocetOdsazeni; i++) {
            odsazeniStr = odsazeniStr + '&emsp;';
        }

        return(odsazeniStr);

    }


    //vrati pole vsech odsazeni, ktere nalezi nejblizsimu radku k danemu buttonu
    vratNadrazeneOdsazeniProVsechnyButtOpt(indexyNejblizsichButtBezOpt, tableSrcArrTr){

        var odsazeniButtOptArr = [];

        for (let i = 0; i < indexyNejblizsichButtBezOpt.length; i++) {

            var ind = indexyNejblizsichButtBezOpt[i];
            var velikostOdsazeni = this.zjistiVelikostOdsazeniDleIndexuRadku(tableSrcArrTr, ind);

            odsazeniButtOptArr.push(velikostOdsazeni);

        }

        return(odsazeniButtOptArr);

    }


    //zjisti odsazeni, resp. pocet &emsp; pro dany radek, resp. radek nad tlacitkem option
    zjistiVelikostOdsazeniDleIndexuRadku(tableSrcArrTr, indexRadku){

        var radek = tableSrcArrTr[indexRadku];
        var radekTd = radek.split('</td>');
        var indRowTypeCss = this.ziskejIndexObsahujiciSubstr(radekTd, '<td class=\"rowType-css\"')
        var radekRowTypeCss = radekTd[indRowTypeCss];
        var pocetEmsp = this.occurrences(radekRowTypeCss,'&emsp;');
        
        return(pocetEmsp);

    }


    ziskejDataZeSloupceTabulky(sloupecTab, tableSrcArrTr){

        var hodnotyVeSloupciTabulky = [];

        for (let i = 0; i < tableSrcArrTr.length; i++) {
            var radek = tableSrcArrTr[i];
            var radekTd = radek.split('\n');
            var hodnota = radekTd[sloupecTab];

            hodnotyVeSloupciTabulky.push(hodnota);
        }

        return(hodnotyVeSloupciTabulky);

    }


    ziskejIndexyVsechRadkuSButtOption(hodnotyVeSloupciButton){

        var indexyRadkuOptionArr = []

        for (let i = 0; i < hodnotyVeSloupciButton.length; i++) {
            var radek = hodnotyVeSloupciButton[i];

            if(radek != undefined){
                var radekObsahujeOption = this.detekujZdaNaRadkuJeSlovo(radek, '<td><button class=\"buttCss\"');
                if(radekObsahujeOption == true){
                    indexyRadkuOptionArr.push(i);
                }
            }
           
        }

        return(indexyRadkuOptionArr);

    }


    //vrati pole vsech indexu, tech radku, ktere jsou nejblizsi vyssi a bez butt 'option'
    vratIndexyVyssichRadku(indexyRadkuOptionArr, hodnotyVeSloupciButton){

        var indexyNejblizsichButtBezOpt = []

        for (let i = 0; i < indexyRadkuOptionArr.length; i++) {

            var indexOption = indexyRadkuOptionArr[i];
            var nejblizsiBezOpt = this.ziskejNejblizsiRadekBezOption(indexOption, hodnotyVeSloupciButton);
            indexyNejblizsichButtBezOpt.push(nejblizsiBezOpt);

        }

        return(indexyNejblizsichButtBezOpt);

    }


    //vrati nejblizsi vyssi radek, ktery neni button option
    ziskejNejblizsiRadekBezOption(indAktualni, hodnotyVeSloupciButton){

        var nejblizsiRadekVyssiBezOpt = -1;

        for (let i = indAktualni; i > 0; i--) {
            var radek = hodnotyVeSloupciButton[i];
            var radekObsahujeOption = this.detekujZdaNaRadkuJeSlovo(radek, '<td><button class=\"buttCss\"');
            if(radekObsahujeOption == false){
                nejblizsiRadekVyssiBezOpt = i;
                break;
            }
        }

        return(nejblizsiRadekVyssiBezOpt);

    }


    detekujZdaNaRadkuJeSlovo(radka, substr){

        var slovoJeNaRadku;
        var indSubstr = radka.indexOf(substr);
        if(indSubstr > -1){
            slovoJeNaRadku = true;
        }
        else{
            slovoJeNaRadku = false;
        }

        return(slovoJeNaRadku);

    }


    ziskejIndexObsahujiciSubstr(arr, substr){

        var indexRadku = -1;

        for (let i = 0; i < arr.length; i++) {

            var radek = arr[i];
            var radekObsahujeSubstr = this.detekujZdaNaRadkuJeSlovo(radek, substr);
            if(radekObsahujeSubstr == true){
                indexRadku = i;
            }

        }

        return(indexRadku);

    }


    occurrences(string, subString, allowOverlapping) {

        string += "";
        subString += "";
        if (subString.length <= 0) return (string.length + 1);
    
        var n = 0,
            pos = 0,
            step = allowOverlapping ? 1 : subString.length;
    
        while (true) {
            pos = string.indexOf(subString, pos);
            if (pos >= 0) {
                ++n;
                pos += step;
            } else break;
        }
        return n;
    }


}


//trida odesilajici data pro prebarveni textu
//data se odesilaji do scriptu 'scriptColorText.js'
class odesliDataProObarveniTextu{

    constructor(tableSrc, formatData){

        //ziska data obsahujici pouze texty (+indexy radku) z "tableSrc"
        // - barvy se naastavuji globalne - pro vsechny texty
        var tableSrcSpl = tableSrc.split('\n');
        textSrcData = this.ziskejDataProObarveniTextu(tableSrcSpl);
        this.vlozDataDoInputBoxu(textSrcData, 'inputForColoring');

        //ziska data, kde se specifikuje jakou barvu budou mit jednotlive texty
        // - data se nastavuji individualne - jen pro texty, ktere jsou v prislusnem jsonu, napr. "borderStyle.json", uzel "format"
        // nasdtavuji se tedy barvy textu pro kazdy json zvlast
        var formatDataArr = this.prevedJsonNaPole(formatData);
        this.vlozDataDoInputBoxu(formatDataArr, 'inputForColoringIndividualText');

    }


    //ma nejaky problem dostat data do inputboxu - nevim jaky
    //tak prevadim data z Jsonu do pole
    prevedJsonNaPole(formatData){

        var formatDataArr = []

        for (let i = 0; i < formatData.length; i++) {
            var formatDataRadek = formatData[i];

            var cislo = formatDataRadek[formatDataRadek.length-1].cislo;

            for (let iR = 0; iR < formatDataRadek.length-1; iR++) {
                var polozka = formatDataRadek[iR];

                var span = polozka.span;
                var spanSoused = polozka.spanNeighbors;
                var spanStyle = polozka.style;

                var spanSousedStyle = [];

                spanSousedStyle.push(cislo);
                spanSousedStyle.push(span);
                spanSousedStyle.push(spanSoused);
                spanSousedStyle.push(spanStyle);

                formatDataArr.push(spanSousedStyle);

            }

        }

        return(formatDataArr);

    }


    vlozDataDoInputBoxu(textSrcData, classInput){

        var textSrcDataStr = JSON.stringify(textSrcData);
        
        textSrcDataStr = textSrcDataStr.replaceAll('"', '\'');
        textSrcDataStr = textSrcDataStr.replaceAll('&', '&\\');
   
        $('.'+ classInput).remove();
        $('#srcForColoring').append('<input type="text" class="' + classInput + '" value="'+ textSrcDataStr +'"></input>');
       
    }


    //vypise pole ansi ze stringu
    test(text){

        var textArr = text.split('');
        var asciStr = '';

        for (let i = 0; i < textArr.length; i++) {

            var znak = textArr[i];
            var anscii = znak.charCodeAt(0);
            
            asciStr = asciStr + anscii + ' ' 
        
        }

        console.log(asciStr);

    }

        
    //radky se obarvuji dodatecne
    //abych kod nerozbil (neobarveny zdrojak), posilaji se data zdrojaku do jineho scriptu
    //tam se radky obarvi a posle se nazpet sem
    //aby se neodesilala cela tabulka odeslou se jen radky textu, ty se ziskavaji v teto metode
    ziskejDataProObarveniTextu(tableSrcSpl){

        //var tableSrcSpl = tableSrc.split('\n');
        var textSrcData = []
        
        //console.log(tableSrcSpl);
        var indexyRadkuText = this.vratIndexyRadkuSTextem(tableSrcSpl);

        for (let i = 0; i < indexyRadkuText.length; i++) {
            var indexRadkuText = indexyRadkuText[i];
            var indexRadkuTdCislo = indexRadkuText - 2

            var radekText = tableSrcSpl[indexRadkuText];
            radekText = this.ziskejObsahRadku(radekText);

            var radekTdCislo = tableSrcSpl[indexRadkuTdCislo];
            radekTdCislo = this.ziskejObsahRadku(radekTdCislo);
            radekTdCislo = parseInt(radekTdCislo);

            //aby posilal data co nejusporneji pres inputBox, zapisou se data do pole
            var textTableArrRadek = [];

            textTableArrRadek.push(indexRadkuTdCislo);
            textTableArrRadek.push(radekTdCislo);
            textTableArrRadek.push(radekText);

            textSrcData.push(textTableArrRadek);                
                
        }

        return(textSrcData);
        
    }


    //odmaze z radku '<td>' a '</td>'
    ziskejObsahRadku(radek){

        var radekNew = radek.replace('</td>', '');
        radekNew = radekNew.replace('<td>', '');
        radekNew = radekNew.trim();

        return(radekNew);

    }


    vratIndexyRadkuSTextem(tableSrcSpl){

        var indexyRadkuText = []
        indexyRadkuTr = [];

        for (let i = 0; i < tableSrcSpl.length; i++) {

            var radek = tableSrcSpl[i];
            if(radek == "</tr>"){
                indexyRadkuText.push(i-1);

                //ulozi indexy radku '</tr>' primo do globalnich dat
                //tak aby je pouzil v okamziku, kdy bude aktualizovat data (z "cernobileho" textu na "barevny")
                indexyRadkuTr.push(i);
            }

        }

        return(indexyRadkuText);

    }

}


//trida ktera prijme data z 'scriptColorText.js'
//a prepise jiz existujici "cernobily" text zdrojaku
class prijmiAPrepisBarevnyText{

    constructor(coloredTextData){

        coloredTextData = coloredTextData.replaceAll('\'', '"');
        coloredTextData = coloredTextData.replaceAll('&\\', '&');

        var coloredTextDataObj = JSON.parse(coloredTextData);
        var tableSrcArr = tableSrc.split('\n');

        var tableSrcArrNew = this.ziskejTableSrcArrNew(coloredTextDataObj, tableSrcArr);


        //aktualizuje data
        this.vlozBarevnyZdrojakDoHtml(tableSrcArrNew);
        
    }


    vlozBarevnyZdrojakDoHtml(tableSrcArrNew){

        var tableSrcNew = ''

        for (let i = 0; i < tableSrcArrNew.length; i++){

            var radek = tableSrcArrNew[i];
            tableSrcNew = tableSrcNew + radek + '\n';

        }

        //odebere "cernobily" zdrojak
        $("tr.tableSrc").remove();

        //prida barevny zdrojak
        //$("table").append(tableSrcNew);

    }


    ziskejTableSrcArrNew(coloredTextDataObj, tableSrcArr){

        var tableSrcArrNew = tableSrcArr;
        for (let i = 0; i < coloredTextDataObj.length; i++){

            var indexRadku = coloredTextDataObj[i][0] + 2;
            var radekNew = coloredTextDataObj[i][2];

            //prepise radek
            var radekOrig = textSrcData[i][2];
            var radekTableSrc = tableSrcArr[indexRadku];
            var radekTableSrcNew = radekTableSrc.replace(radekOrig, radekNew);

            tableSrcArrNew[indexRadku] = radekTableSrcNew;
       
        }

        return(tableSrcArrNew);

    }

}


//vykresli stranku jako nahled
class vytvorStrankuSrc{

    constructor(obj, jsonProAktualizaciRadku){
         
        this.obj = obj;
        this.jsonProAktualizaciRadku = jsonProAktualizaciRadku;

        var textArr = this.ziskejTextArr();
        
        //odebere nepotrebne tagy
        textArr = this.vymazNepotrebneTagy(textArr);

        //ziska true/false pokud je v <style>
        var radkyStyle = this.vratStyleTrue(textArr);

        //doplni do selektoru '.right-half'
        textArr = this.opravSelectory(textArr, radkyStyle);
        
        this.pridejAppendStr(textArr);
        
    }


    //neni treba ukladat tagy jako napr <html>, <head> a proto jsou nepotrebne tagy mazany
    vymazNepotrebneTagy(textArr){

        var textArrNew = [];

        for (let i = 0; i < textArr.length; i++){

            var radekJePotrebny = true;
            var radek = textArr[i];
            
            //otestuje, zda radek obsahuje nezadouci tagy
            radekJePotrebny = this.detekujZdaJeRadekPotrebny(radek, '<!DOCTYPE html>', radekJePotrebny);
            radekJePotrebny = this.detekujZdaJeRadekPotrebny(radek, '<html>', radekJePotrebny);
            radekJePotrebny = this.detekujZdaJeRadekPotrebny(radek, '<head>', radekJePotrebny);
            radekJePotrebny = this.detekujZdaJeRadekPotrebny(radek, '</head>', radekJePotrebny);
            radekJePotrebny = this.detekujZdaJeRadekPotrebny(radek, '<body>', radekJePotrebny);
            radekJePotrebny = this.detekujZdaJeRadekPotrebny(radek, '</body>', radekJePotrebny);
            radekJePotrebny = this.detekujZdaJeRadekPotrebny(radek, '</html>', radekJePotrebny);

            if(radekJePotrebny == true){
                textArrNew.push(radek);
            }

        }


        return(textArrNew);

    }


    detekujZdaJeRadekPotrebny(radek, tagExp, radekJePotrebny){

        if(radekJePotrebny == true){
            if(radek == tagExp){
                radekJePotrebny = false;
            }
        }

        return(radekJePotrebny);

    }


    //jelikoz je zdrojak "falesny" je treba opravovat selectory na "'.right-half ' + selektorPuvodni"
    opravSelectory(textArr, radkyStyle){

        for (let i = 0; i < radkyStyle.length; i++){

            var radekStyle = radkyStyle[i];
            if(radekStyle == true){
                var text = textArr[i];
                var selector = this.ziskejSelector(text);

                if(selector != ''){
                    var textSel = text.replace('{', '');
                    textSel = textSel.trim();

                    var textNew = text.replace(textSel, selector);
                    textArr[i] = textNew;
                }
            }
        }

        
        return(textArr);

    }


    ziskejSelector(radek){

        var selector = '';
        var indZav = radek.indexOf('{');
        var radekBezZavorky = radek.substring(0, indZav);
        radekBezZavorky = radekBezZavorky.trim();

        if(radekBezZavorky != ''){
            selector = '.nahledHtml ' + radekBezZavorky;
            selector = selector.replace('.nahledHtml body', '.nahledHtml, .right-half');
        }

        return(selector);

    }


    //vrati pole s radky, kde na kazdem radku je true/false
    //pokud je na radku true, pak to zanmena, ze se jedna o telo <style>
    vratStyleTrue(textArr){

        var radekObsahujeStyle = false;
        var radkyStyle = [];

        for (let i = 0; i < textArr.length; i++){

            var radek = textArr[i];
            if(radek == '<style>'){
                radekObsahujeStyle = true;
            }

            if(radek == '</style>'){
                radekObsahujeStyle = false;
            }

            radkyStyle.push(radekObsahujeStyle);

        }

        return(radkyStyle);

    }


    pridejAppendStr(textArr){

        textArr = this.odeberRadkyScript(textArr);

        var appendStr = '<div class="nahledHtml">\n';
        for (let i = 0; i < textArr.length; i++) {

            var textRadek = textArr[i];
            appendStr = appendStr + textRadek + '\n';

        }
        
        console.log(appendStr);
        $('.right-half').append(appendStr);
        
    }


    // je treba odebrat radky script z nahledu
    // jelikoz to pres jquery append nefunguje
    // script se pridava externe a je generovan dopredu pomoci pythonu
    // a uklada se do slozky 
    // ...\CSS Html\sources\generatedJs\

    odeberRadkyScript(textArr){

        var jednaSeOScript = false;
        var textArrNew = []

        for (let i = 0; i < textArr.length; i++) {
            var radek = textArr[i];

            if(jednaSeOScript == true){
                if(radek == "</script>"){
                    jednaSeOScript = false;
                }
            }
            
            if(jednaSeOScript == false){
                if(radek == "<script>"){
                    jednaSeOScript = true;
                }
                else{
                    if(radek != "</script>"){
                        textArrNew.push(radek);
                    }
                }
            }
        }

        return(textArrNew)

    }


    test(){

        var appendStr = '<style>' + 
                        '' + 
                        '.right-half {' + 
                        '    background-color: lightblue;' + 
                        '}' + 
                        '' + 
                        '.right-half h1 {' + 
                        '    color: black, magenta;' + 
                        '    text-align: center;' + 
                        '}' + 
                        '' + 
                        '.right-half p {' + 
                        '    font-family: verdana;' + 
                        '    font-size: 20px;' + 
                        '}' + 
                        '' + 
                        '</style>' + 
                        '' + 
                        '<h1>My First CSS Example</h1>' + 
                        '<p>This is a paragraph.</p>';

        $('.right-half').append(appendStr);

    }


    ziskejTextArr(){

        var textArr = [];

        for (let i = 0; i < this.obj.rows.length; i++) {

            var text = this.obj.rows[i].data.text;

            if (typeof text !== 'string'){
                text = this.ziskejTextItemDleDanehoRow(i);
            }
            
            var pocetMezer = this.spocitejPocetMezer(text);
            var textBezPodtrzitek = text.substring(pocetMezer, text.length);
            
            textArr.push(textBezPodtrzitek);

        }
        
        return(textArr);
    }


    spocitejPocetMezer(text){

        var charArr = text.split('');
        var pocetMezer = 0;
        
        for (let i = 0; i < charArr.length; i++){

            var znak = charArr[i];
            if(znak == '_'){
                pocetMezer = pocetMezer + 1;
            }
            else{
                break;
            }
        }

        return(pocetMezer);

    }




    ziskejTextItemDleDanehoRow(rowExp){

        for (let i = 0; i < this.jsonProAktualizaciRadku.data.length; i++) {

            var textItem;

            var data = this.jsonProAktualizaciRadku.data[i];
            var row = data.row;
            if(row == rowExp){
                textItem = data.textItem;
                break;
            }
        }
        
        return(textItem);

    }

}



class vytvorJsonProAktualizaciDat{

    constructor (jsonName){

        var jsonNameObj = jsonName.replace('.json', '');

        console.log(jsonNameObj);
        var objTxt = eval(jsonNameObj);
        
        var obj = JSON.parse(objTxt);
        this.obj = obj;
        
        this.jsonProAktualizaciRadku = this.vytvorJsonProAktualizaciRadku();

        // jeste nevim jak bude fungovat
        //this.aktualizujHlavniJson();
        this.generujJsonRadek();
        this.vratPoleRowNumTypeText();

    }


    // vrati obj Jsonu (modifikovaneho)
    getObj(){
        //this.obj = JSON.parse(htmlData);
        return(this.obj)
    }

    //vrati json aby mohl prepisovat 'jsonProAktualizaciRadku' pri klikani na tlacitka
    getJsonProAktualizaciRadku(){
        return(this.jsonProAktualizaciRadku);
    }



    //pokud je 'inSelect = true', pak opravi hlavniJson
    aktualizujHlavniJson(){

        var jsonRadek = {"data": {"rowNum": 6, "type": "noCombo", "text": "___test" }}
        var objActual = this.obj;

        objActual.rows[6] = jsonRadek;

        console.log(objActual);

    }


    //metoda se spusti v pripade, ze se po prve nacte stranka
    //vytvori se cely Json na poprve - jedna se o Json pro aktualizaci comboboxu
    vytvorJsonProAktualizaciRadku(){

        //vrati seznam coboboxu 'true/false', tam, kde je false, tam je combobox
        var seznamComboboxu = this.vratPoleRowNumTypeText()
        var bezCombaPrvni = true;
        var comboJsonStrAll = '{"data": ['

        
        for (let i = 0; i < seznamComboboxu.length; i++) {

            var bezComba = seznamComboboxu[i]
            if(bezComba == false){ //pak se jedna o radek s comboboxem

                var row = i;
                var rowNum = this.obj.rows[i].data.rowNum;
                var text = this.obj.rows[i].data.text[0].text;
                var idCombaAll = this.vratVsechnaIdComboboxu(i);

                /*
                console.log(row);
                console.log(rowNum);
                console.log(text);
                console.log(idCombaAll);
                */

                var comboJson = this.vytvorComboJson(idCombaAll, row, rowNum, text);
                var comboJsonStr = JSON.stringify(comboJson);

                if(bezCombaPrvni == false){ 
                    comboJsonStrAll = comboJsonStrAll + ','
                }
                else{   //pokud "bezCombaPrvni == true"
                    bezCombaPrvni = false;
                }

                //nejdriv prida carku (viz vyse) a pak prida combo
                comboJsonStrAll = comboJsonStrAll + comboJsonStr;

                /*
                console.log(seznamComboboxu.length);
                console.log(comboJsonStrAll);
                console.log(comboJson);
                */

            }

        }

        //uzavre Json, aby ho mohl vratit
        comboJsonStrAll = comboJsonStrAll + ']}';
        var jsonProAktualizaciRadku = JSON.parse(comboJsonStrAll);
        

        return(jsonProAktualizaciRadku);


        /*
        // TEST

        //na zaklade hlavniho jsonu vygenerovat tento json!
        //pak tento json pouzit pro zobrazovani comboboxu

        var nastaveniComboboxu = {"data": [ {   "row": 5,
                                                "rowNum" : 6,
                                                "text": "____background-color",
                                                "comboBox": {
                                                        "idCombo": "background-color|6", 
                                                        "inSelect": false,                  //kdyz je true, pak je combo otevrene
                                                        "selectedItem": "lightblue",
                                                },
                                                "textItem": "____background-color : lightblue"
                                            },
                                            {   "row": 9,
                                                "rowNum" : 10,   
                                                "text": "____color", 
                                                "comboBox": [ 
                                                        {
                                                            "idCombo": "color_1|10",
                                                            "inSelect": false,
                                                            "selectedItem": "black",   
                                                        },
                                                        {
                                                            "idCombo": "color_2|10",
                                                            "inSelect": false,
                                                            "selectedItem": "magenta",   
                                                        },
                                                ],    
                                                "textItem": "____color : black , magenta"
                                            }   
                                        ]}

        console.log(nastaveniComboboxu);
        */
    }


    vytvorComboJson(idComboAll, row, rowNum, text){

        var comboSeznamStr;
        var comboRowRowNumText =    '  {    "row": ' + row + ', ' + 
                                    '       "rowNum" : ' + rowNum + ', ' +     
                                    '       "text": "' + text + '", ' +
                                    '       "comboBox": [ ';

        var selectedItemAll = this.vratSeznamPrvnichPolozekComboBoxu(row);
        comboSeznamStr = comboRowRowNumText;
        
        var textItem;
        textItem = '"' + text + ': ';


        for (let i = 0; i < idComboAll.length; i++) {

            var idCombo = idComboAll[i];
            var inSelect  = false;
            var selectedItem = selectedItemAll[i];

            comboSeznamStr = this.vratComboSeznamStr(comboSeznamStr, idCombo, inSelect, selectedItem);
            textItem = textItem + selectedItem;
            
            if(i < idComboAll.length-1) {
                comboSeznamStr = comboSeznamStr + ',';
                textItem = textItem + ' ';
            }

        }

        textItem = textItem + ';"}';
        comboSeznamStr = comboSeznamStr + '], "textItem": ' + textItem;
        var comboJson = JSON.parse(comboSeznamStr);

        return(comboJson);

    }


    //aby mohl zobrazit vychozi polozky v combech , vybere pro dany radek vzdy prvni polozky comba
    vratSeznamPrvnichPolozekComboBoxu(row){

        //console.log(this.obj);
        var pocetComboBoxu = (this.obj.rows[row].data.text[1].selectOption.length)/2;
        var prvniPolozky = [];

        for (let i = 0; i < pocetComboBoxu; i++) {
            var options = this.obj.rows[row].data.text[1].selectOption[(i*2)+1];
            
            prvniPolozky.push(options.option[0].value);
          
        }

        return(prvniPolozky);

    }



    vratComboSeznamStr(comboStr, idCombo, inSelect, selectedItem){

        var combo =    ' { ' + 
                        '        "idCombo": "' + idCombo.id + '", ' + 
                        '        "inSelect": ' + inSelect + ', ' + 
                        '        "selectedItem": "' + selectedItem + '" ' +   
                        ' } ';

        comboStr = comboStr + combo;
        
        return(comboStr);

    }


    //vrati vsechna id comboboxu z 1 radku
    vratVsechnaIdComboboxu(iRadku){

        var idCombaAll = []
        var pocetCoboBoxu = this.obj.rows[iRadku].data.text[1].selectOption.length / 2;

        for (let i = 0; i < pocetCoboBoxu; i++) {
            
            var i1 = i * 2
            var idCombo = this.obj.rows[iRadku].data.text[1].selectOption[i1].select[0];

            idCombaAll.push(idCombo);

        }

        return(idCombaAll);

    }


    vratPoleRowNumTypeText(){

        var pocetRadku = this.obj.rows.length;
        //console.log(this.obj);

        var polePolozek = [];
        var polozka;

        for (let i = 0; i < pocetRadku; i++) {

            var polozkaType = this.obj.rows[i].data.type;
            if(polozkaType == 'noCombo'){
                polozka = true;     //tagBool - ktery vraci
            };
            if(polozkaType == 'combo'){
                polozka = false;    //tagBool - ktery vraci
            };
           
            polePolozek.push(polozka);

        }

        return(polePolozek);

    }

    //vygeneruje json radek dle zadanych parametru
    generujJsonRadek(rowNum, text){

        var jsonRadek;
        jsonRadek = {"data": {"rowNum": rowNum,
                              "type": "noCombo",
                              "text": text  
                            }
                    };

        return(jsonRadek)

    }

}


class modifikujJsonProAktualizaciDat{

    //dle zadaneho id modifikuje data
    constructor(jsonProAktualizaciRadku, id, vybranaPolozka){
    
        var zadouciButt = this.detekujZdaByloKliknutoJenNaZadouciButt(id);        
        if(zadouciButt == true){

            this.jsonObjSrc = jsonProAktualizaciRadku;

            //pokud bylo kliknuto na tlacitko, pak se vola tato metoda
            if(vybranaPolozka == '%button%'){
                this.jsonObjSrc = this.prenastavInSelect(id);
            }
            else {  //jinak byl vybran combobox
                
                //aktualizuje vybrane polozky, aby mohl sestavit textItem
                this.jsonObjSrc = this.aktualizujSelectedItem(id, vybranaPolozka);
                
                //aktualizuje textItem, po oprave dat v 'this.jsonObjSrc'
                this.jsonObjSrc = this.aktalizujTextItem(this.indexProTextItem);

                //detekuje, zda vsechny inSelect jsou 'false'
                var vsechnyInSelectJsouFalse = this.detekujZdaVsechnyInSelectJsouFalse(id);

            }

        }

    }


    getJsonProAktualizaciRadku(){
        return(this.jsonObjSrc);
    }


    //aby prekresloval zdrojak, jsou relevantni pouze tlacitka s id="butt_.."
    //pokud se na nej klikne, vrati se true, jinak false
    detekujZdaByloKliknutoJenNaZadouciButt(id){

        var zadouciButt = false;
        id = id.replace('|', '\\|');

        var trida = $('#' + id).attr('class');

        
        if(trida == 'buttCss'){
           zadouciButt = true;
        }
        if(trida == 'comboSrc'){
            zadouciButt = true;
        }

        return(zadouciButt)

    }


    //pokud vsechny comba na radku se nastavi na inSelect='false', pak se bude klikat na button
    //cimz se comba zrusi
    //to se zjistuje pres id napr id="color_1|10" znamena, ze se budou vyhodnocovat vsechny inSelect na rowNum=10
    detekujZdaVsechnyInSelectJsouFalse(id){
       
        var jsonNew = JSON.parse(JSON.stringify(this.jsonObjSrc));
        var idSpl = id.split('|');
        var rowNumExp = idSpl[1];

        for (let i = 0; i < jsonNew.data.length; i++) {
            var data = this.jsonObjSrc.data[i];
            var rowNum = data.rowNum;
            if(rowNumExp == '' + rowNum){
                var combo = data.comboBox;
                console.log(combo);
                var vsechnyInSelectJsouFalse = this.detekujZdaJeFalseUComba(combo);
                break;
            }
        }

        //pokud vsechnyInSelectJsouFalse == true, pak klikne na 'button'
        if(vsechnyInSelectJsouFalse == true){
            $('#butt_'+rowNumExp).click();
        }


        return(vsechnyInSelectJsouFalse);
    }


    detekujZdaJeFalseUComba(combo){

        var vsechnyInSelectJsouFalse = true;

        console.log(combo);

        for (let i = 0; i < combo.length; i++){
            var inSelect = combo[i].inSelect;
            if(inSelect == true){
                vsechnyInSelectJsouFalse = false;
                break;
            }
        }

        return(vsechnyInSelectJsouFalse);

    }



    //pokud byl vybran combobox, pak se prenastavuje 'selectedItem'
    aktualizujSelectedItem(id, vybranaPolozka){

        var rowNum = this.ziskejRowNumZIdSelect(id);
        var indexRadkuComba = this.vratIndexRadkuComba(rowNum);
        var idComboRadek = this.vratIdComboRadek(indexRadkuComba, id);
        this.indexProTextItem = indexRadkuComba;  //ulozi data, aby vedel, kde ma aktualizovat textItem

        //vytvori kopii objektu 'this.jsonOrig'
        var jsonNew = JSON.parse(JSON.stringify(this.jsonObjSrc));

        //aktualizuje 'selecteditem'
        jsonNew.data[indexRadkuComba].comboBox[idComboRadek].selectedItem = vybranaPolozka;

        //nastavi 'selectedItem' na false
        jsonNew.data[indexRadkuComba].comboBox[idComboRadek].inSelect = false;

        return(jsonNew);

    }


    //aktualizuje text item pri kazde zmene comboboxu
    aktalizujTextItem(indexRadkuComba){

        //textItem se sklada z text a polozek
        var text = this.jsonObjSrc.data[indexRadkuComba].text;
        var textItemStr = text + ': ';

        //vytvori kopii objektu 'this.jsonOrig'
        var jsonNew = JSON.parse(JSON.stringify(this.jsonObjSrc));

        for (let iCombo = 0; iCombo < this.jsonObjSrc.data[indexRadkuComba].comboBox.length; iCombo++) {
            var selItem = this.jsonObjSrc.data[indexRadkuComba].comboBox[iCombo].selectedItem;
            
            //pokud je iCombo > 0, pak prida carku
            if(iCombo > 0){
                textItemStr = textItemStr + ' '
            }

            textItemStr = textItemStr + selItem;

        }

        textItemStr = textItemStr + ';';

        //aktualizuje textItem
        jsonNew.data[indexRadkuComba].textItem = textItemStr;
        console.log(jsonNew);

        return(jsonNew)

    }


    //pokud bylo kliknuto na button, pak se vola tato metoda
    prenastavInSelect(id){

        var rowNumExp = this.ziskejRowNumZIdButt(id);
        var jsonNew;

        //vytvori kopii objektu 'this.jsonOrig'
        if(this.jsonObjSrc != undefined){
            if(this.jsonObjSrc.data.length>0){

                jsonNew = JSON.parse(JSON.stringify(this.jsonObjSrc));
                var indexRadkuComba = this.vratIndexRadkuComba(rowNumExp);

                //zjisti, zda ma nastavovat na true (otevrene comba), nebo na false (zavrena comba)
                var inSelectNastavujNa = this.detekujZdaPrepisovatCombaNaTrueNeboFalse(indexRadkuComba);

                //prepise vsechny comba na inSelect = true
                for (let iCombo = 0; iCombo < jsonNew.data[indexRadkuComba].comboBox.length; iCombo++) {
                    
                    //nastavi na 'true' nebo 'false'
                    jsonNew.data[indexRadkuComba].comboBox[iCombo].inSelect = inSelectNastavujNa; 

                }                     
            }            
        }

        return(jsonNew);
    }


    // pokud jsou vsechny comboboxy (na 1 radku), nastaveny na 'false', pak vrati 'true' (= bude nastavovat na 'true')
    // pokud je alespon jeden na 'true', pak nastavi na 'false'
    detekujZdaPrepisovatCombaNaTrueNeboFalse(indexRadkuComba){


        console.log(this.jsonObjSrc.data[0]);

        var pocetComboBoxuNaRadku = this.jsonObjSrc.data[indexRadkuComba].comboBox.length;
        var pocetTrue = 0;
        var inSelectNastavujNa;

        for (let iCombo = 0; iCombo < pocetComboBoxuNaRadku; iCombo++) {
            var inSelect = this.jsonObjSrc.data[indexRadkuComba].comboBox[iCombo].inSelect;

            if(inSelect == true){
                pocetTrue = pocetTrue + 1;
            }
        }

        //pokud nebyl nalezen zadny true, pak se jedna o situaci, kdy bylo kliknuto na button a nebyly rozevreny zadne comboboxy
        //pak se nastavi vsude 'true', cimz se vsechny komboboxy otevrou
        if(pocetTrue == 0){
            inSelectNastavujNa = true
        }
        else{
            //to je stav, kdy na 1 radku je vice comboboboxu.
            //pokud 1 combo vyberu, prenastavi se na true, avsak ostatni zustanou false - tj. tento pripad
            //tato metoda se vola pri klikani na tlacitko, nikoliv pri vyberu comba, 
            //takze na false se nastavi, kdyz bude min. 1 combo vybrany a ostatni ne a pritom kliknu na butt
            
            inSelectNastavujNa = false
        }

        return(inSelectNastavujNa);

    }


    //vrati index z pole 'data', kde je prislusny combobox
    vratIndexRadkuComba(rowNumExp){
        console.log(rowNumExp);
        console.log(this.jsonObjSrc);
        var indexRadkuComba = -1;

        for (let i = 0; i < this.jsonObjSrc.data.length; i++) {

            var rowNum = this.jsonObjSrc.data[i].rowNum;

            //vyhleda prislusne combo dle rowNum
            if(rowNum == rowNumExp){
                indexRadkuComba = i;
                break
            }
        }


        //napise chbyu abych vedel priste kde ji hledat
        if(indexRadkuComba == -1){
            var chyba = 'JSON:\nappropriate node isn\'t matching\n\n data/text/selectOption/select/id\ndoes not match to\ndata/rowNum\n\nPlease correct given node in json'
            alert(chyba);
        }

        console.log(indexRadkuComba);
        return(indexRadkuComba);

    }

    //vrati index radku v poli 'comboBox', jedna se o 'idCombo'
    vratIdComboRadek(indexRadkuComba, idComboExp){

        var idComboRadek = -1;

        console.log(indexRadkuComba);
        console.log(this.jsonObjSrc.data[indexRadkuComba]);

        for (let i = 0; i < this.jsonObjSrc.data[indexRadkuComba].comboBox.length; i++) {
            var idCombo = this.jsonObjSrc.data[indexRadkuComba].comboBox[i].idCombo;
            if(idCombo == idComboExp){
                idComboRadek = i;
                break;
            }
        }

        return(idComboRadek);

    }

    //ziska rowNum z buttonu
    ziskejRowNumZIdButt(id){

        var rowNum = id.replace('butt_', '');
        return(rowNum);

    }

    //ziska rowNum z comboBoxu
    ziskejRowNumZIdSelect(idCombo){

        var idComboSpl = idCombo.split('|');
        var rowNum = idComboSpl[1];

        return(rowNum);

    }

}


//modifikuje hlavni Json, na zaklade cehoz prekresli GUI
class modifikujHlavniJson{

    constructor(jsonHlavni, jsonAktualizace){
      
        if(jsonAktualizace != undefined){
       
            this.jsonObjSrc = jsonHlavni;
            this.jsonAktualizace = jsonAktualizace;

            var vygenerujJsonArr = this.nactiJsonAktualizaciAVytvorSbalenaComba(this.jsonAktualizace);
            //this.vygenerujJSonSbaleneComba(this.jsonAktualizace, vygenerujJsonArr);

            this.jsonObjSrcNew = this.vypniCombaUVsechRadku(this.jsonAktualizace, vygenerujJsonArr);
        }    
    }


    getJsonObjNew(){
        return(this.jsonObjSrcNew)
    }


    nactiJsonAktualizaciAVytvorSbalenaComba(jsonAktualizace){

        var vygenerujJsonArr = []

        for (let i = 0; i < jsonAktualizace.data.length; i++) {
            var comboBox = jsonAktualizace.data[i].comboBox;
            var vygenerujJson = true;
            
            for (let iCombo = 0; iCombo < comboBox.length; iCombo++) {
                var inSelect = comboBox[iCombo].inSelect;
                if(inSelect == true){
                    vygenerujJson = false;
                    break; 
                }
            }

            vygenerujJsonArr.push(vygenerujJson);

        }

        //console.log(vygenerujJsonArr);

        return(vygenerujJsonArr);

    }


    vygenerujJSonSbaleneComba(jsonAktualizace, vygenerujJsonArr){

        var jsonSbaleneCombaStr = '{"data":[';
        //console.log(jsonAktualizace);

        for (let i = 0; i < vygenerujJsonArr.length; i++){
            var vygenerujJson = vygenerujJsonArr[i];
            
            if(vygenerujJson == true){
                var row = jsonAktualizace.data[i].row;
            }
            else{
                var row = -1;
            }
            
            //console.log(jsonAktualizace.data[i]);
            var rowNum = jsonAktualizace.data[i].rowNum;
            var textItem = jsonAktualizace.data[i].textItem;
            
            var sbalenaCombaData =  '{' + 
                                    '    "row": ' + row + ',' + 
                                    '    "rowNum": ' + rowNum + ',' + 
                                    '    "textItem": "' + textItem + '"' +
                                    '}';
            
            if(i > 0){
                jsonSbaleneCombaStr =  jsonSbaleneCombaStr + ',';
            }

            jsonSbaleneCombaStr = jsonSbaleneCombaStr + sbalenaCombaData;
            
        }

        

        jsonSbaleneCombaStr = jsonSbaleneCombaStr + ']}'; 
        var jsonSbaleneComba = JSON.parse(jsonSbaleneCombaStr);
        
        //console.log(jsonSbaleneComba);
        
        return(jsonSbaleneComba);

    }



    vytvorJSonSbaleneComba(){

        //tam kde se vytvori json, tam se data sbali
        var jsonSbaleneComba =  {"data":[
                                            {
                                                "row": 5, 
                                                "rowNum": 6,
                                                "textItem" : "test"
                                            },
                                            {
                                                "row": 9, 
                                                "rowNum": 10,
                                                "textItem" : "test2"
                                            },
                                        ]
                                }

        return(jsonSbaleneComba);
    }


    vypniCombaUVsechRadku(jsonAktualizace, vygenerujJsonArr){
      
        var jsonSbaleneComba = this.vygenerujJSonSbaleneComba(jsonAktualizace, vygenerujJsonArr);
      
        //kopie objektu
        var jsonKopyHlavni = JSON.parse(JSON.stringify(this.jsonObjSrc));
    
        for (let i = 0; i < jsonSbaleneComba.data.length; i++) {
            var sbalenaCombaNaRadku = jsonSbaleneComba.data[i];

            var row = sbalenaCombaNaRadku.row;
           
            if(row > -1){
                var textItem = sbalenaCombaNaRadku.textItem;
                var jsonKopyHlavni = this.ziskejDataRowNum(row, textItem, jsonKopyHlavni);
               
            }
            
        }
         
        return(jsonKopyHlavni);
        
    }


    ziskejDataRowNum(row, textItem, jsonKopy){

        //console.log(jsonKopy);
        var jsonData = jsonKopy.rows[row];
        var jsonDataStr = JSON.stringify(jsonData);

        
        var jsonDataSelectOIption = jsonData.data.text[1];
        var jsonDataSelectOIptionStr = JSON.stringify(jsonDataSelectOIption);

        var jsonDataBezSelectOptionStr = jsonDataStr.replace(jsonDataSelectOIptionStr, '');
        jsonDataBezSelectOptionStr = jsonDataBezSelectOptionStr.replace('},]', '}]');
        jsonDataBezSelectOptionStr = this.vratReplaceStringTextItem(jsonDataBezSelectOptionStr, textItem);
   
        var jsonDataNewStr = jsonDataStr.replace(jsonDataSelectOIptionStr, jsonDataBezSelectOptionStr);

        var jsonObjStr = JSON.stringify(jsonKopy);
        var jsonObjBezSelectOptionStr = jsonObjStr.replace(jsonDataStr, jsonDataBezSelectOptionStr);
        var jsonObjBezSelectOption = JSON.parse(jsonObjBezSelectOptionStr);

        return(jsonObjBezSelectOption)

    }


    //vrati string pro nahrazeni, ktery obsahuje aktualizovanou textItem
    vratReplaceStringTextItem(jsonBezSelStr, textItem){

        var textNew = '[{"text":"' + textItem + '"}]}}';
        var jsonBezSelStrSpl = jsonBezSelStr.split('[{"text":"');
        var jsonRowNum = jsonBezSelStrSpl[0];
        var jsonText = jsonBezSelStr.replace(jsonRowNum, '');
        var jsonNew = jsonBezSelStr.replace(jsonText, textNew);

        return(jsonNew);

    }

}


class updatujHtml{

    constructor(jsonHtmlOrig, jsonHtmlModif, jsonProAktualizaciRadku, idButt){
        
        if(jsonProAktualizaciRadku != undefined){
            
            //vzdy se pouziji originalni data
            var novyHlavniJson = new modifikujHlavniJson(jsonHtmlOrig, jsonProAktualizaciRadku);
            jsonHtmlModif = novyHlavniJson.getJsonObjNew();

            //TEST - odmaze sa a prida se znovu tabuklka
            $("tr.tableSrc").remove();
            var table = new vytvorTabulkuSrc(jsonHtmlModif, idButt);

            //vytvor pole s idComba a jejich vybranymi polozkami
            var idComboSelItemArr = this.vytvorPoleIdCombaASelItem(jsonProAktualizaciRadku);

            //aktualizuje vsechny comboboxy
            this.aktualizujVsechnaComba(idComboSelItemArr);



            //odmaze nahled stranky
            $('.nahledHtml').remove();

            //vytvori nahled stranky html
            var page = new vytvorStrankuSrc(jsonHtmlModif, jsonProAktualizaciRadku);

        }


    }

    //vytvor pole s idComba a jejich vybranymi polozkami
    vytvorPoleIdCombaASelItem(jsonProAktualizaciRadku){

        var idComboSelItemArr = [];
        //console.log(jsonProAktualizaciRadku);

        for (let i = 0; i < jsonProAktualizaciRadku.data.length; i++) {
            var data = jsonProAktualizaciRadku.data[i];
            var combo = data.comboBox;
            
            for (let iCombo = 0; iCombo < combo.length; iCombo++) {
                var idCombo = combo[iCombo].idCombo;
                var selectedItem = combo[iCombo].selectedItem;

                var idComboSelItem = [];
                idComboSelItem.push(idCombo);
                idComboSelItem.push(selectedItem);

                idComboSelItemArr.push(idComboSelItem);
            }
        }

        return(idComboSelItemArr);

    }

    //nastavi comba na aktualni polozky
    aktualizujVsechnaComba(idComboSelItemArr){

        for (let i = 0; i < idComboSelItemArr.length; i++) {
            var idCombo = idComboSelItemArr[i][0];
            var selectedItem = idComboSelItemArr[i][1];

            idCombo = idCombo.replace('|', '\\|');
            //console.log(selectedItem);

            $('#' + idCombo).val(selectedItem);
        }

    }

}


//trida se vola pri vyberu '#combo_2' a vyhledava se soubor jsonu, ktery je potreba nacitat
class nactiJson{

    constructor(){

        var pocetZobrazenychComboBoxu = $('.comboFile').length;
        
        //pokud jsou zobrazeny vsechny 3 comboboxy (= je vybran ten posledni), pak se zobrazi nahled
        if(pocetZobrazenychComboBoxu == 3){
            this.main();
        } 
        else{  //jinak se nahled vymaze (+zdrojak)
            $("tr.tableSrc").remove();
            $(".nahledHtml").remove();

            //prida defaultni stránku
            var defaultSrc = new srcDefault();
        }  
        
    }


    main(){

        //vycka nez se updatuji comboboxy a pak zjisti nastaveny json
        setTimeout(function(){
 
            var combo0 = $('#combo_0').val();
            var combo1 = $('#combo_1').val();
            var combo2 = $('#combo_2').val();
   
            var adresaProJson = combo0 + '/' + combo1 + '/' + combo2;
           
            var jsonFilesObj = JSON.parse(jsonFiles);
          //  console.log(jsonFilesObj);
            var shodaNalezena = false;

            for (let i = 0; i < jsonFilesObj.files.length; i++) {
                var htmlName = jsonFilesObj.files[i].jsonHtml.htmlName;
                if(htmlName == adresaProJson){

                    var jsonName = jsonFilesObj.files[i].jsonHtml.jsonName;
                    var nahledASrc = new vytvorNahledASrc(jsonName);

                    var attachedJs = jsonFilesObj.files[i].jsonHtml.attachedJs;
                    if(attachedJs != undefined){
                        $('#divRunId').append('<input type="text" id="runJs" value="' + attachedJs + '"></input>');
                        //$('#runJs').val(attachedJs);
                    }

                    var pathDebug = jsonFilesObj.files[i].jsonHtml.pathDebug;
                    if(pathDebug != undefined){
                        $('#pathDebug').val(pathDebug);
                    }
                    
                }

            }
            
        })

    }

}


//zobrazi defaultni stranku se zdrojakem
class srcDefault{

    constructor(){

        var appendStrDefault;
        appendStrDefault = '<tr class="tableSrc"><td><h2>Please choose a project</h2></td></tr>';
        console.log(appendStrDefault);

        $("table").append(appendStrDefault);

    }

}




class vytvorNahledASrc{

    constructor(jsonName){

        //----------------------------------------
        //pripravy vychozi data
        //----------------------------------------

        //var dataJsonDefault = new nactiJson();
        var dataJsonDefault = new vytvorJsonProAktualizaciDat(jsonName);
        

        //ziska originalni data pro zobrazeni stranky
        jsonHtmlOrig = dataJsonDefault.getObj();

        //ziska kopii dat, data bude modifikovat, dle klikani do html
        jsonHtmlModif = JSON.parse(JSON.stringify(jsonHtmlOrig));
        
        //data jsou globalni
        jsonProAktualizaciRadku = dataJsonDefault.getJsonProAktualizaciRadku();

        //----------------------------------------
        //vytvori html
        //----------------------------------------

        //z nacteneho Jsonu vykresli html
        var table = new vytvorTabulkuSrc(jsonHtmlOrig);
        var page = new vytvorStrankuSrc(jsonHtmlOrig, jsonProAktualizaciRadku);

        //updatuje data, tak aby mohl je na poprve zobrazit a skryl comba
        var upDateHtml = new updatujHtml(jsonHtmlOrig, jsonHtmlOrig, jsonProAktualizaciRadku);
        

    }

}


// trida je volana z scriptKey, kdyz se prida ".inputKeyJsonName", cilem je ziskat poleText a to vratit zpet.
// pak v scriptCombo se budou hledat klice
class ziskejDataProPorovnaniKlicu{

    constructor(jsonName){

        //nacte data z jiz existujici tridy
        console.log(jsonName);
        var dataJsonDefault = new vytvorJsonProAktualizaciDat(jsonName+'.json');
        var jsonHtmlKey = dataJsonDefault.getObj();

        //vyuzije stavajici tridu k ziskani klicu
        var ziskejJenKlice = new vytvorTabulkuSrc(jsonHtmlKey, true);
        var poleTextKlice = ziskejJenKlice.getPoleTextKlice();
        var poleTextKliceStr = JSON.stringify(poleTextKlice);

        $('.tree').append('<input type="text" class="inputTextProKlice" value="' + poleTextKliceStr + '"></input>');

    }

}


//nacte zdrojak z tabulky a obarvi ho pomoci highlight.js
//zdrojak vytiskne barevny do '.srcForColoring', kde se znovu nacte a prepise zpet do tabulky
//zdrojak v '.srcForColoring' je skryty a neni videt
class obarviSrcUsingHighLight{

    constructor(rowType, tableSrcArr, poleText, poleRowType){
       
        this.obarviRadkyProJavascript();
        
        //obarvi html pomoci highLight
        this.nahrazenyPoleText = this.obarviRadkyProHtml(tableSrcArr, poleText, poleRowType);
        console.log(this.nahrazenyPoleText);
        
        // zatim to je zakomentovane, jelikoz to nefunguje - takze neco v css se neobarvuje
        // this.obarviRadkyProCss(tableSrcArr, this.nahrazenyPoleText, poleRowType, poleText);

    }


    getObarveneHtml(){
        return(this.obarv);
    }

    getTextRadekArr(){
        return(this.textRadekArr);
    }

    getNahrazenyPoleText(){
        console.log(this.nahrazenyPoleText);
        return(this.nahrazenyPoleText);
    }


    obarviRadkyProJavascript(){

        var rowType = 'js';
        var srcArr = this.ziskejSrcZTabulky(rowType);
        this.vlozSrcDoHtml(srcArr, rowType);

        var coNahradArr = this.vytvorPoleCoNahrad(srcArr);
        console.log(coNahradArr);

        //obarvi radky
        hljs.initHighlightingOnLoad();
        var cimNahradArr = this.vytvorPoleCimNahrad('#srcJs');
        console.log(cimNahradArr);
      
        if(cimNahradArr != undefined){
            coNahradArrJs = coNahradArr;
            cimNahradArrJs = cimNahradArr;

            console.log(coNahradArrJs);
            console.log(cimNahradArrJs);

        }

    }
    

    obarviRadkyProHtml(tableSrcArr, poleText, poleRowType){

        var rowType = 'html';
        var srcArr = this.ziskejSrcArrZTableSrc(tableSrcArr, rowType);
        var nahrazenyPoleText = undefined;
 
        if(srcArr != undefined){
            
            this.vlozSrcDoHtml(srcArr, rowType);
            var coNahradArr = this.vytvorPoleCoNahrad(srcArr);

            hljs.initHighlightingOnLoad();
            
            var cimNahradArr = this.vytvorPoleCimNahrad('#srcHtml');

            if(cimNahradArr != undefined){
                //console.log(coNahradArr);
                console.log(cimNahradArr);
                //aby obarvil html, je potreba spustit script znovu
                var obarviHtml = new obarviRadkyHtml(coNahradArr, cimNahradArr, poleText, poleRowType);
                this.obarv = obarviHtml.getNahrazeneHtml();
                this.textRadekArr = obarviHtml.getTextRadekArr();
                
                nahrazenyPoleText = obarviHtml.getNahrazenyPoleText();

                //var d2= '<span class="hljs-tag">&lt;<span class="hljs-name">p </span><span class="hljs-attr">id</span>=<span class="hljs-string">"demo"</span>&gt;</span><span class="hljs-tag"><span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>';
                //this.obarv[8] = d2;

                console.log(this.obarv);
                
            }

        }


        var d2= '<span class="hljs-tag">&lt;<span class="hljs-name">p </span><span class="hljs-attr">id</span>=<span class="hljs-string">"demo"</span>&gt;</span><span class="hljs-tag"><span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>';
        this.obarv[8] = d2;


        console.log(tableSrcArr);
        console.log(poleText);
        console.log(poleRowType);

        console.log(nahrazenyPoleText);
        console.log(cimNahradArr);
        return(nahrazenyPoleText);
        
    }

    

    ziskejSrcArrZTableSrc(tableSrc, rowType){
        
        //u strasich typu souboru nemusi byt definovany rowTyp
        //pak se html plni neporadkem a nejde ho zpetne nacitat
        //aby se tomu zabranilo, 'nalezenRowType' definuje zda je potreba vubec vytvaret barevne radky
        //resp. existuji data pro jejich vytvoreni 
        var nalezenRowType = false;

        var srcArr = tableSrc.split('\n');
        var srcArrNew = [];

        if(rowType == 'html'){
            srcArrNew.push('<pre id="srcHtml"><code class="html">');
        }
        
        if(rowType != 'css'){
            srcArrNew.push('<div id=srcForColoring' + rowType + '>');
        }
        
        for (let i = 0; i < srcArr.length; i++) {
            var radek = srcArr[i];
            var indTdClass = radek.indexOf('<td class=\"rowType-' + rowType + '\">');
            if(indTdClass > 0){
                radek = this.ziskejTeloRadku(radek);
                srcArrNew.push(radek);
                nalezenRowType = true;
            }
        }

        if(rowType != 'css'){
            srcArrNew.push('</div>');
        }    
        
        if(rowType == 'html'){
            srcArrNew.push('</code></pre>');
        }

        //nenajde-li barevńy radek, nevraci nic
        if(nalezenRowType == false){
            srcArrNew = undefined
        }
        else{
            //test
            //alert();
            //console.log('*****************');
            //console.log(tableSrc);
            //console.log('*****************');
        }

        return(srcArrNew);
    }


    ziskejTeloRadku(radek){

        var radekSpl = radek.split('\">');
        var radek1 = radekSpl[1];
        radek1 = radek1.replace('</td>', '');

        return(radek1);

    }


    //vytvori pole radku, ktere udava co nahradit
    vytvorPoleCoNahrad(srcArr){
        var coNahradArr = [];
        
        for (let i = 2; i < srcArr.length-2; i++) {
            var radek = srcArr[i];
            radek = radek.trim();
            coNahradArr.push(radek);
        }

        return(coNahradArr);
    }


    //vytvori pole cim nhradit
    //jednotlive radky pole by meli odpovidat poli 'vytvorPoleCoNahrad', tak aby oba stejne indexy radku vytvareli dvojici
    vytvorPoleCimNahrad(srcId){

        var srcJsHtml = $(srcId).html();
        
        if(srcId == '#srcHtml'){
            console.log(srcJsHtml);
        }
        
        if(srcJsHtml !== undefined){

            var indSrcJsHtml = srcJsHtml.indexOf('hljs');
            var cimNahradArr = [];
            var rozdelPodleSpan;
            console.log(indSrcJsHtml);
            if(indSrcJsHtml > -1){

                if(srcId == '#srcHtml'){
                    rozdelPodleSpan = true;
                }
                else{
                    rozdelPodleSpan = false;  //pokud se jedna o javascript, pak se nerozdeluje podle <span>
                }
   
                var cimNahradArr = this.vytvorCimNahradArr(srcJsHtml, rozdelPodleSpan);  
                console.log(srcId);
                console.log(cimNahradArr);
            }
            else{
                if(srcId == '#srcCss'){
                    rozdelPodleSpan = true;
                    var cimNahradArr = this.vytvorCimNahradArr(srcJsHtml, rozdelPodleSpan);  
                    console.log(cimNahradArr);
                }
            }
           
            //pokud se vrati prazdne pole prepise se na undefined
            if(cimNahradArr.length == 0){
                cimNahradArr = undefined;
            }

        }
        
        console.log(cimNahradArr)
        return(cimNahradArr);

    }


    vytvorCimNahradArr(srcJsHtml, rozdelPodleSpan){

        console.log(srcJsHtml);
        console.log(rozdelPodleSpan);

        var cimNahradArr = [];
        var srcJsHtmlStr = String(srcJsHtml);

        if(rozdelPodleSpan == true){
            srcJsHtmlStr = srcJsHtmlStr.replaceAll('<span', '\n<span');
        }

        var srcJsHtmlSpl = srcJsHtmlStr.split('\n');
    
        for (let i = 1; i < srcJsHtmlSpl.length-1; i++) {
            var radek = srcJsHtmlSpl[i];
            radek = radek.trim();
            console.log(radek);
            cimNahradArr.push(radek);
        }

        console.log(cimNahradArr);
        return(cimNahradArr);

    }



    //vlozi obsah tabulky jako zdrojak html do '<div class="srcForColoring">'
    //tak, aby mohl zdrojak prebarvit 
    vlozSrcDoHtml(srcArr, rowType){

        //console.log(srcArr);
        //detekuje, zda jiz data existuji
        //pokud ano, pak nezapisuje nova
        var vlozData = this.testujZdaExistujePreId(rowType);
        vlozData = true;
        if(vlozData == true){

            var appendStrHtml = '';
            for (let i = 0; i < srcArr.length; i++) {
                var radek = srcArr[i];

                if(rowType == 'js'){
                    radek = this.upravJsRadek(radek);
                    appendStrHtml = appendStrHtml + radek + '\n';
                }
                if(rowType == 'html'){
                    appendStrHtml = appendStrHtml + radek + '<br>';
                }
                if(rowType == 'css'){
                    appendStrHtml = appendStrHtml + radek + '\n';
                }

            }

            //console.log(appendStrHtml);
            //alert(appendStrHtml);

            $('#srcForColoring' + rowType).remove();
            $('.srcForColoring #' + rowType).append(appendStrHtml);

        }

        //if(rowType == 'css'){
         //   console.log(appendStrHtml);
        //}

    }


    // testuje zda vkladat zdrojak pro obarveni
    //zda jiz tam neni
    testujZdaExistujePreId(rowType){

        var preId;
        var vlozData = false;

        if(rowType == 'js'){
            preId = '#srcJs';
        }
        if(rowType == 'html'){
            preId = '#srcHtml';
        }

        //testuje zda existuje preId
        if ($(rowType).length == 0){
            vlozData = true;
        }

        //alert('' + vlozData + ' ' + preId);
        return(vlozData);

    }


    //<script> nahradi s <pre><code class="javascript">
    upravJsRadek(radek){

        radek = radek.replace('<script>', '<pre id="srcJs"><code class="javascript">');
        radek = radek.replace('</script>', '</code></pre>');

        return(radek);

    }


    ziskejSrcZTabulky(rowTypeLang){

        var srcArr = [];
        var rowTypeExp = 'rowType-' + rowTypeLang;

        srcArr.push('<div id=srcForColoring' + rowTypeLang + '>');

        $('tbody').children().each(function(index) {
            var td = ($("tr").get(index)); 
            var tr = ($(td).children()[3]);
            var radektext = ($(tr).text());

            var rowType = ($(tr).attr('class'));
            if(rowType == rowTypeExp){
                srcArr.push(radektext);
            }
        });

        srcArr.push('</div>');
        return(srcArr);

    }

}


//obarvi radky pro kod html
//upravuje radky 'html', radky 'js' se upravuji bez pouziti teto tridy
class obarviRadkyHtml{

    constructor(coNahradArrHtml, cimNahradArrHtml, poleText, poleRowType){

        console.log(poleText);

        //vytvori kopie dat, aby neprepisoval data puvodni
        var coNahradArrHtml = [...coNahradArrHtml];
        var cimNahradArrHtml = [...cimNahradArrHtml];
        var poleTextObarvi = [...poleText];

        
        var poleVsechSpanClass = this.ziskejPoleVsechSpanClass(cimNahradArrHtml);
        var poleRadkuBezClass = this.ziskejPoleRadkuBezClass(cimNahradArrHtml, poleVsechSpanClass);
        var poleRadkuBezClassEnd = this.ziskejPoleRadkuBezClassEnd(poleRadkuBezClass);
        var indexyRadkuArr = this.vyhledejIndexyRadku(poleRadkuBezClassEnd, coNahradArrHtml);
        
        //tahle oprava zatím jen rozbíjí data kdyz je tam css, ale mela by opravovat '<p id="demo">'
        //indexyRadkuArr = this.opravPIndexyRadkuArr(poleRadkuBezClassEnd, indexyRadkuArr);

        console.log(coNahradArrHtml);
        console.log(cimNahradArrHtml);

        //promyslet, zda by nestacilo pouze 'var', nikoliv 'this.'
        this.nahrazeneHtml = this.nahrazujPole(coNahradArrHtml, cimNahradArrHtml, poleRadkuBezClassEnd, indexyRadkuArr, true);
        console.log(this.nahrazeneHtml);
        this.nahrazeneHtml = this.opravChybu(this.nahrazeneHtml);
        console.log(this.nahrazeneHtml);
        this.textRadekArr = this.vytvorProstyText(poleRadkuBezClassEnd, indexyRadkuArr);
        console.log(this.textRadekArr);
        this.textRadekArr = this.ziskejTextRadekArrSOdsazenymiRadky(this.nahrazeneHtml, this.textRadekArr);

        console.log(this.textRadekArr);
        var textRadekArrTagy = this.doplnTagy(this.textRadekArr);
        var nahrazeneHtmlEmsp = this.vymazEmsp(this.nahrazeneHtml);

        
        console.log(poleTextObarvi);
        console.log(nahrazeneHtmlEmsp);
        console.log(textRadekArrTagy);
        
        

        //upravi delku poli, tak aby pole byli stejne dlouhe
        textRadekArrTagy = this.vlozPrazdneRadkyDoTextRadekArrTagy(textRadekArrTagy, poleRowType);
        nahrazeneHtmlEmsp = this.vlozPrazdneRadkyDoTextRadekArrTagy(nahrazeneHtmlEmsp, poleRowType);
        var indexyPoleText = this.ziskejIndexyKPoli(textRadekArrTagy, poleTextObarvi, poleRowType);
        console.log(indexyPoleText);
        this.nahrazenyPoleText = this.nahrazujPole(poleTextObarvi, nahrazeneHtmlEmsp, textRadekArrTagy, indexyPoleText, false); 
        

        //neobsahuje upravena data, zjistit proc??
        console.log(this.nahrazenyPoleText);
        console.log(this.nahrazeneHtml);

        //this.zapisNahrazeneHtmlNaStejneRadkyJakoPoleText(this.nahrazeneHtml, this.textRadekArr, poleText);

    }


    getNahrazeneHtml(){
        return (this.nahrazeneHtml);
    }


    getTextRadekArr(){
        return(this.textRadekArr);
    }


    getNahrazenyPoleText(){
        console.log(this.nahrazenyPoleText);
        return(this.nahrazenyPoleText);
    }


    //je potreba vytvorit pole nahrazenych radku, tak aby byly na stejnych indexech radku jako 'poleText'
    zapisNahrazeneHtmlNaStejneRadkyJakoPoleText(nahrazeneHtml, textRadekArr, poleText){

        console.log(nahrazeneHtml);
        console.log(textRadekArr);
        console.log(poleText);

    }


    vymazEmsp(nahrazeneHtml){

        var nahrazeneHtmlEmsp = [];

        for (let i = 0; i < nahrazeneHtml.length; i++) {
            var radek = nahrazeneHtml[i];
            var radekNew = radek.replaceAll('&emsp;', '');
            nahrazeneHtmlEmsp.push(radekNew);
        }

        return(nahrazeneHtmlEmsp);

    }


    ziskejIndexyKPoli(textRadekArrTagy, poleText){

        console.log(textRadekArrTagy);
        console.log(poleText);

        var indexyPoleText = [];
        for (let i = 0; i < poleText.length; i++) {

            var radekPoleText = poleText[i];
            radekPoleText = radekPoleText.replaceAll('_', '');
            var indRadek = textRadekArrTagy.indexOf(radekPoleText);

            //console.log(textRadekArrTagy);
            console.log(radekPoleText);
            console.log(indRadek);
            
            //pokud nenalezne, vyhledava jeste radek bez mezery
            if(indRadek == -1){
                indRadek = this.vratIndexRadkuBezMezer(radekPoleText, textRadekArrTagy);
            }
            
            indexyPoleText.push(indRadek);

        }

        console.log(indexyPoleText);
        return(indexyPoleText);

    }


    //pokud je tam css, pak vklada prazdne radky do pole 'textRadekArrTagy'
    //duvod je ten, aby vychazely stejne indexy (aby sedely indexy v poli 'indexyPoleText')
    vlozPrazdneRadkyDoTextRadekArrTagy(textRadekArrTagy, poleRowType){

        var textRadekArrTagyNew = [];
        var textRadek;
        var indR = -1;

        for (let i = 0; i < poleRowType.length; i++) {
            var rowType = poleRowType[i];
            if(rowType == 'css'){
                textRadek = '';
            }
            else{
                indR = indR + 1;
                textRadek = textRadekArrTagy[indR];
            }

            textRadekArrTagyNew.push(textRadek);
            
        }

        //console.log(textRadekArrTagyNew)
        return(textRadekArrTagyNew);

    }


    //nekdy nemusi byt radek nalezen, proto se vyhledava jeste jednou bez mezer
    vratIndexRadkuBezMezer(radek, textRadekArrTagy){

        var radekBezMezery = radek.replaceAll(' ', '');
        var indRadek = textRadekArrTagy.indexOf(radekBezMezery);

        return(indRadek);

    }


    //k textRadekArr doplniTagy, tak aby pole bylo srovnatelne s 'poleText'
    doplnTagy(textRadekArr){

        var textRadekArrTagy = []

        for (let i = 0; i < textRadekArr.length; i++) {

            var radek = textRadekArr[i];
            
            if(radek == undefined){
                radek = '';
            }

            var radekNew = radek.replaceAll('&lt;', '<');
            radekNew = radekNew.replaceAll('&gt;', '>');
            radekNew = radekNew.replaceAll('\"', '');
            radekNew = radekNew.replaceAll('divclass', 'div class');
            radekNew = radekNew.replaceAll('scriptsrc', 'script src');
            radekNew = radekNew.replaceAll('.js><', '.js></script>');

            textRadekArrTagy.push(radekNew);

        }


        return(textRadekArrTagy);

    }


    // odsadi radky v 'textRadekArr', tak aby byly shodne jako v 'nahrazeneHtml'
    ziskejTextRadekArrSOdsazenymiRadky(nahrazeneHtml, textRadekArr){
        
        var textRadekArrNew = [];
        var iTextRadek = -1;

        for (let i = 0; i < nahrazeneHtml.length; i++) {
            var radekNahrad = nahrazeneHtml[i];
            iTextRadek = iTextRadek + 1;

            var radekTextArr = textRadekArr[iTextRadek];
            
            if(radekNahrad == ""){
                iTextRadek = iTextRadek - 1;
                textRadekArrNew.push('');
            }
            else{
                textRadekArrNew.push(radekTextArr);
            }

        }

        return(textRadekArrNew);

    }


    // !! bude treba casem resit jinak, ale je tady chyba
    // zatim ji opravuji natvrdo pro tento konkretni pripad
    opravChybu(nahrazeneHtml){

        for (let i = 0; i < nahrazeneHtml.length; i++) {
            var radek = nahrazeneHtml[i];
            var radekNew = radek.replace('&ems<', '&emsp;<');
            nahrazeneHtml[i] = radekNew;
        }

        return(nahrazeneHtml);

    }


    // sestavi stejne pole jako v 'nahrazujPole' avsak sestavi pouze text bez zadnych tagu
    vytvorProstyText(poleRadkuBezClassEnd, indexyRadkuArr){

        //opravuje data, jelikoz s 'p' je problem
        poleRadkuBezClassEnd = this.opravPClass(poleRadkuBezClassEnd);

        console.log(poleRadkuBezClassEnd);  
        var stejneIndexyArr = this.uskupStejneIndexyDoPole(indexyRadkuArr);
        var textRadekArr = [];
        console.log(stejneIndexyArr);
        console.log(indexyRadkuArr);

        for (let i = 0; i < stejneIndexyArr.length; i++) {
            var iArr = stejneIndexyArr[i][1];
            if(iArr.length > 0){
                var textRadek = this.vratProstyTextRadku(iArr, poleRadkuBezClassEnd);
                textRadekArr.push(textRadek);
                console.log(i);
                console.log(iArr);
                console.log(textRadek);
                console.log(poleRadkuBezClassEnd);
            }
        }

        console.log(textRadekArr);

        return(textRadekArr);

    }


    // kvuli tomu, ze s tagem 'p' je problem, je potreba opravovat data v 'poleRadkuBezClassEnd'
    // deje se tak, pokud 'p' a 'class' jsou na radkach pod sebou
    // pak se 'p' a 'class' slouci a vznikne 'p class' a zapise se na stejnou radku misto 'class'
    // na radce, kde je 'p', zustane ''
    opravPClass(poleRadkuBezClassEnd){

        var poleRadkuBezClassEnd = [...poleRadkuBezClassEnd];

        for (let i = 1; i < poleRadkuBezClassEnd.length; i++) {

            var radek0 = poleRadkuBezClassEnd[i-1];
            var radek1 = poleRadkuBezClassEnd[i];

            if(radek0 == 'p'){
                if(radek1 == 'class='){
                    poleRadkuBezClassEnd[i-1] = ''
                    poleRadkuBezClassEnd[i] = 'p class='
                }
            }

        }

        return(poleRadkuBezClassEnd);

    }


    vratProstyTextRadku(indexyRadkuArr, poleRadkuBezClassEnd){

        //if(indexyRadkuArr[0] == 18){
            //console.log(indexyRadkuArr);
            //console.log(poleRadkuBezClassEnd);
        //}

        var textRadek = '';

        for (let i = 0; i < indexyRadkuArr.length; i++) {
            var indexRadku = indexyRadkuArr[i];
            var radekBezClassEnd = poleRadkuBezClassEnd[indexRadku];
            radekBezClassEnd = this.vratSlovoJenUvnitrTagu(radekBezClassEnd);

            //tyhle radky nejsou originalni, po testovani jsem je sem pridal
            if(i == indexyRadkuArr.length-1){
                var ukonciVyhledavani = true;
            }
            //tenhle radek jsem zakomentoval
            //var ukonciVyhledavani = this.detekujZdaUkoncitVyhledavani(radekBezClassEnd);

            textRadek = textRadek + radekBezClassEnd;
            //console.log(textRadek + '  +  ' + indexRadku);

            if(ukonciVyhledavani == true){
                console.log(textRadek);
                console.log(radekBezClassEnd);
                break;
            }

        }

        console.log(textRadek);
        return(textRadek);

    }


    //pokud 'radekBezClassEnd' je ukoncen '&gt;' pak by mel prestat ve vyhledavani
    //jelikoz '&gt;' znamená '>' a za znakem '>' jiz nic neni
    detekujZdaUkoncitVyhledavani(radekBezClassEnd){

        var gt = '&gt;';
        var indGt = radekBezClassEnd.indexOf(gt);
        var lenGt = gt.length;
        var lenRadekBezClassEnd = radekBezClassEnd.length;
        var ukonciVyhledavani;

        if(indGt == lenRadekBezClassEnd - lenGt){
            ukonciVyhledavani = true;
        }
        else{
            ukonciVyhledavani = false;
        }

        return (ukonciVyhledavani);
        
    }



    uskupStejneIndexyDoPole(indexyRadkuArr){

        var posledniIndex = indexyRadkuArr[indexyRadkuArr.length-1] + 1;
        var stejneIndexyArrArr = [];

        for (let i = 0; i < posledniIndex; i++) {
            var stejneIndexyArr = this.vyberStejneIndexy(i, indexyRadkuArr);
            if(stejneIndexyArr.length > 0){
                stejneIndexyArrArr.push(stejneIndexyArr);
            }
        }

        return(stejneIndexyArrArr);

    }


    vyberStejneIndexy(indexExp, indexyRadkuArr){

        var stejneIndexyArr = [];
        var iArr = []

        for (let i = 0; i < indexyRadkuArr.length; i++) {
            var index = indexyRadkuArr[i];
            if(index == indexExp){
                stejneIndexyArr.push(index);
                iArr.push(i);
            }
        }

        var stejneIndexyArrIArr = []
        stejneIndexyArrIArr.push(stejneIndexyArr);
        stejneIndexyArrIArr.push(iArr);

        return(stejneIndexyArrIArr);

    }


    nahrazujPole(poleTextObarvi, cimNahradArrHtml, poleRadkuBezClassEnd, indexyRadkuArr, prvniVolani){

        console.log(poleTextObarvi);

        var coNahradArrHtml = [...poleTextObarvi];

        //cimNahradArrHtml[15] = '<span class="hljs-tag">&lt;<span class="hljs-name">p</span><span class="hljs-attr">class</span>=<span class="hljs-string">"border"</span>&gt;</span>Border<span class="hljs-tag"><span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span></span>';
        console.log(cimNahradArrHtml);
        console.log(poleRadkuBezClassEnd);
        console.log(indexyRadkuArr);

        for (let i = 0; i < cimNahradArrHtml.length; i++) {
            var radekBezClass = poleRadkuBezClassEnd[i];
            var cimNahradRadek = cimNahradArrHtml[i];
            var indexRadku = indexyRadkuArr[i];

            if(radekBezClass != undefined){

                if(indexRadku > -1){

                    var radekCo = coNahradArrHtml[indexRadku];

                    //opravi radek
                    radekBezClass.replace('!DOCTYPEhtml', '!DOCTYPE html');

                    var radekCoNew;

                    if(prvniVolani == true){
                        var indexy = this.getIndicesOf(radekBezClass, radekCo);
                        //indexy.length = 1;
            
                        if(indexy.length == 1){
                            radekCoNew = radekCo.replace(radekBezClass, cimNahradRadek);
                        }
                        else{
                            radekCoNew = this.nahradRadek(radekCo, radekBezClass, cimNahradRadek, indexy);
                        }
                    }

                    else {
                        radekCoNew = radekCo.replace(radekBezClass, cimNahradRadek);
                    }
                }

                //opravi radek, aby v nem nebyla chyba
                radekCoNew = this.opravRadekSP(radekCoNew);

                //nahradi radek v poli
                coNahradArrHtml[indexRadku] = radekCoNew;
                console.log(indexRadku);
                console.log(radekCoNew);
                console.log(coNahradArrHtml);
                  
            }
        }

        console.log(indexyRadkuArr);
        console.log(coNahradArrHtml);

        return(coNahradArrHtml);

    }


    //muze tam byt chyba v nahrazovani, pak opravuje data zde:
    opravRadekSP(radekCo){

        var opravenyRadek;

        //opravuje <p>
        var a1 = '&lt;p ';
        var a2 = '&lt;<span class="hljs-name">p </span>';

        /*
        //opravuje <span>
        var b1 = '<span" class';
        var b2 = '<span class';
        */
        
        opravenyRadek = radekCo.replace(a1, a2);

        return(opravenyRadek);

    }


    nahradRadek(radekCo, radekBezClass, cimNahradRadek){

        var indexy = this.getIndicesOf(radekBezClass, radekCo);
       
        var indexJeUvnitrTaguArr = this.vratPoleBoolIndexyZdaJsouVTagach(indexy, radekCo);
        var radekCoNew = radekCo;

        for (let i = 0; i < indexy.length; i++) {
           
            var indexJeUvnitrTagu = indexJeUvnitrTaguArr[i];
            if(indexJeUvnitrTagu == false){

                var nahrazujOdIndexu = indexy[i];
                radekCoNew = this.nahradOdIndexu(radekCoNew, radekBezClass, cimNahradRadek, nahrazujOdIndexu);

                console.log('-------------------');
                console.log(radekCoNew);
                console.log('-------------------');

            }
            
        }



       
        return(radekCoNew);

    }


    nahradOdIndexu(radekCo, radekBezClass, cimNahradRadek, nahrazujOdIndexu){

        var strPredIndexem = radekCo.substring(0, nahrazujOdIndexu);
        var strZaIndexem = radekCo.substring(nahrazujOdIndexu, radekCo.length);

        console.log(strZaIndexem);
        console.log(radekBezClass);
        console.log(cimNahradRadek);

        var strZaIndexemNew = strZaIndexem.replace(radekBezClass, cimNahradRadek);
        var radekCoNew = strPredIndexem + strZaIndexemNew;

        return(radekCoNew);

    }
    
    
    vratPoleBoolIndexyZdaJsouVTagach(indexy, radekCo){

        var zavorkyOtZav = this.ziskejSeznamIndexuTagu(radekCo);
        console.log(zavorkyOtZav);
        var indexJeUvnitrTaguArr = [];

        for (let i = 0; i < indexy.length; i++) {

            var index = indexy[i];
            var indexJeUvnitrTagu = this.detekujZdaIndexJeUvnitrTagu(index, zavorkyOtZav);

            console.log(indexJeUvnitrTagu);
            indexJeUvnitrTaguArr.push(indexJeUvnitrTagu);

        }

        return(indexJeUvnitrTaguArr);

    }


    detekujZdaIndexJeUvnitrTagu(index, zavorkyOtZav){

        var indexJeUvnitrTagu = false;

        for (let i = 0; i < zavorkyOtZav.length; i++) {
            var zavOt = zavorkyOtZav[i][0];
            var zavZav = zavorkyOtZav[i][1];

            if(index > zavOt){
                if(index < zavZav){
                    indexJeUvnitrTagu = true;
                    break;
                }
            }
        }

        return(indexJeUvnitrTagu);

    }


    ziskejSeznamIndexuTagu(radekCo){

        var zavorkyOtZav = [];
        var seznamIndexuOt = this.vratSeznamVyskytu(radekCo, '<');
        var seznamIndexuZav = this.vratSeznamVyskytu(radekCo, '>');

        for (let i = 0; i < seznamIndexuOt.length; i++) {
            var indexOt = seznamIndexuOt[i];
            var indexZav = seznamIndexuZav[i];

            var indexyOtZav = [];
            indexyOtZav.push(indexOt);
            indexyOtZav.push(indexZav);

            zavorkyOtZav.push(indexyOtZav);

        }

        return(zavorkyOtZav);


    }


    vratSeznamVyskytu(str, subStr){

        var hledejOdIndexu = -1;
        var seznamIndexu = [];

        for (let i = 0; i < str.length; i++) {

            var index = str.indexOf(subStr, hledejOdIndexu + 1);
            if(index > -1){
                seznamIndexu.push(index);
                hledejOdIndexu = index;
            }
            else{
                break;
            }

        }

        return(seznamIndexu);

    }


    getIndicesOf(searchStr, str) {
        var searchStrLen = searchStr.length;
        var indices = [];
        var index;

        if (searchStrLen == 0) {
            return [];
        }
        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            indices.push(index);
            var startIndex = index + searchStrLen;
        }
        return indices;
    }


    ziskejPoleVsechSpanClass(cimNahradArrHtml){

        var poleClass = [];

        for (let i = 0; i < cimNahradArrHtml.length; i++) {
            var radek = cimNahradArrHtml[i];
            var rSpl = radek.split('">');
            var spanClass = rSpl[0];
            var radekClass = spanClass + '">';

            poleClass.push(radekClass);
        }

        return(poleClass);

    }


    ziskejPoleRadkuBezClass(cimNahradArrHtml, poleVsechSpanClass){

        console.log(cimNahradArrHtml);
        console.log(poleVsechSpanClass);

        var poleRadkuBezClass = [];

        for (let i = 0; i < cimNahradArrHtml.length; i++) {
            var radek = cimNahradArrHtml[i];
            var radekClass = poleVsechSpanClass[i];
            var radekBezClass = radek.replace(radekClass, '');

            poleRadkuBezClass.push(radekBezClass);

        }

        console.log(poleRadkuBezClass);
        return(poleRadkuBezClass);

    }


    ziskejPoleRadkuBezClassEnd(poleRadkuBezClass){

        var poleRadkuBezClassEnd = [];

        for (let i = 0; i < poleRadkuBezClass.length; i++) {
            var radek = poleRadkuBezClass[i];
            var radekBezSpanEnd = radek.replaceAll('</span>','');
            poleRadkuBezClassEnd.push(radekBezSpanEnd);
        }

        return(poleRadkuBezClassEnd);

    }


    vyhledejIndexyRadku(poleRadkuBezClassEnd, coNahradArrHtml){
        console.log(poleRadkuBezClassEnd);
        var indexyRadkuArr = []
        var hledejOdIndexu = 0;
        var coNahradArrHtmlCopy = [...coNahradArrHtml];

        for (let i = 0; i < poleRadkuBezClassEnd.length; i++) {
            var slovo = poleRadkuBezClassEnd[i];
            
            var indexRadkySeSlovem = this.vratIndexRadkuSeSlovem(coNahradArrHtmlCopy, slovo, hledejOdIndexu);
            indexyRadkuArr.push(indexRadkySeSlovem);

            //upravi data, aby ta stejna znovu nehledal
            coNahradArrHtmlCopy = this.umazNalezenouPolozku(coNahradArrHtmlCopy, slovo, indexRadkySeSlovem);
            
        }

        console.log(indexyRadkuArr);
        return(indexyRadkuArr);

    }


    opravPIndexyRadkuArr(poleRadkuBezClassEnd, indexyRadkuArr){

        console.log(poleRadkuBezClassEnd);
        console.log(indexyRadkuArr);

        for (let i = 2; i < indexyRadkuArr.length; i++) {

            var opravIndexRadku = this.vratIndexRadkuOpr(poleRadkuBezClassEnd, indexyRadkuArr, i);
            if(opravIndexRadku != -1){
                indexyRadkuArr[i-1] = opravIndexRadku;
            }

        }

        return(indexyRadkuArr);

    }


    vratIndexRadkuOpr(poleRadkuBezClassEnd, indexyRadkuArr, i){

        var ind1 = indexyRadkuArr[i-2];
        var ind2 = indexyRadkuArr[i-1];
        var ind3 = indexyRadkuArr[i];

        var clEnd2 = poleRadkuBezClassEnd[i-1];
        var opravIndexRadku = -1;
    
        if(ind2 == -1){
            if(clEnd2 == 'p'){
                if(ind1 == ind3){
                    opravIndexRadku = ind1;
                }
            } 
        }

        return(opravIndexRadku);

    }


    umazNalezenouPolozku(coNahradArrHtmlCopy, slovo, indexRadky){

        var radka = coNahradArrHtmlCopy[indexRadky];
        var radkaNew;
        if(radka != undefined){
            radkaNew = radka.replace(slovo, '');
        }
        else {
            radkaNew = undefined;
        }
            
        coNahradArrHtmlCopy[indexRadky] = radkaNew;

        return(coNahradArrHtmlCopy);

    }


    vratIndexRadkuSeSlovem(coNahradArrHtml, slovo, hledejOdIndexu){
        
        var coNahradArrHtml = [...coNahradArrHtml];
        var indexRadkySeSlovem = -1;

        //ziska slovo jen uvnitr tagu
        slovo = this.vratSlovoJenUvnitrTagu(slovo);


        for (let i = hledejOdIndexu; i < coNahradArrHtml.length; i++) {
            
            var radek = coNahradArrHtml[i];
            var slovoJeNaRadku = this.detekujZdaNaRadkuJeSlovo(radek, slovo);
            
            if(slovoJeNaRadku == true){

                //pokud se slovo sklada pouze z 1 pismene, pak kontroluje i ostatni znaky
                if(slovo.length == 1){
                    
                    var slovoSousedniZnaky = ' ' + slovo + ' ';
                    slovoJeNaRadku = this.detekujZdaNaRadkuJeSlovo(radek, slovoSousedniZnaky);

                }

            }

            //pokud je slovoJeNaRadku stale true, pak jde kodem tudy:
            if(slovoJeNaRadku == true){
/*
                console.log(i);
                console.log(coNahradArrHtml);
                console.log(radek);
                console.log(slovo);
                console.log(slovoJeNaRadku);
*/
                indexRadkySeSlovem = i;
                break;

            }

        }


        if(indexRadkySeSlovem == -1){
            console.log(coNahradArrHtml);
            console.log(slovo);
            console.log(hledejOdIndexu);
            console.log(indexRadkySeSlovem);
        }
        
  
        return(indexRadkySeSlovem);

    }


    vratSlovoJenUvnitrTagu(slovo){

        var slovoNew = slovo;

        var obsahujeSlovoOdsazeni = this.detekujZdaNaRadkuJeSlovo(slovo, '_');
        if(obsahujeSlovoOdsazeni == true){
            var slovoOdsArr = slovo.split('_');
            slovoNew = slovoOdsArr[0];
        }

        return(slovoNew);

    }


    zkontrolujZdaSediSousedniZnaky(radek, slovo){

        var slovoSousedniZnaky = ' ' + slovo + ' ';


    }


    detekujZdaNaRadkuJeSlovo(radka, substr){

        var slovoJeNaRadku;
        var indSubstr = radka.indexOf(substr);
        if(indSubstr > -1){
            slovoJeNaRadku = true;
        }
        else{
            slovoJeNaRadku = false;
        }

        return(slovoJeNaRadku);

    }



}



//obsahuje aktualne nastavena data z comboboxu nebo buttonu
var jsonProAktualizaciRadku;

//obsahuje originalni data pro zobrazeni stranky - originalni (pri nacteni)
var jsonHtmlOrig;

//obsahuje modifikovana data pro zobrazeni stranky - modifikovana pri nejake akci
var jsonHtmlModif;

//appendString pro pridani tabulky
//je ulozen globalne, aby mohl byt zdrojak tabulky prebarven
var tableSrc;

//uchovava soucasne i indexy radku '</tr>'
var indexyRadkuTr = [];

//uchovava data pred obarvenim
var textSrcData;

//tady uchovava data, kde se ukladají data pro přebarveni zdrojaku
var coNahradArrJs = undefined;
var cimNahradArrJs = undefined;

//aby dokazal vytisknout zdrojak na novou html stranku, je treba uchovavat data
var poleTextSrc;
var poleRowTypeSrc;




//udalost pri kliknuti na tlacitko
$(document).on("click", "button", function(){
    var buttClick = new modifikujJsonProAktualizaciDat(jsonProAktualizaciRadku, this.id, '%button%');
    jsonProAktualizaciRadku = buttClick.getJsonProAktualizaciRadku();

    var upDateHtml = new updatujHtml(jsonHtmlOrig, jsonHtmlModif, jsonProAktualizaciRadku, this.id);

});


//udalost pri zmene comboboxu
$(document).on('change', '.comboSrc', function (e) {
    var val = $(e.target).val();
    var selectOption = new modifikujJsonProAktualizaciDat(jsonProAktualizaciRadku, this.id, val);
    jsonProAktualizaciRadku = selectOption.getJsonProAktualizaciRadku();
    
    var upDateHtml = new updatujHtml(jsonHtmlOrig, jsonHtmlModif, jsonProAktualizaciRadku, '.comboSrc');

});


//vola tridu pri zmene comba - tim vyhledava spravny json pro vykreslovani
$(document).on('change', '#combo_0', function (e) {
    cimNahradArrJs = undefined;
    var vyberJsonu = new nactiJson();
});

//vola tridu pri zmene comba - tim vyhledava spravny json pro vykreslovani
$(document).on('change', '#combo_2', function (e) {
    cimNahradArrJs = undefined;
    var vyberJsonu = new nactiJson();
});

//udalost, kdyz se zmeni(prida) '#combo_1'
$(document).on('DOMNodeInserted', '#combo_1', function () {
    cimNahradArrJs = undefined;
    var vyberJsonu = new nactiJson();
});

//udalost prijimajici data z scriptTree (pri kliknuti do stromu)
$(document).on('DOMNodeInserted', '.inputJsonName', function () {
    var jsonName = $('.inputJsonName').val();
    $('.inputJsonName').remove();

    //aktualizuje data
    var novaData = new vytvorNahledASrc(jsonName);
});

//udalost prijimajici data z scriptKey - prijme nazev souboru - jsonu vyhleda text a vrati text do inputboxu zpet
$(document).on('DOMNodeInserted', '.inputKeyJsonName', function () {
    var jsonName = $('.inputKeyJsonName').val();
    //var dataKPorovnaniKlicu = new ziskejDataProPorovnaniKlicu(jsonName);
});

//udalost, ktera prijme barevny text a zavola tridu ktera text prebarvi
$(document).on('DOMNodeInserted', '.coloredTextData', function () {
    var coloredTextData = $('.coloredTextData').val();
    var obarviText = new prijmiAPrepisBarevnyText(coloredTextData);

    $('.coloredTextData').remove();
});


//udalost, ktera na zaklade vygenerovani posledniho radku v tabulce zacne prebarvovat text
//vytvori se duplicitni kod do '.srcForColoring', ktery bude prebarven, pmoci 'hljs.initHighlightingOnLoad();'
// kod bude skrytysrcForColoring
/*
$(document).on('DOMNodeInserted', '#lastRow', function () {

    
    if(cimNahradArrJs == undefined){

        //ziska barevny text pro javascript
        var obarveniTextu = new obarviSrcUsingHighLight('js', undefined);
  
        //znovu updatuje data, je potreba zmenit barvy
        var upDateHtml = new updatujHtml(jsonHtmlOrig, jsonHtmlModif, jsonProAktualizaciRadku);

        //ziska barevny text pro html
        var obarveniTextu = new obarviSrcUsingHighLight('html');

        //schovava pomocny zdrojak
        //$('.srcForColoring').hide();

    }
    
    
});
*/


//testuji fumkcionalitu zde
//pak bude pridano na radek : cca 3400
class test{

    constructor(){

        var indexy = [24, 47];
        var radekCo = '&emsp;&emsp;&emsp;<span class="hljs-tag">&lt;p class="dotted"&gt;A dotted border.&lt;/p&gt;';
        var indexJeUvnitrTaguArr = this.vratPoleBoolIndexyZdaJsouVTagach(indexy, radekCo);

        console.log(indexJeUvnitrTaguArr);

    }


    vratPoleBoolIndexyZdaJsouVTagach(indexy, radekCo){

        var zavorkyOtZav = this.ziskejSeznamIndexuTagu(radekCo);
        console.log(zavorkyOtZav);
        var indexJeUvnitrTaguArr = [];

        for (let i = 0; i < indexy.length; i++) {

            var index = indexy[i];
            var indexJeUvnitrTagu = this.detekujZdaIndexJeUvnitrTagu(index, zavorkyOtZav);

            console.log(indexJeUvnitrTagu);
            indexJeUvnitrTaguArr.push(indexJeUvnitrTagu);

        }

        return(indexJeUvnitrTaguArr);

    }


    detekujZdaIndexJeUvnitrTagu(index, zavorkyOtZav){

        var indexJeUvnitrTagu = false;

        for (let i = 0; i < zavorkyOtZav.length; i++) {
            var zavOt = zavorkyOtZav[i][0];
            var zavZav = zavorkyOtZav[i][1];

            if(index > zavOt){
                if(index < zavZav){
                    indexJeUvnitrTagu = true;
                    break;
                }
            }
        }

        return(indexJeUvnitrTagu);

    }


    ziskejSeznamIndexuTagu(radekCo){

        var zavorkyOtZav = [];
        var seznamIndexuOt = this.vratSeznamVyskytu(radekCo, '<');
        var seznamIndexuZav = this.vratSeznamVyskytu(radekCo, '>');

        for (let i = 0; i < seznamIndexuOt.length; i++) {
            var indexOt = seznamIndexuOt[i];
            var indexZav = seznamIndexuZav[i];

            var indexyOtZav = [];
            indexyOtZav.push(indexOt);
            indexyOtZav.push(indexZav);

            zavorkyOtZav.push(indexyOtZav);

        }

        return(zavorkyOtZav);


    }


    vratSeznamVyskytu(str, subStr){

        var hledejOdIndexu = -1;
        var seznamIndexu = [];

        for (let i = 0; i < str.length; i++) {

            var index = str.indexOf(subStr, hledejOdIndexu + 1);
            if(index > -1){
                seznamIndexu.push(index);
                hledejOdIndexu = index;
            }
            else{
                break;
            }

        }

        return(seznamIndexu);

    }


}



$(document).ready(function(){
    //var test1 = new test();
    var dataJsonDefault = new nactiJson();
});

