// const http = require ("http");
import http from "http";
// const yourName = require ("./feature.js");
import nameCanBeAny from "./feature.js";
import {yourName2, yourName3} from "./feature.js";
import { generatePercentage } from "./feature.js";

console.log(nameCanBeAny);
console.log(yourName2);
console.log(yourName3);


const server = http.createServer((req, res) => {
    if (req.url === "/about"){
        res.end(" About Page ");
    }
    else if (req.url ==="/") {
        res.end("Home page");
    }
    else if (req.url ==="/contact")
    {
        res.end(`Contact page percentage is ${generatePercentage}`);
    }
    else 
    {
        res.end("Page Not Found");
    }

});

server.listen(5000,() =>{
console.log("Server is working");
});

