function isLoggedIn() {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        "http://127.0.0.1:5000/is_logged_in"
    );
    xhr.send();
    xhr.responseType = "json";
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            return xhr.response["is_logged_in"];
        }
    }
    return null;
}

function isOfficer() {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        "http://127.0.0.1:5000/is_officer"
    );
    xhr.send();
    xhr.responseType = "json";
    xhr.onload = () => {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                return xhr.response["is_officer"];
            }
            else if (xhr.status == 401) {
                alert("Please login.");
                window.location.href = "account.html";
            }
        }
    }
    return null;
}

function requireOfficer() {
    if (!isOfficer()) {
        alert("Missing permissions.");
        window.location.href = "index.html";
    }
}

function requireLogIn() {
    if (!isLoggedIn()) {
        alert("Please login.");
        window.location.href = "account.html";
    }
}