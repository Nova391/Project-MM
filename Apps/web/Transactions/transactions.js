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
            console.log("My Backend Data:", data);
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