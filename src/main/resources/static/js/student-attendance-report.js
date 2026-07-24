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
// Load Student Attendance
// ======================================

function loadAttendance() {

    fetch("/attendance/student/" + userId)

        .then(response => response.json())

        .then(data => {

            attendanceList = data;
            filteredAttendance = [...attendanceList];

            loadStudentInfo();

            updateCards();

            displayAttendance(filteredAttendance);

        })

        .catch(error => {

            console.error(error);

            alert("Unable to load attendance.");

        });

}

// ======================================
// Load Student Information
// ======================================

function loadStudentInfo() {

    if (attendanceList.length === 0) {

        document.getElementById("studentName").innerText = "No Data";

        document.getElementById("enrollmentNo").innerText = "-";

        return;

    }

    document.getElementById("studentName").innerText =
        attendanceList[0].personName;

    document.getElementById("enrollmentNo").innerText =
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

    list.forEach((a, index) => {

        table.innerHTML += `

            <tr>

                <td>${index + 1}</td>

                <td>${a.attendanceDate}</td>

                <td>

                    <span class="${a.status === 'PRESENT' ? 'present' : 'absent'}">

                        ${a.status}

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

    let total = filteredAttendance.length;

    let present =
        filteredAttendance.filter(a => a.status === "PRESENT").length;

    let absent =
        filteredAttendance.filter(a => a.status === "ABSENT").length;

    let percentage =
        total === 0 ? 0 : ((present / total) * 100).toFixed(2);

    document.getElementById("totalClasses").innerText = total;

    document.getElementById("presentCount").innerText = present;

    document.getElementById("absentCount").innerText = absent;

    document.getElementById("attendancePercentage").innerText =
        percentage + "%";

}

// ======================================
// Filter
// ======================================

function filterAttendance() {

    const date =
        document.getElementById("searchDate").value.toLowerCase();

    const month =
        document.getElementById("monthFilter").value;

    filteredAttendance = attendanceList.filter(a => {

        const matchDate =
            a.attendanceDate.toLowerCase().includes(date);

        const matchMonth =
            month === "" ||
            a.attendanceDate.startsWith(month);

        return matchDate && matchMonth;

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

    const blob = new Blob([csv], { type: "text/csv" });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "Student_Attendance_Report.csv";

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

    doc.text("Student Attendance Report", 20, 30);

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

    doc.save("Student_Attendance_Report.pdf");

}