const API_COURSES = "/api/courses";
const API_ENROLLMENTS = "/api/course-enrollments";
const API_STUDENTS = "/students";

let students = [];
let courses = [];
let enrollments = [];


/* ================= PAGE LOAD ================= */

document.addEventListener("DOMContentLoaded", function () {

    loadStudents();
    loadCourses();
    loadEnrollments();

});


/* ================= LOAD STUDENTS ================= */

async function loadStudents() {

    try {

        const response = await fetch(API_STUDENTS);

        if (!response.ok) {
            throw new Error("Unable to load students");
        }

        students = await response.json();

        populateStudentDropdown();

    } catch (error) {

        console.error(error);

        alert("Unable to load students. Please check Student API.");

    }

}


/* ================= STUDENT DROPDOWN ================= */

function populateStudentDropdown() {

    const select =
        document.getElementById("studentId");

    select.innerHTML =
        '<option value="">Select Student</option>';

    students.forEach(student => {

        const option =
            document.createElement("option");

        option.value = student.id;

        option.textContent =
            `${student.name} - ${student.enrollmentNo}`;

        select.appendChild(option);

    });

}


/* ================= STUDENT DETAILS ================= */

function loadStudentDetails() {

    const id =
        document.getElementById("studentId").value;

    const student =
        students.find(s => String(s.id) === String(id));

    if (!student) {

        document.getElementById("studentEnrollment").value = "";
        document.getElementById("studentProgramme").value = "";
        document.getElementById("studentSemester").value = "";

        return;
    }

    document.getElementById("studentEnrollment").value =
        student.enrollmentNo || "";

    document.getElementById("studentProgramme").value =
        student.course || "";

    document.getElementById("studentSemester").value =
        student.semester || "";

    document.getElementById("semester").value =
        student.semester || "";

}


/* ================= LOAD COURSES ================= */

async function loadCourses() {

    try {

        const response =
            await fetch(API_COURSES);

        if (!response.ok) {
            throw new Error("Unable to load courses");
        }

        courses =
            await response.json();

        populateCourseDropdown();

        updateStatistics();

    } catch (error) {

        console.error(error);

        alert("Unable to load courses.");

    }

}


/* ================= COURSE DROPDOWN ================= */

function populateCourseDropdown() {

    const select =
        document.getElementById("courseId");

    select.innerHTML =
        '<option value="">Select Course</option>';

    courses.forEach(course => {

        const option =
            document.createElement("option");

        option.value =
            course.id;

        option.textContent =
            `${course.courseCode} - ${course.courseName}`;

        select.appendChild(option);

    });

}


/* ================= COURSE DETAILS ================= */

function loadCourseDetails() {

    const id =
        document.getElementById("courseId").value;

    const course =
        courses.find(c => String(c.id) === String(id));

    if (!course) {

        document.getElementById("courseCode").value = "";
        document.getElementById("courseType").value = "";
        document.getElementById("courseCredits").value = "";

        return;
    }

    document.getElementById("courseCode").value =
        course.courseCode || "";

    document.getElementById("courseType").value =
        course.courseType || "";

    document.getElementById("courseCredits").value =
        course.credits || "";

}


/* ================= LOAD ENROLLMENTS ================= */

async function loadEnrollments() {

    try {

        const response =
            await fetch(API_ENROLLMENTS);

        if (!response.ok) {
            throw new Error("Unable to load enrollments");
        }

        enrollments =
            await response.json();

        renderEnrollments();

        updateStatistics();

    } catch (error) {

        console.error(error);

        document.getElementById(
            "enrollmentTableBody"
        ).innerHTML = `
            <tr>
                <td colspan="9" class="empty">
                    Unable to load enrollment records.
                </td>
            </tr>
        `;

    }

}


/* ================= RENDER TABLE ================= */

function renderEnrollments(data = enrollments) {

    const tbody =
        document.getElementById("enrollmentTableBody");

    tbody.innerHTML = "";

    if (!data.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="empty">
                    No course enrollment records found.
                </td>
            </tr>
        `;

        return;
    }

    data.forEach((enrollment, index) => {

        const status =
            enrollment.status || "Active";

        const statusClass =
            status.toLowerCase();

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                ${index + 1}
            </td>

            <td>
                <span class="student-name">
                    ${escapeHtml(
            enrollment.studentName || "-"
        )}
                </span>
            </td>

            <td>
                ${escapeHtml(
            enrollment.enrollmentNo || "-"
        )}
            </td>

            <td>
                <span class="course-code">
                    ${escapeHtml(
            enrollment.courseCode || "-"
        )}
                </span>
            </td>

            <td>
                ${escapeHtml(
            enrollment.courseName || "-"
        )}
            </td>

            <td>
                ${escapeHtml(
            enrollment.semester || "-"
        )}
            </td>

            <td>
                ${escapeHtml(
            enrollment.academicYear || "-"
        )}
            </td>

            <td>
                <span class="status ${statusClass}">
                    ${escapeHtml(status)}
                </span>
            </td>

            <td>

                <button
                    class="delete-btn"
                    title="Delete Enrollment"
                    onclick="deleteEnrollment(${enrollment.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>
        `;

        tbody.appendChild(row);
    });
}

