// ============================================
// University ERP Dashboard
// ============================================

// -------------------------------
// User Role
// -------------------------------

const role = localStorage.getItem("role");

// Optional username (if stored during login)
const username = localStorage.getItem("username") || "Administrator";

// Welcome Message
const welcome = document.getElementById("welcomeText");

if (welcome) {
    welcome.innerHTML = `Welcome back, ${username} 👋`;
}

// -------------------------------
// Role Based Menu
// -------------------------------

if (role === "STUDENT") {

    document.getElementById("studentMenu").style.display = "none";
    document.getElementById("employeeMenu").style.display = "none";
    document.getElementById("userMenu").style.display = "none";
    document.getElementById("resultManagementMenu").style.display = "none";

}

if (role === "EMPLOYEE") {

    document.getElementById("userMenu").style.display = "none";
    document.getElementById("resultManagementMenu").style.display = "none";

}

// -------------------------------
// Student Count
// -------------------------------

fetch("/students")
    .then(response => response.json())
    .then(data => {

        document.getElementById("studentCount").innerHTML = data.length;

    })
    .catch(error => {

        console.error("Student Error :", error);

    });

// -------------------------------
// Employee Count
// -------------------------------

fetch("/employees")
    .then(response => response.json())
    .then(data => {

        document.getElementById("employeeCount").innerHTML = data.length;

    })
    .catch(error => {

        console.error("Employee Error :", error);

    });

// -------------------------------
// User Count
// -------------------------------

fetch("/users")
    .then(response => response.json())
    .then(data => {

        document.getElementById("userCount").innerHTML = data.length;

    })
    .catch(error => {

        console.error("User Error :", error);

    });

// -------------------------------
// Sidebar Toggle
// -------------------------------

function toggleSidebar() {

    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");

    if (window.innerWidth <= 768) {

        sidebar.classList.toggle("show");

    } else {

        sidebar.classList.toggle("hide");
        main.classList.toggle("full");

    }

}

// -------------------------------
// Close Sidebar on Mobile
// -------------------------------

document.addEventListener("click", function (event) {

    if (window.innerWidth <= 768) {

        const sidebar = document.getElementById("sidebar");
        const menuBtn = document.querySelector(".menu-btn");

        if (
            !sidebar.contains(event.target) &&
            !menuBtn.contains(event.target)
        ) {

            sidebar.classList.remove("show");

        }

    }

});

// -------------------------------
// Logout
// -------------------------------

function logout() {

    if (confirm("Are you sure you want to logout?")) {

        localStorage.clear();

        window.location.href = "login.html";

    }

}