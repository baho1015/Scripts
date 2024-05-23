const apiKey = '';
const projectName = "icompany";
const dateStart = '2024-04-15T00:00:00.000Z';
const dateEnd = '2024-04-18T23:59:59.999Z';
const workspaceId = '6221c7831262ac760640b213';
const url = `https://reports.api.clockify.me/v1/workspaces/${workspaceId}/reports/detailed`;
const body = { 
    "dateRangeEnd": dateEnd,
    "dateRangeStart": dateStart,
    "detailedFilter": {},
    };
const options = {
    method: 'post',
    headers: {
        'x-api-key': apiKey,
        'content-type': 'application/json'
    },
    body: JSON.stringify(body)
}

fetch(url, options)
    .then(response => response.json())
    .then(data => {
        let result = []; 
        for (let i in data["timeentries"]){
            if (data["timeentries"][i]["projectName"] == projectName) {
                result.push ({
                "name" : data["timeentries"][i]["userName"],
                "description" : data["timeentries"][i]["description"],
                "time" : (data["timeentries"][i]["timeInterval"]["duration"]),
                })
            }
        }
        console.log(result);
        console.log("Получено записей: "+result.length)
    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(function () {
        // always executed
    });