<script>

    let role = localStorage.getItem("role");

    if(role === "STUDENT"){

    document.getElementById("studentMenu").style.display = "none";
    document.getElementById("employeeMenu").style.display = "none";
    document.getElementById("userMenu").style.display = "none";

    document.getElementById("resultManagementMenu").style.display = "none";
}

    if(role === "EMPLOYEE"){

    document.getElementById("userMenu").style.display = "none";

    document.getElementById("resultManagementMenu").style.display = "none";
}

    fetch("/students")
    .then(res => res.json())
    .then(data => {
    document.getElementById("studentCount").innerHTML = data.length;
});

    fetch("/employees")
    .then(res => res.json())
    .then(data => {
    document.getElementById("employeeCount").innerHTML = data.length;
});

    fetch("/users")
    .then(res => res.json())
    .then(data => {
    document.getElementById("userCount").innerHTML = data.length;
});

    function logout(){
    localStorage.clear();
    window.location.href = "login.html";
}

    function toggleSidebar(){
    document.querySelector(".sidebar").classList.toggle("hide");
    document.querySelector(".main").classList.toggle("full");
}

</script>
