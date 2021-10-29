import fs from "fs";

const saveJsonToFile = (json: any) => {
  fs.writeFile("resp.json", json, (err) => {
    console.log(err);
  });
};

export default saveJsonToFile;
