import { Asset, Record, Url } from "@prisma/client";

export class RecordAssetsUrlsDto {
  private record: Record;
  private assets: Asset[] = [];
  private urls: Url[] = [];

  constructor(record: Record, assets: Asset[], urls: Url[]) {
    this.record = record;
    this.assets = assets;
    this.urls = urls;
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
      urls: this.urls,
      assets: this.assets.map(asset => ({
        filename: asset.filename
      }))
    };
  }

  getPrivate() {
    return {
      uniqueId: this.record.uniqueId,
      type: this.record.type,
      prompt: this.record.prompt,
      passwordRequired: this.record.passwordRequired,
      createdAt: this.record.createdAt,
      urls: this.urls,
      assets: this.assets.map(asset => ({
        filename: asset.filename,
      }))
    };
  }
}
