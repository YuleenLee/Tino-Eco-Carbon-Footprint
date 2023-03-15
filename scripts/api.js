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
            if (xhr.status == 404) {
                const data = JSON.parse(xhr.responseText);
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
                sessionStorage.setItem("username", username);
                sessionStorage.setItem("session_id", data["session_id"]);
                window.location.href = "index.html";
            }
        }
    }
    xhr.send(body);
}

function submit_task(task_id, submission) {
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
                else {
                    actuallySubmit(task_id, submission);
                }
            }
        }
    });
    xhr.send(body);
}

function actuallySubmit(task_id, submission) {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "http://127.0.0.1:5000/submit_task"
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    const body = JSON.stringify({
        "task_id": task_id,
        "username": sessionStorage.getItem("username"),
        "submission": submission,
    });
    xhr.onload = () => {
        if (xhr.readyState == 4) {
            if (xhr.status == 404) {
                const data = JSON.parse(xhr.responseText);
                alert(data["message"]);
            }
            else if (xhr.status == 201) {
                alert("Task submitted.");
                window.location.href = "submit.html";
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
            if (xhr.status == 404) {
                const data = JSON.parse(xhr.responseText);
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

function fill_leaderboard() {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        "http://127.0.0.1:5000/leaderboard",
    );
    xhr.send();
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = JSON.parse(xhr.responseText)["data"];
            var lbHtml = "<tr><th>Rank</th><th>Username</th><th>Points</th></tr>";
            for (var i = 0; i < data.length; i++) {
                lbHtml += `<tr><td>${i + 1}</td><td>${data[i]["username"]}</td><td>${data[i]["points"]}</td></tr>`;
            }
            document.getElementById("leaderboardTable").innerHTML = lbHtml;
        }
    }
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
            var tableHtml = "<tr><th>Submission ID</th><th>Task ID</th><th>Submission</th></tr>";
            for (var i = 0; i < data.length; i++) {
                tableHtml += `<tr><td>${data[i]["submission_id"]}</td><td>${data[i]["task_id"]}</td><td>${data[i]["submission"]}</td></tr>`;
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
            var tableHtml = "<tr><th>Submission ID</th><th>Task ID</th><th>Submission</th></tr>";
            for (var i = 0; i < data.length; i++) {
                tableHtml += `<tr><td>${data[i]["submission_id"]}</td><td>${data[i]["task_id"]}</td><td>${data[i]["submission"]}</td></tr>`;
            }
            document.getElementById("submittedTasksList").innerHTML = tableHtml;
        }
    }
}