// ============================================
// Leave Approval - Admin
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("role") !== "ADMIN") {
        Swal.fire("Access Denied", "Only Admin can access this page.", "error")
            .then(() => window.location.href = "login.html");
        return;
    }

    loadLeaves();

    document
        .getElementById("searchLeave")
        .addEventListener("keyup", searchLeave);

});

// ============================================
// Load Leave Requests
// ============================================

function loadLeaves() {

    fetch("/leave")

        .then(res => {

            if (!res.ok)
                throw new Error();

            return res.json();

        })

        .then(leaves => {

            const tbody =
                document.getElementById("leaveTableBody");

            tbody.innerHTML = "";

            if (leaves.length === 0) {

                tbody.innerHTML = `
                <tr>
                    <td colspan="13">
                        No Leave Applications Found
                    </td>
                </tr>`;

                return;
            }

            leaves.forEach(leave => {

                let badge = "";

                switch (leave.status) {

                    case "APPROVED":
                        badge =
                            `<span class="status approved">Approved</span>`;
                        break;

                    case "REJECTED":
                        badge =
                            `<span class="status rejected">Rejected</span>`;
                        break;

                    default:
                        badge =
                            `<span class="status pending">Pending</span>`;
                }

                tbody.innerHTML += `

<tr>

<td>${leave.id}</td>

<td>${leave.personId}</td>

<td>${leave.personName}</td>

<td>${leave.leaveType}</td>

<td>${leave.fromDate}</td>

<td>${leave.toDate}</td>

<td>${leave.totalDays}</td>

<td>${leave.reason}</td>

<td>${leave.appliedDate ?? "-"}</td>

<td>${leave.approvalDate ?? "-"}</td>

<td>${badge}</td>

<td>${leave.remarks ?? "-"}</td>

<td>

<button class="btn-edit" onclick="editLeave(${leave.id})">
    <i class="fas fa-edit"></i> Edit
</button>

</td>

</tr>

`;

            });

        })

        .catch(() => {

            Swal.fire(
                "Error",
                "Unable to load leave requests.",
                "error"
            );

        });

}

// ============================================
// Edit Leave
// ============================================

function editLeave(id) {

    fetch("/leave")

        .then(res => res.json())

        .then(data => {

            let leave =
                data.find(x => x.id == id);

            if (!leave)
                return;

            document.getElementById("leaveId").value =
                leave.id;

            document.getElementById("personId").value =
                leave.personId;

            document.getElementById("personName").value =
                leave.personName;

            document.getElementById("leaveType").value =
                leave.leaveType;

            document.getElementById("fromDate").value =
                leave.fromDate;

            document.getElementById("toDate").value =
                leave.toDate;

            document.getElementById("totalDays").value =
                leave.totalDays;

            document.getElementById("status").value =
                leave.status;

            document.getElementById("remarks").value =
                leave.remarks ?? "";

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        });

}

// ============================================
// Update Leave
// ============================================

function updateLeave() {

    const id =
        document.getElementById("leaveId").value;

    if (id === "") {

        Swal.fire(
            "Warning",
            "Please select a leave record first.",
            "warning"
        );

        return;
    }

    const status =
        document.getElementById("status").value;

    const remarks =
        document.getElementById("remarks").value;

    fetch(

        "/leave/" + id +
        "/status?status=" +
        encodeURIComponent(status) +
        "&remarks=" +
        encodeURIComponent(remarks),

        {

            method: "PUT"

        }

    )

        .then(res => {

            if (!res.ok)
                throw new Error();

            return res.json();

        })

        .then(() => {

            Swal.fire(
                "Success",
                "Leave Updated Successfully",
                "success"
            );

            document
                .getElementById("leaveForm")
                .reset();

            document
                .getElementById("leaveId")
                .value = "";

            loadLeaves();

        })

        .catch(() => {

            Swal.fire(
                "Error",
                "Unable to update leave.",
                "error"
            );

        });

}

// ============================================
// Search
// ============================================

function searchLeave() {

    const keyword =
        document.getElementById("searchLeave")
            .value
            .toUpperCase();

    const rows =
        document.getElementById("leaveTableBody")
            .getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {

        rows[i].style.display =
            rows[i].innerText.toUpperCase().includes(keyword)
                ? ""
                : "none";

    }

}