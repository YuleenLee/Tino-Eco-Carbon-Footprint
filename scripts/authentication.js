function isOfficer(data) {
    const username = sessionStorage.getItem("username");
    if (!data["data"].includes(username)) {
        window.location.href = "index.html";
    }
}

function requireOfficer() {
    requireLogIn();
    const xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        "http://127.0.0.1:5000/officers"
    );
    xhr.addEventListener("readystatechange", function() {
        if (this.readyState == this.DONE) {
            if (xhr.status == 200) {
                const data = JSON.parse(xhr.responseText);
                isOfficer(data);
            }
            else if (xhr.status == 401) {
                alert("Please login.");
                window.location.href = "account.html";
            }
        }
    });
    xhr.send();
}

function requireLogIn() {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "http://127.0.0.1:5000/is_valid_session"
    );
    const body = JSON.stringify({
        "username": sessionStorage.getItem("username"),
        "session_id": sessionStorage.getItem("session_id"),
    });
    xhr.addEventListener("readystatechange", function() {
        if (this.readyState == this.DONE) {
            if (xhr.status == 200) {
                const data = JSON.parse(xhr.responseText);
                if (!data["is_valid_session"]) {
                    alert("Please login.");
                    window.location.href = "account.html";
                }
            }
        }
    });
    xhr.send(body);
}