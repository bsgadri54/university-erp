// ============================================
// Leave Apply - University ERP
// ============================================


document.addEventListener("DOMContentLoaded", () => {

    const role = localStorage.getItem("role");

    // ========================================
    // Employee Access Check
    // ========================================

    if (role !== "EMPLOYEE") {

        Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only employees can apply for leave.",
            confirmButtonColor: "#2467d8"
        }).then(() => {

            window.location.href = "login.html";

        });

        return;
    }


    // ========================================
    // Load Employee Details
    // ========================================

    loadEmployeeDetails();


    // ========================================
    // Load Leave History
    // ========================================

    loadLeaves();


    // ========================================
    // Search
    // ========================================

    document
        .getElementById("searchLeave")
        .addEventListener("input", searchLeave);


    // ========================================
    // Leave Form Submit
    // ========================================

    document
        .getElementById("leaveForm")
        .addEventListener("submit", applyLeave);


    // ========================================
    // Date Validation
    // ========================================

    document
        .getElementById("fromDate")
        .addEventListener("change", validateDates);


    document
        .getElementById("toDate")
        .addEventListener("change", validateDates);

});


// ============================================
// Load Employee Details
// ============================================

function loadEmployeeDetails() {

    const userId = localStorage.getItem("userId");

    if (!userId) {

        Swal.fire({
            icon: "error",
            title: "Session Expired",
            text: "Please login again.",
            confirmButtonColor: "#2467d8"
        }).then(() => {

            window.location.href = "login.html";

        });

        return;
    }


    fetch("/employees/user/" + encodeURIComponent(userId))

        .then(response => {

            if (!response.ok) {

                throw new Error("Employee not found");

            }

            return response.json();

        })

        .then(emp => {

            document.getElementById("employeeId").value =
                emp.employeeCode ?? "";

            document.getElementById("employeeName").value =
                emp.name ?? "";

            document.getElementById("department").value =
                emp.department ?? "";

        })

        .catch(error => {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Unable to load employee details.",
                confirmButtonColor: "#2467d8"
            });

        });

}


// ============================================
// Apply Leave
// ============================================

function applyLeave(event) {

    event.preventDefault();


    const leaveType =
        document.getElementById("leaveType").value;

    const fromDate =
        document.getElementById("fromDate").value;

    const toDate =
        document.getElementById("toDate").value;

    const reason =
        document.getElementById("reason").value.trim();


    // ========================================
    // Required Fields
    // ========================================

    if (!leaveType ||
        !fromDate ||
        !toDate ||
        !reason) {

        Swal.fire({
            icon: "warning",
            title: "Incomplete Form",
            text: "Please fill all required fields.",
            confirmButtonColor: "#2467d8"
        });

        return;
    }


    // ========================================
    // Validate Dates
    // ========================================

    const start = new Date(fromDate);
    const end = new Date(toDate);


    if (end < start) {

        Swal.fire({
            icon: "warning",
            title: "Invalid Dates",
            text: "To Date cannot be earlier than From Date.",
            confirmButtonColor: "#2467d8"
        });

        return;
    }


    // ========================================
    // Calculate Total Days
    // ========================================

    const totalDays =
        Math.floor(
            (end - start) /
            (1000 * 60 * 60 * 24)
        ) + 1;


    if (totalDays <= 0) {

        Swal.fire({
            icon: "warning",
            title: "Invalid Leave Dates",
            text: "Please select valid leave dates.",
            confirmButtonColor: "#2467d8"
        });

        return;
    }


    // ========================================
    // Leave Object
    // ========================================

    const leave = {

        userId:
            Number(localStorage.getItem("userId")),

        personType:
            "EMPLOYEE",

        personId:
        document.getElementById("employeeId").value,

        personName:
        document.getElementById("employeeName").value,

        leaveType:
        leaveType,

        totalDays:
        totalDays,

        fromDate:
        fromDate,

        toDate:
        toDate,

        reason:
        reason
    };


    // ========================================
    // Submit to Backend
    // ========================================

    Swal.fire({
        title: "Submitting Leave...",
        text: "Please wait.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {

            Swal.showLoading();

        }
    });


    fetch("/leave", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(leave)

    })

        .then(response => {

            if (!response.ok) {

                throw new Error("Failed to apply leave");

            }

            return response.json();

        })

        .then(() => {

            Swal.fire({
                icon: "success",
                title: "Leave Applied",
                text: "Your leave application has been submitted successfully.",
                confirmButtonColor: "#16a05d"
            });


            // Reset form

            document
                .getElementById("leaveForm")
                .reset();


            // Restore employee details

            loadEmployeeDetails();


            // Reload history

            loadLeaves();

        })

        .catch(error => {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Application Failed",
                text: "Unable to apply leave. Please try again.",
                confirmButtonColor: "#dc3545"
            });

        });

}


// ============================================
// Date Validation
// ============================================

