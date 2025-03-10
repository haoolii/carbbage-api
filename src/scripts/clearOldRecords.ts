import { deleteOldRecord } from "../modules/admin/admin.service";

const run = async () => {
    const day = parseInt(process.argv[2], 10) || 30; // 預設 30 天
    console.log(`執行清除 ${day} 天資料`);
    let count = await deleteOldRecord(day);
    console.log(`清除 ${count} 筆資料`);
    console.log(`清除完成`);
}
run();