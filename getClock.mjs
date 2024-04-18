// id: '624e83ab8c3daa3f9d9c6bcc',
// name: 'icompany',
// workspaceId: '6221c7831262ac760640b213',
const dateStart = '2024-04-15T00:00:00.000Z';
const dateEnd = '2024-04-17T23:59:59.999Z';
const apiKey = 'NNN';
const workspaceId = '6221c7831262ac760640b213';
const url = `https://reports.api.clockify.me/v1/workspaces/${workspaceId}/reports/detailed`;
const body = { 
    'dateRangeEnd': dateEnd,
    'dateRangeStart': dateStart,
    'detailedFilter': {}
    };
const response = await fetch(url,{
    method: 'post',
    headers: {
        'x-api-key': apiKey,
        'content-type': 'application/json'
    },
    body: JSON.stringify(body)
});
const data = await response.json();


console.log(data);