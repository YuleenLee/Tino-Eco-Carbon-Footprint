const apiURL = "http://tino-eco.com:8000/"

function create_account(name, email, password) {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        `${apiURL}create_account`
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    const body = JSON.stringify({
        "name": name,
        "email": email,
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
    xhr.onerror = function(e){
        window.location.href = "oops.html";
    };
    xhr.send(body);
}

function login(email, password) {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        `${apiURL}login`
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    const body = JSON.stringify({
        "email": email,
        "password": password,
    });
    xhr.onload = () => {
        if (xhr.readyState == 4) {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status == 404) {
                alert(data["message"]);
            }
            else if (xhr.status == 201) {
                sessionStorage.setItem("email", email);
                sessionStorage.setItem("session_id", data["session_id"]);
                window.location.href = "index.html";
            }
        }
    }
    xhr.onerror = function(e){
        window.location.href = "oops.html";
    };
    xhr.send(body);
}

function submit_task(task_id, submission) {
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
                else {
                    actuallySubmit(task_id, submission);
                }
            }
        }
    });
    xhr.onerror = function(e){
        window.location.href = "oops.html";
    };
    xhr.send(body);
}

function actuallySubmit(task_id, submission) {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        `${apiURL}submit_task`
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    const body = JSON.stringify({
        "task_id": task_id,
        "email": sessionStorage.getItem("email"),
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
    xhr.onerror = function(e){
        window.location.href = "oops.html";
    };
    xhr.send(body);
}

function review_task(submission_id, accepted, points) {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        `${apiURL}review_task`
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
            }
            window.location.href = "review.html";
        }
    }
    xhr.onerror = function(e){
        window.location.href = "oops.html";
    };
    xhr.send(body);
}

function fill_leaderboard() {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        `${apiURL}leaderboard`,
    );
    xhr.onerror = function(e){
        window.location.href = "oops.html";
    };
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = JSON.parse(xhr.responseText)["data"];
            var lbHtml = "<tr><th>Rank</th><th>Name</th><th>Points</th></tr>";
            for (var i = 0; i < data.length; i++) {
                lbHtml += `<tr><td>${i + 1}</td><td>${data[i]["name"]}</td><td>${data[i]["points"]}</td></tr>`;
            }
            document.getElementById("leaderboardTable").innerHTML = lbHtml;
        }
    }
    xhr.send();
}

function fill_task_tables(submit=true) {
    if (!submit) {
        actuallyFillTasks();
    }
    else {
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
                    if (data["is_officer"]) {
                        window.location.href = "review.html";
                    }
                    else {
                        actuallyFillTasks();
                    }
                }
            }
        });
        xhr.onerror = function(e){
            window.location.href = "oops.html";
        };
        xhr.send(body);
    }
}

function actuallyFillTasks() {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        `${apiURL}accepted_tasks`,
    );
    const body = JSON.stringify({
        "email": sessionStorage.getItem("email"),
    });
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
        "POST",
        `${apiURL}submitted_tasks`,
    );
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
    xhr.onerror = function(e){
        window.location.href = "oops.html";
    };
    xhr2.onerror = function(e){
        window.location.href = "oops.html";
    };
    xhr.send(body);
    xhr2.send(body);
}

function setUserPoints() {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        `${apiURL}user_points`,
    );
    const body = JSON.stringify({
        "email": sessionStorage.getItem("email"),
    });
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = JSON.parse(xhr.responseText);
            var pointsHtml = `Total Points: ${data["points"]}`;
            document.getElementById("pointsH3").innerHTML = pointsHtml;
        }
    }
    xhr.send(body);
}