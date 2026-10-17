// ============================================================
// UNIVERSITY ERP
// STUDENT SEMESTER RESULT
// ============================================================


// ============================================================
// PAGE LOAD
// ============================================================

window.addEventListener("DOMContentLoaded", function () {

    loadResults();

});


// ============================================================
// GRADE
// ============================================================

function getGrade(marks, maxMarks) {

    const percentage =
        (Number(marks) / Number(maxMarks)) * 100;


    if (percentage >= 90) return "A+";

    if (percentage >= 80) return "A";

    if (percentage >= 70) return "B+";

    if (percentage >= 60) return "B";

    if (percentage >= 50) return "C";

    if (percentage >= 40) return "D";

    return "F";

}


// ============================================================
// GRADE POINT
// ============================================================

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


// ============================================================
// LOAD RESULT
// ============================================================

async function loadResults() {

    const enrollmentNo =
        localStorage.getItem("username");


    if (!enrollmentNo) {

        alert("Please Login Again");

        window.location.href =
            "login.html";

        return;

    }


    try {

        // ====================================================
        // LOAD RESULTS
        // ====================================================

        const resultsResponse =
            await fetch("/results");


        if (!resultsResponse.ok) {

            throw new Error(
                "Unable to load results"
            );

        }


        const results =
            await resultsResponse.json();


        // ====================================================
        // FILTER CURRENT STUDENT
        // ====================================================

        const studentResults =
            results.filter(result =>

                result.enrollmentNo &&

                result.enrollmentNo
                    .trim()
                    .toUpperCase() ===
                enrollmentNo
                    .trim()
                    .toUpperCase()

            );


        if (studentResults.length === 0) {

            showNoResults();

            return;

        }


        // ====================================================
        // LOAD STUDENT
        // ====================================================

        const studentsResponse =
            await fetch("/students");


        if (!studentsResponse.ok) {

            throw new Error(
                "Unable to load students"
            );

        }


        const students =
            await studentsResponse.json();


        const student =
            students.find(s =>

                s.enrollmentNo &&

                s.enrollmentNo
                    .trim()
                    .toUpperCase() ===
                enrollmentNo
                    .trim()
                    .toUpperCase()

            );


        if (!student) {

            throw new Error(
                "Student record not found"
            );

        }


        // ====================================================
        // CURRENT SEMESTER
        // ====================================================

        const semester =
            studentResults[0].semester ||
            student.semester ||
            "";


        // ====================================================
        // LOAD COURSE ENROLLMENT
        // ====================================================

        const enrollmentResponse =
            await fetch(
                `/api/course-enrollments/student/${student.id}`
            );


        if (!enrollmentResponse.ok) {

            throw new Error(
                "Unable to load course enrollment"
            );

        }


        const enrollments =
            await enrollmentResponse.json();


        // ====================================================
        // FIND CURRENT ENROLLMENT
        // ====================================================

        const currentEnrollment =
            enrollments.find(e =>

                String(e.semester)
                    .toUpperCase() ===
                String(semester)
                    .toUpperCase()

                &&

                e.status &&
                e.status.toLowerCase() ===
                "active"

            ) ||

            enrollments.find(e =>

                String(e.semester)
                    .toUpperCase() ===
                String(semester)
                    .toUpperCase()

            ) ||

            enrollments[0];


        if (!currentEnrollment) {

            throw new Error(
                "Course enrollment not found"
            );

        }


        console.log(
            "Current Enrollment:",
            currentEnrollment
        );


        // ====================================================
        // LOAD COURSE SUBJECT MAPPINGS
        // ====================================================

        const mappingResponse =
            await fetch(
                "/api/course-subject-mappings"
            );


        if (!mappingResponse.ok) {

            throw new Error(
                "Unable to load course subject mappings"
            );

        }


        const mappings =
            await mappingResponse.json();


        console.log(
            "All Course Subject Mappings:",
            mappings
        );


        // ====================================================
        // FILTER MAPPINGS
        // ====================================================

        const studentMappings =
            mappings.filter(mapping => {

                const sameCourse =
                    Number(mapping.courseId) ===
                    Number(currentEnrollment.courseId);


                const sameSemester =
                    String(mapping.semester)
                        .toUpperCase() ===
                    String(
                        currentEnrollment.semester
                    )
                        .toUpperCase();


                const sameAcademicYear =
                    String(mapping.academicYear) ===
                    String(
                        currentEnrollment.academicYear
                    );


                return (
                    sameCourse &&
                    sameSemester &&
                    sameAcademicYear
                );

            });


        console.log(
            "Student Subject Mappings:",
            studentMappings
        );


        // ====================================================
        // CREATE SUBJECT MAP
        // ====================================================

        const subjectMap = {};


        studentMappings.forEach(mapping => {

            if (mapping.subjectCode) {

                subjectMap[
                    mapping.subjectCode
                        .trim()
                        .toUpperCase()
                    ] = mapping;

            }

        });


        // ====================================================
        // RENDER RESULT
        // ====================================================

        renderResult(
            studentResults,
            subjectMap,
            student,
            currentEnrollment
        );


    } catch (error) {

        console.error(
            "Error Loading Result:",
            error
        );


        alert(
            "Unable to load result."
        );

    }

}


