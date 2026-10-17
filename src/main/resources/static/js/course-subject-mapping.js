/* =========================================================
   COURSE SUBJECT MAPPING
   University ERP System
   ========================================================= */


/* =========================
   API ENDPOINTS
========================= */

const MAPPING_API = "/api/course-subject-mappings";
const COURSE_API = "/api/courses";
const SUBJECT_API = "/api/subjects";


/* =========================
   GLOBAL DATA
========================= */

let mappings = [];
let courses = [];
let subjects = [];


/* =========================
   PAGE LOAD
========================= */

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Course Subject Mapping page loaded.");

    try {

        /*
         * IMPORTANT:
         * Courses must load BEFORE programmes.
         *
         * Programme is stored inside Course
         * as a String:
         *
         * course.programme
         */

        await loadCourses();

        loadProgrammes();

        await loadSubjects();

        await loadMappings();

    } catch (error) {

        console.error(
            "Page loading error:",
            error
        );

    }

});


/* =========================
   LOAD PROGRAMMES
========================= */

function loadProgrammes() {

    const select =
        document.getElementById("programme");

    if (!select) {

        console.error(
            "Programme dropdown not found."
        );

        return;

    }


    /*
     * Reset dropdown
     */

    select.innerHTML =
        `<option value="">Select Programme</option>`;


    /*
     * Programme is stored directly
     * inside Course as String.
     *
     * Example:
     *
     * course.programme =
     * "B.Tech - CSE"
     */

    const uniqueProgrammes =
        [
            ...new Set(

                courses
                    .map(course => course.programme)
                    .filter(
                        programme =>
                            programme &&
                            String(programme).trim() !== ""
                    )

            )
        ];


    console.log(
        "Programmes found:",
        uniqueProgrammes
    );


    /*
     * Add programmes to dropdown
     */

    uniqueProgrammes.forEach(programme => {

        const option =
            document.createElement("option");

        option.value = programme;

        option.textContent = programme;

        select.appendChild(option);

    });


    /*
     * If no programme found
     */

    if (uniqueProgrammes.length === 0) {

        console.warn(
            "No programmes found in courses."
        );

    }

}


/* =========================
   LOAD COURSES
========================= */

async function loadCourses() {

    try {

        console.log(
            "Loading courses..."
        );


        const response =
            await fetch(COURSE_API);


        if (!response.ok) {

            throw new Error(
                "Unable to load courses. HTTP Status: "
                + response.status
            );

        }


        const data =
            await response.json();


        courses =
            Array.isArray(data)
                ? data
                : [];


        console.log(
            "Courses loaded:",
            courses
        );


        /*
         * If programme dropdown already exists,
         * refresh it.
         */

        if (
            document.getElementById("programme")
        ) {

            loadProgrammes();

        }


    } catch (error) {

        console.error(
            "Course loading error:",
            error
        );


        courses = [];


        alert(
            "Unable to load courses.\n\n"
            + error.message
        );

    }

}


/* =========================
   LOAD SUBJECTS
========================= */

async function loadSubjects() {

    try {

        console.log(
            "Loading subjects..."
        );


        const response =
            await fetch(SUBJECT_API);


        if (!response.ok) {

            throw new Error(
                "Unable to load subjects. HTTP Status: "
                + response.status
            );

        }


        const data =
            await response.json();


        subjects =
            Array.isArray(data)
                ? data
                : [];


        console.log(
            "Subjects loaded:",
            subjects
        );


        const select =
            document.getElementById("subject");


        if (!select) {

            console.error(
                "Subject dropdown not found."
            );

            return;

        }


        /*
         * Reset subject dropdown
         */

        select.innerHTML =
            `<option value="">Select Subject</option>`;


        /*
         * Add active subjects
         */

        subjects

            .filter(subject =>

                subject.status === "Active"
                ||
                subject.status === "ACTIVE"
                ||
                subject.status === "active"
                ||
                !subject.status

            )

            .forEach(subject => {

                const option =
                    document.createElement("option");


                option.value =
                    subject.id;


                option.textContent =
                    `${subject.subjectCode} - ${subject.subjectName}`;


                select.appendChild(option);

            });


        /*
         * If no subjects exist
         */

        if (subjects.length === 0) {

            console.warn(
                "No subjects found."
            );

        }

    } catch (error) {

        console.error(
            "Subject loading error:",
            error
        );


        subjects = [];


        alert(
            "Unable to load subjects.\n\n"
            + error.message
        );

    }

}


/* =========================
   FILTER COURSE BY PROGRAMME
========================= */

