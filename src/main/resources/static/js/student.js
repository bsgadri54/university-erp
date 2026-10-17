/* =====================================================
   UNIVERSITY ERP
   STUDENT MANAGEMENT
   COURSE-ENROLLMENT STYLE
===================================================== */

let students = [];

let editMode = false;


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadStudents();

    }
);


/* =====================================================
   LOAD STUDENTS
===================================================== */

async function loadStudents() {

    try {

        const response =
            await fetch("/students");

        if (!response.ok) {

            throw new Error(
                "Failed to load students"
            );

        }

        students =
            await response.json();


        renderStudents();

        updateStatistics();

        populateFilters();

    }
    catch (error) {

        console.error(
            "Load students error:",
            error
        );

        showEmptyState();

    }

}


/* =====================================================
   RENDER STUDENTS
===================================================== */

function renderStudents(list = students) {

    const table =
        document.getElementById(
            "studentTable"
        );

    const empty =
        document.getElementById(
            "emptyState"
        );


    table.innerHTML = "";


    if (!list || list.length === 0) {

        empty.style.display =
            "block";

        return;

    }


    empty.style.display =
        "none";


    list.forEach(
        (student, index) => {

            const row =
                document.createElement("tr");


            const name =
                student.name ||
                "-";


            const enrollment =
                student.enrollmentNo ||
                "-";


            const email =
                student.email ||
                "-";


            /*
             * Your Student entity uses:
             * private String phone;
             */

            const mobile =
                student.phone ||
                "-";


            const course =
                student.course ||
                "-";


            const semester =
                student.semester ||
                "-";


            /*
             * Student entity currently does NOT
             * contain a status field.
             *
             * Therefore every existing student
             * is displayed as ACTIVE.
             */

            const status =
                "ACTIVE";


            const initial =
                name
                    .charAt(0)
                    .toUpperCase();


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>

                    <div class="student-cell">

                        <div class="student-avatar">
                            ${escapeHtml(initial)}
                        </div>

                        <div>

                            <div class="student-name">
                                ${escapeHtml(name)}
                            </div>

                        </div>

                    </div>

                </td>


                <td>

                    <strong>
                        ${escapeHtml(enrollment)}
                    </strong>

                </td>


                <td>
                    ${escapeHtml(course)}
                </td>


                <td>
                    ${escapeHtml(semester)}
                </td>


                <td class="student-email">
                    ${escapeHtml(email)}
                </td>


                <td>
                    ${escapeHtml(mobile)}
                </td>


                <td>

                    <span class="status active">

                        <i class="fa-solid fa-circle"></i>

                        Active

                    </span>

                </td>


                <td>

                    <div class="action-buttons">

                        <button
                            type="button"
                            class="edit-btn"
                            title="Edit Student"
                            onclick="editStudent(${student.id})">

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            type="button"
                            class="delete-btn"
                            title="Delete Student"
                            onclick="deleteStudent(${student.id})">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


/* =====================================================
   STATISTICS
===================================================== */

function updateStatistics() {

    /*
     * Total Students
     */

    document.getElementById(
        "totalStudents"
    ).textContent =
        students.length;


    /*
     * Active Students
     *
     * Student entity currently has no
     * status property.
     *
     * Therefore all loaded students
     * are considered active.
     */

    document.getElementById(
        "activeStudents"
    ).textContent =
        students.length;


    /*
     * Total Courses
     */

    const courses =
        new Set(
            students
                .map(
                    student =>
                        student.course
                )
                .filter(Boolean)
        );


    document.getElementById(
        "totalCourses"
    ).textContent =
        courses.size;


    /*
     * Total Semesters
     */

    const semesters =
        new Set(
            students
                .map(
                    student =>
                        student.semester
                )
                .filter(Boolean)
        );


    document.getElementById(
        "totalSemesters"
    ).textContent =
        semesters.size;

}


/* =====================================================
   POPULATE FILTERS
===================================================== */

function populateFilters() {

    const courseFilter =
        document.getElementById(
            "courseFilter"
        );


    const semesterFilter =
        document.getElementById(
            "semesterFilter"
        );


    const courses =
        [
            ...new Set(
                students
                    .map(
                        student =>
                            student.course
                    )
                    .filter(Boolean)
            )
        ];


    const semesters =
        [
            ...new Set(
                students
                    .map(
                        student =>
                            student.semester
                    )
                    .filter(Boolean)
            )
        ];


    /*
     * Reset course filter
     */

    courseFilter.innerHTML =
        `
        <option value="">
            All Courses
        </option>
        `;


    /*
     * Reset semester filter
     */

    semesterFilter.innerHTML =
        `
        <option value="">
            All Semesters
        </option>
        `;


    /*
     * Add courses
     */

    courses.forEach(
        course => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                course;

            option.textContent =
                course;

            courseFilter.appendChild(
                option
            );

        }
    );


    /*
     * Add semesters
     */

    semesters.forEach(
        semester => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                semester;

            option.textContent =
                semester;

            semesterFilter.appendChild(
                option
            );

        }
    );

}


/* =====================================================
   SEARCH + FILTER
===================================================== */

function filterStudents() {

    const search =
        document.getElementById(
            "searchInput"
        )
            .value
            .toLowerCase()
            .trim();


    const course =
        document.getElementById(
            "courseFilter"
        ).value;


    const semester =
        document.getElementById(
            "semesterFilter"
        ).value;


    const filtered =
        students.filter(
            student => {

                const name =
                    (
                        student.name ||
                        ""
                    )
                        .toLowerCase();


                const enrollment =
                    (
                        student.enrollmentNo ||
                        ""
                    )
                        .toLowerCase();


                const email =
                    (
                        student.email ||
                        ""
                    )
                        .toLowerCase();


                const matchesSearch =
                    !search ||

                    name.includes(
                        search
                    ) ||

                    enrollment.includes(
                        search
                    ) ||

                    email.includes(
                        search
                    );


                const matchesCourse =
                    !course ||
                    student.course ===
                    course;


                const matchesSemester =
                    !semester ||
                    student.semester ===
                    semester;


                return (
                    matchesSearch &&
                    matchesCourse &&
                    matchesSemester
                );

            }
        );


    renderStudents(
        filtered
    );

}


/* =====================================================
   OPEN ADD STUDENT MODAL
===================================================== */

function openAddStudentModal() {

    editMode =
        false;


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add Student";


    document.getElementById(
        "saveButton"
    ).innerHTML =
        `
        <i class="fa-solid fa-floppy-disk"></i>
        Save Student
        `;


    document.getElementById(
        "studentForm"
    ).reset();


    document.getElementById(
        "studentId"
    ).value =
        "";


    document.getElementById(
        "studentModal"
    ).classList.add(
        "show"
    );

}


/* =====================================================
   CLOSE MODAL
===================================================== */

function closeStudentModal() {

    document.getElementById(
        "studentModal"
    ).classList.remove(
        "show"
    );

}


/* =====================================================
   EDIT STUDENT
===================================================== */

function editStudent(id) {

    const student =
        students.find(
            s =>
                Number(s.id) ===
                Number(id)
        );


    if (!student) {

        alert(
            "Student record not found."
        );

        return;

    }


    editMode =
        true;


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Student";


    document.getElementById(
        "saveButton"
    ).innerHTML =
        `
        <i class="fa-solid fa-pen"></i>
        Update Student
        `;


    document.getElementById(
        "studentId"
    ).value =
        student.id;


    document.getElementById(
        "enrollmentNo"
    ).value =
        student.enrollmentNo ||
        "";


    document.getElementById(
        "studentName"
    ).value =
        student.name ||
        "";


    document.getElementById(
        "studentEmail"
    ).value =
        student.email ||
        "";


    document.getElementById(
        "studentMobile"
    ).value =
        student.phone ||
        "";


    document.getElementById(
        "studentCourse"
    ).value =
        student.course ||
        "";


    document.getElementById(
        "studentSemester"
    ).value =
        student.semester ||
        "";


    document.getElementById(
        "studentModal"
    ).classList.add(
        "show"
    );

}


/* =====================================================
   SAVE / UPDATE STUDENT
===================================================== */

async function saveStudent(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "studentId"
        ).value;


    const enrollmentNo =
        document.getElementById(
            "enrollmentNo"
        )
            .value
            .trim();


    const name =
        document.getElementById(
            "studentName"
        )
            .value
            .trim();


    const email =
        document.getElementById(
            "studentEmail"
        )
            .value
            .trim();


    const phone =
        document.getElementById(
            "studentMobile"
        )
            .value
            .trim();


    const course =
        document.getElementById(
            "studentCourse"
        ).value;


    const semester =
        document.getElementById(
            "studentSemester"
        ).value;


    /*
     * Validation
     */

    if (
        !enrollmentNo ||
        !name ||
        !email ||
        !phone ||
        !course ||
        !semester
    ) {

        alert(
            "Please fill all required fields."
        );

        return;

    }


    /*
     * IMPORTANT:
     *
     * This exactly matches
     * your Student.java entity.
     */

    const studentData = {

        enrollmentNo:
        enrollmentNo,

        name:
        name,

        email:
        email,

        phone:
        phone,

        course:
        course,

        semester:
        semester

    };


    try {

        let url =
            "/students";


        let method =
            "POST";


        /*
         * UPDATE
         */

        if (
            editMode &&
            id
        ) {

            url =
                `/students/${id}`;

            method =
                "PUT";

        }


        const response =
            await fetch(
                url,
                {

                    method:
                    method,

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            studentData
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to save student."
            );

        }


        /*
         * Success message
         */

        alert(
            editMode
                ? "Student updated successfully."
                : "Student added successfully."
        );


        /*
         * Close modal
         */

        closeStudentModal();


        /*
         * Reload records
         */

        await loadStudents();

    }
    catch (error) {

        console.error(
            "Save student error:",
            error
        );


        alert(
            "Unable to save student. Please check your backend API."
        );

    }

}


