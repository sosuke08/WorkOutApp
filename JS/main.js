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
  let url = Azure_URL+ '?count=1&safeSearch=Strict&imageType=AnimatedGif&q=' + input_text;

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
  let translation_result = document.getElementById("translation_result");
  let image_result = document.getElementById("image_result");


  if (myButton) {
    myButton.addEventListener("click", async function() {
      result.textContent=""
      translation_result.textContent=""
      const params = { // 渡したいパラメータをJSON形式で書く
        muscle: document.getElementById("muscle-groups").value,
        type:document.getElementById("exercise-type").value,
        difficulty:document.getElementById("level").value,
      };

      console.log(params);
    
      // Exercise API
      let exercises =  await getExerciseMenus(params);

      if(exercises.length>0){
      result.textContent = exercises[0]["instructions"];
      console.log(exercises[0])

      // DeepL API
      let deepl = await getDeepLText(exercises[0]["instructions"]);
      translation_result.textContent = deepl["translations"][0]["text"];

      // Bing Search API
      let bingImage = await getImageData(exercises[0]["name"]);
      console.log(bingImage)
      image_result.src = bingImage["value"][0]["contentUrl"];

      }
      else{
        result.textContent="該当するトレーニングは存在しません。別のトレーニングタイプ・鍛えたい部位・レベルを選択してください"
      }
    });
  }
});
