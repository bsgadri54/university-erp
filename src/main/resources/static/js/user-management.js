let users = [];


// =====================================================
// PAGE LOAD
// =====================================================

window.onload = function () {

    const username =
        localStorage.getItem("username");

    if (!username) {

        alert("Please Login Again");

        window.location.href =
            "login.html";

        return;
    }

    loadUsers();
};


// =====================================================
// LOAD USERS
// =====================================================

function loadUsers() {

    fetch("/users")

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Unable to load users"
                );
            }

            return response.json();

        })

        .then(data => {

            users = data || [];

            updateStatistics();

            populateUsers();

        })

        .catch(error => {

            console.error(error);

            document.getElementById(
                "userBody"
            ).innerHTML = "";

            showEmptyState();

        });
}


// =====================================================
// STATISTICS
// =====================================================

function updateStatistics() {

    document.getElementById(
        "totalUsers"
    ).textContent = users.length;


    const admins =
        users.filter(user =>
            user.role === "ADMIN"
        ).length;

    const employees =
        users.filter(user =>
            user.role === "EMPLOYEE"
        ).length;

    const students =
        users.filter(user =>
            user.role === "STUDENT"
        ).length;


    document.getElementById(
        "adminUsers"
    ).textContent = admins;

    document.getElementById(
        "employeeUsers"
    ).textContent = employees;

    document.getElementById(
        "studentUsers"
    ).textContent = students;
}


// =====================================================
// DISPLAY USERS
// =====================================================

