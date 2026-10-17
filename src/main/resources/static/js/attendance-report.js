let attendanceList = [];
let filteredAttendance = [];

window.onload = function () {
    loadAttendance();
};

// =====================================================
// DASHBOARD
// =====================================================

function goDashboard() {

    window.location.href = "dashboard.html";

}

// ================================
// Load Attendance
// ================================

function loadAttendance() {

    fetch("/attendance")
        .then(response => response.json())
        .then(data => {

            attendanceList = data;
            filteredAttendance = [...attendanceList];

            updateCards();
            displayAttendance(filteredAttendance);


        })
        .catch(error => {

            console.error(error);
            alert("Unable to load attendance records.");

        });

}

// ================================
// Display Table
// ================================

function displayAttendance(list) {

    const table = document.getElementById("attendanceReportTable");
    const recordCount = document.getElementById("recordCount");

    table.innerHTML = "";

    // Update record counter
    if (recordCount) {
        recordCount.innerText =
            list.length + (list.length === 1 ? " Record" : " Records");
    }

    // Empty state
    if (list.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <div class="empty-icon">
                        <i class="fa-solid fa-calendar-xmark"></i>
                    </div>

                    <strong>No Attendance Records Found</strong>

                    <span>
                        No attendance records match your current filters.
                    </span>
                </td>
            </tr>
        `;

        return;
    }

    // Display records
    list.forEach(a => {

        const statusClass =
            a.status === "PRESENT"
                ? "present"
                : "absent";

        const typeClass =
            a.personType === "STUDENT"
                ? "student-type"
                : "employee-type";

        table.innerHTML += `
            <tr>

                <td>${a.id}</td>

                <td>
                    <span class="type-badge ${typeClass}">
                        <i class="fa-solid ${
            a.personType === "STUDENT"
                ? "fa-user-graduate"
                : "fa-user-tie"
        }"></i>

                        ${a.personType}
                    </span>
                </td>

                <td>
                    <strong class="person-id">
                        ${a.personId}
                    </strong>
                </td>

                <td class="person-name">
                    ${a.personName}
                </td>

                <td>
                    ${a.attendanceDate}
                </td>

                <td>
                    <span class="${statusClass}">
                        <i class="fa-solid ${
            a.status === "PRESENT"
                ? "fa-check"
                : "fa-xmark"
        }"></i>

                        ${a.status}
                    </span>
                </td>

            </tr>
        `;

    });

}
const recordCount = document.getElementById("recordCount");

if (recordCount) {
    recordCount.innerText =
        list.length + (list.length === 1 ? " Record" : " Records");
}

// ================================
// Summary Cards
// ================================

function updateCards() {

    document.getElementById("totalAttendance").innerText =
        filteredAttendance.length;

    document.getElementById("presentCount").innerText =
        filteredAttendance.filter(a => a.status === "PRESENT").length;

    document.getElementById("absentCount").innerText =
        filteredAttendance.filter(a => a.status === "ABSENT").length;

    document.getElementById("studentCount").innerText =
        filteredAttendance.filter(a => a.personType === "STUDENT").length;

    document.getElementById("employeeCount").innerText =
        filteredAttendance.filter(a => a.personType === "EMPLOYEE").length;

}

// ================================
// Search & Filter
// ================================

function filterAttendance() {

    const search =
        document.getElementById("search").value.toLowerCase();

    const type =
        document.getElementById("typeFilter").value;

    const date =
        document.getElementById("dateFilter").value;

    filteredAttendance = attendanceList.filter(a => {

        const matchSearch =
            a.personName.toLowerCase().includes(search) ||
            a.personId.toLowerCase().includes(search);

        const matchType =
            type === "ALL" || a.personType === type;

        const matchDate =
            date === "" || a.attendanceDate === date;

        return matchSearch && matchType && matchDate;

    });

    updateCards();
    displayAttendance(filteredAttendance);

}

function searchAttendance() {
    filterAttendance();
}

// ================================
// Export CSV (Excel)
// ================================

function exportExcel() {

    let csv =
        "ID,Type,Person ID,Name,Date,Status\n";

    filteredAttendance.forEach(a => {

        csv +=
            `${a.id},${a.personType},${a.personId},${a.personName},${a.attendanceDate},${a.status}\n`;

    });

    const blob =
        new Blob([csv], { type: "text/csv" });

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "Attendance_Report.csv";

    link.click();

}

// ================================
// Export PDF
// ================================

function exportPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("University ERP", 20, 20);

    doc.setFontSize(14);
    doc.text("Attendance Report", 20, 30);

    let y = 45;

    filteredAttendance.forEach(a => {

        doc.setFontSize(10);

        doc.text(
            `${a.id} | ${a.personType} | ${a.personId} | ${a.personName} | ${a.attendanceDate} | ${a.status}`,
            10,
            y
        );

        y += 8;

        if (y > 280) {
            doc.addPage();
            y = 20;
        }

    });

    doc.save("Attendance_Report.pdf");

}