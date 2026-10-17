// ============================================================
// UNIVERSITY ERP
// RESULT MANAGEMENT
// ============================================================

let allStudents = [];

let allResults = [];

let currentStudent = null;

let currentSubjects = [];


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    loadStudents();

    loadResults();

    document
        .getElementById("enrollmentNo")
        .addEventListener("change", studentChanged);

    document
        .getElementById("enrollmentNo")
        .addEventListener("blur", studentChanged);

    document
        .getElementById("semester")
        .addEventListener("change", function () {

            if (currentStudent) {

                loadMappedSubjects(
                    this.value
                );

            }

        });

    document
        .getElementById("subject")
        .addEventListener("change", subjectChanged);

    document
        .getElementById("marks")
        .addEventListener("input", calculateResult);

    document
        .getElementById("search")
        .addEventListener("input", filterResults);

    document
        .getElementById("semesterFilter")
        .addEventListener("change", filterResults);

    document
        .getElementById("subjectFilter")
        .addEventListener("change", filterResults);

    document
        .getElementById("statusFilter")
        .addEventListener("change", filterResults);

    document
        .getElementById("resultForm")
        .addEventListener("submit", saveResult);

});


// ============================================================
// LOAD STUDENTS
// ============================================================

function loadStudents() {

    fetch("/students")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to load students"
                );

            }

            return response.json();

        })

        .then(data => {

            allStudents = data || [];

        })

        .catch(error => {

            console.error(
                "Student Loading Error:",
                error
            );

        });

}


// ============================================================
// LOAD RESULTS
// ============================================================

function loadResults() {

    fetch("/results")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to load results"
                );

            }

            return response.json();

        })

        .then(results => {

            allResults = results || [];

            updateStatistics();

            populateSubjectFilter();

            filterResults();

        })

        .catch(error => {

            console.error(
                "Result Loading Error:",
                error
            );

            document.getElementById(
                "resultTable"
            ).innerHTML = `

                <tr>

                    <td colspan="11"
                        class="no-data">

                        Unable to load result records

                    </td>

                </tr>

            `;

        });

}


// ============================================================
// STATISTICS
// ============================================================

function updateStatistics() {

    document.getElementById(
        "totalResults"
    ).textContent =
        allResults.length;


    const students =
        new Set(

            allResults
                .map(result =>
                    result.enrollmentNo
                )
                .filter(value => value)

        );


    const subjects =
        new Set(

            allResults
                .map(result =>
                    result.subject
                )
                .filter(value => value)

        );


    const passed =
        allResults.filter(
            result =>
                String(result.status || "")
                    .toUpperCase() === "PASS"
        );


    document.getElementById(
        "totalStudents"
    ).textContent =
        students.size;


    document.getElementById(
        "totalSubjects"
    ).textContent =
        subjects.size;


    document.getElementById(
        "passedResults"
    ).textContent =
        passed.length;

}


// ============================================================
// SUBJECT FILTER
// ============================================================

function populateSubjectFilter() {

    const select =
        document.getElementById(
            "subjectFilter"
        );


    const currentValue =
        select.value;


    const subjects =
        [...new Set(

            allResults
                .map(result =>
                    result.subject
                )
                .filter(value => value)

        )].sort();


    select.innerHTML = `

        <option value="">
            All Subjects
        </option>

    `;


    subjects.forEach(subject => {

        const option =
            document.createElement("option");

        option.value = subject;

        option.textContent =
            getSubjectDisplayNameSimple(subject);

        select.appendChild(option);

    });


    select.value = currentValue;

}


// ============================================================
// FILTER RESULTS
// ============================================================

function filterResults() {

    const search =
        document
            .getElementById("search")
            .value
            .trim()
            .toLowerCase();


    const semester =
        document
            .getElementById("semesterFilter")
            .value;


    const subject =
        document
            .getElementById("subjectFilter")
            .value;


    const status =
        document
            .getElementById("statusFilter")
            .value;


    const filtered =
        allResults.filter(result => {

            const text = (

                (result.enrollmentNo || "") +
                " " +
                (result.studentName || "") +
                " " +
                (result.subject || "")

            ).toLowerCase();


            const searchMatch =
                text.includes(search);


            const semesterMatch =
                !semester ||
                result.semester === semester;


            const subjectMatch =
                !subject ||
                result.subject === subject;


            const statusMatch =
                !status ||
                String(result.status || "")
                    .toUpperCase() === status;


            return (
                searchMatch &&
                semesterMatch &&
                subjectMatch &&
                statusMatch
            );

        });


    renderResults(filtered);

}


