/* ==========================================
   UNIVERSITY ERP - FEE MANAGEMENT
========================================== */


/* ==========================================
   GLOBAL DATA
========================================== */

let allFees = [];
let allStudents = [];


/* ==========================================
   PAGE LOAD
========================================== */

document.addEventListener("DOMContentLoaded", async function () {

    try {

        await Promise.all([
            loadStudents(),
            loadFees()
        ]);

        setTodayDate();

    } catch (error) {

        console.error(
            "Page initialization error:",
            error
        );

    }


    /* ======================================
       CLOSE MODAL WITH ESC KEY
    ====================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            closeFeeModal();

        }

    });


    /* ======================================
       CLOSE MODAL WHEN CLICKING OVERLAY
    ====================================== */

    const modal =
        document.getElementById("feeModal");

    if (modal) {

        modal.addEventListener("click", function (event) {

            if (event.target === modal) {

                closeFeeModal();

            }

        });

    }

});


/* ==========================================
   SET TODAY'S DATE
========================================== */

function setTodayDate() {

    const paymentDate =
        document.getElementById("paymentDate");

    if (!paymentDate) return;


    if (!paymentDate.value) {

        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        paymentDate.value =
            `${year}-${month}-${day}`;

    }

}


/* ==========================================
   LOAD STUDENTS
========================================== */

async function loadStudents() {

    try {

        const response =
            await fetch("/students");


        if (!response.ok) {

            throw new Error(
                "Unable to load students"
            );

        }


        allStudents =
            await response.json();


        if (!Array.isArray(allStudents)) {

            allStudents = [];

        }


        populateStudentList();


    } catch (error) {

        console.error(
            "Error loading students:",
            error
        );


        allStudents = [];


        showMessage(
            "Unable to load student details.",
            "error"
        );

    }

}


/* ==========================================
   POPULATE STUDENT DATALIST
========================================== */

function populateStudentList() {

    const list =
        document.getElementById(
            "studentList"
        );


    if (!list) return;


    list.innerHTML = "";


    allStudents.forEach(student => {

        const option =
            document.createElement("option");


        option.value =
            student.enrollmentNo || "";


        option.label =
            `${student.name || ""} | ${student.course || ""} | ${student.semester || ""}`;


        list.appendChild(option);

    });

}


/* ==========================================
   FIND STUDENT
========================================== */

function findStudent() {

    const searchInput =
        document.getElementById(
            "studentSearch"
        );


    if (!searchInput) return;


    const value =
        searchInput.value
            .trim()
            .toLowerCase();


    /* ======================================
       EMPTY SEARCH
    ====================================== */

    if (!value) {

        clearStudentDetails();

        return;

    }


    /* ======================================
       FIND STUDENT
    ====================================== */

    const student =
        allStudents.find(s => {

            const enrollment =
                String(
                    s.enrollmentNo || ""
                ).toLowerCase();


            const name =
                String(
                    s.name || ""
                ).toLowerCase();


            return (
                enrollment === value ||
                name === value
            );

        });


    /* ======================================
       EXACT MATCH NOT FOUND
    ====================================== */

    if (!student) {

        /*

        Also allow partial matching.

        This makes searching easier when
        user enters only part of enrollment
        number or name.

        */

        const partialStudent =
            allStudents.find(s => {

                const enrollment =
                    String(
                        s.enrollmentNo || ""
                    ).toLowerCase();


                const name =
                    String(
                        s.name || ""
                    ).toLowerCase();


                return (
                    enrollment.includes(value) ||
                    name.includes(value)
                );

            });


        if (!partialStudent) {

            clearStudentDetails();

            return;

        }


        fillStudentDetails(
            partialStudent
        );

        return;

    }


    /* ======================================
       AUTO FILL
    ====================================== */

    fillStudentDetails(student);

}


/* ==========================================
   FILL STUDENT DETAILS
========================================== */

function fillStudentDetails(student) {

    const enrollment =
        document.getElementById(
            "enrollmentNo"
        );


    const studentName =
        document.getElementById(
            "studentName"
        );


    const course =
        document.getElementById(
            "course"
        );


    const semester =
        document.getElementById(
            "semester"
        );


    if (enrollment) {

        enrollment.value =
            student.enrollmentNo || "";

    }


    if (studentName) {

        studentName.value =
            student.name || "";

    }


    if (course) {

        course.value =
            student.course || "";

    }


    if (semester) {

        semester.value =
            student.semester || "";

    }

}