function loadCoursesByProgramme() {

    const programmeSelect =
        document.getElementById("programme");


    const courseSelect =
        document.getElementById("course");


    if (
        !programmeSelect ||
        !courseSelect
    ) {

        console.error(
            "Programme or Course dropdown not found."
        );

        return;

    }


    const programme =
        programmeSelect.value;


    /*
     * Reset course dropdown
     */

    courseSelect.innerHTML =
        `<option value="">Select Course</option>`;


    courseSelect.disabled =
        true;


    /*
     * No programme selected
     */

    if (!programme) {

        return;

    }


    /*
     * Find courses belonging
     * to selected programme
     */

    const filteredCourses =
        courses.filter(course =>

            String(course.programme)
                .trim()
            ===
            String(programme)
                .trim()

        );


    console.log(
        "Courses for programme:",
        programme,
        filteredCourses
    );


    /*
     * Add courses
     */

    filteredCourses.forEach(course => {

        const option =
            document.createElement("option");


        option.value =
            course.id;


        option.textContent =
            `${course.courseCode} - ${course.courseName}`;


        courseSelect.appendChild(option);

    });


    /*
     * Enable dropdown if courses exist
     */

    courseSelect.disabled =
        filteredCourses.length === 0;


    /*
     * No courses found
     */

    if (
        filteredCourses.length === 0
    ) {

        console.warn(
            "No courses found for programme:",
            programme
        );

    }

}


/* =========================
   LOAD MAPPINGS
========================= */

async function loadMappings() {

    try {

        console.log(
            "Loading mappings..."
        );


        const response =
            await fetch(MAPPING_API);


        if (!response.ok) {

            throw new Error(
                "Unable to load mappings. HTTP Status: "
                + response.status
            );

        }


        const data =
            await response.json();


        mappings =
            Array.isArray(data)
                ? data
                : [];


        console.log(
            "Mappings loaded:",
            mappings
        );


        renderMappings();

        updateStatistics();


    } catch (error) {

        console.error(
            "Mapping loading error:",
            error
        );


        mappings = [];


        renderMappings();

        updateStatistics();

    }

}


/* =========================
   RENDER TABLE
========================= */

function renderMappings(data = mappings) {

    const table =
        document.getElementById("mappingTable");

    const empty =
        document.getElementById("emptyState");

    if (!table) {

        console.error(
            "Mapping table not found."
        );

        return;
    }

    table.innerHTML = "";

    if (!data.length) {

        if (empty) {
            empty.style.display = "block";
        }

        return;
    }

    if (empty) {
        empty.style.display = "none";
    }


    data.forEach((mapping, index) => {

        /*
         * IMPORTANT:
         * CourseSubjectMappingDTO contains
         * flat course/subject fields.
         *
         * courseId
         * courseCode
         * courseName
         *
         * subjectId
         * subjectCode
         * subjectName
         * subjectType
         * credits
         */

        const course =
            courses.find(
                course =>
                    Number(course.id) ===
                    Number(mapping.courseId)
            ) || {};


        const programme =
            course.programme || "-";


        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <!-- # -->

            <td>
                ${index + 1}
            </td>


            <!-- PROGRAMME -->

            <td>
                ${escapeHtml(
            programme
        )}
            </td>


            <!-- COURSE -->

            <td>

                <strong>
                    ${escapeHtml(
            mapping.courseCode || "-"
        )}
                </strong>

                <br>

                ${escapeHtml(
            mapping.courseName || "-"
        )}

            </td>


            <!-- SUBJECT -->

            <td>

                <strong>
                    ${escapeHtml(
            mapping.subjectCode || "-"
        )}
                </strong>

                <br>

                ${escapeHtml(
            mapping.subjectName || "-"
        )}

            </td>


            <!-- TYPE -->

            <td>
                ${escapeHtml(
            mapping.subjectType || "-"
        )}
            </td>


            <!-- CREDITS -->

            <td>
                ${mapping.credits ?? "-"}
            </td>


            <!-- SEMESTER -->

            <td>
                ${escapeHtml(
            mapping.semester || "-"
        )}
            </td>


            <!-- ACADEMIC YEAR -->

            <td>
                ${escapeHtml(
            mapping.academicYear || "-"
        )}
            </td>


            <!-- STATUS -->

            <td>

                <span class="status ${
            String(
                mapping.status || ""
            ).toLowerCase() === "active"
                ? "active"
                : "inactive"
        }">

                    ${escapeHtml(
            mapping.status ||
            "Inactive"
        )}

                </span>

            </td>


            <!-- ACTION -->

            <td>

                <button
                    type="button"
                    class="delete-btn"
                    onclick="deleteMapping(${mapping.id})"
                    title="Delete Mapping"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        `;


        table.appendChild(tr);

    });

}

/* =========================
   SAVE MAPPING
========================= */

async function saveMapping(event) {

    event.preventDefault();


    /*
     * Get form values
     */

    const courseId =
        document.getElementById(
            "course"
        ).value;


    const subjectId =
        document.getElementById(
            "subject"
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


    /*
     * Validation
     */

    if (
        !courseId ||
        !subjectId ||
        !semester ||
        !academicYear
    ) {

        alert(
            "Please fill all required fields."
        );

        return;

    }


    /*
     * Create form parameters
     */

    const params =
        new URLSearchParams();


    params.append(
        "courseId",
        courseId
    );


    params.append(
        "subjectId",
        subjectId
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


    try {

        /*
         * Send POST request
         */

        const response =
            await fetch(
                MAPPING_API,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/x-www-form-urlencoded"

                    },

                    body:
                        params.toString()

                }
            );


        /*
         * Check response
         */

        if (!response.ok) {

            const text =
                await response.text();


            throw new Error(
                text ||
                "Unable to save mapping."
            );

        }


        await response.json();


        /*
         * Success
         */

        alert(
            "Subject mapped successfully."
        );


        /*
         * Close modal
         */

        closeMappingForm();


        /*
         * Reset form
         */

        const form =
            document.getElementById(
                "mappingForm"
            );


        if (form) {

            form.reset();

        }


        /*
         * Disable course dropdown
         */

        const courseSelect =
            document.getElementById(
                "course"
            );


        if (courseSelect) {

            courseSelect.innerHTML =
                `<option value="">Select Course</option>`;

            courseSelect.disabled =
                true;

        }


        /*
         * Reload mappings
         */

        await loadMappings();


    } catch (error) {

        console.error(
            "Save mapping error:",
            error
        );


        alert(
            "Unable to save mapping.\n\n"
            + error.message
        );

    }

}


/* =========================
   DELETE MAPPING
========================= */

async function deleteMapping(id) {

    if (!confirm(
        "Are you sure you want to delete this mapping?"
    )) {

        return;

    }


    try {

        const response =
            await fetch(
                `${MAPPING_API}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to delete mapping."
            );

        }


        await response.text();


        alert(
            "Mapping deleted successfully."
        );


        await loadMappings();


    } catch (error) {

        console.error(
            "Delete mapping error:",
            error
        );


        alert(
            error.message
        );

    }

}


