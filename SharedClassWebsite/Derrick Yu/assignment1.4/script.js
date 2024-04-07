


fetch("plant_catalog.xml")
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      ParseToJSON(parser.parseFromString(data, "application/xml"));
      ConstructTable();
    })



function ParseToJSON(XMLDOM){
    const XMLPlants = XMLDOM.querySelectorAll("PLANT");
    let plants = [];
    for(let i=0; i<XMLPlants.length; i++){
        let temp = XMLPlants[i];
        plants[i] = new Plant(
            temp.querySelector("COMMON").textContent,
            temp.querySelector("BOTANICAL").textContent,
            temp.querySelector("ZONE").textContent,
            temp.querySelector("LIGHT").textContent,
            temp.querySelector("PRICE").textContent,
            temp.querySelector("AVAILABILITY").textContent
            );
    }

    sessionStorage.plants = JSON.stringify(plants);
    globalThis.P = plants;

}



function ConstructTable(){
    const plantTable = document.getElementById("plantTable");
    
    //generate table header
    const headers = ["Common Name", "Botanical Name", "Zone", "Light", "Price", "Availability"];
    generateHeader(plantTable, headers);

    function generateHeader(table, headers){
        let thead = table.createTHead();
        let headerRow = thead.insertRow();
        for (let i=0; i<headers.length; i++){
            let headerCell = document.createElement("th");
            headerCell.textContent = headers[i];
            headerRow.appendChild(headerCell); 
        };
    }

    globalThis.tBody = plantTable.createTBody();

    populateTable(JSON.parse(sessionStorage.plants),plantTable);

    let filter = document.getElementById("selectFilter");
    let sort = document.getElementById("selectSort");
    let order = document.getElementById("selectOrder");

    let option = document.createElement("option");
    option.text = "ascending";
    order.appendChild(option);
    let option2 = document.createElement("option");
    option2.text = "descending";
    order.appendChild(option2);

    headers.unshift("None");

    for(let i=0; i<headers.length; i++){
        let option = document.createElement("option");
        option.text = headers[i];
        let option2 = document.createElement("option");
        option2.text = headers[i];
        filter.add(option);
        sort.add(option2);
    }
}



function populateTable(plants,table){
    while(table.rows.length > 1){
        table.deleteRow(table.rows.length-1);
    }
    for(let i=0; i<plants.length; i++){
    
        let newRow = globalThis.tBody.insertRow();
        newRow.insertCell(0).innerHTML = plants[i].commonName;
        newRow.insertCell(1).innerHTML = plants[i].botanicalName;
        newRow.insertCell(2).innerHTML = plants[i].zone;
        newRow.insertCell(3).innerHTML = plants[i].light;
        newRow.insertCell(4).innerHTML = plants[i].price;
        newRow.insertCell(5).innerHTML = plants[i].availability;
    }
}


function updateTable(){
    populateTable(applyFilters(), document.getElementById("plantTable"));
}

function applyFilters(){
    let selected = JSON.parse(sessionStorage.plants);
    const keyWord = document.getElementById("searchBar").value;
    const sort = document.getElementById("selectSort");
    const filter = document.getElementById("selectFilter");
    const order = document.getElementById("selectOrder");


    function switchThing(plant, index){
        switch(index){
            case 0:
                return plant.commonName;
            case 1:
                return plant.botanicalName;
            case 2:
                return plant.zone;
            case 3:
                return plant.light;
            case 4:
                return plant.price;
            case 5:
                return plant.availability;
        }
    }
    
    const includesCaseInsensitive = (str, searchString) =>
        new RegExp(searchString, 'i').test(str);

    if(filter.selectedIndex == 0){
        for(let i=selected.length-1; i>=0; i--){
            let splice = true;
            for(let j=0; j<6; j++){
                if(includesCaseInsensitive(switchThing(selected[i], j), keyWord)){
                    splice = false;
                    break;
                }
            }
            if(splice){
                selected.splice(i,1);
            }
        }
    }else{
        for(let i=selected.length-1; i>=0; i--){
            if(!includesCaseInsensitive(switchThing(selected[i], filter.selectedIndex-1), keyWord)){
                selected.splice(i,1);
            }
        }
    }

    if(sort.selectedIndex != 0){
        for(let i=0; i<selected.length; i++){
            selected[i].sort = switchThing(selected[i], sort.selectedIndex-1);
        }
        selected.sort((a,b) => a.sort.localeCompare(b.sort));
        if(order.selectedIndex == 1){
            selected.reverse();
        }
    }

    return selected;

}

function downloadJSON(){
    let data = applyFilters();
    for(plant of data){
        delete plant.sort;
    }

    const blob = new Blob([JSON.stringify(data, null, "\t")], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "plant_catalog_selection.JSON"; //name of file to download
    document.body.appendChild(a); //necessary on some browsers to make it clickable
    a.click();
    document.body.removeChild(a); //keep DOM structure clean
    window.URL.revokeObjectURL(url); //free up memory
}