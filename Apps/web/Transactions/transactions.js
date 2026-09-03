let allTransactions = [];
let transactionid;
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
    const categoryFilter = document.querySelector("#categoryFilter")
    TransactionCategory.innerHTML = "";
    categoryFilter.innerHTML = "";
    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = "All Categories";
    categoryFilter.appendChild(allOption);
    const selectedType = document.querySelector('input[name="transactionType"]:checked').value.toLowerCase();
    const filteredCategories = allCategories.filter(cat => cat[2].toLowerCase() === selectedType);
    filteredCategories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat[0];
        option.textContent = cat[1];
        TransactionCategory.appendChild(option);
    });
    allCategories.forEach(cat => {
        const filterOption = document.createElement("option");
        filterOption.value = `${cat[1]}|${cat[2]}`;
        filterOption.textContent = `${cat[1]} - ${cat[2]}`;
        categoryFilter.appendChild(filterOption);
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

/* === GET ACCOUNTS === */
let allAccounts = [];
const TransactionAccount = document.querySelector("#account");
fetch("http://127.0.0.1:8000/accounts")
    .then(response => response.json())
    .then(data => {
        allAccounts = data;
        const accountFilter = document.querySelector("#accountFilter");
        data.forEach(account => {
            const option = document.createElement("option");
            option.value = account[0]
            option.textContent = account[1]
            TransactionAccount.appendChild(option);
            const filterOption = document.createElement("option");
            filterOption.value = account[1];
            filterOption.textContent = account[1];
            accountFilter.appendChild(filterOption);
        })
        updateCurrency();
    })

/* === DISPLAY CURRENCY === */
const TransactionCurrency = document.querySelector("#TransactionCurrency")
const DetailCurrency = document.querySelector("#DetailCurrency")
function updateCurrency() {
    const selectedAccount = TransactionAccount.value
    const account = allAccounts.find(function(account) {
        return String(account[0]) === selectedAccount
    })
    TransactionCurrency.textContent = account[3]
    DetailCurrency.textContent = account[3]
}
TransactionAccount.addEventListener("change", function () {
    updateCurrency();
})

/* === DATE === */
const TransactionDate = document.querySelector("#date");
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
TransactionDate.value = `${year}-${month}-${day}`;

/* === LOAD TRANSACTIONS === */
const DetailsModal = document.querySelector(".DetailsModal")
const DetailsForm = document.querySelector(".DetailsForm")
function displayTransactions(transactions) {
    const transactionsBody = document.querySelector("#transactionsBody");
    transactionsBody.innerHTML = "";
    transactions.forEach(transaction => {
        const row = document.createElement("tr");
        const typeDetail = document.querySelector("#typeDetail")
        const accountDetail = document.querySelector("#accountDetail")
        const amountDetail = document.querySelector("#amountDetail")
        const categoryDetail = document.querySelector("#categoryDetail")
        const dateDetail = document.querySelector("#dateDetail")
        const descriptionDetail = document.querySelector("#descriptionDetail")
        row.addEventListener("click", function () {
            DetailsModal.classList.toggle("hidden");
            DetailsForm.classList.toggle("hidden");
            transactionid = transaction[6];
            typeDetail.textContent = transaction[0]
            accountDetail.textContent = transaction[2]
            amountDetail.textContent = transaction[1]
            categoryDetail.textContent = transaction[3]
            const transactionDate = new Date(transaction[4]);
            dateDetail.textContent = transactionDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: transactionDate.getFullYear() !== new Date().getFullYear()
                    ? "numeric"
                    : undefined
            });
            descriptionDetail.textContent = transaction[5] || "No description";
        });
        const type = document.createElement("td");
        type.textContent = transaction[0]
        const amount = document.createElement("td");
        amount.textContent = transaction[1]
        const account_name = document.createElement("td");
        account_name.textContent = transaction[2]
        const category_name = document.createElement("td");
        category_name.textContent = transaction[3]
        const date = document.createElement("td");
        const transactionDate = new Date(transaction[4]);
        date.textContent = transactionDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: transactionDate.getFullYear() !== new Date().getFullYear()
                ? "numeric"
                : undefined
        });
        const description = document.createElement("td")
        description.textContent = transaction[5] || "—";
        row.appendChild(account_name);
        row.appendChild(type);
        row.appendChild(description);
        row.appendChild(category_name);
        row.appendChild(date);
        row.appendChild(amount);
        transactionsBody.prepend(row);
    })
}

