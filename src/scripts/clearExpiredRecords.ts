import { deleteExpiredRecord } from "../modules/admin/admin.service";

const run = async () => {
  console.log(`執行清除過期資料`);
  let count = await deleteExpiredRecord();
  console.log(`清除 ${count} 筆資料`);
  console.log(`清除完成`);
};
run();