function validateDates() {

    const fromDate =
        document.getElementById("fromDate").value;

    const toDate =
        document.getElementById("toDate").value;


    if (!fromDate || !toDate) {
        return;
    }


    const start = new Date(fromDate);
    const end = new Date(toDate);


    if (end < start) {

        document
            .getElementById("toDate")
            .setCustomValidity(
                "To Date cannot be earlier than From Date."
            );

    } else {

        document
            .getElementById("toDate")
            .setCustomValidity("");

    }

}


// ============================================
// Load Leave History
// ============================================

function loadLeaves() {

    const userId =
        localStorage.getItem("userId");


    fetch(
        "/leave/employee/" +
        encodeURIComponent(userId)
    )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to fetch leave data"
                );

            }

            return response.json();

        })

        .then(leaves => {

            const tbody =
                document.getElementById(
                    "leaveTableBody"
                );


            tbody.innerHTML = "";


            // ==================================
            // No Records
            // ==================================

            if (!leaves ||
                leaves.length === 0) {

                tbody.innerHTML = `

                    <tr>

                        <td
                            colspan="10"
                            class="no-records">

                            No Leave Applications Found

                        </td>

                    </tr>

                `;

                return;
            }


            // ==================================
            // Display Records
            // ==================================

            leaves.forEach(leave => {

                let statusBadge = "";


                // ==================================
                // Status
                // ==================================

                switch (leave.status) {

                    case "APPROVED":

                        statusBadge = `
                            <span class="status approved">
                                Approved
                            </span>
                        `;

                        break;


                    case "REJECTED":

                        statusBadge = `
                            <span class="status rejected">
                                Rejected
                            </span>
                        `;

                        break;


                    default:

                        statusBadge = `
                            <span class="status pending">
                                Pending
                            </span>
                        `;

                        break;
                }


                // ==================================
                // Action
                // ==================================

                let action = "";


                if (leave.status === "PENDING") {

                    action = `

                        <button
                            class="btn-delete"
                            onclick="deleteLeave(${leave.id})">

                            <i class="fas fa-trash"></i>
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


                // ==================================
                // Table Row
                // ==================================

                tbody.innerHTML += `

                    <tr>

                        <td>
                            ${escapeHtml(leave.id)}
                        </td>

                        <td>
                            ${escapeHtml(
                    leave.leaveType ?? "-"
                )}
                        </td>

                        <td>
                            ${escapeHtml(
                    leave.fromDate ?? "-"
                )}
                        </td>

                        <td>
                            ${escapeHtml(
                    leave.toDate ?? "-"
                )}
                        </td>

                        <td>
                            ${escapeHtml(
                    leave.totalDays ?? "-"
                )}
                        </td>

                        <td>
                            ${escapeHtml(
                    leave.appliedDate ?? "-"
                )}
                        </td>

                        <td>
                            ${escapeHtml(
                    leave.approvalDate ?? "-"
                )}
                        </td>

                        <td>
                            ${statusBadge}
                        </td>

                        <td>
                            ${escapeHtml(
                    leave.remarks ?? "-"
                )}
                        </td>

                        <td>
                            ${action}
                        </td>

                    </tr>

                `;

            });

        })

        .catch(error => {

            console.error(error);

            const tbody =
                document.getElementById(
                    "leaveTableBody"
                );


            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="10"
                        class="no-records">

                        Unable to load leave history.

                    </td>

                </tr>

            `;

        });

}


// ============================================
// Delete Leave
// ============================================

function deleteLeave(id) {

    Swal.fire({

        icon: "warning",

        title: "Delete Leave?",

        text: "Are you sure you want to delete this leave application?",

        showCancelButton: true,

        confirmButtonText: "Yes, Delete",

        cancelButtonText: "Cancel",

        confirmButtonColor: "#dc3545",

        cancelButtonColor: "#6c757d"

    })

        .then(result => {

            if (!result.isConfirmed) {
                return;
            }


            return fetch(
                "/leave/" + encodeURIComponent(id),
                {
                    method: "DELETE"
                }
            );

        })

        .then(response => {

            if (!response) {
                return;
            }


            if (!response.ok) {

                throw new Error(
                    "Delete Failed"
                );

            }


            Swal.fire({
                icon: "success",
                title: "Deleted",
                text: "Leave application deleted successfully.",
                confirmButtonColor: "#16a05d"
            });


            loadLeaves();

        })

        .catch(error => {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text: "Unable to delete leave application.",
                confirmButtonColor: "#dc3545"
            });

        });

}


// ============================================
// Search Leave
// ============================================

function searchLeave() {

    const input =
        document
            .getElementById("searchLeave")
            .value
            .toUpperCase()
            .trim();


    const rows =
        document
            .getElementById("leaveTableBody")
            .getElementsByTagName("tr");


    for (let i = 0; i < rows.length; i++) {

        const text =
            rows[i]
                .innerText
                .toUpperCase();


        rows[i].style.display =
            text.includes(input)
                ? ""
                : "none";

    }

}


// ============================================
// HTML Escape
// ============================================

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "-";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}