"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
var PORT = 8000;
app.use(express.json());
app.get(('/'), function (req, res) {
    res.send("Hellol welcome to the classroom api");
});
app.listen(PORT, function () {
    console.log("server is running at http://localhost:".concat(PORT));
});
