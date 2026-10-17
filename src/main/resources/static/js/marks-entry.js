// ============================================================
// UNIVERSITY ERP
// MARKS ENTRY
// Subjects automatically loaded from Course Subject Mapping
// ============================================================

let students = [];

let currentStudent = null;

let currentEnrollment = null;

let currentMappings = [];


// ============================================================
// PAGE LOAD
// ============================================================

window.addEventListener("DOMContentLoaded", function () {

    loadStudents();

    document
        .getElementById("studentSelect")
        .addEventListener(
            "change",
            loadStudentSubjects
        );

});


// ============================================================
// LOAD STUDENTS
// ============================================================

async function loadStudents() {

    try {

        const response =
            await fetch("/students");


        if (!response.ok) {

            throw new Error(
                "Unable to load students"
            );

        }


        students =
            await response.json();


        const select =
            document.getElementById(
                "studentSelect"
            );


        select.innerHTML = `
            <option value="">
                Select Student
            </option>
        `;


        students.forEach(student => {

            if (!student.enrollmentNo) {
                return;
            }


            select.innerHTML += `

                <option value="${student.enrollmentNo}">

                    ${escapeHtml(student.name || "-")}

                    (${escapeHtml(
                student.enrollmentNo
            )})

                </option>

            `;

        });


    } catch (error) {

        console.error(
            "Student Loading Error:",
            error
        );


        alert(
            "Unable to load students."
        );

    }

}


// ============================================================
// LOAD STUDENT SUBJECTS
// ============================================================

async function loadStudentSubjects() {

    const enrollmentNo =
        document.getElementById(
            "studentSelect"
        ).value;


    const subjectSelect =
        document.getElementById(
            "subject"
        );


    const semesterSelect =
        document.getElementById(
            "semester"
        );


    const marksInput =
        document.getElementById(
            "marks"
        );


    // ========================================================
    // CLEAR OLD DATA
    // ========================================================

    subjectSelect.innerHTML = `
        <option value="">
            Loading subjects...
        </option>
    `;


    subjectSelect.disabled = true;

    semesterSelect.innerHTML = `
        <option value="">
            Loading...
        </option>
    `;

    semesterSelect.disabled = true;

    marksInput.value = "";

    marksInput.disabled = true;


    currentStudent = null;

    currentEnrollment = null;

    currentMappings = [];


    // ========================================================
    // NO STUDENT SELECTED
    // ========================================================

    if (!enrollmentNo) {

        subjectSelect.innerHTML = `
            <option value="">
                Select Student First
            </option>
        `;


        semesterSelect.innerHTML = `
            <option value="">
                Select Student First
            </option>
        `;


        return;

    }


    try {

        // ====================================================
        // FIND STUDENT
        // ====================================================

        currentStudent =
            students.find(student =>

                student.enrollmentNo &&

                student.enrollmentNo
                    .trim()
                    .toUpperCase() ===
                enrollmentNo
                    .trim()
                    .toUpperCase()

            );


        if (!currentStudent) {

            throw new Error(
                "Student not found"
            );

        }


        console.log(
            "Selected Student:",
            currentStudent
        );


        // ====================================================
        // GET COURSE ENROLLMENTS
        // ====================================================

        const enrollmentResponse =
            await fetch(
                `/api/course-enrollments/student/${currentStudent.id}`
            );


        if (!enrollmentResponse.ok) {

            throw new Error(
                "Unable to load course enrollment"
            );

        }


        const enrollments =
            await enrollmentResponse.json();


        console.log(
            "Student Enrollments:",
            enrollments
        );


        if (
            !enrollments ||
            enrollments.length === 0
        ) {

            throw new Error(
                "This student has no course enrollment."
            );

        }


        // ====================================================
        // FIND ACTIVE ENROLLMENT
        // ====================================================

        currentEnrollment =
            enrollments.find(enrollment =>

                enrollment.status &&

                enrollment.status
                    .toLowerCase() ===
                "active"

            ) || enrollments[0];


        if (!currentEnrollment) {

            throw new Error(
                "Course enrollment not found."
            );

        }


        console.log(
            "Current Enrollment:",
            currentEnrollment
        );


        // ====================================================
        // SET SEMESTER
        // ====================================================

        semesterSelect.innerHTML = `

            <option value="${escapeHtml(
            currentEnrollment.semester
        )}">

                ${escapeHtml(
            currentEnrollment.semester
        )}

            </option>

        `;


        semesterSelect.disabled = false;


        // ====================================================
        // LOAD ALL COURSE SUBJECT MAPPINGS
        // ====================================================

        const mappingResponse =
            await fetch(
                "/api/course-subject-mappings"
            );


        if (!mappingResponse.ok) {

            throw new Error(
                "Unable to load subject mappings"
            );

        }


        const mappings =
            await mappingResponse.json();


        console.log(
            "All Subject Mappings:",
            mappings
        );


        // ====================================================
        // FILTER MAPPINGS
        // ====================================================

        currentMappings =
            mappings.filter(mapping => {

                const sameCourse =
                    Number(mapping.courseId) ===
                    Number(
                        currentEnrollment.courseId
                    );


                const sameSemester =
                    String(mapping.semester)
                        .trim()
                        .toUpperCase() ===

                    String(
                        currentEnrollment.semester
                    )
                        .trim()
                        .toUpperCase();


                const sameAcademicYear =
                    String(
                        mapping.academicYear
                    )
                        .trim() ===

                    String(
                        currentEnrollment.academicYear
                    )
                        .trim();


                const active =
                    !mapping.status ||

                    mapping.status
                        .toLowerCase() ===
                    "active";


                return (
                    sameCourse &&
                    sameSemester &&
                    sameAcademicYear &&
                    active
                );

            });


        console.log(
            "Student Current Subjects:",
            currentMappings
        );


        // ====================================================
        // NO SUBJECTS
        // ====================================================

        if (
            currentMappings.length === 0
        ) {

            subjectSelect.innerHTML = `

                <option value="">

                    No subjects mapped
                    for this course

                </option>

            `;


            subjectSelect.disabled = true;

            return;

        }


        // ====================================================
        // POPULATE SUBJECT DROPDOWN
        // ====================================================

        subjectSelect.innerHTML = `

            <option value="">
                Select Subject
            </option>

        `;


        currentMappings.forEach(mapping => {

            subjectSelect.innerHTML += `

                <option

                    value="${escapeHtml(
                mapping.subjectCode
            )}"

                    data-subject-name="${escapeHtml(
                mapping.subjectName
            )}"

                    data-subject-type="${escapeHtml(
                mapping.subjectType || ""
            )}"

                    data-credits="${mapping.credits || 0}"

                >

                    ${escapeHtml(
                mapping.subjectName
            )}

                    ${
                mapping.subjectType
                    ? " (" +
                    escapeHtml(
                        mapping.subjectType
                    ) +
                    ")"
                    : ""
            }

                </option>

            `;

        });


        subjectSelect.disabled = false;


        // ====================================================
        // ENABLE MARKS
        // ====================================================

        marksInput.disabled = false;


        console.log(
            "Subjects loaded successfully."
        );


    } catch (error) {

        console.error(
            "Subject Loading Error:",
            error
        );


        subjectSelect.innerHTML = `

            <option value="">

                Unable to load subjects

            </option>

        `;


        semesterSelect.innerHTML = `

            <option value="">

                Unable to load semester

            </option>

        `;


        alert(
            error.message ||
            "Unable to load subjects."
        );

    }

}


