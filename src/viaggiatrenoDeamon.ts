import axios from "axios";
import { ViaggiaTrenoAPIUrl, ViaggiaTrenoRSSNowPath } from "./constants";
import fs from "fs";
import path from "path";
import jsdom from "jsdom";
import cron from "node-cron";
import { prisma } from "./db_access_functions";
const { JSDOM } = jsdom;

//const respTest = fs.readFileSync(path.join(__dirname, "resp.txt")).toString();

export const getInfomobilita = async (date: Date) => {
  const convertedDate = new Date(new Date(date).setHours(0, 0, 0, 0));
  const res = await prisma.vTInfomobilita.findUnique({
    where: {
      date: convertedDate,
    },
  });
  return res;
};

export const updateCurrentInfomobilita = async (jsonData: {}) => {
  try {
    const resp = await axios.get(ViaggiaTrenoAPIUrl + ViaggiaTrenoRSSNowPath);
    const data = resp.data;
    //const data = respTest;
    const dom = new JSDOM(data);
    const infoList = dom.window.document.querySelectorAll(
      ".headingNewsAccordion"
    );
    const output = Array.from(infoList).reduce(
      (acc: Record<string, string>, news) => {
        return {
          ...acc,
          [news.innerHTML]: news.parentElement?.innerHTML || "",
        };
      },
      {}
    );
    return { ...jsonData, ...output };
  } catch (e) {
    console.log(e);
    return jsonData;
  }
};

let infoJson = {};
export const infoMobilitaDeamonJob = async () => {
  try {
    infoJson = await updateCurrentInfomobilita(infoJson);
    saveToDB(infoJson);
  } catch (e) {
    console.log("error in VTdeamonJob");
  }
};

export const startVTDeamon = async () => {
  await infoMobilitaDeamonJob();

  cron.schedule("*/20 * * * *", async () => {
    await infoMobilitaDeamonJob();
  });
  // Schedule the additional task to run once a day at 23:58 to clear avvisi
  cron.schedule("58 23 * * *", () => {
    saveToDB(infoJson);
    infoJson = {};
  });
};

const saveToDB = async (infoJson: {}) => {
  try {
    // set date as today at midnight
    const date = new Date(new Date().setHours(0, 0, 0, 0));
    const stringifiedJson = JSON.stringify(infoJson);
    await prisma.vTInfomobilita.upsert({
      where: {
        date: date,
      },
      create: {
        date: date,
        infomobilita: stringifiedJson,
      },
      update: {
        infomobilita: stringifiedJson,
      },
    });
  } catch (e) {
    console.log("error saving json infomobilita before midnight");
  }
};
