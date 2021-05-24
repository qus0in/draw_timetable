const draw = require('../src/draw')
const fs = require('fs')

// https://jestjs.io/docs/getting-started
// https://stackoverflow.com/questions/47144187/can-you-write-async-tests-that-expect-tothrow

test('draw 1', async done => {
    const ex1 = JSON.parse(fs.readFileSync('data/ex1.json'));
    await draw({ json: ex1, output: 'out-1' });
    done();
})

test('draw 2', async done => {
    const ex2 = JSON.parse(fs.readFileSync('data/ex2.json'));
    await draw({ json: ex2, output: 'out-2' });
    done();
})

test('draw 3', async done => {
    const ex3 = JSON.parse(fs.readFileSync('data/ex3.json'));
    await draw({ json: ex3, output: 'out-3' });
    done();
})