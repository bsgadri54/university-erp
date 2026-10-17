// =========================================================
// UNIVERSITY ERP - ATTENDANCE MANAGEMENT
// =========================================================

let attendanceData = [];


// =========================================================
// PAGE LOAD
// =========================================================

window.onload = function () {

    loadAttendance();

    loadNames();

};


// =========================================================
// FOCUS ATTENDANCE FORM
// =========================================================

function focusAttendanceForm() {

    const form = document.getElementById("attendanceFormCard");

    form.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    setTimeout(() => {

        document.getElementById("name").focus();

    }, 500);

}


// =========================================================
// LOAD STUDENT / EMPLOYEE NAMES
// =========================================================

function loadNames() {

    const type =
        document.getElementById("type").value;

    let url = "";

    if (type === "STUDENT") {

        url = "/students";

    } else {

        url = "/employees";

    }


    fetch(url)

        .then(response => {

            if (!response.ok) {

                throw new Error("Unable to load names");

            }

            return response.json();

        })

        .then(data => {

            let options =
                '<option value="">Select Name</option>';


            data.forEach(item => {

                if (type === "STUDENT") {

                    options += `

                        <option
                            value="${item.name}"
                            data-userid="${item.userId ?? 0}"
                            data-personid="${item.enrollmentNo ?? ""}">

                            ${item.name}

                        </option>

                    `;

                } else {

                    options += `

                        <option
                            value="${item.name}"
                            data-userid="${item.userId ?? 0}"
                            data-personid="${item.employeeCode ?? ""}">

                            ${item.name}

                        </option>

                    `;

                }

            });


            document.getElementById("name")
                .innerHTML = options;

        })

        .catch(error => {

            console.error(error);

            document.getElementById("name").innerHTML =
                '<option value="">Unable to load names</option>';

        });

}


// =========================================================
// SAVE ATTENDANCE
// =========================================================

function saveAttendance() {

    const selected =
        document.getElementById("name")
            .selectedOptions[0];


    if (!selected ||
        selected.value === "") {

        alert("Please select a name.");

        return;

    }


    const attendance = {

        userId:
            selected.dataset.userid || 0,

        personId:
            selected.dataset.personid || "",

        personType:
        document.getElementById("type").value,

        personName:
        selected.value,

        attendanceDate:
        document.getElementById("date").value,

        status:
        document.getElementById("status").value

    };


    if (!attendance.attendanceDate) {

        alert("Please select attendance date.");

        return;

    }


    fetch("/attendance", {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"

        },

        body:
            JSON.stringify(attendance)

    })

        .then(response => {

            if (!response.ok) {

                throw new Error("Save Failed");

            }

            return response.text();

        })

        .then(() => {

            alert(
                "Attendance Saved Successfully"
            );

            clearForm();

            loadAttendance();

        })

        .catch(error => {

            console.error(error);

            alert(
                "Unable To Save Attendance"
            );

        });

}


// =========================================================
// LOAD ATTENDANCE
// =========================================================

function loadAttendance() {

    fetch("/attendance")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to load attendance"
                );

            }

            return response.json();

        })

        .then(data => {

            attendanceData = data || [];

            updateStatistics();

            renderAttendance(attendanceData);

        })

        .catch(error => {

            console.error(error);

            document.getElementById(
                "attendanceTable"
            ).innerHTML = "";

            document.getElementById(
                "emptyState"
            ).style.display = "block";

            updateStatistics();

        });

}


// =========================================================
// UPDATE STATISTICS
// =========================================================

function updateStatistics() {

    const total =
        attendanceData.length;


    const present =
        attendanceData.filter(
            a => a.status === "PRESENT"
        ).length;


    const absent =
        attendanceData.filter(
            a => a.status === "ABSENT"
        ).length;


    const students =
        attendanceData.filter(
            a => a.personType === "STUDENT"
        ).length;


    document.getElementById(
        "totalAttendance"
    ).textContent = total;


    document.getElementById(
        "presentAttendance"
    ).textContent = present;


    document.getElementById(
        "absentAttendance"
    ).textContent = absent;


    document.getElementById(
        "studentAttendance"
    ).textContent = students;

}


// =========================================================
// RENDER ATTENDANCE
// =========================================================

