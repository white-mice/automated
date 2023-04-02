// const https = require('https')
import fs from "fs";
import { Client } from "@bhavjit/khan-api";
const client = new Client();

let rawContestants = (await (await fetch(
    "https://raw.githubusercontent.com/thelegendski/automated/main/officialPrimaveraContestants.js"
    )).text());

let parsedContestants = JSON.parse(eval(
    rawContestants.split("\n")[0]
        .replace("var contestants = ", "JSON.stringify(")
        .concat(")")))

let myTeam = parsedContestants.filter(x => x.team == "Aequor");

myTeam = await Promise.all(myTeam.map(async v => {
    let k = v.kaid.split("/").slice(-1)[0];
    let u = await client.getUser(k);
    return { user: u, pdata: v};
}));
// remove dupes
myTeam = myTeam.filter((v,i,a)=>a.findIndex(v2=>(v2.user.kaid===v.user.kaid))===i)

let teamRepr = Buffer.from(JSON.stringify(myTeam)).toString("base64");

let scores = (await client.getProgram("5528901184176128")).code
    .split("\n")
    .find(v => v.startsWith('                    {name: "aequor", scores: '));

scores = eval(scores.slice(
    '                    {name: "aequor", scores: '.length, scores.length-2))
let totalScore = scores.reduce(function (x, y) {
        return x + y;
    }, 0);

fs.writeFile('./primaveraContestants.js', `
var teamRoundScores = [${scores}];
var teamTotalScore = ${totalScore};
var teamData = \`${teamRepr}\`;`, err => {
    if (err) console.error(err)
})
await fetch("https://purge.jsdelivr.net/gh/white-mice/automated@master/primaveraContestants.js");