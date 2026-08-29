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