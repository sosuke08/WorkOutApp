const EXERCISE_KEY = "KkHBDdhaF0sYyFSVba2FGQ==RXU731Fltx4dcRhc";
const EXERCISE_URL = "https://api.api-ninjas.com/v1/exercises";

const DEEPL_KEY = "2c972989-c128-48cf-a45e-07bd7b8ac875:fx";
const DEEPL_URL = 'https://api-free.deepl.com/v2/translate';


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



window.addEventListener("DOMContentLoaded", (event) => {
  let myButton = document.getElementById("myButton");
  let result = document.getElementById("result");
  let translation_result = document.getElementById("translation_result");


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
      }
      else{
        result.textContent="該当するトレーニングは存在しません。別のトレーニングタイプ・鍛えたい部位・レベルを選択してください"
      }
    });
    
  }
});