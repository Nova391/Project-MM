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

const logoutButton = document.querySelector("#logoutButton")
if (logoutButton) {
    logoutButton.addEventListener("click", async function () {
        try {
            await fetch(
                "http://127.0.0.1:8000/auth/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            )
            window.location.href = "../Auth/login.html"
        }
        catch (error) {
            console.error("Logout failed:", error)
        }
    })
}

async function loadCurrentUser() {
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/auth/me",
            {
                method: "GET",
                credentials: "include"
            }
        )
        if (!response.ok) {
            return
        }
        const user = await response.json()
        const usernameElement =
            document.querySelector("#currentUsername")
        if (usernameElement) {
            usernameElement.textContent = user.username
        }

    }
    catch (error) {
        console.error(
            "Could not load current user:",
            error
        )
    }
}
loadCurrentUser()