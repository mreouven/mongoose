declare module "mongoose" {
  import events = require('events');
  import mongodb = require('mongodb');
  import mongoose = require('mongoose');

  /** Opens Mongoose's default connection to MongoDB, see [connections docs](https://mongoosejs.com/docs/connections.html) */
  export function connect(uri: string, options: ConnectOptions, callback: (err: Error) => void): void;
  export function connect(uri: string, callback: (err: Error) => void): void;
  export function connect(uri: string, options?: ConnectOptions): Promise<Mongoose>;

  /** Creates a Connection instance. */
  export function createConnection(uri: string, options?: ConnectOptions): Promise<Connection>;
  export function createConnection(): Connection;
  export function createConnection(uri: string, options: ConnectOptions, callback: (err: Error | null, conn: Connection) => void): void;

  export function model<T extends Document>(name: string, schema?: Schema, collection?: string, skipInit?: boolean): Model<T>;

  type Mongoose = typeof mongoose;

  interface ConnectOptions extends mongodb.MongoClientOptions {
    /** Set to false to [disable buffering](http://mongoosejs.com/docs/faq.html#callback_never_executes) on all models associated with this connection. */
    bufferCommands?: boolean;
    /** The name of the database you want to use. If not provided, Mongoose uses the database name from connection string. */
    dbName?: string;
    /** username for authentication, equivalent to `options.auth.user`. Maintained for backwards compatibility. */
    user?: string;
    /** password for authentication, equivalent to `options.auth.password`. Maintained for backwards compatibility. */
    pass?: string;
    /** Set to false to disable automatic index creation for all models associated with this connection. */
    autoIndex?: boolean;
    /** True by default. Set to `false` to make `findOneAndUpdate()` and `findOneAndRemove()` use native `findOneAndUpdate()` rather than `findAndModify()`. */
    useFindAndModify?: boolean;
    /** Set to `true` to make Mongoose automatically call `createCollection()` on every model created on this connection. */
    autoCreate?: boolean;
  }

  class Connection extends events.EventEmitter {
    /** Closes the connection */
    close(callback: (err: Error | null) => void): void;
    close(force: boolean, callback: (err: Error | null) => void): void;
    close(force?: boolean): Promise<void>;

    /** Retrieves a collection, creating it if not cached. */
    collection(name: string, options: mongodb.CollectionCreateOptions): Collection;

    /** A hash of the collections associated with this connection */
    collections: { [index: string]: Collection };

    /** A hash of the global options that are associated with this connection */
    config: any;

    /**
     * Helper for `createCollection()`. Will explicitly create the given collection
     * with specified options. Used to create [capped collections](https://docs.mongodb.com/manual/core/capped-collections/)
     * and [views](https://docs.mongodb.com/manual/core/views/) from mongoose.
     */
    createCollection<T = any>(name: string, options?: mongodb.CollectionCreateOptions): Promise<mongodb.Collection<T>>;
    createCollection<T = any>(name: string, cb: (err: Error | null, collection: mongodb.Collection<T>) => void): void;
    createCollection<T = any>(name: string, options: mongodb.CollectionCreateOptions, cb?: (err: Error | null, collection: mongodb.Collection) => void): Promise<mongodb.Collection<T>>;

    /**
     * Removes the model named `name` from this connection, if it exists. You can
     * use this function to clean up any models you created in your tests to
     * prevent OverwriteModelErrors.
     */
    deleteModel(name: string): this;

    /**
     * Helper for `dropCollection()`. Will delete the given collection, including
     * all documents and indexes.
     */
    dropCollection(collection: string): Promise<void>;
    dropCollection(collection: string, cb: (err: Error | null) => void): void;

    /**
     * Helper for `dropDatabase()`. Deletes the given database, including all
     * collections, documents, and indexes.
     */
    dropDatabase(): Promise<void>;
    dropDatabase(cb: (err: Error | null) => void): void;

    /** Gets the value of the option `key`. Equivalent to `conn.options[key]` */
    get(key: string): any;

    /**
     * Returns the [MongoDB driver `MongoClient`](http://mongodb.github.io/node-mongodb-native/3.5/api/MongoClient.html) instance
     * that this connection uses to talk to MongoDB.
     */
    getClient(): mongodb.MongoClient;

    /**
     * The host name portion of the URI. If multiple hosts, such as a replica set,
     * this will contain the first host name in the URI
     */
    host: string;

    /**
     * A number identifier for this connection. Used for debugging when
     * you have [multiple connections](/docs/connections.html#multiple_connections).
     */
    id: number;

    /**
     * A [POJO](https://masteringjs.io/tutorials/fundamentals/pojo) containing
     * a map from model names to models. Contains all models that have been
     * added to this connection using [`Connection#model()`](/docs/api/connection.html#connection_Connection-model).
     */
    models: { [index: string]: Model<any> };

    /** Defines or retrieves a model. */
    model<T extends Document>(name: string, schema?: Schema, collection?: string): Model<T>;

    /** Returns an array of model names created on this connection. */
    modelNames(): Array<string>;

    /** The name of the database this connection points to. */
    name: string;

    /** Opens the connection with a URI using `MongoClient.connect()`. */
    openUri(uri: string, options?: ConnectOptions): Promise<Connection>;
    openUri(uri: string, callback: (err: Error | null, conn?: Connection) => void): Connection;
    openUri(uri: string, options: ConnectOptions, callback: (err: Error | null, conn?: Connection) => void): Connection;

    /** The password specified in the URI */
    pass: string;

    /**
     * The port portion of the URI. If multiple hosts, such as a replica set,
     * this will contain the port from the first host name in the URI.
     */
    port: number;

    /** Declares a plugin executed on all schemas you pass to `conn.model()` */
    plugin(fn: (schema: Schema, opts?: any) => void, opts?: any);

    /** The plugins that will be applied to all models created on this connection. */
    plugins: Array<any>;

    /**
     * Connection ready state
     * 
     * - 0 = disconnected
     * - 1 = connected
     * - 2 = connecting
     * - 3 = disconnecting
     */
    readyState: number;

    /** Sets the value of the option `key`. Equivalent to `conn.options[key] = val` */
    set(key: string, value: any): any;

    /**
     * Set the [MongoDB driver `MongoClient`](http://mongodb.github.io/node-mongodb-native/3.5/api/MongoClient.html) instance
     * that this connection uses to talk to MongoDB. This is useful if you already have a MongoClient instance, and want to
     * reuse it.
     */
    setClient(client: mongodb.MongoClient): this;

    /**
     * _Requires MongoDB >= 3.6.0._ Starts a [MongoDB session](https://docs.mongodb.com/manual/release-notes/3.6/#client-sessions)
     * for benefits like causal consistency, [retryable writes](https://docs.mongodb.com/manual/core/retryable-writes/),
     * and [transactions](http://thecodebarbarian.com/a-node-js-perspective-on-mongodb-4-transactions.html).
     */
    startSession(options?: mongodb.SessionOptions): Promise<mongodb.ClientSession>;
    startSession(options: mongodb.SessionOptions, cb: (err: any, session: mongodb.ClientSession) => void): void;

    /**
     * _Requires MongoDB >= 3.6.0._ Executes the wrapped async function
     * in a transaction. Mongoose will commit the transaction if the
     * async function executes successfully and attempt to retry if
     * there was a retriable error.
     */
    transaction(fn: (session: mongodb.ClientSession) => Promise<any>);

    /** Switches to a different database using the same connection pool. */
    useDb(name: string, options?: { useCache?: boolean }): Connection;

    /** The username specified in the URI */
    user: string;

    /** Watches the entire underlying database for changes. Similar to [`Model.watch()`](/docs/api/model.html#model_Model.watch). */
    watch(pipeline?: Array<any>, options?: mongodb.ChangeStreamOptions): mongodb.ChangeStream;
  }

  class Collection {}

  namespace Types {
    class ObjectId extends mongodb.ObjectID {}
  }

  class Document {
    constructor(doc?: any);

    /** Don't run validation on this path or persist changes to this path. */
    $ignore(path: string);

    /** Checks if a path is set to its default. */
    $isDefault(path: string);

    /** Getter/setter, determines whether the document was removed or not. */
    $isDeleted(val?: boolean);

    /**
     * Returns true if the given path is nullish or only contains empty objects.
     * Useful for determining whether this subdoc will get stripped out by the
     * [minimize option](/docs/guide.html#minimize).
     */
    $isEmpty(path: string);

    /** Checks if a path is invalid */
    $isValid(path: string);

    /**
     * Empty object that you can use for storing properties on the document. This
     * is handy for passing data to middleware without conflicting with Mongoose
     * internals.
     */
    $locals: object;

    /** Marks a path as valid, removing existing validation errors. */
    $markValid(path: string);

    /**
     * A string containing the current operation that Mongoose is executing
     * on this document. May be `null`, `'save'`, `'validate'`, or `'remove'`.
     */
    $op: string | null;

    /**
     * Getter/setter around the session associated with this document. Used to
     * automatically set `session` if you `save()` a doc that you got from a
     * query with an associated session.
     */
    $session(session?: mongodb.ClientSession | null): mongodb.ClientSession;

    /** Alias for `set()`, used internally to avoid conflicts */
    $set(path: string, val: any, options?: any): this;
    $set(path: string, val: any, type: any, options?: any): this;
    $set(value: any): this;

    /** Additional properties to attach to the query when calling `save()` and `isNew` is false. */
    $where: object;

    /** If this is a discriminator model, `baseModelName` is the name of the base model. */
    baseModelName?: string;

    /** Collection the model uses. */
    collection: Collection;

    /** Connection the model uses. */
    db: Connection;

    /** Removes this document from the db. */
    delete(options?: QueryOptions, cb?: (err: Error | null, res: any) => void): void;
    delete(options?: QueryOptions): Query<any, this>;

    /** Removes this document from the db. */
    deleteOne(options?: QueryOptions, cb?: (err: Error | null, res: any) => void): void;
    deleteOne(options?: QueryOptions): Query<any, this>;

    /** Takes a populated field and returns it to its unpopulated state. */
    depopulate(path: string): this;

    /**
     * Returns the list of paths that have been directly modified. A direct
     * modified path is a path that you explicitly set, whether via `doc.foo = 'bar'`,
     * `Object.assign(doc, { foo: 'bar' })`, or `doc.set('foo', 'bar')`.
     */
    directModifiedPaths(): Array<string>;

    /**
     * Returns true if this document is equal to another document.
     *
     * Documents are considered equal when they have matching `_id`s, unless neither
     * document has an `_id`, in which case this function falls back to using
     * `deepEqual()`.
     */
    equals(doc: Document): boolean;

    /** Hash containing current validation errors. */
    errors?: ValidationError;

    /** Explicitly executes population and returns a promise. Useful for promises integration. */
    execPopulate(): Promise<this>;
    execPopulate(callback: (err: Error | null, res: this) => void): void;

    /** Returns the value of a path. */
    get(path: string, type?: any, options?: any);

    /**
     * Returns the changes that happened to the document
     * in the format that will be sent to MongoDB.
     */
    getChanges(): UpdateQuery<this>;

    /** The string version of this documents _id. */
    id: string;

    /** Signal that we desire an increment of this documents version. */
    increment(): this;

    /**
     * Initializes the document without setters or marking anything modified.
     * Called internally after a document is returned from mongodb. Normally,
     * you do **not** need to call this function on your own.
     */
    init(obj: any, opts?: any, cb?: (err: Error | null, doc: this) => void): this;

    /** Marks a path as invalid, causing validation to fail. */
    invalidate(path: string, errorMsg: string | Error, value?: any, kind?: string): Error | null;

    /** Returns true if `path` was directly set and modified, else false. */
    isDirectModified(path: string): boolean;

    /** Checks if `path` was explicitly selected. If no projection, always returns true. */
    isDirectSelected(path: string): boolean;

    /** Checks if `path` is in the `init` state, that is, it was set by `Document#init()` and not modified since. */
    isInit(path: string);

    /**
     * Returns true if any of the given paths is modified, else false. If no arguments, returns `true` if any path
     * in this document is modified.
     */
    isModified(path?: string | Array<string>): boolean;

    /** Checks if `path` was selected in the source query which initialized this document. */
    isSelected(path: string): boolean;

    /** Boolean flag specifying if the document is new. */
    isNew: boolean;

    /** Marks the path as having pending changes to write to the db. */
    markModified(path: string, scope?: any);

    /** Returns the list of paths that have been modified. */
    modifiedPaths(options?: { includeChildren?: boolean }): Array<string>;

    /** Returns another Model instance. */
    model<T extends Model<any>>(name: string): T;

    /** The name of the model */
    modelName: string;

    /**
     * Overwrite all values in this document with the values of `obj`, except
     * for immutable properties. Behaves similarly to `set()`, except for it
     * unsets all properties that aren't in `obj`.
     */
    overwrite(obj: DocumentDefinition<this>): this;

    /** If this document is a subdocument or populated document, returns the document's parent. Returns `undefined` otherwise. */
    parent(): Document | undefined;

    /**
     * Populates document references, executing the `callback` when complete.
     * If you want to use promises instead, use this function with
     * [`execPopulate()`](#document_Document-execPopulate).
     */
    populate(path: string, callback?: (err: Error | null, res: this) => void): this;
    populate(opts: PopulateOptions | Array<PopulateOptions>, callback?: (err: Error | null, res: this) => void): this;

    /** Gets _id(s) used during population of the given `path`. If the path was not populated, returns `undefined`. */
    populated(path: string): any;

    /** Removes this document from the db. */
    remove(options?: QueryOptions, cb?: (err: Error | null, res: any) => void): void;
    remove(options?: QueryOptions): Query<any, this>;

    /** Sends a replaceOne command with this document `_id` as the query selector. */
    replaceOne(replacement?: DocumentDefinition<this>, options?: QueryOptions | null, callback?: (err: any, res: any) => void): Query<any, this>;

    /** Saves this document by inserting a new document into the database if [document.isNew](/docs/api.html#document_Document-isNew) is `true`, or sends an [updateOne](/docs/api.html#document_Document-updateOne) operation with just the modified paths if `isNew` is `false`. */
    save(options?: SaveOptions): Promise<this>;
    save(options?: SaveOptions, fn?: (err: Error | null, doc: this) => void): void;
    save(fn?: (err: Error | null, doc: this) => void): void;

    /** Sets the value of a path, or many paths. */
    set(path: string, val: any, options?: any): this;
    set(path: string, val: any, type: any, options?: any): this;
    set(value: any): this;

    /** The return value of this method is used in calls to JSON.stringify(doc). */
    toJSON(options?: ToObjectOptions): any;

    /** Converts this document into a plain-old JavaScript object ([POJO](https://masteringjs.io/tutorials/fundamentals/pojo)). */
    toObject(options?: ToObjectOptions): any;

    /** Clears the modified state on the specified path. */
    unmarkModified(path: string);

    /** Sends an update command with this document `_id` as the query selector. */
    update(update?: UpdateQuery<this>, options?: QueryOptions | null, callback?: (err: Error, res: any) => void): Query<any, this>;

    /** Sends an updateOne command with this document `_id` as the query selector. */
    updateOne(update?: UpdateQuery<this>, options?: QueryOptions | null, callback?: (err: Error, res: any) => void): Query<any, this>;

    /** Executes registered validation rules for this document. */
    validate(pathsToValidate?: Array<string>, options?: any): Promise<void>;
    validate(callback: (err: Error | null) => void): void;
    validate(pathsToValidate: Array<string>, callback: (err: Error | null) => void): void;
    validate(pathsToValidate: Array<string>, options: any, callback: (err: Error | null) => void): void;

    /** Executes registered validation rules (skipping asynchronous validators) for this document. */
    validateSync(pathsToValidate?: Array<string>, options?: any): Error | null;

    /** The documents schema. */
    schema: Schema;
  }

  export var Model: Model<any>;
  interface Model<T extends Document> extends NodeJS.EventEmitter {
    new(doc?: any): T;

    aggregate<R>(pipeline?: any[]): Aggregate<Array<R>>;
    aggregate<R>(pipeline: any[], cb: Function): Promise<Array<R>>;

    /** Base Mongoose instance the model uses. */
    base: typeof mongoose;

    /**
     * If this is a discriminator model, `baseModelName` is the name of
     * the base model.
     */
    baseModelName: string | undefined;

    /**
     * Sends multiple `insertOne`, `updateOne`, `updateMany`, `replaceOne`,
     * `deleteOne`, and/or `deleteMany` operations to the MongoDB server in one
     * command. This is faster than sending multiple independent operations (e.g.
     * if you use `create()`) because with `bulkWrite()` there is only one round
     * trip to MongoDB.
     */
    bulkWrite(writes: Array<any>, options?: mongodb.CollectionBulkWriteOptions, cb?: (err: any, res: mongodb.BulkWriteOpResultObject) => void): void;
    bulkWrite(writes: Array<any>, options?: mongodb.CollectionBulkWriteOptions): Promise<mongodb.BulkWriteOpResultObject>;

    /** Creates a new document or documents */
    create(doc: T | DocumentDefinition<T>): Promise<T>;
    create(docs: Array<T | DocumentDefinition<T>>, options?: SaveOptions): Promise<Array<T>>;
    create(...docs: Array<T | DocumentDefinition<T>>): Promise<T>;
    create(doc: T | DocumentDefinition<T>, callback: (err: Error | null, doc: T) => void): void;
    create(docs: Array<T | DocumentDefinition<T>>, callback: (err: Error | null, docs: Array<T>) => void): void;

    createCollection(options?: mongodb.CollectionCreateOptions): Promise<mongodb.Collection<T>>;
    createCollection(options: mongodb.CollectionCreateOptions | null, callback: (err: Error | null, collection: mongodb.Collection<T>) => void): void;

    /**
     * Event emitter that reports any errors that occurred. Useful for global error
     * handling.
     */
    events: NodeJS.EventEmitter;

    /**
     * Shortcut for creating a new Document from existing raw data, pre-saved in the DB.
     * The document returned has no paths marked as modified initially.
     */
    hydrate(obj: any): T;

    /**
     * This function is responsible for building [indexes](https://docs.mongodb.com/manual/indexes/),
     * unless [`autoIndex`](http://mongoosejs.com/docs/guide.html#autoIndex) is turned off.
     * Mongoose calls this function automatically when a model is created using
     * [`mongoose.model()`](/docs/api.html#mongoose_Mongoose-model) or
     * [`connection.model()`](/docs/api.html#connection_Connection-model), so you
     * don't need to call it.
     */
    init(callback?: (err: any) => void): Promise<T>;

    /** Inserts one or more new documents as a single `insertMany` call to the MongoDB server. */
    insertMany(doc: T | DocumentDefinition<T>, options?: InsertManyOptions): Promise<T | InsertManyResult>;
    insertMany(docs: Array<T | DocumentDefinition<T>>, options?: InsertManyOptions): Promise<Array<T> | InsertManyResult>;
    insertMany(doc: T | DocumentDefinition<T>, options?: InsertManyOptions, callback?: (err: Error | null, res: T | InsertManyResult) => void): void;
    insertMany(docs: Array<T | DocumentDefinition<T>>, options?: InsertManyOptions, callback?: (err: Error | null, res: Array<T> | InsertManyResult) => void): void;

    /**
     * Lists the indexes currently defined in MongoDB. This may or may not be
     * the same as the indexes defined in your schema depending on whether you
     * use the [`autoIndex` option](/docs/guide.html#autoIndex) and if you
     * build indexes manually.
     */
    listIndexes(callback: (err: Error | null, res: Array<any>) => void): void;
    listIndexes(): Promise<Array<any>>;

    populate(docs: Array<any>, options: PopulateOptions | Array<PopulateOptions> | string,
      callback?: (err: any, res: T[]) => void): Promise<Array<T>>;

    /**
     * Makes the indexes in MongoDB match the indexes defined in this model's
     * schema. This function will drop any indexes that are not defined in
     * the model's schema except the `_id` index, and build any indexes that
     * are in your schema but not in MongoDB.
     */
    syncIndexes(options?: object): Promise<Array<string>>;
    syncIndexes(options: object | null, callback: (err: Error | null, dropped: Array<string>) => void): void;

    /**
     * Starts a [MongoDB session](https://docs.mongodb.com/manual/release-notes/3.6/#client-sessions)
     * for benefits like causal consistency, [retryable writes](https://docs.mongodb.com/manual/core/retryable-writes/),
     * and [transactions](http://thecodebarbarian.com/a-node-js-perspective-on-mongodb-4-transactions.html).
     **/
    startSession(options?: mongodb.SessionOptions, cb?: (err: any, session: mongodb.ClientSession) => void): Promise<mongodb.ClientSession>;

    /** Casts and validates the given object against this model's schema, passing the given `context` to custom validators. */
    validate(callback?: (err: any) => void): Promise<void>;
    validate(optional: any, callback?: (err: any) => void): Promise<void>;

    /** Watches the underlying collection for changes using [MongoDB change streams](https://docs.mongodb.com/manual/changeStreams/). */
    watch(pipeline?: Array<object>, options?: mongodb.ChangeStreamOptions): mongodb.ChangeStream;

    /** Adds a `$where` clause to this query */
    $where(argument: string | Function): Query<Array<T>, T>;

    /** Registered discriminators for this model. */
    discriminators: { [name: string]: Model<any> } | undefined;

    /** Translate any aliases fields/conditions so the final query or document object is pure */
    translateAliases(raw: any): any;

    /** Creates a `count` query: counts the number of documents that match `filter`. */
    count(callback?: (err: any, count: number) => void): Query<number, T>;
    count(filter: FilterQuery<T>, callback?: (err: any, count: number) => void): Query<number, T>;

    /** Creates a `countDocuments` query: counts the number of documents that match `filter`. */
    countDocuments(callback?: (err: any, count: number) => void): Query<number, T>;
    countDocuments(filter: FilterQuery<T>, callback?: (err: any, count: number) => void): Query<number, T>;

    /**
     * Similar to `ensureIndexes()`, except for it uses the [`createIndex`](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#createIndex)
     * function.
     */
    createIndexes(options: any): Promise<void>;
    createIndexes(options: any, callback?: (err: any) => void): Promise<void>;

    /** Adds a discriminator type. */
    discriminator<D extends Document>(name: string, schema: Schema, value?: string): Model<D>;

    /** Creates a `estimatedDocumentCount` query: counts the number of documents in the collection. */
    estimatedDocumentCount(options?: QueryOptions, callback?: (err: any, count: number) => void): Query<number, T>;

    /**
     * Sends `createIndex` commands to mongo for each index declared in the schema.
     * The `createIndex` commands are sent in series.
     */
    ensureIndexes(options: any): Promise<void>;
    ensureIndexes(options: any, callback?: (err: any) => void): Promise<void>;

    /**
     * Returns true if at least one document exists in the database that matches
     * the given `filter`, and false otherwise.
     */
    exists(filter: FilterQuery<T>): Promise<boolean>;
    exists(filter: FilterQuery<T>, callback: (err: any, res: boolean) => void): void;

    /** Creates a `distinct` query: returns the distinct values of the given `field` that match `filter`. */
    distinct(field: string, filter?: FilterQuery<T>, callback?: (err: any, count: number) => void): Query<Array<any>, T>;

    /** Creates a `find` query: gets a list of documents that match `filter`. */
    find(callback?: (err: any, count: number) => void): Query<Array<T>, T>;
    find(filter: FilterQuery<T>, callback?: (err: any, count: number) => void): Query<Array<T>, T>;
    find(filter: FilterQuery<T>, projection?: any | null, options?: QueryOptions | null, callback?: (err: any, count: number) => void): Query<Array<T>, T>;

    /** Creates a `findByIdAndDelete` query, filtering by the given `_id`. */
    findByIdAndDelete(id?: mongodb.ObjectId | any, options?: QueryOptions | null, callback?: (err: any, doc: T | null, res: any) => void): Query<T | null, T>;

    /** Creates a `findByIdAndRemove` query, filtering by the given `_id`. */
    findByIdAndRemove(id?: mongodb.ObjectId | any, options?: QueryOptions | null, callback?: (err: any, doc: T | null, res: any) => void): Query<T | null, T>;

    /** Creates a `findOneAndUpdate` query, filtering by the given `_id`. */
    findByIdAndUpdate(id?: mongodb.ObjectId | any, update?: UpdateQuery<T>, options?: QueryOptions | null, callback?: (err: any, doc: T | null, res: any) => void): Query<T | null, T>;

    /** Creates a `findOneAndDelete` query: atomically finds the given document, deletes it, and returns the document as it was before deletion. */
    findOneAndDelete(filter?: FilterQuery<T>, options?: QueryOptions | null, callback?: (err: any, doc: T | null, res: any) => void): Query<T | null, T>;

    /** Creates a `findOneAndRemove` query: atomically finds the given document and deletes it. */
    findOneAndRemove(filter?: FilterQuery<T>, options?: QueryOptions | null, callback?: (err: any, doc: T | null, res: any) => void): Query<T | null, T>;

    /** Creates a `findOneAndReplace` query: atomically finds the given document and replaces it with `replacement`. */
    findOneAndReplace(filter?: FilterQuery<T>, replacement?: DocumentDefinition<T>, options?: QueryOptions | null, callback?: (err: any, doc: T | null, res: any) => void): Query<T | null, T>;

    /** Creates a `findOneAndUpdate` query: atomically find the first document that matches `filter` and apply `update`. */
    findOneAndUpdate(filter?: FilterQuery<T>, update?: UpdateQuery<T>, options?: QueryOptions | null, callback?: (err: any, doc: T | null, res: any) => void): Query<T | null, T>;

    geoSearch(filter?: FilterQuery<T>, options?: GeoSearchOptions, callback?: (err: Error | null, res: Array<T>) => void): Query<Array<T>, T>;

    /** Executes a mapReduce command. */
    mapReduce<Key, Value>(
      o: MapReduceOptions<T, Key, Value>,
      callback?: (err: any, res: any) => void
    ): Promise<any>;

    remove(filter?: any, callback?: (err: Error | null) => void): Query<any, T>;

    /** Creates a `replaceOne` query: finds the first document that matches `filter` and replaces it with `replacement`. */
    replaceOne(filter?: FilterQuery<T>, replacement?: DocumentDefinition<T>, options?: QueryOptions | null, callback?: (err: any, res: any) => void): Query<any, T>;

    /** Creates a `findOneAndReplace` query: atomically finds the given document and replaces it with `replacement`. */
    findOneAndReplace(filter?: FilterQuery<T>, replacement?: DocumentDefinition<T>, options?: QueryOptions | null, callback?: (err: any, doc: T | null, res: any) => void): Query<T | null, T>;

    /** Creates a `update` query: updates one or many documents that match `filter` with `update`, based on the `multi` option. */
    update(filter?: FilterQuery<T>, update?: UpdateQuery<T>, options?: QueryOptions | null, callback?: (err: any, res: any) => void): Query<any, T>;

    /** Creates a `updateMany` query: updates all documents that match `filter` with `update`. */
    updateMany(filter?: FilterQuery<T>, update?: UpdateQuery<T>, options?: QueryOptions | null, callback?: (err: any, res: any) => void): Query<any, T>;

    /** Creates a `updateOne` query: updates the first document that matches `filter` with `update`. */
    updateOne(filter?: FilterQuery<T>, update?: UpdateQuery<T>, options?: QueryOptions | null, callback?: (err: any, res: any) => void): Query<any, T>;

    /** Creates a Query, applies the passed conditions, and returns the Query. */
    where(path: string, val?: any): Query<Array<T>, T>;
  }

  interface QueryOptions {
    tailable?: number;
    sort?: any;
    limit?: number;
    skip?: number;
    maxscan?: number;
    batchSize?: number;
    comment?: any;
    snapshot?: any;
    readPreference?: mongodb.ReadPreferenceMode;
    hint?: any;
    upsert?: boolean;
    writeConcern?: any;
    timestamps?: boolean;
    omitUndefined?: boolean;
    overwriteDiscriminatorKey?: boolean;
    lean?: boolean | any;
    populate?: string;
    projection?: any;
    maxTimeMS?: number;
    useFindAndModify?: boolean;
    rawResult?: boolean;
    collation?: mongodb.CollationDocument;
    session?: mongodb.ClientSession;
    explain?: any;
    multi?: boolean;
    strict: boolean | string;
  }

  interface SaveOptions {
    checkKeys?: boolean;
    validateBeforeSave?: boolean;
    validateModifiedOnly?: boolean;
    timestamps?: boolean;
    j?: boolean;
    w?: number | string;
    wtimeout?: number;
  }

  interface InsertManyOptions {
    limit?: number;
    rawResult?: boolean;
    ordered?: boolean;
    lean?: boolean;
    session?: mongodb.ClientSession;
  }

  interface InsertManyResult extends mongodb.InsertWriteOpResult<any> {
    mongoose?: { validationErrors?: Array<Error> }
  }

  interface MapReduceOptions<T, Key, Val> {
    map: Function | string;
    reduce: (key: Key, vals: T[]) => Val;
    /** query filter object. */
    query?: any;
    /** sort input objects using this key */
    sort?: any;
    /** max number of documents */
    limit?: number;
    /** keep temporary data default: false */
    keeptemp?: boolean;
    /** finalize function */
    finalize?: (key: Key, val: Val) => Val;
    /** scope variables exposed to map/reduce/finalize during execution */
    scope?: any;
    /** it is possible to make the execution stay in JS. Provided in MongoDB > 2.0.X default: false */
    jsMode?: boolean;
    /** provide statistics on job execution time. default: false */
    verbose?: boolean;
    readPreference?: string;
    /** sets the output target for the map reduce job. default: {inline: 1} */
    out?: {
      /** the results are returned in an array */
      inline?: number;
      /**
       * {replace: 'collectionName'} add the results to collectionName: the
       * results replace the collection
       */
      replace?: string;
      /**
       * {reduce: 'collectionName'} add the results to collectionName: if
       * dups are detected, uses the reducer / finalize functions
       */
      reduce?: string;
      /**
       * {merge: 'collectionName'} add the results to collectionName: if
       * dups exist the new docs overwrite the old
       */
      merge?: string;
    };
  }

  interface GeoSearchOptions {
    /** x,y point to search for */
    near: number[];
    /** the maximum distance from the point near that a result can be */
    maxDistance: number;
    /** The maximum number of results to return */
    limit?: number;
    /** return the raw object instead of the Mongoose Model */
    lean?: boolean;
  }

  interface PopulateOptions {
    /** space delimited path(s) to populate */
    path: string;
    /** fields to select */
    select?: any;
    /** query conditions to match */
    match?: any;
    /** optional model to use for population */
    model?: string | Model<any>;
    /** optional query options like sort, limit, etc */
    options?: any;
    /** deep populate */
    populate?: PopulateOptions | Array<PopulateOptions>;
    /**
     * If true Mongoose will always set `path` to an array, if false Mongoose will
     * always set `path` to a document. Inferred from schema by default.
     */
    justOne?: boolean;
  }

  interface ToObjectOptions {
    /** apply all getters (path and virtual getters) */
    getters?: boolean;
    /** apply virtual getters (can override getters option) */
    virtuals?: boolean;
    /** if `options.virtuals = true`, you can set `options.aliases = false` to skip applying aliases. This option is a no-op if `options.virtuals = false`. */
    aliases?: boolean;
    /** remove empty objects (defaults to true) */
    minimize?: boolean;
    /** if set, mongoose will call this function to allow you to transform the returned object */
    transform?: (doc: any, ret: any, options: any) => any;
    /** if true, replace any conventionally populated paths with the original id in the output. Has no affect on virtual populated paths. */
    depopulate?: boolean;
    /** if false, exclude the version key (`__v` by default) from the output */
    versionKey?: boolean;
    /** if true, convert Maps to POJOs. Useful if you want to `JSON.stringify()` the result of `toObject()`. */
    flattenMaps?: boolean;
    /** If true, omits fields that are excluded in this document's projection. Unless you specified a projection, this will omit any field that has `select: false` in the schema. */
    useProjection?: boolean;
  }

  class Schema {
    /**
     * Create a new schema
     */
    constructor(definition?: SchemaDefinition);

    /** Adds key path / schema type pairs to this schema. */
    add(obj: SchemaDefinition | Schema, prefix?: string): this;

    /** Returns a copy of this schema */
    clone(): Schema;

    /** Iterates the schemas paths similar to Array#forEach. */
    eachPath(fn: (path: string, type: SchemaType) => void): this;

    /** Gets/sets schema paths. */
    path(path: string): SchemaType;
    path(path: string, constructor: any): this;

    /** Returns the pathType of `path` for this schema. */
    pathType(path: string): string;

    /** Adds a method call to the queue. */
    queue(name: string, args: any[]): this;

    /** Returns an Array of path strings that are required by this schema. */
    requiredPaths(invalidate?: boolean): string[];
  }

  interface SchemaDefinition {
    [path: string]: SchemaTypeOptions<any> | Function | string | Schema | Array<Schema> | Array<SchemaTypeOptions<any>>;
  }

  interface SchemaTypeOptions<T> {
    type?: T;

    /** Defines a virtual with the given name that gets/sets this path. */
    alias?: string;

    /** Function or object describing how to validate this schematype. See [validation docs](https://mongoosejs.com/docs/validation.html). */
    validate?: RegExp | [RegExp, string] | Function;

    /** Allows overriding casting logic for this individual path. If a string, the given string overwrites Mongoose's default cast error message. */
    cast?: string;

    /**
     * If true, attach a required validator to this path, which ensures this path
     * path cannot be set to a nullish value. If a function, Mongoose calls the
     * function and only checks for nullish values if the function returns a truthy value.
     */
    required?: boolean | (() => boolean);

    /**
     * The default value for this path. If a function, Mongoose executes the function
     * and uses the return value as the default.
     */
    default?: T | ((this: any, doc: any) => T);

    /**
     * The model that `populate()` should use if populating this path.
     */
    ref?: string | Model<any> | ((this: any, doc: any) => string | Model<any>);

    /**
     * Whether to include or exclude this path by default when loading documents
     * using `find()`, `findOne()`, etc.
     */
    select?: boolean | number;

    /**
     * If [truthy](https://masteringjs.io/tutorials/fundamentals/truthy), Mongoose will
     * build an index on this path when the model is compiled.
     */
    index?: boolean | number | IndexOptions;

    /**
     * If [truthy](https://masteringjs.io/tutorials/fundamentals/truthy), Mongoose
     * will build a unique index on this path when the
     * model is compiled. [The `unique` option is **not** a validator](/docs/validation.html#the-unique-option-is-not-a-validator).
     */
    unique?: boolean | number;

    /**
     * If [truthy](https://masteringjs.io/tutorials/fundamentals/truthy), Mongoose will
     * disallow changes to this path once the document is saved to the database for the first time. Read more
     * about [immutability in Mongoose here](http://thecodebarbarian.com/whats-new-in-mongoose-5-6-immutable-properties.html).
     */
    immutable?: boolean | ((this: any, doc: any) => boolean);

    /**
     * If [truthy](https://masteringjs.io/tutorials/fundamentals/truthy), Mongoose will
     * build a sparse index on this path.
     */
    sparse?: boolean | number;

    /**
     * If [truthy](https://masteringjs.io/tutorials/fundamentals/truthy), Mongoose
     * will build a text index on this path.
     */
    text?: boolean | number | any;

    /**
     * Define a transform function for this individual schema type.
     * Only called when calling `toJSON()` or `toObject()`.
     */
    transform?: (this: any, val: T) => any;

    /** defines a custom getter for this property using [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). */
    get?: (value: T, schematype?: this) => any;

    /** defines a custom setter for this property using [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). */
    set?: (value: T, schematype?: this) => any;

    /** array of allowed values for this path. Allowed for strings, numbers, and arrays of strings */
    enum?: Array<string | number>

    /** The default [subtype](http://bsonspec.org/spec.html) associated with this buffer when it is stored in MongoDB. Only allowed for buffer paths */
    subtype?: number

    /** The minimum value allowed for this path. Only allowed for numbers and dates. */
    min?: number | Date;

    /** The maximum value allowed for this path. Only allowed for numbers and dates. */
    max?: number | Date;

    /** Defines a TTL index on this path. Only allowed for dates. */
    expires?: Date;

    /** If `true`, Mongoose will skip gathering indexes on subpaths. Only allowed for subdocuments and subdocument arrays. */
    excludeIndexes?: boolean;

    /** If set, overrides the child schema's `_id` option. Only allowed for subdocuments and subdocument arrays. */
    _id?: boolean;

    /** If set, specifies the type of this map's values. Mongoose will cast this map's values to the given type. */
    of?: Function | SchemaTypeOptions<any>;

    /** If true, uses Mongoose's default `_id` settings. Only allowed for ObjectIds */
    auto?: boolean;

    /** Attaches a validator that succeeds if the data string matches the given regular expression, and fails otherwise. */
    match?: RegExp;

    /** If truthy, Mongoose will add a custom setter that lowercases this string using JavaScript's built-in `String#toLowerCase()`. */
    lowercase?: boolean;

    /** If truthy, Mongoose will add a custom setter that removes leading and trailing whitespace using JavaScript's built-in `String#trim()`. */
    trim?: boolean;

    /** If truthy, Mongoose will add a custom setter that uppercases this string using JavaScript's built-in `String#toUpperCase()`. */
    uppercase?: boolean;

    /** If set, Mongoose will add a custom validator that ensures the given string's `length` is at least the given number. */
    minlength?: number;

    /** If set, Mongoose will add a custom validator that ensures the given string's `length` is at most the given number. */
    maxlength?: number;
  }

  interface IndexOptions {
    background?: boolean,
    expires?: number | string
    sparse?: boolean,
    type?: string,
    unique?: boolean
  }

  interface Query<ResultType, DocType extends Document> {
    exec(): Promise<ResultType>;
    exec(callback?: (err: Error | null, res: ResultType) => void): void;

    $where(argument: string | Function): Query<Array<DocType>, DocType>;

    /** Specifies an `$all` query condition. When called with one argument, the most recent path passed to `where()` is used. */
    all(val: Array<any>): this;
    all(path: string, val: Array<any>): this;

    /** Specifies arguments for an `$and` condition. */
    and(array: Array<FilterQuery<DocType>>): this;

    /** Specifies the batchSize option. */
    batchSize(val: number): this;

    /** Adds a collation to this op (MongoDB 3.4 and up) */
    collation(value: mongodb.CollationDocument): this;

    /** Specifies the `comment` option. */
    comment(val: string): this;

    /** Specifies this query as a `count` query. */
    count(callback?: (err: any, count: number) => void): Query<number, DocType>;
    count(criteria: FilterQuery<DocType>, callback?: (err: any, count: number) => void): Query<number, DocType>;

    /** Specifies this query as a `countDocuments` query. */
    countDocuments(callback?: (err: any, count: number) => void): Query<number, DocType>;
    countDocuments(criteria: FilterQuery<DocType>, callback?: (err: any, count: number) => void): Query<number, DocType>;

    /**
     * Declare and/or execute this query as a `deleteMany()` operation. Works like
     * remove, except it deletes _every_ document that matches `filter` in the
     * collection, regardless of the value of `single`.
     */
    deleteMany(filter?: FilterQuery<DocType>, options?: QueryOptions, callback?: (err: Error | null, res: any) => void): Query<any, DocType>;

    /**
     * Declare and/or execute this query as a `deleteOne()` operation. Works like
     * remove, except it deletes at most one document regardless of the `single`
     * option.
     */
    deleteOne(filter?: FilterQuery<DocType>, options?: QueryOptions, callback?: (err: Error | null, res: any) => void): Query<any, DocType>;

    /** Creates a `distinct` query: returns the distinct values of the given `field` that match `filter`. */
    distinct(field: string, filter?: FilterQuery<DocType>, callback?: (err: any, count: number) => void): Query<Array<any>, DocType>;

    /** Specifies a `$elemMatch` query condition. When called with one argument, the most recent path passed to `where()` is used. */
    elemMatch(val: Function | any): this;
    elemMatch(path: string, val: Function | any): this;

    /**
     * Gets/sets the error flag on this query. If this flag is not null or
     * undefined, the `exec()` promise will reject without executing.
     */
    error(): Error | null;
    error(val: Error | null): this;

    /** Specifies the complementary comparison value for paths specified with `where()` */
    equals(val: any): this;

    /** Creates a `estimatedDocumentCount` query: counts the number of documents in the collection. */
    estimatedDocumentCount(options?: QueryOptions, callback?: (err: any, count: number) => void): Query<number, DocType>;

    /** Specifies a `$exists` query condition. When called with one argument, the most recent path passed to `where()` is used. */
    exists(val: boolean): this;
    exists(path: string, val: boolean): this;

    /**
     * Sets the [`explain` option](https://docs.mongodb.com/manual/reference/method/cursor.explain/),
     * which makes this query return detailed execution stats instead of the actual
     * query result. This method is useful for determining what index your queries
     * use.
     */
    explain(verbose?: string): this;

    /** Creates a `find` query: gets a list of documents that match `filter`. */
    find(callback?: (err: any, count: number) => void): Query<Array<DocType>, DocType>;
    find(filter: FilterQuery<DocType>, callback?: (err: any, count: number) => void): Query<Array<DocType>, DocType>;
    find(filter: FilterQuery<DocType>, projection?: any | null, options?: QueryOptions | null, callback?: (err: Error | null, count: number) => void): Query<Array<DocType>, DocType>;

    /** Declares the query a findOne operation. When executed, the first found document is passed to the callback. */
    findOne(filter?: FilterQuery<DocType>, projection?: any | null, options?: QueryOptions | null, callback?: (err: Error | null, count: number) => void): Query<DocType | null, DocType>;

    /** Creates a `findOneAndDelete` query: atomically finds the given document, deletes it, and returns the document as it was before deletion. */
    findOneAndDelete(filter?: FilterQuery<DocType>, options?: QueryOptions | null, callback?: (err: any, doc: DocType | null, res: any) => void): Query<DocType | null, DocType>;

    /** Creates a `findOneAndRemove` query: atomically finds the given document and deletes it. */
    findOneAndRemove(filter?: FilterQuery<DocType>, options?: QueryOptions | null, callback?: (err: any, doc: DocType | null, res: any) => void): Query<DocType | null, DocType>;
    
    /** Creates a `findOneAndUpdate` query: atomically find the first document that matches `filter` and apply `update`. */
    findOneAndUpdate(filter?: FilterQuery<DocType>, update?: UpdateQuery<DocType>, options?: QueryOptions | null, callback?: (err: any, doc: DocType | null, res: any) => void): Query<DocType | null, DocType>;

    /** Creates a `findByIdAndDelete` query, filtering by the given `_id`. */
    findByIdAndDelete(id?: mongodb.ObjectId | any, options?: QueryOptions | null, callback?: (err: any, doc: DocType | null, res: any) => void): Query<DocType | null, DocType>;

    /** Creates a `findOneAndUpdate` query, filtering by the given `_id`. */
    findByIdAndUpdate(id?: mongodb.ObjectId | any, update?: UpdateQuery<DocType>, options?: QueryOptions | null, callback?: (err: any, doc: DocType | null, res: any) => void): Query<DocType | null, DocType>;

    /**
     * For update operations, returns the value of a path in the update's `$set`.
     * Useful for writing getters/setters that can work with both update operations
     * and `save()`.
     */
    get(path: string): any;

    /** Returns the current query filter (also known as conditions) as a POJO. */
    getFilter(): FilterQuery<DocType>;

    /** Gets query options. */
    getOptions(): QueryOptions;

    /** Returns the current query filter. Equivalent to `getFilter()`. */
    getQuery(): FilterQuery<DocType>;

    /** Returns the current update operations as a JSON object. */
    getUpdate(): UpdateQuery<DocType> | null;

    /** Specifies a `$gt` query condition. When called with one argument, the most recent path passed to `where()` is used. */
    gt(val: number): this;
    gt(path: string, val: number): this;

    /** Specifies a `$gte` query condition. When called with one argument, the most recent path passed to `where()` is used. */
    gte(val: number): this;
    gte(path: string, val: number): this;

    /** Sets query hints. */
    hint(val: any): this;

    /** Specifies an `$in` query condition. When called with one argument, the most recent path passed to `where()` is used. */
    in(val: Array<any>): this;
    in(path: string, val: Array<any>): this;

    /** Requests acknowledgement that this operation has been persisted to MongoDB's on-disk journal. */
    j(val: boolean | null): this;

    /** Sets the lean option. */
    lean(val?: boolean | any): this;

    /** Specifies the maximum number of documents the query will return. */
    limit(val: number): this;

    /** Specifies a `$lt` query condition. When called with one argument, the most recent path passed to `where()` is used. */
    lt(val: number): this;
    lt(path: string, val: number): this;

    /** Specifies a `$lte` query condition. When called with one argument, the most recent path passed to `where()` is used. */
    lte(val: number): this;
    lte(path: string, val: number): this;

    /** Specifies an `$maxDistance` query condition. When called with one argument, the most recent path passed to `where()` is used. */
    maxDistance(val: number): this;
    maxDistance(path: string, val: number): this;

    /** Specifies the maxScan option. */
    maxScan(val: number): this;

    /**
     * Sets the [maxTimeMS](https://docs.mongodb.com/manual/reference/method/cursor.maxTimeMS/)
     * option. This will tell the MongoDB server to abort if the query or write op
     * has been running for more than `ms` milliseconds.
     */
    maxTimeMS(ms: number): this;

    /** Merges another Query or conditions object into this one. */
    merge(source: Query<any, any>): this;

    /** Specifies a `$mod` condition, filters documents for documents whose `path` property is a number that is equal to `remainder` modulo `divisor`. */
    mod(val: Array<number>): this;
    mod(path: string, val: Array<number>): this;

    /**
     * Getter/setter around the current mongoose-specific options for this query
     * Below are the current Mongoose-specific options.
     */
    mongooseOptions(val?: Pick<QueryOptions, "populate" | "lean" | "omitUndefined" | "strict" | "useFindAndModify">): Pick<QueryOptions, "populate" | "lean" | "omitUndefined" | "strict" | "useFindAndModify">;

    /** Specifies a `$ne` query condition. When called with one argument, the most recent path passed to `where()` is used. */
    ne(val: any): this;
    ne(path: string, val: any);

    /** Specifies an `$nin` query condition. When called with one argument, the most recent path passed to `where()` is used. */
    nin(val: Array<any>): this;
    nin(path: string, val: Array<any>): this;

    /** Specifies arguments for an `$nor` condition. */
    nor(array: Array<FilterQuery<DocType>>): this;

    /** Specifies arguments for an `$or` condition. */
    or(array: Array<FilterQuery<DocType>>): this;

    /** Get/set the current projection (AKA fields). Pass `null` to remove the current projection. */
    projection(fields?: any | null): any;

    /** Determines the MongoDB nodes from which to read. */
    read(pref: string | mongodb.ReadPreferenceMode, tags?: any[]): this;

    /** Sets the readConcern option for the query. */
    readConcern(level: string): this;

    /** Specifies a `$regex` query condition. When called with one argument, the most recent path passed to `where()` is used. */
    regex(val: string | RegExp): this;
    regex(path: string, val: string | RegExp): this;

    /**
     * Declare and/or execute this query as a remove() operation. `remove()` is
     * deprecated, you should use [`deleteOne()`](#query_Query-deleteOne)
     * or [`deleteMany()`](#query_Query-deleteMany) instead. 
     */
    remove(filter?: FilterQuery<DocType>, callback?: (err: Error | null, res: mongodb.WriteOpResult['result']) => void): Query<mongodb.WriteOpResult['result'], DocType>;

    /** Specifies which document fields to include or exclude (also known as the query "projection") */
    select(arg: string | any): this;

    /**
     * Sets the [MongoDB session](https://docs.mongodb.com/manual/reference/server-sessions/)
     * associated with this query. Sessions are how you mark a query as part of a
     * [transaction](/docs/transactions.html).
     */
    session(session: mongodb.ClientSession | null): this;

    /**
     * Adds a `$set` to this query's update without changing the operation.
     * This is useful for query middleware so you can add an update regardless
     * of whether you use `updateOne()`, `updateMany()`, `findOneAndUpdate()`, etc. 
     */
    set(path: string, value: any): this;

    /** Sets query options. Some options only make sense for certain operations. */
    setOptions(options: QueryOptions, overwrite: boolean): this;

    /** Sets the query conditions to the provided JSON object. */
    setQuery(val: FilterQuery<DocType> | null): void;

    setUpdate(update: UpdateQuery<DocType>): void;

    /** Specifies an `$size` query condition. When called with one argument, the most recent path passed to `where()` is used. */
    size(val: number): this;
    size(path: string, val: number): this;

    /** Specifies the number of documents to skip. */
    skip(val: number): this;

    /** Specifies a `$slice` projection for an array. */
    slice(val: number | Array<number>): this;
    slice(path: string, val: number | Array<number>): this;

    /** Specifies this query as a `snapshot` query. */
    snapshot(val?: boolean): this;

    /** Sets the sort order. If an object is passed, values allowed are `asc`, `desc`, `ascending`, `descending`, `1`, and `-1`. */
    sort(arg: string | any): this;

    /** Converts this query to a customized, reusable query constructor with all arguments and options retained. */
    toConstructor(): new (filter?: FilterQuery<DocType>, options?: QueryOptions) => Query<ResultType, DocType>;

    /**
     * Sets the specified number of `mongod` servers, or tag set of `mongod` servers,
     * that must acknowledge this write before this write is considered successful.
     */
    w(val: string | number | null): this;

    /** Specifies a path for use with chaining. */
    where(path: string, val?: any): this;

    /** Defines a `$within` or `$geoWithin` argument for geo-spatial queries. */
    within(val?: any): this;

    /**
     * If [`w > 1`](/docs/api.html#query_Query-w), the maximum amount of time to
     * wait for this write to propagate through the replica set before this
     * operation fails. The default is `0`, which means no timeout.
     */
    wtimeout(ms: number): this;
  }

  export type FilterQuery<T> = {
    [P in keyof T]?: P extends '_id'
      ? [Extract<T[P], mongodb.ObjectId>] extends [never]
        ? mongodb.Condition<T[P]>
        : mongodb.Condition<T[P] | string | { _id: mongodb.ObjectId }>
      : [Extract<T[P], mongodb.ObjectId>] extends [never]
      ? mongodb.Condition<T[P]>
      : mongodb.Condition<T[P] | string>;
  } &
    mongodb.RootQuerySelector<T>;
  
  export type UpdateQuery<T> = mongodb.UpdateQuery<T> & mongodb.MatchKeysAndValues<T>;

  export type DocumentDefinition<T> = Omit<T, Exclude<keyof Document, '_id'>>

  class Aggregate<R> {
    /**
     * Sets an option on this aggregation. This function will be deprecated in a
     * future release. */
    addCursorFlag(flag: string, value: boolean): this;

    /** Sets the allowDiskUse option for the aggregation query (ignored for < 2.6.0) */
    allowDiskUse(value: boolean): this;

    /**
     * Executes the query returning a `Promise` which will be
     * resolved with either the doc(s) or rejected with the error.
     * Like [`.then()`](#query_Query-then), but only takes a rejection handler.
     */
    catch: Promise<R>["catch"];

    /** Adds a collation. */
    collation(options: mongodb.CollationDocument): this;

    /** Appends a new $count operator to this aggregate pipeline. */
    count(countName: string): this;

    /**
     * Sets the cursor option option for the aggregation query (ignored for < 2.6.0).
     */
    cursor(options?: object): this;

    /** Executes the aggregate pipeline on the currently bound Model. If cursor option is set, returns a cursor */
    exec(callback?: (err: any, result: R) => void): Promise<R> | any;

    /** Execute the aggregation with explain */
    explain(callback?: (err: Error, result: any) => void): Promise<any>;

    /** Combines multiple aggregation pipelines. */
    facet(options: any): this;

    /** Appends new custom $graphLookup operator(s) to this aggregate pipeline, performing a recursive search on a collection. */
    graphLookup(options: any): this;

    /** Sets the hint option for the aggregation query (ignored for < 3.6.0) */
    hint(value: object | string): this;

    /** Appends new custom $lookup operator to this aggregate pipeline. */
    lookup(options: any): this;

    /** Returns the current pipeline */
    pipeline(): any[];

    /** Sets the readPreference option for the aggregation query. */
    read(pref: string | mongodb.ReadPreferenceMode, tags?: any[]): this;

    /** Sets the readConcern level for the aggregation query. */
    readConcern(level: string): this;

    /** Appends a new $redact operator to this aggregate pipeline. */
    redact(expression: any, thenExpr: string | any, elseExpr: string | any): this;

    /**
     * Helper for [Atlas Text Search](https://docs.atlas.mongodb.com/reference/atlas-search/tutorial/)'s
     * `$search` stage.
     */
    search(options: any): this;

    /** Lets you set arbitrary options, for middleware or plugins. */
    option(value: object): this;

    /** Appends new custom $sample operator to this aggregate pipeline. */
    sample(size: number): this;

    /** Sets the session for this aggregation. Useful for [transactions](/docs/transactions.html). */
    session(session: mongodb.ClientSession | null): this;

    /** Appends a new $sort operator to this aggregate pipeline. */
    sort(arg: any): this;

    /** Provides promise for aggregate. */
    then: Promise<R>["then"];

    /**
     * Appends a new $sortByCount operator to this aggregate pipeline. Accepts either a string field name
     * or a pipeline object.
     */
    sortByCount(arg: string | any): this;
  }

  class SchemaType {
    /** SchemaType constructor */
    constructor(path: string, options?: any, instance?: string);

    /** Get/set the function used to cast arbitrary values to this type. */
    static cast(caster?: Function | boolean): Function;

    /** Sets a default option for this schema type. */
    static set(option: string, value: any): void;

    /** Attaches a getter for all instances of this schema type. */
    static get(getter: (value: any) => any): void;

    /** Sets a default value for this SchemaType. */
    default(val: any): any;

    /** Adds a getter to this schematype. */
    get(fn: Function): this;

    /**
     * Defines this path as immutable. Mongoose prevents you from changing
     * immutable paths unless the parent document has [`isNew: true`](/docs/api.html#document_Document-isNew).
     */
    immutable(bool: boolean): this;

    /** Declares the index options for this schematype. */
    index(options: any): this;

    /**
     * Set the model that this path refers to. This is the option that [populate](https://mongoosejs.com/docs/populate.html)
     * looks at to determine the foreign collection it should query.
     */
    ref(ref: string | boolean | Model<any>): this;

    /**
     * Adds a required validator to this SchemaType. The validator gets added
     * to the front of this SchemaType's validators array using unshift().
     */
    required(required: boolean, message?: string): this;

    /** Sets default select() behavior for this path. */
    select(val: boolean): this;

    /** Adds a setter to this schematype. */
    set(fn: Function): this;

    /** Declares a sparse index. */
    sparse(bool: boolean): this;

    /** Declares a full text index. */
    text(bool: boolean): this;

    /** Defines a custom function for transforming this path when converting a document to JSON. */
    transform(fn: (value: any) => any);

    /** Declares an unique index. */
    unique(bool: boolean): this;

    /** Adds validator(s) for this document path. */
    validate(obj: RegExp | Function | any, errorMsg?: string,
      type?: string): this;
  }

  class ValidationError extends Error {
    name: 'ValidationError';

    errors: {[path: string]: ValidatorError | CastError};
  }

  class CastError extends Error {
    name: 'CastError';
    stringValue: string;
    kind: string;
    value: any;
    path: string;
    reason?: any;
    model?: any;
  }

  class ValidatorError extends Error {
    name: 'ValidatorError';
    properties: {message: string, type?: string, path?: string, value?: any, reason?: any};
    kind: string;
    path: string;
    value: any;
    reason?: Error | null;
  }
}