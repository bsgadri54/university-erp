

    function goDashboard(){

    let role = localStorage.getItem("role");

    if(role === "ADMIN"){
    window.location.href = "dashboard.html";
}
    else if(role === "EMPLOYEE"){
    window.location.href = "employee-dashboard.html";
}
    else if(role === "STUDENT"){
    window.location.href = "student-dashboard.html";
}
    else{
    alert("Please Login Again");
    window.location.href = "login.html";
}
}