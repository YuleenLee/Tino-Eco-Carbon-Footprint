function isLoggedIn() {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        "http://localhost:3768/is_logged_in"
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

function requireLogIn() {
    if (!isLoggedIn()) {
        window.location.href = "account.html";
    }
}