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
            return { error: data.error };
        }

        return {
            token: data.token,
            refreshToken: data.refresh_token
        };
    } catch (err) {
        console.log(err)
    }
}

async function refreshUser(refresh_token, url) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refresh_token}`
            }
        });
        const data = await response.json();

        if (data.error !== undefined) {
            return { error: data.error };
        }

        return {
            token: data.token,
        };

    } catch (err) {
        console.log(err);
    }
}

async function revokeRefreshToken(token, url) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (data.error !== undefined) {
            return { error: data.error };
        }
        return;
    } catch (err) {
        console.log(err)
    }
}

function showSignOutButton() {
    document.getElementById("signout-button").style.display = "block";
    document.getElementById("signup-button").style.display = "none";
    document.getElementById("login-button").style.display = "none";
    document.getElementById("login-page").style.display = "none";
    document.getElementById("signup-page").style.display = "none";
}

function hideSignOutButton() {
    document.getElementById("signout-button").style.display = "none";
    document.getElementById("signup-button").style.display = "block";
    document.getElementById("login-button").style.display = "block";
    document.getElementById("signout-page").style.display = "none";
}

export { loginUser, showSignOutButton, hideSignOutButton, revokeRefreshToken, refreshUser };
