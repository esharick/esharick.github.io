
function loadXMLGameData() {
    //use AJAX to read data from an xml file
    const xhttp = new XMLHttpRequest(); //using XMLHttpRequest object
    //Asynchronous
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const xmlDoc = this.responseXML;
            //parse the data
            const games = xmlDoc.getElementsByTagName("game");
            let table = "<tr><th>Title</th><th>Played Before</th><th>Year</th><th>Genre</th><th>Platform</th></tr>";
            for (let i = 0; i < games.length; i++) {
                let title = games[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
                let played = games[i].getElementsByTagName("playedBefore")[0].childNodes[0].nodeValue;
                let year = games[i].getElementsByTagName("year")[0].childNodes[0].nodeValue;
                let type = games[i].getElementsByTagName("type")[0].childNodes[0].nodeValue;
                let platform = games[i].getElementsByTagName("platform")[0].childNodes[0].nodeValue;
                table += "<tr><td>" + title + "</td>" +
                    "<td>" + played + "</td>" +
                    "<td>" + year + "</td>" +
                    "<td>" + type + "</td>" +
                    "<td>" + platform + "</td></tr>";
            }
            document.getElementById("gameData").innerHTML = table;
        }
    } 
    xhttp.open("GET", "videoGames.xml", true);
    xhttp.send();
}

//class container for CD data
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

function loadXMLCDDataWithFetch(){
    fetch('cd_catalog.xml')
        .then(response => response.text()) //for XML use text
        .then(xmlText => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
            const cdNodes = xmlDoc.querySelectorAll('CD');
            const cdList = Array.from(cdNodes).map(n => {
                const title = n.querySelector('TITLE').textContent;
                const artist = n.querySelector('ARTIST').textContent;
                const country = n.querySelector('COUNTRY').textContent;
                const company = n.querySelector('COMPANY').textContent;
                const price = parseFloat(n.querySelector('PRICE').textContent);
                const year = parseInt(n.querySelector('YEAR').textContent);

                return new CD(title, artist, country, company, price, year);
            });
            sessionStorage.cdData = JSON.stringify(cdList);
        })
        .catch(error => {
            console.log('Error fetching data: ', error);
        });;
}
function loadJSONCDDataWithFetch() {
    fetch('cd_catalog.json')
        .then(response => response.json()) 
        .then(jsonData => {
            const cdList = jsonData.CATALOG.CD.map(cd => {
                return new CD(cd.TITLE, cd.ARTIST, cd.COUNTRY, cd.COMPANY, cd.PRICE, cd.YEAR);
            });
            sessionStorage.cdData = JSON.stringify(cdList);
        })
        .catch(error => {
            console.log('Error fetching data: ', error);
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




