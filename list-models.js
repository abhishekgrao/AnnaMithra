const API_KEY = 'AIzaSyBjsqe4mEmWL-y0soH_6AwUf7HrCnrmaGE';
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`)
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(err => console.error(err));
