
    function register() {

    let user = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
};

    fetch("/users/create", {
    method: "POST",
    headers: {
    "Content-Type":"application/json"
},
    body: JSON.stringify(user)
})
    .then(response => response.json())
    .then(data => {
    alert("Registration Successful");
    window.location.href = "login.html";
});
}
