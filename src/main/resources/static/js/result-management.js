// =============================================
// Result Management
// =============================================

window.onload = function () {

    loadResults();

    document.getElementById("marks")
        .addEventListener("input", calculateResult);

    document.getElementById("subject")
        .addEventListener("change", calculateMaximumMarks);

    document.getElementById("search")
        .addEventListener("keyup", loadResults);

    document.getElementById("resultForm")
        .addEventListener("submit", saveResult);

};

// =============================================
// Maximum Marks
// =============================================

function calculateMaximumMarks() {

    let subject = document.getElementById("subject").value;

    let max = 100;

    if (subject.toUpperCase().includes("LAB") ||
        subject.toUpperCase().includes("PRACTICAL")) {

        max = 50;

    }

    document.getElementById("maxMarks").value = max;

    calculateResult();

}

// =============================================
// Percentage / Grade / Status
// =============================================

function calculateResult() {

    let marks = Number(document.getElementById("marks").value);

    let max = Number(document.getElementById("maxMarks").value);

    if (!marks) {

        document.getElementById("percentage").value = "";
        document.getElementById("grade").value = "";
        document.getElementById("status").value = "";

        return;

    }

    let percentage = (marks / max) * 100;

    document.getElementById("percentage").value =
        percentage.toFixed(2) + "%";

    let grade = "";

    if (percentage >= 90)
        grade = "A+";
    else if (percentage >= 80)
        grade = "A";
    else if (percentage >= 70)
        grade = "B";
    else if (percentage >= 60)
        grade = "C";
    else if (percentage >= 40)
        grade = "D";
    else
        grade = "F";

    document.getElementById("grade").value = grade;

    document.getElementById("status").value =
        percentage >= 40 ? "PASS" : "FAIL";

}

// =============================================
// Load Results
// =============================================

function loadResults() {

    let keyword = document.getElementById("search").value.toLowerCase();

    fetch("/results")
        .then(res => res.json())
        .then(results => {

            let rows = "";

            results.forEach(result => {

                if (keyword !== "" &&
                    !result.enrollmentNo.toLowerCase().includes(keyword))
                    return;

                let badge =
                    result.status === "PASS"
                        ? "pass"
                        : "fail";

                rows += `
<tr>

<td>${result.id}</td>

<td>${result.enrollmentNo}</td>

<td>${result.studentName}</td>

<td>${result.subject}</td>

<td>${result.marks}</td>

<td>${result.maxMarks}</td>

<td>${result.percentage}%</td>

<td>${result.grade}</td>

<td>
<span class="${badge}">
${result.status}
</span>
</td>

<td>${result.semester}</td>

<td>

<button
class="edit-btn"
onclick="editResult(${result.id})">

<i class="fas fa-edit"></i>

</button>

<button
class="delete-btn"
onclick="deleteResult(${result.id})">

<i class="fas fa-trash"></i>

</button>

</td>

</tr>`;

            });

            document.getElementById("resultTable").innerHTML = rows;

        });

}

// =============================================
// Save / Update
// =============================================

function saveResult(e) {

    e.preventDefault();

    let id = document.getElementById("resultId").value;

    let result = {

        enrollmentNo:
        document.getElementById("enrollmentNo").value,

        studentName:
        document.getElementById("studentName").value,

        course:
        document.getElementById("course").value,

        subject:
        document.getElementById("subject").value,

        semester:
        document.getElementById("semester").value,

        marks:
        document.getElementById("marks").value,

        maxMarks:
        document.getElementById("maxMarks").value,

        percentage:
            document.getElementById("percentage").value.replace("%",""),

        grade:
        document.getElementById("grade").value,

        status:
        document.getElementById("status").value

    };

    let url = "/results";

    let method = "POST";

    if(id!=""){

        url="/results/"+id;

        method="PUT";

    }

    fetch(url,{

        method:method,

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(result)

    })

        .then(res=>{

            if(!res.ok)
                throw new Error();

            return res.text();

        })

        .then(msg=>{

            Swal.fire({

                icon:"success",

                title:"Success",

                text:msg

            });

            document.getElementById("resultForm").reset();

            document.getElementById("resultId").value="";

            loadResults();

        })

        .catch(()=>{

            Swal.fire(

                "Error",

                "Unable to save result",

                "error"

            );

        });

}

// =============================================
// Edit
// =============================================

function editResult(id){

    fetch("/results/"+id)

        .then(res=>res.json())

        .then(result=>{

            document.getElementById("resultId").value=result.id;

            document.getElementById("enrollmentNo").value=result.enrollmentNo;

            document.getElementById("studentName").value=result.studentName;

            document.getElementById("course").value=result.course;

            document.getElementById("subject").value=result.subject;

            document.getElementById("semester").value=result.semester;

            document.getElementById("marks").value=result.marks;

            document.getElementById("maxMarks").value=result.maxMarks;

            calculateResult();

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        });

}

// =============================================
// Delete
// =============================================

function deleteResult(id){

    Swal.fire({

        title:"Delete Result?",

        text:"This action cannot be undone.",

        icon:"warning",

        showCancelButton:true,

        confirmButtonColor:"#d33",

        confirmButtonText:"Delete"

    })

        .then((result)=>{

            if(result.isConfirmed){

                fetch("/results/"+id,{

                    method:"DELETE"

                })

                    .then(res=>{

                        if(!res.ok)
                            throw new Error();

                        return res.text();

                    })

                    .then(msg=>{

                        Swal.fire(

                            "Deleted",

                            msg,

                            "success"

                        );

                        loadResults();

                    })

                    .catch(()=>{

                        Swal.fire(

                            "Error",

                            "Unable to delete result",

                            "error"

                        );

                    });

            }

        });

}