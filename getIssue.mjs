const name = "baho1015";
const repo_name = "test";
const apiKey = "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";
const url = `https://api.github.com/repos/${name}/${repo_name}/issues?state=all`
const options = {
  method: 'get',
  headers: {
    Authorization:
    `Bearer ${apiKey}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  },
};

fetch(url, options)
  .then(response => response.json())
  .then(data => {

    let title = [];
    let status = [];
    let label = ['Пусто'];
    let result = [];

    for (const i in data) {
      result.push({
        "issue" : data[i]['title'],
        "status" : data[i]['state'],
      });
      console.log('Проблема: '+ (title[i] = data[i]['title']));
      console.log('Статус: '+ (status[i] = data[i]['state']));
      for (const j in data[i]['labels']) {
          if (data[i]['labels'][j]['name']) label[j] = data[i]['labels'][j]['name'];
        };
      console.log('Метки: '+ (label));
      label = ['Пусто'];
    }  
    console.log(result);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });