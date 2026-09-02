/* === ADD ACCOUNT MODAL OPEN === */
const addaccount = document.querySelector("#addaccount");
const accountForm = document.querySelector(".account-form")
const modal = document.querySelector(".modal");
addaccount.addEventListener("click", function () {
    accountForm.classList.toggle("hidden");
    modal.classList.toggle("hidden");
})

/* === ADD ACCOUNT MODAL CLOSE === */
const closeModal = document.querySelector("#closeModal");
closeModal.addEventListener("click", function () {
    accountForm.classList.toggle("hidden");
    modal.classList.toggle("hidden");
})


/* === ACCOUNT DETAILS MODAL === */
const closeDetails = document.querySelector("#closeDetails")
const detailsModal = document.querySelector(".account-details-modal")
closeDetails.addEventListener("click", function () {
    detailsModal.classList.toggle("hidden");
})


/* === LOAD ACCOUNTS === */
const detailName = document.querySelector("#detail-name")
const detailType = document.querySelector("#detail-type")
const detailCurrency = document.querySelector("#detail-currency")
const detailBalance = document.querySelector("#detail-balance")
function loadAccounts() {
    fetch("http://127.0.0.1:8000/accounts")
        .then(response => response.json())
        .then(data => {
            CalculateTotalBalance(data)
            const tableBody = document.getElementById("accounts-table-body")
            tableBody.innerHTML = ""
            data.forEach(account => {

                const name = account[1]
                const type = account[2]
                const currency = account[3]
                const balance = account[4]
                const id = account[0]

                const row = document.createElement("tr")

                const nameCell = document.createElement("td")
                const typeCell = document.createElement("td")
                const currencyCell = document.createElement("td")
                const balanceCell = document.createElement("td")

                nameCell.textContent = name
                typeCell.textContent = type
                currencyCell.textContent = currency
                balanceCell.textContent = balance

                row.appendChild(nameCell)
                row.appendChild(typeCell)
                row.appendChild(currencyCell)
                row.appendChild(balanceCell)

                row.addEventListener("click", function () {
                    selectedAccountId = id

                    detailName.textContent = name
                    detailType.textContent = type
                    detailCurrency.textContent = currency
                    detailBalance.textContent = balance
                    detailsModal.classList.toggle("hidden")
                })

                tableBody.appendChild(row)
            })
        })
}


/* === CREATE ACCOUNT === */
const nameInput = document.getElementById("name")
const typeInput = document.getElementById("account_type")
const currencyInput = document.getElementById("currency")
const balanceInput = document.getElementById("balance")
const addButton = document.getElementById("submitAccount")
addButton.addEventListener("click", function (event) {
    event.preventDefault()
    const name = nameInput.value
    const type = typeInput.value
    const currency = currencyInput.value
    const balance = Number(balanceInput.value)
    fetch("http://127.0.0.1:8000/accounts", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, type, currency, balance})
    })
        .then(response => response.json())
        .then(data => {
            loadAccounts()
            accountForm.reset();
            accountForm.classList.toggle("hidden")
            modal.classList.toggle("hidden")
        })
})

/* === DELETE ACCOUNT === */
const deleteAccountConfirmation = document.querySelector("#deleteAccount-confirmation")
const deleteAccountCancel = document.querySelector("#deleteAccount-cancel")
const deleteAccountConfirmationModal = document.querySelector(".account-confirmdelete-modal")
const deleteAccountConfirmationForm = document.querySelector(".delete-account-confirmation")
let selectedAccountId = null
const deleteAccount = document.getElementById("deleteAccount")
deleteAccount.addEventListener("click", function (event) {
    deleteAccountConfirmationForm.classList.toggle("hidden");
    deleteAccountConfirmationModal.classList.toggle("hidden");
    detailsModal.classList.toggle("hidden");
    event.preventDefault()
})

