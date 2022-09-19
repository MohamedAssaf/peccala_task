const fs = require("fs");
const os = require("os");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'peccala.csv',
    header: [
      {id: 'peccalaValue', title: 'Peccala Value'},
      {id: 'dateTime', title: 'Timestamp'},
    ]
});

require('dotenv').config();

const twoMinutesMilliSeconds = 2 * 60 * 1000;

function setEnvValue(key, value) {

    // read file from hdd & split if from a linebreak to a array
    const ENV_VARS = fs.readFileSync("./.env", "utf8").split(os.EOL);

    // find the env we want based on the key
    const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
        return line.match(new RegExp(key));
    }));

    // replace the key/value with the new value
    ENV_VARS.splice(target, 1, `${key}=${value}`);

    // write everything back to the file system
    fs.writeFileSync("./.env", ENV_VARS.join(os.EOL));

}

function dataToAddTOCSV(value, dateTime){
    const data = [
        {
          peccalaValue: value,
          dateTime,
        }
      ];
    return data;
}

let peccalaValue = process.env.peccalaValue;

const peccalaTask = async function () {
    peccalaValue = new BigDecimal(peccalaValue);
    peccalaValue = peccalaValue.multiply(2).add(1.5).divide(7.5);
    let peccalaValueString = peccalaValue.toString();
    setEnvValue("peccalaValue", peccalaValueString);
    await csvWriter
        .writeRecords(dataToAddTOCSV(peccalaValueString, new Date()))
        .then(()=> console.log('The CSV file was written successfully'));
}
// Saving first ever value of peccalaValue in csv before calculations
csvWriter
    .writeRecords(dataToAddTOCSV(peccalaValue, new Date()))
    .then(()=> console.log('The CSV file was written successfully'));

// // We should use clearInterval to practice safe code but no need here as this is just a task.
setInterval(peccalaTask, twoMinutesMilliSeconds)
