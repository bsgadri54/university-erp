window.onload = function () {
    loadStudents();
};

    // ================= LOAD STUDENTS =================

    function loadStudents() {

        let enrollmentNo = localStorage.getItem("username");

        if (!enrollmentNo) {

            alert("Please Login Again");

            window.location.href = "login.html";

            return;

        }
        fetch("/students")
            .then(response => response.json())
            .then(data => {

                let rows = "";

                data.forEach(student => {

                    rows += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.enrollmentNo}</td>
                    <td>${student.name}</td>
                    <td>${student.email || ""}</td>
                    <td>${student.phone || ""}</td>
                    <td>${student.course || ""}</td>
                    <td>${student.semester || ""}</td>

                    <td>

                        <button class="btn-edit"
                        onclick="editStudent(
                            ${student.id},
                            '${student.enrollmentNo}',
                            '${student.name}',
                            '${student.email || ""}',
                            '${student.phone || ""}',
                            '${student.course || ""}',
                            '${student.semester || ""}'
                        )">
                            Edit
                        </button>

                        <button class="btn-delete"
                        onclick="deleteStudent(${student.id})">
                            Delete
                        </button>

                    </td>
                </tr>
                `;

                });

                document.getElementById("studentBody").innerHTML = rows;

            })
            .catch(err => console.log(err));

    }



    // ================= SAVE / UPDATE =================

    function saveStudent() {

        const id = document.getElementById("studentId").value;

        const student = {

        enrollmentNo: document.getElementById("enrollmentNo").value,

        name: document.getElementById("studentName").value,

        email: document.getElementById("email").value,

        phone: document.getElementById("phone").value,

        course: document.getElementById("course").value,

        semester: document.getElementById("semester").value

    };

        let url = "/students";
        let method = "POST";

        if (id !== "") {

        url = "/students/" + id;
        method = "PUT";

    }

        fetch(url, {

        method: method,

        headers: {
        "Content-Type": "application/json"
    },

        body: JSON.stringify(student)

    })

        .then(response => {

        if (!response.ok) {
        throw new Error("Save Failed");
    }

        return response.json();

    })

        .then(data => {

        alert("Student Saved Successfully");

        clearForm();

        loadStudents();

    })

        .catch(error => {

        console.error(error);

        alert("Unable to save student.");

    });

    }




    // ================= EDIT =================

    function editStudent(id,
    enrollmentNo,
    name,
    email,
    phone,
    course,
    semester) {

        document.getElementById("studentId").value = id;

        document.getElementById("enrollmentNo").value = enrollmentNo;

        document.getElementById("studentName").value = name;

        document.getElementById("email").value = email;

        document.getElementById("phone").value = phone;

        document.getElementById("course").value = course;

        document.getElementById("semester").value = semester;

    }



    // ================= DELETE =================

    function deleteStudent(id) {

        if (!confirm("Delete this student?")) {
        return;
    }

        fetch("/students/" + id, {

        method: "DELETE"

    })

        .then(response => response.text())

        .then(msg => {

        alert(msg);

        loadStudents();


    })

        .catch(error => {

        console.log(error);

        alert("Delete Failed");

    });

    }



    // ================= SEARCH =================

    function searchStudent() {

        let filter =
        document.getElementById("searchStudent")
        .value
        .toUpperCase();

        let tr =
        document.getElementById("studentBody")
        .getElementsByTagName("tr");

        for (let i = 0; i < tr.length; i++) {

        let txt = tr[i].textContent || tr[i].innerText;

        tr[i].style.display =
        txt.toUpperCase().indexOf(filter) > -1
        ? ""
        : "none";

    }

    }



    // ================= CLEAR =================

    function clearForm() {

        document.getElementById("studentId").value = "";

        document.getElementById("enrollmentNo").value = "";

        document.getElementById("studentName").value = "";

        document.getElementById("email").value = "";

        document.getElementById("phone").value = "";

        document.getElementById("course").selectedIndex = 0;

        document.getElementById("semester").selectedIndex = 0;

    }
