from flask import Flask, render_template, request
from csv_converter import get_content as gc

app = Flask(__name__)



def process_query(query):
    return gc(query)


@app.route("/")
def say_hello():
    return render_template("index.html")

@app.route("/", methods=['GET', 'POST'])
def get_input():
    query = request.form["query"]

    return render_template('index.html', lst=process_query(query))


if __name__ == "__main__":
    app.run(debug=True)
