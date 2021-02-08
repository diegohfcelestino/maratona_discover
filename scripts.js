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
    },
}

const Transaction = {
    all: Storage.get(),

    add(transaction, formType){
        if (formType=='simple'){
            Transaction.all.push(transaction)
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

        //Transaction.all.push(transaction)
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()
    },

    incomes() {
        let income = 0;
        Transaction.all.forEach(transaction => {
            if( transaction.amount > 0 ) {
                income += transaction.amount;
            }
        })
        return income;
    },

    expenses() {
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if( transaction.amount < 0 ) {
                expense += transaction.amount;
            }
        })
        return expense;
    },

    total() {
        return Transaction.incomes() + Transaction.expenses();
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
        `

        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
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
        yearToAdd=Math.floor(monthBefore/12)
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
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    descriptionM: document.querySelector('input#descriptionM'),
    partM: document.querySelector('input#partM'),
    amountM: document.querySelector('input#amountM'),
    dateM: document.querySelector('input#dateM'),

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
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
        Form.descriptionM.value = ""
        Form.partM.value = ""
        Form.amountM.value = ""
        Form.dateM.value = ""
    },

    submit(event, formType) {
        event.preventDefault()
        try {
            Form.validateFields(formType)
            const transaction = Form.formatValues(formType)
            Transaction.add(transaction, formType)
            Form.clearFields()
            Modal.close()
        } catch (error) {
            alert(error.message)
        }
    }
}

const calculations = { 
    sumTransactions(){
        // Cria uma nova lista
        sumIncome=[]
        sumExpense=[]
        sumAll=[]

        // Parametros externos
        indexCount = 0
        lengthTransactions = Transaction.all.length
        
        // Para cada transação
        while (indexCount<lengthTransactions) {
            if (Transaction.all[indexCount].amount>=0){
                sumIncome=calculations.checkInList(sumIncome, Transaction.all[indexCount].description, Transaction.all[indexCount].amount/100)
            }
            else{
                sumExpense=calculations.checkInList(sumExpense, Transaction.all[indexCount].description, Transaction.all[indexCount].amount/100)
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
        // Cria a nova lista
        endList=[]

        // Parametros externos
        indexCount = 0
        lengthTransactions = startList.length

        // Para cada transação 
        while (indexCount<lengthTransactions){
            // Ver o tamanho da lista
            internalLengthTransactions = endList.length

            //Se for zerada
            if (internalLengthTransactions==0){
                // Aprende
                endList.push(startList[indexCount])
            }

            //Se já tem informação
            else{
                // Inicie do zero
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
        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
        sumIncomeExpense=calculations.sumTransactions()
        google.charts.load('current', {'packages':['corechart']});
        google.setOnLoadCallback(function() { drawChart(true); });
        google.setOnLoadCallback(function() { drawChart(false); });
        google.setOnLoadCallback(drawChartTotal);
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()

function drawChart(graficsBig) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    color=[]
    if (graficsBig){
        title='As cinco maiores entradas'
        listToGrafics=calculations.transationsInOrder(sumIncomeExpense[0], graficsBig)
        div='income_chart_div'
        correction=1
        color=['darkgreen','forestgreen','green','lime','chartreuse']
    }
    else{
        title='As cinco maiores Saídas'
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

//Calculo do gráfico
    if (incomesAmount>=expensesAmount){
        title='Carteira está SAUDAVEL'
        color=['darkred','forestgreen','darkgreen']
        data.addRows([
            ['Saídas do período', expensesAmount]
        ]);
        data.addRows([
            ['Entradas do período', incomesAmount]
        ]);
        data.addRows([
            ['Liquido', incomesAmount-expensesAmount]
        ]);
    }
    else{
        title='Carteira está em RISCO'
        color=['Darkgreen','Red','darkred']
        data.addRows([
            ['Entradas do período', incomesAmount]
        ]);
        data.addRows([
            ['Saidas do período', expensesAmount]
        ]);
        data.addRows([
            ['Liquido', expensesAmount-incomesAmount]
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