// ============================================
// University ERP Alert Utility
// ============================================

// Success
function showSuccess(title, message) {
    Swal.fire({
        icon: "success",
        title: title,
        text: message,
        confirmButtonColor: "#198754"
    });
}

// Error
function showError(title, message) {
    Swal.fire({
        icon: "error",
        title: title,
        text: message,
        confirmButtonColor: "#dc3545"
    });
}

// Warning
function showWarning(title, message) {
    Swal.fire({
        icon: "warning",
        title: title,
        text: message,
        confirmButtonColor: "#f39c12"
    });
}

// Info
function showInfo(title, message) {
    Swal.fire({
        icon: "info",
        title: title,
        text: message,
        confirmButtonColor: "#0d6efd"
    });
}

// Login Success
function loginSuccess(username, callback) {

    Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome " + username,
        timer: 1500,
        showConfirmButton: false
    }).then(() => {

        if (callback) {
            callback();
        }

    });

}