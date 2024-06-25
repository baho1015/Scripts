import 'dotenv/config'
import { Octokit } from '@octokit/rest'
const octokit = new Octokit({auth: process.env.GITHUB_TOKEN})
const issue_number = 1305
const dateStart="2024-05-30T00:00:00.000Z"
const dateEnd="2024-05-30T23:59:59.000Z"

console.log( await mergeIssues(issue_number, dateStart, dateEnd) )

async function mergeIssues(issue_number, dateStart, dateEnd){
    const clock = await getClock(dateStart, dateEnd)
    const issue = await getIssue(issue_number)

    let result = []
    let ids = []
    ids.push (issue["id"])
    if (issue["ids"]) {
        for (const i in issue["ids"]) {
            ids.push(issue["ids"][i])
        }
    }
    for (const i in ids) {
        if (clock[ids[i]]) {
            for (const j in clock[ids[i]]) {
                const time = clock[ids[i]][j].time / 3600
                result.push({
                    'name': clock[ids[i]][j].name,
                    'time': parseFloat(time.toFixed(1))
                })
            }
        }
    }

    return result  
}

function getClock(dateStart, dateEnd){
    const url = `https://reports.api.clockify.me/v1/workspaces/${process.env.WORKSPACE_ID}/reports/detailed`;
    const body = { 
        "dateRangeEnd": dateEnd,
        "dateRangeStart": dateStart,
        "detailedFilter": {},
        }
    const options = {
        method: 'post',
        headers: {
            'x-api-key': process.env.CLOCKIFY_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify(body)
    }
    return fetch(url, options)
    .then(response => response.json())
    .then(data => {
        let result = {}; 
        for (let i in data["timeentries"]){
            const matches = data["timeentries"][i]["description"].match(/#[\d]{1,6}/)
            if (matches) {
                const id_issue = matches[0].replace(/#/g, "")
                if (!(id_issue in result)){
                    result[id_issue] = []
                }
                let flag = true
                for (let elem in result[id_issue]){
                    if (result[id_issue][elem]['name'] == data["timeentries"][i]["userName"]){
                        result[id_issue][elem]['time'] += data["timeentries"][i]["timeInterval"]["duration"]
                        flag = false
                    }
                }
                if (flag){
                    result[id_issue].push({
                        "name" : data["timeentries"][i]["userName"],
                        "description" : (data["timeentries"][i]["description"]),
                        "time" : (data["timeentries"][i]["timeInterval"]["duration"]),
                    })
                }
            }
        }
        return result
    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(function () {
        // always executed
    });

}

async function getIssue(issue_number){
    
    const { data: issue } = await octokit.issues.get({
        owner: process.env.OWNER,
        repo: process.env.REPO,
        issue_number: issue_number
    })

    let result = {}
    let label = issue.labels.map(label => label.name)
    let comments = `${issue.body} + ${await getComments(issue.number)}`
    // [...comments.matchAll(/(\[.\]).*?issues\/(\d{1,6})/g)].map(match => match[2]) - для ссылок "https://github.com/OWNER/REPO/issues/id"
    // [...comments.matchAll(/#(\d{1,6})/g)].map(match => match[1]) - для "#id"

    let ids = []
    if (comments) {
        let text = []

        if ([...comments.matchAll(/(\[x\]).*?issues\/(\d{1,6})/g)].map(match => match[2]).length !==0) {
            text = [...comments.matchAll(/(\[x\]).*?issues\/(\d{1,6})/g)].map(match => match[2])
        }
        if ([...comments.matchAll(/#(\d{1,6})/g)].map(match => match[1]).length !==0) {
            text = [...comments.matchAll(/#(\d{1,6})/g)].map(match => match[1])
        }
        
        if (text) {
            for (const match in text) {
                if (issue.number != text[match]) {
                    ids.push(parseInt(text[match]))
                }
            }
        }
    }
    
    result = {
        "id": issue.number,
        "name": issue.title,
        "status": issue.state,
        "label": label,
        "ids": [...new Set(ids)]
    }   
    return result
    
    
}

async function getComments(id_issue){
    const { data: comments } = await octokit.issues.listComments({ 
        owner: process.env.OWNER, 
        repo: process.env.REPO, 
        issue_number: id_issue
    })
    let text = []
    for (const i in comments){
        if (comments[i].body) text[i] = (comments[i].body)
    }
    return text
}