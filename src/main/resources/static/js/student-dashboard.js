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

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

const username = localStorage.getItem("username");

if (!username) {
    window.location.href = "login.html";
}

document.getElementById("welcome").innerHTML = "";

document.querySelectorAll(".username").forEach(e => {
    e.innerHTML = username;
});

fetch("/students")
    .then(res => res.json())
    .then(data => {

        const student = data.find(
            s => s.enrollmentNo === username
        );

        if(student){

            document.querySelectorAll(".studentName").forEach(e=>{
                e.innerHTML = student.name;
            });

            document.querySelectorAll(".studentCourse").forEach(e=>{
                e.innerHTML = student.course;
            });

            document.querySelectorAll(".studentSemester").forEach(e=>{
                e.innerHTML = student.semester;
            });

            document.querySelectorAll(".studentEmail").forEach(e=>{
                e.innerHTML = student.email;
            });

            document.getElementById("semester").innerHTML =
                student.semester;

            document.getElementById("course").innerHTML =
                student.course;

        }

    });