/* ==========================================
   CLEAR STUDENT DETAILS
========================================== */

function clearStudentDetails() {

    const enrollment =
        document.getElementById(
            "enrollmentNo"
        );


    const studentName =
        document.getElementById(
            "studentName"
        );


    const course =
        document.getElementById(
            "course"
        );


    const semester =
        document.getElementById(
            "semester"
        );


    if (enrollment) {

        enrollment.value = "";

    }


    if (studentName) {

        studentName.value = "";

    }


    if (course) {

        course.value = "";

    }


    if (semester) {

        semester.value = "";

    }

}


/* ==========================================
   LOAD ALL FEES
========================================== */

async function loadFees() {

    try {

        const response =
            await fetch("/fees");


        if (!response.ok) {

            throw new Error(
                "Unable to load fee records"
            );

        }


        const data =
            await response.json();


        allFees =
            Array.isArray(data)
                ? data
                : [];


        /* ==================================
           UPDATE DASHBOARD STATISTICS
        ================================== */

        updateFeeStatistics();


        /* ==================================
           UPDATE SEMESTER FILTER
        ================================== */

        populateSemesterFilter();


        /* ==================================
           DISPLAY TABLE
        ================================== */

        applyFeeFilters();


    } catch (error) {

        console.error(
            "Error loading fees:",
            error
        );


        allFees = [];


        updateFeeStatistics();


        const table =
            document.getElementById(
                "feeTable"
            );


        if (table) {

            table.innerHTML = `
                <tr>
                    <td colspan="12"
                        style="
                            text-align:center;
                            color:#dc3545;
                            padding:25px;
                        ">
                        Unable to load fee records.
                    </td>
                </tr>
            `;

        }

    }

}


/* ==========================================
   DISPLAY FEES
========================================== */

