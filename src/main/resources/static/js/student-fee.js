/* ==========================================
   UNIVERSITY ERP - STUDENT FEE
========================================== */

let studentFees = [];


/* ==========================================
   PAGE LOAD
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const username = localStorage.getItem("username");

    if (!username) {

        window.location.href = "login.html";

        return;
    }

    loadStudentFees(username);

});


/* ==========================================
   LOAD STUDENT FEES
========================================== */

async function loadStudentFees(enrollmentNo) {

    try {

        const response =
            await fetch(
                `/fees/student/${encodeURIComponent(enrollmentNo)}`
            );

        if (!response.ok) {

            throw new Error(
                "Unable to load fee details."
            );
        }

        studentFees =
            await response.json();

        loadStudentDetails(enrollmentNo);

        displayFees(studentFees);

        calculateSummary(studentFees);

    } catch (error) {

        console.error(
            "Error loading student fees:",
            error
        );

        document.getElementById("feeTable").innerHTML = `
            <tr>
                <td colspan="9"
                    style="text-align:center;color:red;padding:25px;">
                    Unable to load fee details.
                </td>
            </tr>
        `;
    }

}


/* ==========================================
   LOAD STUDENT DETAILS
========================================== */

async function loadStudentDetails(enrollmentNo) {

    try {

        const response =
            await fetch("/students");

        if (!response.ok) {
            throw new Error("Unable to load students.");
        }

        const students =
            await response.json();

        const student =
            students.find(
                s =>
                    s.enrollmentNo === enrollmentNo
            );

        if (!student) {

            document.getElementById(
                "studentName"
            ).textContent = "Not Found";

            document.getElementById(
                "enrollmentNo"
            ).textContent = enrollmentNo;

            return;
        }


        document.getElementById(
            "studentName"
        ).textContent =
            student.name || "-";


        document.getElementById(
            "enrollmentNo"
        ).textContent =
            student.enrollmentNo || "-";


        document.getElementById(
            "course"
        ).textContent =
            student.course || "-";


        document.getElementById(
            "semester"
        ).textContent =
            student.semester || "-";


    } catch (error) {

        console.error(
            "Error loading student details:",
            error
        );

    }

}


/* ==========================================
   DISPLAY FEES
========================================== */

function displayFees(fees) {

    const table =
        document.getElementById(
            "feeTable"
        );

    table.innerHTML = "";


    if (!fees || fees.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="9"
                    style="text-align:center;padding:25px;">
                    No fee records available.
                </td>
            </tr>
        `;

        return;
    }


    fees.forEach((fee, index) => {

        const status =
            (fee.paymentStatus || "PENDING")
                .toUpperCase();


        let statusClass =
            "status-pending";


        if (status === "PAID") {

            statusClass =
                "status-paid";

        } else if (status === "PARTIAL") {

            statusClass =
                "status-partial";

        }


        let actionButton = "";


        if (
            Number(fee.remainingAmount) > 0
        ) {

            actionButton = `
                <button
                    class="pay-btn"
                    onclick="payFee(${fee.id})">

                    <i class="fa-solid fa-credit-card"></i>
                    Pay Now

                </button>
            `;

        } else {

            actionButton = `
                <button
                    class="paid-btn"
                    disabled>

                    <i class="fa-solid fa-check"></i>
                    Paid

                </button>
            `;

        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${index + 1}</td>

            <td>${escapeHtml(
            fee.semester || "-"
        )}</td>

            <td>
                ₹${formatAmount(
            fee.totalFee
        )}
            </td>

            <td>
                ₹${formatAmount(
            fee.paidAmount
        )}
            </td>

            <td>
                ₹${formatAmount(
            fee.remainingAmount
        )}
            </td>

            <td>
                ${fee.paymentDate || "-"}
            </td>

            <td>
                ${escapeHtml(
            fee.paymentMode || "-"
        )}
            </td>

            <td>

                <span class="${statusClass}">
                    ${status}
                </span>

            </td>

            <td>
                ${actionButton}
            </td>

        `;


        table.appendChild(row);

    });

}


/* ==========================================
   SUMMARY
========================================== */

function calculateSummary(fees) {

    if (!fees || fees.length === 0) {

        setSummary(
            0,
            0,
            0,
            "-"
        );

        return;
    }


    /*
       For multiple fee records:

       Total = sum of total fees
       Paid = sum of paid amounts
       Remaining = sum of remaining amounts
    */

    let total = 0;

    let paid = 0;

    let remaining = 0;


    fees.forEach(fee => {

        total +=
            Number(fee.totalFee) || 0;

        paid +=
            Number(fee.paidAmount) || 0;

        remaining +=
            Number(fee.remainingAmount) || 0;

    });


    let status = "PENDING";


    if (remaining === 0 && total > 0) {

        status = "PAID";

    } else if (paid > 0) {

        status = "PARTIAL";

    }


    setSummary(
        total,
        paid,
        remaining,
        status
    );

}


/* ==========================================
   SET SUMMARY
========================================== */

function setSummary(
    total,
    paid,
    remaining,
    status
) {

    document.getElementById(
        "totalFee"
    ).textContent =
        "₹" + formatAmount(total);


    document.getElementById(
        "paidAmount"
    ).textContent =
        "₹" + formatAmount(paid);


    document.getElementById(
        "remainingAmount"
    ).textContent =
        "₹" + formatAmount(remaining);


    document.getElementById(
        "paymentStatus"
    ).textContent =
        status;

}


function payFee(id) {

    const fee = studentFees.find(
        item => item.id === id
    );

    if (!fee) {
        alert("Fee record not found.");
        return;
    }

    const remaining =
        Number(fee.remainingAmount) || 0;

    if (remaining <= 0) {

        alert("This fee is already fully paid.");

        return;
    }

    // Store selected fee temporarily
    localStorage.setItem(
        "selectedFeeId",
        fee.id
    );

    localStorage.setItem(
        "selectedFeeAmount",
        remaining
    );

    localStorage.setItem(
        "selectedFeeSemester",
        fee.semester || ""
    );

    // Open payment page
    window.location.href =
        "student-fee-payment.html";
}


/* ==========================================
   BACK TO DASHBOARD
========================================== */

function goDashboard() {

    window.location.href =
        "student-dashboard.html";

}


/* ==========================================
   FORMAT AMOUNT
========================================== */

function formatAmount(amount) {

    const value =
        Number(amount);


    if (isNaN(value)) {

        return "0.00";
    }


    return value.toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


/* ==========================================
   HTML ESCAPE
========================================== */

function escapeHtml(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(
            /'/g,
            "&#039;"
        );

}