// ============================================================
// RENDER RESULT
// ============================================================

function renderResult(
    results,
    subjectMap,
    student,
    enrollment
) {

    let rows = "";


    let totalSubjects = 0;

    let totalMarks = 0;

    let maximumMarks = 0;

    let totalGradePoints = 0;

    let isFail = false;

    let srNo = 1;


    // ========================================================
    // RESULT ROWS
    // ========================================================

    results.forEach(result => {

        const subjectCode =
            String(
                result.subject || ""
            )
                .trim()
                .toUpperCase();


        // ====================================================
        // FIND SUBJECT FROM MAPPING
        // ====================================================

        const mapping =
            subjectMap[subjectCode];


        // ====================================================
        // SUBJECT NAME
        // ====================================================

        let subjectName =
            result.subject || "-";


        if (
            mapping &&
            mapping.subjectName
        ) {

            subjectName =
                mapping.subjectName;

        }


        // ====================================================
        // SUBJECT TYPE
        // ====================================================

        const subjectType =
            mapping
                ? (
                    mapping.type ||
                    mapping.subjectType ||
                    ""
                )
                : "";


        // ====================================================
        // MAXIMUM MARKS
        // ====================================================

        let maxMarks = 100;

        let passMarks = 40;


        const type =
            subjectType
                .toString()
                .toLowerCase();


        if (
            type.includes("practical") ||
            type.includes("lab")
        ) {

            maxMarks = 50;

            passMarks = 20;

        }


        // ====================================================
        // MARKS
        // ====================================================

        const obtainedMarks =
            Number(result.marks || 0);


        totalSubjects++;

        totalMarks += obtainedMarks;

        maximumMarks += maxMarks;


        // ====================================================
        // GRADE
        // ====================================================

        const grade =
            getGrade(
                obtainedMarks,
                maxMarks
            );


        totalGradePoints +=
            getGradePoint(grade);


        // ====================================================
        // PASS / FAIL
        // ====================================================

        const status =
            obtainedMarks >= passMarks
                ? "PASS"
                : "FAIL";


        if (status === "FAIL") {

            isFail = true;

        }


        // ====================================================
        // TABLE ROW
        // ====================================================

        rows += `

            <tr>

                <td>
                    ${srNo++}
                </td>


                <td>

                    <strong>
                        ${escapeHtml(subjectName)}
                    </strong>

                    <br>

                    <small style="
                        color:#64748b;
                        font-size:11px;
                    ">

                        ${escapeHtml(subjectCode)}

                        ${
            subjectType
                ? " • " +
                escapeHtml(subjectType)
                : ""
        }

                    </small>

                </td>


                <td>
                    ${obtainedMarks}
                </td>


                <td>
                    ${maxMarks}
                </td>


                <td class="${
            status === "PASS"
                ? "status-pass"
                : "status-fail"
        }">

                    ${status}

                </td>

            </tr>

        `;

    });


    // ========================================================
    // UPDATE TABLE
    // ========================================================

    document.getElementById(
        "resultTable"
    ).innerHTML = rows;


    // ========================================================
    // TOTAL MARKS
    // ========================================================

    document.getElementById(
        "totalMarks"
    ).textContent =
        totalMarks;


    // ========================================================
    // MAXIMUM MARKS
    // ========================================================

    document.getElementById(
        "maxMarks"
    ).textContent =
        maximumMarks;


    // ========================================================
    // PERCENTAGE
    // ========================================================

    let percentage = 0;


    if (maximumMarks > 0) {

        percentage =
            (
                totalMarks /
                maximumMarks
            ) * 100;

    }


    document.getElementById(
        "percentage"
    ).textContent =
        percentage.toFixed(2) + "%";


    // ========================================================
    // SGPA
    // ========================================================

    let sgpa = 0;


    if (totalSubjects > 0) {

        sgpa =
            totalGradePoints /
            totalSubjects;

    }


    document.getElementById(
        "sgpa"
    ).textContent =
        sgpa.toFixed(2);


    // ========================================================
    // FINAL RESULT
    // ========================================================

    const resultText =
        isFail
            ? "FAIL"
            : "PASS";


    document.getElementById(
        "result"
    ).textContent =
        resultText;


    const resultCard =
        document.getElementById(
            "resultCard"
        );


    if (isFail) {

        resultCard.classList.remove(
            "pass"
        );

        resultCard.classList.add(
            "fail"
        );

    } else {

        resultCard.classList.remove(
            "fail"
        );

        resultCard.classList.add(
            "pass"
        );

    }


    // ========================================================
    // STUDENT INFORMATION
    // ========================================================

    document.getElementById(
        "studentName"
    ).textContent =
        student.name || "-";


    document.getElementById(
        "enrollmentNo"
    ).textContent =
        student.enrollmentNo || "-";


    document.getElementById(
        "semester"
    ).textContent =
        enrollment.semester ||
        student.semester ||
        "-";


    // IMPORTANT:
    // Use the enrolled course from Course Enrollment

    document.getElementById(
        "course"
    ).textContent =
        enrollment.courseName ||
        student.course ||
        "-";

}


