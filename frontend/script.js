const menuButton = document.querySelector("#menuButton");
const sidebar = document.querySelector(".sidebar");
const maincontent = document.querySelector("#maincontent");
const addaccount = document.querySelector("#addaccount");
const accountForm = document.querySelector(".account-form")
const modal = document.querySelector(".modal");
const closeModal = document.querySelector("#closeModal");

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