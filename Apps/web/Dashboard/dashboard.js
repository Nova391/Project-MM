let allAccounts = []
let allCategories = []

/* === GREETINGS === */

function updateGreeting() {

    const hour = new Date().getHours()

    const greetingElement = document.querySelector(".dashboardHeader h2")

    let greeting = "Good evening"

    if (hour >= 5 && hour < 12) {
        greeting = "Good morning"
    }

    else if (hour >= 12 && hour < 18) {
        greeting = "Good afternoon"
    }

    greetingElement.textContent = `${greeting}, Sir`
}

updateGreeting()

/* === EXCHANGE RATE === */

function getExchangeRate() {

    return fetch("https://api.frankfurter.dev/v2/rate/USD/ILS")
        .then(response => response.json())
        .then(data => {
            return data.rate
        })
}

/* === GET ACCOUNTS === */

function getAccounts() {

    return fetch("http://127.0.0.1:8000/accounts", {
        credentials: "include"
    })
        .then(response => response.json())
        .then(accounts => {

            allAccounts = accounts

            fillAccountSelects()

            return accounts
        })
}

/* === TOTAL BALANCE === */

const totalBalance = document.querySelector("#totalBalance")
const balanceCurrency = document.querySelector("#balanceCurrency")
const balanceMeta = document.querySelector("#balanceMeta")

function getAccountsBalance() {

    getAccounts().then(accounts => {

        let totalILSBalance = 0
        let totalUSDBalance = 0

        accounts.forEach(account => {

            const currency = account[3]
            const balance = Number(account[4])

            if (currency === "ILS") {
                totalILSBalance += balance
            }

            else if (currency === "USD") {
                totalUSDBalance += balance
            }
        })

        return getExchangeRate().then(exchangeRate => {

            if (balanceCurrency.value === "ILS") {

                const totalUSDinILS = totalUSDBalance * exchangeRate

                const totalBalanceInILS = totalILSBalance + totalUSDinILS

                totalBalance.textContent = `₪${totalBalanceInILS.toFixed(2)}`
            }

            else {

                const totalILSInUSD = totalILSBalance / exchangeRate

                const totalBalanceInUSD = totalUSDBalance + totalILSInUSD

                totalBalance.textContent = `$${totalBalanceInUSD.toFixed(2)}`
            }

            let currencies = 0

            let hasILS = false
            let hasUSD = false

            accounts.forEach(account => {

                if (account[3] === "ILS") {
                    hasILS = true
                }

                if (account[3] === "USD") {
                    hasUSD = true
                }
            })

            if (hasILS) {
                currencies++
            }

            if (hasUSD) {
                currencies++
            }

            balanceMeta.textContent = `${currencies} currencies · ${accounts.length} accounts`
        })
    })
}

balanceCurrency.addEventListener("change", function () {

    getAccountsBalance()
    getMonthlyMovement()
})

/* === MONTHLY MOVEMENT === */

const monthlyIncome = document.querySelector("#monthlyIncome")
const monthlyExpenses = document.querySelector("#monthlyExpenses")

function getMonthlyMovement() {

    fetch("http://127.0.0.1:8000/transactions", {
        credentials: "include"
    })
        .then(response => response.json())
        .then(transactions => {

            return getAccounts().then(accounts => {

                let incomeILS = 0
                let incomeUSD = 0

                let expenseILS = 0
                let expenseUSD = 0

                const now = new Date()

                const currentMonth = now.getMonth()
                const currentYear = now.getFullYear()

                transactions.forEach(transaction => {

                    const accountId = transaction[7]

                    const account = accounts.find(account => account[0] === accountId)

                    if (!account) {
                        return
                    }

                    const currency = account[3]

                    const amount = Number(transaction[1])

                    const type = transaction[0]

                    const date = new Date(transaction[4])

                    if (
                        date.getMonth() !== currentMonth ||
                        date.getFullYear() !== currentYear
                    ) {
                        return
                    }

                    if (type === "Income") {

                        if (currency === "ILS") {
                            incomeILS += amount
                        }

                        else if (currency === "USD") {
                            incomeUSD += amount
                        }
                    }

                    else if (type === "Expense") {

                        if (currency === "ILS") {
                            expenseILS += amount
                        }

                        else if (currency === "USD") {
                            expenseUSD += amount
                        }
                    }
                })

                return getExchangeRate().then(exchangeRate => {

                    if (balanceCurrency.value === "ILS") {

                        const incomeUSDinILS = incomeUSD * exchangeRate
                        const totalIncomeILS = incomeILS + incomeUSDinILS

                        const expenseUSDinILS = expenseUSD * exchangeRate
                        const totalExpenseILS = expenseILS + expenseUSDinILS

                        monthlyIncome.textContent = `+₪${totalIncomeILS.toFixed(2)}`
                        monthlyExpenses.textContent = `-₪${totalExpenseILS.toFixed(2)}`
                    }

                    else {

                        const incomeILSInUSD = incomeILS / exchangeRate
                        const totalIncomeUSD = incomeUSD + incomeILSInUSD

                        const expenseILSInUSD = expenseILS / exchangeRate
                        const totalExpenseUSD = expenseUSD + expenseILSInUSD

                        monthlyIncome.textContent = `+$${totalIncomeUSD.toFixed(2)}`
                        monthlyExpenses.textContent = `-$${totalExpenseUSD.toFixed(2)}`
                    }
                })
            })
        })
}