function renderAttendance(data) {

    const table =
        document.getElementById(
            "attendanceTable"
        );


    const emptyState =
        document.getElementById(
            "emptyState"
        );


    if (!data || data.length === 0) {

        table.innerHTML = "";

        emptyState.style.display = "block";

        return;

    }


    emptyState.style.display = "none";


    let rows = "";


    data.forEach((a, index) => {

        const typeClass =
            a.personType === "STUDENT"
                ? "type-student"
                : "type-employee";


        const statusClass =
            a.status === "PRESENT"
                ? "status-present"
                : "status-absent";


        const statusIcon =
            a.status === "PRESENT"
                ? "fa-circle"
                : "fa-circle";


        rows += `

            <tr>

                <td>
                    ${index + 1}
                </td>


                <td>

                    <span class="${typeClass}">

                        ${a.personType ?? ""}

                    </span>

                </td>


                <td>

                    <span class="person-name">

                        ${a.personName ?? ""}

                    </span>

                </td>


                <td>

                    ${a.attendanceDate ?? ""}

                </td>


                <td>

                    <span class="status-badge ${statusClass}">

                        <i class="fa-solid ${statusIcon}"></i>

                        ${a.status ?? ""}

                    </span>

                </td>


                <td>

                    <div class="action-buttons">


                        <button

                            class="edit-btn"

                            title="Edit Attendance"

                            onclick="editAttendance(${a.id})">

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button

                            class="delete-btn"

                            title="Delete Attendance"

                            onclick="deleteAttendance(${a.id})">

                            <i class="fa-solid fa-trash"></i>

                        </button>


                    </div>

                </td>

            </tr>

        `;

    });


    table.innerHTML = rows;

}


// =========================================================
// EDIT ATTENDANCE
// =========================================================

function editAttendance(id) {

    const attendance =
        attendanceData.find(
            a => a.id === id
        );


    if (!attendance) {

        alert("Attendance record not found.");

        return;

    }


    document.getElementById("type").value =
        attendance.personType;


    loadNames();


    setTimeout(() => {

        const nameSelect =
            document.getElementById("name");


        nameSelect.value =
            attendance.personName;


        document.getElementById("date").value =
            attendance.attendanceDate;


        document.getElementById("status").value =
            attendance.status;


        focusAttendanceForm();


    }, 500);


    alert(
        "Edit form loaded. Save will create an updated attendance record only if your backend supports update."
    );

}


// =========================================================
// DELETE ATTENDANCE
// =========================================================

function deleteAttendance(id) {

    if (!confirm(
        "Are you sure you want to delete this attendance record?"
    )) {

        return;

    }


    fetch("/attendance/" + id, {

        method: "DELETE"

    })

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Delete Failed"
                );

            }

            return response.text();

        })

        .then(() => {

            alert(
                "Attendance Deleted Successfully"
            );

            loadAttendance();

        })

        .catch(error => {

            console.error(error);

            alert(
                "Unable To Delete Attendance"
            );

        });

}


// =========================================================
// SEARCH ATTENDANCE
// =========================================================

function searchAttendance() {

    filterAttendance();

}


// =========================================================
// FILTER ATTENDANCE
// =========================================================

function filterAttendance() {

    const search =
        document.getElementById(
            "searchAttendance"
        ).value.toLowerCase();


    const type =
        document.getElementById(
            "typeFilter"
        ).value;


    const status =
        document.getElementById(
            "statusFilter"
        ).value;


    const filtered =
        attendanceData.filter(a => {

            const searchText = `

                ${a.personName ?? ""}

                ${a.personType ?? ""}

                ${a.attendanceDate ?? ""}

                ${a.status ?? ""}

            `.toLowerCase();


            const matchesSearch =
                searchText.includes(search);


            const matchesType =
                type === "" ||
                a.personType === type;


            const matchesStatus =
                status === "" ||
                a.status === status;


            return (
                matchesSearch &&
                matchesType &&
                matchesStatus
            );

        });


    renderAttendance(filtered);

}


// =========================================================
// CLEAR FORM
// =========================================================

function clearForm() {

    document.getElementById("type")
        .selectedIndex = 0;


    loadNames();


    document.getElementById("date")
        .value = "";


    document.getElementById("status")
        .selectedIndex = 0;

}