function displayFees(fees) {

    const table =
        document.getElementById(
            "feeTable"
        );


    if (!table) return;


    table.innerHTML = "";


    /* ======================================
       NO RECORDS
    ====================================== */

    if (!fees || fees.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="12"
                    style="
                        text-align:center;
                        padding:25px;
                        color:#777;
                    ">
                    No fee records found.
                </td>
            </tr>
        `;

        return;

    }


    /* ======================================
       CREATE ROWS
    ====================================== */

    fees.forEach((fee, index) => {

        const row =
            document.createElement("tr");


        const status =
            String(
                fee.paymentStatus || "PENDING"
            ).toUpperCase();


        let statusClass =
            "status-pending";


        if (status === "PAID") {

            statusClass =
                "status-paid";

        }

        else if (status === "PARTIAL") {

            statusClass =
                "status-partial";

        }


        /* ==================================
           STUDENT INITIAL
        ================================== */

        const studentName =
            fee.studentName || "";


        const initial =
            studentName
                .charAt(0)
                .toUpperCase() || "?";


        /* ==================================
           TABLE ROW
        ================================== */

        row.innerHTML = `

            <!-- NUMBER -->

            <td>
                ${index + 1}
            </td>


            <!-- ENROLLMENT -->

            <td>

                <span class="enrollment">

                    ${escapeHtml(
            fee.enrollmentNo ?? ""
        )}

                </span>

            </td>


            <!-- STUDENT -->

            <td>

                <div class="student-cell">

                    <div class="student-avatar">

                        ${escapeHtml(initial)}

                    </div>


                    <span class="student-name">

                        ${escapeHtml(
            studentName
        )}

                    </span>

                </div>

            </td>


            <!-- COURSE -->

            <td>

                ${escapeHtml(
            fee.course ?? ""
        )}

            </td>


            <!-- SEMESTER -->

            <td>

                ${escapeHtml(
            fee.semester ?? ""
        )}

            </td>


            <!-- TOTAL FEE -->

            <td>

                ₹${formatAmount(
            fee.totalFee
        )}

            </td>


            <!-- PAID -->

            <td>

                ₹${formatAmount(
            fee.paidAmount
        )}

            </td>


            <!-- REMAINING -->

            <td>

                ₹${formatAmount(
            fee.remainingAmount
        )}

            </td>


            <!-- PAYMENT DATE -->

            <td>

                ${formatDate(
            fee.paymentDate
        )}

            </td>


            <!-- PAYMENT MODE -->

            <td>

                ${escapeHtml(
            fee.paymentMode ?? "-"
        )}

            </td>


            <!-- STATUS -->

            <td>

                <span class="${statusClass}">

                    ${status}

                </span>

            </td>


            <!-- ACTION -->

            <td>

                <div class="action-buttons">

                    <button
                        type="button"
                        class="edit-btn"
                        onclick="editFee(${Number(fee.id)})"
                        title="Edit Fee">

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        type="button"
                        class="delete-btn"
                        onclick="deleteFee(${Number(fee.id)})"
                        title="Delete Fee">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        `;


        table.appendChild(row);

    });

}


/* ==========================================
   SAVE / UPDATE FEE
========================================== */

async function saveFee() {

    /* ======================================
       GET FORM VALUES
    ====================================== */

    const id =
        document.getElementById(
            "feeId"
        ).value;


    const enrollmentNo =
        document.getElementById(
            "enrollmentNo"
        ).value.trim();


    const studentName =
        document.getElementById(
            "studentName"
        ).value.trim();


    const course =
        document.getElementById(
            "course"
        ).value.trim();


    const semester =
        document.getElementById(
            "semester"
        ).value.trim();


    const totalFee =
        parseFloat(
            document.getElementById(
                "totalFee"
            ).value
        );


    const paidAmount =
        parseFloat(
            document.getElementById(
                "paidAmount"
            ).value
        );


    const remainingAmount =
        parseFloat(
            document.getElementById(
                "remainingAmount"
            ).value
        );


    const paymentDate =
        document.getElementById(
            "paymentDate"
        ).value;


    const paymentMode =
        document.getElementById(
            "paymentMode"
        ).value;


    let paymentStatus =
        document.getElementById(
            "paymentStatus"
        ).value;


    /* ======================================
       VALIDATION
    ====================================== */

    if (!enrollmentNo) {

        showMessage(
            "Please select a student.",
            "warning"
        );

        return;

    }


    if (!studentName) {

        showMessage(
            "Student details not found.",
            "warning"
        );

        return;

    }


    if (!course) {

        showMessage(
            "Student course not found.",
            "warning"
        );

        return;

    }


    if (!semester) {

        showMessage(
            "Student semester not found.",
            "warning"
        );

        return;

    }


    if (
        isNaN(totalFee) ||
        totalFee <= 0
    ) {

        showMessage(
            "Please enter a valid Total Fee.",
            "warning"
        );

        return;

    }


    if (
        isNaN(paidAmount) ||
        paidAmount < 0
    ) {

        showMessage(
            "Please enter a valid Paid Amount.",
            "warning"
        );

        return;

    }


    if (paidAmount > totalFee) {

        showMessage(
            "Paid Amount cannot be greater than Total Fee.",
            "warning"
        );

        return;

    }


    /* ======================================
       CALCULATE REMAINING
    ====================================== */

    const calculatedRemaining =
        Math.max(
            totalFee - paidAmount,
            0
        );


    /* ======================================
       AUTOMATIC STATUS
    ====================================== */

    if (paidAmount === totalFee) {

        paymentStatus = "PAID";

    }

    else if (
        paidAmount > 0 &&
        paidAmount < totalFee
    ) {

        paymentStatus = "PARTIAL";

    }

    else {

        paymentStatus = "PENDING";

    }


    /* ======================================
       UPDATE FORM VALUES
    ====================================== */

    const remainingInput =
        document.getElementById(
            "remainingAmount"
        );


    if (remainingInput) {

        remainingInput.value =
            calculatedRemaining.toFixed(2);

    }


    const statusInput =
        document.getElementById(
            "paymentStatus"
        );


    if (statusInput) {

        statusInput.value =
            paymentStatus;

    }


    /* ======================================
       FEE OBJECT
    ====================================== */

    const fee = {

        enrollmentNo:
        enrollmentNo,

        studentName:
        studentName,

        course:
        course,

        semester:
        semester,

        totalFee:
        totalFee,

        paidAmount:
        paidAmount,

        remainingAmount:
        calculatedRemaining,

        paymentDate:
            paymentDate || null,

        paymentMode:
            paymentMode || null,

        paymentStatus:
        paymentStatus

    };


    /* ======================================
       DISABLE SAVE BUTTON
    ====================================== */

    const saveButton =
        document.querySelector(
            ".modal-footer .btn-save"
        );


    if (saveButton) {

        saveButton.disabled = true;

        saveButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Saving...
        `;

    }


    try {

        let response;


        /* ==================================
           UPDATE EXISTING
        ================================== */

        if (id) {

            response =
                await fetch(
                    `/fees/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(fee)

                    }
                );

        }


        /* ==================================
           ADD NEW
        ================================== */

        else {

            response =
                await fetch(
                    "/fees",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(fee)

                    }
                );

        }


        /* ==================================
           RESPONSE CHECK
        ================================== */

        if (!response.ok) {

            let errorMessage =
                "Unable to save fee record.";


            try {

                const errorText =
                    await response.text();


                if (errorText) {

                    errorMessage =
                        errorText;

                }

            } catch (e) {

                console.error(e);

            }


            throw new Error(
                errorMessage
            );

        }


        /* ==================================
           SUCCESS
        ================================== */

        showMessage(
            id
                ? "Fee updated successfully!"
                : "Fee saved successfully!",
            "success"
        );


        /* ==================================
           CLEAR + CLOSE
        ================================== */

        clearFeeForm();

        closeFeeModal();


        /* ==================================
           RELOAD TABLE
        ================================== */

        await loadFees();


    } catch (error) {

        console.error(
            "Error saving fee:",
            error
        );


        showMessage(
            "Error saving fee: " +
            error.message,
            "error"
        );

    }


    /* ======================================
       ENABLE SAVE BUTTON
    ====================================== */

    if (saveButton) {

        saveButton.disabled = false;

        saveButton.innerHTML = `
            <i class="fa-solid fa-floppy-disk"></i>
            Save Fee
        `;

    }

}


/* ==========================================
   CALCULATE REMAINING
========================================== */

function calculateRemaining() {

    const totalInput =
        document.getElementById(
            "totalFee"
        );


    const paidInput =
        document.getElementById(
            "paidAmount"
        );


    const remainingInput =
        document.getElementById(
            "remainingAmount"
        );


    const statusInput =
        document.getElementById(
            "paymentStatus"
        );


    if (
        !totalInput ||
        !paidInput ||
        !remainingInput
    ) {

        return;

    }


    const total =
        parseFloat(
            totalInput.value
        ) || 0;


    const paid =
        parseFloat(
            paidInput.value
        ) || 0;


    let remaining =
        total - paid;


    if (remaining < 0) {

        remaining = 0;

    }


    remainingInput.value =
        remaining.toFixed(2);


    /* ======================================
       AUTOMATIC STATUS
    ====================================== */

    if (!statusInput) return;


    if (
        total > 0 &&
        paid === total
    ) {

        statusInput.value =
            "PAID";

    }

    else if (
        paid > 0 &&
        paid < total
    ) {

        statusInput.value =
            "PARTIAL";

    }

    else {

        statusInput.value =
            "PENDING";

    }

}


/* ==========================================
   EDIT FEE
========================================== */

function editFee(id) {

    const numericId =
        Number(id);


    const fee =
        allFees.find(
            item =>
                Number(item.id) === numericId
        );


    if (!fee) {

        showMessage(
            "Fee record not found.",
            "error"
        );

        return;

    }


    /* ======================================
       SET MODAL TITLE
    ====================================== */

    const modalTitle =
        document.getElementById(
            "modalTitle"
        );


    if (modalTitle) {

        modalTitle.innerHTML = `
            <i class="fa-solid fa-pen"></i>
            Update Fee
        `;

    }


    /* ======================================
       FILL FORM
    ====================================== */

    document.getElementById(
        "feeId"
    ).value =
        fee.id ?? "";


    document.getElementById(
        "studentSearch"
    ).value =
        fee.enrollmentNo ?? "";


    document.getElementById(
        "enrollmentNo"
    ).value =
        fee.enrollmentNo ?? "";


    document.getElementById(
        "studentName"
    ).value =
        fee.studentName ?? "";


    document.getElementById(
        "course"
    ).value =
        fee.course ?? "";


    document.getElementById(
        "semester"
    ).value =
        fee.semester ?? "";


    document.getElementById(
        "totalFee"
    ).value =
        fee.totalFee ?? "";


    document.getElementById(
        "paidAmount"
    ).value =
        fee.paidAmount ?? "";


    document.getElementById(
        "remainingAmount"
    ).value =
        fee.remainingAmount ?? "";


    document.getElementById(
        "paymentDate"
    ).value =
        fee.paymentDate ?? "";


    document.getElementById(
        "paymentMode"
    ).value =
        fee.paymentMode ?? "";


    document.getElementById(
        "paymentStatus"
    ).value =
        String(
            fee.paymentStatus || "PENDING"
        ).toUpperCase();


    /* ======================================
       OPEN MODAL
    ====================================== */

    const modal =
        document.getElementById(
            "feeModal"
        );


    if (modal) {

        modal.classList.add(
            "active"
        );

    }


    /* ======================================
       FOCUS SEARCH
    ====================================== */

    setTimeout(() => {

        const totalInput =
            document.getElementById(
                "totalFee"
            );


        if (totalInput) {

            totalInput.focus();

        }

    }, 150);

}


/* ==========================================
   DELETE FEE
========================================== */

async function deleteFee(id) {

    const numericId =
        Number(id);


    const fee =
        allFees.find(
            item =>
                Number(item.id) === numericId
        );


    if (!fee) {

        showMessage(
            "Fee record not found.",
            "error"
        );

        return;

    }


    /* ======================================
       CONFIRM
    ====================================== */

    const confirmed =
        window.confirm(
            `Are you sure you want to delete the fee record for ${fee.studentName || "this student"}?`
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `/fees/${numericId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            let errorMessage =
                "Unable to delete fee record.";


            try {

                const errorText =
                    await response.text();


                if (errorText) {

                    errorMessage =
                        errorText;

                }

            } catch (e) {

                console.error(e);

            }


            throw new Error(
                errorMessage
            );

        }


        /* ==================================
           SUCCESS
        ================================== */

        showMessage(
            "Fee deleted successfully!",
            "success"
        );


        await loadFees();


    } catch (error) {

        console.error(
            "Error deleting fee:",
            error
        );


        showMessage(
            "Error deleting fee: " +
            error.message,
            "error"
        );

    }

}


/* ==========================================
   OPEN ADD FEE MODAL
========================================== */

function openFeeModal() {

    clearFeeForm();


    /* ======================================
       MODAL TITLE
    ====================================== */

    const modalTitle =
        document.getElementById(
            "modalTitle"
        );


    if (modalTitle) {

        modalTitle.innerHTML = `
            <i class="fa-solid fa-file-invoice-dollar"></i>
            Add Fee
        `;

    }


    /* ======================================
       TODAY DATE
    ====================================== */

    setTodayDate();


    /* ======================================
       OPEN MODAL
    ====================================== */

    const modal =
        document.getElementById(
            "feeModal"
        );


    if (modal) {

        modal.classList.add(
            "active"
        );

    }


    /* ======================================
       FOCUS STUDENT SEARCH
    ====================================== */

    setTimeout(() => {

        const search =
            document.getElementById(
                "studentSearch"
            );


        if (search) {

            search.focus();

        }

    }, 150);

}


/* ==========================================
   CLOSE FEE MODAL
========================================== */

function closeFeeModal() {

    const modal =
        document.getElementById(
            "feeModal"
        );


    if (!modal) return;


    modal.classList.remove(
        "active"
    );

}


/* ==========================================
   UPDATE FEE STATISTICS
========================================== */

function updateFeeStatistics() {

    /* ======================================
       TOTAL RECORDS
    ====================================== */

    const totalRecords =
        allFees.length;


    /* ======================================
       TOTAL FEE
    ====================================== */

    let totalFee =
        0;


    /* ======================================
       TOTAL PAID
    ====================================== */

    let totalPaid =
        0;


    /* ======================================
       TOTAL REMAINING
    ====================================== */

    let totalRemaining =
        0;


    allFees.forEach(fee => {

        totalFee +=
            Number(
                fee.totalFee
            ) || 0;


        totalPaid +=
            Number(
                fee.paidAmount
            ) || 0;


        totalRemaining +=
            Number(
                fee.remainingAmount
            ) || 0;

    });


    /* ======================================
       TOTAL FEES CARD
    ====================================== */

    const totalFeesCount =
        document.getElementById(
            "totalFeesCount"
        );


    if (totalFeesCount) {

        totalFeesCount.textContent =
            totalRecords;

    }


    /* ======================================
       TOTAL COLLECTED CARD
    ====================================== */

    const totalCollected =
        document.getElementById(
            "totalCollected"
        );


    if (totalCollected) {

        totalCollected.textContent =
            "₹" +
            formatAmount(totalFee);

    }


    /* ======================================
       PAID AMOUNT CARD
    ====================================== */

    const paidAmountStat =
        document.getElementById(
            "paidAmountStat"
        );


    if (paidAmountStat) {

        paidAmountStat.textContent =
            "₹" +
            formatAmount(totalPaid);

    }


    /* ======================================
       PENDING AMOUNT CARD
    ====================================== */

    const pendingAmountStat =
        document.getElementById(
            "pendingAmountStat"
        );


    if (pendingAmountStat) {

        pendingAmountStat.textContent =
            "₹" +
            formatAmount(totalRemaining);

    }

}


/* ==========================================
   POPULATE SEMESTER FILTER
========================================== */

function populateSemesterFilter() {

    const filter =
        document.getElementById(
            "semesterFilter"
        );


    if (!filter) return;


    /* ======================================
       SAVE CURRENT SELECTION
    ====================================== */

    const currentValue =
        filter.value;


    /* ======================================
       GET UNIQUE SEMESTERS
    ====================================== */

    const semesters =
        [
            ...new Set(
                allFees
                    .map(
                        fee =>
                            fee.semester
                    )
                    .filter(Boolean)
            )
        ];


    /* ======================================
       SORT
    ====================================== */

    semesters.sort(
        (a, b) =>
            String(a).localeCompare(
                String(b),
                undefined,
                {
                    numeric: true
                }
            )
    );


    /* ======================================
       RESET
    ====================================== */

    filter.innerHTML = `
        <option value="">
            All Semesters
        </option>
    `;


    /* ======================================
       ADD OPTIONS
    ====================================== */

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


            filter.appendChild(
                option
            );

        }
    );


    /* ======================================
       RESTORE SELECTION
    ====================================== */

    if (
        semesters.includes(
            currentValue
        )
    ) {

        filter.value =
            currentValue;

    }

}


