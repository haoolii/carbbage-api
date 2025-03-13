import { updaetConfig } from "../modules/config/config.service";

const run = async () => {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error("請輸入一個 key 和一個 value！");
    process.exit(1);
  }

  const [key, value] = args;

  console.log(`KEY: ${key}, VALUE:${value}`);
  console.log(`執行更新 ${key}=${value}`);
  let count = await updaetConfig(key, value);
  console.log(`更新完成`);
};
run();
