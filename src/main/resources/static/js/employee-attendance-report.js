// =====================================================
// UNIVERSITY ERP
// EMPLOYEE ATTENDANCE REPORT
// =====================================================

let attendanceList = [];

let filteredAttendance = [];

const userId = localStorage.getItem("userId");


// =====================================================
// PAGE LOAD
// =====================================================

window.onload = function () {

    if (!userId) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;
    }

    loadAttendance();

};


// =====================================================
// DASHBOARD
// =====================================================

function goDashboard() {

    window.location.href = "employee-dashboard.html";

}


// =====================================================
// LOAD EMPLOYEE ATTENDANCE
// =====================================================

function loadAttendance() {

    fetch("/attendance/employee/" + userId)

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to load attendance"
                );

            }

            return response.json();

        })

        .then(data => {

            attendanceList = Array.isArray(data)
                ? data
                : [];

            filteredAttendance =
                [...attendanceList];


            loadEmployeeInfo();

            updateCards();

            displayAttendance(
                filteredAttendance
            );

        })

        .catch(error => {

            console.error(error);

            document.getElementById(
                "employeeName"
            ).innerText = "Unable to Load";

            document.getElementById(
                "employeeCode"
            ).innerText = "-";

            document.getElementById(
                "attendanceTable"
            ).innerHTML = `

                <tr>

                    <td colspan="3">

                        Unable to load attendance records.

                    </td>

                </tr>

            `;

        });

}


// =====================================================
// LOAD EMPLOYEE INFORMATION
// =====================================================

function loadEmployeeInfo() {

    if (attendanceList.length === 0) {

        document.getElementById(
            "employeeName"
        ).innerText = "No Data";

        document.getElementById(
            "employeeCode"
        ).innerText = "-";

        return;

    }


    const firstRecord =
        attendanceList[0];


    document.getElementById(
        "employeeName"
    ).innerText =
        firstRecord.personName || "Employee";


    document.getElementById(
        "employeeCode"
    ).innerText =
        firstRecord.personId || "-";

}


// =====================================================
// DISPLAY ATTENDANCE
// =====================================================

