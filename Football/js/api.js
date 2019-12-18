const API_KEY = "d78a32e9700941fc8addcc92c890cfbc";
const BASE_URL = "https://api.football-data.org/v2/";

const LEAGUE_ID = 2002;

const ENDPOINT_COMPETITION = `${BASE_URL}competitions/${LEAGUE_ID}/standings`;
const TIM_INFO = `${BASE_URL}teams/2`;

const fetchAPI = url => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': API_KEY
        }
    })
        .then(res => {
            if (res.status !== 200) {
                console.log("Error: " + res.status);
                return Promise.reject(new Error(res.statusText))
            } else {
                return Promise.resolve(res)
            }
        })
        .then(res => res.json())
        .catch(err => {
            console.log(err)
        })
};

function getAllStandings() {
    if ("caches" in window) {
        caches.match(ENDPOINT_COMPETITION).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    console.log("Competition Data: " + data);
                    showStanding(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_COMPETITION)
        .then(data => {
            showStanding(data);
        })
        .catch(error => {
            console.log(error)
        })
}

function showStanding(data) {
    let standings = "";
    let standingElement =  document.getElementById("homeStandings");

    data.standings[0].table.forEach(function (standing) {
        standings += `
                <tr>
                    <td><img src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="30px" alt="badge"/></td>
                    <td>${standing.team.name}</td>
                    <td>${standing.won}</td>
                    <td>${standing.draw}</td>
                    <td>${standing.lost}</td>
                    <td>${standing.points}</td>
                    <td>${standing.goalsFor}</td>
                    <td>${standing.goalsAgainst}</td>
                    <td>${standing.goalDifference}</td>
                </tr>
        `;
    });

     standingElement.innerHTML = `
                <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">

                <table class="striped responsive-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Team Name</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>P</th>
                            <th>GF</th>
                            <th>GA</th>
                            <th>GD</th>
                        </tr>
                     </thead>
                    <tbody id="standings">
                        ${standings}
                    </tbody>
                </table>

                </div>
    `;
}


function getAllTimInfo() {
    if ("caches" in window) {
        caches.match(TIM_INFO).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    console.log("Tim Info Data: " + data);
                    showTimInfo(data);
                })
            }
        })
    }

    fetchAPI(TIM_INFO)
        .then(data => {
            showTimInfo(data);
        })
        .catch(error => {
            console.log(error)
        })
}

function showTimInfo(data) {
    let squads = "";
    let squadElement =  document.getElementById("bestteam");

    data.squad.forEach(function (squad) {
      const player = {
          squadName: squad.name,
          squadPosition: squad.position,
          squadNationality: squad.nationality,
          squadShirtNumber: squad.shirtNumber
      };

        squads += `
                <tr>
                    <td>${squad.name}</td>
                    <td>${squad.position}</td>
                    <td>${squad.nationality}</td>
                    <td>${squad.shirtNumber}</td>
                    <td><a class="btn-small waves-effect waves-light orange" type="submit" onclick="insertPlayer('${player}')"> <i class="small material-icons">+</i></a> </td>
                </tr>
        `;
    });

     squadElement.innerHTML = `
                <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">

                <table class="striped responsive-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Nationality</th>
                            <th>Number</th>
                            <th>Action</th>
                        </tr>
                     </thead>
                    <tbody id="squads">
                        ${squads}
                    </tbody>
                </table>

                </div>
    `;
}

function insertPlayer(player) {

    dbInsertPlayer(player).then(() => {
        showAllPlayer()
    })
}
