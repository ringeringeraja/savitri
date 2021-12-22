/// <reference types="mongoose" />
import { Model, Query } from '../../database';
import { Controller } from './Controller';
export declare const PAGINATION_LIMIT: string | undefined;
export declare type SingleQuery<T> = Query<(T & {
    _id: any;
}), T & {
    _id: any;
}, {}, T>;
export declare type MultipleQuery<T> = Query<(T & {
    _id: any;
})[], T & {
    _id: any;
}, {}, T>;
export declare abstract class Mutable<T> extends Controller<T> {
    /**
     * @constructor
     * @param {Model<T>} model - a singleton instance of Model<T>
     */
    constructor(model: Model<T>, description: object, options?: {});
    /**
     * @method
     * Inserts a single document in the database.
     */
    insert(props: {
        what: T & {
            _id?: string;
        };
    }, response: unknown, token: any): any | Promise<any>;
    count(props: {
        filter?: object;
    }): Query<number, import("mongoose").HydratedDocument<T, {}, {}>, {}, T>;
    /**
     * @method
     * Gets a document from database.
     */
    get(props: {
        filter?: object;
    }): Query<import("mongoose").HydratedDocument<T, {}, {}> | null, import("mongoose").HydratedDocument<T, {}, {}>, {}, T>;
    /**
     * @method
     * Gets a collection of documents from database.
     */
    getAll(props: {
        filter?: object;
        offset?: number;
        sort?: any;
    }): MultipleQuery<T> | Promise<MultipleQuery<T>>;
    /**
     * @method
     * Removes a document from database.
     */
    remove(props: {
        filter: any;
    }): Query<import("mongoose").HydratedDocument<T, {}, {}> | null, import("mongoose").HydratedDocument<T, {}, {}>, {}, T>;
    /**
     * @method
     * Removing all documents from database matching the criteria.
     */
    removeAll(props: {
        filter: any;
    }): Query<import("mongodb").DeleteResult, import("mongoose").HydratedDocument<T, {}, {}>, {}, T>;
    /**
     * @method
     * Modify documents matching criteria.
     */
    modifyAll(props: {
        filter: any[];
        what: any;
    }): Query<import("mongodb").UpdateResult, import("mongoose").HydratedDocument<T, {}, {}>, {}, T>;
}