function loadtransaction() {
    fetch("http://127.0.0.1:8000/transactions")
        .then(response => response.json())
        .then(data => {
            allTransactions = data;
            displayTransactions(data);
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
        AddTransactionsModal.classList.toggle("hidden");
        AddTransactionsForm.classList.toggle("hidden");
    })
})


/* === ADD CATEGORY === */
const AddCategory = document.querySelector("#AddCategory")
const CategoryModal = document.querySelector(".CategoryModal")
const CategoryForm = document.querySelector(".CategoryForm")
AddCategory.addEventListener("click", function () {
    CategoryModal.classList.toggle("hidden");
    CategoryForm.classList.toggle("hidden");
})

const CancelAddCategory = document.querySelector("#CancelAddCategory")
CancelAddCategory.addEventListener("click", function () {
    CategoryModal.classList.toggle("hidden");
    CategoryForm.classList.toggle("hidden");
})

const submitCategory = document.querySelector("#submitCategory")
const CategoryName = document.getElementById("CategoryName")
submitCategory.addEventListener("click", function () {
    const selectedType = document.querySelector('input[name="transactionType"]:checked').value;
    const name = CategoryName.value.trim();
    if (name === "") {
        alert("Please enter a category name.");
        return;
    }
    const type = selectedType

    fetch("http://127.0.0.1:8000/categories", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({name, type})
    })
    .then(response => response.json())
    .then(data => {
        loadcategories();
        CategoryForm.reset();
        CategoryModal.classList.toggle("hidden");
        CategoryForm.classList.toggle("hidden");
    })
})

/* === SEARCH TRANSACTIONS === */
const transactionsSearch = document.querySelector("#transactionsSearch")
transactionsSearch.addEventListener("input", function () {
    const searchText = transactionsSearch.value.toLowerCase();
    const filteredTransactions = allTransactions.filter(function(transaction) {
        return transaction[5].toLowerCase().includes(searchText)||
        transaction[4].toLowerCase().includes(searchText)||
        transaction[3].toLowerCase().includes(searchText)||
        transaction[2].toLowerCase().includes(searchText)||
        transaction[0].toLowerCase().includes(searchText)
    })
    displayTransactions(filteredTransactions);
})

/* === FILTER TRANSACTIONS === */
const accountFilter = document.querySelector("#accountFilter")
accountFilter.addEventListener("change", function () {
    const selectedAccount = accountFilter.value
    const filteredTransactions = allTransactions.filter(function(transaction) {
        if (selectedAccount === "") {
            return true
        }
        return transaction[2] === selectedAccount
    })
    displayTransactions(filteredTransactions)
})

const typeFilter = document.querySelector("#typeFilter")
typeFilter.addEventListener("change", function () {
    const selectedType = typeFilter.value
    const filteredTransactions = allTransactions.filter(function(transaction) {
        if (selectedType === "") {
            return true
        }
        return transaction[0] === selectedType
    })
    displayTransactions(filteredTransactions)
})

const categoryFilter = document.querySelector("#categoryFilter")
categoryFilter.addEventListener("change", function() {
    const selectedCategory = categoryFilter.value
    const filteredTransactions = allTransactions.filter(function(transaction) {
        if (selectedCategory === "") {
            return true
        }
        const [category, type] = selectedCategory.split("|")
        return transaction[3] === category && transaction[0] === type
    })
    displayTransactions(filteredTransactions)
})

/* === TRANSACTIONS DETAILS === */
const closeDetails = document.querySelector("#closeDetails")
closeDetails.addEventListener("click", function () {
    DetailsModal.classList.toggle("hidden");
    DetailsForm.classList.toggle("hidden");
})

const DeleteTransaction = document.querySelector("#DeleteTransaction")
const DeleteModal = document.querySelector(".DeleteModal")
const DeleteForm = document.querySelector(".DeleteForm")
DeleteTransaction.addEventListener("click", function (event) {
    event.preventDefault()
    DeleteModal.classList.toggle("hidden");
    DeleteForm.classList.toggle("hidden");
})

const CancelDelete = document.querySelector("#CancelDelete")
CancelDelete.addEventListener("click", function (event) {
    event.preventDefault()
    DeleteModal.classList.toggle("hidden");
    DeleteForm.classList.toggle("hidden");
})

const Delete = document.querySelector("#Delete")
Delete.addEventListener("click", function () {
    fetch(`http://127.0.0.1:8000/transactions/${transactionid}`, {
        method: "DELETE"
    })

})
loadcategories()
loadtransaction()