// ============================================================
// NO RESULTS
// ============================================================

function showNoResults() {

    document.getElementById(
        "resultTable"
    ).innerHTML = `

        <tr>

            <td colspan="5"
                style="
                    text-align:center;
                    padding:40px;
                    color:#64748b;
                ">

                <i class="fa-solid fa-file-circle-xmark"
                   style="
                       font-size:30px;
                       margin-bottom:10px;
                   ">
                </i>

                <br>

                No marks found for this student.

            </td>

        </tr>

    `;


    document.getElementById(
        "totalMarks"
    ).textContent = "0";


    document.getElementById(
        "maxMarks"
    ).textContent = "0";


    document.getElementById(
        "percentage"
    ).textContent = "0%";


    document.getElementById(
        "sgpa"
    ).textContent = "0.00";


    document.getElementById(
        "result"
    ).textContent = "N/A";

}


// ============================================================
// PRINT
// ============================================================

function printMarksheet() {

    window.print();

}


// ============================================================
// DOWNLOAD PDF
// ============================================================

function downloadPDF() {

    const element =
        document.getElementById(
            "marksheet"
        );


    const options = {

        margin: 0.4,

        filename:
            "Marksheet_" +
            document.getElementById(
                "enrollmentNo"
            ).innerText +
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


// ============================================================
// BACK TO DASHBOARD
// ============================================================

function goDashboard() {

    window.location.href =
        "student-dashboard.html";

}


// ============================================================
// LOGOUT
// ============================================================

function logout() {

    localStorage.clear();

    window.location.href =
        "login.html";

}


// ============================================================
// UTILITY
// ============================================================

function formatPercentage(value) {

    return Number(value)
        .toFixed(2) + "%";

}


function calculatePercentage(
    totalMarks,
    maximumMarks
) {

    if (
        Number(maximumMarks) === 0
    ) {

        return 0;

    }


    return (
        Number(totalMarks) /
        Number(maximumMarks)
    ) * 100;

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// END
// ============================================================