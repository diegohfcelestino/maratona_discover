const Modal = {
    openSimple(){
        // Abrir modal simples
        // Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay.simple')
            .classList
            .add('active')
    },

    openMult(){
        // Abrir modal mult
        // Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay.mult')
            .classList
            .add('active')
    },
    
    openEdit(index){
        // Abrir modal mult
        // Adicionar a class active ao modal
        transaction=Transaction.all[index]
        Form.addInformationInForm(index, transaction)  
        document
            .querySelector('.modal-overlay.edit')
            .classList
            .add('active')
    },
    
    openFilter(){
        // Abrir modal mult
        // Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay.filter')
            .classList
            .add('active')
    },

    close(){
        // fechar o modal
        // remover a class active do modal
        document
            .querySelector('.modal-overlay.active')
            .classList
            .remove('active')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
        
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),
    
    add(transaction, formType){
        finalTransaction=''
        if (formType=='simple'){
            finalTransaction=transaction
            Transaction.all.push(finalTransaction)
        }
        else if (formType=='mult'){
            localIndex=0
            localLen=transaction.part
            dateInPart=transaction.date.split("/")
            while (localIndex<localLen){
                finalDate=Utils.checkDate(dateInPart,localIndex)

                finalTransaction={
                    'description': transaction.description,
                    'amount': transaction.amount,
                    'date': finalDate
                }
                Transaction.all.push(finalTransaction)
                localIndex++
            }
        }
        let { dateStart, dateEnd} = App.getDataFilter()
        dateInParts=finalTransaction.date.split("/")
        date=String(dateInParts[2]+'-'+dateInParts[1]+'-'+dateInParts[0])

        
        checkFilter=Utils.checkTransactionDate(dateStart,dateEnd,date)
        if (checkFilter==false){
            dateStart=Utils.checkFilterDate(dateStart,date,false)
            dateEnd=Utils.checkFilterDate(dateEnd,date,true)
            document.getElementById('dateStart').value=String(dateStart)
            document.getElementById('dateEnd').value=String(dateEnd)
        }


    },

    edit(transaction) {
        indexOfTransaction=transaction.position
        finalTransaction={
            'description': transaction.description,
            'amount': transaction.amount,
            'date': transaction.date,
        }
        Transaction.all.splice(indexOfTransaction, 1, finalTransaction)

        
        
    },

    remove(index) {
        Transaction.all.splice(index, 1)
        
        App.init()
    },

    incomes(transactionsToScreen) {
        let income = 0;
        transactionsToScreen.forEach(transaction => {
            if( transaction.amount > 0 ) {
                income += transaction.amount;
            }
        })
        return income;
    },

    expenses(transactionsToScreen) {
        let expense = 0;
        transactionsToScreen.forEach(transaction => {
            if( transaction.amount < 0 ) {
                expense += transaction.amount;
            }
        })
        return expense;
    },

    total(transactionsToScreen) {
        return Transaction.incomes(transactionsToScreen) + Transaction.expenses(transactionsToScreen);
    },

    extract() {
        const transactions = Transaction.all;
        const incomes = Transaction.incomes(transactions);
        const expenses = Transaction.expenses(transactions);
        const total = Transaction.total(transactions);
     
        const currentDate = new Date();
     
        const date = {
          day: currentDate.getDay(),
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
          hours: currentDate.getHours(),
          minutes: currentDate.getMinutes(),
          seconds: currentDate.getSeconds(),
        };
     
        let text = `Extrato dev.finance$ - Data: ${`${date.day}/${date.month}/${date.year} - ${date.hours}:${date.minutes}:${date.seconds}\n`}`;
     
        text += transactions.reduce(
          (txt, transaction) =>
            (txt += `\n${transaction.date} - ${
              transaction.description
            }       ${Utils.formatCurrency(transaction.amount)}`),
          ""
        );
     
        text += `\n\nEntradas:        ${Utils.formatCurrency(incomes)}`;
        text += `\nSaídas:          ${Utils.formatCurrency(expenses)}`;
        text += `\nTotal:           ${Utils.formatCurrency(total)}`;
     
        Utils.downloadFile(text, "extrato.txt", "application/text");
      }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    footerContainer: document.querySelector('#data-table tfoot'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
    },

    addFooter(currencyPage, lastPage){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTableFooter(currencyPage, lastPage)
        DOM.footerContainer.appendChild(tr)
    },

    innerHTMLTableFooter(currencyPage, lastPage){
        html = `<th colspan=4>`
        backPage=currencyPage-1
        nextPage=currencyPage+1

        if (currencyPage<2){
            html = html+`<< < `
        }
        else{
            html = html+`<a class="page" href="#" onclick="App.navigation(1)"><<</a> <a class="page" href="#" onclick="App.navigation(${backPage})"><</a>`
        }
        html = html+` ${currencyPage} `
        if (currencyPage==lastPage){
            html = html+` > >>`
        }
        else{
            html = html+`<a class="page" href="#" onclick="App.navigation(${nextPage})">></a> <a class="page" href="#" onclick="App.navigation(${lastPage})">>></a>`
        }
        return html
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td class="commands">
                <img onclick="Modal.openEdit(${index})" src="./assets/edit.png" alt="Editar transação">
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
        `

        return html
    },

    updateBalance(transactionsToScreen) {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes(transactionsToScreen))
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses(transactionsToScreen))
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total(transactionsToScreen))
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    },

    clearTableFooter() {
        DOM.footerContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value){
        value = Number(value) * 100
        
        return Math.round(value)
    },

    formatInt(value){
        value = Number(value) * 1
        
        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

       return signal + value
    },

    checkDate(date, part){
        
        monthBefore=Number(date[1])+part
        
        yearToAdd=Math.ceil(monthBefore/12)-1
        
        monthAfter=monthBefore-(yearToAdd*12)-1
        
        yearAfter=(date[2]*1)+yearToAdd
        

        needCheckDate=true
        tryToCheck=0

        finalDate= new Date()
        
        while (needCheckDate)
        {
            
            finalDate.setFullYear(yearAfter, monthAfter, date[0]-tryToCheck);
    
            checkDay=finalDate.getDate()
            checkMonth=finalDate.getMonth()
            checkYear=finalDate.getFullYear()

            if ((date[0]-tryToCheck==checkDay) && (monthAfter==checkMonth) && (yearAfter==checkYear)){
                break
            }    
            tryToCheck=tryToCheck+1
        }
        

        finalDay=String(date[0]-tryToCheck)
        finalMonth=String(monthAfter+1)
        finalYear=String(yearAfter)

        if (finalDay.length<2){
            finalDay='0'+finalDay
        }

        if (finalMonth.length<2){
            finalMonth='0'+finalMonth
        }

        lastDate=finalDay+'/'+finalMonth+'/'+finalYear
        return lastDate
    },

    checkFilterDate(dateCurrency, dateToCheck, question){
        dateCurrencyInParts=dateCurrency.split("-")
        dateToCheckInParts=dateToCheck.split("-")
        internalFormatDateCurrency= new Date(dateCurrencyInParts[0],dateCurrencyInParts[1]-1,dateCurrencyInParts[2])
        internalFormatdateToCheck= new Date(dateToCheckInParts[0],dateToCheckInParts[1]-1,dateToCheckInParts[2])
        toReturn=dateCurrency
        if ((question && internalFormatdateToCheck>internalFormatDateCurrency) || (question==false && internalFormatdateToCheck<internalFormatDateCurrency)){
            toReturn=dateToCheck
        }
        return toReturn
    },

    checkTransactionDate(lowestDate, biggestDate, transactionDate){
        lowestDateInParts=lowestDate.split("-")
        biggestDateInParts=biggestDate.split("-")
        transactionDateInParts=transactionDate.split("-")
        internalFormatLowestDate= new Date(lowestDateInParts[0],lowestDateInParts[1]-1,lowestDateInParts[2])
        internalFormatBiggestDate= new Date(biggestDateInParts[0],biggestDateInParts[1]-1,biggestDateInParts[2])
        internalFormatTransactionDate= new Date(transactionDateInParts[0],transactionDateInParts[1]-1,transactionDateInParts[2])
        if (internalFormatTransactionDate>=internalFormatLowestDate && internalFormatTransactionDate<=internalFormatBiggestDate){
            return true
        }
        return false
    },

    downloadFile(data, name, type) {
        const blob = new Blob([data], {
          type: type,
        });
        const link = window.document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${name.trim().replace(/ +/g, "-")}`;
        link.click();
        window.URL.revokeObjectURL(link.href);
        return;
      }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    descriptionM: document.querySelector('input#descriptionM'),
    partM: document.querySelector('input#partM'),
    amountM: document.querySelector('input#amountM'),
    dateM: document.querySelector('input#dateM'),

    descriptionE: document.querySelector('input#descriptionE'),
    positionE: document.querySelector('input#idE'),
    amountE: document.querySelector('input#amountE'),
    dateE: document.querySelector('input#dateE'),

    dateStart: document.querySelector('input#dateStart'),
    dateEnd: document.querySelector('input#dateEnd'),
    itensPerPage: document.querySelector('input#itensPerPage'),
    page: document.querySelector('input#page'),

    getValues(formType) {
        if (formType=='simple'){
            return {
                description: Form.description.value,
                amount: Form.amount.value,
                date: Form.date.value
            }
        }
        else if (formType=='mult') {
            return {
                description: Form.descriptionM.value,
                part: Form.partM.value,
                amount: Form.amountM.value,
                date: Form.dateM.value
            }
        }
        else if (formType=='edit') {
            return {
                description: Form.descriptionE.value,
                position: Form.positionE.value,
                amount: Form.amountE.value,
                date: Form.dateE.value
            }
        }
        else if (formType=='filter') {
            return {
                dateStart: Form.dateStart.value,
                dateEnd: Form.dateEnd.value,
                itensPerPage: Form.itensPerPage.value,
                page: Form.page.value
            }
        }
    },

    addInformationInForm(index, transaction){
        document.getElementById('idE').value=index;
        document.getElementById('descriptionE').value=transaction.description;
        document.getElementById('amountE').value=transaction.amount/100;
        dateInParts=transaction.date.split("/")
        document.getElementById('dateE').value=String(dateInParts[2]+'-'+dateInParts[1]+'-'+dateInParts[0])
    },

    addInformationInFilterForm(startDate, finalDate, limit, page){
        startDateInParts=startDate.split("-")
        finalDateInParts=finalDate.split("-")
        document.getElementById('dateStart').value=String(startDateInParts[0]+'-'+startDateInParts[1]+'-'+startDateInParts[2])
        document.getElementById('dateEnd').value=String(finalDateInParts[0]+'-'+finalDateInParts[1]+'-'+finalDateInParts[2])
        document.getElementById('itensPerPage').value=String(limit)
        document.getElementById('page').value=String(page)
    },

    validateFields(formType) {
        if (formType=='simple')
        {
            const { description, amount, date } = Form.getValues(formType)    
            if( description.trim() === "" || 
                amount.trim() === "" || 
                date.trim() === "" ) 
            {
                throw new Error("Por favor, preencha todos os campos")
            }
        }
        else if (formType=='mult') {
            const { description, part, amount, date } = Form.getValues(formType)
            
            if( description.trim() === "" || 
                part.trim() === "" || 
                amount.trim() === "" || 
                date.trim() === "" ) 
            {
                throw new Error("Por favor, preencha todos os campos")
            }
            if( part.trim()*1 < 1) 
            {
                throw new Error("Por favor, preencha no mínimo uma parcela")
            }
        }
        else if (formType=='edit') {
            const { description, position, amount, date } = Form.getValues(formType)
            if( description.trim() === "" || 
                position.trim() === "" || 
                amount.trim() === "" || 
                date.trim() === "" ) 
            {
                throw new Error("Por favor, preencha todos os campos")
            }
        }
        else if (formType=='filter') {
            const { dateStart, dateEnd, itensPerPage, page} = Form.getValues(formType)
            if( dateStart.trim() === "" || 
                dateEnd.trim() === "" || 
                itensPerPage.trim() === "" || 
                page.trim() === "") 
            {
                throw new Error("Por favor, preencha todos os campos")
            }
            if( dateStart.trim() > dateEnd.trim()) 
            {
                throw new Error("Por favor, preencha a data inicial com um valor inferior a data final")
            }

        }
    },

    formatValues(formType) {
        if (formType=='simple'){
            let { description, amount, date } = Form.getValues(formType)
            
            amount = Utils.formatAmount(amount)
            date = Utils.formatDate(date)
            
            return {
                description,
                amount,
                date
            }

        }
        else if (formType=='mult'){
            let { description, part, amount, date } = Form.getValues(formType)
            
            part=Utils.formatInt(part)
            amount = Utils.formatAmount(amount)
            date = Utils.formatDate(date)

            return {
                description,
                part,
                amount,
                date
            }

        }
        else if (formType=='edit'){
            let { description, position, amount, date } = Form.getValues(formType)
            
            position=Utils.formatInt(position)
            amount = Utils.formatAmount(amount)
            date = Utils.formatDate(date)

            return {
                description,
                position,
                amount,
                date
            }
        }
        else if (formType=='filter'){
            let { dateStart, dateEnd, itensPerPage,page} = Form.getValues(formType)
            
            dateStart = Utils.formatDate(dateStart)
            dateEnd = Utils.formatDate(dateEnd)
            itensPerPage=Utils.formatInt(itensPerPage)
            page = Utils.formatInt(page)
            return {
                dateStart,
                dateEnd,
                itensPerPage,
                page
            }
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
        Form.descriptionM.value = ""
        Form.partM.value = ""
        Form.amountM.value = ""
        Form.dateM.value = ""
        Form.descriptionE.value = ""
        Form.positionE.value = ""
        Form.amountE.value = ""
        Form.dateE.value = ""
    },

    submit(event, formType) {
        event.preventDefault()
        try {
            Form.validateFields(formType)
            const transaction = Form.formatValues(formType)
            
            if (formType=='simple' || formType=='mult'){
                Transaction.add(transaction, formType)
            }
            else if (formType=='edit'){
                Transaction.edit(transaction, startDate, finalDate, itensPerPage, page)
            }
            Modal.close()
            Form.clearFields()
            App.init()
        } catch (error) {
            alert(error.message)
        }
    },
}

const calculations = { 
    sumTransactions(transactionsToScreen){
        // CRIA UMA NOVA LISTA
        sumIncome=[]
        sumExpense=[]
        sumAll=[]

        // PARAMETROS EXTERNOS
        indexCount = 0
        lengthTransactions = transactionsToScreen.length
        
        // PARA CADA TRANSAÇÃO
        while (indexCount<lengthTransactions) {
            if (transactionsToScreen[indexCount].amount>=0){
                sumIncome=calculations.checkInList(sumIncome, transactionsToScreen[indexCount].description, transactionsToScreen[indexCount].amount/100)
            }
            else{
                sumExpense=calculations.checkInList(sumExpense, transactionsToScreen[indexCount].description, transactionsToScreen[indexCount].amount/100)
            }
            indexCount++
        }
        sumAll.push(sumIncome)
        sumAll.push(sumExpense)
        return sumAll
    },

    checkInList(list, description, amount){
        insert=true
        indexCountInCheck = 0
        lengthList=list.length

        while (indexCountInCheck<lengthList){
            if (list[indexCountInCheck][0]==description){
                list[indexCountInCheck][1]=list[indexCountInCheck][1]+amount
                insert=false
                break
            }
            indexCountInCheck++
        }
        if (insert){
            list.push([description, amount])
        }
        return list
    },

    transationsInOrder(startList, maior){
        // CRIA UMA NOVA LISTA
        endList=[]

        // PARAMETROS EXTERNOS
        indexCount = 0
        lengthTransactions = startList.length

        // PARA CADA TRANSAÇÃO
        while (indexCount<lengthTransactions){
            // VEJA O TAMANHO DA NOVA LISTA
            internalLengthTransactions = endList.length

            //SE FOR ZERADA
            if (internalLengthTransactions==0){
                // APRENDE
                endList.push(startList[indexCount])
            }

            //SE JÁ HOUVER INFORMAÇÕES
            else{
                // COMECE DO 0
                internalIndexCount = 0
                while (internalIndexCount<internalLengthTransactions){  
                    if (maior){
                        if (endList[internalIndexCount][1]<startList[indexCount][1]){
                            break;
                        }
                    }
                    else {
                        if (endList[internalIndexCount][1]>startList[indexCount][1]){
                            break;
                        }
                    }
                    internalIndexCount++
                }
                endList.splice(internalIndexCount, 0, startList[indexCount])
            }    
            indexCount++
        }
        return endList;
    }, 
}

const App = {
    init() {
        Storage.set(Transaction.all)
        App.runningFilters()
        page = App.getDataPage()
        App.navigation(page)
    },

    navigation(page){
        document.getElementById('page').value=String(page)
        DOM.clearTransactions()
        itensPerPage = App.getDataLimit()
        transactions=App.itensToShow()
        
        lengthTransactions=transactions.length
        lastPage=Math.ceil(lengthTransactions/itensPerPage) 

        if (page>lastPage){
            page=lastPage
        }

        initial=itensPerPage*(page-1)
        final=itensPerPage*page

        transactionsToScreen=transactions.slice(initial,final)
        lengthTransactionsToScreen=transactionsToScreen.length

        localIndex=0
        while(localIndex<lengthTransactionsToScreen){
            DOM.addTransaction(transactionsToScreen[localIndex],initial+localIndex)
            localIndex++
        }
        DOM.clearTableFooter()
        DOM.addFooter(page, lastPage)
    },

    itensToShow(){
        transactions=Transaction.all
        let { dateStart, dateEnd} = App.getDataFilter()
        transactionsToScreen=[]
        internalIndex=0
        transactions.length
        while (internalIndex<transactions.length){
            
            dateInParts=transactions[internalIndex].date.split("/")
            date=String(dateInParts[2]+'-'+dateInParts[1]+'-'+dateInParts[0])

            checkAdd=Utils.checkTransactionDate(dateStart,dateEnd,date)
            if(checkAdd){
                transactionsToScreen.push(transactions[internalIndex])
            }
            internalIndex++
        }
                
        DOM.updateBalance(transactionsToScreen)  
        
        sumIncomeExpense=calculations.sumTransactions(transactionsToScreen)
        

        google.charts.load('current', {'packages':['corechart']});
        google.setOnLoadCallback(function() { drawChart(true); });
        google.setOnLoadCallback(function() { drawChart(false); });
        google.setOnLoadCallback(drawChartTotal);

        return transactionsToScreen
    },

    runningFilters(){
        transactions=Transaction.all
        startDate= document.querySelector('input#dateStart').value
        finalDate= document.querySelector('input#dateEnd').value
        itensPerPage= Form.itensPerPage.value,
        page= Form.page.value
        if (startDate=='' || finalDate=='') {
            internalIndex=0
            transactions.length
            while (internalIndex<transactions.length){
                if (startDate=='' || finalDate==''){
                    startDateInParts=transactions[internalIndex].date.split("/")
                    startDate=String(startDateInParts[2]+'-'+startDateInParts[1]+'-'+startDateInParts[0])
                    finalDateInParts=transactions[internalIndex].date.split("/")
                    finalDate=String(finalDateInParts[2]+'-'+finalDateInParts[1]+'-'+finalDateInParts[0])
                }
                else{
                    transactionDateInParts=transactions[internalIndex].date.split("/")
                    transactionDate=String(transactionDateInParts[2]+'-'+transactionDateInParts[1]+'-'+transactionDateInParts[0])
                    startDate=Utils.checkFilterDate(startDate,transactionDate,false)
                    finalDate=Utils.checkFilterDate(finalDate,transactionDate,true)
                }
                internalIndex++
            }
        }
        
        if (itensPerPage=='') {
            itensPerPage=15
        }
        
        if (page=='') {
            page=1
        }
        
        Form.addInformationInFilterForm(startDate, finalDate, itensPerPage, page)
    },

    getDataFilter(){
        dateStart= document.querySelector('input#dateStart').value,
        dateEnd= document.querySelector('input#dateEnd').value
        return {
            dateStart,
            dateEnd
        }
    },

    getDataLimit(){
        itensPerPage= document.querySelector('input#itensPerPage').value
        return itensPerPage
    },

    getDataPage(){
        page= document.querySelector('input#page').value
        return page
    }

}

App.init()

function drawChart(graficsBig) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    color=[]
    if (graficsBig){
        title='A cinco maiores entradas'
        listToGrafics=calculations.transationsInOrder(sumIncomeExpense[0], graficsBig)
        div='income_chart_div'
        correction=1
        color=['darkgreen','forestgreen','green','lime','chartreuse']
    }
    else{
        title='As cinco maiores saídas'
        listToGrafics=calculations.transationsInOrder(sumIncomeExpense[1], graficsBig)
        div='expense_chart_div'
        correction=-1
        color=['DarkRed','Red','Firebrick','IndianRed','LightCoral']
    }

    if (listToGrafics.length>5){
        listToGrafics=listToGrafics.slice(0,5)
    }
    finalIndex=0
    finalLength=listToGrafics.length

    while (finalIndex<finalLength){
        data.addRows([
            [listToGrafics[finalIndex][0], listToGrafics[finalIndex][1]*correction]
        ]);
        finalIndex++
    }
    var options = {
        title: title,
        legend: 'none',
        pieHole: 0.1,
        
        slices: {
            0: { color: color[0] },
            1: { color: color[1] },
            2: { color: color[2] },
            3: { color: color[3] },
            4: { color: color[4] }
          }
    };

    var chart = new google.visualization.PieChart(document.getElementById(div));
    chart.draw(data, options);
}

