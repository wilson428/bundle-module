// css
require("./styles/styles.scss");
require("./styles/HP.less");
require("./styles/code.css");

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

