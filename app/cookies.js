function createCookie(name, value, daysToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    let expiresIn = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expiresIn}; path=/`
}

function removeCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function getCookie() {
    let cookie = document.cookie
    return cookie
}

export { createCookie, removeCookie, getCookie };
