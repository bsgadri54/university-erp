document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* ==========================================
           GET PAYMENT DATA
        ========================================== */

        const username =
            localStorage.getItem("username");

        const feeId =
            localStorage.getItem("selectedFeeId");

        const amount =
            Number(
                localStorage.getItem(
                    "selectedFeeAmount"
                )
            );

        const semester =
            localStorage.getItem(
                "selectedFeeSemester"
            );


        /* ==========================================
           VALIDATE PAYMENT REQUEST
        ========================================== */

        if (
            !username ||
            !feeId ||
            !amount ||
            amount <= 0
        ) {

            alert(
                "Invalid payment request."
            );

            window.location.href =
                "student-fee.html";

            return;
        }


        /* ==========================================
           DISPLAY ENROLLMENT NUMBER
        ========================================== */

        const enrollmentElement =
            document.getElementById(
                "enrollmentNo"
            );

        if (enrollmentElement) {

            enrollmentElement.textContent =
                username;

        }


        /* ==========================================
           DISPLAY SEMESTER
        ========================================== */

        const semesterElement =
            document.getElementById(
                "semester"
            );

        if (semesterElement) {

            semesterElement.textContent =
                semester || "-";

        }


        /* ==========================================
           DISPLAY PAYMENT AMOUNT
        ========================================== */

        const formattedAmount =
            "₹" +
            amount.toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );


        /* Payment Due */

        const paymentDue =
            document.getElementById(
                "paymentDue"
            );

        if (paymentDue) {

            paymentDue.textContent =
                formattedAmount;

        }


        /* Semester Fee */

        const summaryAmount =
            document.getElementById(
                "summaryAmount"
            );

        if (summaryAmount) {

            summaryAmount.textContent =
                formattedAmount;

        }


        /* Total Payable */

        const totalAmount =
            document.getElementById(
                "amount"
            );

        if (totalAmount) {

            totalAmount.textContent =
                formattedAmount;

        }


        /* ==========================================
           LOAD STUDENT NAME
        ========================================== */

        loadStudentName(username);

    }
);


/* ==========================================
   LOAD STUDENT NAME
========================================== */

async function loadStudentName(
    enrollmentNo
) {

    try {

        const response =
            await fetch("/students");


        if (!response.ok) {

            throw new Error(
                "Unable to load students"
            );

        }


        const students =
            await response.json();


        const student =
            students.find(
                s =>
                    s.enrollmentNo ===
                    enrollmentNo
            );


        if (student) {

            const studentName =
                document.getElementById(
                    "studentName"
                );

            if (studentName) {

                studentName.textContent =
                    student.name || "-";

            }

        } else {

            const studentName =
                document.getElementById(
                    "studentName"
                );

            if (studentName) {

                studentName.textContent =
                    "Student Not Found";

            }

        }


    } catch (error) {

        console.error(
            "Student loading error:",
            error
        );


        const studentName =
            document.getElementById(
                "studentName"
            );

        if (studentName) {

            studentName.textContent =
                "Unable to load";

        }

    }

}
/* ==========================================
   SELECT PAYMENT METHOD
========================================== */

function selectPaymentMethod(method) {

    const select =
        document.getElementById("paymentMethod");

    if (!select) {
        return;
    }

    /* Set dropdown value */

    select.value = method;


    /* Remove selected class */

    document
        .querySelectorAll(".payment-option")
        .forEach(option => {

            option.classList.remove("selected");

        });


    /* Highlight selected option */

    const selectedOption =
        document.querySelector(
            `.payment-option[data-method="${method}"]`
        );


    if (selectedOption) {

        selectedOption.classList.add("selected");

    }


    console.log(
        "Selected Payment Method:",
        method
    );
}


/* ==========================================
   DROPDOWN CHANGE
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const select =
            document.getElementById(
                "paymentMethod"
            );


        if (!select) {
            return;
        }


        select.addEventListener(
            "change",
            function () {

                const method =
                    this.value;


                document
                    .querySelectorAll(
                        ".payment-option"
                    )
                    .forEach(option => {

                        option.classList.remove(
                            "selected"
                        );

                    });


                if (method) {

                    const option =
                        document.querySelector(
                            `.payment-option[data-method="${method}"]`
                        );


                    if (option) {

                        option.classList.add(
                            "selected"
                        );

                    }

                }

            }
        );

    }
);

/* ==========================================
   PROCEED PAYMENT
========================================== */

