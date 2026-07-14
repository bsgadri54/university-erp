<script>

    let editId = null;

    window.onload = function(){

    loadStudents();

};

    function loadStudents(){

    let keyword =
    document.getElementById("search")
    .value
    .toLowerCase();

    fetch("https://university-erp-1-gac1.onrender.com/students")

    .then(response => response.json())

    .then(data => {

    let rows = "";

    data.forEach(student=>{

    if(

    keyword !== "" &&

    !student.enrollmentNo
    .toLowerCase()
    .includes(keyword)

    &&

    !student.name
    .toLowerCase()
    .includes(keyword)

    ){
    return;
}

    rows += `

                <tr>

                    <td>${student.id}</td>

                    <td>${student.enrollmentNo}</td>

                    <td>${student.name}</td>

                    <td>${student.email}</td>

                    <td>${student.phone}</td>

                    <td>${student.course}</td>

                    <td>${student.semester}</td>

                    <td>

                        <button
                            class="edit-btn"
                            onclick="editStudent(${student.id})">

                            Edit

                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteStudent(${student.id})">

                            Delete

                        </button>

                    </td>

                </tr>

                `;

});

    document.getElementById("studentTable").innerHTML = rows;

});

}

    function saveStudent(){

    let student={

    enrollmentNo:
    document.getElementById("enrollmentNo").value.trim(),

    name:
    document.getElementById("name").value.trim(),

    email:
    document.getElementById("email").value.trim(),

    phone:
    document.getElementById("phone").value.trim(),

    course:
    document.getElementById("course").value,

    semester:
    document.getElementById("semester").value

};

    if(

    student.enrollmentNo==="" ||

    student.name==="" ||

    student.email==="" ||

    student.phone==="" ||

    student.course==="" ||

    student.semester===""

    ){

    alert("Please fill all fields.");

    return;

}

    let url =
    "https://university-erp-1-gac1.onrender.com/students";

    let method = "POST";

    if(editId != null){

    url += "/" + editId;

    method = "PUT";
}

    fetch(url,{

    method:method,

    headers:{
    "Content-Type":"application/json"
},

    body:JSON.stringify(student)

})

    .then(response=>{

    if(!response.ok){

    throw new Error("Unable to save student.");

}

    return response.json();

})

    .then(data=>{

    alert(

    editId==null ?

    "Student Saved Successfully"

    :

    "Student Updated Successfully"

    );

    clearForm();

    loadStudents();

})

    .catch(error=>{

    console.error(error);

    alert("Save Failed.");

});

}

    function editStudent(id){

    fetch("https://university-erp-1-gac1.onrender.com/students/"+id)

        .then(response=>response.json())

        .then(student=>{

            editId=id;

            document.getElementById("enrollmentNo").value=
                student.enrollmentNo;

            document.getElementById("name").value=
                student.name;

            document.getElementById("email").value=
                student.email;

            document.getElementById("phone").value=
                student.phone;

            document.getElementById("course").value=
                student.course;

            document.getElementById("semester").value=
                student.semester;

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        });

}

    function clearForm(){

    editId=null;

    document.getElementById("enrollmentNo").value="";

    document.getElementById("name").value="";

    document.getElementById("email").value="";

    document.getElementById("phone").value="";

    document.getElementById("course").selectedIndex=0;

    document.getElementById("semester").selectedIndex=0;

}

    function deleteStudent(id){

    if(!confirm("Are you sure you want to delete this student?")){
    return;
}

    fetch("https://university-erp-1-gac1.onrender.com/students/" + id,{

    method:"DELETE"

})

    .then(response=>{

    if(!response.ok){
    throw new Error("Delete Failed");
}

    return response.text();

})

    .then(message=>{

    alert(message);

    loadStudents();

})

    .catch(error=>{

    console.error(error);

    alert("Unable to delete student.");

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
    else{

    window.location.href = "login.html";

}

}

</script>
