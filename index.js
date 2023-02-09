import chalk from 'chalk'
import fs from 'fs/promises'
import {formatDistanceToNow, isAfter, isBefore, parse, format, isToday, set} from 'date-fns'
import {Command} from 'commander';
import getGitVersion from './src/getGitVersion.js';

const gitVersion = await getGitVersion();
const first = 'Max';
const last = 'Häggman';

const argumentParser = new Command();
argumentParser.option('--date')
argumentParser.parse();

// process.env.npm_config_user_agent only works when using `npm run start` not `node index.js`
const npmAndNode = process.env.npm_config_user_agent;
const startOfCourse = new Date(2023, 0, 31)
const daysSinceStartOfCourse = formatDistanceToNow(startOfCourse);
const dateStringSentAsArgument = argumentParser.args[0]
const dateSentAsArgument = parse(dateStringSentAsArgument, 'yyyy-MM-dd', new Date())
const currentDate = set(new Date(), {hours: 0, minutes: 0, seconds: 0, milliseconds: 0})
const currentDateAndTime = format(new Date(), 'yyyy-MM-dd HH:mm');

let datesCompared = '';
let definedDate = '';

function compareDates() {
    if (isAfter(dateSentAsArgument, currentDate)) {
        datesCompared = 'after' 
        console.log(`The Entered date: "${dateStringSentAsArgument}" is after today's date`)
    } else if (isBefore(dateSentAsArgument, currentDate)) {
        datesCompared = 'before'
        console.log(`The Entered date: "${dateStringSentAsArgument}" is before today's date`)
    } else if (isToday(dateSentAsArgument, currentDate)){
        datesCompared = 'currently'
        console.log(`The Entered date: "${dateStringSentAsArgument}" is today`)
    } else {
        console.log((chalk.bgYellow)`You can also try to enter a date after "npm run start" or "node index.js" like so: "npm run start yyyy-mm-dd"`);
    }
}

compareDates();

if (dateStringSentAsArgument === undefined) {
    definedDate = `<span class="undefined">Try to enter a date after "npm run start" or "node index.js" like so: "npm run start yyyy-mm-dd"</span>`;
} else {
    definedDate =  `The entered date <span class="results">${dateStringSentAsArgument}</span> is <span class="results">${datesCompared}</span> today's date!`;
}

const fileContent = `
Name: ${first} ${last}  
npm & node: ${npmAndNode}  
Git version: ${gitVersion}  
Days since start of course: ${daysSinceStartOfCourse}  
Today's date and time: ${currentDateAndTime}  
Entered date is ${dateStringSentAsArgument} and it is ${datesCompared} today's date!  
`;

const htmlFile = `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="stylesheet" href="index.css" />
    	<title>Assignment 2</title>
	</head>
	<body>
		<header class="header">
			<h1>Assignment 2</h1>
    	</header>
    	<main class="content">
			<div class="content-item">
				npm & node version: <span class="results">${npmAndNode}</span>
			</div>
			<div class="content-item">
			Git version: <span class="results">${gitVersion}</span>
			</div>
			<div class="content-item">
				Days since start of course: <span class="results">${daysSinceStartOfCourse}</span>
			</div>
			<div class="content-item">
				Today's date and time: <span class="results">${currentDateAndTime}</span>
			</div>
			<div class="content-item">
                ${definedDate}
			</div>
    	</main>	
    </body>
</html>
`;

const cssFile = `
html {
	font-size: 10px;
	height: 100vh;
  }
  
body {
	background-color: #000000;
    color: #fff;
	font-family: sans-serif;
	font-size: 1.4rem;
	height: 100%;
	line-height: 1.6;
	margin: 0 96px;
}
  
* {
	box-sizing: border-box;
}

.header {
	align-items: center;
    border-bottom: 3px solid #fff;
	display: flex;
	height: 20vh;
	justify-content: center;
}

.content {
	height: 60vh;
	padding: 56px;
}

.content-item {
	font-size: 20px;
	margin-bottom: 12px;
}

.results {
	font-weight: 700;
}

.undefined {
    color: #FFFF00;
}
`;

await fs.writeFile('index.md', fileContent);
await fs.writeFile('index.html', htmlFile);
await fs.writeFile('index.css', cssFile);


