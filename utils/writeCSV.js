import fs from "fs";
import { stringify } from 'csv-stringify'

const writeCSV = (filename, columns, rows) => {
    const writableStream = fs.createWriteStream(filename);
    const stringifier = stringify({ header: true, columns: columns });
    rows.forEach(row => {
        stringifier.write(row);
    });
    stringifier.pipe(writableStream);
    console.log("Finished writing data");
}

export default writeCSV;