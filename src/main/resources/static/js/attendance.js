// =========================================
// Attendance Management
// =========================================

// Page Load



window.onload = function () {

    loadAttendance();
    loadNames();



};

// =========================================
// Load Student / Employee Names
// =========================================

function loadNames() {

    let type = document.getElementById("type").value;

    let url = "";

    if (type === "STUDENT") {

        url = "/students";

    } else {

        url = "/employees";

    }

    fetch(url)
        .then(response => response.json())
        .then(data => {

            let options = '<option value="">Select Name</option>';

            data.forEach(item => {

                if (type === "STUDENT") {

                    options += `
                <option
                    value="${item.name}"
                    data-userid="${item.userId}"
                    data-personid="${item.enrollmentNo}">
                    ${item.name}
                </option>
                `;

                } else {

                    options += `
                <option
                    value="${item.name}"
                    data-userid="${item.userId}"
                    data-personid="${item.employeeCode}">
                    ${item.name}
                </option>
                `;

                }

            });

            document.getElementById("name").innerHTML = options;

        })
        .catch(error => {

            console.error(error);

            alert("Unable to load names");

        });

}

// =========================================
// Save Attendance
// =========================================

function saveAttendance() {

    let selected = document.getElementById("name").selectedOptions[0];

    if (!selected || selected.value === "") {
        alert("Please select a name.");
        return;
    }

    let attendance = {

        userId: 0,

        personId: selected.dataset.personid,

        personType: document.getElementById("type").value,

        personName: selected.value,

        attendanceDate: document.getElementById("date").value,

        status: document.getElementById("status").value

    };

    if (attendance.personName === "") {

        alert("Please select a name.");
        return;

    }

    if (attendance.attendanceDate === "") {

        alert("Please select attendance date.");
        return;

    }

    fetch("/attendance", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(attendance)

    })

        .then(response => {

            if (!response.ok) {

                throw new Error("Save Failed");

            }

            return response.text();

        })

        .then(data => {
            alert("Attendance Saved Successfully");
            loadAttendance();
            clearForm();
        })

        .catch(error => {

            console.error(error);

            alert("Unable To Save Attendance");

        });

}

// =========================================
// Load Attendance
// =========================================

function loadAttendance() {

    fetch("/attendance")

        .then(response => response.json())

        .then(data => {

            let rows = "";

            data.forEach(a => {

                rows += `

                <tr>

                    <td>${a.id}</td>

                    <td>${a.personType}</td>

                    <td>${a.personName}</td>

                    <td>${a.attendanceDate}</td>

                    <td class="${a.status === 'PRESENT'
                    ? 'status-present'
                    : 'status-absent'}">

                        ${a.status}

                    </td>

                    <td>

                        <button
                            class="edit-btn"
                            onclick="alert('Edit feature coming soon')">

                            Edit

                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteAttendance(${a.id})">

                            Delete

                        </button>

                    </td>

                </tr>

                `;

            });

            document.getElementById("attendanceTable").innerHTML = rows;

        })

        .catch(error => {

            console.error(error);

            alert("Unable To Load Attendance");

        });

}

// =========================================
// Delete Attendance
// =========================================

function deleteAttendance(id) {

    if (!confirm("Delete Attendance?")) {

        return;

    }

    fetch("/attendance/" + id, {

        method: "DELETE"

    })

        .then(response => {

            if (!response.ok) {

                throw new Error("Delete Failed");

            }

            return response.text();

        })

        .then(() => {

            alert("Attendance Deleted Successfully");

            loadAttendance();

        })

        .catch(error => {

            console.error(error);

            alert("Unable To Delete Attendance");

        });

}

// =========================================
// Search Attendance
// =========================================

function searchAttendance() {

    let filter = document
        .getElementById("searchAttendance")
        .value
        .toLowerCase();

    let rows = document.querySelectorAll("#attendanceTable tr");

    rows.forEach(row => {

        let text = row.textContent.toLowerCase();

        if (text.includes(filter)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

}

// =========================================
// Clear Form
// =========================================

function clearForm() {

    document.getElementById("type").selectedIndex = 0;

    loadNames();

    document.getElementById("name").selectedIndex = 0;

    document.getElementById("date").value = "";

    document.getElementById("status").selectedIndex = 0;

}