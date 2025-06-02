import { getRefreshToken } from "./cookies.js";
import { refreshUser } from "./login.js";
async function createTime(url, time, scramble, token) {
    try {
        let response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                time: time,
                scramble: scramble
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        let data = await response.json();

        if (data.error != undefined) {
            return;
        }

        return data;
    } catch (err) {
        console.log(err);
    }
}

async function getTimes(url, token) {
    try {
        let response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        if (data.error != undefined) {
            return;
        }

        return data
    } catch (err) {
        console.log(err);
    }
}

export { createTime, getTimes };
