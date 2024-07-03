// Exercise API 1月10000件
const EXERCISE_KEY = "KkHBDdhaF0sYyFSVba2FGQ==RXU731Fltx4dcRhc";
const EXERCISE_URL = "https://api.api-ninjas.com/v1/exercises";

// DeepL API 1月50万語
const DEEPL_KEY = "2c972989-c128-48cf-a45e-07bd7b8ac875:fx";
const DEEPL_URL = 'https://api-free.deepl.com/v2/translate';

//  Bing Image Search API 1月1000件
const Azure_KEY = "b4ac4e0ae03b4e98907567d3314d7b32";
const Azure_URL = "https://api.bing.microsoft.com/v7.0/images/search";


async function getExerciseMenus(params) {
  const query_params = new URLSearchParams(params); 
  console.log(`${EXERCISE_URL}?` + query_params)
  
    let response = await fetch(`${EXERCISE_URL}?` + query_params, {
      headers: {
        'X-Api-Key': EXERCISE_KEY,
      }
    });

    let result = await response.json();

    console.log("Exercise: " + result);

    return await result;
}




// DEEPL API
async function getDeepLText(input_text) {

  let content = encodeURI('auth_key=' + DEEPL_KEY + '&text=' + input_text + '&source_lang=EN&target_lang=JA');
  let url = DEEPL_URL + '?' + content;

    let response = await fetch(url)
    let result = await response.json();

    console.log(result);

    return await result;
};




// Bing Search API
async function getImageData(input_text){
  const params = {
    count: 1,
    safeSearch: "Strict",
    imageType: "AnimatedGif",
    // license: "ShareCommercially",
    // cc: "JP",
    q: input_text,
  }

  const query_params = new URLSearchParams(params);

  let url = Azure_URL + '?' + query_params;
  console.log(url);

  const response = await fetch(url, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': Azure_KEY
      },
  })

  let result = await response.json();

  console.log(result);

  return await result;
}



window.addEventListener("DOMContentLoaded", (event) => {
  let myButton = document.getElementById("myButton");
  let result_box_parent = document.getElementsByClassName("result-container")[0];


  if (myButton) {
    myButton.addEventListener("click", async function() {
      while (result_box_parent.firstChild) {
        result_box_parent.removeChild(result_box_parent.firstChild);
      }

      muscle = document.getElementById("muscle-groups").value;
      type = document.getElementById("exercise-type").value;
      difficulty = document.getElementById("level").value;
      params = {};

      if(muscle != 'nothing'){
        params['muscle'] = muscle;
      }
      if(type != 'nothing'){
        params['type'] = type;
      }
      if(difficulty != 'nothing'){
        params['difficulty'] = difficulty;
      }
    
      // Exercise API
      let exercises =  await getExerciseMenus(params);
      console.log(exercises);

      if(exercises.length > 0){
        for(i=0; i < exercises.length; i++){
          let result_box_individual = document.createElement("div");
          result_box_parent.appendChild(result_box_individual);

          let title = document.createElement("p");
          let result = document.createElement("p");
          let image_box = document.createElement("div");
          let image_result = document.createElement("img");

          // DeepL API
          let deepl_title = await getDeepLText(exercises[i]["name"]);
          title.textContent = deepl_title["translations"][0]["text"];
          result_box_individual.appendChild(title);
          console.log(title.textContent);

          // DeepL API
          let deepl_result = await getDeepLText(exercises[i]["instructions"]);
          result.textContent = deepl_result["translations"][0]["text"];
          result_box_individual.appendChild(result);
          console.log(result.textContent);


          // Bing Search API
          let bingImage = await getImageData(exercises[i]["name"]);
          image_result.src = await bingImage["value"][0]["contentUrl"];
          image_box.style.textAlign = "center";
          result_box_individual.appendChild(image_box);
          image_box.appendChild(image_result);

        }
      }
      else{
        result.textContent="該当するトレーニングは存在しません。別のトレーニングタイプ・鍛えたい部位・レベルを選択してください";
      }
    });
  }
});
