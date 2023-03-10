const xhr = new XMLHttpRequest();
xhr.open(
    "GET",
    "http://localhost:3768/is_logged_in"
);
xhr.send();
xhr.responseType = "json";
xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        const data = xhr.response;
        if (!data["is_logged_in"]) {
            window.location.href = "account.html";
        }
    }
}