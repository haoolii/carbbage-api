import db from "../../../config/db";

export const getAdminByEmail = async (email: string) => {
  return db.admin.findUnique({
    where: {
      email,
    },
  });
};

export const createAdmin = async (email: string, passwordHash: string) => {
  return db.admin.create({
    data: {
      email,
      password: passwordHash,
    },
  });
};

