function create_account(username, password) {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "http://127.0.0.1:5000/create_account"
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
            else if (xhr.status == 201) {
                alert("Account created.");
            }
        }
    }
    xhr.send(body);
}

function login(username, password) {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "http://127.0.0.1:5000/login"
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
            else if (xhr.status == 201) {
                window.location.href = "about.html";
            }
        }
    }
    xhr.send(body);
}

function logout() {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "http://127.0.0.1:5000/logout"
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send();
    window.location.href = "about.html";
}

function submit_task(task_id, submission) {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "http://127.0.0.1:5000/submit_task"
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    const body = JSON.stringify({
        "task_id": task_id,
        "submission": submission,
    });
    xhr.onload = () => {
        if (xhr.readyState == 4) {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status == 404) {
                alert(data["message"]);
            }
            else if (xhr.status == 201) {
                alert("Task submitted.");
            }
        }
    }
    xhr.send(body);
}

function review_task(submission_id, accepted, points) {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "http://127.0.0.1:5000/review_task"
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    const body = JSON.stringify({
        "submission_id": submission_id,
        "accepted": accepted,
        "points": points,
    });
    xhr.onload = () => {
        if (xhr.readyState == 4) {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status == 404) {
                alert(data["message"]);
            }
            else if (xhr.status == 201) {
                alert("Task reviewed.");
                window.location.href = "review.html";
            }
        }
    }
    xhr.send(body);
}

function fill_task_tables() {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        "http://127.0.0.1:5000/accepted_tasks",
    );
    xhr.send();
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = JSON.parse(xhr.responseText)["data"];
            var tableHtml = "";
            for (var i = 0; i < data.length; i++) {
                tableHtml += "<tr><td>" + data["submission_id"].toString() + "</td><td>" + data["task_id"].toString() + "</td><td>" + data["submission"].toString() + "</td></tr>";
            }
            document.getElementById("acceptedTasksList").innerHTML = tableHtml;
        }
    }
    const xhr2 = new XMLHttpRequest();
    xhr2.open(
        "GET",
        "http://127.0.0.1:5000/submitted_tasks",
    );
    xhr2.send();
    xhr2.onload = () => {
        if (xhr2.readyState == 4 && xhr2.status == 200) {
            const data = JSON.parse(xhr2.responseText)["data"];
            var tableHtml = "";
            for (var i = 0; i < data.length; i++) {
                tableHtml += "<tr><td>" + data["submission_id"].toString() + "</td><td>" + data["task_id"].toString() + "</td><td>" + data["submission"].toString() + "</td></tr>";
            }
            document.getElementById("submittedTasksList").innerHTML = tableHtml;
        }
    }
}