/* ================= SEARCH ================= */

function filterEnrollments() {

    const search =
        document.getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();

    if (!search) {

        renderEnrollments();

        return;
    }

    const filtered =
        enrollments.filter(enrollment => {

            const text = [

                enrollment.studentName,

                enrollment.enrollmentNo,

                enrollment.courseCode,

                enrollment.courseName,

                enrollment.semester,

                enrollment.academicYear,

                enrollment.status

            ]
                .filter(value => value != null)
                .join(" ")
                .toLowerCase();

            return text.includes(search);

        });

    renderEnrollments(filtered);
}

/* ================= STATISTICS ================= */

function updateStatistics() {

    // Total Enrollments
    document.getElementById(
        "totalEnrollments"
    ).textContent =
        enrollments.length;


    // Active Enrollments
    const active =
        enrollments.filter(
            e =>
                (e.status || "").toLowerCase() ===
                "active"
        ).length;

    document.getElementById(
        "activeEnrollments"
    ).textContent =
        active;


    // Total Courses
    document.getElementById(
        "totalCourses"
    ).textContent =
        courses.length;


    // Unique Students
    const studentIds =
        new Set(
            enrollments
                .map(e => e.studentId)
                .filter(id => id != null)
        );

    document.getElementById(
        "studentsEnrolled"
    ).textContent =
        studentIds.size;
}

/* ================= ADD ENROLLMENT ================= */

document.getElementById(
    "enrollmentForm"
).addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const studentId =
            document.getElementById(
                "studentId"
            ).value;

        const courseId =
            document.getElementById(
                "courseId"
            ).value;

        const semester =
            document.getElementById(
                "semester"
            ).value;

        const academicYear =
            document.getElementById(
                "academicYear"
            ).value;

        const status =
            document.getElementById(
                "status"
            ).value;


        if (!studentId ||
            !courseId ||
            !semester ||
            !academicYear) {

            alert(
                "Please fill all required fields."
            );

            return;
        }


        try {

            const params =
                new URLSearchParams();

            params.append(
                "studentId",
                studentId
            );

            params.append(
                "courseId",
                courseId
            );

            params.append(
                "semester",
                semester
            );

            params.append(
                "academicYear",
                academicYear
            );

            params.append(
                "status",
                status
            );


            const response =
                await fetch(
                    `${API_ENROLLMENTS}?${params.toString()}`,
                    {
                        method: "POST"
                    }
                );


            if (!response.ok) {

                const message =
                    await response.text();

                throw new Error(
                    message || "Unable to save enrollment."
                );
            }

            alert(
                "Course enrollment added successfully."
            );

            closeEnrollmentModal();

            document.getElementById(
                "enrollmentForm"
            ).reset();

            loadEnrollments();
        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Unable to save enrollment."
            );
        }

        }
);


/* ================= ADD COURSE ================= */

document.getElementById(
    "courseForm"
).addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const course = {

            courseCode:
                document.getElementById(
                    "newCourseCode"
                ).value.trim(),

            courseName:
                document.getElementById(
                    "newCourseName"
                ).value.trim(),

            courseType:
            document.getElementById(
                "newCourseType"
            ).value,

            credits:
                Number(
                    document.getElementById(
                        "newCourseCredits"
                    ).value
                ),

            department:
                document.getElementById(
                    "newCourseDepartment"
                ).value.trim(),

            programme:
                document.getElementById(
                    "newCourseProgramme"
                ).value.trim(),

            status:
            document.getElementById(
                "newCourseStatus"
            ).value

        };


        try {

            const response =
                await fetch(
                    API_COURSES,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(course)
                    }
                );


            if (!response.ok) {

                const message =
                    await response.text();

                throw new Error(message);

            }


            alert(
                "Course created successfully."
            );


            closeCourseModal();

            document.getElementById(
                "courseForm"
            ).reset();


            loadCourses();

        } catch (error) {

            console.error(error);

            alert(
                "Unable to create course."
            );

        }

    }
);


/* ================= DELETE ================= */

async function deleteEnrollment(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this enrollment?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_ENROLLMENTS}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {
            throw new Error(
                "Delete failed"
            );
        }


        alert(
            "Enrollment deleted successfully."
        );


        loadEnrollments();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete enrollment."
        );

    }

}


/* ================= MODALS ================= */

function openEnrollmentModal() {

    document.getElementById(
        "enrollmentModal"
    ).classList.add("show");

}

function closeEnrollmentModal() {

    document.getElementById(
        "enrollmentModal"
    ).classList.remove("show");

}

function openCourseModal() {

    document.getElementById(
        "courseModal"
    ).classList.add("show");

}

function closeCourseModal() {

    document.getElementById(
        "courseModal"
    ).classList.remove("show");

}


/* ================= BACK ================= */

function goBack() {

    window.location.href =
        "/dashboard.html";

}


/* ================= HTML SAFETY ================= */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}