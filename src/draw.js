const PImage = require('pureimage');
const fs = require('fs');
const { getDay, parse, differenceInMinutes, getTime, getMinutes } = require('date-fns')

const schColor = {
    "01" : "#D7878C",
    "02" : "#73AAD2",
    "03" : "#F0C887",
    "04" : "#87C8C0"
}

// https://stackabuse.com/reading-and-writing-json-files-with-node-js/
// https://date-fns.org/
function getDayForFilter (dateStr) {
    return getDay(parse(dateStr, 'yyyyMMdd', new Date()));
}

function getTimeForCal (timeStr) {
    return getTime(parse(timeStr, 'HHmm', new Date()));
}

// https://programmingsummaries.tistory.com/108
function findMinTime (json) {
    const startTime = json.map(e => e.start_hhmm);
    return startTime.reduce( function (prev, curr) {
        return prev < curr ? prev : curr;
    })
}

function findMaxTime (json) {
    const endTime = json.map(e => e.end_hhmm);
    return endTime.reduce( function (prev, curr) {
        return prev > curr ? prev : curr;
    })
}

function changeData (json) {
    const data = []
    for (let i = 0; i < 7; i++) {
        const dayData = json
            .filter(e => getDayForFilter(e.sch_date) == i)
            .map(e => [e.sch_kind, getTimeForCal(e.start_hhmm), getTimeForCal(e.end_hhmm)])
        data.push(dayData);
    }
    return data;
}

async function drawImage ({output, data, minTime, maxTime}) {
    const height = differenceInMinutes(maxTime, minTime) + 60;
    const img = PImage.make(450, height);
    const ctx = img.getContext('2d');
    // 바탕색
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 450, height);
    // 카드 그리기
    // - 외곽선
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#FFFFFF';
    // - 개별 카드
    const w = 50
    for (let i = 0; i < data.length; i++) {
        const day = data[i];
        const x = i * 50 + 50;
        for (const card of day) {
            ctx.fillStyle = schColor[card[0]];
            const y = differenceInMinutes(card[1], minTime) + 30;
            const h = differenceInMinutes(card[2], card[1]);
            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);
        }
    }
    // 저장
    await PImage.encodePNGToStream(img, fs.createWriteStream(`${output}.png`)).then(() => {
        console.log(`${output}.png 파일이 정상적으로 생성되었습니다`);
    }).catch((e)=>{
        console.log("png 파일 생성에 실패했습니다.");
    });
}

module.exports = async function ({json, output}) {
    const data = changeData(json);
    const minTime = getTimeForCal(findMinTime(json));
    const maxTime = getTimeForCal(findMaxTime(json));
    await drawImage({output, data, minTime, maxTime})
}