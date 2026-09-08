const API_URL = "http://127.0.0.1:8000"


async function requireAuthentication() {

    try {

        const response = await fetch(
            `${API_URL}/auth/me`,
            {
                method: "GET",
                credentials: "include"
            }
        )

        if (!response.ok) {
            window.location.href = "../Auth/login.html"
            return null
        }

        return await response.json()

    }
    catch (error) {

        window.location.href = "../Auth/login.html"

        return null
    }
}