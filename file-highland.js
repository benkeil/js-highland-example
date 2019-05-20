const fs = require('fs');
const _ = require('highland');
JSONStream = require('JSONStream')

const IN = 'random.txt';
const OUT = fs.createWriteStream('output.txt');
const batchSize = 5;

const status = ['green', 'yellow', 'red'];
const randomStatus = () => status[Math.floor(Math.random() * status.length)];

const toJsonObject = (word) => `{"word":"${word}"}`;

const transformStatus = (object) => object.status = object.status.toUpperCase();

const prettyPrint = (value) => console.log('%j', value);

_(fs.createReadStream(IN))
    .split()
    .filter((line) => line !== "")
    .take(26)
    .map(toJsonObject)
    .map(JSON.parse)
    .map(_.extend({status: randomStatus()}))
    .doto(transformStatus)
    .batch(batchSize)
    .doto(prettyPrint)
    .map((array) => JSON.stringify(array) + '\n')
    .pipe(OUT)
