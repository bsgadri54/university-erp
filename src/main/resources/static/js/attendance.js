<script>

    loadAttendance();

    function saveAttendance(){

    let attendance={

    personType:
    document.getElementById("personType").value,

    personName:
    document.getElementById("personName").value,

    attendanceDate:
    document.getElementById("attendanceDate").value,

    status:
    document.getElementById("status").value

};

    fetch("/attendance",{

    method:"POST",

    headers:{
    "Content-Type":"application/json"
},

    body:JSON.stringify(attendance)

})
    .then(()=>{

    alert("Attendance Saved");

    loadAttendance();

    clearForm();

});

}

    function loadAttendance(){

    fetch("/attendance")
        .then(res=>res.json())
        .then(data=>{

            let rows="";

            data.forEach(a=>{

                rows+=`
            <tr>

                <td>${a.id}</td>
                <td>${a.personType}</td>
                <td>${a.personName}</td>
                <td>${a.attendanceDate}</td>
                <td>${a.status}</td>

                <td>

                    <button class="delete-btn"
                    onclick="deleteAttendance(${a.id})">
                    Delete
                    </button>

                </td>

            </tr>
            `;

            });

            document.getElementById("attendanceTable")
                .innerHTML=rows;

        });

}

    function deleteAttendance(id){

    if(confirm("Delete Attendance?")){

    fetch("/attendance/"+id,{

    method:"DELETE"

})
    .then(()=>{

    loadAttendance();

});

}

}

    function clearForm(){

    document.getElementById("personName").value="";

    document.getElementById("attendanceDate").value="";

}

</script>
