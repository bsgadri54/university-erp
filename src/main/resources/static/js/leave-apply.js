// ============================================
// Leave Apply - University ERP
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    const role = localStorage.getItem("role");

    if (role !== "EMPLOYEE") {
        alert("Access Denied! Only employees can apply for leave.");
        window.location.href = "login.html";
        return;
    }

    loadEmployeeDetails();
    loadLeaves();

    document
        .getElementById("searchLeave")
        .addEventListener("keyup", searchLeave);

});

// ============================================
// Load Employee Details
// ============================================

function loadEmployeeDetails() {

    const userId = localStorage.getItem("userId");

    fetch("/employees/user/" + userId)

        .then(response => {

            if (!response.ok) {
                throw new Error("Employee not found");
            }

            return response.json();

        })

        .then(emp => {

            document.getElementById("employeeId").value = emp.employeeCode;
            document.getElementById("employeeName").value = emp.name;
            document.getElementById("department").value = emp.department;

        })

        .catch(error => {

            console.error(error);

            alert("Unable to load employee details.");

        });

}

// ============================================
// Apply Leave
// ============================================

const leaveForm = document.getElementById("leaveForm");

leaveForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const leaveType = document.getElementById("leaveType").value;
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const reason = document.getElementById("reason").value.trim();

    if (!leaveType || !fromDate || !toDate || !reason) {
        alert("Please fill all fields.");
        return;
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);

    const totalDays =
        Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (totalDays <= 0) {
        alert("Invalid Leave Dates.");
        return;
    }

    const leave = {

        userId: Number(localStorage.getItem("userId")),

        personType: "EMPLOYEE",

        personId: document.getElementById("employeeId").value,

        personName: document.getElementById("employeeName").value,

        leaveType: leaveType,

        totalDays: totalDays,

        fromDate: fromDate,

        toDate: toDate,

        reason: reason

    };

    fetch("/leave", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(leave)

    })

        .then(response => {

            if (!response.ok) {
                throw new Error("Failed");
            }

            return response.json();

        })

        .then(() => {

            alert("Leave Applied Successfully!");

            leaveForm.reset();

            loadEmployeeDetails();

            loadLeaves();

        })

        .catch(error => {

            console.error(error);

            alert("Unable to Apply Leave.");

        });

});

// ============================================
// Load Leave History
// ============================================

function loadLeaves() {

    const userId = localStorage.getItem("userId");

    fetch("/leave/employee/" + userId)

        .then(response => {

            if (!response.ok) {
                throw new Error("Unable to fetch leave data");
            }

            return response.json();

        })

        .then(leaves => {

            const tbody = document.getElementById("leaveTableBody");

            tbody.innerHTML = "";

            if (leaves.length === 0) {

                tbody.innerHTML = `
                    <tr>
                        <td colspan="10" style="text-align:center;">
                            No Leave Applications Found
                        </td>
                    </tr>
                `;

                return;
            }

            leaves.forEach(leave => {

                let statusBadge = "";

                switch (leave.status) {

                    case "APPROVED":
                        statusBadge =
                            `<span class="status approved">Approved</span>`;
                        break;

                    case "REJECTED":
                        statusBadge =
                            `<span class="status rejected">Rejected</span>`;
                        break;

                    default:
                        statusBadge =
                            `<span class="status pending">Pending</span>`;
                }

                let action = "";

                if (leave.status === "PENDING") {

                    action = `
                        <button
                            class="btn-delete"
                            onclick="deleteLeave(${leave.id})">
                            Delete
                        </button>
                    `;

                } else {

                    action = `
                        <span class="locked">
                            Locked
                        </span>
                    `;
                }

                tbody.innerHTML += `
                    <tr>

                        <td>${leave.id}</td>

                        <td>${leave.leaveType}</td>

                        <td>${leave.fromDate}</td>

                        <td>${leave.toDate}</td>

                        <td>${leave.totalDays}</td>

                        <td>${leave.appliedDate ?? "-"}</td>

                        <td>${leave.approvalDate ?? "-"}</td>

                        <td>${statusBadge}</td>

                        <td>${leave.remarks ?? "-"}</td>

                        <td>${action}</td>

                    </tr>
                `;

            });

        })

        .catch(error => {

            console.error(error);

            alert("Unable to load leave history.");

        });

}

// ============================================
// Delete Leave
// ============================================

function deleteLeave(id) {

    if (!confirm("Delete this leave application?")) {
        return;
    }

    fetch("/leave/" + id, {

        method: "DELETE"

    })

        .then(response => {

            if (!response.ok) {
                throw new Error("Delete Failed");
            }

            alert("Leave Deleted Successfully.");

            loadLeaves();

        })

        .catch(error => {

            console.error(error);

            alert("Unable to Delete Leave.");

        });

}

// ============================================
// Search Leave
// ============================================

function searchLeave() {

    const input = document
        .getElementById("searchLeave")
        .value
        .toUpperCase();

    const rows = document
        .getElementById("leaveTableBody")
        .getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {

        const text = rows[i].innerText.toUpperCase();

        rows[i].style.display =
            text.indexOf(input) > -1 ? "" : "none";

    }

}