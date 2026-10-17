// =========================================================
// Leave Approval | University ERP
// Admin Module
// =========================================================


// =========================================================
// PAGE LOAD
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    // -----------------------------------------------------
    // ADMIN ACCESS CHECK
    // -----------------------------------------------------

    const role = localStorage.getItem("role");

    if (role !== "ADMIN") {

        Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only Admin can access this page.",
            confirmButtonText: "OK"
        }).then(function () {

            window.location.href = "login.html";

        });

        return;

    }


    // -----------------------------------------------------
    // LOAD LEAVES
    // -----------------------------------------------------

    loadLeaves();


    // -----------------------------------------------------
    // SEARCH EVENT
    // -----------------------------------------------------

    const searchInput =
        document.getElementById("searchLeave");

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchLeave
        );

    }


    // -----------------------------------------------------
    // FORM RESET
    // -----------------------------------------------------

    const leaveForm =
        document.getElementById("leaveForm");

    if (leaveForm) {

        leaveForm.addEventListener(
            "reset",
            function () {

                setTimeout(function () {

                    document.getElementById("leaveId").value = "";

                }, 0);

            }
        );

    }

});


// =========================================================
// LOAD LEAVE APPLICATIONS
// =========================================================

function loadLeaves() {

    fetch("/leave")

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Unable to load leave applications."
                );

            }

            return response.json();

        })

        .then(function (leaves) {

            renderLeaveTable(leaves);

        })

        .catch(function (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Unable to load leave requests."
            });

        });

}


// =========================================================
// RENDER TABLE
// =========================================================

function renderLeaveTable(leaves) {

    const tbody =
        document.getElementById("leaveTableBody");


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    // -----------------------------------------------------
    // NO DATA
    // -----------------------------------------------------

    if (!Array.isArray(leaves) || leaves.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="13" class="empty-message">
                    No Leave Applications Found
                </td>
            </tr>
        `;

        return;

    }


    // -----------------------------------------------------
    // CREATE ROWS
    // -----------------------------------------------------

    leaves.forEach(function (leave) {

        const row =
            document.createElement("tr");


        // Status badge

        const statusBadge =
            createStatusBadge(leave.status);


        row.innerHTML = `

            <td>
                ${escapeHtml(leave.id)}
            </td>

            <td>
                ${escapeHtml(leave.personId)}
            </td>

            <td>
                ${escapeHtml(leave.personName)}
            </td>

            <td>
                ${escapeHtml(leave.leaveType)}
            </td>

            <td>
                ${escapeHtml(leave.fromDate)}
            </td>

            <td>
                ${escapeHtml(leave.toDate)}
            </td>

            <td>
                ${escapeHtml(leave.totalDays)}
            </td>

            <td>
                ${escapeHtml(leave.reason || "-")}
            </td>

            <td>
                ${escapeHtml(leave.appliedDate || "-")}
            </td>

            <td>
                ${escapeHtml(leave.approvalDate || "-")}
            </td>

            <td>
                ${statusBadge}
            </td>

            <td>
                ${escapeHtml(leave.remarks || "-")}
            </td>

            <td>

                <button
                    type="button"
                    class="btn-edit"
                    onclick="editLeave(${Number(leave.id)})">

                    <i class="fas fa-edit"></i>
                    Edit

                </button>

            </td>

        `;


        tbody.appendChild(row);

    });

}


// =========================================================
// CREATE STATUS BADGE
// =========================================================

function createStatusBadge(status) {

    const currentStatus =
        String(status || "PENDING").toUpperCase();


    if (currentStatus === "APPROVED") {

        return `
            <span class="status approved">
                Approved
            </span>
        `;

    }


    if (currentStatus === "REJECTED") {

        return `
            <span class="status rejected">
                Rejected
            </span>
        `;

    }


    return `
        <span class="status pending">
            Pending
        </span>
    `;

}


// =========================================================
// EDIT LEAVE
// =========================================================

function editLeave(id) {

    fetch("/leave")

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Unable to load leave."
                );

            }

            return response.json();

        })

        .then(function (leaves) {

            const leave =
                leaves.find(function (item) {

                    return Number(item.id) === Number(id);

                });


            if (!leave) {

                Swal.fire({
                    icon: "warning",
                    title: "Not Found",
                    text: "Leave application not found."
                });

                return;

            }


            // -------------------------------------------------
            // Fill Form
            // -------------------------------------------------

            document.getElementById("leaveId").value =
                leave.id ?? "";


            document.getElementById("personId").value =
                leave.personId ?? "";


            document.getElementById("personName").value =
                leave.personName ?? "";


            document.getElementById("leaveType").value =
                leave.leaveType ?? "";


            document.getElementById("fromDate").value =
                leave.fromDate ?? "";


            document.getElementById("toDate").value =
                leave.toDate ?? "";


            document.getElementById("totalDays").value =
                leave.totalDays ?? "";


            document.getElementById("status").value =
                leave.status ?? "PENDING";


            document.getElementById("remarks").value =
                leave.remarks ?? "";


            // -------------------------------------------------
            // Scroll To Top
            // -------------------------------------------------

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        })

        .catch(function (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Unable to load leave application."
            });

        });

}


// =========================================================
// UPDATE LEAVE
// =========================================================

function updateLeave() {

    const id =
        document.getElementById("leaveId").value.trim();


    // -----------------------------------------------------
    // CHECK RECORD SELECTED
    // -----------------------------------------------------

    if (id === "") {

        Swal.fire({
            icon: "warning",
            title: "Select Leave",
            text: "Please select a leave record first."
        });

        return;

    }


    // -----------------------------------------------------
    // GET FORM VALUES
    // -----------------------------------------------------

    const status =
        document.getElementById("status").value;


    const remarks =
        document.getElementById("remarks").value.trim();


    // -----------------------------------------------------
    // UPDATE API
    // -----------------------------------------------------

    const url =
        "/leave/" +
        encodeURIComponent(id) +
        "/status?status=" +
        encodeURIComponent(status) +
        "&remarks=" +
        encodeURIComponent(remarks);


    fetch(url, {

        method: "PUT"

    })

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Unable to update leave."
                );

            }

            return response.json();

        })

        .then(function () {

            Swal.fire({

                icon: "success",

                title: "Success",

                text: "Leave Updated Successfully",

                timer: 1800,

                showConfirmButton: false

            });


            // -------------------------------------------------
            // Clear Form
            // -------------------------------------------------

            document.getElementById("leaveForm").reset();

            document.getElementById("leaveId").value = "";


            // -------------------------------------------------
            // Reload Table
            // -------------------------------------------------

            loadLeaves();

        })

        .catch(function (error) {

            console.error(error);

            Swal.fire({

                icon: "error",

                title: "Error",

                text: "Unable to update leave."

            });

        });

}


// =========================================================
// SEARCH LEAVE
// =========================================================

function searchLeave() {

    const keyword =
        document.getElementById("searchLeave")
            .value
            .trim()
            .toUpperCase();


    const rows =
        document.getElementById("leaveTableBody")
            .getElementsByTagName("tr");


    for (let i = 0; i < rows.length; i++) {

        const rowText =
            rows[i].innerText.toUpperCase();


        if (rowText.includes(keyword)) {

            rows[i].style.display = "";

        } else {

            rows[i].style.display = "none";

        }

    }

}


// =========================================================
// HTML ESCAPE
// Prevents API data from injecting HTML
// =========================================================

function escapeHtml(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}