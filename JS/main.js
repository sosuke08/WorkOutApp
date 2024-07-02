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
  let result = document.getElementById("result");


  if (myButton) {
    myButton.addEventListener("click", async function() {
      let result = document.getElementById('result');
      result.textContent = ''
      muscle = document.getElementById("muscle-groups").value
      type = document.getElementById("exercise-type").value
      difficulty = document.getElementById("level").value
      params = {}
      if(muscle != 'nothing'){
        params['muscle'] = muscle
      }
      if(type != 'nothing'){
        params['type'] = type
      }
      if(difficulty != 'nothing'){
        params['difficulty'] = difficulty
      }
    
      // Exercise API
      let exercises =  await getExerciseMenus(params);

      if(exercises.length>0){
        result.innerHTML = '';  // Clear any existing content
        for (let i = 0; i < exercises.length; i++) {
            const container = document.createElement('div');
            container.className = 'container';
            
            const textDiv = document.createElement('div');
            let deepl = await getDeepLText(exercises[i]["instructions"]);
            console.log(exercises[i]["instructions"])
            textDiv.textContent = deepl["translations"][0]["text"];
            const img = document.createElement('img');
            let bingImage = await getImageData(exercises[i]["name"]);
            img.src = await bingImage["value"][0]["contentUrl"];
            img.alt = deepl["translations"][0]["text"];
        
            container.appendChild(textDiv);
            container.appendChild(img);
        
            result.appendChild(container);
        }      }
      else{
        result.textContent="該当するトレーニングは存在しません。別のトレーニングタイプ・鍛えたい部位・レベルを選択してください"
      }
    });
  }
});

