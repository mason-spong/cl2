
document.getElementById('guess-button').addEventListener('click', getNameGuesses);
document.getElementById('name').addEventListener('click', e => {
  document.getElementsByTagName('i')[0].style.display = 'none';
});

let agifyUrlBase = "https://api.agify.io?name=";
let genderizeUrlBase = "https://api.genderize.io?name=";
let nationalizeUrlBase = "https://api.nationalize.io?name=";

function getNameGuesses(e) {
  e.preventDefault();
  removeAllChildren(document.getElementById("boxes"));
  let name = document.getElementById('name').value;
  queryAPI(name, agifyUrlBase, displayAgify);
  queryAPI(name, genderizeUrlBase, displayGenderize);
  queryAPI(name, nationalizeUrlBase, displayNationalize);
  
  

}

function queryAPI(name, urlBase, disp) {
  url = urlBase + name;
  let test = "this is a test";
  fetch(url)
    .then((response) => {
      let responseJson = response.json()

      if (response.status != 200) {
        return {
          isSuccessResponse: false,
          json: responseJson
        }
      } else {
        return {
          isSuccessResponse: true,
          json: responseJson
        }
      }

    })
    .then(responseJson => {
      disp(responseJson);
    })
}

function removeAllChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function displayFailure(jsonPromise, apiName) {
  jsonPromise.then(json => {
    let failBox = createFailBox(apiName);
    document.getElementById("boxes").appendChild(failBox);
  })
}

function displayAgify(responseJson) {
  if (responseJson.isSuccessResponse) {
    responseJson.json.then(json => {
      if (json.age == null) {
        displayFailure(responseJson.json, "agify");
      } else {
        let agifyBox = createBox("agify", json);
        document.getElementById("boxes").appendChild(agifyBox);
      }
    })
  } 
  
}

function displayNationalize(responseJson) {
  if (responseJson.isSuccessResponse) {
    responseJson.json.then(json => {
      if (json.country.length == 0) {
        displayFailure(responseJson.json, "nationalize");
      } else {
        let nationalizeBox = createBox("nationalize", json);
        document.getElementById("boxes").appendChild(nationalizeBox);
      }
    })
  } else {
    displayFailure(responseJson.json, "nationalize");
  }
  
}

function displayGenderize(responseJson) {
  if (responseJson.isSuccessResponse) {
    responseJson.json.then(json => {
      if (json.gender == null) {
        displayFailure(responseJson.json, "genderize");
      } else {
        let genderizeBox = createBox("genderize", json);
        document.getElementById("boxes").appendChild(genderizeBox);
      } 
    })
  } else {
    displayFailure(responseJson.json, "genderize");
  }
  
}

function createBox(boxName, json) {

  let box = document.createElement("div");
  box.classList.add(boxName + "-box", "box");

  let boxContent = document.createElement("div");
  boxContent.classList.add("box-content");

  let h2 = document.createElement("h2");
  h2.classList.add("api-title");

  let data = document.createElement("div");
  data.classList.add("data");

  let probBar = document.createElement("div");
  probBar.classList.add("probability-bar");

  let data_text = null;
  let h2_text = null;

  if (boxName == "agify") {
    h2_text = "You're probably...";
    data_text = json.age + " years old";
  } else if (boxName == "nationalize") {
    h2_text = "You most likely hail from...";
    data_text = json.country[0].country_id + " (" + Math.round((json.country[0].probability * 100)) + "% probability)";
    setupProbBar(probBar, json.country[0].probability);
  } else {
    h2_text = "I think you're probably a...";
    data_text = json.gender + " (" + Math.round((json.probability * 100)) + "% probability)";
    setupProbBar(probBar, json.probability);
  }

  h2.textContent = h2_text;

  let p = document.createElement("p");
  p.classList.add(boxName + "-data");
  p.textContent = data_text;

  box.appendChild(boxContent);
  boxContent.appendChild(h2);
  boxContent.appendChild(data);
  boxContent.appendChild(probBar);
  data.appendChild(p);
  return box;
}

function setupProbBar(probBar, prob) {
  if (probBar != null) {
    let width = (prob * 100).toString();
    probBar.style.width = width + "%";
    probBar.style.height = "20px";
    probBar.style.backgroundColor = "black";
  }
}

function createFailBox(apiName) {

  let box = document.createElement("div");
  box.classList.add("box");
  box.style.backgroundColor = "rgb(250, 122, 90)";

  let boxContent = document.createElement("div");
  boxContent.classList.add("box-content");

  let h2 = document.createElement("h2");
  h2.classList.add("api-title");
  h2.textContent = apiName + " failed, please try a different name";

  box.appendChild(boxContent);
  boxContent.appendChild(h2);
  return box;
}
