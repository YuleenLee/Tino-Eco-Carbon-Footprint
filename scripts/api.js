function create_account(username, password) {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "http://localhost:3768/create_account"
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    const body = JSON.stringify({
        "username": username,
        "password": password,
    });
    xhr.onload = () => {
        if (xhr.readyState == 4) {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status == 404) {
                alert(data["message"]);
            }
        }
    }
    xhr.send(body);
    alert("Account created.");
}

function login(username, password) {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "http://localhost:3768/login"
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    const body = JSON.stringify({
        "username": username,
        "password": password,
    });
    xhr.onload = () => {
        if (xhr.readyState == 4) {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status == 404) {
                alert(data["message"]);
            }
        }
    }
    xhr.send(body);
    window.location.href = "about.html";
}

function logout() {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "http://localhost:3768/logout"
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send();
    window.location.href = "about.html";
}