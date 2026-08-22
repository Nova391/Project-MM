const menuButton = document.querySelector("#menuButton");
const sidebar = document.querySelector(".sidebar");
const maincontent = document.querySelector("#maincontent");
const addaccount = document.querySelector("#addaccount");
const accountForm = document.querySelector(".account-form")
const modal = document.querySelector(".modal");
const closeModal = document.querySelector("#closeModal");
const accountRows = document.querySelectorAll(".accounts-table tbody tr");
const detailsModal = document.querySelector(".account-details-modal")

console.log(menuButton);
console.log(sidebar);

menuButton.addEventListener("click", function () {
    sidebar.classList.toggle("hidden")
    maincontent.classList.toggle("shifted");
})


addaccount.addEventListener("click", function () {
    accountForm.classList.toggle("hidden");
    modal.classList.toggle("hidden");
})

closeModal.addEventListener("click", function () {
    accountForm.classList.toggle("hidden");
    modal.classList.toggle("hidden");
})


const closeDetails = document.querySelector("#closeDetails")
closeDetails.addEventListener("click", function () {
    detailsModal.classList.toggle("hidden");
})

const detailName = document.querySelector("#detail-name")
const detailType = document.querySelector("#detail-type")
const detailCurrency = document.querySelector("#detail-currency")
const detailBalance = document.querySelector("#detail-balance")
function loadAccounts() {
    fetch("http://127.0.0.1:8000/accounts")
        .then(response => response.json())
        .then(data => {
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
            accountForm.classList.toggle("hidden")
            modal.classList.toggle("hidden")
        })
})

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


const editButton1 = document.querySelector("#edit-field-button1")
const editButton2 = document.querySelector("#edit-field-button2")
const editButton3 = document.querySelector("#edit-field-button3")
const editButton4 = document.querySelector("#edit-field-button4")

const HiddenThings = document.querySelector(".hidden1")
const EditRow1 = document.querySelector(".edit-row1")
const ValueRow = document.querySelector(".value-row")
const editNameInput = document.getElementById("edit-name")
editButton1.addEventListener("click", function (event) {
    EditRow1.classList.toggle("hidden");
    ValueRow.classList.toggle("hidden");
    editNameInput.value = detailName.textContent;
})
loadAccounts()

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
    .then(response => response.json)
    .then(data => {
        detailName.textContent = newName
        EditRow1.classList.toggle("hidden");
        ValueRow.classList.toggle("hidden");
        loadAccounts()
    })
})
const CancelNameButton = document.querySelector("#cancel-name-button")
CancelNameButton.addEventListener("click", function (event) {
    event.preventDefault()
    EditRow1.classList.toggle("hidden");
    ValueRow.classList.toggle("hidden");
})
loadAccounts()