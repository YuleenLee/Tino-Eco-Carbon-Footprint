function isOfficer(data) {
    if (!data["is_officer"]) {
        window.location.href = "index.html";
    }
    else {
        document.getElementById("contentdiv").hidden = false;
    }
}

function requireOfficer() {
    requireLogIn(false);
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        `${apiURL}is_officer`
    );
    const body = JSON.stringify({
        "email": sessionStorage.getItem("email"),
    });
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
    xhr.onerror = function(e){
        window.location.href = "oops.html";
    };
    xhr.send(body);
}

function requireLogIn(show=true) {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        `${apiURL}is_valid_session`
    );
    const body = JSON.stringify({
        "email": sessionStorage.getItem("email"),
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
                else if (show) {
                    document.getElementById("contentdiv").hidden = false;
                }
            }
        }
    });
    xhr.onerror = function(e){
        window.location.href = "oops.html";
    };
    xhr.send(body);
}