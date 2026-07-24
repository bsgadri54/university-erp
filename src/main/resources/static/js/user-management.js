
    window.onload = function () {
        loadUsers();
        let enrollmentNo = localStorage.getItem("username");

        if (!enrollmentNo) {

            alert("Please Login Again");

            window.location.href = "login.html";

            return;

        }

        document.getElementById("searchUser").addEventListener("keyup", searchUsers);
    };

    // =========================
    // SAVE / UPDATE USER
    // =========================

    function saveUser() {

        let id = document.getElementById("userId").value;

        let user = {

        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        role: document.getElementById("role").value

    };

        let url = "/users";
        let method = "POST";

        if (id !== "") {
        url = "/users/" + id;
        method = "PUT";
    }

        fetch(url, {

        method: method,

        headers: {
        "Content-Type": "application/json"
    },

        body: JSON.stringify(user)

    })

        .then(response => response.json())

        .then(() => {

        alert("User Saved Successfully");

        clearForm();

        loadUsers();

    })

        .catch(error => {

        console.error(error);

        alert("Unable to Save User");

    });

    }


    // =========================
    // LOAD USERS
    // =========================

    function loadUsers() {

        fetch("/users")

            .then(response => response.json())

            .then(data => {

                let rows = "";

                data.forEach(user => {

                    rows += `

            <tr>

                <td>${user.id}</td>

                <td>${user.username}</td>

                <td>${user.email ?? ""}</td>

                <td>${user.role}</td>

                <td>

                    <a href="#"

                       class="btn-edit"

                       onclick="editUser(
                       ${user.id},
                       '${user.username}',
                       '${user.email ?? ""}',
                       '${user.password ?? ""}',
                       '${user.role}'
                       )">

                       Edit

                    </a>

                    <a href="#"

                       class="btn-delete"

                       onclick="deleteUser(${user.id})">

                       Delete

                    </a>

                </td>

            </tr>

            `;

                });

                document.getElementById("userBody").innerHTML = rows;

            });

    }


    // =========================
    // EDIT USER
    // =========================

    function editUser(id, username, email, password, role) {

        document.getElementById("userId").value = id;

        document.getElementById("username").value = username;

        document.getElementById("email").value = email;

        document.getElementById("password").value = password;

        document.getElementById("role").value = role;

    }


    // =========================
    // DELETE USER
    // =========================

    function deleteUser(id) {

        if (!confirm("Are you sure you want to delete this user?")) {

        return;

    }

        fetch("/users/" + id, {

        method: "DELETE"

    })

        .then(response => response.text())

        .then(message => {

        alert(message);

        loadUsers();

    })

        .catch(error => {

        console.error(error);

        alert("Delete Failed");

    });

    }


    // =========================
    // SEARCH USER
    // =========================

    function searchUsers() {

        let filter = document.getElementById("searchUser").value.toLowerCase();

        let rows = document.querySelectorAll("#userBody tr");

        rows.forEach(function (row) {

        let text = row.textContent.toLowerCase();

        if (text.includes(filter)) {

        row.style.display = "";

    } else {

        row.style.display = "none";

    }

    });

    }


    // =========================
    // CLEAR FORM
    // =========================

    function clearForm() {

        document.getElementById("userId").value = "";

        document.getElementById("username").value = "";

        document.getElementById("email").value = "";

        document.getElementById("password").value = "";

        document.getElementById("role").value = "";

    }