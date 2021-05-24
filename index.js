const express = require('express')
const PImage = require('pureimage')
const fs = require('fs')
const draw = require('./src/draw')
const { format } = require('date-fns')

const app = express()
const port = 3100

// https://semtax.tistory.com/7
app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello world!');
})

app.post('/', async (req, res) => {
    if (req.body !== undefined) {
      try {
        await draw({json: req.body, output: format(new Date, 'yyMMdd_HHmmss')});
        res.send(`${format(new Date, 'yyMMdd_HHmmss')}.png`);            
      } catch (error) {
        console.error(error);
        res.send('Try again!');
      }
    } else {
      res.send('No Body!');
    }
})

app.listen(port, () => {
    console.log(`테스트 앱 : http://localhost:${port}`)
})
