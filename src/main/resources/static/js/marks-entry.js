

    fetch("/students")
    .then(res => res.json())
    .then(data => {

    let select =
    document.getElementById("studentSelect");

    data.forEach(student => {

    select.innerHTML += `
            <option value="${student.enrollmentNo}">
                ${student.name} (${student.enrollmentNo})
            </option>
        `;
});

});

    function saveMarks(){

    let enrollmentNo =
    document.getElementById("studentSelect").value;

    let subject =
    document.getElementById("subject").value;

    let marks =
    document.getElementById("marks").value;

    let semester =
    document.getElementById("semester").value;

    if(
    enrollmentNo === "" ||
    subject === "" ||
    marks === "" ||
    semester === ""
    ){
    alert("Please fill all fields");
    return;
}

    // Maximum Marks Validation

    let maxMarks = 100;

    if(
    subject.includes("LAB") ||
    subject === "Practical Training 45 Days"
    ){
    maxMarks = 50;
}

    if(Number(marks) > maxMarks){

    alert(
    "Maximum marks allowed for '" +
    subject +
    "' is " +
    maxMarks
    );

    return;
}

    fetch("/results",{
    method:"POST",
    headers:{
    "Content-Type":"application/json"
},
    body:JSON.stringify({
    enrollmentNo:enrollmentNo,
    subject:subject,
    marks:marks,
    semester:semester
})
})

    .then(async res => {

    let message = await res.text();

    if(!res.ok){

    alert(message);
    return;
}

    alert(message);

    document.getElementById("subject").value = "";
    document.getElementById("marks").value = "";
})

    .catch(error => {

    console.error(error);
    alert("Error Saving Marks");

});
}

    function goDashboard(){

    let role = localStorage.getItem("role");

    if(role === "ADMIN"){
    window.location.href = "dashboard.html";
}
    else if(role === "EMPLOYEE"){
    window.location.href = "employee-dashboard.html";
}
}


