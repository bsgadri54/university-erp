<script>

    window.onload = function(){
    loadEmployees();
}

    function saveEmployee(){

    let id = document.getElementById("employeeId").value;

    let employee = {
    employeeCode: document.getElementById("employeeCode").value,
    name: document.getElementById("employeeName").value,
    designation: document.getElementById("designation").value,
    department: document.getElementById("department").value
};

    if(id){

    fetch("/employees/" + id,{
    method:"PUT",
    headers:{
    "Content-Type":"application/json"
},
    body:JSON.stringify(employee)
})
    .then(response=>response.json())
    .then(data=>{

    alert("Employee Updated Successfully");

    clearForm();
    loadEmployees();
});

}else{

    fetch("/employees",{
    method:"POST",
    headers:{
    "Content-Type":"application/json"
},
    body:JSON.stringify(employee)
})
    .then(response=>response.json())
    .then(data=>{

    alert("Employee Added Successfully");

    clearForm();
    loadEmployees();
});
}
}

    function loadEmployees(){

    fetch("/employees")
        .then(response=>response.json())
        .then(data=>{

            let rows="";

            data.forEach(employee=>{

                rows += `
            <tr>
                <td>${employee.id}</td>
                <td>${employee.employeeCode}</td>
                <td>${employee.name}</td>
                <td>${employee.designation}</td>
                <td>${employee.department}</td>

                <td>
                    <div class="action-buttons">

                        <button class="edit-btn"
                        onclick="editEmployee(
                        '${employee.id}',
                        '${employee.employeeCode}',
                        '${employee.name}',
                        '${employee.designation}',
                        '${employee.department}')">
                        Edit
                        </button>

                        <button class="delete-btn"
                        onclick="deleteEmployee(${employee.id})">
                        Delete
                        </button>

                    </div>
                </td>

            </tr>
            `;
            });

            document.getElementById("employeeBody").innerHTML = rows;
        });
}

    function editEmployee(id, code, name, designation, department){

    document.getElementById("employeeId").value = id;
    document.getElementById("employeeCode").value = code;
    document.getElementById("employeeName").value = name;
    document.getElementById("designation").value = designation;
    document.getElementById("department").value = department;
}

    function deleteEmployee(id){

    if(!confirm("Are you sure you want to delete this employee?")){
    return;
}

    fetch("/employees/" + id,{
    method:"DELETE"
})
    .then(response=>response.text())
    .then(data=>{

    alert(data);

    loadEmployees();
});
}

    function clearForm(){

    document.getElementById("employeeId").value = "";
    document.getElementById("employeeCode").value = "";
    document.getElementById("employeeName").value = "";
    document.getElementById("designation").value = "";
    document.getElementById("department").value = "";
}

</script>
