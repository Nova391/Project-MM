/* === SHARED SIDEBAR === */

const menuButton = document.querySelector("#menuButton");
const sidebar = document.querySelector(".sidebar");
const maincontent = document.querySelector("#maincontent");

console.log(menuButton);
console.log(sidebar);

menuButton.addEventListener("click", function () {
    sidebar.classList.toggle("hidden")
    maincontent.classList.toggle("shifted");
})