/* =========================
   SEARCH
========================= */

/* =========================
   SEARCH
========================= */

function filterMappings() {

    const searchInput =
        document.getElementById("searchInput");


    if (!searchInput) {
        return;
    }


    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    if (!search) {

        renderMappings();

        return;
    }


    const filtered =
        mappings.filter(mapping => {

            /*
             * Programme comes from Course
             * because DTO does not contain programme.
             */

            const course =
                courses.find(
                    course =>
                        Number(course.id) ===
                        Number(mapping.courseId)
                ) || {};


            const text = [

                course.programme,

                mapping.courseCode,

                mapping.courseName,

                mapping.subjectCode,

                mapping.subjectName,

                mapping.subjectType,

                mapping.credits,

                mapping.semester,

                mapping.academicYear,

                mapping.status

            ]

                .filter(
                    value =>
                        value !== null &&
                        value !== undefined
                )

                .join(" ")

                .toLowerCase();


            return text.includes(search);

        });


    renderMappings(filtered);

}

/* =========================
   STATISTICS
========================= */

function updateStatistics() {

    /*
     * =========================
     * TOTAL MAPPINGS
     * =========================
     */

    const totalMappings =
        document.getElementById(
            "totalMappings"
        );


    if (totalMappings) {

        totalMappings.textContent =
            mappings.length;

    }


    /*
     * =========================
     * ACTIVE MAPPINGS
     * =========================
     */

    const activeMappings =
        document.getElementById(
            "activeMappings"
        );


    const active =
        mappings.filter(mapping =>

            String(
                mapping.status || ""
            ).toLowerCase() === "active"

        );


    if (activeMappings) {

        activeMappings.textContent =
            active.length;

    }


    /*
     * =========================
     * COURSES COVERED
     * =========================
     *
     * DTO contains:
     * mapping.courseId
     */

    const courseIds =
        new Set(

            mappings

                .map(
                    mapping =>
                        mapping.courseId
                )

                .filter(
                    id =>
                        id !== null &&
                        id !== undefined
                )

        );


    const courseCount =
        document.getElementById(
            "courseCount"
        );


    if (courseCount) {

        courseCount.textContent =
            courseIds.size;

    }


    /*
     * =========================
     * SUBJECTS MAPPED
     * =========================
     *
     * DTO contains:
     * mapping.subjectId
     */

    const subjectIds =
        new Set(

            mappings

                .map(
                    mapping =>
                        mapping.subjectId
                )

                .filter(
                    id =>
                        id !== null &&
                        id !== undefined
                )

        );


    const subjectCount =
        document.getElementById(
            "subjectCount"
        );


    if (subjectCount) {

        subjectCount.textContent =
            subjectIds.size;

    }

}

/* =========================
   OPEN MODAL
========================= */

function openMappingForm() {

    const modal =
        document.getElementById(
            "mappingModal"
        );


    if (!modal) {

        console.error(
            "Mapping modal not found."
        );

        return;

    }


    /*
     * Refresh dropdowns before opening
     */

    loadProgrammes();


    /*
     * Reset course dropdown
     */

    const courseSelect =
        document.getElementById(
            "course"
        );


    if (courseSelect) {

        courseSelect.innerHTML =
            `<option value="">Select Course</option>`;

        courseSelect.disabled =
            true;

    }


    /*
     * Show modal
     */

    modal.classList.add(
        "show"
    );

}


/* =========================
   CLOSE MODAL
========================= */

function closeMappingForm() {

    const modal =
        document.getElementById(
            "mappingModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "show"
    );

}


/* =========================
   ESCAPE HTML
========================= */

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