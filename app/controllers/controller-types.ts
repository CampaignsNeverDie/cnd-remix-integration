/**
 * Abstract DBResult to represent results from any database.
 */
export abstract class DBResult {
  /**
   * Instantiates a new DBResult object.
   * @param records? optional initial array of entities for this DB result
   */
  constructor(protected records: any[]) {}

  /**
   * The number of entities in this DB result
   * @returns {number} the number of entities in this result
   */
  count(): number {
    return this.records.length;
  }
  /**
   * The entities in this DB result
   * @returns {any[]} an arry of entity objects in this result
   */
  rows(): any[] {
    return this.records;
  }
}

/**
 * Represents the type used to define a where/having condition
 */
type ConditionType = {
  field: any;
  operator: any;
  value: any;
};

/**
 * Represents the available query options for the DBInterface
 */
export type QueryOptions = {
  /**
   * The name assigned to the collection of entities (e.g. table name, collection ref, etc.)
   */
  collection: string;
  where?: ConditionType;
  groupBy?: string;
  having?: ConditionType;
};

/**
 * Required interface for database support in the application.
 */
export interface DBInterface {
  /**
   * Queries the database.
   * @param {QueryOptions} options optional modifiers for the query
   * @returns {DBResult}  A DBResult object
   */
  executeQuery<T>(queryOptions?: QueryOptions): Promise<DBResult>;
  /**
   * Inserts an entity or entities into the database
   * @template Model
   * @param {Model | Model[]} model a generic parameter that represents the desired model or an array of the desired models to insert
   * @param {QueryOptions} queryOptions optional modifiers for the query
   * @returns {DBResult}  A DBResult object
   */
  executeInsert<T>(model: T | T[], queryOptions?: QueryOptions): Promise<DBResult>;
  /**
   * Updates an entity in the database
   * @template Model
   * @param {Model} model a generic parameter that represents the desired model to update
   * @param {QueryOptions} queryOptions optional modifiers for the query
   * @returns {DBResult}  A DBResult object
   */
  executeUpdate<T>(model: T, queryOptions?: QueryOptions): Promise<DBResult>;
  /**
   * Deletes an entity from the database
   * @template Model
   * @param {Model} model a generic parameter that represents the desired model to delete
   * @param {QueryOptions} queryOptions optional modifiers for the query
   * @returns {DBResult}  A DBResult object
   */
  executeDelete<T>(model: T, queryOptions?: QueryOptions): Promise<DBResult>;
}

/**
 * Abstract class for all controllers to extend
 */
export abstract class AbstractController<Model> {
  /**
   * Instantiates a new controller.
   * @param {string} collection the name used to represent the collection of models in the database
   * @param {DBInterface} db the database reference
   */
  constructor(protected collection: string, protected db: DBInterface) {}
}