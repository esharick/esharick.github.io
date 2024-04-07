
function DownloadStats() {
    var playerId = sessionStorage.playerId || '2JOL2OQQR';
    var url = `https://brawl-server.onrender.com/stats/`+playerId;
    console.log(url);
    fetch(url)
        .then(response => response.json())
        .then(brawlAccount => {
            var x2js = new X2JS();
            var xmlData = x2js.json2xml_str(brawlAccount);

            var blob = new Blob([xmlData], {type: 'application/xml'});
            var a = document.createElement('a');
            a.download = 'brawlAccount.xml';
            a.href = URL.createObjectURL(blob);
            a.click();
        })
        .catch(error => {
            console.log(error);
        }); 
}
async function ShowStats() {
    var playerIdInput = document.getElementById('BrawlID');
    console.log(playerIdInput.value)
    var playerId = (playerIdInput.value!=='')? playerIdInput.value:'2JOL2OQQR';
    sessionStorage.playerId = playerId;
    var url = `https://brawl-server.onrender.com/stats/`+playerId;
    var brawlAccountTag;
    console.log(url);
    await fetch(url)
        .then(response => response.json())
        .then(brawlAccount => {
            console.log(brawlAccount);
            brawlAccountTag = brawlAccount.tag;
            const PlayerName = document.getElementById('PlayerName');
            const PlayerTag = document.getElementById('PlayerTag');
            const PlayerIconId = document.getElementById('PlayerIconId');
            const PlayerClub = document.getElementById('PlayerClub');
            const PlayerTrophies = document.getElementById('PlayerTrophies');
            const PlayerHighestTrophies = document.getElementById('PlayerHighestTrophies');
            const PlayerExpLvl = document.getElementById('PlayerExpLvl');
            const soloVictories = document.getElementById('PlayerSoloVictories');
            const duoVictories = document.getElementById('PlayerDuoVictories');
            const victories = document.getElementById('Player3v3Victories');
            const PlayerBestRoboRumbleTime = document.getElementById('PlayerBestRoboRumbleTime');
            const PlayerBestBigBrawlerTime = document.getElementById('PlayerBestBigBrawlerTime');
            const PlayerTotalVictories = document.getElementById('PlayerTotalVictories');

            PlayerName.innerHTML = 'Name: '+brawlAccount.name;
            PlayerTag.innerHTML = 'Tag: '+brawlAccount.tag;
            PlayerIconId.innerHTML = 'Icon Id: '+brawlAccount.icon;
            PlayerClub.innerHTML = 'Club: '+brawlAccount.club.name;
            PlayerTrophies.innerHTML = 'Trophies: '+brawlAccount.trophies;
            PlayerHighestTrophies.innerHTML = 'Highest Trophies: '+brawlAccount.highestTrophies;
            PlayerExpLvl.innerHTML = 'Experience Level: '+brawlAccount.expLevel;
            soloVictories.innerHTML = 'Solo Victories: '+brawlAccount.soloVictories;
            duoVictories.innerHTML = 'Duo Victories: '+brawlAccount.duoVictories;
            victories.innerHTML = 'Victories: '+brawlAccount.victories;
            PlayerTotalVictories.innerHTML = 'Total Victories: '+brawlAccount.totalVictories;
            PlayerBestRoboRumbleTime.innerHTML = 'Best Robo Rumble Time: '+brawlAccount.bestRoboRumbleTime;
            PlayerBestBigBrawlerTime.innerHTML = 'Longest Time as Big Brawler: '+brawlAccount.bestTimeAsBigBrawler;
        })
        .catch(error => {
            console.log(error);
        });
    await addToDB(brawlAccountTag);
    await ShowAllStats();
}

async function addToDB(brawlAccountTag){
    brawlAccountTag = brawlAccountTag.slice(1);
    var url = `https://brawl-server.onrender.com/stats/add/`+brawlAccountTag;
    await fetch(url)
    .then(response=>response.json())
    .then(xmlBrawl => { 
        console.log(xmlBrawl);
    })
    .catch(err => console.log(err));
}

async function ShowAllStats() {
    var url = `https://brawl-server.onrender.com/all`;
    console.log(url);
    await fetch(url)
        .then(response => response.json())
        .then(brawlAccounts => {
            console.log(brawlAccounts);
            const table = document.getElementById('BrawlTable');
            while (table.rows.length > 1)
                table.deleteRow(table.rows.length - 1);
            brawlAccounts.forEach(brawlAccount => {
                const row = table.insertRow();
                const name = row.insertCell(0);
                const trophies = row.insertCell(1);
                const totalVictories = row.insertCell(2);
                const club = row.insertCell(3);
                const tag = row.insertCell(4);

                name.innerHTML = brawlAccount.name;
                tag.innerHTML = brawlAccount.tag;
                trophies.innerHTML = brawlAccount.trophies;
                totalVictories.innerHTML = brawlAccount.totalvictories;
                club.innerHTML = brawlAccount.club;
                row.addEventListener('click', function () {
                    var playerIdInput = brawlAccount.tag;
                    sessionStorage
                    document.getElementById('BrawlID').value = playerIdInput.slice(1);
                    ShowStats();
                });
            });
        })
        .catch(error => {
            console.log(error);
        });
}
document.getElementById('SearchForm').addEventListener('submit', function (e) {
    e.preventDefault();
});
document.getElementById('Search').addEventListener('change', function (e) {
    e.preventDefault();
    var table = document.getElementById('BrawlTable');
    var filter = e.target.value.toUpperCase();
    for (var i = 1; i < table.rows.length; i++) {
        var row = table.rows[i];
        var cellTexts = Array.from(row.cells).map(cell => cell.textContent.toUpperCase());
        if (cellTexts.some(text => text.indexOf(filter) > -1)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
});
function startUp() {
    if(sessionStorage.playerId){
        document.getElementById('BrawlID').value = sessionStorage.playerId;
        ShowStats();
    } else {
        ShowAllStats();
    }
}
startUp();