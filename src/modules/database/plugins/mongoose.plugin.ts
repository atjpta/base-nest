import { Schema } from 'mongoose';

import { DocType, RetType } from '../interfaces/database.interface';

export class MongoosePlugin {
  static removeProperty(obj: any, key: string) {
    for (const prop in obj) {
      if (obj[prop] instanceof Object) {
        this.removeProperty(obj[prop], key);
      } else if (prop === key) {
        delete obj[prop];
      }
    }
  }

  static removeVersionFieldPlugin(schema: Schema) {
    schema.set('toJSON', {
      transform: (_doc: DocType, ret: RetType) => {
        MongoosePlugin.removeProperty(ret, '__v');
        delete ret.__v;
        return ret;
      },
    });
  }
}