function drawChartTotal() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    color=[]

    incomesList=calculations.transationsInOrder(sumIncomeExpense[0], true)
    incomesIndex=0
    incomesLength=incomesList.length
    incomesAmount=0
    while (incomesIndex<incomesLength){
        incomesAmount=incomesAmount+incomesList[incomesIndex][1]
        incomesIndex++
    }
    
    expensesList=calculations.transationsInOrder(sumIncomeExpense[1], false)
    expensesIndex=0
    expensesLength=expensesList.length
    expensesAmount=0
    while (expensesIndex<expensesLength){
        expensesAmount=expensesAmount+expensesList[expensesIndex][1]*-1
        expensesIndex++
    }


    if (incomesAmount>=expensesAmount){
        title='Carteira está Saudavel'
        color=['DarkRed','forestgreen','darkgreen']
        data.addRows([
            ['Saídas do período', expensesAmount]
        ]);
        data.addRows([
            ['Entradas do período', incomesAmount]
        ]);
        data.addRows([
            ['Líquido', incomesAmount-expensesAmount]
        ]);
    }
    else{
        title='Carteira está em Risco'
        color=['forestgreen','DarkRed','Red']
        data.addRows([
            ['Entradas do período', incomesAmount]
        ]);
        data.addRows([
            ['Saídas do período', expensesAmount]
        ]);
        data.addRows([
            ['Líquido', expensesAmount-incomesAmount]
        ]);
    }

    var options = {
        title: title,
        legend: 'none',
        pieHole: 0.1,
        
        slices: {
            0: { color: color[0] },
            1: { color: color[1] },
            2: { color: color[2] }
          }
    };

    var chart = new google.visualization.PieChart(document.getElementById('total_chart_div'));
    chart.draw(data, options);
}



