async function loginUser(email, password, url) {
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
        )

    } catch(err) {
        console.log(err)
    }
    if (response.error !== undefined) {
        throw new Error(response.error)
    }

    return [response.token, response.refreshToken]
}

function showLoginPage() {
    document.getElementById("login-page").style.display = "flex";
}

export { loginUser,  showLoginPage }
