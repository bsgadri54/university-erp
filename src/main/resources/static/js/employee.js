

    const searchInput = document.getElementById("searchEmployee");

    searchInput.addEventListener("keyup", function () {

    let filter = this.value.toLowerCase();

    let rows = document.querySelectorAll("#employeeBody tr");

    rows.forEach(function (row) {

    let text = row.textContent.toLowerCase();

    if (text.includes(filter)) {
    row.style.display = "";
} else {
    row.style.display = "none";
}

});

});

    window.onload = function(){
    loadEmployees();

        let employeeCode = localStorage.getItem("username");
        if (!employeeCode) {

            alert("Please Login Again");

            window.location.href = "login.html";

            return;

        }
}

    function saveEmployee() {

    let id = document.getElementById("employeeId").value;

    let employee = {

    employeeCode: document.getElementById("employeeCode").value,

    name: document.getElementById("employeeName").value,

    email: document.getElementById("email").value,

    mobile: document.getElementById("mobile").value,

    designation: document.getElementById("designation").value,

    department: document.getElementById("department").value

};

    let url = "/employees";

    let method = "POST";

    if (id != "") {

    url = "/employees/" + id;

    method = "PUT";
}

    fetch(url, {

    method: method,

    headers: {

    "Content-Type": "application/json"

},

    body: JSON.stringify(employee)

})

    .then(res => res.json())

    .then(() => {

    alert("Employee Saved Successfully");

    clearForm();

    loadEmployees();

});

}

    function loadEmployees() {

    fetch("/employees")
        .then(response => response.json())
        .then(data => {

            let rows = "";

            data.forEach(employee => {

                rows += `

                <tr>

                    <td>${employee.id}</td>

                    <td>${employee.employeeCode}</td>

                    <td>${employee.name}</td>

                    <td>${employee.email}</td>

                    <td>${employee.mobile}</td>

                   <td>${employee.department}</td>

                   <td>${employee.designation}</td>

                    <td>

                        <a href="#" class="btn-edit"
                        onclick="editEmployee(
    ${employee.id},
    '${employee.employeeCode}',
    '${employee.name}',
    '${employee.email}',
    '${employee.mobile}',
    '${employee.designation}',
    '${employee.department}'
)">

                        Edit

                        </a>

                        <a href="#" class="btn-delete"
                        onclick="deleteEmployee(${employee.id})">

                        Delete

                        </a>

                    </td>

                </tr>

                `;

            });

            document.getElementById("employeeBody").innerHTML = rows;

        });

}

    function editEmployee(id, code, name, email, mobile, designation, department) {

    document.getElementById("employeeId").value = id;
    document.getElementById("employeeCode").value = code;
    document.getElementById("employeeName").value = name;
    document.getElementById("email").value = email;
    document.getElementById("mobile").value = mobile;
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

    function clearForm() {

    document.getElementById("employeeId").value = "";

    document.getElementById("employeeCode").value = "";

    document.getElementById("employeeName").value = "";

    document.getElementById("designation").value = "";

    document.getElementById("department").value = "";

}
