function createTable(timeTable, headings, rows) {
    let tblHead = document.createElement("thead");
    timeTable.appendChild(tblHead);
    let tblBody = document.createElement("tbody");
    timeTable.appendChild(tblBody);
    
    for (let heading of headings) {
        let th = document.createElement("th");
        tblHead.appendChild(th);
        th.innerText = heading;
        th.setAttribute("scope", "col");
    }
    
    for (let row of rows) {
        let tblRow = document.createElement("tr");
        tblBody.appendChild(tblRow);

        for (let item of row) {
            let data = document.createElement("td");
            tblRow.appendChild(data);
            data.innerText = item;
        }
    }
}

export { createTable }
