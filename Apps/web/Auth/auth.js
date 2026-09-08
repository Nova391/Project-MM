const API_URL = "http://127.0.0.1:8000"


async function login(username, password) {

    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        credentials: "include",

        body: JSON.stringify({
            username,
            password
        })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.detail || "Login failed")
    }

    return data
}


async function register(username, password) {

    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        credentials: "include",

        body: JSON.stringify({
            username,
            password
        })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.detail || "Registration failed")
    }

    return data
}


async function logout() {

    const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",

        credentials: "include"
    })

    if (!response.ok) {
        throw new Error("Logout failed")
    }

    window.location.href = "../Auth/login.html"
}


async function checkSession() {

    const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",

        credentials: "include"
    })

    return response.ok
}


const loginForm = document.querySelector("#loginForm")

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault()

        const username = document.querySelector("#username").value.trim()
        const password = document.querySelector("#password").value

        const message = document.querySelector("#loginMessage")

        message.textContent = ""

        try {

            await login(username, password)

            window.location.href = "../Dashboard/dashboard.html"

        }
        catch (error) {

            message.textContent = error.message

        }

    })
}


const registerForm = document.querySelector("#registerForm")

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault()

        const username =
            document.querySelector("#registerUsername").value.trim()

        const password =
            document.querySelector("#registerPassword").value

        const confirmPassword =
            document.querySelector("#confirmPassword").value

        const message =
            document.querySelector("#registerMessage")

        message.textContent = ""

        if (password !== confirmPassword) {

            message.textContent = "Passwords do not match"

            return
        }

        try {

            await register(username, password)

            window.location.href = "../Dashboard/dashboard.html"

        }
        catch (error) {

            message.textContent = error.message

        }

    })
}