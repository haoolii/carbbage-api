import { deleteOldRecord } from "../modules/admin/admin.service";

const run = async () => {
    const day = 30;
    console.log(`執行清除 ${day} 天資料`);
    await deleteOldRecord(day);
    console.log(`清除完成`);
}
run();