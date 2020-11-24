

matchID = 0;
window.onload = function () {
    getScheduledGames();
    document.querySelector("#theGames").addEventListener("click", rowClick);
  
  
};//end window.onload function()


function rowClick(e) {
    //get all rows and take away  class "highlight"
    let rows = document.querySelectorAll("tr");
    for (let i = 0; i < rows.length; i++) {
        rows[i].classList.remove("highlight");
    }
    //when a table row is clicked and is a <td>, add highlight class to parent <tr>
    //if status is Available, enable score game button
    var element = e.target;
    if (element.tagName == "TD") {
        e.target.parentElement.classList.add("highlight");
        if(e.target.parentElement.lastElementChild.innerHTML == "AVAILABLE"){
            document.querySelector("#scoreGame").removeAttribute("disabled");
        }else{
            document.querySelector("#scoreGame").setAttribute("disabled", false);
        }
    }
    
    

};//end rowClick(e)

function getScheduledGames(){
        let url = "api/getScheduledGames.php";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            console.log(resp);
            if (resp.search("ERROR") >= 0) {
                alert("Unable to access Games!");
            } else {
                let arrayGames = JSON.parse(xmlhttp.responseText);
                let gameList = document.querySelector("#theGames");
                let tableData = "";
                for (let i = 0; i < arrayGames.length; i++) {
                    let game = arrayGames[i];
                    
                    tableData += "<tr><td>" + game.matchID + "</td>";
                    tableData += "<td>" + game.gameNumber + "</td>";
                    tableData += "<td>" + getMatchByMatchID(game.matchID) + "</td>";
                    tableData += "<td>" + game.gameStateID + "</td>";
                    tableData += "</tr>";
                }
                
                gameList.innerHTML = tableData;
            }
        }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.send();
    //getMatchByMatchID();
    
};//end getScheduledGames()


function getMatchByMatchID(id){
    let url = "api/getMatchupByID.php";
    
    let theID = Number.parseInt(id);
    console.log(theID);
    
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = JSON.parse(xmlhttp.responseText);
            console.log(resp);
            return resp[0].roundID;
        }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.send(theID);
    };//end getMatchByMatchID
    
    