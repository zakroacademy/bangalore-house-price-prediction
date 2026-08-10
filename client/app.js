const API_URL = "";


// =========================
// PAGE LOAD
// =========================

document.addEventListener("DOMContentLoaded", function () {

    loadLocations();

    setupBhkButtons();

    setupBathButtons();

    document
        .getElementById("predictButton")
        .addEventListener(
            "click",
            predictPrice
        );

});


// =========================
// LOAD LOCATIONS
// =========================

function loadLocations() {

    const locationSelect =
        document.getElementById("location");

    locationSelect.innerHTML =
        '<option value="">Loading locations...</option>';


    fetch(
        API_URL +
        "/get_location_names"
    )

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "Unable to load locations."
            );

        }

        return response.json();

    })

    .then(function (data) {

        locationSelect.innerHTML =
            '<option value="">Select Location</option>';


        if (
            !data.locations ||
            data.locations.length === 0
        ) {

            throw new Error(
                "No locations found."
            );

        }


        data.locations.forEach(
            function (location) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value = location;

                option.textContent =
                    location;

                locationSelect.appendChild(
                    option
                );

            }
        );

    })

    .catch(function (error) {

        console.error(error);

        locationSelect.innerHTML =
            '<option value="">Unable to load locations</option>';

        showError(
            "Could not load locations. Make sure Flask server is running."
        );

    });

}


// =========================
// BHK BUTTONS
// =========================

function setupBhkButtons() {

    const buttons =
        document.querySelectorAll(
            ".bhk-btn"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    buttons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    document.getElementById(
                        "bhk"
                    ).value =
                        button.dataset.value;

                }
            );

        }
    );

}


// =========================
// BATHROOM BUTTONS
// =========================

function setupBathButtons() {

    const buttons =
        document.querySelectorAll(
            ".bath-btn"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    buttons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    document.getElementById(
                        "bath"
                    ).value =
                        button.dataset.value;

                }
            );

        }
    );

}


// =========================
// PREDICT PRICE
// =========================

function predictPrice() {

    const totalSqft =
        document
            .getElementById("total_sqft")
            .value;


    const location =
        document
            .getElementById("location")
            .value;


    const bhk =
        document
            .getElementById("bhk")
            .value;


    const bath =
        document
            .getElementById("bath")
            .value;


    // -------------------------
    // VALIDATION
    // -------------------------

    if (!totalSqft) {

        showError(
            "Please enter the total area."
        );

        return;

    }


    if (
        isNaN(totalSqft) ||
        Number(totalSqft) <= 0
    ) {

        showError(
            "Please enter a valid area."
        );

        return;

    }


    if (!location) {

        showError(
            "Please select a location."
        );

        return;

    }


    if (!bhk) {

        showError(
            "Please select the number of BHK."
        );

        return;

    }


    if (!bath) {

        showError(
            "Please select the number of bathrooms."
        );

        return;

    }


    // -------------------------
    // HIDE OLD RESULT
    // -------------------------

    hideError();

    hideResult();

    showLoading();


    const button =
        document.getElementById(
            "predictButton"
        );

    button.disabled = true;


    // -------------------------
    // FORM DATA
    // -------------------------

    const formData =
        new URLSearchParams();


    formData.append(
        "total_sqft",
        totalSqft
    );


    formData.append(
        "location",
        location
    );


    formData.append(
        "bhk",
        bhk
    );


    formData.append(
        "bath",
        bath
    );


    // -------------------------
    // SEND TO FLASK
    // -------------------------

    fetch(
        API_URL +
        "/predict_home_price",
        {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded"
            },

            body:
                formData.toString()

        }
    )

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "Prediction request failed."
            );

        }

        return response.json();

    })

    .then(function (data) {

        hideLoading();

        button.disabled = false;


        if (
            data.estimated_price === undefined
        ) {

            throw new Error(
                "Invalid response from server."
            );

        }


        const price =
            Number(
                data.estimated_price
            );


        document.getElementById(
            "estimatedPrice"
        ).textContent =
            "₹ " +
            price.toFixed(2) +
            " Lakhs";


        document.getElementById(
            "result"
        ).style.display =
            "block";

    })

    .catch(function (error) {

        console.error(error);

        hideLoading();

        button.disabled = false;

        showError(
            "Unable to predict the price. Please check your Flask server."
        );

    });

}


// =========================
// LOADING
// =========================

function showLoading() {

    document.getElementById(
        "loading"
    ).style.display =
        "block";

}


function hideLoading() {

    document.getElementById(
        "loading"
    ).style.display =
        "none";

}


// =========================
// RESULT
// =========================

function hideResult() {

    document.getElementById(
        "result"
    ).style.display =
        "none";

}


// =========================
// ERROR
// =========================

function showError(message) {

    const error =
        document.getElementById(
            "error"
        );


    error.textContent =
        message;


    error.style.display =
        "block";

}


function hideError() {

    document.getElementById(
        "error"
    ).style.display =
        "none";

}