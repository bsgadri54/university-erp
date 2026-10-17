const username = localStorage.getItem("username");

// ===============================
// LOGIN CHECK
// ===============================

if (!username) {
    window.location.href = "login.html";
}


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded", function () {
    loadStudentCourseData();
});


// ===============================
// LOAD STUDENT
// ===============================

async function loadStudentCourseData() {

    try {

        const response = await fetch("/students");

        if (!response.ok) {
            throw new Error("Unable to load students");
        }

        const students = await response.json();

        // Find currently logged-in student
        const student = students.find(
            s => s.enrollmentNo === username
        );

        if (!student) {

            showError("Student record not found.");

            return;
        }


        // ===============================
        // STUDENT INFORMATION
        // ===============================

        const studentName =
            document.getElementById("studentName");

        if (studentName) {
            studentName.textContent =
                student.name || "-";
        }


        const studentEnrollment =
            document.getElementById("studentEnrollment");

        if (studentEnrollment) {
            studentEnrollment.textContent =
                "Enrollment: " +
                (student.enrollmentNo || "-");
        }


        const semesterElement =
            document.getElementById("semester");

        if (semesterElement) {
            semesterElement.textContent =
                student.semester || "-";
        }


        // ===============================
        // LOAD ENROLLMENTS
        // ===============================

        await loadEnrollments(student.id);

    } catch (error) {

        console.error(
            "Course enrollment error:",
            error
        );

        showError(
            "Unable to load course enrollment."
        );
    }
}


// ===============================
// LOAD STUDENT ENROLLMENTS
// ===============================

async function loadEnrollments(studentId) {

    try {

        const response =
            await fetch(
                `/api/course-enrollments/student/${studentId}`
            );

        if (!response.ok) {

            throw new Error(
                "Unable to load enrollments"
            );
        }

        const enrollments =
            await response.json();

        console.log(
            "Student enrollments:",
            enrollments
        );


        renderCourses(enrollments);

        updateStatistics(enrollments);


        // ===============================
        // LOAD MAPPED SUBJECTS
        // ===============================

        if (enrollments.length > 0) {

            const enrollment =
                enrollments[0];

            const course =
                enrollment.course || {};

            const courseName =
                course.courseName;

            const semester =
                enrollment.semester;

            if (courseName && semester) {

                await loadCourseSubjects(
                    courseName,
                    semester
                );

            } else {

                showNoSubjects();

            }

        } else {

            showNoSubjects();

        }

    } catch (error) {

        console.error(
            "Enrollment error:",
            error
        );

        showError(
            "Unable to load your courses."
        );
    }
}


// ===============================
// LOAD COURSE SUBJECTS
// ===============================

async function loadCourseSubjects(
    courseName,
    semester
) {

    try {

        console.log(
            "Loading subjects:",
            courseName,
            semester
        );


        const url =
            "/api/course-subject-mappings/student" +
            "?courseName=" +
            encodeURIComponent(courseName) +
            "&semester=" +
            encodeURIComponent(semester);


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Unable to load course subjects"
            );
        }


        const subjects =
            await response.json();


        console.log(
            "Mapped subjects:",
            subjects
        );


        renderSubjects(subjects);


        // Update total credits
        updateSubjectCredits(subjects);


    } catch (error) {

        console.error(
            "Subject loading error:",
            error
        );

        showNoSubjects();
    }
}


// ===============================
// DISPLAY COURSES
// ===============================

function renderCourses(enrollments) {

    const container =
        document.getElementById(
            "courseContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!enrollments.length) {

        container.innerHTML = `

            <div class="empty">

                <i class="fa-solid fa-book-open"
                   style="font-size:32px;margin-bottom:12px;">
                </i>

                <br>

                No courses have been enrolled
                for your account yet.

            </div>

        `;

        return;
    }


    enrollments.forEach(
        enrollment => {

            const course =
                enrollment.course || {};


            const status =
                enrollment.status ||
                "Active";


            const card =
                document.createElement("div");


            card.className =
                "course-card";


            card.innerHTML = `

                <div class="course-top">

                    <span class="course-code">

                        ${escapeHtml(
                course.courseCode || "-"
            )}

                    </span>

                    <span class="course-status">

                        ${escapeHtml(status)}

                    </span>

                </div>


                <h3>

                    ${escapeHtml(
                course.courseName || "-"
            )}

                </h3>


                <div class="course-details">


                    <div class="detail-row">

                        <span>
                            Course Type
                        </span>

                        <span>

                            ${escapeHtml(
                course.courseType || "-"
            )}

                        </span>

                    </div>


                    <div class="detail-row">

                        <span>
                            Credits
                        </span>

                        <span>

                            ${escapeHtml(
                course.credits ?? "-"
            )}

                        </span>

                    </div>


                    <div class="detail-row">

                        <span>
                            Semester
                        </span>

                        <span>

                            ${escapeHtml(
                enrollment.semester || "-"
            )}

                        </span>

                    </div>


                    <div class="detail-row">

                        <span>
                            Academic Year
                        </span>

                        <span>

                            ${escapeHtml(
                enrollment.academicYear || "-"
            )}

                        </span>

                    </div>


                    <div class="detail-row">

                        <span>
                            Enrollment Date
                        </span>

                        <span>

                            ${escapeHtml(
                enrollment.enrollmentDate || "-"
            )}

                        </span>

                    </div>


                </div>

            `;


            container.appendChild(card);

        }
    );
}


