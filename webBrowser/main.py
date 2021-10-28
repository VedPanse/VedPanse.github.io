from flask import Flask, render_template, request
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import requests
import bs4
from flask import json
from urllib.request import Request, urlopen

link_text = []
links = []

chrome_driver_path = "/Users/vedpanse/Desktop/Develope/chromedriver"

app = Flask(__name__)


@app.route("/")
def host_website():
    return render_template("index.html")


@app.route('/', methods=['GET', 'POST'])
def index():
    global link_text
    global links
    link_text = []
    links = []
    query = request.form['query']

    url = 'https://google.com/search?q=' + query
    request_result = requests.get(url)

    soup = bs4.BeautifulSoup(request_result.text,
                             "html.parser")

    heading_object = soup.find_all('h3')

    for info in heading_object:
        url_to_append = info.parent.get("href")
        
        if url_to_append is not None:
            link_text.append(info.getText())
            links.append("https://google.com" + url_to_append)

    return render_template("index.html", list_to_send=link_text, all_links=links)


if __name__ == "__main__":
    app.run(debug=True)
