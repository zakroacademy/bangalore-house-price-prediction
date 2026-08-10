from flask import Flask, request, jsonify, send_from_directory
import util
import os

app = Flask(__name__)


# ==============================
# CLIENT FOLDER
# ==============================

CLIENT_FOLDER = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "client"
    )
)


# ==============================
# HOME PAGE
# ==============================

@app.route("/")
def index():
    return send_from_directory(
        CLIENT_FOLDER,
        "index.html"
    )


# ==============================
# CSS FILE
# ==============================

@app.route("/app.css")
def css():
    return send_from_directory(
        CLIENT_FOLDER,
        "app.css"
    )


# ==============================
# JAVASCRIPT FILE
# ==============================

@app.route("/app.js")
def javascript():
    return send_from_directory(
        CLIENT_FOLDER,
        "app.js"
    )


# ==============================
# GET LOCATION NAMES
# ==============================

@app.route("/get_location_names")
def get_location_names():

    response = jsonify({
        "locations": util.get_location_names()
    })

    response.headers.add(
        "Access-Control-Allow-Origin",
        "*"
    )

    return response


# ==============================
# PREDICT HOME PRICE
# ==============================

@app.route(
    "/predict_home_price",
    methods=["POST"]
)
def predict_home_price():

    try:

        # Get form data
        total_sqft = float(
            request.form["total_sqft"]
        )

        location = request.form["location"]

        bhk = int(
            request.form["bhk"]
        )

        bath = int(
            request.form["bath"]
        )


        # Get prediction
        estimated_price = util.get_estimated_price(
            location,
            total_sqft,
            bhk,
            bath
        )


        # Return result
        response = jsonify({
            "estimated_price": estimated_price
        })


        response.headers.add(
            "Access-Control-Allow-Origin",
            "*"
        )


        return response


    except Exception as e:

        print(
            "Prediction Error:",
            str(e)
        )

        response = jsonify({
            "error": str(e)
        })

        response.status_code = 400

        response.headers.add(
            "Access-Control-Allow-Origin",
            "*"
        )

        return response


# ==============================
# START FLASK SERVER
# ==============================

if __name__ == "__main__":

    print(
        "Starting Python Flask Server "
        "For Home Price Prediction..."
    )

    # Load ML model and locations
    util.load_saved_artifacts()

    print(
        "Client folder:",
        CLIENT_FOLDER
    )

    print(
        "Starting server..."
    )

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )