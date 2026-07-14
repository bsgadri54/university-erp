<script>

    document.getElementById("loginForm")
    .addEventListener("submit", function(e){

    e.preventDefault();

    fetch("/users/login",{
    method:"POST",
    headers:{
    "Content-Type":"application/json"
},
    body:JSON.stringify({
    username:document.getElementById("username").value,
    password:document.getElementById("password").value
})
})

    .then(response => response.json())

    .then(user => {

    console.log("LOGIN RESPONSE:", user);

    if(user && user.id){

    localStorage.setItem("userId", user.id);
    localStorage.setItem("username", user.username);
    localStorage.setItem("role", user.role);

    console.log("Saved Username:", localStorage.getItem("username"));

    alert("Role = " + user.role);

    if(user.role === "ADMIN"){
    window.location.href = "dashboard.html";
}
    else if(user.role === "STUDENT"){
    window.location.href = "student-dashboard.html";
}
    else if(user.role === "EMPLOYEE"){
    window.location.href = "employee-dashboard.html";
}
    else{
    alert("Unknown Role: " + user.role);
}

}else{

    alert("Invalid Username or Password");

}

})

    .catch(error => {

    console.log(error);
    alert("Login Failed");

});

});

</script>
