import { PostImageRecordBody, PostImageRecordFormData,} from "./record.schema";

export const parsePostImageRecordFormData = (
  formData: unknown
): PostImageRecordBody => {
    try {
        if (typeof formData !== "object" || formData === null) {
          throw new Error("Invalid form data");
        }
      
        const data = formData as Partial<PostImageRecordFormData>;
        
        if (!data.passwordRequired || !data.expireIn || !Array.isArray(data.files)) {
          throw new Error("Invalid data format");
        }
      
        return {
          passwordRequired: data.passwordRequired === 'true',
          expireIn: +data.expireIn,
          files: data.files,
          prompt: data.prompt,
          password: data.password,
        };

    } catch (err) {
        console.log('err', err)
        throw new Error('Invalid form data')
    }
};
