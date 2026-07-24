// ================================
// Load Profile
// ================================

function loadProfile() {

    let loggedInUser = localStorage.getItem("username");

    fetch("/users")
        .then(response => response.json())
        .then(data => {

            let user = data.find(u => u.username === loggedInUser);

            if (user) {

                document.getElementById("username").value = user.username;
                document.getElementById("email").value = user.email;
                document.getElementById("role").value = user.role;

            }

        });

}


// ================================
// Update Password
// ================================

function changePassword() {

    let username = localStorage.getItem("username");

    let password =
        document.getElementById("newPassword").value;

    if (password.trim() === "") {

        alert("Enter New Password");
        return;

    }

    fetch("/users/change-password/" + username, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            password: password
        })

    })

        .then(response => response.json())

        .then(() => {

            alert("Password Updated Successfully");

            clearPassword();

        })

        .catch(error => {

            console.error(error);

            alert("Unable To Update Password");

        });

}


// ================================
// Clear Password
// ================================

function clearPassword() {

    document.getElementById("newPassword").value = "";

}