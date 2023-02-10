const DROPDOWN_MENU_ID = "DropdownMenu";

async function main() {
    var herstellerDropDown;
    var modelDropDown;
    var typDropDown;

    const data = await LoadJsonData();//LoadData();
    
    //this is final never chancing

    console.log("jonas ------")
    console.log(data.hersteller)
    console.log(data.models)
    console.log(data.types)
    herstellerDropDown = CreateSelectionMenu("herstellerDiv", data.hersteller);
    modelDropDown = CreateSelectionMenu("modelDiv", data.models[0]);
    typDropDown = CreateSelectionMenu("typDiv", data.types["00"]);

    herstellerDropDown.addEventListener('change', (event) => {
        RemoveAllOptions(modelDropDown);
        RemoveAllOptions(typDropDown);

        const hersteller = event.target.value;

        data.getModelsByHersteller(hersteller).forEach(element => {
            AddOptionToSelect(modelDropDown, element);
        });


        data.getTypeByHerstellerAndModel(hersteller, modelDropDown.value).forEach(element => {
            AddOptionToSelect(typDropDown, element);
        });

        setPicture(data.getImagesByHerstellerAndModel[hersteller, modelDropDown.value]);


    });

    modelDropDown.addEventListener('change', (event) => {
        const hersteller = herstellerDropDown.value;
        const model = event.target.value;
        RemoveAllOptions(typDropDown);

        data.getTypeByHerstellerAndModel(hersteller, model).forEach(element => {
            AddOptionToSelect(typDropDown, element);
        });

        setPicture(data.getImagesByHerstellerAndModel[hersteller, model]);
    });

    typDropDown.addEventListener('change', (event) => {
        //Loading Image
    });
}

async function LoadJsonData() {
    try {

        const response = await fetch("test.json");
        const json = await response.json();
        var hersteller = [];
        var models = {};//index vom hersteller
        var types = {};
        var images = {};

        const keys = Object.keys(json["hersteller"]);
        for (var i = 0; i < keys.length; i++) {
            hersteller.push(keys[i]);
            models[i.toString()] = [];
            images[i.toString()] = [];
            var modelArr = json["hersteller"][keys[i]];
            for (var j = 0; j < modelArr.length; j++) {
                // var val = json["hersteller"][keys[i]] [Object.keys(json["hersteller"][keys[i]])] ["name"];
                models[i.toString()].push(modelArr[j]["name"]);
                images[i.toString()].push(modelArr[j]["image"]);
                types[i.toString()+j.toString()] = [];
                for (var z = 0; z < modelArr[j]["types"].length; z++) {
                    types[i.toString()+j.toString()].push(modelArr[j]["types"][z]);
                }
            }
        }
        console.log("Start");
        console.log(images);
        console.log("end");



        const returnObject = {
            hersteller: hersteller,
            models: models,
            types: types,
            images: images,
            getModelsByHersteller: function (herstellerName) {
                const herstellerIndex = hersteller.indexOf(herstellerName);
                const herstellerModels = models[herstellerIndex];
                return herstellerModels;
            },
            getTypeByHerstellerAndModel: function (herstellerName, modelName) {
                const herstellerIndex = hersteller.indexOf(herstellerName);
                const modelIndex = models[herstellerIndex].indexOf(modelName);
                const type = types[herstellerIndex.toString() + modelIndex.toString()];
                return type;
            },
            getImagesByHerstellerAndModel: function (herstellerName, modelName) {
                const herstellerIndex = hersteller.indexOf(herstellerName);
                const modelIndex = models[herstellerIndex].indexOf(modelName);
                const type = images[herstellerIndex.toString() + modelIndex.toString()];
                return type;
            }
        }
        return returnObject;
    } catch (exc) {
        console.log(exc);
        alert("Fehler beim laden der datei.");
    }
}

function LoadData() {
    var data = readStringFromFilePath("test.txt").split(' ').join('').split("\r").join("");
    // console.log(text);
    var lines = data.split("\n");
    if (lines.length <= 0) {
        alert("Fehler beim laden der Datei!");
    }
    //erste Zeile sind die hersteller

    //List<String>
    var hersteller = lines[0].split(",");

    //Map<Integer, String>
    var models = {};//index vom hersteller

    //Map<String, String>
    var types = {};//string bestehend aus nummern welche z.B. "01" für Hersteller index 0 und model index 1 

    //um typ 3 von model 2 von hersteller 1 zu bekommen:

    //beginne bei der zweiten Zeile
    for (var i = 0; i < hersteller.length; i++) {
        models[i] = [];
        for (var j = 1; j < lines.length; j++) {
            try {
                var modelsWithTypData = lines[j].split(",")[i];
                if (modelsWithTypData == "") continue;
                //get type Data
                var modelNameWithDataList = modelsWithTypData.split("*");
                var modelName = modelNameWithDataList.splice(0, 1);
                models[i].push(modelName[0]);
                // console.log(modelName);
                types[i.toString() + (j - 1).toString()] = modelNameWithDataList;
            } catch (err) {
                console.log(err);
            }
        }
    }

    /** ÄNDERUNG
     * Hier habe ich ein Objekt erstellt, das hersteller, models, types speichert damit man diese Daten returnen kann.
     * Zudem sind 2 Funktionen enthalten, diese werden für die unteren zeilen benötigt (eventListener)
    */

    const returnObject = {
        hersteller: hersteller,
        models: models,
        types: types,
        getModelsByHersteller: function (herstellerName) {
            const herstellerIndex = hersteller.indexOf(herstellerName);
            const herstellerModels = models[herstellerIndex];
            return herstellerModels;
        },
        getTypeByHerstellerAndModel: function (herstellerName, modelName) {
            const herstellerIndex = hersteller.indexOf(herstellerName);
            const modelIndex = models[herstellerIndex].indexOf(modelName);
            const type = types[herstellerIndex.toString() + modelIndex.toString()];
            // console.log(types)
            // console.log(modelIndex)
            // console.log(hersteller)
            return type;
        }
    }

    return returnObject;
}



function CreateSelectionMenu(divName, array) {
    var whereToPut = document.getElementById(divName);
    var newDropdown = document.createElement('select');
    newDropdown.setAttribute('id', divName + DROPDOWN_MENU_ID);
    whereToPut.appendChild(newDropdown);

    //ÄNDERUNG: angepasst für Arrays
    array.forEach(value => {
        AddOptionToSelect(newDropdown, value.toString());
    });

    return newDropdown;
}


function readStringFromFilePath(pathOfFileToReadFrom) {
    var request = new XMLHttpRequest();
    request.open("GET", pathOfFileToReadFrom, false);
    request.send(null);
    var returnValue = request.responseText;

    return returnValue;
}


function AddOptionToSelect(newDropdown, text) {
    var optionApple = document.createElement("option");
    optionApple.text = text;
    newDropdown.add(optionApple, newDropdown.options[null]);
}


function RemoveAllOptions(dropdownMenu) {
    //https://stackoverflow.com/a/4618811/15447789
    dropdownMenu.options.length = 0;
}

function setPicture(src) {
    var image = document.getElementById('img');
    image.src = src;
    console.log(src);
}

main();