deleteAccountConfirmation.addEventListener("click", function (event) {
    event.preventDefault()
    fetch(`http://127.0.0.1:8000/accounts/${selectedAccountId}`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(data => {
            loadAccounts()
            deleteAccountConfirmationForm.classList.toggle("hidden");
            deleteAccountConfirmationModal.classList.toggle("hidden");
        })
})

deleteAccountCancel.addEventListener("click", function (event) {
    deleteAccountConfirmationForm.classList.toggle("hidden");
    deleteAccountConfirmationModal.classList.toggle("hidden");
})



/* ===== EDIT ACCOUNT ===== */


/* === EDIT ACCOUNT NAME === */
const editButton1 = document.querySelector("#edit-field-button1")
const EditRow1 = document.querySelector(".edit-row1")
const ValueRow1 = document.querySelector(".value-row1")
const editNameInput = document.getElementById("edit-name")
editButton1.addEventListener("click", function (event) {
    EditRow1.classList.toggle("hidden");
    ValueRow1.classList.toggle("hidden");
    editNameInput.value = detailName.textContent;
})
const SaveNameButton = document.querySelector("#save-name-button")
SaveNameButton.addEventListener("click", function (event) {
    event.preventDefault()
    const newName = editNameInput.value
    fetch(`http://127.0.0.1:8000/accounts/${selectedAccountId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: newName,
            type: detailType.textContent,
            currency: detailCurrency.textContent,
            balance: Number(detailBalance.textContent)
        })
    })
    .then(response => response.json())
    .then(data => {
        detailName.textContent = newName
        EditRow1.classList.toggle("hidden");
        ValueRow1.classList.toggle("hidden");
        loadAccounts()
    })
})
const CancelNameButton = document.querySelector("#cancel-name-button")
CancelNameButton.addEventListener("click", function (event) {
    event.preventDefault()
    EditRow1.classList.toggle("hidden");
    ValueRow1.classList.toggle("hidden");
})

/* === EDIT ACCOUNT TYPE === */
const editButton2 = document.querySelector("#edit-field-button2")
const EditRow2 = document.querySelector(".edit-row2")
const editTypeInput = document.querySelector("#edit-type")
const ValueRow2 = document.querySelector(".value-row2")
editButton2.addEventListener("click", function (event) {
    EditRow2.classList.toggle("hidden");
    ValueRow2.classList.toggle("hidden");
    editTypeInput.value = detailType.textContent;
})
const SaveTypeButton = document.querySelector("#save-type-button")
SaveTypeButton.addEventListener("click", function (event) {
    event.preventDefault()
    const newType = editTypeInput.value
    fetch(`http://127.0.0.1:8000/accounts/${selectedAccountId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: detailName.textContent,
            type: newType,
            currency: detailCurrency.textContent,
            balance: Number(detailBalance.textContent)
        })
    })
    .then(response => response.json())
    .then(data => {
        detailType.textContent = newType
        loadAccounts()
    })
    EditRow2.classList.toggle("hidden");
    ValueRow2.classList.toggle("hidden");
})
const CancelTypeButton = document.querySelector("#cancel-type-button")
CancelTypeButton.addEventListener("click", function () {
    EditRow2.classList.toggle("hidden");
    ValueRow2.classList.toggle("hidden");
})

/* === EDIT ACCOUNT CURRENCY === */
const editButton3 = document.querySelector("#edit-field-button3")
const EditRow3 = document.querySelector(".edit-row3")
const editCurrencyInput = document.querySelector("#edit-currency")
const ValueRow3 = document.querySelector(".value-row3")
editButton3.addEventListener("click", function (event) {
    EditRow3.classList.toggle("hidden");
    ValueRow3.classList.toggle("hidden");
    editCurrencyInput.value = detailCurrency.textContent;
})
const SaveCurrencyButton = document.querySelector("#save-currency-button")
SaveCurrencyButton.addEventListener("click", function (event) {
    event.preventDefault()
    const newCurrency = editCurrencyInput.value
    fetch(`http://127.0.0.1:8000/accounts/${selectedAccountId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: detailName.textContent,
            type: detailType.textContent,
            currency: newCurrency,
            balance: Number(detailBalance.textContent)
        })
    })
    .then(response => response.json())
    .then(data => {
        detailCurrency.textContent = newCurrency
        loadAccounts()
    })
    EditRow3.classList.toggle("hidden");
    ValueRow3.classList.toggle("hidden");
})
const CancelCurrencyButton = document.querySelector("#cancel-currency-button")
CancelCurrencyButton.addEventListener("click", function (event) {
    EditRow3.classList.toggle("hidden");
    ValueRow3.classList.toggle("hidden");
})


/* === EDIT ACCOUNT BALANCE === */
const editButton4 = document.querySelector("#edit-field-button4")
const EditRow4 = document.querySelector(".edit-row4")
const editBalanceInput = document.querySelector("#edit-balance")
const ValueRow4 = document.querySelector(".value-row4")
editButton4.addEventListener("click", function (event) {
    EditRow4.classList.toggle("hidden");
    ValueRow4.classList.toggle("hidden");
    editBalanceInput.value = detailBalance.textContent;
})
const SaveBalanceButton = document.querySelector("#save-balance-button")
SaveBalanceButton.addEventListener("click", function (event) {
    event.preventDefault()
    const newBalance = Number(editBalanceInput.value)
    fetch(`http://127.0.0.1:8000/accounts/${selectedAccountId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: detailName.textContent,
            type: detailType.textContent,
            currency: detailCurrency.textContent,
            balance: newBalance
        })
    })
    .then(response => response.json())
    .then(data => {
        detailBalance.textContent = newBalance
        EditRow4.classList.toggle("hidden");
        ValueRow4.classList.toggle("hidden");
        loadAccounts()
    })
})
const CancelBalanceButton = document.querySelector("#cancel-balance-button")
CancelBalanceButton.addEventListener("click", function (event) {
    event.preventDefault()
    EditRow4.classList.toggle("hidden");
    ValueRow4.classList.toggle("hidden");
})


/* === TOTAL BALANCE === */
const TotalBalanceILS = document.querySelector("#TotalBalance-ILS")
function CalculateTotalBalance(accounts) {
    let totalBalance = 0
    accounts.forEach(account => {
        const currency = account[3]
        const balance = Number(account[4])
        if (currency === "ILS") {
            totalBalance += balance
        }
    })
    TotalBalanceILS.textContent = `${totalBalance.toFixed(2)} ILS`
}
loadAccounts()