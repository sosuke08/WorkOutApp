var muscle = "biceps"

async function getData(url, data = {}) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'X-Api-Key': 'KkHBDdhaF0sYyFSVba2FGQ==RXU731Fltx4dcRhc'
    },
  });
  return response; 
}

getData('https://api.api-ninjas.com/v1/exercises?muscle=' + muscle, { answer: 42 }).then((data) => {
  console.log(data); 
});