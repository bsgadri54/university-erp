<script>

    window.onload = loadResults;

    function loadResults(){

    let search =
    document.getElementById("search")
    .value
    .toLowerCase();

    fetch("https://university-erp-1-gac1.onrender.com/results")

    .then(response => response.json())

    .then(data => {

    let rows = "";

    let totalResults = 0;
    let passCount = 0;
    let failCount = 0;

    data.forEach(result => {

    if(
    search !== "" &&
    !result.enrollmentNo
    .toLowerCase()
    .includes(search)
    ){
    return;
}

    totalResults++;

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

    let status =
    result.marks >= passMarks
    ? "PASS"
    : "FAIL";

    if(status === "PASS"){
    passCount++;
}else{
    failCount++;
}

    rows += `
                <tr>

                    <td>${result.id}</td>

                    <td>${result.enrollmentNo}</td>

                    <td>${result.subject}</td>

                    <td>${result.marks}</td>

                    <td>${maxMarks}</td>

                    <td class="${
    status === "PASS"
    ? "pass"
    : "fail"
}">
                        ${status}
                    </td>

                    <td>${result.semester}</td>

                    <td>

                        <button
                            class="edit-btn"
                            onclick="editResult(
                                ${result.id},
                                ${result.marks}
                            )">

                            Edit

                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteResult(
                                ${result.id}
                            )">

                            Delete

                        </button>

                    </td>

                </tr>
                `;
});

    document.getElementById(
    "resultTable"
    ).innerHTML = rows;

    document.getElementById(
    "totalResults"
    ).innerHTML = totalResults;

    document.getElementById(
    "passCount"
    ).innerHTML = passCount;

    document.getElementById(
    "failCount"
    ).innerHTML = failCount;
})

    .catch(error => {

    console.error(error);

    alert(
    "Error Loading Results"
    );

});
}

    /* =========================
    Edit Result
    ========================= */

    function editResult(
    id,
    currentMarks
    ){

    let newMarks =
    prompt(
    "Enter New Marks",
    currentMarks
    );

    if(
    newMarks === null ||
    newMarks === ""
    ){
    return;
}

    fetch(
    "https://university-erp-1-gac1.onrender.com/results/" + id,
{
    method:"PUT",

    headers:{
    "Content-Type":"application/json"
},

    body:JSON.stringify({
    marks:newMarks
})
}
    )

    .then(response => {

    if(!response.ok){
    throw new Error(
    "Update Failed"
    );
}

    return response.text();
})

    .then(message => {

    alert(
    message ||
    "Marks Updated Successfully"
    );

    loadResults();

})

    .catch(error => {

    console.error(error);

    alert(
    "Unable To Update Marks"
    );

});
}

    /* =========================
    Delete Result
    ========================= */

    function deleteResult(id){

    if(
    !confirm(
    "Are you sure you want to delete this result?"
    )
    ){
    return;
}

    fetch(
    "https://university-erp-1-gac1.onrender.com/results/" + id,
{
    method:"DELETE"
}
    )

    .then(response => {

    if(!response.ok){
    throw new Error(
    "Delete Failed"
    );
}

    return response.text();
})

    .then(message => {

    alert(
    message ||
    "Result Deleted Successfully"
    );

    loadResults();

})

    .catch(error => {

    console.error(error);

    alert(
    "Unable To Delete Result"
    );

});
}

</script>