async function proceedPayment() {

    /* ==========================================
       GET PAYMENT METHOD
    ========================================== */

    const method =
        document.getElementById(
            "paymentMethod"
        ).value;


    if (!method) {

        alert(
            "Please select a payment method."
        );

        return;
    }


    /* ==========================================
       GET PAYMENT DATA
    ========================================== */

    const feeId =
        localStorage.getItem(
            "selectedFeeId"
        );


    const amount =
        Number(
            localStorage.getItem(
                "selectedFeeAmount"
            )
        );


    const semester =
        localStorage.getItem(
            "selectedFeeSemester"
        );


    const username =
        localStorage.getItem(
            "username"
        );


    /* ==========================================
       VALIDATE AMOUNT
    ========================================== */

    if (
        !feeId ||
        !amount ||
        amount <= 0
    ) {

        alert(
            "Invalid fee amount."
        );

        return;
    }


    try {

        /* ==========================================
           CREATE RAZORPAY ORDER
        ========================================== */

        const response =
            await fetch(
                "/razorpay/create-order",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            amount: amount
                        })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to create Razorpay order."
            );

        }


        const order =
            await response.json();


        console.log(
            "Razorpay Order:",
            order
        );


        if (!order.id) {

            throw new Error(
                order.error ||
                "Razorpay order was not created."
            );

        }


        /* ==========================================
           RAZORPAY OPTIONS
        ========================================== */

        const options = {

            key: "rzp_test_TRL38YDGZF2N4E",

            amount: order.amount,

            currency: order.currency || "INR",

            name: "University ERP",

            description: "Semester Fee Payment",

            order_id: order.id,

            prefill: {
                name:
                    document.getElementById("studentName")?.textContent || "",
                email: "",
                contact: ""
            },

            notes: {
                enrollment_no: username,
                fee_id: feeId,
                semester: semester || "",
                payment_method: method
            },

            theme: {
                color: "#2457a6"
            },

            /* ==========================================
               PAYMENT METHOD CONFIGURATION
            ========================================== */

            config: {

                display: {

                    blocks: {

                        selected_method: {

                            name:
                                method === "UPI"
                                    ? "Pay via UPI"
                                    : method === "CARD"
                                        ? "Pay via Card"
                                        : "Pay via Net Banking",

                            instruments: [

                                {
                                    method:
                                        method === "UPI"
                                            ? "upi"
                                            : method === "CARD"
                                                ? "card"
                                                : "netbanking"
                                }

                            ]

                        }

                    },

                    sequence: [
                        "block.selected_method"
                    ],

                    preferences: {
                        show_default_blocks: false
                    }

                }

            },

            /* ==========================================
               PAYMENT SUCCESS
            ========================================== */

            handler: async function (paymentResponse) {

                console.log(
                    "Razorpay Payment Response:",
                    paymentResponse
                );

                try {

                    const verifyResponse =
                        await fetch(
                            "/razorpay/verify-payment",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    feeId:
                                        Number(feeId),

                                    razorpayPaymentId:
                                    paymentResponse
                                        .razorpay_payment_id,

                                    razorpayOrderId:
                                    paymentResponse
                                        .razorpay_order_id,

                                    razorpaySignature:
                                    paymentResponse
                                        .razorpay_signature

                                })

                            }
                        );


                    const result =
                        await verifyResponse.json();


                    if (!verifyResponse.ok) {

                        throw new Error(
                            result.message ||
                            "Payment verification failed."
                        );

                    }


                    alert(
                        "Payment successful!\n\n" +
                        "Payment ID: " +
                        paymentResponse
                            .razorpay_payment_id
                    );


                    localStorage.removeItem(
                        "selectedFeeId"
                    );

                    localStorage.removeItem(
                        "selectedFeeAmount"
                    );

                    localStorage.removeItem(
                        "selectedFeeSemester"
                    );


                    window.location.href =
                        "student-fee.html";


                } catch (error) {

                    console.error(
                        "Payment verification error:",
                        error
                    );

                    alert(
                        "Payment verification failed.\n\n" +
                        error.message
                    );

                }

            }

        };

        /* ==========================================
           RAZORPAY PAYMENT FAILED
        ========================================== */

        const razorpay =
            new Razorpay(
                options
            );


        razorpay.on(
            "payment.failed",
            function (response) {

                console.error(
                    "Payment Failed:",
                    response.error
                );


                alert(
                    "Payment failed.\n\n" +
                    "Reason: " +
                    (
                        response.error
                            ?.description ||
                        "Unknown error"
                    )
                );

            }
        );


        /* ==========================================
           OPEN RAZORPAY
        ========================================== */

        razorpay.open();

    } catch (error) {

        console.error(
            "Razorpay Error:",
            error
        );


        alert(
            "Unable to start payment.\n\n" +
            error.message
        );

    }

}


/* ==========================================
   BACK TO FEE STATUS
========================================== */

function goBack() {

    window.location.href =
        "student-fee.html";

}