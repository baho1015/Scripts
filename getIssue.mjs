import axios from 'axios';

const name = "baho1015";
const repo_name = "test";
const instance = axios.create({
  baseURL: 'https://api.github.com/',
  headers: {
    Authorization:
      'Bearer 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',
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  },
});

instance
  .get(`/repos/${name}/${repo_name}/issues?state=all`)
  .then(function (response) {

    let title = [];
    let status = [];
    let label = ['Пусто'];

    for (const i in response.data) {
      console.log('Проблема: '+ (title[i] = response.data[i]['title']));
      console.log('Статус: '+ (status[i] = response.data[i]['state']));
      for (const j in response.data[i]['labels']) {
          if (response.data[i]['labels'][j]['name']) label[j] = response.data[i]['labels'][j]['name'];
        }
      console.log('Метки: '+ (label));
      label = ['Пусто'];
    }  
    
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });