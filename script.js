function checkFileExists(url) {
    return fetch(url, { method: 'HEAD' })
        .then(response => response.ok)
        .catch(() => false);
}

function getData(academy) {
    if (!academy) {
        return;
    }

    fetch("./documents/directory.csv")
        .then(response => response.text())
        .then(data => {
            let entries = data.split("\n");
            console.log(academy);
            let staffDiv = document.getElementById("staff");

            // Create an array of promises for image existence checks
            let promises = entries.map(entry => {
                let entryData = entry.split(",");
                if (entryData[2] == academy) {
                    let filename = "images/staff-images/" + entryData[1].toLocaleLowerCase() + entryData[0].toLocaleLowerCase() + ".jpg";
                    console.log(filename);
                    return checkFileExists(filename).then(exists => {
                        if (!exists) {
                            filename = "images/staff-images/unknown.jpg";
                        }
                        
                        return {
                            html: `
                                <div id="${entryData[0]}" class="staffdiv">
                                    <img src="./${filename}">
                                    <p><b>${entryData[1]} ${entryData[0]}</b></p><br>
                                    <p class="nt">${entryData[3]}</p><br>
                                    <p class="nt">Room #: ${entryData[4]}</p>
                                </div>`,
                        };
                        
                    });
                } else if (entryData[2] != "IA" && entryData[2] != "HSA" && entryData[2] != "FA" && entryData[2] != "AGLA" && academy == "staff") {
                    console.log(entryData[1]);
                    let filename = "images/staff-images/" + entryData[1].toLocaleLowerCase() + entryData[0].toLocaleLowerCase() + ".jpg";
                    return checkFileExists(filename).then(exists => {
                        if (!exists) {
                            filename = "images/staff-images/unknown.jpg";
                        }
                        return {
                            html: `
                                <div id="${entryData[0]}" class="staffdiv">
                                    <img src="./${filename}" >
                                    <p><b>${entryData[1]} ${entryData[0]}</b></p><br>
                                    <p class="nt">${entryData[3]}</p><br>
                                    <p class="nt">Room #: ${entryData[4]}</p>
                                </div>`,
                        };
                    });
                }
                return Promise.resolve({ html: "" }); // Return empty if no match
            });

            // Wait for all promises to resolve and then update the HTML
            Promise.all(promises).then(results => {
                let htmlContent = results.map(result => result.html).join("");
                staffDiv.innerHTML = htmlContent;
            });
        });
}

var academy = document.getElementById("script").getAttribute("academy");
getData(academy);