/* ==========================================
   SEARCH + FILTER FEES
========================================== */

function searchFees() {

    applyFeeFilters();

}


/* ==========================================
   APPLY ALL FILTERS
========================================== */

function applyFeeFilters() {

    const searchInput =
        document.getElementById(
            "feeSearch"
        );


    const semesterFilter =
        document.getElementById(
            "semesterFilter"
        );


    const modeFilter =
        document.getElementById(
            "modeFilter"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    /* ======================================
       SEARCH
    ====================================== */

    const keyword =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    /* ======================================
       SEMESTER
    ====================================== */

    const selectedSemester =
        semesterFilter
            ? semesterFilter.value
            : "";


    /* ======================================
       MODE
    ====================================== */

    const selectedMode =
        modeFilter
            ? modeFilter.value
            : "";


    /* ======================================
       STATUS
    ====================================== */

    const selectedStatus =
        statusFilter
            ? statusFilter.value
                .toUpperCase()
            : "";


    /* ======================================
       FILTER RECORDS
    ====================================== */

    const filtered =
        allFees.filter(
            fee => {

                const enrollment =
                    String(
                        fee.enrollmentNo ?? ""
                    ).toLowerCase();


                const name =
                    String(
                        fee.studentName ?? ""
                    ).toLowerCase();


                const course =
                    String(
                        fee.course ?? ""
                    ).toLowerCase();


                const semester =
                    String(
                        fee.semester ?? ""
                    ).toLowerCase();


                const mode =
                    String(
                        fee.paymentMode ?? ""
                    ).toUpperCase();


                const status =
                    String(
                        fee.paymentStatus ??
                        "PENDING"
                    ).toUpperCase();


                /* ==========================
                   TEXT SEARCH
                ========================== */

                const matchesSearch =
                    !keyword ||
                    enrollment.includes(
                        keyword
                    ) ||
                    name.includes(
                        keyword
                    ) ||
                    course.includes(
                        keyword
                    ) ||
                    semester.includes(
                        keyword
                    ) ||
                    mode.toLowerCase().includes(
                        keyword
                    );


                /* ==========================
                   SEMESTER
                ========================== */

                const matchesSemester =
                    !selectedSemester ||
                    semester ===
                    selectedSemester.toLowerCase();


                /* ==========================
                   MODE
                ========================== */

                const matchesMode =
                    !selectedMode ||
                    mode ===
                    selectedMode.toUpperCase();


                /* ==========================
                   STATUS
                ========================== */

                const matchesStatus =
                    !selectedStatus ||
                    status ===
                    selectedStatus;


                return (
                    matchesSearch &&
                    matchesSemester &&
                    matchesMode &&
                    matchesStatus
                );

            }
        );


    /* ======================================
       DISPLAY
    ====================================== */

    displayFees(
        filtered
    );

}


/* ==========================================
   CLEAR FEE FORM
========================================== */

function clearFeeForm() {

    const feeId =
        document.getElementById(
            "feeId"
        );


    const studentSearch =
        document.getElementById(
            "studentSearch"
        );


    const totalFee =
        document.getElementById(
            "totalFee"
        );


    const paidAmount =
        document.getElementById(
            "paidAmount"
        );


    const remainingAmount =
        document.getElementById(
            "remainingAmount"
        );


    const paymentDate =
        document.getElementById(
            "paymentDate"
        );


    const paymentMode =
        document.getElementById(
            "paymentMode"
        );


    const paymentStatus =
        document.getElementById(
            "paymentStatus"
        );


    /* ======================================
       RESET ID
    ====================================== */

    if (feeId) {

        feeId.value = "";

    }


    /* ======================================
       RESET STUDENT SEARCH
    ====================================== */

    if (studentSearch) {

        studentSearch.value = "";

    }


    /* ======================================
       RESET STUDENT DETAILS
    ====================================== */

    clearStudentDetails();


    /* ======================================
       RESET FEE
    ====================================== */

    if (totalFee) {

        totalFee.value = "";

    }


    if (paidAmount) {

        paidAmount.value = "";

    }


    if (remainingAmount) {

        remainingAmount.value = "";

    }


    /* ======================================
       RESET DATE
    ====================================== */

    if (paymentDate) {

        paymentDate.value = "";

    }


    /* ======================================
       RESET MODE
    ====================================== */

    if (paymentMode) {

        paymentMode.value = "";

    }


    /* ======================================
       RESET STATUS
    ====================================== */

    if (paymentStatus) {

        paymentStatus.value =
            "PENDING";

    }

}


/* ==========================================
   FORMAT AMOUNT
========================================== */

function formatAmount(amount) {

    const value =
        Number(amount);


    if (
        isNaN(value) ||
        !isFinite(value)
    ) {

        return "0.00";

    }


    return value.toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,

            maximumFractionDigits: 2
        }
    );

}


