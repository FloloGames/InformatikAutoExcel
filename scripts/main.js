const DROPDOWN_MENU_ID = "DropdownMenu";

function setInfo(data, hersteller, model) {
    setPicture(data.getImageUrlByHerstellerAndModel(hersteller, model));
    setPrice(data.getPriceByHerstellerAndModel(hersteller, model));
    setRate(data.getRateByHerstellerAndModel(hersteller, model));
    setCombi(data.getCombiByHerstellerAndModel(hersteller, model));
    setCo2(data.getCo2ByHerstellerAndModel(hersteller, model));
}
async function main() {
    var herstellerDropDown;
    var modelDropDown;
    var typDropDown;

    const data = await LoadJsonData();//LoadData();

    //this is final never chancing

    herstellerDropDown = CreateSelectionMenu("herstellerDiv", data.hersteller);
    modelDropDown = CreateSelectionMenu("modelDiv", data.models[0]);
    typDropDown = CreateSelectionMenu("typDiv", data.types["00"]);

    setInfo(data, herstellerDropDown.value, modelDropDown.value);



    herstellerDropDown.addEventListener('change', (event) => {
        RemoveAllOptions(modelDropDown);
        RemoveAllOptions(typDropDown);

        const hersteller = event.target.value;

        data.getModelsByHersteller(hersteller).forEach(element => {
            AddOptionToSelect(modelDropDown, element);
        });


        data.getTypesByHerstellerAndModel(hersteller, modelDropDown.value).forEach(element => {
            AddOptionToSelect(typDropDown, element);
        });

        setInfo(data, hersteller, modelDropDown.value);
    });

    modelDropDown.addEventListener('change', (event) => {
        const hersteller = herstellerDropDown.value;
        const model = event.target.value;
        RemoveAllOptions(typDropDown);

        data.getTypesByHerstellerAndModel(hersteller, model).forEach(element => {
            AddOptionToSelect(typDropDown, element);
        });

        setInfo(data, hersteller, model);
    });

    typDropDown.addEventListener('change', (event) => {
        //Loading Image
    });
}

async function LoadJsonData() {
    try {

        const response = await fetch("data.json");
        const json = await response.json();
        var hersteller = [];
        var models = {};//index vom hersteller
        var types = {};
        var images = {};
        var prices = {};
        var rates = {};
        var combis = {};
        var co2s = {};

        // "price": 200000,
        // "rate": 200,
        // "combi": "",
        // "co2": 202,

        const keys = Object.keys(json["hersteller"]);
        for (var i = 0; i < keys.length; i++) {
            hersteller.push(keys[i]);
            models[i.toString()] = [];
            images[i.toString()] = [];
            prices[i.toString()] = [];
            rates[i.toString()] = [];
            combis[i.toString()] = [];
            co2s[i.toString()] = [];
            var modelArr = json["hersteller"][keys[i]];
            for (var j = 0; j < modelArr.length; j++) {
                // var val = json["hersteller"][keys[i]] [Object.keys(json["hersteller"][keys[i]])] ["name"];
                models[i.toString()].push(modelArr[j]["name"]);
                images[i.toString()].push(modelArr[j]["image"]);
                prices[i.toString()].push(modelArr[j]["price"]);
                rates[i.toString()].push(modelArr[j]["rate"]);
                combis[i.toString()].push(modelArr[j]["combi"]);
                co2s[i.toString()].push(modelArr[j]["co2"]);
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
            prices: prices,
            rates: rates,
            combis: combis,
            co2s: co2s,
            getModelsByHersteller: function (herstellerName) {
                const herstellerIndex = hersteller.indexOf(herstellerName);
                const herstellerModels = models[herstellerIndex];
                return herstellerModels;
            },
            getTypesByHerstellerAndModel: function (herstellerName, modelName) {
                const herstellerIndex = hersteller.indexOf(herstellerName);
                const modelIndex = models[herstellerIndex].indexOf(modelName);
                const type = types[herstellerIndex.toString() + modelIndex.toString()];
                return type;
            },
            getImageUrlByHerstellerAndModel: function (herstellerName, modelName) {
                const herstellerIndex = hersteller.indexOf(herstellerName);
                const modelIndex = models[herstellerIndex].indexOf(modelName);
                const type = images[herstellerIndex.toString()][modelIndex.toString()];
                return type;
            },
            getPriceByHerstellerAndModel: function (herstellerName, modelName) {
                const herstellerIndex = hersteller.indexOf(herstellerName);
                const modelIndex = models[herstellerIndex].indexOf(modelName);
                const price = prices[herstellerIndex.toString()][modelIndex.toString()];
                return price;
            },
            getRateByHerstellerAndModel: function (herstellerName, modelName) {
                const herstellerIndex = hersteller.indexOf(herstellerName);
                const modelIndex = models[herstellerIndex].indexOf(modelName);
                const rate = rates[herstellerIndex.toString()][modelIndex.toString()];
                return rate;
            },
            getCombiByHerstellerAndModel: function (herstellerName, modelName) {
                const herstellerIndex = hersteller.indexOf(herstellerName);
                const modelIndex = models[herstellerIndex].indexOf(modelName);
                const combi = combis[herstellerIndex.toString()][modelIndex.toString()];
                return combi;
            },
            getCo2ByHerstellerAndModel: function (herstellerName, modelName) {
                const herstellerIndex = hersteller.indexOf(herstellerName);
                const modelIndex = models[herstellerIndex].indexOf(modelName);
                const co2 = co2s[herstellerIndex.toString()][modelIndex.toString()];
                return co2;
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
}

function setPrice(src) {
    var price = document.getElementById('price-text-id');
    price.innerHTML = src;
}
function setRate(src) {
    var rate = document.getElementById('rate-text-id');
    rate.innerHTML = src;
}
function setCombi(src) {
    var combi = document.getElementById('combi-text-id');
    combi.innerHTML = src;
}
function setCo2(src) {
    var co2 = document.getElementById('co2-text-id');
    co2.innerHTML = src;
}

main();
