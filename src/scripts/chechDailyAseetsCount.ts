import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { countAssets } from "../modules/admin/admin.service";
import { updaetConfig } from "../modules/config/config.service";

dayjs.extend(utc);

const run = async () => {
  const limit = parseInt(process.argv[2], 10) || 1000; // 預設 1000 筆

  const today = dayjs.utc().format("YYYY-MM-DD"); // 使用 UTC 時間格式化

  console.log(`執行今日 ${today} Asset 目前數量`);

  const from = dayjs.utc().startOf("day").toISOString(); // UTC 今天開始時間
  const to = dayjs.utc().endOf("day").toISOString(); // UTC 今天結束時間

  console.log(`條件 from: ${from}`);
  console.log(`條件 to: ${to}`);

  const assetsCount = await countAssets({
    from,
    to,
  });
  
  console.log(`限制 ${limit} 筆資料`);
  console.log(`目前 ${assetsCount} 筆資料`);

  if (assetsCount > limit) {
    console.log(`超過上限 暫時關閉 Asset 相關功能`);
    await updaetConfig("IMAGE_ENABLE", "false");
    await updaetConfig("MEDIA_ENABLE", "false");
  } else {
    console.log(`小於上限 正常開啟 Asset 相關功能`);
    await updaetConfig("IMAGE_ENABLE", "true");
    await updaetConfig("MEDIA_ENABLE", "true");
  }

};

run();
