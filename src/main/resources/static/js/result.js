<script>

    window.onload = loadResults;

    /* =========================
    Grade Calculation
    ========================= */

    function getGrade(marks,maxMarks){

    let percentage =
    (marks/maxMarks)*100;

    if(percentage >= 90) return "A+";
    if(percentage >= 80) return "A";
    if(percentage >= 70) return "B+";
    if(percentage >= 60) return "B";
    if(percentage >= 50) return "C";
    if(percentage >= 40) return "D";

    return "F";
}

    /* =========================
    Grade Point
    ========================= */

    function getGradePoint(grade){

    switch(grade){

    case "A+": return 10;
    case "A": return 9;
    case "B+": return 8;
    case "B": return 7;
    case "C": return 6;
    case "D": return 5;

    default:
    return 0;
}
}

    /* =========================
    Load Results
    ========================= */

    function loadResults(){

    const enrollmentNo =
    localStorage.getItem("username");

    if(!enrollmentNo){

    alert("Please Login Again");

    window.location.href =
    "login.html";

    return;
}

    fetch("https://university-erp-1-gac1.onrender.com/results")

    .then(response => response.json())

    .then(results => {

    let rows = "";

    let totalSubjects = 0;
    let totalMarks = 0;
    let maximumMarks = 0;

    let totalGradePoints = 0;

    let isFail = false;

    let semester = "";

    let srNo = 1;

    results.forEach(result => {

    if(
    result.enrollmentNo &&
    result.enrollmentNo.trim() ===
    enrollmentNo.trim()
    ){

    totalSubjects++;

    semester =
    result.semester;

    let maxMarks = 100;
    let passMarks = 40;

    if(
    result.subject.includes("LAB") ||
    result.subject ===
    "Practical Training 45 Days"
    ){
    maxMarks = 50;
    passMarks = 20;
}

    totalMarks +=
    Number(result.marks);

    maximumMarks +=
    maxMarks;

    let grade =
    getGrade(
    result.marks,
    maxMarks
    );

    totalGradePoints +=
    getGradePoint(grade);

    let status =
    result.marks >= passMarks
    ? "PASS"
    : "FAIL";

    if(status === "FAIL"){
    isFail = true;
}

    rows += `
                    <tr class="${
    status === "FAIL"
    ? "fail-row"
    : ""
}">

                        <td>${srNo++}</td>

                        <td>${result.subject}</td>

                        <td>${result.marks}</td>

                        <td>${maxMarks}</td>

                        <td>${grade}</td>

                        <td class="${
    status === "PASS"
    ? "pass"
    : "fail"
}">
                            ${status}
                        </td>

                    </tr>
                    `;
}
});

    document.getElementById(
    "resultBody"
    ).innerHTML = rows;

    document.getElementById(
    "totalSubjects"
    ).innerHTML =
    totalSubjects;

    document.getElementById(
    "totalMarks"
    ).innerHTML =
    totalMarks;

    document.getElementById(
    "maximumMarks"
    ).innerHTML =
    maximumMarks;

    /* Percentage */

    let percentage = 0;

    if(maximumMarks > 0){

    percentage =
    (
    totalMarks /
    maximumMarks
    ) * 100;
}

    document.getElementById(
    "percentage"
    ).innerHTML =
    percentage.toFixed(2) + "%";

    /* SGPA */

    let sgpa = 0;

    if(totalSubjects > 0){

    sgpa =
    totalGradePoints /
    totalSubjects;
}

    document.getElementById(
    "sgpa"
    ).innerHTML =
    sgpa.toFixed(2);

    /* CGPA */

    document.getElementById(
    "cgpa"
    ).innerHTML =
    sgpa.toFixed(2);

    /* Overall Grade */

    let overallGrade = "F";

    if(percentage >= 90)
    overallGrade = "A+";

    else if(percentage >= 80)
    overallGrade = "A";

    else if(percentage >= 70)
    overallGrade = "B+";

    else if(percentage >= 60)
    overallGrade = "B";

    else if(percentage >= 50)
    overallGrade = "C";

    else if(percentage >= 40)
    overallGrade = "D";

    document.getElementById(
    "overallGrade"
    ).innerHTML =
    overallGrade;

    /* Division */

    let division = "";

    if(percentage >= 75){

    division =
    "DISTINCTION";
}
    else if(percentage >= 60){

    division =
    "FIRST CLASS";
}
    else if(percentage >= 50){

    division =
    "SECOND CLASS";
}
    else{

    division =
    "PASS CLASS";
}

    document.getElementById(
    "division"
    ).innerHTML =
    division;

    /* Final Result */

    let finalResult =
    document.getElementById(
    "finalResult"
    );

    if(isFail){

    finalResult.innerHTML =
    "❌ FAIL";

    finalResult.style.color =
    "#ff4d4d";
}
    else{

    finalResult.innerHTML =
    "✅ PASS";

    finalResult.style.color =
    "#00ff88";
}

    loadStudentInfo(
    enrollmentNo,
    semester
    );

})

    .catch(error => {

    console.error(
    "Error Loading Results:",
    error
    );

});
}

    /* =========================
    Student Information
    ========================= */

    function loadStudentInfo(
    enrollmentNo,
    semester
    ){

    fetch(
        "https://university-erp-1-gac1.onrender.com/students"
    )

        .then(response => response.json())

        .then(students => {

            let student =
                students.find(
                    s =>
                        s.enrollmentNo ===
                        enrollmentNo
                );

            if(student){

                document.getElementById(
                    "studentName"
                ).innerHTML =
                    student.name;

                document.getElementById(
                    "enrollmentNo"
                ).innerHTML =
                    student.enrollmentNo;

                document.getElementById(
                    "semester"
                ).innerHTML =
                    student.semester;

                document.getElementById(
                    "courseName"
                ).innerHTML =
                    student.course;

                if(student.photo){

                    document.getElementById(
                        "studentPhoto"
                    ).src =
                        student.photo;
                }
            }

        });
}

    /* =========================
    Print
    ========================= */

    function printMarksheet(){

    window.print();
}

    /* =========================
    Download PDF
    ========================= */

    function downloadPDF(){

    const element =
    document.getElementById(
    "marksheet"
    );

    html2pdf()

    .set({

    margin:0.5,

    filename:
    'Student_Marksheet.pdf',

    image:{
    type:'jpeg',
    quality:1
},

    html2canvas:{
    scale:2
},

    jsPDF:{
    unit:'in',
    format:'a4',
    orientation:'portrait'
}

})

    .from(element)

    .save();
}

</script>
