let attendanceList = [];
let filteredAttendance = [];

const userId = localStorage.getItem("userId");

window.onload = function () {

    if (!userId) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;

    }

    loadAttendance();

};

// ======================================
// Load Employee Attendance
// ======================================

function loadAttendance() {

    fetch("/attendance/employee/" + userId)

        .then(response => response.json())

        .then(data => {

            attendanceList = data;

            filteredAttendance = [...attendanceList];

            loadEmployeeInfo();

            updateCards();

            displayAttendance(filteredAttendance);

        })

        .catch(error => {

            console.error(error);

            alert("Unable to load attendance.");

        });

}

// ======================================
// Employee Information
// ======================================

function loadEmployeeInfo() {

    if (attendanceList.length === 0) {

        document.getElementById("employeeName").innerText = "No Data";

        document.getElementById("employeeCode").innerText = "-";

        return;

    }

    document.getElementById("employeeName").innerText =
        attendanceList[0].personName;

    document.getElementById("employeeCode").innerText =
        attendanceList[0].personId;

}

// ======================================
// Display Attendance
// ======================================

function displayAttendance(list) {

    let table = document.getElementById("attendanceTable");

    table.innerHTML = "";

    if (list.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="3">No attendance records found.</td>

            </tr>

        `;

        return;

    }

    list.forEach((attendance, index) => {

        table.innerHTML += `

            <tr>

                <td>${index + 1}</td>

                <td>${attendance.attendanceDate}</td>

                <td>

                    <span class="${attendance.status === 'PRESENT'
            ? 'present'
            : 'absent'}">

                        ${attendance.status}

                    </span>

                </td>

            </tr>

        `;

    });

}

// ======================================
// Summary Cards
// ======================================

function updateCards() {

    const total = filteredAttendance.length;

    const present =
        filteredAttendance.filter(a => a.status === "PRESENT").length;

    const absent =
        filteredAttendance.filter(a => a.status === "ABSENT").length;

    const percentage =
        total === 0
            ? 0
            : ((present / total) * 100).toFixed(2);

    document.getElementById("totalDays").innerText = total;

    document.getElementById("presentCount").innerText = present;

    document.getElementById("absentCount").innerText = absent;

    document.getElementById("attendancePercentage").innerText =
        percentage + "%";

}

// ======================================
// Search & Month Filter
// ======================================

function filterAttendance() {

    const search =
        document.getElementById("searchDate").value.toLowerCase();

    const month =
        document.getElementById("monthFilter").value;

    filteredAttendance = attendanceList.filter(attendance => {

        const matchSearch =
            attendance.attendanceDate.toLowerCase().includes(search);

        const matchMonth =
            month === "" ||
            attendance.attendanceDate.startsWith(month);

        return matchSearch && matchMonth;

    });

    updateCards();

    displayAttendance(filteredAttendance);

}

// ======================================
// Export CSV
// ======================================

function exportExcel() {

    let csv = "Date,Status\n";

    filteredAttendance.forEach(a => {

        csv += `${a.attendanceDate},${a.status}\n`;

    });

    const blob = new Blob([csv], {
        type: "text/csv"
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "Employee_Attendance_Report.csv";

    link.click();

}

// ======================================
// Export PDF
// ======================================

function exportPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text("University ERP", 20, 20);

    doc.setFontSize(14);

    doc.text("Employee Attendance Report", 20, 30);

    let y = 45;

    filteredAttendance.forEach(a => {

        doc.setFontSize(11);

        doc.text(

            `${a.attendanceDate}   -   ${a.status}`,

            20,

            y

        );

        y += 10;

        if (y > 280) {

            doc.addPage();

            y = 20;

        }

    });

    doc.save("Employee_Attendance_Report.pdf");

}