/* === LOAD CATEGORIES === */

function getCategories() {

    return fetch("http://127.0.0.1:8000/categories", {
        credentials: "include"
    })
        .then(response => response.json())
        .then(categories => {

            allCategories = categories

            fillCategorySelects()

            return categories
        })
}

/* === ACCOUNT SELECTS === */

function fillAccountSelects() {

    const incomeAccount = document.querySelector("#incomeAccount")
    const expenseAccount = document.querySelector("#expenseAccount")
    const transferFrom = document.querySelector("#transferFrom")
    const transferTo = document.querySelector("#transferTo")

    incomeAccount.innerHTML = ""
    expenseAccount.innerHTML = ""
    transferFrom.innerHTML = ""
    transferTo.innerHTML = ""

    allAccounts.forEach(account => {

        const option1 = document.createElement("option")
        option1.value = account[0]
        option1.textContent = `${account[1]} (${account[3]})`

        const option2 = document.createElement("option")
        option2.value = account[0]
        option2.textContent = `${account[1]} (${account[3]})`

        const option3 = document.createElement("option")
        option3.value = account[0]
        option3.textContent = `${account[1]} (${account[3]})`

        const option4 = document.createElement("option")
        option4.value = account[0]
        option4.textContent = `${account[1]} (${account[3]})`

        incomeAccount.appendChild(option1)
        expenseAccount.appendChild(option2)
        transferFrom.appendChild(option3)
        transferTo.appendChild(option4)
    })
}

/* === CATEGORY SELECTS === */

function fillCategorySelects() {

    const incomeCategory = document.querySelector("#incomeCategory")
    const expenseCategory = document.querySelector("#expenseCategory")

    incomeCategory.innerHTML = ""
    expenseCategory.innerHTML = ""

    allCategories.forEach(category => {

        if (category[2] === "Income") {

            const option = document.createElement("option")

            option.value = category[0]
            option.textContent = category[1]

            incomeCategory.appendChild(option)
        }

        if (category[2] === "Expense") {

            const option = document.createElement("option")

            option.value = category[0]
            option.textContent = category[1]

            expenseCategory.appendChild(option)
        }
    })
}

/* === MODALS === */

const incomeModal = document.querySelector("#incomeModal")

const expenseModal = document.querySelector("#expenseModal")

const transferModal = document.querySelector("#transferModal")

document.querySelector("#addIncomeButton").addEventListener("click", function () {
    incomeModal.classList.add("active")
})

document.querySelector("#addExpenseButton").addEventListener("click", function () {
    expenseModal.classList.add("active")
})

document.querySelector("#transferButton").addEventListener("click", function () {
    transferModal.classList.add("active")
})

document.querySelector("#closeIncomeModal").addEventListener("click", function () {
    incomeModal.classList.remove("active")
})

document.querySelector("#closeExpenseModal").addEventListener("click", function () {
    expenseModal.classList.remove("active")
})

document.querySelector("#closeTransferModal").addEventListener("click", function () {
    transferModal.classList.remove("active")
})

document.querySelector("#cancelIncome").addEventListener("click", function () {
    incomeModal.classList.remove("active")
})

document.querySelector("#cancelExpense").addEventListener("click", function () {
    expenseModal.classList.remove("active")
})

document.querySelector("#cancelTransfer").addEventListener("click", function () {
    transferModal.classList.remove("active")
})

/* === SET TODAY === */

function setToday() {

    const today = new Date()

    const year = today.getFullYear()

    const month = String(today.getMonth() + 1).padStart(2, "0")

    const day = String(today.getDate()).padStart(2, "0")

    const date = `${year}-${month}-${day}`

    document.querySelector("#incomeDate").value = date
    document.querySelector("#expenseDate").value = date
    document.querySelector("#transferDate").value = date
}

setToday()

/* === ADD INCOME === */

