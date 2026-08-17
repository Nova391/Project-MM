const menuButton = document.querySelector("#menuButton");
const sidebar = document.querySelector(".sidebar");

console.log(menuButton);
console.log(sidebar);

menuButton.addEventListener("click", function () {
    sidebar.classList.toggle("hidden")
})