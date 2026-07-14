function logout() {

    localStorage.clear();

    window.location.href = "login.html";

}

function goDashboard() {

    window.location.href = "dashboard.html";

}

function confirmDelete() {

    return confirm("Are you sure?");

}

function showSuccess(msg) {

    alert(msg);

}

function showError(msg) {

    alert(msg);

}

function loadComponent(id, file) {

    fetch(file)
        .then(response => response.text())
        .then(html => {

            document.getElementById(id).innerHTML = html;

        });

}

window.addEventListener("DOMContentLoaded", () => {

    if(document.getElementById("header"))
        loadComponent("header","header.html");

    if(document.getElementById("sidebar"))
        loadComponent("sidebar","sidebar.html");

    if(document.getElementById("footer"))
        loadComponent("footer","footer.html");

});