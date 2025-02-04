import { Original, Record } from "@prisma/client";

export class RecordOriginalsDto {
  private record: Record;
  private originals: Original[] = [];

  constructor(record: Record, originals: Original[]) {
    this.record = record;
    this.originals = originals;
  }

  get() {
    return {
      uniqueId: this.record.uniqueId,
    };
  }

  getPublic() {
    if (this.record.passwordRequired) {
      return {
        uniqueId: this.record.uniqueId,
        type: this.record.type,
        prompt: this.record.prompt,
        passwordRequired: this.record.passwordRequired,
        createdAt: this.record.createdAt,
      };
    }
    return {
      uniqueId: this.record.uniqueId,
      type: this.record.type,
      prompt: this.record.prompt,
      createdAt: this.record.createdAt,
      originals: this.originals.map((original) => ({
        content: original.content,
      })),
    };
  }

  getPrivate() {
    return {
      uniqueId: this.record.uniqueId,
      type: this.record.type,
      prompt: this.record.prompt,
      passwordRequired: this.record.passwordRequired,
      createdAt: this.record.createdAt,
      originals: this.originals.map((original) => ({
        content: original.content,
      })),
    };
  }
}
