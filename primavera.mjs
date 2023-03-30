// const https = require('https')
import fs from "fs";
// import fetch from "node-fetch";
import { Client } from "@bhavjit/khan-api";
const client = new Client();

// async function main() {
//     const replies = await client.getAllMessageReplies("ag5zfmtoYW4tYWNhZGVteXJBCxIIVXNlckRhdGEiHmthaWRfMTAzNzkwNDA4MTM5MTE4NzA4MDQ5ODUwNwwLEghGZWVkYmFjaxiAgJOjuLmJCww")
//     const contestants = [], blacklist = [], teams = ["ninjaz", "astronomers", "leviathans"], regex = {
//         join: /\$\[\s*("|')[a-zA-Z0-9 ]+("|')\s*,\s*[0-9]\s*,\s*("|')[A-Za-z0-9 ]+("|')\s*\]\$/,
//         username: /(;|function|=>|\/\/|"|'|`)/,
//     }
//     let comments = ''
//     replies.forEach(reply => {
//         let string
//         try {
//             if(!blacklist.includes(reply.author.kaid) && !regex.username.test(reply.author.nickname)){
//                 if(regex.join.test(reply.text)) string = JSON.parse(reply.text.match(/\[.+\]/))
//                 else comments += `//WARNING! join failed: ${reply.author.nickname} | ${reply.author.kaid}\n`
//             }
//             else comments += `//WARNING! blacklisted user attempted to join: ${reply.author.nickname} | ${reply.author.kaid}\n`
//         }
//         catch (e) { 
//             comments += `//ERROR! join failed: ${reply.author.nickname} | ${reply.author.kaid}\n`
//             console.error(e) 
//         }
//         if (string) {
//             if(teams.includes(string[2])){
//                 contestants.push(`{name: "${reply.author.nickname}", kaid: "${reply.author.kaid}", level: ${Math.min(Math.max(string[1], 0), 3)}, team: "${string[2]}"}`)
//                 console.log(`${reply.author.nickname} joined successfully.`)
//             }
//             else {
//                 comments += `//WARNING! invalid join code [team]: ${reply.author.nickname} | ${reply.author.kaid} | ${string[2]}\n`
//             }
//         }
//     })
//     fs.writeFile('./primaveraContestants.js', `var contestants = [${contestants}]\n${comments}`, err => {
//         if (err) console.error(err)
//     })
//     https.get("https://purge.jsdelivr.net/gh/thelegendski/automated@master/primaveraContestants.js");
// }
// main()

let rawContestants = (await (await fetch("https://raw.githubusercontent.com/thelegendski/automated/main/officialPrimaveraContestants.js")).text());
let parsedContestants = JSON.parse(eval(rawContestants.split("\n")[0].replace("var contestants = ", "JSON.stringify(").concat(")")))
let myTeam = parsedContestants.filter(x => x.team == "Aequor");

myTeam = await Promise.all(myTeam.map(async v => {
    let k = v.kaid.split("/").slice(-1)[0];
    let u = await client.getUser(k);
    return { user: u, pdata: v};
}));

fs.writeFile('./primaveraContestants.js', `var teamData = \`${JSON.stringify(myTeam)}\`;`, err => {
    if (err) console.error(err)
})
await fetch("https://purge.jsdelivr.net/gh/white-mice/automated@master/primaveraContestants.js");