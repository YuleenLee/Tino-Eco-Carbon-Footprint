function isOfficer(data) {
    const username = localStorage.getItem("username");
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
    const username = localStorage.getItem("username");
    if (username == null) {
        alert("Please login.");
        window.location.href = "account.html";
    }
}