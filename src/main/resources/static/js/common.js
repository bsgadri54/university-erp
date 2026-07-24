// ================================
// Role Based Dashboard Navigation
// ================================

function goDashboard() {

    let role = localStorage.getItem("role");

    switch (role) {

        case "ADMIN":
            window.location.href = "dashboard.html";
            break;

        case "EMPLOYEE":
            window.location.href = "employee-dashboard.html";
            break;

        case "STUDENT":
            window.location.href = "student-dashboard.html";
            break;

        default:
            window.location.href = "login.html";

    }

}