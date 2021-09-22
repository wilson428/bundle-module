// css
import COLORS from "./styles/styles.scss";

require("./styles/HP.less");
require("./styles/code.css");

console.log("Imported colors:", COLORS);

// https://stackoverflow.com/questions/33289726/combination-of-async-function-await-settimeout
function timeout(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleep() {
	console.log("Waiting one second");
	await timeout(1000);
	console.log("One second has elapsed");
	return;
}

await sleep();

// markup
const markup = require("./html/base.html");
const HP = require("./html/HarryPotter.ejs");

const data = require("./data/data.csv");

const images = {
	Gryffindor: require("./img/Gryffindor.png"),
	Ravenclaw: require("./img/Ravenclaw.png"),
	Hufflepuff: require("./img/Hufflepuff.png"),
	Slytherin: require("./img/Slytherin.png")	
};

import testImage from "./img/Hufflepuff.png";

data.forEach(d => {
	d.img = images[d.house];
});

document.getElementById("myApp_container").classList.add("myApp");
document.getElementById("myApp_container").innerHTML = markup();

document.getElementById("HP_table").innerHTML = HP({ characters: data });

