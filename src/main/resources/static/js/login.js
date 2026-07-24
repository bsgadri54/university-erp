// ============================================
// University ERP Login
// ============================================

// Auto Focus
window.onload = function () {

    document.getElementById("username").focus();

};

// ============================================
// Show / Hide Password
// ============================================

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.innerHTML =
            '<i class="fas fa-eye-slash"></i>';

    } else {

        passwordInput.type = "password";

        togglePassword.innerHTML =
            '<i class="fas fa-eye"></i>';

    }

});

// ============================================
// Forgot Password
// ============================================

const forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword) {

    forgotPassword.addEventListener("click", function (e) {

        e.preventDefault();

        Swal.fire({
            icon: "info",
            title: "Forgot Password",
            text: "Password reset functionality is under development. Please contact the Administrator.",
            confirmButtonColor: "#2563eb"
        });

    });

}

// ============================================
// Login
// ============================================

document.getElementById("loginForm")
    .addEventListener("submit", function (e) {

        e.preventDefault();

        const loginBtn = document.querySelector(".login-btn");

        loginBtn.disabled = true;

        loginBtn.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Signing In...';

        fetch("/users/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                username: document.getElementById("username").value,

                password: document.getElementById("password").value

            })

        })

            .then(response => response.json())

            .then(user => {

                if (user && user.id) {

                    localStorage.setItem("userId", user.id);
                    localStorage.setItem("username", user.username);
                    localStorage.setItem("role", user.role);

                    if (user.role === "DEACTIVATED USER") {

                        loginBtn.disabled = false;

                        loginBtn.innerHTML =
                            '<i class="fas fa-right-to-bracket"></i> Sign In';

                        showWarning(
                            "Account Deactivated",
                            "Your account has been deactivated by the Administrator."
                        );

                        document.getElementById("username").value = "";
                        document.getElementById("password").value = "";

                        return;
                    }

                    if (user.role === "ADMIN") {

                        loginSuccess(user.username, function () {

                            window.location.href = "dashboard.html";

                        });

                    }

                    else if (user.role === "STUDENT") {

                        loginSuccess(user.username, function () {

                            window.location.href =
                                "student-dashboard.html";

                        });

                    }

                    else if (user.role === "EMPLOYEE") {

                        loginSuccess(user.username, function () {

                            window.location.href =
                                "employee-dashboard.html";

                        });

                    }

                    else {

                        loginBtn.disabled = false;

                        loginBtn.innerHTML =
                            '<i class="fas fa-right-to-bracket"></i> Sign In';

                        showError(
                            "Access Denied",
                            "Your account role is invalid."
                        );

                    }

                }

                else {

                    loginBtn.disabled = false;

                    loginBtn.innerHTML =
                        '<i class="fas fa-right-to-bracket"></i> Sign In';

                    showError(
                        "Login Failed",
                        "Invalid Username or Password."
                    );

                }

            })

            .catch(error => {

                console.error(error);

                loginBtn.disabled = false;

                loginBtn.innerHTML =
                    '<i class="fas fa-right-to-bracket"></i> Sign In';

                showError(
                    "Server Error",
                    "Unable to connect to the server. Please try again."
                );

            });

    });