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
        });
        const data = await response.json();

        if (data.error !== undefined) {
            return [data.error];
        }

        return [data.token, data.refreshToken]
    } catch(err) {
        console.log(err)
    }
}

function showLoginPage() {
    document.getElementById("login-page").style.display = "flex";
}

export { loginUser,  showLoginPage }