document.querySelector("#incomeForm").addEventListener("submit", function (event) {

    event.preventDefault()

    const data = {
        account_id: Number(document.querySelector("#incomeAccount").value),
        amount: Number(document.querySelector("#incomeAmount").value),
        type: "Income",
        category_id: Number(document.querySelector("#incomeCategory").value),
        date: document.querySelector("#incomeDate").value,
        description: document.querySelector("#incomeDescription").value
    }

    fetch("http://127.0.0.1:8000/transactions", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        credentials: "include",

        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {

            if (result.error || result.detail) {

                document.querySelector("#incomeMessage").textContent =
                    result.error || result.detail

                return
            }

            document.querySelector("#incomeMessage").textContent = ""

            incomeModal.classList.remove("active")

            document.querySelector("#incomeForm").reset()

            setToday()

            getAccountsBalance()

            getMonthlyMovement()

            getRecentTransactions()
        })
})

/* === ADD EXPENSE === */

document.querySelector("#expenseForm").addEventListener("submit", function (event) {

    event.preventDefault()

    const data = {
        account_id: Number(document.querySelector("#expenseAccount").value),
        amount: Number(document.querySelector("#expenseAmount").value),
        type: "Expense",
        category_id: Number(document.querySelector("#expenseCategory").value),
        date: document.querySelector("#expenseDate").value,
        description: document.querySelector("#expenseDescription").value
    }

    fetch("http://127.0.0.1:8000/transactions", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        credentials: "include",

        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {

            if (result.error || result.detail) {

                document.querySelector("#expenseMessage").textContent =
                    result.error || result.detail

                return
            }

            document.querySelector("#expenseMessage").textContent = ""

            expenseModal.classList.remove("active")

            document.querySelector("#expenseForm").reset()

            setToday()

            getAccountsBalance()

            getMonthlyMovement()

            getRecentTransactions()
        })
})

/* === TRANSFER === */

document.querySelector("#transferForm").addEventListener("submit", function (event) {

    event.preventDefault()

    const message = document.querySelector("#transferMessage")

    const fromAccount = Number(document.querySelector("#transferFrom").value)

    const toAccount = Number(document.querySelector("#transferTo").value)

    const amount = Number(document.querySelector("#transferAmount").value)

    if (fromAccount === toAccount) {

        message.textContent = "You cannot transfer to the same account"

        return
    }

    if (amount <= 0) {

        message.textContent = "Amount must be greater than 0"

        return
    }

    message.textContent = "Transfer system is not connected yet"
})

/* === RECENT TRANSACTIONS === */

function getRecentTransactions() {

    const list = document.querySelector("#recentTransactionList")

    fetch("http://127.0.0.1:8000/transactions", {
        credentials: "include"
    })
        .then(response => response.json())
        .then(transactions => {

            list.innerHTML = ""

            transactions.slice(0, 5).forEach(transaction => {

                const item = document.createElement("div")
                item.classList.add("transaction-item")

                const icon = document.createElement("div")
                icon.classList.add("tx-icon")

                if (transaction[0] === "Income") {
                    icon.classList.add("income")
                } else {
                    icon.classList.add("expense")
                }

                const iconElement = document.createElement("i")

                iconElement.setAttribute(
                    "data-lucide",
                    getTransactionIcon(transaction[3])
                )

                icon.appendChild(iconElement)

                const details = document.createElement("div")
                details.classList.add("tx-details")

                const name = document.createElement("h4")
                name.textContent = transaction[3] || "Transaction"

                const description = document.createElement("p")
                description.textContent = transaction[5] || transaction[2]

                details.appendChild(name)
                details.appendChild(description)

                const amount = document.createElement("div")
                amount.classList.add("tx-amount")

                if (transaction[0] === "Income") {

                    amount.classList.add("positive")

                    amount.textContent = `+${transaction[1]}`
                }

                else {

                    amount.classList.add("negative")

                    amount.textContent = `-${transaction[1]}`
                }

                item.appendChild(icon)
                item.appendChild(details)
                item.appendChild(amount)

                list.appendChild(item)
            })

            lucide.createIcons()
        })
}

/* === TRANSACTION ICONS === */

function getTransactionIcon(category) {

    if (category === "Salary") {
        return "briefcase"
    }

    if (category === "Freelance") {
        return "laptop"
    }

    if (category === "Gift") {
        return "gift"
    }

    if (category === "Food") {
        return "shopping-cart"
    }

    if (category === "Transportation") {
        return "car"
    }

    if (category === "Shopping") {
        return "shopping-bag"
    }

    if (category === "Bills") {
        return "receipt"
    }

    if (category === "Entertainment") {
        return "gamepad-2"
    }

    return "circle-dollar-sign"
}

/* === START === */

getAccountsBalance()

getMonthlyMovement()

getCategories()

getRecentTransactions()