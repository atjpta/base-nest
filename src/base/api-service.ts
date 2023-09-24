import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class BaseApiService<T> {
  protected _objectId = mongoose.Types.ObjectId;

  constructor(@InjectModel('Schema') protected readonly _model: Model<T>) {}

  public async getTotalRow(): Promise<number> {
    return this._model.countDocuments();
  }

  public async getTotalFilterRow(filter: object): Promise<number> {
    return this._model.count(filter);
  }

  public async findAll(page: number, limit: number): Promise<T[]> {
    const skipIndex = (page - 1) * limit;

    const records = await this._model
      .find()
      .sort('-createdAt')
      .limit(limit)
      .skip(skipIndex)
      .exec();

    return records;
  }

  public async findAllAndPopulate(
    page: number,
    limit: number,
    populate: string,
  ): Promise<T[]> {
    const skipIndex = (page - 1) * limit;

    const records = await this._model
      .find()
      .populate(populate)
      .sort('-createdAt')
      .limit(limit)
      .skip(skipIndex)
      .exec();

    return records;
  }

  public async create<DTO>(data: DTO): Promise<T> {
    const records = this._model.create(data);
    return records;
  }

  public async findOneById(id: string): Promise<T | null> {
    const _id = this._getID(id);
    const record = await this._model.findById(_id).exec();
    return record;
  }

  public async findOneByField(field: object): Promise<T> {
    const record = await this._model.findOne(field).exec();
    return record;
  }

  public _getID(id: string): mongoose.Types.ObjectId | null {
    const objectId = mongoose.Types.ObjectId;
    const newID = new objectId(id) ?? null;
    return newID;
  }

  public async update(id: string, data: object): Promise<T> {
    const _id = this._getID(id);

    const records = await this._model.findByIdAndUpdate(_id, data, {
      new: true,
    });

    return records;
  }

  public async removeById(id: string): Promise<T | null> {
    const getID = this._getID(id);
    const result = await this._model.findByIdAndRemove(getID).exec();
    return result;
  }

  public async deleteAll(): Promise<mongoose.mongo.DeleteResult> {
    const docs = await this._model.deleteMany();
    return docs;
  }

  public async findAllSearchDefault(
    key: string,
    page: number,
    limit: number,
    populate?: string,
  ): Promise<T[]> {
    const skipIndex = (page - 1) * limit;
    const condition = key ? { $text: { $search: key } } : {};

    const records = await this._model
      .find(condition)
      .populate(populate)
      .sort('-createdAt')
      .limit(limit)
      .skip(skipIndex)
      .exec();
    return records;
  }

  public async findAllSearchCountDefault(key: string): Promise<number> {
    const condition = key ? { $text: { $search: key } } : {};
    const records = await this._model.find(condition).exec();
    return records.length;
  }
}
