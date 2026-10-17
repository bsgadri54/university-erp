let subjects = [];

let editMode = false;


// ===============================
// LOAD SUBJECTS
// ===============================

function loadSubjects() {

    fetch("/api/subjects")

        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load subjects");
            }

            return response.json();

        })

        .then(data => {

            subjects = data;

            displaySubjects(subjects);

            updateStatistics();

        })

        .catch(error => {

            console.error(error);

            alert("Unable to load subjects.");

        });
}


// ===============================
// DISPLAY SUBJECTS
// ===============================

function displaySubjects(data) {

    const table =
        document.getElementById("subjectTable");

    table.innerHTML = "";


    if (data.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="8"
                    class="empty">

                    <i class="fas fa-book-open"></i>

                    <br>

                    No subjects found

                </td>

            </tr>

        `;

        return;
    }


    data.forEach((subject, index) => {

        table.innerHTML += `

            <tr>

                <td>${index + 1}</td>

                <td>

                    <span class="code">

                        ${subject.subjectCode || ""}

                    </span>

                </td>

                <td>

                    <strong>

                        ${subject.subjectName || ""}

                    </strong>

                </td>

                <td>

                    ${subject.subjectType || "-"}

                </td>

                <td>

                    ${subject.credits ?? 0}

                </td>

                <td>

                    ${subject.department || "-"}

                </td>

                <td>

                    <span class="status ${

            subject.status === "Active"

                ? "active"

                : "inactive"

        }">

                        ${subject.status || "Inactive"}

                    </span>

                </td>

                <td>

                    <div class="actions">

                        <button
                            class="edit"
                            onclick="editSubject(${subject.id})">

                            <i class="fas fa-edit"></i>

                        </button>

                        <button
                            class="delete"
                            onclick="deleteSubject(${subject.id})">

                            <i class="fas fa-trash"></i>

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });
}


// ===============================
// STATISTICS
// ===============================

function updateStatistics() {

    document.getElementById("totalSubjects")
        .textContent = subjects.length;


    document.getElementById("activeSubjects")
        .textContent =
        subjects.filter(
            s => s.status === "Active"
        ).length;


    document.getElementById("coreSubjects")
        .textContent =
        subjects.filter(
            s => s.subjectType === "Core"
        ).length;


    const credits =
        subjects.reduce(
            (total, s) =>
                total + (Number(s.credits) || 0),
            0
        );


    document.getElementById("totalCredits")
        .textContent = credits;
}


// ===============================
// OPEN MODAL
// ===============================

function openSubjectModal() {

    editMode = false;

    document.getElementById("modalTitle")
        .textContent = "Add Subject";

    document.getElementById("subjectForm")
        .reset();

    document.getElementById("subjectId")
        .value = "";

    document.getElementById("subjectModal")
        .classList.add("show");
}


// ===============================
// CLOSE MODAL
// ===============================

function closeSubjectModal() {

    document.getElementById("subjectModal")
        .classList.remove("show");
}


// ===============================
// SAVE SUBJECT
// ===============================

document.getElementById("subjectForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const id =
            document.getElementById("subjectId")
                .value;


        const subject = {

            subjectCode:
                document.getElementById("subjectCode")
                    .value.trim(),

            subjectName:
                document.getElementById("subjectName")
                    .value.trim(),

            subjectType:
            document.getElementById("subjectType")
                .value,

            credits:
                Number(
                    document.getElementById("credits")
                        .value
                ),

            department:
                document.getElementById("department")
                    .value.trim(),

            status:
            document.getElementById("status")
                .value
        };


        const url =
            id
                ? `/api/subjects/${id}`
                : "/api/subjects";


        const method =
            id
                ? "PUT"
                : "POST";


        fetch(url, {

            method: method,

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify(subject)

        })

            .then(response => {

                if (!response.ok) {

                    return response.text()
                        .then(message => {

                            throw new Error(message);

                        });

                }

                return response.json();

            })

            .then(() => {

                alert(
                    id
                        ? "Subject updated successfully!"
                        : "Subject added successfully!"
                );

                closeSubjectModal();

                loadSubjects();

            })

            .catch(error => {

                console.error(error);

                alert(
                    "Error: " + error.message
                );

            });

    });


// ===============================
// EDIT SUBJECT
// ===============================

function editSubject(id) {

    const subject =
        subjects.find(
            s => s.id === id
        );


    if (!subject) return;


    editMode = true;


    document.getElementById("modalTitle")
        .textContent = "Edit Subject";


    document.getElementById("subjectId")
        .value = subject.id;


    document.getElementById("subjectCode")
        .value = subject.subjectCode || "";


    document.getElementById("subjectName")
        .value = subject.subjectName || "";


    document.getElementById("subjectType")
        .value = subject.subjectType || "Core";


    document.getElementById("credits")
        .value = subject.credits ?? "";


    document.getElementById("department")
        .value = subject.department || "";


    document.getElementById("status")
        .value = subject.status || "Active";


    document.getElementById("subjectModal")
        .classList.add("show");
}


// ===============================
// DELETE SUBJECT
// ===============================

function deleteSubject(id) {

    const subject =
        subjects.find(
            s => s.id === id
        );


    if (!subject) return;


    const confirmDelete =
        confirm(
            `Delete "${subject.subjectName}"?`
        );


    if (!confirmDelete) return;


    fetch(`/api/subjects/${id}`, {

        method: "DELETE"

    })

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to delete subject"
                );

            }

            return response.text();

        })

        .then(() => {

            alert(
                "Subject deleted successfully!"
            );

            loadSubjects();

        })

        .catch(error => {

            console.error(error);

            alert(error.message);

        });
}


// ===============================
// SEARCH
// ===============================

function searchSubjects() {

    const keyword =
        document.getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const filtered =
        subjects.filter(subject =>

            (subject.subjectCode || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (subject.subjectName || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (subject.subjectType || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (subject.department || "")
                .toLowerCase()
                .includes(keyword)

        );


    displaySubjects(filtered);
}


// ===============================
// START
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    loadSubjects
);