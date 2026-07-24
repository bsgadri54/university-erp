// ==========================================
// Sidebar
// ==========================================

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

// ==========================================
// Logout
// ==========================================

function logout() {

    localStorage.clear();
    window.location.href = "login.html";

}

// ==========================================
// Login Check
// ==========================================

const username = localStorage.getItem("username");

if (!username) {

    window.location.href = "login.html";

}

// ==========================================
// Welcome
// ==========================================

document.getElementById("welcome").innerHTML = "";

// Employee ID (appears in multiple places)

document.querySelectorAll(".username").forEach(item => {

    item.innerHTML = username;

});

// ==========================================
// Load Employee Details
// ==========================================

fetch("/employees")

    .then(response => response.json())

    .then(data => {

        const emp = data.find(

            e => e.employeeCode === username

        );

        if (emp) {

            // Employee Name

            document.querySelectorAll(".empName").forEach(item => {

                item.innerHTML = emp.name;

            });

            // Department

            document.querySelectorAll(".empDepartment").forEach(item => {

                item.innerHTML = emp.department;

            });

            // Designation

            document.querySelectorAll(".empDesignation").forEach(item => {

                item.innerHTML = emp.designation;

            });

            // Dashboard Cards

            document.getElementById("department").innerHTML =
                emp.department;

            document.getElementById("designation").innerHTML =
                emp.designation;

        } else {

            console.log("Employee Not Found");

        }

    })

    .catch(error => {

        console.error("Error:", error);

    });