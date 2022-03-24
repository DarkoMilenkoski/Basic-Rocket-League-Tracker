let lifetimeDataDOM = [
    document.getElementById("seasonIcon"),
    document.getElementById("seasonLevel"),
    document.getElementById("seasonRank"),
    document.getElementById("seasonTop"),
    document.getElementById("winsPercent"),
    document.getElementById("winsLabel"),
    document.getElementById("winsValue"),
    document.getElementById("winsTop"),
    document.getElementById("gsRatioPercent"),
    document.getElementById("gsRatioLabel"),
    document.getElementById("gsRatioValue"),
    document.getElementById("gsRatioTop"),
    document.getElementById("goalsPercent"),
    document.getElementById("goalsLabel"),
    document.getElementById("goalsValue"),
    document.getElementById("goalsTop"),
    document.getElementById("shotsPercent"),
    document.getElementById("shotsLabel"),
    document.getElementById("shotsValue"),
    document.getElementById("shotsTop"),
    document.getElementById("assistsPercent"),
    document.getElementById("assistsLabel"),
    document.getElementById("assistsValue"),
    document.getElementById("assistsTop"),
    document.getElementById("savesPercent"),
    document.getElementById("savesLabel"),
    document.getElementById("savesValue"),
    document.getElementById("savesTop"),
    document.getElementById("mvpsPercent"),
    document.getElementById("mvpsLabel"),
    document.getElementById("mvpsValue"),
    document.getElementById("mvpsTop"),
    document.getElementById("trnScorePercent"),
    document.getElementById("trnScoreLabel"),
    document.getElementById("trnScoreValue"),
    document.getElementById("trnScoreTop")
];

let playlistTableBody = document.getElementById("playlistTableBody");

let lifetimeDisplay = {
    display: function (lifetimeData) {
        const categories = ["seasonRewardLevel", "wins", "goalShotRatio", "goals", "shots", "assists", "saves", "mVPs", "score"];
        categories.forEach((category, index) => {
            let currentCategory = lifetimeData[category];
            if (index == 0) {
                lifetimeDataDOM[index].src = `${currentCategory.metadata.iconUrl}`;
                lifetimeDataDOM[index].alt = `${currentCategory.metadata.rankName}`;
                lifetimeDataDOM[index + 1].innerText = currentCategory.displayName;
                lifetimeDataDOM[index + 2].innerText = currentCategory.metadata.rankName;
                if (currentCategory.percentile >= 95) lifetimeDataDOM[index + 3].style.color = "#ffd700";
                if (currentCategory.percentile >= 50) lifetimeDataDOM[index + 3].innerText = `Top ${(100-currentCategory.percentile).toString()}%`;
                else lifetimeDataDOM[index + 3].innerText = `Bottom ${(currentCategory.percentile).toString()}%`;
                return;
            }
            lifetimeDataDOM[4*index].style.height = `${(currentCategory.percentile).toString()}%`;
            lifetimeDataDOM[4*index + 1].innerText = currentCategory.displayName;
            lifetimeDataDOM[4*index + 2].innerText = currentCategory.displayValue;
            lifetimeDataDOM[4*index + 3].innerText = `#${Number(currentCategory.rank).toLocaleString()} -`;
            if (currentCategory.percentile >= 95) lifetimeDataDOM[4*index + 3].style.color = "#ffd700";
            if (currentCategory.percentile >= 50) lifetimeDataDOM[4*index + 3].innerText += ` Top ${(100-currentCategory.percentile).toString()}%`;
            else lifetimeDataDOM[4*index + 3].innerText += ` Bottom ${(currentCategory.percentile).toString()}%`;
        })
    }
} // access html elements and write lifetimeData[category] data to them.. Looks confusing but it works

let playlistDisplay = {
    newTable: ``,
    display: function (playlistData) {
        const limit = playlistData.length;
        playlistTableBody.innerHTML = ``;
        
        for (let i = 1; i < limit; i++) {
            if (playlistData[i].metadata.name == "Un-Ranked") continue;
            this.newTable += `<tr>`;
            this.displayRow(playlistData[i], this.newTable);
            this.newTable += `</tr>`;
        }

        playlistTableBody.innerHTML += this.newTable;
    },
    displayRow: function (segmentData) {
        this.addIcon(segmentData);
        this.addInfo(segmentData);
        this.addRating(segmentData);
        this.addUpDown(segmentData);
        this.addMatches(segmentData);
    },
    addIcon: function(segmentData) {
        this.newTable += `
            <td class="playlistIcon">
                <img src="${segmentData.stats.tier.metadata.iconUrl}" alt="${segmentData.stats.tier.metadata.name}" height="50px">
            </td>
        `;
    },
    addInfo: function (segmentData) {
        this.newTable += `
            <td class="playlistInfo">
                <div class="playlistName">${segmentData.metadata.name}</div>
                <div class="playlistRank">${segmentData.stats.tier.metadata.name} ${segmentData.stats.division.metadata.name}</div>
            </td>
        `;
    },
    addRating: function (segmentData) {
        let goldLetters = ``;
        if (segmentData.stats.rating.percentile >= 95) goldLetters = `goldLetters`;
        this.newTable += `
            <td class="playlistRating">
                <div class="rating-bar2">
                    <div style="height: ${(segmentData.stats.rating.percentile).toString()}%"></div>
                </div>
                <div class="rating">
                    <div class="ratingValue">${segmentData.stats.rating.displayValue}</div>
                    <div class="ratingTop ${goldLetters}">#${(segmentData.stats.rating.rank).toLocaleString()} - `;

        if (segmentData.stats.rating.percentile >= 50) this.newTable += `Top ${(100-segmentData.stats.rating.percentile).toPrecision(2).toString()}%`
        else this.newTable += `Bottom ${segmentData.stats.rating.percentile}%`;

        this.newTable += `</div>
                </div>
            </td>
        `;
    },
    addUpDown: function (segmentData) {
        this.newTable += `
            <td class="playlistUp">
                <div class="up">`;
        if (segmentData.stats.division.metadata.deltaUp != null) this.newTable += `${(segmentData.stats.division.metadata.deltaUp).toString()} ▲`;
        this.newTable += `
                </div>
            </td>
        `;
        
        this.newTable += `
            <td class="playlistDown">
                <div class="down">`;
        if (segmentData.stats.division.metadata.deltaDown != null) this.newTable += `${(segmentData.stats.division.metadata.deltaDown).toString()} ▼`;
        this.newTable += `
                </div>
            </td>
        `;
    },
    addMatches: function (segmentData) {
        let winsOrLosses = ``;
        let orangeOrBlue = ``;
        if (segmentData.stats.winStreak.metadata.type === "loss") {
            winsOrLosses += `Loss `
            orangeOrBlue = `blueLetters`;
        } else {
            winsOrLosses += `Wins `
            orangeOrBlue = `orangeLetters`;
        }

        this.newTable += `
            <td class="playlistMatches">
                <div class="matchesValue">${segmentData.stats.matchesPlayed.displayValue}</div>
                <div class="matchesStreak ${orangeOrBlue}">${winsOrLosses} Strk. ${(segmentData.stats.winStreak.value).toString()}</div>
            </td>
        `;
    }
}

function playerLoad(){
    fetch('https://api.tracker.gg/api/v2/rocket-league/standard/profile/epic/quarkk11')
    .then(response => response.json())
    .then(data => dataWorkplace(data))
}
function dataWorkplace(playerData){
    lifetimeDisplay.display(playerData.data.segments[0].stats);
    playlistDisplay.display(playerData.data.segments);
}
playerLoad(); //the idea is to fetch the data first. if it fails the page shouldnt load