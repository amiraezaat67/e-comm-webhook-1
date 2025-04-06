import { DeleteResult, Document, FilterQuery, Model, PopulateOptions, Query, QueryOptions, SortOrder, Types, UpdateQuery } from "mongoose";


interface IFindOneOptions<TDocument> {
    filters: FilterQuery<TDocument>
    select?: string
    populateArray?: PopulateOptions[]
    lean?: boolean
}
interface IFindManyOptions<TDocument> {
    filters?: FilterQuery<TDocument>
    select?: string
    populateArray?: PopulateOptions[]
    lean?: boolean,
    limit?: number,
    skip?: number,
    sort?: { [key: string]: SortOrder }
}


export abstract class BaseService<TDocument extends Document> {
    constructor(private readonly model: Model<TDocument>) { }

    async find({
        filters = {},
        select = '',
        populateArray = [],
        limit = 10,
        skip = 0,
        sort = {},
        lean = false
    }: IFindManyOptions<TDocument> = {}): Promise<TDocument[] | object[]> {
        console.log(`The find options`, { filters, select, populateArray, limit, skip, sort, lean });

        let baseQuery = this.model.find(filters, select)

        if (limit || skip) baseQuery = baseQuery.limit(limit).skip(skip)
        if (populateArray.length) baseQuery = baseQuery.populate(populateArray)
        if (Object.keys(sort).length) baseQuery = baseQuery.sort(sort)
        if (lean) baseQuery.lean()

        return await baseQuery.exec()
    }

    async saveToUpdate(document: TDocument): Promise<TDocument> {
        return await document.save();
    }

    async create(document: Partial<TDocument>): Promise<TDocument> {
        return await this.model.create(document);
    }

    async findOne({
        filters,
        select = '',
        populateArray = [],
        lean = false
    }: IFindOneOptions<TDocument>): Promise<TDocument | null> {
        return await this.model.findOne(filters, select).populate(populateArray)
    }

    async findById(_id: string | Types.ObjectId): Promise<TDocument | null> {
        return await this.model.findById(_id)
    }


    async deleteOne({ filters }: { filters: FilterQuery<TDocument> }): Promise<TDocument | null> {
        if (filters._id) return await this.model.findByIdAndDelete(filters._id)
        return await this.model.findOneAndDelete(filters);
    }

    async deleteMany({ filters }: { filters: FilterQuery<TDocument> }): Promise<DeleteResult> {
        console.log(`Deleting many documents with filters: ${JSON.stringify(filters)}`);

        return await this.model.deleteMany(filters);
    }

    async updateOne({ filters, update, options }: { filters: FilterQuery<TDocument>, update: UpdateQuery<TDocument>, options?: QueryOptions }): Promise<TDocument | null> {
        if (filters._id) return await this.model.findByIdAndUpdate(filters._id, update)
        return await this.model.findOneAndUpdate(filters, update, options);
    }

}