
function loadXMLDoc(){
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const xmlDoc = this.responseXML;
            const x = xmlDoc.getElementsByTagName("DOG");
            //create an html table
            let table = "<tr><th>Dog Name</th><th>Age</th><th>Color</th></tr>";
            for (let i = 0; i < x.length; i++) {
                let dogName = x[i].getElementsByTagName("NAME")[0].childNodes[0].nodeValue;
                let dogAge = x[i].getElementsByTagName("AGE")[0].childNodes[0].nodeValue;
                let dogColor = x[i].getElementsByTagName("COLOR")[0].childNodes[0].nodeValue;
                table += "<tr><td>" + dogName + "</td>" +
                    "<td>" + dogAge + "</td>" +
                    "<td>" + dogColor + "</td></tr>";
            }

            document.getElementById("dogData").innerHTML = table;
        }
    }
    xhttp.open("GET", "dogData.xml", true);
    xhttp.send();
}

class CD {
    constructor(title, artist, country, company, price, year) {
        this.title = title;
        this.artist = artist;
        this.country = country;
        this.company = company;
        this.price = price;
        this.year = year;
    }
}

function loadXMLDocWithFetch() {
    fetch('cd_catalog.xml')
        .then(response => response.text()) //for XML we get raw text
        .then(xmlText => { //parse the text
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
            const cdNodes = xmlDoc.querySelectorAll('CD');
            const cdList = Array.from(cdNodes).map(cdNode => {
                const title = cdNode.querySelector('TITLE').textContent;
                const artist = cdNode.querySelector('ARTIST').textContent;
                const country = cdNode.querySelector('COUNTRY').textContent;
                const company = cdNode.querySelector('COMPANY').textContent;
                const price = parseFloat(cdNode.querySelector('PRICE').textContent);
                const year = parseInt(cdNode.querySelector('YEAR').textContent);

                return new CD(title, artist, country, company, price, year);
            });
            sessionStorage.cdData = JSON.stringify(cdList);
        })
        .catch(error => {
            console.log('Error fetching CD XML data:', error);
        });
}


function loadJSONDocWithFetch() {
    fetch('cd_catalog.json')
        .then(response => response.json()) //for JSON we get json response
        .then(jsonData => {             
            const cdList = jsonData.CATALOG.CD.map(cdData => {
                const title = cdData.TITLE;
                const artist = cdData.ARTIST;
                const country = cdData.COUNTRY;
                const company = cdData.COMPANY;
                const price = cdData.PRICE;
                const year = cdData.YEAR;

                return new CD(title, artist, country, company, price, year);
            });
            sessionStorage.cdData = JSON.stringify(cdList);
        })
        .catch(error => {
            console.log('Error fetching CD JSON data:', error);
        });
}















var http = require('http');
var mysql = require('mysql');
var url = require('url');

// Database configuration
var dbConfig = {
    host: "localhost",
    user: "yourusername",
    password: "yourpassword",
    database: "mydb"
};

// Function to perform the database query
function runDatabaseQuery(name, address, callback) {
    var con = mysql.createConnection(dbConfig);

    con.connect(function (err) {
        if (err) {
            callback(err, null);
            return;
        }

        // Use parameters in the query
        var query = "SELECT name, address FROM customers WHERE name = ? AND address = ?";
        con.query(query, [name, address], function (err, result, fields) {
            con.end(); // Close the database connection

            if (err) {
                callback(err, null);
                return;
            }

            callback(null, result);
        });
    });
}

// Create HTTP server
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    // Parse the URL to extract query parameters
    var parsedUrl = url.parse(req.url, true);
    var queryData = parsedUrl.query;

    // Extract parameters from the query data
    var name = queryData.name || '';
    var address = queryData.address || '';

    // Call the database query function with extracted parameters
    runDatabaseQuery(name, address, function (err, result) {
        if (err) {
            res.end('Error executing database query');
            console.error(err);
            return;
        }

        // Process the result and send the response
        res.end('Database query result: ' + JSON.stringify(result));
    });

}).listen(8080);

console.log('Server running at http://localhost:8080/');




