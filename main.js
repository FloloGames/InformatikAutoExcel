const DROPDOWN_MENU_ID = "DropdownMenu";

async function main() {
    var herstellerDropDown;
    var modelDropDown;
    var typDropDown;

    const data = await LoadJsonData();//LoadData();

    //this is final never chancing

    herstellerDropDown = CreateSelectionMenu("herstellerDiv", data.hersteller);
    modelDropDown = CreateSelectionMenu("modelDiv", data.models[0]);
    typDropDown = CreateSelectionMenu("typDiv", data.types["00"]);
    
    setPicture(data.getImagesByHerstellerAndModel(herstellerDropDown.value, modelDropDown.value));
    
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

        setPicture(data.getImagesByHerstellerAndModel(hersteller, modelDropDown.value));


    });

    modelDropDown.addEventListener('change', (event) => {
        const hersteller = herstellerDropDown.value;
        const model = event.target.value;
        RemoveAllOptions(typDropDown);

        data.getTypeByHerstellerAndModel(hersteller, model).forEach(element => {
            AddOptionToSelect(typDropDown, element);
        });

        setPicture(data.getImagesByHerstellerAndModel(hersteller, model));
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
                types[i.toString() + j.toString()] = [];
                for (var z = 0; z < modelArr[j]["types"].length; z++) {
                    types[i.toString() + j.toString()].push(modelArr[j]["types"][z]);
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
                const type = images[herstellerIndex.toString()][modelIndex.toString()];
                console.log("getImage");
                console.log(herstellerIndex);
                console.log(modelIndex);
                console.log(type);

                return type;
            }
        }
        return returnObject;
    } catch (exc) {
        console.log(exc);
        alert("Fehler beim laden der datei.");
    }
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
