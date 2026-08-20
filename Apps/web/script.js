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



const detailName = document.querySelector("#detail-name");
const detailType = document.querySelector("#detail-type");
const detailCurrency = document.querySelector("#detail-currency");
const detailBalance = document.querySelector("#detail-balance");
accountRows.forEach(function (row) {

    row.addEventListener("click", function () {

        const cells = row.querySelectorAll("td");
        detailName.textContent = cells[0].textContent;
        detailType.textContent = cells[1].textContent;
        detailCurrency.textContent = cells[2].textContent;
        detailBalance.textContent = cells[3].textContent;
        detailsModal.classList.toggle("hidden");

    });

});
const closeDetails = document.querySelector("#closeDetails")
closeDetails.addEventListener("click", function () {
    detailsModal.classList.toggle("hidden");
})