function displayAttendance(list) {

    const table =
        document.getElementById(
            "attendanceTable"
        );


    table.innerHTML = "";


    if (list.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="3">

                    No attendance records found.

                </td>

            </tr>

        `;

        return;

    }


    list.forEach((attendance, index) => {

        const status =
            String(
                attendance.status || ""
            ).toUpperCase();


        let statusClass =
            status === "PRESENT"
                ? "present"
                : "absent";


        let statusText =
            status === "PRESENT"
                ? "PRESENT"
                : "ABSENT";


        table.innerHTML += `

            <tr>

                <td>
                    ${index + 1}
                </td>


                <td>
                    ${attendance.attendanceDate || "-"}
                </td>


                <td>

                    <span class="${statusClass}">

                        ${statusText}

                    </span>

                </td>

            </tr>

        `;

    });

}


// =====================================================
// UPDATE SUMMARY CARDS
// =====================================================

function updateCards() {

    const total =
        filteredAttendance.length;


    const present =
        filteredAttendance.filter(
            attendance =>
                String(
                    attendance.status || ""
                ).toUpperCase() === "PRESENT"
        ).length;


    const absent =
        filteredAttendance.filter(
            attendance =>
                String(
                    attendance.status || ""
                ).toUpperCase() === "ABSENT"
        ).length;


    const percentage =
        total === 0
            ? "0.00"
            : ((present / total) * 100)
                .toFixed(2);


    document.getElementById(
        "totalDays"
    ).innerText = total;


    document.getElementById(
        "presentCount"
    ).innerText = present;


    document.getElementById(
        "absentCount"
    ).innerText = absent;


    document.getElementById(
        "attendancePercentage"
    ).innerText =
        percentage + "%";

}


// =====================================================
// SEARCH & MONTH FILTER
// =====================================================

function filterAttendance() {

    const search =
        document.getElementById(
            "searchDate"
        ).value
            .trim()
            .toLowerCase();


    const month =
        document.getElementById(
            "monthFilter"
        ).value;


    filteredAttendance =
        attendanceList.filter(attendance => {

            const date =
                String(
                    attendance.attendanceDate || ""
                ).toLowerCase();


            const matchSearch =
                date.includes(search);


            const matchMonth =
                month === "" ||
                date.startsWith(month);


            return matchSearch &&
                matchMonth;

        });


    updateCards();

    displayAttendance(
        filteredAttendance
    );

}


// =====================================================
// EXPORT EXCEL / CSV
// =====================================================

function exportExcel() {

    if (filteredAttendance.length === 0) {

        alert(
            "No attendance records available to export."
        );

        return;

    }


    let csv =
        "S.No.,Date,Status\n";


    filteredAttendance.forEach(
        (attendance, index) => {

            csv +=
                `${index + 1},` +
                `"${attendance.attendanceDate || ""}",` +
                `"${attendance.status || ""}"\n`;

        }
    );


    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "Employee_Attendance_Report.csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}


// =====================================================
// EXPORT PDF
// =====================================================

function exportPDF() {

    if (filteredAttendance.length === 0) {

        alert(
            "No attendance records available to export."
        );

        return;

    }


    if (!window.jspdf) {

        alert(
            "PDF library is not loaded."
        );

        return;

    }


    const {
        jsPDF
    } = window.jspdf;


    const doc =
        new jsPDF();


    /* ============================
       HEADER
    ============================ */

    doc.setFontSize(18);

    doc.text(
        "University ERP",
        20,
        20
    );


    doc.setFontSize(14);

    doc.text(
        "Employee Attendance Report",
        20,
        30
    );


    /* ============================
       EMPLOYEE INFORMATION
    ============================ */

    const employeeName =
        document.getElementById(
            "employeeName"
        ).innerText;


    const employeeCode =
        document.getElementById(
            "employeeCode"
        ).innerText;


    doc.setFontSize(11);


    doc.text(
        `Employee Name: ${employeeName}`,
        20,
        40
    );


    doc.text(
        `Employee Code: ${employeeCode}`,
        20,
        48
    );


    /* ============================
       SUMMARY
    ============================ */

    const total =
        filteredAttendance.length;


    const present =
        filteredAttendance.filter(
            a =>
                String(
                    a.status || ""
                ).toUpperCase() ===
                "PRESENT"
        ).length;


    const absent =
        filteredAttendance.filter(
            a =>
                String(
                    a.status || ""
                ).toUpperCase() ===
                "ABSENT"
        ).length;


    const percentage =
        total === 0
            ? "0.00"
            : ((present / total) * 100)
                .toFixed(2);


    doc.text(
        `Total Working Days: ${total}`,
        20,
        58
    );


    doc.text(
        `Present: ${present}`,
        20,
        66
    );


    doc.text(
        `Absent: ${absent}`,
        20,
        74
    );


    doc.text(
        `Attendance: ${percentage}%`,
        20,
        82
    );


    /* ============================
       TABLE HEADER
    ============================ */

    let y = 95;


    doc.setFontSize(11);

    doc.text(
        "S.No.",
        20,
        y
    );


    doc.text(
        "Date",
        55,
        y
    );


    doc.text(
        "Status",
        120,
        y
    );


    y += 8;


    /* ============================
       TABLE DATA
    ============================ */

    filteredAttendance.forEach(
        (attendance, index) => {

            if (y > 280) {

                doc.addPage();

                y = 20;

            }


            doc.text(
                String(index + 1),
                20,
                y
            );


            doc.text(
                String(
                    attendance.attendanceDate || "-"
                ),
                55,
                y
            );


            doc.text(
                String(
                    attendance.status || "-"
                ),
                120,
                y
            );


            y += 8;

        }
    );


    /* ============================
       SAVE
    ============================ */

    doc.save(
        "Employee_Attendance_Report.pdf"
    );

}