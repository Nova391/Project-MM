/* === ADD TRANSACTION MODAL OPEN === */
const AddTransaction = document.querySelector("#AddTransaction")
const AddTransactionsForm = document.querySelector(".AddTransactionsForm")
const AddTransactionsModal = document.querySelector(".AddTransactionsModal")
AddTransaction.addEventListener("click", function () {
    AddTransactionsModal.classList.toggle("hidden");
    AddTransactionsForm.classList.toggle("hidden");
})

/* === ADD TRANSACTION MODAL CLOSE === */
const closeModal = document.querySelector("#closeModal")
closeModal.addEventListener("click", function () {
    AddTransactionsModal.classList.toggle("hidden");
    AddTransactionsForm.classList.toggle("hidden");
})

/* === UPDATE CATEGORY DROPDOWN === */
let allCategories = [];
const TransactionCategory = document.querySelector("#category");
const typeRadios = document.querySelectorAll('input[name="transactionType"]');
function updateCategoryDropdown() {
    TransactionCategory.innerHTML = "";
    const selectedType = document.querySelector('input[name="transactionType"]:checked').value.toLowerCase();
    const filteredCategories = allCategories.filter(cat => cat[2].toLowerCase() === selectedType);
    filteredCategories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat[0];
        option.textContent = cat[1];
        TransactionCategory.appendChild(option);
    });
}

/* === LOAD CATEGORIES === */
function loadcategories() {
    fetch("http://127.0.0.1:8000/categories")
        .then(response => response.json())
        .then(data => {
            allCategories = data;
            updateCategoryDropdown();
        })
}

/* === LOOP === */
typeRadios.forEach(radio => {
    radio.addEventListener("change", function () {
        updateCategoryDropdown();
    });
});
loadcategories()

/* === GET ACCOUNTS === */
let allAccounts = [];
const TransactionAccount = document.querySelector("#account");
fetch("http://127.0.0.1:8000/accounts")
    .then(response => response.json())
    .then(data => {
        allAccounts = data;
        data.forEach(account => {
            const option = document.createElement("option");
            const account_name = document.createElement("account_name");
            option.value = account[0]
            option.textContent = account[1]
            TransactionAccount.appendChild(option);
        })
    })

/* === DISPLAY CURRENCY === */
const TransactionCurrency = document.querySelector("#TransactionCurrency")
TransactionAccount.addEventListener("change", function () {
    const selectedAccount = TransactionAccount.value
    const account = allAccounts.find(function(account) {
        return String(account[0]) === selectedAccount
    })
    TransactionCurrency.textContent = account[3]
})

/* === DATE === */
const TransactionDate = document.querySelector("#date");
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
TransactionDate.value = `${year}-${month}-${day}`;

/* === LOAD TRANSACTIONS === */
function loadtransaction() {
    fetch("http://127.0.0.1:8000/transactions")
        .then(response => response.json())
        .then(data => {
            const transactionsBody = document.querySelector("#transactionsBody");
            transactionsBody.innerHTML = "";
            data.forEach(transaction => {
                const row = document.createElement("tr");
                const type = document.createElement("td");
                type.textContent = transaction[0]
                const amount = document.createElement("td");
                amount.textContent = transaction[1]
                const account_name = document.createElement("td");
                account_name.textContent = transaction[2]
                const category_name = document.createElement("td");
                category_name.textContent = transaction[3]
                const date = document.createElement("td");
                date.textContent = transaction[4]
                const description = document.createElement("td")
                description.textContent = transaction[5]
                row.appendChild(account_name);
                row.appendChild(type);
                row.appendChild(description);
                row.appendChild(category_name);
                row.appendChild(date);
                row.appendChild(amount);
                transactionsBody.appendChild(row);
            })
        })
}

/* === SUBMIT TRANSACTION === */
const submitTransaction = document.querySelector("#submitTransaction")
const Inputaccount = document.getElementById("account")
const Inputamount = document.getElementById("amount")
const Inputcategory = document.getElementById("category")
const Inputdate = document.getElementById("date")
const Inputdescription = document.getElementById("description")
submitTransaction.addEventListener("click", function () {
    const selectedType = document.querySelector('input[name="transactionType"]:checked').value;
    const transactionData = {
        account_id: Inputaccount.value,
        amount: Inputamount.value,
        type: selectedType,
        category_id: Inputcategory.value,
        date: Inputdate.value,
        description: Inputdescription.value
    }
    fetch("http://127.0.0.1:8000/transactions", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(transactionData)
    })
    .then(response => response.json())
    .then(data => {
        loadtransaction();
        AddTransactionsForm.reset();
        console.log(AddTransactionsForm);
        AddTransactionsModal.classList.toggle("hidden");
        AddTransactionsForm.classList.toggle("hidden");
    })
})
loadtransaction()