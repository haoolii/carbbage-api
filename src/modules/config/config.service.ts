import db from "../../config/db";

export const getConfigs = async () => {
  const configs = await db.config.findMany();

  return (
    configs.map((config) => ({ key: config.key, value: config.value })) || []
  );
};

export const updaetConfig = async (key: string, value: string) => {
  await db.config.update({
    where: {
      key,
    },
    data: {
      value,
    },
  });
};