function populateUsers() {

    const search =
        document.getElementById(
            "searchUser"
        ).value
            .toLowerCase()
            .trim();


    const role =
        document.getElementById(
            "roleFilter"
        ).value;


    const filteredUsers =
        users.filter(user => {

            const username =
                (user.username || "")
                    .toLowerCase();

            const email =
                (user.email || "")
                    .toLowerCase();


            const matchesSearch =
                username.includes(search) ||
                email.includes(search);


            const matchesRole =
                !role ||
                user.role === role;


            return matchesSearch &&
                matchesRole;

        });


    const tbody =
        document.getElementById(
            "userBody"
        );


    tbody.innerHTML = "";


    if (filteredUsers.length === 0) {

        showEmptyState();

        return;
    }


    hideEmptyState();


    filteredUsers.forEach(
        (user, index) => {

            const username =
                user.username || "";

            const email =
                user.email || "";

            const role =
                user.role || "";


            const firstLetter =
                username
                    .charAt(0)
                    .toUpperCase();


            let roleClass =
                "student";

            if (role === "ADMIN") {
                roleClass = "admin";
            }

            else if (role === "EMPLOYEE") {
                roleClass = "employee";
            }

            else if (
                role ===
                "DEACTIVATED USER"
            ) {
                roleClass = "deactivated";
            }


            const statusActive =
                role !==
                "DEACTIVATED USER";


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>

                    <div class="user-cell">

                        <div class="user-avatar">
                            ${firstLetter}
                        </div>

                        <div class="user-name">
                            ${escapeHtml(username)}
                        </div>

                    </div>

                </td>


                <td>

                    <span class="user-email">
                        ${escapeHtml(email)}
                    </span>

                </td>


                <td>

                    <span class="role ${roleClass}">
                        ${escapeHtml(role)}
                    </span>

                </td>


                <td>

                    <span class="status ${
                statusActive
                    ? "active"
                    : "inactive"
            }">

                        <i class="fa-solid fa-circle"></i>

                        ${
                statusActive
                    ? "Active"
                    : "Inactive"
            }

                    </span>

                </td>


                <td>

                    <div class="action-buttons">

                        <button
                            class="edit-btn"
                            title="Edit User"
                            onclick="editUser(${user.id})">

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            class="delete-btn"
                            title="Delete User"
                            onclick="deleteUser(${user.id})">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </td>

            `;


            tbody.appendChild(row);

        }
    );
}


// =====================================================
// FILTER
// =====================================================

function filterUsers() {

    populateUsers();

}


// =====================================================
// OPEN ADD MODAL
// =====================================================

function openAddUserModal() {

    clearForm();

    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add User";


    document.getElementById(
        "saveButton"
    ).innerHTML =
        `<i class="fa-solid fa-floppy-disk"></i>
         Save User`;


    document.getElementById(
        "userModal"
    ).classList.add("show");

}


// =====================================================
// CLOSE MODAL
// =====================================================

function closeUserModal() {

    document.getElementById(
        "userModal"
    ).classList.remove("show");

}


// =====================================================
// SAVE / UPDATE USER
// =====================================================

function saveUser(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "userId"
        ).value;


    const user = {

        username:
            document.getElementById(
                "username"
            ).value.trim(),

        email:
            document.getElementById(
                "email"
            ).value.trim(),

        password:
        document.getElementById(
            "password"
        ).value,

        role:
        document.getElementById(
            "role"
        ).value

    };


    let url = "/users";

    let method = "POST";


    if (id !== "") {

        url =
            "/users/" + id;

        method = "PUT";

    }


    fetch(url, {

        method: method,

        headers: {
            "Content-Type":
                "application/json"
        },

        body:
            JSON.stringify(user)

    })

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Save failed"
                );

            }

            return response.json();

        })

        .then(() => {

            alert(
                id === ""
                    ? "User Added Successfully"
                    : "User Updated Successfully"
            );


            closeUserModal();

            clearForm();

            loadUsers();

        })

        .catch(error => {

            console.error(error);

            alert(
                "Unable to Save User"
            );

        });

}


// =====================================================
// EDIT USER
// =====================================================

function editUser(id) {

    const user =
        users.find(
            item =>
                item.id === id
        );


    if (!user) {

        alert(
            "User not found"
        );

        return;
    }


    document.getElementById(
        "userId"
    ).value = user.id;


    document.getElementById(
        "username"
    ).value =
        user.username || "";


    document.getElementById(
        "email"
    ).value =
        user.email || "";


    /*
       Do NOT display the stored password.

       If your backend returns a password,
       it should ideally be removed from
       the API response.
    */

    document.getElementById(
        "password"
    ).value = "";


    document.getElementById(
        "password"
    ).placeholder =
        "Enter new password";


    document.getElementById(
        "role"
    ).value =
        user.role || "";


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit User";


    document.getElementById(
        "saveButton"
    ).innerHTML =
        `<i class="fa-solid fa-floppy-disk"></i>
         Update User`;


    document.getElementById(
        "userModal"
    ).classList.add("show");

}


// =====================================================
// DELETE USER
// =====================================================

function deleteUser(id) {

    const user =
        users.find(
            item =>
                item.id === id
        );


    const username =
        user
            ? user.username
            : "this user";


    if (!confirm(
        `Are you sure you want to delete ${username}?`
    )) {

        return;

    }


    fetch(
        "/users/" + id,
        {
            method: "DELETE"
        }
    )

        .then(response =>
            response.text()
        )

        .then(message => {

            alert(
                message ||
                "User Deleted Successfully"
            );

            loadUsers();

        })

        .catch(error => {

            console.error(error);

            alert(
                "Delete Failed"
            );

        });

}


// =====================================================
// CLEAR FORM
// =====================================================

function clearForm() {

    document.getElementById(
        "userId"
    ).value = "";


    document.getElementById(
        "username"
    ).value = "";


    document.getElementById(
        "email"
    ).value = "";


    document.getElementById(
        "password"
    ).value = "";


    document.getElementById(
        "password"
    ).placeholder =
        "Enter Password";


    document.getElementById(
        "role"
    ).value = "";


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add User";


    document.getElementById(
        "saveButton"
    ).innerHTML =
        `<i class="fa-solid fa-floppy-disk"></i>
         Save User`;

}


// =====================================================
// EMPTY STATE
// =====================================================

function showEmptyState() {

    document.getElementById(
        "emptyState"
    ).style.display = "block";

}


function hideEmptyState() {

    document.getElementById(
        "emptyState"
    ).style.display = "none";

}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// =====================================================

document.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "userModal"
            );


        if (
            event.target === modal
        ) {

            closeUserModal();

        }

    }
);