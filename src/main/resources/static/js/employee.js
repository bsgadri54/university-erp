let employees = [];


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    loadEmployees();

    document
        .getElementById("searchEmployee")
        .addEventListener("input", filterEmployees);

    document
        .getElementById("departmentFilter")
        .addEventListener("change", filterEmployees);

    document
        .getElementById("designationFilter")
        .addEventListener("change", filterEmployees);

    document
        .getElementById("employeeForm")
        .addEventListener("submit", function (event) {

            event.preventDefault();

            saveEmployee();

        });

});


// ======================================================
// LOAD EMPLOYEES
// ======================================================

function loadEmployees() {

    fetch("/employees")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to load employees"
                );

            }

            return response.json();

        })

        .then(data => {

            employees = data || [];

            updateStatistics();

            displayEmployees(employees);

        })

        .catch(error => {

            console.error(error);

            document.getElementById(
                "employeeBody"
            ).innerHTML = `

                <tr>

                    <td colspan="9"
                        class="no-data">

                        Unable to load employee records

                    </td>

                </tr>

            `;

        });

}


// ======================================================
// DISPLAY EMPLOYEES
// ======================================================

function displayEmployees(data) {

    const body =
        document.getElementById("employeeBody");


    if (!data || data.length === 0) {

        body.innerHTML = `

            <tr>

                <td colspan="9"
                    class="no-data">

                    No employee records found

                </td>

            </tr>

        `;

        return;

    }


    let rows = "";


    data.forEach((employee, index) => {

        rows += `

            <tr>

                <td>
                    ${index + 1}
                </td>


                <td>

                    <div class="employee-name">

                        <div class="avatar">

                            ${getInitial(
            employee.name
        )}

                        </div>

                        <strong>
                            ${safe(employee.name)}
                        </strong>

                    </div>

                </td>


                <td>
                    ${safe(employee.employeeCode)}
                </td>


                <td>
                    ${safe(employee.email)}
                </td>


                <td>
                    ${safe(employee.mobile)}
                </td>


                <td>
                    ${safe(employee.department)}
                </td>


                <td>
                    ${safe(employee.designation)}
                </td>


                <td>

                    <span class="status active">

                        <i class="fa-solid fa-circle"></i>

                        Active

                    </span>

                </td>


                <td>

                    <div class="action-buttons">

                        <button
                            class="edit-btn"
                            onclick="editEmployee(${employee.id})"
                            title="Edit">

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            class="delete-btn"
                            onclick="deleteEmployee(${employee.id})"
                            title="Delete">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });


    body.innerHTML = rows;

}


// ======================================================
// STATISTICS
// ======================================================

function updateStatistics() {

    document.getElementById(
        "totalEmployees"
    ).textContent = employees.length;


    const departments =
        new Set(

            employees

                .map(employee =>
                    employee.department
                )

                .filter(value => value)

        );


    const designations =
        new Set(

            employees

                .map(employee =>
                    employee.designation
                )

                .filter(value => value)

        );


    document.getElementById(
        "totalDepartments"
    ).textContent = departments.size;


    document.getElementById(
        "totalDesignations"
    ).textContent = designations.size;


    document.getElementById(
        "activeEmployees"
    ).textContent = employees.length;

}


// ======================================================
// SEARCH + FILTER
// ======================================================

function filterEmployees() {

    const search =
        document
            .getElementById("searchEmployee")
            .value
            .toLowerCase()
            .trim();


    const department =
        document
            .getElementById("departmentFilter")
            .value;


    const designation =
        document
            .getElementById("designationFilter")
            .value;


    const filtered =
        employees.filter(employee => {

            const text = (

                (employee.name || "") +
                " " +
                (employee.employeeCode || "") +
                " " +
                (employee.email || "") +
                " " +
                (employee.mobile || "")

            ).toLowerCase();


            const searchMatch =
                text.includes(search);


            const departmentMatch =
                !department ||
                employee.department === department;


            const designationMatch =
                !designation ||
                employee.designation === designation;


            return (
                searchMatch &&
                departmentMatch &&
                designationMatch
            );

        });


    displayEmployees(filtered);

}


// ======================================================
// OPEN ADD EMPLOYEE
// ======================================================

function openAddEmployee() {

    clearForm();


    document.getElementById(
        "modalTitle"
    ).innerHTML = `

        <i class="fa-solid fa-user-plus"></i>
        Add Employee

    `;


    document.getElementById(
        "saveButtonText"
    ).textContent =
        "Save Employee";


    document.getElementById(
        "employeeModal"
    ).classList.add("show");

}


// ======================================================
// CLOSE MODAL
// ======================================================

function closeEmployeeModal() {

    document.getElementById(
        "employeeModal"
    ).classList.remove("show");

}


// ======================================================
// SAVE / UPDATE
// ======================================================

function saveEmployee() {

    const id =
        document.getElementById(
            "employeeId"
        ).value;


    const employee = {

        employeeCode:
            document.getElementById(
                "employeeCode"
            ).value.trim(),

        name:
            document.getElementById(
                "employeeName"
            ).value.trim(),

        email:
            document.getElementById(
                "email"
            ).value.trim(),

        mobile:
            document.getElementById(
                "mobile"
            ).value.trim(),

        designation:
        document.getElementById(
            "designation"
        ).value,

        department:
        document.getElementById(
            "department"
        ).value

    };


    let url = "/employees";

    let method = "POST";


    if (id) {

        url =
            "/employees/" + id;

        method = "PUT";

    }


    fetch(url, {

        method: method,

        headers: {

            "Content-Type":
                "application/json"

        },

        body:
            JSON.stringify(employee)

    })

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to save employee"
                );

            }

            return response.json();

        })

        .then(() => {

            alert(
                id
                    ? "Employee Updated Successfully"
                    : "Employee Saved Successfully"
            );


            closeEmployeeModal();

            clearForm();

            loadEmployees();

        })

        .catch(error => {

            console.error(error);

            alert(
                "Unable to save employee"
            );

        });

}


// ======================================================
// EDIT EMPLOYEE
// ======================================================

function editEmployee(id) {

    const employee =
        employees.find(
            item => item.id === id
        );


    if (!employee) {

        return;

    }


    document.getElementById(
        "employeeId"
    ).value = employee.id;


    document.getElementById(
        "employeeCode"
    ).value =
        employee.employeeCode || "";


    document.getElementById(
        "employeeName"
    ).value =
        employee.name || "";


    document.getElementById(
        "email"
    ).value =
        employee.email || "";


    document.getElementById(
        "mobile"
    ).value =
        employee.mobile || "";


    document.getElementById(
        "designation"
    ).value =
        employee.designation || "";


    document.getElementById(
        "department"
    ).value =
        employee.department || "";


    document.getElementById(
        "modalTitle"
    ).innerHTML = `

        <i class="fa-solid fa-user-pen"></i>
        Edit Employee

    `;


    document.getElementById(
        "saveButtonText"
    ).textContent =
        "Update Employee";


    document.getElementById(
        "employeeModal"
    ).classList.add("show");

}


// ======================================================
// DELETE
// ======================================================

function deleteEmployee(id) {

    const employee =
        employees.find(
            item => item.id === id
        );


    if (!employee) {

        return;

    }


    const confirmDelete =
        confirm(

            "Are you sure you want to delete " +
            employee.name +
            "?"

        );


    if (!confirmDelete) {

        return;

    }


    fetch(
        "/employees/" + id,
        {
            method: "DELETE"
        }
    )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Delete failed"
                );

            }

            return response.text();

        })

        .then(() => {

            alert(
                "Employee Deleted Successfully"
            );

            loadEmployees();

        })

        .catch(error => {

            console.error(error);

            alert(
                "Unable to delete employee"
            );

        });

}


// ======================================================
// CLEAR FORM
// ======================================================

function clearForm() {

    document.getElementById(
        "employeeId"
    ).value = "";


    document.getElementById(
        "employeeCode"
    ).value = "";


    document.getElementById(
        "employeeName"
    ).value = "";


    document.getElementById(
        "email"
    ).value = "";


    document.getElementById(
        "mobile"
    ).value = "";


    document.getElementById(
        "designation"
    ).value = "";


    document.getElementById(
        "department"
    ).value = "";

}


// ======================================================
// DASHBOARD
// ======================================================

function goDashboard() {

    window.location.href =
        "dashboard.html";

}


// ======================================================
// HELPERS
// ======================================================

function getInitial(name) {

    if (!name) {

        return "?";

    }

    return name
        .trim()
        .charAt(0)
        .toUpperCase();

}


function safe(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "-";

    }

    return value;

}


// ======================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ======================================================

document.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "employeeModal"
            );


        if (
            event.target === modal
        ) {

            closeEmployeeModal();

        }

    }
);