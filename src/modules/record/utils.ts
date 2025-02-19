import { PostImageRecordFormData, PostMediaRecordFormData } from "./record.schema";

export const imageRecordParser = (formDataBody: unknown) => {
    const body = formDataBody as PostImageRecordFormData;
    return {
      prompt: body.prompt?.toString() || "",
      password: body.password?.toString() || "",
      passwordRequired: body.passwordRequired=== "true",
      expireIn: Number(body.expireIn) || 0,
    };
  };
  

  export const mediaRecordParser = (formDataBody: unknown) => {
    const body = formDataBody as PostMediaRecordFormData;
    return {
      prompt: body.prompt?.toString() || "",
      password: body.password?.toString() || "",
      passwordRequired: body.passwordRequired=== "true",
      expireIn: Number(body.expireIn) || 0,
    };
  };
  