// ============================================
// University ERP
// Student Result
// Part 1
// ============================================

window.onload = function () {

    loadResults();

};

// ============================================
// Grade
// ============================================

function getGrade(marks, maxMarks) {

    let percentage = (Number(marks) / Number(maxMarks)) * 100;

    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";

    return "F";

}

// ============================================
// Grade Point (For SGPA)
// ============================================

function getGradePoint(grade) {

    switch (grade) {

        case "A+":
            return 10;

        case "A":
            return 9;

        case "B+":
            return 8;

        case "B":
            return 7;

        case "C":
            return 6;

        case "D":
            return 5;

        default:
            return 0;

    }

}

// ============================================
// Load Result
// ============================================

function loadResults() {

    let enrollmentNo = localStorage.getItem("username");

    if (!enrollmentNo) {

        alert("Please Login Again");

        window.location.href = "login.html";

        return;

    }

    fetch("/results")

        .then(response => response.json())

        .then(results => {

            let rows = "";

            let totalSubjects = 0;

            let totalMarks = 0;

            let maximumMarks = 0;

            let totalGradePoints = 0;

            let semester = "";

            let isFail = false;

            let srNo = 1;

            results.forEach(result => {

                if (
                    result.enrollmentNo &&
                    result.enrollmentNo.trim() === enrollmentNo.trim()
                ) {

                    totalSubjects++;

                    semester = result.semester;

                    let maxMarks = 100;

                    let passMarks = 40;

                    if (
                        result.subject.toUpperCase().includes("LAB") ||
                        result.subject === "Practical Training 45 Days"
                    ) {

                        maxMarks = 50;

                        passMarks = 20;

                    }

                    totalMarks += Number(result.marks);

                    maximumMarks += maxMarks;

                    let grade = getGrade(result.marks, maxMarks);

                    totalGradePoints += getGradePoint(grade);

                    let status =
                        Number(result.marks) >= passMarks
                            ? "PASS"
                            : "FAIL";

                    if (status === "FAIL") {

                        isFail = true;

                    }

                    rows += `
<tr>

<td>${srNo++}</td>
<td>${result.subject}</td>
<td>${result.marks}</td>
<td>${maxMarks}</td>

<td class="${status==="PASS" ? "status-pass":"status-fail"}">
${status}
</td>

</tr>
`;

                }

            });

            document.getElementById("resultTable").innerHTML = rows;

            document.getElementById("totalMarks").innerHTML = totalMarks;

            document.getElementById("maxMarks").innerHTML = maximumMarks;

            let percentage = 0;

            if (maximumMarks > 0) {

                percentage =
                    (totalMarks / maximumMarks) * 100;

            }

            document.getElementById("percentage").innerHTML =
                percentage.toFixed(2) + "%";

            let sgpa = 0;

            if (totalSubjects > 0) {

                sgpa = totalGradePoints / totalSubjects;

            }

            document.getElementById("sgpa").innerHTML =
                sgpa.toFixed(2);

            let resultText = isFail ? "FAIL" : "PASS";

            document.getElementById("result").innerHTML = resultText;

            let resultCard = document.getElementById("resultCard");

            if (isFail) {

                resultCard.classList.remove("pass");

                resultCard.classList.add("fail");

            } else {

                resultCard.classList.remove("fail");

                resultCard.classList.add("pass");

            }

            // Load Student Information
            loadStudentInfo(enrollmentNo, semester);

        })

        .catch(error => {

            console.error("Error Loading Results :", error);

            alert("Unable to load result.");

        });

}

// ============================================
// Load Student Details
// ============================================

function loadStudentInfo(enrollmentNo, semester) {

    fetch("/students")

        .then(response => response.json())

        .then(students => {

            let student = students.find(s =>
                s.enrollmentNo &&
                s.enrollmentNo.trim() === enrollmentNo.trim()
            );

            if (!student) {

                console.log("Student Not Found");

                return;

            }

            document.getElementById("studentName").innerHTML =
                student.name || "-";

            document.getElementById("enrollmentNo").innerHTML =
                student.enrollmentNo || "-";

            document.getElementById("semester").innerHTML =
                semester || student.semester || "-";

            document.getElementById("course").innerHTML =
                student.course || "-";

        })

        .catch(error => {

            console.error("Student Loading Error :", error);

        });

}

// ============================================
// Print Marksheet
// ============================================

function printMarksheet() {

    window.print();

}

// ============================================
// Download PDF
// ============================================

function downloadPDF() {

    const element = document.getElementById("marksheet");

    const options = {

        margin: 0.4,

        filename:
            "Marksheet_" +
            document.getElementById("enrollmentNo").innerText +
            ".pdf",

        image: {

            type: "jpeg",

            quality: 1

        },

        html2canvas: {

            scale: 2,

            useCORS: true

        },

        jsPDF: {

            unit: "in",

            format: "a4",

            orientation: "portrait"

        }

    };

    html2pdf()

        .set(options)

        .from(element)

        .save();

}

// ============================================
// Back To Dashboard
// ============================================

function goDashboard() {

    window.location.href = "dashboard.html";

}

// ============================================
// Logout (Optional)
// ============================================

function logout() {

    localStorage.clear();

    window.location.href = "login.html";

}

// ============================================
// Utility
// ============================================

function formatPercentage(value) {

    return Number(value).toFixed(2) + "%";

}

function calculatePercentage(totalMarks, maximumMarks) {

    if (maximumMarks === 0) {

        return 0;

    }

    return (totalMarks / maximumMarks) * 100;

}

// ============================================
// End of File
// ============================================