/* =====================================================
   DELETE STUDENT
===================================================== */

async function deleteStudent(id) {

    const student =
        students.find(
            s =>
                Number(s.id) ===
                Number(id)
        );


    const name =
        student
            ? student.name
            : "this student";


    const confirmed =
        confirm(
            `Are you sure you want to delete ${name}?`
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `/students/${id}`,
                {
                    method:
                        "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Delete failed."
            );

        }


        alert(
            "Student deleted successfully."
        );


        await loadStudents();

    }
    catch (error) {

        console.error(
            "Delete student error:",
            error
        );


        alert(
            "Unable to delete student."
        );

    }

}


/* =====================================================
   BACK TO DASHBOARD
===================================================== */

function goDashboard() {

    const role =
        localStorage.getItem(
            "role"
        );


    if (
        role === "ADMIN"
    ) {

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
            "dashboard.html";

    }

}


/* =====================================================
   EMPTY STATE
===================================================== */

function showEmptyState() {

    document.getElementById(
        "studentTable"
    ).innerHTML =
        "";


    document.getElementById(
        "emptyState"
    ).style.display =
        "block";

}


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


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


/* =====================================================
   CLOSE MODAL ON OUTSIDE CLICK
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "studentModal"
            );


        if (
            event.target ===
            modal
        ) {

            closeStudentModal();

        }

    }
);


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
        ) {

            closeStudentModal();

        }

    }
);