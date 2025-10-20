const fs = require("fs");
const csv = require("csvtojson");


const inputFile = "./data/mgnrega.csv";
const outputFile = "./data/mgnrega_raw.json";

csv()
  .fromFile(inputFile)
  .then((jsonObj) => {
    fs.writeFileSync(outputFile, JSON.stringify(jsonObj, null, 2));
    console.log("✅ CSV converted to JSON successfully!");
  })
  .catch((err) => console.error("❌ Error:", err));