/* ==========================================
   FORMAT DATE
========================================== */

function formatDate(dateValue) {

    if (!dateValue) {

        return "-";

    }


    const value =
        String(
            dateValue
        );


    /* ======================================
       ISO DATE
    ====================================== */

    if (
        value.includes("T")
    ) {

        return value.split("T")[0];

    }


    return value;

}


/* ==========================================
   HTML ESCAPE
========================================== */

function escapeHtml(value) {

    return String(
        value ?? ""
    )

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


/* ==========================================
   MESSAGE / ALERT
========================================== */

function showMessage(
    message,
    type = "info"
) {

    /* ======================================
       USE SWEETALERT IF AVAILABLE
    ====================================== */

    if (
        typeof Swal !== "undefined"
    ) {

        let icon =
            "info";


        if (type === "success") {

            icon = "success";

        }

        else if (
            type === "error"
        ) {

            icon = "error";

        }

        else if (
            type === "warning"
        ) {

            icon = "warning";

        }


        Swal.fire({

            icon: icon,

            title:
                type === "success"
                    ? "Success"
                    : type === "error"
                        ? "Error"
                        : type === "warning"
                            ? "Warning"
                            : "Information",

            text: message,

            confirmButtonColor:
                "#2867d7"

        });


        return;

    }


    /* ======================================
       FALLBACK
    ====================================== */

    alert(
        message
    );

}

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