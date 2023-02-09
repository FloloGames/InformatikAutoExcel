const DROPDOWN_MENU_ID = "DropdownMenu";

var herstellerDropDown;
var modelDropDown;
var typDropDown;

function LoadData() {
    var data = readStringFromFilePath("erklaerung.txt").split(' ').join('').split("\r").join("");
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
    console.log(hersteller);

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
                models[i].push(modelName);
                // console.log(modelName);
                types[i.toString()+(j-1).toString()] = modelNameWithDataList;
            } catch (err) {
                console.log(err);
            }
        }
    }
    
    console.log(models);
    console.log(types);

    console.log(types["01"][0]);//typ1vonModel2VonH1

}
function CreateSelectionMenus() {
    herstellerDropDown = CreateSelectionMenu("herstellerDiv", "hersteller");
    modelDropDown = CreateSelectionMenu("modelDiv", "model");
    typDropDown = CreateSelectionMenu("typDiv", "typ");
}
function CreateSelectionMenu(divName, loadDataName) {
    var whereToPut = document.getElementById(divName);
    var newDropdown = document.createElement('select');
    newDropdown.setAttribute('id', divName + DROPDOWN_MENU_ID);
    whereToPut.appendChild(newDropdown);
    AddOptionToSelect(newDropdown, "Test");
    AddOptionToSelect(newDropdown, "Test1");
    AddOptionToSelect(newDropdown, "Test2");
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
    var optionApple = document.createElement("option");
    optionApple.text = text;
    dropdownMenu.add(optionApple, dropdownMenu.options[null]);
}
LoadData();
CreateSelectionMenus();