// ============================================================
// SAVE MARKS
// ============================================================

async function saveMarks() {

    const enrollmentNo =
        document.getElementById(
            "studentSelect"
        ).value;


    const subjectSelect =
        document.getElementById(
            "subject"
        );


    const subject =
        subjectSelect.value;


    const marks =
        document.getElementById(
            "marks"
        ).value;


    const semester =
        document.getElementById(
            "semester"
        ).value;


    // ========================================================
    // VALIDATION
    // ========================================================

    if (!enrollmentNo) {

        alert(
            "Please select a student."
        );

        return;

    }


    if (!subject) {

        alert(
            "Please select a subject."
        );

        return;

    }


    if (
        marks === "" ||
        marks === null
    ) {

        alert(
            "Please enter marks."
        );

        return;

    }


    if (!semester) {

        alert(
            "Semester is required."
        );

        return;

    }


    const selectedOption =
        subjectSelect.options[
            subjectSelect.selectedIndex
            ];


    const subjectName =
        selectedOption
            .dataset
            .subjectName || subject;


    const subjectType =
        selectedOption
            .dataset
            .subjectType || "";


    // ========================================================
    // MAXIMUM MARKS
    // ========================================================

    let maxMarks = 100;

    let passMarks = 40;


    const type =
        subjectType
            .toLowerCase();


    if (
        type.includes("practical") ||
        type.includes("lab")
    ) {

        maxMarks = 50;

        passMarks = 20;

    }


    // ========================================================
    // MARKS VALIDATION
    // ========================================================

    const numericMarks =
        Number(marks);


    if (
        Number.isNaN(numericMarks)
    ) {

        alert(
            "Please enter valid marks."
        );

        return;

    }


    if (
        numericMarks < 0
    ) {

        alert(
            "Marks cannot be negative."
        );

        return;

    }


    if (
        numericMarks > maxMarks
    ) {

        alert(

            `Maximum marks allowed for "${subjectName}" is ${maxMarks}.`

        );

        return;

    }


    // ========================================================
    // SAVE
    // ========================================================

    try {

        const response =
            await fetch(
                "/results",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        enrollmentNo:
                        enrollmentNo,

                        // IMPORTANT:
                        // Save SUBJECT CODE
                        // because results are
                        // identified by subject code.

                        subject:
                        subject,

                        marks:
                        numericMarks,

                        semester:
                        semester

                    })

                }
            );


        const message =
            await response.text();


        if (!response.ok) {

            alert(message);

            return;

        }


        alert(
            `${subjectName} marks saved successfully.`
        );


        // ====================================================
        // CLEAR MARKS ONLY
        // ====================================================

        document.getElementById(
            "marks"
        ).value = "";


    } catch (error) {

        console.error(
            "Save Marks Error:",
            error
        );


        alert(
            "Error saving marks."
        );

    }

}


// ============================================================
// CLEAR FIELDS
// ============================================================

function clearFields() {

    document.getElementById(
        "studentSelect"
    ).value = "";


    document.getElementById(
        "subject"
    ).innerHTML = `

        <option value="">
            Select Student First
        </option>

    `;


    document.getElementById(
        "subject"
    ).disabled = true;


    document.getElementById(
        "marks"
    ).value = "";


    document.getElementById(
        "marks"
    ).disabled = true;


    document.getElementById(
        "semester"
    ).innerHTML = `

        <option value="">
            Select Student First
        </option>

    `;


    document.getElementById(
        "semester"
    ).disabled = true;


    currentStudent = null;

    currentEnrollment = null;

    currentMappings = [];

}


// ============================================================
// BACK TO DASHBOARD
// ============================================================

function goDashboard() {

    const role =
        localStorage.getItem(
            "role"
        );


    if (role === "ADMIN") {

        window.location.href =
            "dashboard.html";

    }

    else if (
        role === "EMPLOYEE"
    ) {

        window.location.href =
            "employee-dashboard.html";

    }

    else {

        window.location.href =
            "student-dashboard.html";

    }

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