// ============================================================
// RENDER RESULTS
// ============================================================

function renderResults(results) {

    const table =
        document.getElementById(
            "resultTable"
        );


    table.innerHTML = "";


    if (!results || results.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="11"
                    class="no-data">

                    No result records found

                </td>

            </tr>

        `;

        return;

    }


    results.forEach((result, index) => {

        const row =
            document.createElement("tr");


        const status =
            String(
                result.status || ""
            ).toUpperCase();


        const badgeClass =
            status === "PASS"
                ? "pass"
                : "fail";


        const subject =
            getSubjectDisplayNameSimple(
                result.subject
            );


        let percentage =
            result.percentage ?? "";


        percentage =
            String(percentage)
                .replace("%", "");


        row.innerHTML = `

            <td>
                ${index + 1}
            </td>


            <td>

                <span class="enrollment-code">

                    ${escapeHtml(
            result.enrollmentNo || "-"
        )}

                </span>

            </td>


            <td>

                <div class="student-name">

                    <div class="avatar">

                        ${getInitial(
            result.studentName
        )}

                    </div>

                    <strong>

                        ${escapeHtml(
            result.studentName || "-"
        )}

                    </strong>

                </div>

            </td>


            <td>

                <span class="subject-name">

                    ${escapeHtml(subject)}

                </span>

            </td>


            <td>
                ${result.marks ?? "-"}
            </td>


            <td>
                ${result.maxMarks ?? "-"}
            </td>


            <td>
                ${percentage !== ""
            ? percentage + "%"
            : "-"}
            </td>


            <td>

                <span class="grade">

                    ${escapeHtml(
            result.grade || "-"
        )}

                </span>

            </td>


            <td>

                <span class="status ${badgeClass}">

                    <i class="fa-solid fa-circle"></i>

                    ${escapeHtml(
            status || "-"
        )}

                </span>

            </td>


            <td>
                ${escapeHtml(
            result.semester || "-"
        )}
            </td>


            <td>

                <div class="action-buttons">

                    <button
                        class="edit-btn"
                        onclick="editResult(${result.id})"
                        title="Edit">

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteResult(${result.id})"
                        title="Delete">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        `;


        table.appendChild(row);

    });

}


// ============================================================
// OPEN ADD RESULT
// ============================================================

function openAddResult() {

    clearForm();


    document.getElementById(
        "modalTitle"
    ).innerHTML = `

        <i class="fa-solid fa-plus"></i>

        Add Result

    `;


    document.getElementById(
        "saveButtonText"
    ).textContent =
        "Save Result";


    document.getElementById(
        "resultModal"
    ).classList.add("show");


    setTimeout(() => {

        document
            .getElementById("enrollmentNo")
            .focus();

    }, 100);

}


// ============================================================
// CLOSE MODAL
// ============================================================

function closeResultModal() {

    document
        .getElementById("resultModal")
        .classList.remove("show");

}


// ============================================================
// STUDENT CHANGED
// ============================================================

function studentChanged() {

    const enrollmentNo =
        document
            .getElementById("enrollmentNo")
            .value
            .trim();


    if (!enrollmentNo) {

        clearStudentFields();

        return;

    }


    if (!allStudents.length) {

        fetch("/students")

            .then(response =>
                response.json()
            )

            .then(students => {

                allStudents =
                    students || [];

                findStudent(
                    enrollmentNo
                );

            })

            .catch(error => {

                console.error(error);

            });

        return;

    }


    findStudent(enrollmentNo);

}


// ============================================================
// FIND STUDENT
// ============================================================

function findStudent(enrollmentNo) {

    currentStudent =
        allStudents.find(
            student =>
                student.enrollmentNo &&
                student.enrollmentNo
                    .trim()
                    .toLowerCase() ===
                enrollmentNo
                    .trim()
                    .toLowerCase()
        );


    if (!currentStudent) {

        document.getElementById(
            "studentName"
        ).value = "";


        document.getElementById(
            "course"
        ).value = "";


        resetSubjectDropdown();

        resetSemesterDropdown();

        return;

    }


    document.getElementById(
        "studentName"
    ).value =
        currentStudent.name || "";


    document.getElementById(
        "course"
    ).value =
        currentStudent.course || "";


    loadStudentSemesters();

}


// ============================================================
// LOAD SEMESTER
// ============================================================

function loadStudentSemesters() {

    const semesterSelect =
        document.getElementById(
            "semester"
        );


    semesterSelect.innerHTML = "";


    const studentSemester =
        currentStudent &&
        currentStudent.semester
            ? currentStudent.semester
            : "SEM 1";


    const option =
        document.createElement("option");


    option.value =
        studentSemester;

    option.textContent =
        studentSemester;


    semesterSelect.appendChild(
        option
    );


    loadMappedSubjects(
        studentSemester
    );

}


// ============================================================
// LOAD SUBJECTS
// ============================================================

function loadMappedSubjects(semester) {

    const subjectSelect =
        document.getElementById(
            "subject"
        );


    subjectSelect.innerHTML = "";


    if (
        !currentStudent ||
        !currentStudent.course
    ) {

        resetSubjectDropdown();

        return;

    }


    const loading =
        document.createElement("option");


    loading.value = "";

    loading.textContent =
        "Loading Subjects...";


    subjectSelect.appendChild(
        loading
    );


    const url =
        "/api/course-subject-mappings/student" +
        "?courseName=" +
        encodeURIComponent(
            currentStudent.course
        ) +
        "&semester=" +
        encodeURIComponent(
            semester
        );


    fetch(url)

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to load subjects"
                );

            }

            return response.json();

        })

        .then(subjects => {

            currentSubjects =
                subjects || [];


            subjectSelect.innerHTML = "";


            if (!currentSubjects.length) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value = "";

                option.textContent =
                    "No Subjects Mapped";

                subjectSelect.appendChild(
                    option
                );

                return;

            }


            const defaultOption =
                document.createElement(
                    "option"
                );


            defaultOption.value = "";

            defaultOption.textContent =
                "Select Subject";


            subjectSelect.appendChild(
                defaultOption
            );


            currentSubjects.forEach(
                subject => {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        subject.subjectName;


                    option.textContent =
                        subject.subjectName;


                    option.dataset.subjectCode =
                        subject.subjectCode || "";


                    option.dataset.subjectType =
                        subject.subjectType || "";


                    option.dataset.credits =
                        subject.credits || "";


                    option.dataset.academicYear =
                        subject.academicYear || "";


                    subjectSelect.appendChild(
                        option
                    );

                }
            );

        })

        .catch(error => {

            console.error(
                "Subject Loading Error:",
                error
            );


            subjectSelect.innerHTML = `

                <option value="">
                    Unable to Load Subjects
                </option>

            `;

        });

}


// ============================================================
// SUBJECT CHANGED
// ============================================================

function subjectChanged() {

    const subjectSelect =
        document.getElementById(
            "subject"
        );


    const selected =
        subjectSelect.options[
            subjectSelect.selectedIndex
            ];


    if (
        !selected ||
        !selected.value
    ) {

        document.getElementById(
            "maxMarks"
        ).value = 100;

        calculateResult();

        return;

    }


    const subjectName =
        selected.value;


    const subjectType =
        (
            selected.dataset.subjectType || ""
        ).toUpperCase();


    let maximumMarks = 100;


    if (

        subjectType.includes("LAB") ||

        subjectType.includes("PRACTICAL") ||

        subjectName
            .toUpperCase()
            .includes("LAB") ||

        subjectName
            .toUpperCase()
            .includes("PRACTICAL")

    ) {

        maximumMarks = 50;

    }


    document.getElementById(
        "maxMarks"
    ).value =
        maximumMarks;


    calculateResult();

}


// ============================================================
// CALCULATE RESULT
// ============================================================

function calculateResult() {

    const marksInput =
        document.getElementById(
            "marks"
        );


    const marks =
        Number(
            marksInput.value
        );


    const max =
        Number(
            document.getElementById(
                "maxMarks"
            ).value
        );


    if (
        marksInput.value === "" ||
        !max
    ) {

        document.getElementById(
            "percentage"
        ).value = "";

        document.getElementById(
            "grade"
        ).value = "";

        document.getElementById(
            "status"
        ).value = "";

        return;

    }


    if (marks > max) {

        marksInput.setCustomValidity(
            "Marks cannot exceed " + max
        );

    } else {

        marksInput.setCustomValidity("");

    }


    const percentage =
        (marks / max) * 100;


    document.getElementById(
        "percentage"
    ).value =
        percentage.toFixed(2) + "%";


    let grade = "";


    if (percentage >= 90) {

        grade = "A+";

    }

    else if (percentage >= 80) {

        grade = "A";

    }

    else if (percentage >= 70) {

        grade = "B+";

    }

    else if (percentage >= 60) {

        grade = "B";

    }

    else if (percentage >= 50) {

        grade = "C";

    }

    else if (percentage >= 40) {

        grade = "D";

    }

    else {

        grade = "F";

    }


    document.getElementById(
        "grade"
    ).value =
        grade;


    const passMarks =
        max === 50
            ? 20
            : 40;


    document.getElementById(
        "status"
    ).value =
        marks >= passMarks
            ? "PASS"
            : "FAIL";

}


// ============================================================
// SAVE RESULT
// ============================================================

function saveResult(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "resultId"
        ).value;


    const enrollmentNo =
        document.getElementById(
            "enrollmentNo"
        ).value.trim();


    const studentName =
        document.getElementById(
            "studentName"
        ).value;


    const course =
        document.getElementById(
            "course"
        ).value;


    const subject =
        document.getElementById(
            "subject"
        ).value;


    const semester =
        document.getElementById(
            "semester"
        ).value;


    const marks =
        document.getElementById(
            "marks"
        ).value;


    const maxMarks =
        document.getElementById(
            "maxMarks"
        ).value;


    const percentage =
        document.getElementById(
            "percentage"
        ).value
            .replace("%", "");


    const grade =
        document.getElementById(
            "grade"
        ).value;


    const status =
        document.getElementById(
            "status"
        ).value;


    if (!enrollmentNo) {

        showErrorMessage(
            "Please enter Enrollment Number."
        );

        return;

    }


    if (!studentName) {

        showErrorMessage(
            "Student not found."
        );

        return;

    }


    if (!subject) {

        showErrorMessage(
            "Please select a subject."
        );

        return;

    }


    if (!semester) {

        showErrorMessage(
            "Please select semester."
        );

        return;

    }


    if (
        marks === "" ||
        Number(marks) < 0 ||
        Number(marks) > Number(maxMarks)
    ) {

        showErrorMessage(
            "Please enter valid marks."
        );

        return;

    }


    const result = {

        enrollmentNo:
        enrollmentNo,

        studentName:
        studentName,

        course:
        course,

        subject:
        subject,

        semester:
        semester,

        marks:
        marks,

        maxMarks:
        maxMarks,

        percentage:
        percentage,

        grade:
        grade,

        status:
        status

    };


    let url =
        "/results";

    let method =
        "POST";


    if (id) {

        url =
            "/results/" + id;

        method =
            "PUT";

    }


    fetch(url, {

        method: method,

        headers: {

            "Content-Type":
                "application/json"

        },

        body:
            JSON.stringify(result)

    })

        .then(response => {

            if (!response.ok) {

                return response.text()
                    .then(message => {

                        throw new Error(
                            message ||
                            "Unable to save result"
                        );

                    });

            }

            return response.text();

        })

        .then(message => {

            Swal.fire({

                icon: "success",

                title: "Success",

                text:
                    message ||
                    (
                        id
                            ? "Result updated successfully."
                            : "Result saved successfully."
                    )

            });


            closeResultModal();

            clearForm();

            loadResults();

        })

        .catch(error => {

            console.error(
                "Save Result Error:",
                error
            );


            Swal.fire({

                icon: "error",

                title: "Error",

                text:
                    error.message ||
                    "Unable to save result."

            });

        });

}


// ============================================================
// EDIT RESULT
// ============================================================

function editResult(id) {

    fetch("/results/" + id)

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Result not found"
                );

            }

            return response.json();

        })

        .then(result => {

            document.getElementById(
                "resultId"
            ).value =
                result.id;


            document.getElementById(
                "enrollmentNo"
            ).value =
                result.enrollmentNo || "";


            document.getElementById(
                "studentName"
            ).value =
                result.studentName || "";


            document.getElementById(
                "course"
            ).value =
                result.course || "";


            currentStudent =
                allStudents.find(
                    student =>
                        student.enrollmentNo &&
                        student.enrollmentNo
                            .trim()
                            .toLowerCase() ===
                        String(
                            result.enrollmentNo
                        )
                            .trim()
                            .toLowerCase()
                );


            if (!currentStudent) {

                showErrorMessage(
                    "Student not found."
                );

                return;

            }


            const semesterSelect =
                document.getElementById(
                    "semester"
                );


            semesterSelect.innerHTML = "";


            const semesterOption =
                document.createElement(
                    "option"
                );


            semesterOption.value =
                result.semester;


            semesterOption.textContent =
                result.semester;


            semesterSelect.appendChild(
                semesterOption
            );


            loadMappedSubjectsForEdit(
                result
            );


            document.getElementById(
                "marks"
            ).value =
                result.marks ?? "";


            document.getElementById(
                "maxMarks"
            ).value =
                result.maxMarks || 100;


            document.getElementById(
                "percentage"
            ).value =
                result.percentage
                    ? String(
                    result.percentage
                ).replace("%", "") + "%"
                    : "";


            document.getElementById(
                "grade"
            ).value =
                result.grade || "";


            document.getElementById(
                "status"
            ).value =
                result.status || "";


            document.getElementById(
                "modalTitle"
            ).innerHTML = `

                <i class="fa-solid fa-pen-to-square"></i>

                Edit Result

            `;


            document.getElementById(
                "saveButtonText"
            ).textContent =
                "Update Result";


            document.getElementById(
                "resultModal"
            ).classList.add("show");


        })

        .catch(error => {

            console.error(
                "Edit Error:",
                error
            );


            showErrorMessage(
                "Unable to load result."
            );

        });

}


// ============================================================
// LOAD SUBJECTS FOR EDIT
// ============================================================

function loadMappedSubjectsForEdit(result) {

    const subjectSelect =
        document.getElementById(
            "subject"
        );


    subjectSelect.innerHTML = `

        <option value="">
            Loading Subjects...
        </option>

    `;


    const url =
        "/api/course-subject-mappings/student" +
        "?courseName=" +
        encodeURIComponent(
            currentStudent.course
        ) +
        "&semester=" +
        encodeURIComponent(
            result.semester
        );


    fetch(url)

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to load subjects"
                );

            }

            return response.json();

        })

        .then(subjects => {

            currentSubjects =
                subjects || [];


            subjectSelect.innerHTML = `

                <option value="">
                    Select Subject
                </option>

            `;


            let matched = false;


            currentSubjects.forEach(
                subject => {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        subject.subjectName;


                    option.textContent =
                        subject.subjectName;


                    option.dataset.subjectCode =
                        subject.subjectCode || "";


                    option.dataset.subjectType =
                        subject.subjectType || "";


                    subjectSelect.appendChild(
                        option
                    );


                    if (

                        result.subject ===
                        subject.subjectName ||

                        result.subject ===
                        subject.subjectCode

                    ) {

                        option.selected =
                            true;

                        matched =
                            true;

                    }

                }
            );


            if (!matched && result.subject) {

                const oldOption =
                    document.createElement(
                        "option"
                    );


                oldOption.value =
                    result.subject;


                oldOption.textContent =
                    result.subject;


                oldOption.selected =
                    true;


                subjectSelect.appendChild(
                    oldOption
                );

            }


            subjectChanged();

        })

        .catch(error => {

            console.error(
                "Edit Subject Loading Error:",
                error
            );


            subjectSelect.innerHTML = "";

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                result.subject;


            option.textContent =
                result.subject;


            option.selected =
                true;


            subjectSelect.appendChild(
                option
            );

        });

}


// ============================================================
// DELETE RESULT
// ============================================================

function deleteResult(id) {

    Swal.fire({

        title:
            "Delete Result?",

        text:
            "This action cannot be undone.",

        icon:
            "warning",

        showCancelButton:
            true,

        confirmButtonColor:
            "#d33",

        cancelButtonColor:
            "#3085d6",

        confirmButtonText:
            "Delete",

        cancelButtonText:
            "Cancel"

    })

        .then(result => {

            if (!result.isConfirmed) {
                return;
            }


            fetch(
                "/results/" + id,
                {
                    method: "DELETE"
                }
            )

                .then(response => {

                    if (!response.ok) {

                        throw new Error(
                            "Unable to delete result"
                        );

                    }

                    return response.text();

                })

                .then(message => {

                    Swal.fire({

                        icon:
                            "success",

                        title:
                            "Deleted",

                        text:
                            message ||
                            "Result deleted successfully."

                    });


                    loadResults();

                })

                .catch(error => {

                    console.error(
                        "Delete Error:",
                        error
                    );


                    Swal.fire({

                        icon:
                            "error",

                        title:
                            "Error",

                        text:
                            "Unable to delete result."

                    });

                });

        });

}


// ============================================================
// CLEAR FORM
// ============================================================

function clearForm() {

    document
        .getElementById("resultForm")
        .reset();


    document.getElementById(
        "resultId"
    ).value = "";


    document.getElementById(
        "studentName"
    ).value = "";


    document.getElementById(
        "course"
    ).value = "";


    document.getElementById(
        "maxMarks"
    ).value = 100;


    document.getElementById(
        "percentage"
    ).value = "";


    document.getElementById(
        "grade"
    ).value = "";


    document.getElementById(
        "status"
    ).value = "";


    resetSubjectDropdown();

    resetSemesterDropdown();


    currentStudent =
        null;

    currentSubjects =
        [];

}


// ============================================================
// CLEAR STUDENT FIELDS
// ============================================================

function clearStudentFields() {

    document.getElementById(
        "studentName"
    ).value = "";


    document.getElementById(
        "course"
    ).value = "";


    resetSubjectDropdown();

    resetSemesterDropdown();

}


// ============================================================
// RESET SUBJECT
// ============================================================

function resetSubjectDropdown() {

    document.getElementById(
        "subject"
    ).innerHTML = `

        <option value="">
            Select Student First
        </option>

    `;

}


// ============================================================
// RESET SEMESTER
// ============================================================

function resetSemesterDropdown() {

    document.getElementById(
        "semester"
    ).innerHTML = `

        <option value="">
            Select Student First
        </option>

    `;

}


// ============================================================
// ERROR
// ============================================================

function showErrorMessage(message) {

    if (
        typeof Swal !== "undefined"
    ) {

        Swal.fire({

            icon:
                "error",

            title:
                "Error",

            text:
            message

        });

    }

    else {

        alert(message);

    }

}


// ============================================================
// INITIAL
// ============================================================

function getInitial(name) {

    if (!name) {
        return "?";
    }

    return String(name)
        .trim()
        .charAt(0)
        .toUpperCase();

}


// ============================================================
// SUBJECT DISPLAY
// ============================================================

function getSubjectDisplayNameSimple(subject) {

    if (!subject) {
        return "-";
    }


    const current =
        currentSubjects.find(
            item =>
                item.subjectName === subject ||
                item.subjectCode === subject
        );


    if (current) {

        return current.subjectName;

    }


    return subject;

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// ============================================================
// DASHBOARD
// ============================================================

function goDashboard() {

    const role =
        localStorage.getItem("role");


    if (role === "EMPLOYEE") {

        window.location.href =
            "employee-dashboard.html";

    }

    else {

        window.location.href =
            "dashboard.html";

    }

}


// ============================================================
// CLOSE MODAL OUTSIDE CLICK
// ============================================================

document.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "resultModal"
            );


        if (
            event.target === modal
        ) {

            closeResultModal();

        }

    }
);