// ===============================
// DISPLAY SUBJECTS
// ===============================

function renderSubjects(subjects) {

    /*
     * Your HTML should have an element
     * with id="subjectContainer".
     */

    const container =
        document.getElementById(
            "subjectContainer"
        );


    if (!container) {

        console.error(
            "subjectContainer element not found in HTML"
        );

        return;
    }


    container.innerHTML = "";


    if (!subjects || subjects.length === 0) {

        showNoSubjects();

        return;
    }


    subjects.forEach(
        (subject, index) => {

            const row =
                document.createElement("div");


            row.className =
                "subject-row";


            row.innerHTML = `

                <div class="subject-number">

                    ${index + 1}

                </div>


                <div class="subject-code">

                    ${escapeHtml(
                subject.subjectCode || "-"
            )}

                </div>


                <div class="subject-name">

                    ${escapeHtml(
                subject.subjectName || "-"
            )}

                </div>


                <div class="subject-type">

                    <span class="subject-badge">

                        ${escapeHtml(
                subject.subjectType || "-"
            )}

                    </span>

                </div>


                <div class="subject-credits">

                    ${escapeHtml(
                subject.credits ?? 0
            )}

                </div>


                <div class="subject-semester">

                    ${escapeHtml(
                subject.semester || "-"
            )}

                </div>


                <div class="subject-year">

                    ${escapeHtml(
                subject.academicYear || "-"
            )}

                </div>


                <div class="subject-status">

                    <span class="active-badge">

                        Active

                    </span>

                </div>

            `;


            container.appendChild(row);

        }
    );
}


// ===============================
// NO SUBJECTS
// ===============================

function showNoSubjects() {

    const container =
        document.getElementById(
            "subjectContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="empty">

            <i class="fa-solid fa-book-open"
               style="font-size:32px;margin-bottom:12px;">
            </i>

            <br>

            No Subjects Mapped

            <div style="
                margin-top:8px;
                font-size:13px;
                color:#777;
            ">

                Your University has not mapped
                any active subjects for this semester.

            </div>

        </div>

    `;
}


// ===============================
// UPDATE SUBJECT CREDITS
// ===============================

function updateSubjectCredits(subjects) {

    const totalCredits =
        subjects.reduce(
            (total, subject) => {

                return total +
                    Number(
                        subject.credits || 0
                    );

            },
            0
        );


    const totalCreditsElement =
        document.getElementById(
            "totalCredits"
        );


    if (totalCreditsElement) {

        totalCreditsElement.textContent =
            totalCredits;

    }
}


// ===============================
// STATISTICS
// ===============================

function updateStatistics(enrollments) {


    // Total courses

    const totalCourses =
        document.getElementById(
            "totalCourses"
        );


    if (totalCourses) {

        totalCourses.textContent =
            enrollments.length;

    }


    // Active courses

    const activeCourses =
        enrollments.filter(
            e =>
                (e.status || "")
                    .toLowerCase() === "active"
        ).length;


    const activeCoursesElement =
        document.getElementById(
            "activeCourses"
        );


    if (activeCoursesElement) {

        activeCoursesElement.textContent =
            activeCourses;

    }


    // Semester

    if (enrollments.length > 0) {

        const semesterElement =
            document.getElementById(
                "semester"
            );


        if (semesterElement) {

            semesterElement.textContent =
                enrollments[0].semester || "-";

        }

    }
}


// ===============================
// BACK TO STUDENT DASHBOARD
// ===============================

function goBack() {

    window.location.href =
        "student-dashboard.html";

}


// ===============================
// ERROR MESSAGE
// ===============================

function showError(message) {

    const container =
        document.getElementById(
            "courseContainer"
        );


    if (container) {

        container.innerHTML = `

            <div class="empty">

                <i class="fa-solid fa-circle-exclamation"
                   style="font-size:30px;margin-bottom:12px;">
                </i>

                <br>

                ${escapeHtml(message)}

            </div>

        `;
    }
}


// ===============================
// HTML SAFETY
// ===============================

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}