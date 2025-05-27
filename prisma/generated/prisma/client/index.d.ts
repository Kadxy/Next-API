
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Wallet
 * 
 */
export type Wallet = $Result.DefaultSelection<Prisma.$WalletPayload>
/**
 * Model WalletMember
 * 
 */
export type WalletMember = $Result.DefaultSelection<Prisma.$WalletMemberPayload>
/**
 * Model ApiKey
 * 
 */
export type ApiKey = $Result.DefaultSelection<Prisma.$ApiKeyPayload>
/**
 * Model Passkey
 * 
 */
export type Passkey = $Result.DefaultSelection<Prisma.$PasskeyPayload>
/**
 * Model RedemptionCode
 * 
 */
export type RedemptionCode = $Result.DefaultSelection<Prisma.$RedemptionCodePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.wallet`: Exposes CRUD operations for the **Wallet** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Wallets
    * const wallets = await prisma.wallet.findMany()
    * ```
    */
  get wallet(): Prisma.WalletDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.walletMember`: Exposes CRUD operations for the **WalletMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WalletMembers
    * const walletMembers = await prisma.walletMember.findMany()
    * ```
    */
  get walletMember(): Prisma.WalletMemberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.apiKey`: Exposes CRUD operations for the **ApiKey** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ApiKeys
    * const apiKeys = await prisma.apiKey.findMany()
    * ```
    */
  get apiKey(): Prisma.ApiKeyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.passkey`: Exposes CRUD operations for the **Passkey** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Passkeys
    * const passkeys = await prisma.passkey.findMany()
    * ```
    */
  get passkey(): Prisma.PasskeyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.redemptionCode`: Exposes CRUD operations for the **RedemptionCode** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RedemptionCodes
    * const redemptionCodes = await prisma.redemptionCode.findMany()
    * ```
    */
  get redemptionCode(): Prisma.RedemptionCodeDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Wallet: 'Wallet',
    WalletMember: 'WalletMember',
    ApiKey: 'ApiKey',
    Passkey: 'Passkey',
    RedemptionCode: 'RedemptionCode'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "wallet" | "walletMember" | "apiKey" | "passkey" | "redemptionCode"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Wallet: {
        payload: Prisma.$WalletPayload<ExtArgs>
        fields: Prisma.WalletFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WalletFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WalletFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          findFirst: {
            args: Prisma.WalletFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WalletFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          findMany: {
            args: Prisma.WalletFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>[]
          }
          create: {
            args: Prisma.WalletCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          createMany: {
            args: Prisma.WalletCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.WalletDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          update: {
            args: Prisma.WalletUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          deleteMany: {
            args: Prisma.WalletDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WalletUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WalletUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          aggregate: {
            args: Prisma.WalletAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWallet>
          }
          groupBy: {
            args: Prisma.WalletGroupByArgs<ExtArgs>
            result: $Utils.Optional<WalletGroupByOutputType>[]
          }
          count: {
            args: Prisma.WalletCountArgs<ExtArgs>
            result: $Utils.Optional<WalletCountAggregateOutputType> | number
          }
        }
      }
      WalletMember: {
        payload: Prisma.$WalletMemberPayload<ExtArgs>
        fields: Prisma.WalletMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WalletMemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WalletMemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletMemberPayload>
          }
          findFirst: {
            args: Prisma.WalletMemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WalletMemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletMemberPayload>
          }
          findMany: {
            args: Prisma.WalletMemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletMemberPayload>[]
          }
          create: {
            args: Prisma.WalletMemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletMemberPayload>
          }
          createMany: {
            args: Prisma.WalletMemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.WalletMemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletMemberPayload>
          }
          update: {
            args: Prisma.WalletMemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletMemberPayload>
          }
          deleteMany: {
            args: Prisma.WalletMemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WalletMemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WalletMemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletMemberPayload>
          }
          aggregate: {
            args: Prisma.WalletMemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWalletMember>
          }
          groupBy: {
            args: Prisma.WalletMemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<WalletMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.WalletMemberCountArgs<ExtArgs>
            result: $Utils.Optional<WalletMemberCountAggregateOutputType> | number
          }
        }
      }
      ApiKey: {
        payload: Prisma.$ApiKeyPayload<ExtArgs>
        fields: Prisma.ApiKeyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApiKeyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApiKeyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          findFirst: {
            args: Prisma.ApiKeyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApiKeyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          findMany: {
            args: Prisma.ApiKeyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[]
          }
          create: {
            args: Prisma.ApiKeyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          createMany: {
            args: Prisma.ApiKeyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ApiKeyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          update: {
            args: Prisma.ApiKeyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          deleteMany: {
            args: Prisma.ApiKeyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApiKeyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ApiKeyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          aggregate: {
            args: Prisma.ApiKeyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApiKey>
          }
          groupBy: {
            args: Prisma.ApiKeyGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApiKeyGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApiKeyCountArgs<ExtArgs>
            result: $Utils.Optional<ApiKeyCountAggregateOutputType> | number
          }
        }
      }
      Passkey: {
        payload: Prisma.$PasskeyPayload<ExtArgs>
        fields: Prisma.PasskeyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PasskeyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PasskeyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyPayload>
          }
          findFirst: {
            args: Prisma.PasskeyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PasskeyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyPayload>
          }
          findMany: {
            args: Prisma.PasskeyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyPayload>[]
          }
          create: {
            args: Prisma.PasskeyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyPayload>
          }
          createMany: {
            args: Prisma.PasskeyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PasskeyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyPayload>
          }
          update: {
            args: Prisma.PasskeyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyPayload>
          }
          deleteMany: {
            args: Prisma.PasskeyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PasskeyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PasskeyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyPayload>
          }
          aggregate: {
            args: Prisma.PasskeyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePasskey>
          }
          groupBy: {
            args: Prisma.PasskeyGroupByArgs<ExtArgs>
            result: $Utils.Optional<PasskeyGroupByOutputType>[]
          }
          count: {
            args: Prisma.PasskeyCountArgs<ExtArgs>
            result: $Utils.Optional<PasskeyCountAggregateOutputType> | number
          }
        }
      }
      RedemptionCode: {
        payload: Prisma.$RedemptionCodePayload<ExtArgs>
        fields: Prisma.RedemptionCodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RedemptionCodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionCodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RedemptionCodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionCodePayload>
          }
          findFirst: {
            args: Prisma.RedemptionCodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionCodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RedemptionCodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionCodePayload>
          }
          findMany: {
            args: Prisma.RedemptionCodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionCodePayload>[]
          }
          create: {
            args: Prisma.RedemptionCodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionCodePayload>
          }
          createMany: {
            args: Prisma.RedemptionCodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.RedemptionCodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionCodePayload>
          }
          update: {
            args: Prisma.RedemptionCodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionCodePayload>
          }
          deleteMany: {
            args: Prisma.RedemptionCodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RedemptionCodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RedemptionCodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RedemptionCodePayload>
          }
          aggregate: {
            args: Prisma.RedemptionCodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRedemptionCode>
          }
          groupBy: {
            args: Prisma.RedemptionCodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<RedemptionCodeGroupByOutputType>[]
          }
          count: {
            args: Prisma.RedemptionCodeCountArgs<ExtArgs>
            result: $Utils.Optional<RedemptionCodeCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    wallet?: WalletOmit
    walletMember?: WalletMemberOmit
    apiKey?: ApiKeyOmit
    passkey?: PasskeyOmit
    redemptionCode?: RedemptionCodeOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    walletMembers: number
    passkeys: number
    redeemCodes: number
    createdApiKeys: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    walletMembers?: boolean | UserCountOutputTypeCountWalletMembersArgs
    passkeys?: boolean | UserCountOutputTypeCountPasskeysArgs
    redeemCodes?: boolean | UserCountOutputTypeCountRedeemCodesArgs
    createdApiKeys?: boolean | UserCountOutputTypeCountCreatedApiKeysArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWalletMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WalletMemberWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPasskeysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasskeyWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRedeemCodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RedemptionCodeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreatedApiKeysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiKeyWhereInput
  }


  /**
   * Count Type WalletCountOutputType
   */

  export type WalletCountOutputType = {
    members: number
    apiKeys: number
  }

  export type WalletCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | WalletCountOutputTypeCountMembersArgs
    apiKeys?: boolean | WalletCountOutputTypeCountApiKeysArgs
  }

  // Custom InputTypes
  /**
   * WalletCountOutputType without action
   */
  export type WalletCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletCountOutputType
     */
    select?: WalletCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WalletCountOutputType without action
   */
  export type WalletCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WalletMemberWhereInput
  }

  /**
   * WalletCountOutputType without action
   */
  export type WalletCountOutputTypeCountApiKeysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiKeyWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    uid: string | null
    displayName: string | null
    avatar: string | null
    email: string | null
    phone: string | null
    gitHubId: string | null
    googleId: string | null
    isActive: boolean | null
    isDeleted: boolean | null
    isAdmin: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    lastLoginAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    uid: string | null
    displayName: string | null
    avatar: string | null
    email: string | null
    phone: string | null
    gitHubId: string | null
    googleId: string | null
    isActive: boolean | null
    isDeleted: boolean | null
    isAdmin: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    lastLoginAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    uid: number
    displayName: number
    avatar: number
    email: number
    phone: number
    gitHubId: number
    googleId: number
    isActive: number
    isDeleted: number
    isAdmin: number
    createdAt: number
    updatedAt: number
    lastLoginAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    uid?: true
    displayName?: true
    avatar?: true
    email?: true
    phone?: true
    gitHubId?: true
    googleId?: true
    isActive?: true
    isDeleted?: true
    isAdmin?: true
    createdAt?: true
    updatedAt?: true
    lastLoginAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    uid?: true
    displayName?: true
    avatar?: true
    email?: true
    phone?: true
    gitHubId?: true
    googleId?: true
    isActive?: true
    isDeleted?: true
    isAdmin?: true
    createdAt?: true
    updatedAt?: true
    lastLoginAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    uid?: true
    displayName?: true
    avatar?: true
    email?: true
    phone?: true
    gitHubId?: true
    googleId?: true
    isActive?: true
    isDeleted?: true
    isAdmin?: true
    createdAt?: true
    updatedAt?: true
    lastLoginAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    uid: string
    displayName: string | null
    avatar: string | null
    email: string | null
    phone: string | null
    gitHubId: string | null
    googleId: string | null
    isActive: boolean
    isDeleted: boolean
    isAdmin: boolean
    createdAt: Date
    updatedAt: Date
    lastLoginAt: Date | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uid?: boolean
    displayName?: boolean
    avatar?: boolean
    email?: boolean
    phone?: boolean
    gitHubId?: boolean
    googleId?: boolean
    isActive?: boolean
    isDeleted?: boolean
    isAdmin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastLoginAt?: boolean
    wallet?: boolean | User$walletArgs<ExtArgs>
    walletMembers?: boolean | User$walletMembersArgs<ExtArgs>
    passkeys?: boolean | User$passkeysArgs<ExtArgs>
    redeemCodes?: boolean | User$redeemCodesArgs<ExtArgs>
    createdApiKeys?: boolean | User$createdApiKeysArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    uid?: boolean
    displayName?: boolean
    avatar?: boolean
    email?: boolean
    phone?: boolean
    gitHubId?: boolean
    googleId?: boolean
    isActive?: boolean
    isDeleted?: boolean
    isAdmin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastLoginAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uid" | "displayName" | "avatar" | "email" | "phone" | "gitHubId" | "googleId" | "isActive" | "isDeleted" | "isAdmin" | "createdAt" | "updatedAt" | "lastLoginAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | User$walletArgs<ExtArgs>
    walletMembers?: boolean | User$walletMembersArgs<ExtArgs>
    passkeys?: boolean | User$passkeysArgs<ExtArgs>
    redeemCodes?: boolean | User$redeemCodesArgs<ExtArgs>
    createdApiKeys?: boolean | User$createdApiKeysArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      wallet: Prisma.$WalletPayload<ExtArgs> | null
      walletMembers: Prisma.$WalletMemberPayload<ExtArgs>[]
      passkeys: Prisma.$PasskeyPayload<ExtArgs>[]
      redeemCodes: Prisma.$RedemptionCodePayload<ExtArgs>[]
      createdApiKeys: Prisma.$ApiKeyPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uid: string
      displayName: string | null
      avatar: string | null
      email: string | null
      phone: string | null
      gitHubId: string | null
      googleId: string | null
      isActive: boolean
      isDeleted: boolean
      isAdmin: boolean
      createdAt: Date
      updatedAt: Date
      lastLoginAt: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wallet<T extends User$walletArgs<ExtArgs> = {}>(args?: Subset<T, User$walletArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    walletMembers<T extends User$walletMembersArgs<ExtArgs> = {}>(args?: Subset<T, User$walletMembersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    passkeys<T extends User$passkeysArgs<ExtArgs> = {}>(args?: Subset<T, User$passkeysArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasskeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    redeemCodes<T extends User$redeemCodesArgs<ExtArgs> = {}>(args?: Subset<T, User$redeemCodesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RedemptionCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    createdApiKeys<T extends User$createdApiKeysArgs<ExtArgs> = {}>(args?: Subset<T, User$createdApiKeysArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly uid: FieldRef<"User", 'String'>
    readonly displayName: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly gitHubId: FieldRef<"User", 'String'>
    readonly googleId: FieldRef<"User", 'String'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly isDeleted: FieldRef<"User", 'Boolean'>
    readonly isAdmin: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly lastLoginAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.wallet
   */
  export type User$walletArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    where?: WalletWhereInput
  }

  /**
   * User.walletMembers
   */
  export type User$walletMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletMember
     */
    select?: WalletMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletMember
     */
    omit?: WalletMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletMemberInclude<ExtArgs> | null
    where?: WalletMemberWhereInput
    orderBy?: WalletMemberOrderByWithRelationInput | WalletMemberOrderByWithRelationInput[]
    cursor?: WalletMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WalletMemberScalarFieldEnum | WalletMemberScalarFieldEnum[]
  }

  /**
   * User.passkeys
   */
  export type User$passkeysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passkey
     */
    select?: PasskeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passkey
     */
    omit?: PasskeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyInclude<ExtArgs> | null
    where?: PasskeyWhereInput
    orderBy?: PasskeyOrderByWithRelationInput | PasskeyOrderByWithRelationInput[]
    cursor?: PasskeyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PasskeyScalarFieldEnum | PasskeyScalarFieldEnum[]
  }

  /**
   * User.redeemCodes
   */
  export type User$redeemCodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RedemptionCode
     */
    select?: RedemptionCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RedemptionCode
     */
    omit?: RedemptionCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionCodeInclude<ExtArgs> | null
    where?: RedemptionCodeWhereInput
    orderBy?: RedemptionCodeOrderByWithRelationInput | RedemptionCodeOrderByWithRelationInput[]
    cursor?: RedemptionCodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RedemptionCodeScalarFieldEnum | RedemptionCodeScalarFieldEnum[]
  }

  /**
   * User.createdApiKeys
   */
  export type User$createdApiKeysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    where?: ApiKeyWhereInput
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    cursor?: ApiKeyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Wallet
   */

  export type AggregateWallet = {
    _count: WalletCountAggregateOutputType | null
    _avg: WalletAvgAggregateOutputType | null
    _sum: WalletSumAggregateOutputType | null
    _min: WalletMinAggregateOutputType | null
    _max: WalletMaxAggregateOutputType | null
  }

  export type WalletAvgAggregateOutputType = {
    id: number | null
    balance: Decimal | null
    version: number | null
    ownerId: number | null
  }

  export type WalletSumAggregateOutputType = {
    id: number | null
    balance: Decimal | null
    version: number | null
    ownerId: number | null
  }

  export type WalletMinAggregateOutputType = {
    id: number | null
    uid: string | null
    balance: Decimal | null
    version: number | null
    ownerId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WalletMaxAggregateOutputType = {
    id: number | null
    uid: string | null
    balance: Decimal | null
    version: number | null
    ownerId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WalletCountAggregateOutputType = {
    id: number
    uid: number
    balance: number
    version: number
    ownerId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WalletAvgAggregateInputType = {
    id?: true
    balance?: true
    version?: true
    ownerId?: true
  }

  export type WalletSumAggregateInputType = {
    id?: true
    balance?: true
    version?: true
    ownerId?: true
  }

  export type WalletMinAggregateInputType = {
    id?: true
    uid?: true
    balance?: true
    version?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WalletMaxAggregateInputType = {
    id?: true
    uid?: true
    balance?: true
    version?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WalletCountAggregateInputType = {
    id?: true
    uid?: true
    balance?: true
    version?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WalletAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Wallet to aggregate.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Wallets
    **/
    _count?: true | WalletCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WalletAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WalletSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WalletMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WalletMaxAggregateInputType
  }

  export type GetWalletAggregateType<T extends WalletAggregateArgs> = {
        [P in keyof T & keyof AggregateWallet]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWallet[P]>
      : GetScalarType<T[P], AggregateWallet[P]>
  }




  export type WalletGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WalletWhereInput
    orderBy?: WalletOrderByWithAggregationInput | WalletOrderByWithAggregationInput[]
    by: WalletScalarFieldEnum[] | WalletScalarFieldEnum
    having?: WalletScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WalletCountAggregateInputType | true
    _avg?: WalletAvgAggregateInputType
    _sum?: WalletSumAggregateInputType
    _min?: WalletMinAggregateInputType
    _max?: WalletMaxAggregateInputType
  }

  export type WalletGroupByOutputType = {
    id: number
    uid: string
    balance: Decimal
    version: number
    ownerId: number
    createdAt: Date
    updatedAt: Date
    _count: WalletCountAggregateOutputType | null
    _avg: WalletAvgAggregateOutputType | null
    _sum: WalletSumAggregateOutputType | null
    _min: WalletMinAggregateOutputType | null
    _max: WalletMaxAggregateOutputType | null
  }

  type GetWalletGroupByPayload<T extends WalletGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WalletGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WalletGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WalletGroupByOutputType[P]>
            : GetScalarType<T[P], WalletGroupByOutputType[P]>
        }
      >
    >


  export type WalletSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uid?: boolean
    balance?: boolean
    version?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    members?: boolean | Wallet$membersArgs<ExtArgs>
    apiKeys?: boolean | Wallet$apiKeysArgs<ExtArgs>
    _count?: boolean | WalletCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wallet"]>



  export type WalletSelectScalar = {
    id?: boolean
    uid?: boolean
    balance?: boolean
    version?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WalletOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uid" | "balance" | "version" | "ownerId" | "createdAt" | "updatedAt", ExtArgs["result"]["wallet"]>
  export type WalletInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    members?: boolean | Wallet$membersArgs<ExtArgs>
    apiKeys?: boolean | Wallet$apiKeysArgs<ExtArgs>
    _count?: boolean | WalletCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $WalletPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Wallet"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs>
      members: Prisma.$WalletMemberPayload<ExtArgs>[]
      apiKeys: Prisma.$ApiKeyPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uid: string
      balance: Prisma.Decimal
      version: number
      ownerId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["wallet"]>
    composites: {}
  }

  type WalletGetPayload<S extends boolean | null | undefined | WalletDefaultArgs> = $Result.GetResult<Prisma.$WalletPayload, S>

  type WalletCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WalletFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WalletCountAggregateInputType | true
    }

  export interface WalletDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Wallet'], meta: { name: 'Wallet' } }
    /**
     * Find zero or one Wallet that matches the filter.
     * @param {WalletFindUniqueArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WalletFindUniqueArgs>(args: SelectSubset<T, WalletFindUniqueArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Wallet that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WalletFindUniqueOrThrowArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WalletFindUniqueOrThrowArgs>(args: SelectSubset<T, WalletFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Wallet that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletFindFirstArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WalletFindFirstArgs>(args?: SelectSubset<T, WalletFindFirstArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Wallet that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletFindFirstOrThrowArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WalletFindFirstOrThrowArgs>(args?: SelectSubset<T, WalletFindFirstOrThrowArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Wallets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Wallets
     * const wallets = await prisma.wallet.findMany()
     * 
     * // Get first 10 Wallets
     * const wallets = await prisma.wallet.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const walletWithIdOnly = await prisma.wallet.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WalletFindManyArgs>(args?: SelectSubset<T, WalletFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Wallet.
     * @param {WalletCreateArgs} args - Arguments to create a Wallet.
     * @example
     * // Create one Wallet
     * const Wallet = await prisma.wallet.create({
     *   data: {
     *     // ... data to create a Wallet
     *   }
     * })
     * 
     */
    create<T extends WalletCreateArgs>(args: SelectSubset<T, WalletCreateArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Wallets.
     * @param {WalletCreateManyArgs} args - Arguments to create many Wallets.
     * @example
     * // Create many Wallets
     * const wallet = await prisma.wallet.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WalletCreateManyArgs>(args?: SelectSubset<T, WalletCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Wallet.
     * @param {WalletDeleteArgs} args - Arguments to delete one Wallet.
     * @example
     * // Delete one Wallet
     * const Wallet = await prisma.wallet.delete({
     *   where: {
     *     // ... filter to delete one Wallet
     *   }
     * })
     * 
     */
    delete<T extends WalletDeleteArgs>(args: SelectSubset<T, WalletDeleteArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Wallet.
     * @param {WalletUpdateArgs} args - Arguments to update one Wallet.
     * @example
     * // Update one Wallet
     * const wallet = await prisma.wallet.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WalletUpdateArgs>(args: SelectSubset<T, WalletUpdateArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Wallets.
     * @param {WalletDeleteManyArgs} args - Arguments to filter Wallets to delete.
     * @example
     * // Delete a few Wallets
     * const { count } = await prisma.wallet.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WalletDeleteManyArgs>(args?: SelectSubset<T, WalletDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Wallets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Wallets
     * const wallet = await prisma.wallet.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WalletUpdateManyArgs>(args: SelectSubset<T, WalletUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Wallet.
     * @param {WalletUpsertArgs} args - Arguments to update or create a Wallet.
     * @example
     * // Update or create a Wallet
     * const wallet = await prisma.wallet.upsert({
     *   create: {
     *     // ... data to create a Wallet
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Wallet we want to update
     *   }
     * })
     */
    upsert<T extends WalletUpsertArgs>(args: SelectSubset<T, WalletUpsertArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Wallets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletCountArgs} args - Arguments to filter Wallets to count.
     * @example
     * // Count the number of Wallets
     * const count = await prisma.wallet.count({
     *   where: {
     *     // ... the filter for the Wallets we want to count
     *   }
     * })
    **/
    count<T extends WalletCountArgs>(
      args?: Subset<T, WalletCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WalletCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Wallet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WalletAggregateArgs>(args: Subset<T, WalletAggregateArgs>): Prisma.PrismaPromise<GetWalletAggregateType<T>>

    /**
     * Group by Wallet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WalletGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WalletGroupByArgs['orderBy'] }
        : { orderBy?: WalletGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WalletGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWalletGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Wallet model
   */
  readonly fields: WalletFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Wallet.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WalletClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    members<T extends Wallet$membersArgs<ExtArgs> = {}>(args?: Subset<T, Wallet$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    apiKeys<T extends Wallet$apiKeysArgs<ExtArgs> = {}>(args?: Subset<T, Wallet$apiKeysArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Wallet model
   */
  interface WalletFieldRefs {
    readonly id: FieldRef<"Wallet", 'Int'>
    readonly uid: FieldRef<"Wallet", 'String'>
    readonly balance: FieldRef<"Wallet", 'Decimal'>
    readonly version: FieldRef<"Wallet", 'Int'>
    readonly ownerId: FieldRef<"Wallet", 'Int'>
    readonly createdAt: FieldRef<"Wallet", 'DateTime'>
    readonly updatedAt: FieldRef<"Wallet", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Wallet findUnique
   */
  export type WalletFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet findUniqueOrThrow
   */
  export type WalletFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet findFirst
   */
  export type WalletFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Wallets.
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wallets.
     */
    distinct?: WalletScalarFieldEnum | WalletScalarFieldEnum[]
  }

  /**
   * Wallet findFirstOrThrow
   */
  export type WalletFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Wallets.
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wallets.
     */
    distinct?: WalletScalarFieldEnum | WalletScalarFieldEnum[]
  }

  /**
   * Wallet findMany
   */
  export type WalletFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallets to fetch.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Wallets.
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    distinct?: WalletScalarFieldEnum | WalletScalarFieldEnum[]
  }

  /**
   * Wallet create
   */
  export type WalletCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * The data needed to create a Wallet.
     */
    data: XOR<WalletCreateInput, WalletUncheckedCreateInput>
  }

  /**
   * Wallet createMany
   */
  export type WalletCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Wallets.
     */
    data: WalletCreateManyInput | WalletCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Wallet update
   */
  export type WalletUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * The data needed to update a Wallet.
     */
    data: XOR<WalletUpdateInput, WalletUncheckedUpdateInput>
    /**
     * Choose, which Wallet to update.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet updateMany
   */
  export type WalletUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Wallets.
     */
    data: XOR<WalletUpdateManyMutationInput, WalletUncheckedUpdateManyInput>
    /**
     * Filter which Wallets to update
     */
    where?: WalletWhereInput
    /**
     * Limit how many Wallets to update.
     */
    limit?: number
  }

  /**
   * Wallet upsert
   */
  export type WalletUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * The filter to search for the Wallet to update in case it exists.
     */
    where: WalletWhereUniqueInput
    /**
     * In case the Wallet found by the `where` argument doesn't exist, create a new Wallet with this data.
     */
    create: XOR<WalletCreateInput, WalletUncheckedCreateInput>
    /**
     * In case the Wallet was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WalletUpdateInput, WalletUncheckedUpdateInput>
  }

  /**
   * Wallet delete
   */
  export type WalletDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter which Wallet to delete.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet deleteMany
   */
  export type WalletDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Wallets to delete
     */
    where?: WalletWhereInput
    /**
     * Limit how many Wallets to delete.
     */
    limit?: number
  }

  /**
   * Wallet.members
   */
  export type Wallet$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletMember
     */
    select?: WalletMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletMember
     */
    omit?: WalletMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletMemberInclude<ExtArgs> | null
    where?: WalletMemberWhereInput
    orderBy?: WalletMemberOrderByWithRelationInput | WalletMemberOrderByWithRelationInput[]
    cursor?: WalletMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WalletMemberScalarFieldEnum | WalletMemberScalarFieldEnum[]
  }

  /**
   * Wallet.apiKeys
   */
  export type Wallet$apiKeysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    where?: ApiKeyWhereInput
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    cursor?: ApiKeyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * Wallet without action
   */
  export type WalletDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
  }


  /**
   * Model WalletMember
   */

  export type AggregateWalletMember = {
    _count: WalletMemberCountAggregateOutputType | null
    _avg: WalletMemberAvgAggregateOutputType | null
    _sum: WalletMemberSumAggregateOutputType | null
    _min: WalletMemberMinAggregateOutputType | null
    _max: WalletMemberMaxAggregateOutputType | null
  }

  export type WalletMemberAvgAggregateOutputType = {
    id: number | null
    walletId: number | null
    userId: number | null
    creditLimit: Decimal | null
    creditAvailable: Decimal | null
    creditUsed: Decimal | null
  }

  export type WalletMemberSumAggregateOutputType = {
    id: number | null
    walletId: number | null
    userId: number | null
    creditLimit: Decimal | null
    creditAvailable: Decimal | null
    creditUsed: Decimal | null
  }

  export type WalletMemberMinAggregateOutputType = {
    id: number | null
    walletId: number | null
    userId: number | null
    creditLimit: Decimal | null
    creditAvailable: Decimal | null
    creditUsed: Decimal | null
    isActive: boolean | null
    joinedAt: Date | null
    leftAt: Date | null
    updatedAt: Date | null
  }

  export type WalletMemberMaxAggregateOutputType = {
    id: number | null
    walletId: number | null
    userId: number | null
    creditLimit: Decimal | null
    creditAvailable: Decimal | null
    creditUsed: Decimal | null
    isActive: boolean | null
    joinedAt: Date | null
    leftAt: Date | null
    updatedAt: Date | null
  }

  export type WalletMemberCountAggregateOutputType = {
    id: number
    walletId: number
    userId: number
    creditLimit: number
    creditAvailable: number
    creditUsed: number
    isActive: number
    joinedAt: number
    leftAt: number
    updatedAt: number
    _all: number
  }


  export type WalletMemberAvgAggregateInputType = {
    id?: true
    walletId?: true
    userId?: true
    creditLimit?: true
    creditAvailable?: true
    creditUsed?: true
  }

  export type WalletMemberSumAggregateInputType = {
    id?: true
    walletId?: true
    userId?: true
    creditLimit?: true
    creditAvailable?: true
    creditUsed?: true
  }

  export type WalletMemberMinAggregateInputType = {
    id?: true
    walletId?: true
    userId?: true
    creditLimit?: true
    creditAvailable?: true
    creditUsed?: true
    isActive?: true
    joinedAt?: true
    leftAt?: true
    updatedAt?: true
  }

  export type WalletMemberMaxAggregateInputType = {
    id?: true
    walletId?: true
    userId?: true
    creditLimit?: true
    creditAvailable?: true
    creditUsed?: true
    isActive?: true
    joinedAt?: true
    leftAt?: true
    updatedAt?: true
  }

  export type WalletMemberCountAggregateInputType = {
    id?: true
    walletId?: true
    userId?: true
    creditLimit?: true
    creditAvailable?: true
    creditUsed?: true
    isActive?: true
    joinedAt?: true
    leftAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WalletMemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WalletMember to aggregate.
     */
    where?: WalletMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WalletMembers to fetch.
     */
    orderBy?: WalletMemberOrderByWithRelationInput | WalletMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WalletMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WalletMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WalletMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WalletMembers
    **/
    _count?: true | WalletMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WalletMemberAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WalletMemberSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WalletMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WalletMemberMaxAggregateInputType
  }

  export type GetWalletMemberAggregateType<T extends WalletMemberAggregateArgs> = {
        [P in keyof T & keyof AggregateWalletMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWalletMember[P]>
      : GetScalarType<T[P], AggregateWalletMember[P]>
  }




  export type WalletMemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WalletMemberWhereInput
    orderBy?: WalletMemberOrderByWithAggregationInput | WalletMemberOrderByWithAggregationInput[]
    by: WalletMemberScalarFieldEnum[] | WalletMemberScalarFieldEnum
    having?: WalletMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WalletMemberCountAggregateInputType | true
    _avg?: WalletMemberAvgAggregateInputType
    _sum?: WalletMemberSumAggregateInputType
    _min?: WalletMemberMinAggregateInputType
    _max?: WalletMemberMaxAggregateInputType
  }

  export type WalletMemberGroupByOutputType = {
    id: number
    walletId: number
    userId: number
    creditLimit: Decimal
    creditAvailable: Decimal
    creditUsed: Decimal
    isActive: boolean
    joinedAt: Date
    leftAt: Date | null
    updatedAt: Date
    _count: WalletMemberCountAggregateOutputType | null
    _avg: WalletMemberAvgAggregateOutputType | null
    _sum: WalletMemberSumAggregateOutputType | null
    _min: WalletMemberMinAggregateOutputType | null
    _max: WalletMemberMaxAggregateOutputType | null
  }

  type GetWalletMemberGroupByPayload<T extends WalletMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WalletMemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WalletMemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WalletMemberGroupByOutputType[P]>
            : GetScalarType<T[P], WalletMemberGroupByOutputType[P]>
        }
      >
    >


  export type WalletMemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletId?: boolean
    userId?: boolean
    creditLimit?: boolean
    creditAvailable?: boolean
    creditUsed?: boolean
    isActive?: boolean
    joinedAt?: boolean
    leftAt?: boolean
    updatedAt?: boolean
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["walletMember"]>



  export type WalletMemberSelectScalar = {
    id?: boolean
    walletId?: boolean
    userId?: boolean
    creditLimit?: boolean
    creditAvailable?: boolean
    creditUsed?: boolean
    isActive?: boolean
    joinedAt?: boolean
    leftAt?: boolean
    updatedAt?: boolean
  }

  export type WalletMemberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "walletId" | "userId" | "creditLimit" | "creditAvailable" | "creditUsed" | "isActive" | "joinedAt" | "leftAt" | "updatedAt", ExtArgs["result"]["walletMember"]>
  export type WalletMemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $WalletMemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WalletMember"
    objects: {
      wallet: Prisma.$WalletPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      walletId: number
      userId: number
      creditLimit: Prisma.Decimal
      creditAvailable: Prisma.Decimal
      creditUsed: Prisma.Decimal
      isActive: boolean
      joinedAt: Date
      leftAt: Date | null
      updatedAt: Date
    }, ExtArgs["result"]["walletMember"]>
    composites: {}
  }

  type WalletMemberGetPayload<S extends boolean | null | undefined | WalletMemberDefaultArgs> = $Result.GetResult<Prisma.$WalletMemberPayload, S>

  type WalletMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WalletMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WalletMemberCountAggregateInputType | true
    }

  export interface WalletMemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WalletMember'], meta: { name: 'WalletMember' } }
    /**
     * Find zero or one WalletMember that matches the filter.
     * @param {WalletMemberFindUniqueArgs} args - Arguments to find a WalletMember
     * @example
     * // Get one WalletMember
     * const walletMember = await prisma.walletMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WalletMemberFindUniqueArgs>(args: SelectSubset<T, WalletMemberFindUniqueArgs<ExtArgs>>): Prisma__WalletMemberClient<$Result.GetResult<Prisma.$WalletMemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WalletMember that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WalletMemberFindUniqueOrThrowArgs} args - Arguments to find a WalletMember
     * @example
     * // Get one WalletMember
     * const walletMember = await prisma.walletMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WalletMemberFindUniqueOrThrowArgs>(args: SelectSubset<T, WalletMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WalletMemberClient<$Result.GetResult<Prisma.$WalletMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WalletMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletMemberFindFirstArgs} args - Arguments to find a WalletMember
     * @example
     * // Get one WalletMember
     * const walletMember = await prisma.walletMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WalletMemberFindFirstArgs>(args?: SelectSubset<T, WalletMemberFindFirstArgs<ExtArgs>>): Prisma__WalletMemberClient<$Result.GetResult<Prisma.$WalletMemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WalletMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletMemberFindFirstOrThrowArgs} args - Arguments to find a WalletMember
     * @example
     * // Get one WalletMember
     * const walletMember = await prisma.walletMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WalletMemberFindFirstOrThrowArgs>(args?: SelectSubset<T, WalletMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__WalletMemberClient<$Result.GetResult<Prisma.$WalletMemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WalletMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WalletMembers
     * const walletMembers = await prisma.walletMember.findMany()
     * 
     * // Get first 10 WalletMembers
     * const walletMembers = await prisma.walletMember.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const walletMemberWithIdOnly = await prisma.walletMember.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WalletMemberFindManyArgs>(args?: SelectSubset<T, WalletMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WalletMember.
     * @param {WalletMemberCreateArgs} args - Arguments to create a WalletMember.
     * @example
     * // Create one WalletMember
     * const WalletMember = await prisma.walletMember.create({
     *   data: {
     *     // ... data to create a WalletMember
     *   }
     * })
     * 
     */
    create<T extends WalletMemberCreateArgs>(args: SelectSubset<T, WalletMemberCreateArgs<ExtArgs>>): Prisma__WalletMemberClient<$Result.GetResult<Prisma.$WalletMemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WalletMembers.
     * @param {WalletMemberCreateManyArgs} args - Arguments to create many WalletMembers.
     * @example
     * // Create many WalletMembers
     * const walletMember = await prisma.walletMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WalletMemberCreateManyArgs>(args?: SelectSubset<T, WalletMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a WalletMember.
     * @param {WalletMemberDeleteArgs} args - Arguments to delete one WalletMember.
     * @example
     * // Delete one WalletMember
     * const WalletMember = await prisma.walletMember.delete({
     *   where: {
     *     // ... filter to delete one WalletMember
     *   }
     * })
     * 
     */
    delete<T extends WalletMemberDeleteArgs>(args: SelectSubset<T, WalletMemberDeleteArgs<ExtArgs>>): Prisma__WalletMemberClient<$Result.GetResult<Prisma.$WalletMemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WalletMember.
     * @param {WalletMemberUpdateArgs} args - Arguments to update one WalletMember.
     * @example
     * // Update one WalletMember
     * const walletMember = await prisma.walletMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WalletMemberUpdateArgs>(args: SelectSubset<T, WalletMemberUpdateArgs<ExtArgs>>): Prisma__WalletMemberClient<$Result.GetResult<Prisma.$WalletMemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WalletMembers.
     * @param {WalletMemberDeleteManyArgs} args - Arguments to filter WalletMembers to delete.
     * @example
     * // Delete a few WalletMembers
     * const { count } = await prisma.walletMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WalletMemberDeleteManyArgs>(args?: SelectSubset<T, WalletMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WalletMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WalletMembers
     * const walletMember = await prisma.walletMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WalletMemberUpdateManyArgs>(args: SelectSubset<T, WalletMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one WalletMember.
     * @param {WalletMemberUpsertArgs} args - Arguments to update or create a WalletMember.
     * @example
     * // Update or create a WalletMember
     * const walletMember = await prisma.walletMember.upsert({
     *   create: {
     *     // ... data to create a WalletMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WalletMember we want to update
     *   }
     * })
     */
    upsert<T extends WalletMemberUpsertArgs>(args: SelectSubset<T, WalletMemberUpsertArgs<ExtArgs>>): Prisma__WalletMemberClient<$Result.GetResult<Prisma.$WalletMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WalletMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletMemberCountArgs} args - Arguments to filter WalletMembers to count.
     * @example
     * // Count the number of WalletMembers
     * const count = await prisma.walletMember.count({
     *   where: {
     *     // ... the filter for the WalletMembers we want to count
     *   }
     * })
    **/
    count<T extends WalletMemberCountArgs>(
      args?: Subset<T, WalletMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WalletMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WalletMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WalletMemberAggregateArgs>(args: Subset<T, WalletMemberAggregateArgs>): Prisma.PrismaPromise<GetWalletMemberAggregateType<T>>

    /**
     * Group by WalletMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletMemberGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WalletMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WalletMemberGroupByArgs['orderBy'] }
        : { orderBy?: WalletMemberGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WalletMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWalletMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WalletMember model
   */
  readonly fields: WalletMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WalletMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WalletMemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wallet<T extends WalletDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WalletDefaultArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WalletMember model
   */
  interface WalletMemberFieldRefs {
    readonly id: FieldRef<"WalletMember", 'Int'>
    readonly walletId: FieldRef<"WalletMember", 'Int'>
    readonly userId: FieldRef<"WalletMember", 'Int'>
    readonly creditLimit: FieldRef<"WalletMember", 'Decimal'>
    readonly creditAvailable: FieldRef<"WalletMember", 'Decimal'>
    readonly creditUsed: FieldRef<"WalletMember", 'Decimal'>
    readonly isActive: FieldRef<"WalletMember", 'Boolean'>
    readonly joinedAt: FieldRef<"WalletMember", 'DateTime'>
    readonly leftAt: FieldRef<"WalletMember", 'DateTime'>
    readonly updatedAt: FieldRef<"WalletMember", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WalletMember findUnique
   */
  export type WalletMemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletMember
     */
    select?: WalletMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletMember
     */
    omit?: WalletMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletMemberInclude<ExtArgs> | null
    /**
     * Filter, which WalletMember to fetch.
     */
    where: WalletMemberWhereUniqueInput
  }

  /**
   * WalletMember findUniqueOrThrow
   */
  export type WalletMemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletMember
     */
    select?: WalletMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletMember
     */
    omit?: WalletMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletMemberInclude<ExtArgs> | null
    /**
     * Filter, which WalletMember to fetch.
     */
    where: WalletMemberWhereUniqueInput
  }

  /**
   * WalletMember findFirst
   */
  export type WalletMemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletMember
     */
    select?: WalletMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletMember
     */
    omit?: WalletMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletMemberInclude<ExtArgs> | null
    /**
     * Filter, which WalletMember to fetch.
     */
    where?: WalletMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WalletMembers to fetch.
     */
    orderBy?: WalletMemberOrderByWithRelationInput | WalletMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WalletMembers.
     */
    cursor?: WalletMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WalletMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WalletMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WalletMembers.
     */
    distinct?: WalletMemberScalarFieldEnum | WalletMemberScalarFieldEnum[]
  }

  /**
   * WalletMember findFirstOrThrow
   */
  export type WalletMemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletMember
     */
    select?: WalletMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletMember
     */
    omit?: WalletMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletMemberInclude<ExtArgs> | null
    /**
     * Filter, which WalletMember to fetch.
     */
    where?: WalletMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WalletMembers to fetch.
     */
    orderBy?: WalletMemberOrderByWithRelationInput | WalletMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WalletMembers.
     */
    cursor?: WalletMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WalletMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WalletMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WalletMembers.
     */
    distinct?: WalletMemberScalarFieldEnum | WalletMemberScalarFieldEnum[]
  }

  /**
   * WalletMember findMany
   */
  export type WalletMemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletMember
     */
    select?: WalletMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletMember
     */
    omit?: WalletMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletMemberInclude<ExtArgs> | null
    /**
     * Filter, which WalletMembers to fetch.
     */
    where?: WalletMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WalletMembers to fetch.
     */
    orderBy?: WalletMemberOrderByWithRelationInput | WalletMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WalletMembers.
     */
    cursor?: WalletMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WalletMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WalletMembers.
     */
    skip?: number
    distinct?: WalletMemberScalarFieldEnum | WalletMemberScalarFieldEnum[]
  }

  /**
   * WalletMember create
   */
  export type WalletMemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletMember
     */
    select?: WalletMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletMember
     */
    omit?: WalletMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a WalletMember.
     */
    data: XOR<WalletMemberCreateInput, WalletMemberUncheckedCreateInput>
  }

  /**
   * WalletMember createMany
   */
  export type WalletMemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WalletMembers.
     */
    data: WalletMemberCreateManyInput | WalletMemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WalletMember update
   */
  export type WalletMemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletMember
     */
    select?: WalletMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletMember
     */
    omit?: WalletMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a WalletMember.
     */
    data: XOR<WalletMemberUpdateInput, WalletMemberUncheckedUpdateInput>
    /**
     * Choose, which WalletMember to update.
     */
    where: WalletMemberWhereUniqueInput
  }

  /**
   * WalletMember updateMany
   */
  export type WalletMemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WalletMembers.
     */
    data: XOR<WalletMemberUpdateManyMutationInput, WalletMemberUncheckedUpdateManyInput>
    /**
     * Filter which WalletMembers to update
     */
    where?: WalletMemberWhereInput
    /**
     * Limit how many WalletMembers to update.
     */
    limit?: number
  }

  /**
   * WalletMember upsert
   */
  export type WalletMemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletMember
     */
    select?: WalletMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletMember
     */
    omit?: WalletMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the WalletMember to update in case it exists.
     */
    where: WalletMemberWhereUniqueInput
    /**
     * In case the WalletMember found by the `where` argument doesn't exist, create a new WalletMember with this data.
     */
    create: XOR<WalletMemberCreateInput, WalletMemberUncheckedCreateInput>
    /**
     * In case the WalletMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WalletMemberUpdateInput, WalletMemberUncheckedUpdateInput>
  }

  /**
   * WalletMember delete
   */
  export type WalletMemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletMember
     */
    select?: WalletMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletMember
     */
    omit?: WalletMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletMemberInclude<ExtArgs> | null
    /**
     * Filter which WalletMember to delete.
     */
    where: WalletMemberWhereUniqueInput
  }

  /**
   * WalletMember deleteMany
   */
  export type WalletMemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WalletMembers to delete
     */
    where?: WalletMemberWhereInput
    /**
     * Limit how many WalletMembers to delete.
     */
    limit?: number
  }

  /**
   * WalletMember without action
   */
  export type WalletMemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WalletMember
     */
    select?: WalletMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WalletMember
     */
    omit?: WalletMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletMemberInclude<ExtArgs> | null
  }


  /**
   * Model ApiKey
   */

  export type AggregateApiKey = {
    _count: ApiKeyCountAggregateOutputType | null
    _avg: ApiKeyAvgAggregateOutputType | null
    _sum: ApiKeySumAggregateOutputType | null
    _min: ApiKeyMinAggregateOutputType | null
    _max: ApiKeyMaxAggregateOutputType | null
  }

  export type ApiKeyAvgAggregateOutputType = {
    id: number | null
    walletId: number | null
    creatorId: number | null
  }

  export type ApiKeySumAggregateOutputType = {
    id: number | null
    walletId: number | null
    creatorId: number | null
  }

  export type ApiKeyMinAggregateOutputType = {
    id: number | null
    walletId: number | null
    creatorId: number | null
    hashKey: string | null
    preview: string | null
    displayName: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    lastUsedAt: Date | null
  }

  export type ApiKeyMaxAggregateOutputType = {
    id: number | null
    walletId: number | null
    creatorId: number | null
    hashKey: string | null
    preview: string | null
    displayName: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    lastUsedAt: Date | null
  }

  export type ApiKeyCountAggregateOutputType = {
    id: number
    walletId: number
    creatorId: number
    hashKey: number
    preview: number
    displayName: number
    isActive: number
    createdAt: number
    updatedAt: number
    lastUsedAt: number
    _all: number
  }


  export type ApiKeyAvgAggregateInputType = {
    id?: true
    walletId?: true
    creatorId?: true
  }

  export type ApiKeySumAggregateInputType = {
    id?: true
    walletId?: true
    creatorId?: true
  }

  export type ApiKeyMinAggregateInputType = {
    id?: true
    walletId?: true
    creatorId?: true
    hashKey?: true
    preview?: true
    displayName?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    lastUsedAt?: true
  }

  export type ApiKeyMaxAggregateInputType = {
    id?: true
    walletId?: true
    creatorId?: true
    hashKey?: true
    preview?: true
    displayName?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    lastUsedAt?: true
  }

  export type ApiKeyCountAggregateInputType = {
    id?: true
    walletId?: true
    creatorId?: true
    hashKey?: true
    preview?: true
    displayName?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    lastUsedAt?: true
    _all?: true
  }

  export type ApiKeyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiKey to aggregate.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ApiKeys
    **/
    _count?: true | ApiKeyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ApiKeyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ApiKeySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApiKeyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApiKeyMaxAggregateInputType
  }

  export type GetApiKeyAggregateType<T extends ApiKeyAggregateArgs> = {
        [P in keyof T & keyof AggregateApiKey]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApiKey[P]>
      : GetScalarType<T[P], AggregateApiKey[P]>
  }




  export type ApiKeyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiKeyWhereInput
    orderBy?: ApiKeyOrderByWithAggregationInput | ApiKeyOrderByWithAggregationInput[]
    by: ApiKeyScalarFieldEnum[] | ApiKeyScalarFieldEnum
    having?: ApiKeyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApiKeyCountAggregateInputType | true
    _avg?: ApiKeyAvgAggregateInputType
    _sum?: ApiKeySumAggregateInputType
    _min?: ApiKeyMinAggregateInputType
    _max?: ApiKeyMaxAggregateInputType
  }

  export type ApiKeyGroupByOutputType = {
    id: number
    walletId: number
    creatorId: number
    hashKey: string
    preview: string
    displayName: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    lastUsedAt: Date | null
    _count: ApiKeyCountAggregateOutputType | null
    _avg: ApiKeyAvgAggregateOutputType | null
    _sum: ApiKeySumAggregateOutputType | null
    _min: ApiKeyMinAggregateOutputType | null
    _max: ApiKeyMaxAggregateOutputType | null
  }

  type GetApiKeyGroupByPayload<T extends ApiKeyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApiKeyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApiKeyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApiKeyGroupByOutputType[P]>
            : GetScalarType<T[P], ApiKeyGroupByOutputType[P]>
        }
      >
    >


  export type ApiKeySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletId?: boolean
    creatorId?: boolean
    hashKey?: boolean
    preview?: boolean
    displayName?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastUsedAt?: boolean
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["apiKey"]>



  export type ApiKeySelectScalar = {
    id?: boolean
    walletId?: boolean
    creatorId?: boolean
    hashKey?: boolean
    preview?: boolean
    displayName?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastUsedAt?: boolean
  }

  export type ApiKeyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "walletId" | "creatorId" | "hashKey" | "preview" | "displayName" | "isActive" | "createdAt" | "updatedAt" | "lastUsedAt", ExtArgs["result"]["apiKey"]>
  export type ApiKeyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | WalletDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ApiKeyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ApiKey"
    objects: {
      wallet: Prisma.$WalletPayload<ExtArgs>
      creator: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      walletId: number
      creatorId: number
      hashKey: string
      preview: string
      displayName: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
      lastUsedAt: Date | null
    }, ExtArgs["result"]["apiKey"]>
    composites: {}
  }

  type ApiKeyGetPayload<S extends boolean | null | undefined | ApiKeyDefaultArgs> = $Result.GetResult<Prisma.$ApiKeyPayload, S>

  type ApiKeyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ApiKeyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApiKeyCountAggregateInputType | true
    }

  export interface ApiKeyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ApiKey'], meta: { name: 'ApiKey' } }
    /**
     * Find zero or one ApiKey that matches the filter.
     * @param {ApiKeyFindUniqueArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApiKeyFindUniqueArgs>(args: SelectSubset<T, ApiKeyFindUniqueArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ApiKey that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApiKeyFindUniqueOrThrowArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApiKeyFindUniqueOrThrowArgs>(args: SelectSubset<T, ApiKeyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiKey that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindFirstArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApiKeyFindFirstArgs>(args?: SelectSubset<T, ApiKeyFindFirstArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiKey that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindFirstOrThrowArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApiKeyFindFirstOrThrowArgs>(args?: SelectSubset<T, ApiKeyFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ApiKeys that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ApiKeys
     * const apiKeys = await prisma.apiKey.findMany()
     * 
     * // Get first 10 ApiKeys
     * const apiKeys = await prisma.apiKey.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const apiKeyWithIdOnly = await prisma.apiKey.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ApiKeyFindManyArgs>(args?: SelectSubset<T, ApiKeyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ApiKey.
     * @param {ApiKeyCreateArgs} args - Arguments to create a ApiKey.
     * @example
     * // Create one ApiKey
     * const ApiKey = await prisma.apiKey.create({
     *   data: {
     *     // ... data to create a ApiKey
     *   }
     * })
     * 
     */
    create<T extends ApiKeyCreateArgs>(args: SelectSubset<T, ApiKeyCreateArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ApiKeys.
     * @param {ApiKeyCreateManyArgs} args - Arguments to create many ApiKeys.
     * @example
     * // Create many ApiKeys
     * const apiKey = await prisma.apiKey.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApiKeyCreateManyArgs>(args?: SelectSubset<T, ApiKeyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ApiKey.
     * @param {ApiKeyDeleteArgs} args - Arguments to delete one ApiKey.
     * @example
     * // Delete one ApiKey
     * const ApiKey = await prisma.apiKey.delete({
     *   where: {
     *     // ... filter to delete one ApiKey
     *   }
     * })
     * 
     */
    delete<T extends ApiKeyDeleteArgs>(args: SelectSubset<T, ApiKeyDeleteArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ApiKey.
     * @param {ApiKeyUpdateArgs} args - Arguments to update one ApiKey.
     * @example
     * // Update one ApiKey
     * const apiKey = await prisma.apiKey.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApiKeyUpdateArgs>(args: SelectSubset<T, ApiKeyUpdateArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ApiKeys.
     * @param {ApiKeyDeleteManyArgs} args - Arguments to filter ApiKeys to delete.
     * @example
     * // Delete a few ApiKeys
     * const { count } = await prisma.apiKey.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApiKeyDeleteManyArgs>(args?: SelectSubset<T, ApiKeyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ApiKeys
     * const apiKey = await prisma.apiKey.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApiKeyUpdateManyArgs>(args: SelectSubset<T, ApiKeyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ApiKey.
     * @param {ApiKeyUpsertArgs} args - Arguments to update or create a ApiKey.
     * @example
     * // Update or create a ApiKey
     * const apiKey = await prisma.apiKey.upsert({
     *   create: {
     *     // ... data to create a ApiKey
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ApiKey we want to update
     *   }
     * })
     */
    upsert<T extends ApiKeyUpsertArgs>(args: SelectSubset<T, ApiKeyUpsertArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ApiKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyCountArgs} args - Arguments to filter ApiKeys to count.
     * @example
     * // Count the number of ApiKeys
     * const count = await prisma.apiKey.count({
     *   where: {
     *     // ... the filter for the ApiKeys we want to count
     *   }
     * })
    **/
    count<T extends ApiKeyCountArgs>(
      args?: Subset<T, ApiKeyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApiKeyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ApiKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApiKeyAggregateArgs>(args: Subset<T, ApiKeyAggregateArgs>): Prisma.PrismaPromise<GetApiKeyAggregateType<T>>

    /**
     * Group by ApiKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ApiKeyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApiKeyGroupByArgs['orderBy'] }
        : { orderBy?: ApiKeyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ApiKeyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApiKeyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ApiKey model
   */
  readonly fields: ApiKeyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ApiKey.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApiKeyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wallet<T extends WalletDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WalletDefaultArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    creator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ApiKey model
   */
  interface ApiKeyFieldRefs {
    readonly id: FieldRef<"ApiKey", 'Int'>
    readonly walletId: FieldRef<"ApiKey", 'Int'>
    readonly creatorId: FieldRef<"ApiKey", 'Int'>
    readonly hashKey: FieldRef<"ApiKey", 'String'>
    readonly preview: FieldRef<"ApiKey", 'String'>
    readonly displayName: FieldRef<"ApiKey", 'String'>
    readonly isActive: FieldRef<"ApiKey", 'Boolean'>
    readonly createdAt: FieldRef<"ApiKey", 'DateTime'>
    readonly updatedAt: FieldRef<"ApiKey", 'DateTime'>
    readonly lastUsedAt: FieldRef<"ApiKey", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ApiKey findUnique
   */
  export type ApiKeyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey findUniqueOrThrow
   */
  export type ApiKeyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey findFirst
   */
  export type ApiKeyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiKeys.
     */
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey findFirstOrThrow
   */
  export type ApiKeyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiKeys.
     */
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey findMany
   */
  export type ApiKeyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKeys to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey create
   */
  export type ApiKeyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * The data needed to create a ApiKey.
     */
    data: XOR<ApiKeyCreateInput, ApiKeyUncheckedCreateInput>
  }

  /**
   * ApiKey createMany
   */
  export type ApiKeyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ApiKeys.
     */
    data: ApiKeyCreateManyInput | ApiKeyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ApiKey update
   */
  export type ApiKeyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * The data needed to update a ApiKey.
     */
    data: XOR<ApiKeyUpdateInput, ApiKeyUncheckedUpdateInput>
    /**
     * Choose, which ApiKey to update.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey updateMany
   */
  export type ApiKeyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ApiKeys.
     */
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyInput>
    /**
     * Filter which ApiKeys to update
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to update.
     */
    limit?: number
  }

  /**
   * ApiKey upsert
   */
  export type ApiKeyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * The filter to search for the ApiKey to update in case it exists.
     */
    where: ApiKeyWhereUniqueInput
    /**
     * In case the ApiKey found by the `where` argument doesn't exist, create a new ApiKey with this data.
     */
    create: XOR<ApiKeyCreateInput, ApiKeyUncheckedCreateInput>
    /**
     * In case the ApiKey was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApiKeyUpdateInput, ApiKeyUncheckedUpdateInput>
  }

  /**
   * ApiKey delete
   */
  export type ApiKeyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter which ApiKey to delete.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey deleteMany
   */
  export type ApiKeyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiKeys to delete
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to delete.
     */
    limit?: number
  }

  /**
   * ApiKey without action
   */
  export type ApiKeyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
  }


  /**
   * Model Passkey
   */

  export type AggregatePasskey = {
    _count: PasskeyCountAggregateOutputType | null
    _avg: PasskeyAvgAggregateOutputType | null
    _sum: PasskeySumAggregateOutputType | null
    _min: PasskeyMinAggregateOutputType | null
    _max: PasskeyMaxAggregateOutputType | null
  }

  export type PasskeyAvgAggregateOutputType = {
    counter: number | null
    userId: number | null
  }

  export type PasskeySumAggregateOutputType = {
    counter: bigint | null
    userId: number | null
  }

  export type PasskeyMinAggregateOutputType = {
    id: string | null
    publicKey: Uint8Array | null
    webAuthnUserID: string | null
    counter: bigint | null
    displayName: string | null
    transports: string | null
    deviceType: string | null
    backedUp: boolean | null
    isDeleted: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    lastUsedAt: Date | null
    userId: number | null
  }

  export type PasskeyMaxAggregateOutputType = {
    id: string | null
    publicKey: Uint8Array | null
    webAuthnUserID: string | null
    counter: bigint | null
    displayName: string | null
    transports: string | null
    deviceType: string | null
    backedUp: boolean | null
    isDeleted: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    lastUsedAt: Date | null
    userId: number | null
  }

  export type PasskeyCountAggregateOutputType = {
    id: number
    publicKey: number
    webAuthnUserID: number
    counter: number
    displayName: number
    transports: number
    deviceType: number
    backedUp: number
    isDeleted: number
    createdAt: number
    updatedAt: number
    lastUsedAt: number
    userId: number
    _all: number
  }


  export type PasskeyAvgAggregateInputType = {
    counter?: true
    userId?: true
  }

  export type PasskeySumAggregateInputType = {
    counter?: true
    userId?: true
  }

  export type PasskeyMinAggregateInputType = {
    id?: true
    publicKey?: true
    webAuthnUserID?: true
    counter?: true
    displayName?: true
    transports?: true
    deviceType?: true
    backedUp?: true
    isDeleted?: true
    createdAt?: true
    updatedAt?: true
    lastUsedAt?: true
    userId?: true
  }

  export type PasskeyMaxAggregateInputType = {
    id?: true
    publicKey?: true
    webAuthnUserID?: true
    counter?: true
    displayName?: true
    transports?: true
    deviceType?: true
    backedUp?: true
    isDeleted?: true
    createdAt?: true
    updatedAt?: true
    lastUsedAt?: true
    userId?: true
  }

  export type PasskeyCountAggregateInputType = {
    id?: true
    publicKey?: true
    webAuthnUserID?: true
    counter?: true
    displayName?: true
    transports?: true
    deviceType?: true
    backedUp?: true
    isDeleted?: true
    createdAt?: true
    updatedAt?: true
    lastUsedAt?: true
    userId?: true
    _all?: true
  }

  export type PasskeyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Passkey to aggregate.
     */
    where?: PasskeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Passkeys to fetch.
     */
    orderBy?: PasskeyOrderByWithRelationInput | PasskeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PasskeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Passkeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Passkeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Passkeys
    **/
    _count?: true | PasskeyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PasskeyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PasskeySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PasskeyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PasskeyMaxAggregateInputType
  }

  export type GetPasskeyAggregateType<T extends PasskeyAggregateArgs> = {
        [P in keyof T & keyof AggregatePasskey]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePasskey[P]>
      : GetScalarType<T[P], AggregatePasskey[P]>
  }




  export type PasskeyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasskeyWhereInput
    orderBy?: PasskeyOrderByWithAggregationInput | PasskeyOrderByWithAggregationInput[]
    by: PasskeyScalarFieldEnum[] | PasskeyScalarFieldEnum
    having?: PasskeyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PasskeyCountAggregateInputType | true
    _avg?: PasskeyAvgAggregateInputType
    _sum?: PasskeySumAggregateInputType
    _min?: PasskeyMinAggregateInputType
    _max?: PasskeyMaxAggregateInputType
  }

  export type PasskeyGroupByOutputType = {
    id: string
    publicKey: Uint8Array
    webAuthnUserID: string
    counter: bigint
    displayName: string
    transports: string | null
    deviceType: string
    backedUp: boolean
    isDeleted: boolean
    createdAt: Date
    updatedAt: Date
    lastUsedAt: Date | null
    userId: number
    _count: PasskeyCountAggregateOutputType | null
    _avg: PasskeyAvgAggregateOutputType | null
    _sum: PasskeySumAggregateOutputType | null
    _min: PasskeyMinAggregateOutputType | null
    _max: PasskeyMaxAggregateOutputType | null
  }

  type GetPasskeyGroupByPayload<T extends PasskeyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PasskeyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PasskeyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PasskeyGroupByOutputType[P]>
            : GetScalarType<T[P], PasskeyGroupByOutputType[P]>
        }
      >
    >


  export type PasskeySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    publicKey?: boolean
    webAuthnUserID?: boolean
    counter?: boolean
    displayName?: boolean
    transports?: boolean
    deviceType?: boolean
    backedUp?: boolean
    isDeleted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastUsedAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passkey"]>



  export type PasskeySelectScalar = {
    id?: boolean
    publicKey?: boolean
    webAuthnUserID?: boolean
    counter?: boolean
    displayName?: boolean
    transports?: boolean
    deviceType?: boolean
    backedUp?: boolean
    isDeleted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastUsedAt?: boolean
    userId?: boolean
  }

  export type PasskeyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "publicKey" | "webAuthnUserID" | "counter" | "displayName" | "transports" | "deviceType" | "backedUp" | "isDeleted" | "createdAt" | "updatedAt" | "lastUsedAt" | "userId", ExtArgs["result"]["passkey"]>
  export type PasskeyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PasskeyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Passkey"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      publicKey: Uint8Array
      webAuthnUserID: string
      counter: bigint
      displayName: string
      transports: string | null
      deviceType: string
      backedUp: boolean
      isDeleted: boolean
      createdAt: Date
      updatedAt: Date
      lastUsedAt: Date | null
      userId: number
    }, ExtArgs["result"]["passkey"]>
    composites: {}
  }

  type PasskeyGetPayload<S extends boolean | null | undefined | PasskeyDefaultArgs> = $Result.GetResult<Prisma.$PasskeyPayload, S>

  type PasskeyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PasskeyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PasskeyCountAggregateInputType | true
    }

  export interface PasskeyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Passkey'], meta: { name: 'Passkey' } }
    /**
     * Find zero or one Passkey that matches the filter.
     * @param {PasskeyFindUniqueArgs} args - Arguments to find a Passkey
     * @example
     * // Get one Passkey
     * const passkey = await prisma.passkey.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PasskeyFindUniqueArgs>(args: SelectSubset<T, PasskeyFindUniqueArgs<ExtArgs>>): Prisma__PasskeyClient<$Result.GetResult<Prisma.$PasskeyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Passkey that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PasskeyFindUniqueOrThrowArgs} args - Arguments to find a Passkey
     * @example
     * // Get one Passkey
     * const passkey = await prisma.passkey.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PasskeyFindUniqueOrThrowArgs>(args: SelectSubset<T, PasskeyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PasskeyClient<$Result.GetResult<Prisma.$PasskeyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Passkey that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyFindFirstArgs} args - Arguments to find a Passkey
     * @example
     * // Get one Passkey
     * const passkey = await prisma.passkey.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PasskeyFindFirstArgs>(args?: SelectSubset<T, PasskeyFindFirstArgs<ExtArgs>>): Prisma__PasskeyClient<$Result.GetResult<Prisma.$PasskeyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Passkey that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyFindFirstOrThrowArgs} args - Arguments to find a Passkey
     * @example
     * // Get one Passkey
     * const passkey = await prisma.passkey.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PasskeyFindFirstOrThrowArgs>(args?: SelectSubset<T, PasskeyFindFirstOrThrowArgs<ExtArgs>>): Prisma__PasskeyClient<$Result.GetResult<Prisma.$PasskeyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Passkeys that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Passkeys
     * const passkeys = await prisma.passkey.findMany()
     * 
     * // Get first 10 Passkeys
     * const passkeys = await prisma.passkey.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const passkeyWithIdOnly = await prisma.passkey.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PasskeyFindManyArgs>(args?: SelectSubset<T, PasskeyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasskeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Passkey.
     * @param {PasskeyCreateArgs} args - Arguments to create a Passkey.
     * @example
     * // Create one Passkey
     * const Passkey = await prisma.passkey.create({
     *   data: {
     *     // ... data to create a Passkey
     *   }
     * })
     * 
     */
    create<T extends PasskeyCreateArgs>(args: SelectSubset<T, PasskeyCreateArgs<ExtArgs>>): Prisma__PasskeyClient<$Result.GetResult<Prisma.$PasskeyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Passkeys.
     * @param {PasskeyCreateManyArgs} args - Arguments to create many Passkeys.
     * @example
     * // Create many Passkeys
     * const passkey = await prisma.passkey.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PasskeyCreateManyArgs>(args?: SelectSubset<T, PasskeyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Passkey.
     * @param {PasskeyDeleteArgs} args - Arguments to delete one Passkey.
     * @example
     * // Delete one Passkey
     * const Passkey = await prisma.passkey.delete({
     *   where: {
     *     // ... filter to delete one Passkey
     *   }
     * })
     * 
     */
    delete<T extends PasskeyDeleteArgs>(args: SelectSubset<T, PasskeyDeleteArgs<ExtArgs>>): Prisma__PasskeyClient<$Result.GetResult<Prisma.$PasskeyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Passkey.
     * @param {PasskeyUpdateArgs} args - Arguments to update one Passkey.
     * @example
     * // Update one Passkey
     * const passkey = await prisma.passkey.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PasskeyUpdateArgs>(args: SelectSubset<T, PasskeyUpdateArgs<ExtArgs>>): Prisma__PasskeyClient<$Result.GetResult<Prisma.$PasskeyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Passkeys.
     * @param {PasskeyDeleteManyArgs} args - Arguments to filter Passkeys to delete.
     * @example
     * // Delete a few Passkeys
     * const { count } = await prisma.passkey.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PasskeyDeleteManyArgs>(args?: SelectSubset<T, PasskeyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Passkeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Passkeys
     * const passkey = await prisma.passkey.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PasskeyUpdateManyArgs>(args: SelectSubset<T, PasskeyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Passkey.
     * @param {PasskeyUpsertArgs} args - Arguments to update or create a Passkey.
     * @example
     * // Update or create a Passkey
     * const passkey = await prisma.passkey.upsert({
     *   create: {
     *     // ... data to create a Passkey
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Passkey we want to update
     *   }
     * })
     */
    upsert<T extends PasskeyUpsertArgs>(args: SelectSubset<T, PasskeyUpsertArgs<ExtArgs>>): Prisma__PasskeyClient<$Result.GetResult<Prisma.$PasskeyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Passkeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyCountArgs} args - Arguments to filter Passkeys to count.
     * @example
     * // Count the number of Passkeys
     * const count = await prisma.passkey.count({
     *   where: {
     *     // ... the filter for the Passkeys we want to count
     *   }
     * })
    **/
    count<T extends PasskeyCountArgs>(
      args?: Subset<T, PasskeyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PasskeyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Passkey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PasskeyAggregateArgs>(args: Subset<T, PasskeyAggregateArgs>): Prisma.PrismaPromise<GetPasskeyAggregateType<T>>

    /**
     * Group by Passkey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PasskeyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PasskeyGroupByArgs['orderBy'] }
        : { orderBy?: PasskeyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PasskeyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasskeyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Passkey model
   */
  readonly fields: PasskeyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Passkey.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PasskeyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Passkey model
   */
  interface PasskeyFieldRefs {
    readonly id: FieldRef<"Passkey", 'String'>
    readonly publicKey: FieldRef<"Passkey", 'Bytes'>
    readonly webAuthnUserID: FieldRef<"Passkey", 'String'>
    readonly counter: FieldRef<"Passkey", 'BigInt'>
    readonly displayName: FieldRef<"Passkey", 'String'>
    readonly transports: FieldRef<"Passkey", 'String'>
    readonly deviceType: FieldRef<"Passkey", 'String'>
    readonly backedUp: FieldRef<"Passkey", 'Boolean'>
    readonly isDeleted: FieldRef<"Passkey", 'Boolean'>
    readonly createdAt: FieldRef<"Passkey", 'DateTime'>
    readonly updatedAt: FieldRef<"Passkey", 'DateTime'>
    readonly lastUsedAt: FieldRef<"Passkey", 'DateTime'>
    readonly userId: FieldRef<"Passkey", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Passkey findUnique
   */
  export type PasskeyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passkey
     */
    select?: PasskeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passkey
     */
    omit?: PasskeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyInclude<ExtArgs> | null
    /**
     * Filter, which Passkey to fetch.
     */
    where: PasskeyWhereUniqueInput
  }

  /**
   * Passkey findUniqueOrThrow
   */
  export type PasskeyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passkey
     */
    select?: PasskeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passkey
     */
    omit?: PasskeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyInclude<ExtArgs> | null
    /**
     * Filter, which Passkey to fetch.
     */
    where: PasskeyWhereUniqueInput
  }

  /**
   * Passkey findFirst
   */
  export type PasskeyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passkey
     */
    select?: PasskeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passkey
     */
    omit?: PasskeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyInclude<ExtArgs> | null
    /**
     * Filter, which Passkey to fetch.
     */
    where?: PasskeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Passkeys to fetch.
     */
    orderBy?: PasskeyOrderByWithRelationInput | PasskeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Passkeys.
     */
    cursor?: PasskeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Passkeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Passkeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Passkeys.
     */
    distinct?: PasskeyScalarFieldEnum | PasskeyScalarFieldEnum[]
  }

  /**
   * Passkey findFirstOrThrow
   */
  export type PasskeyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passkey
     */
    select?: PasskeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passkey
     */
    omit?: PasskeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyInclude<ExtArgs> | null
    /**
     * Filter, which Passkey to fetch.
     */
    where?: PasskeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Passkeys to fetch.
     */
    orderBy?: PasskeyOrderByWithRelationInput | PasskeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Passkeys.
     */
    cursor?: PasskeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Passkeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Passkeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Passkeys.
     */
    distinct?: PasskeyScalarFieldEnum | PasskeyScalarFieldEnum[]
  }

  /**
   * Passkey findMany
   */
  export type PasskeyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passkey
     */
    select?: PasskeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passkey
     */
    omit?: PasskeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyInclude<ExtArgs> | null
    /**
     * Filter, which Passkeys to fetch.
     */
    where?: PasskeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Passkeys to fetch.
     */
    orderBy?: PasskeyOrderByWithRelationInput | PasskeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Passkeys.
     */
    cursor?: PasskeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Passkeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Passkeys.
     */
    skip?: number
    distinct?: PasskeyScalarFieldEnum | PasskeyScalarFieldEnum[]
  }

  /**
   * Passkey create
   */
  export type PasskeyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passkey
     */
    select?: PasskeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passkey
     */
    omit?: PasskeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyInclude<ExtArgs> | null
    /**
     * The data needed to create a Passkey.
     */
    data: XOR<PasskeyCreateInput, PasskeyUncheckedCreateInput>
  }

  /**
   * Passkey createMany
   */
  export type PasskeyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Passkeys.
     */
    data: PasskeyCreateManyInput | PasskeyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Passkey update
   */
  export type PasskeyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passkey
     */
    select?: PasskeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passkey
     */
    omit?: PasskeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyInclude<ExtArgs> | null
    /**
     * The data needed to update a Passkey.
     */
    data: XOR<PasskeyUpdateInput, PasskeyUncheckedUpdateInput>
    /**
     * Choose, which Passkey to update.
     */
    where: PasskeyWhereUniqueInput
  }

  /**
   * Passkey updateMany
   */
  export type PasskeyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Passkeys.
     */
    data: XOR<PasskeyUpdateManyMutationInput, PasskeyUncheckedUpdateManyInput>
    /**
     * Filter which Passkeys to update
     */
    where?: PasskeyWhereInput
    /**
     * Limit how many Passkeys to update.
     */
    limit?: number
  }

  /**
   * Passkey upsert
   */
  export type PasskeyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passkey
     */
    select?: PasskeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passkey
     */
    omit?: PasskeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyInclude<ExtArgs> | null
    /**
     * The filter to search for the Passkey to update in case it exists.
     */
    where: PasskeyWhereUniqueInput
    /**
     * In case the Passkey found by the `where` argument doesn't exist, create a new Passkey with this data.
     */
    create: XOR<PasskeyCreateInput, PasskeyUncheckedCreateInput>
    /**
     * In case the Passkey was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PasskeyUpdateInput, PasskeyUncheckedUpdateInput>
  }

  /**
   * Passkey delete
   */
  export type PasskeyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passkey
     */
    select?: PasskeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passkey
     */
    omit?: PasskeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyInclude<ExtArgs> | null
    /**
     * Filter which Passkey to delete.
     */
    where: PasskeyWhereUniqueInput
  }

  /**
   * Passkey deleteMany
   */
  export type PasskeyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Passkeys to delete
     */
    where?: PasskeyWhereInput
    /**
     * Limit how many Passkeys to delete.
     */
    limit?: number
  }

  /**
   * Passkey without action
   */
  export type PasskeyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passkey
     */
    select?: PasskeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passkey
     */
    omit?: PasskeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyInclude<ExtArgs> | null
  }


  /**
   * Model RedemptionCode
   */

  export type AggregateRedemptionCode = {
    _count: RedemptionCodeCountAggregateOutputType | null
    _avg: RedemptionCodeAvgAggregateOutputType | null
    _sum: RedemptionCodeSumAggregateOutputType | null
    _min: RedemptionCodeMinAggregateOutputType | null
    _max: RedemptionCodeMaxAggregateOutputType | null
  }

  export type RedemptionCodeAvgAggregateOutputType = {
    id: number | null
    amount: number | null
    redeemerId: number | null
  }

  export type RedemptionCodeSumAggregateOutputType = {
    id: number | null
    amount: number | null
    redeemerId: number | null
  }

  export type RedemptionCodeMinAggregateOutputType = {
    id: number | null
    code: string | null
    amount: number | null
    remark: string | null
    createdAt: Date | null
    expiredAt: Date | null
    redeemedAt: Date | null
    redeemerId: number | null
  }

  export type RedemptionCodeMaxAggregateOutputType = {
    id: number | null
    code: string | null
    amount: number | null
    remark: string | null
    createdAt: Date | null
    expiredAt: Date | null
    redeemedAt: Date | null
    redeemerId: number | null
  }

  export type RedemptionCodeCountAggregateOutputType = {
    id: number
    code: number
    amount: number
    remark: number
    createdAt: number
    expiredAt: number
    redeemedAt: number
    redeemerId: number
    _all: number
  }


  export type RedemptionCodeAvgAggregateInputType = {
    id?: true
    amount?: true
    redeemerId?: true
  }

  export type RedemptionCodeSumAggregateInputType = {
    id?: true
    amount?: true
    redeemerId?: true
  }

  export type RedemptionCodeMinAggregateInputType = {
    id?: true
    code?: true
    amount?: true
    remark?: true
    createdAt?: true
    expiredAt?: true
    redeemedAt?: true
    redeemerId?: true
  }

  export type RedemptionCodeMaxAggregateInputType = {
    id?: true
    code?: true
    amount?: true
    remark?: true
    createdAt?: true
    expiredAt?: true
    redeemedAt?: true
    redeemerId?: true
  }

  export type RedemptionCodeCountAggregateInputType = {
    id?: true
    code?: true
    amount?: true
    remark?: true
    createdAt?: true
    expiredAt?: true
    redeemedAt?: true
    redeemerId?: true
    _all?: true
  }

  export type RedemptionCodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RedemptionCode to aggregate.
     */
    where?: RedemptionCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RedemptionCodes to fetch.
     */
    orderBy?: RedemptionCodeOrderByWithRelationInput | RedemptionCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RedemptionCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RedemptionCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RedemptionCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RedemptionCodes
    **/
    _count?: true | RedemptionCodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RedemptionCodeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RedemptionCodeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RedemptionCodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RedemptionCodeMaxAggregateInputType
  }

  export type GetRedemptionCodeAggregateType<T extends RedemptionCodeAggregateArgs> = {
        [P in keyof T & keyof AggregateRedemptionCode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRedemptionCode[P]>
      : GetScalarType<T[P], AggregateRedemptionCode[P]>
  }




  export type RedemptionCodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RedemptionCodeWhereInput
    orderBy?: RedemptionCodeOrderByWithAggregationInput | RedemptionCodeOrderByWithAggregationInput[]
    by: RedemptionCodeScalarFieldEnum[] | RedemptionCodeScalarFieldEnum
    having?: RedemptionCodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RedemptionCodeCountAggregateInputType | true
    _avg?: RedemptionCodeAvgAggregateInputType
    _sum?: RedemptionCodeSumAggregateInputType
    _min?: RedemptionCodeMinAggregateInputType
    _max?: RedemptionCodeMaxAggregateInputType
  }

  export type RedemptionCodeGroupByOutputType = {
    id: number
    code: string
    amount: number
    remark: string
    createdAt: Date
    expiredAt: Date
    redeemedAt: Date | null
    redeemerId: number | null
    _count: RedemptionCodeCountAggregateOutputType | null
    _avg: RedemptionCodeAvgAggregateOutputType | null
    _sum: RedemptionCodeSumAggregateOutputType | null
    _min: RedemptionCodeMinAggregateOutputType | null
    _max: RedemptionCodeMaxAggregateOutputType | null
  }

  type GetRedemptionCodeGroupByPayload<T extends RedemptionCodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RedemptionCodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RedemptionCodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RedemptionCodeGroupByOutputType[P]>
            : GetScalarType<T[P], RedemptionCodeGroupByOutputType[P]>
        }
      >
    >


  export type RedemptionCodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    amount?: boolean
    remark?: boolean
    createdAt?: boolean
    expiredAt?: boolean
    redeemedAt?: boolean
    redeemerId?: boolean
    redeemer?: boolean | RedemptionCode$redeemerArgs<ExtArgs>
  }, ExtArgs["result"]["redemptionCode"]>



  export type RedemptionCodeSelectScalar = {
    id?: boolean
    code?: boolean
    amount?: boolean
    remark?: boolean
    createdAt?: boolean
    expiredAt?: boolean
    redeemedAt?: boolean
    redeemerId?: boolean
  }

  export type RedemptionCodeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "amount" | "remark" | "createdAt" | "expiredAt" | "redeemedAt" | "redeemerId", ExtArgs["result"]["redemptionCode"]>
  export type RedemptionCodeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    redeemer?: boolean | RedemptionCode$redeemerArgs<ExtArgs>
  }

  export type $RedemptionCodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RedemptionCode"
    objects: {
      redeemer: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      code: string
      amount: number
      remark: string
      createdAt: Date
      expiredAt: Date
      redeemedAt: Date | null
      redeemerId: number | null
    }, ExtArgs["result"]["redemptionCode"]>
    composites: {}
  }

  type RedemptionCodeGetPayload<S extends boolean | null | undefined | RedemptionCodeDefaultArgs> = $Result.GetResult<Prisma.$RedemptionCodePayload, S>

  type RedemptionCodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RedemptionCodeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RedemptionCodeCountAggregateInputType | true
    }

  export interface RedemptionCodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RedemptionCode'], meta: { name: 'RedemptionCode' } }
    /**
     * Find zero or one RedemptionCode that matches the filter.
     * @param {RedemptionCodeFindUniqueArgs} args - Arguments to find a RedemptionCode
     * @example
     * // Get one RedemptionCode
     * const redemptionCode = await prisma.redemptionCode.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RedemptionCodeFindUniqueArgs>(args: SelectSubset<T, RedemptionCodeFindUniqueArgs<ExtArgs>>): Prisma__RedemptionCodeClient<$Result.GetResult<Prisma.$RedemptionCodePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RedemptionCode that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RedemptionCodeFindUniqueOrThrowArgs} args - Arguments to find a RedemptionCode
     * @example
     * // Get one RedemptionCode
     * const redemptionCode = await prisma.redemptionCode.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RedemptionCodeFindUniqueOrThrowArgs>(args: SelectSubset<T, RedemptionCodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RedemptionCodeClient<$Result.GetResult<Prisma.$RedemptionCodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RedemptionCode that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RedemptionCodeFindFirstArgs} args - Arguments to find a RedemptionCode
     * @example
     * // Get one RedemptionCode
     * const redemptionCode = await prisma.redemptionCode.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RedemptionCodeFindFirstArgs>(args?: SelectSubset<T, RedemptionCodeFindFirstArgs<ExtArgs>>): Prisma__RedemptionCodeClient<$Result.GetResult<Prisma.$RedemptionCodePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RedemptionCode that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RedemptionCodeFindFirstOrThrowArgs} args - Arguments to find a RedemptionCode
     * @example
     * // Get one RedemptionCode
     * const redemptionCode = await prisma.redemptionCode.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RedemptionCodeFindFirstOrThrowArgs>(args?: SelectSubset<T, RedemptionCodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__RedemptionCodeClient<$Result.GetResult<Prisma.$RedemptionCodePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RedemptionCodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RedemptionCodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RedemptionCodes
     * const redemptionCodes = await prisma.redemptionCode.findMany()
     * 
     * // Get first 10 RedemptionCodes
     * const redemptionCodes = await prisma.redemptionCode.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const redemptionCodeWithIdOnly = await prisma.redemptionCode.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RedemptionCodeFindManyArgs>(args?: SelectSubset<T, RedemptionCodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RedemptionCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RedemptionCode.
     * @param {RedemptionCodeCreateArgs} args - Arguments to create a RedemptionCode.
     * @example
     * // Create one RedemptionCode
     * const RedemptionCode = await prisma.redemptionCode.create({
     *   data: {
     *     // ... data to create a RedemptionCode
     *   }
     * })
     * 
     */
    create<T extends RedemptionCodeCreateArgs>(args: SelectSubset<T, RedemptionCodeCreateArgs<ExtArgs>>): Prisma__RedemptionCodeClient<$Result.GetResult<Prisma.$RedemptionCodePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RedemptionCodes.
     * @param {RedemptionCodeCreateManyArgs} args - Arguments to create many RedemptionCodes.
     * @example
     * // Create many RedemptionCodes
     * const redemptionCode = await prisma.redemptionCode.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RedemptionCodeCreateManyArgs>(args?: SelectSubset<T, RedemptionCodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a RedemptionCode.
     * @param {RedemptionCodeDeleteArgs} args - Arguments to delete one RedemptionCode.
     * @example
     * // Delete one RedemptionCode
     * const RedemptionCode = await prisma.redemptionCode.delete({
     *   where: {
     *     // ... filter to delete one RedemptionCode
     *   }
     * })
     * 
     */
    delete<T extends RedemptionCodeDeleteArgs>(args: SelectSubset<T, RedemptionCodeDeleteArgs<ExtArgs>>): Prisma__RedemptionCodeClient<$Result.GetResult<Prisma.$RedemptionCodePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RedemptionCode.
     * @param {RedemptionCodeUpdateArgs} args - Arguments to update one RedemptionCode.
     * @example
     * // Update one RedemptionCode
     * const redemptionCode = await prisma.redemptionCode.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RedemptionCodeUpdateArgs>(args: SelectSubset<T, RedemptionCodeUpdateArgs<ExtArgs>>): Prisma__RedemptionCodeClient<$Result.GetResult<Prisma.$RedemptionCodePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RedemptionCodes.
     * @param {RedemptionCodeDeleteManyArgs} args - Arguments to filter RedemptionCodes to delete.
     * @example
     * // Delete a few RedemptionCodes
     * const { count } = await prisma.redemptionCode.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RedemptionCodeDeleteManyArgs>(args?: SelectSubset<T, RedemptionCodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RedemptionCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RedemptionCodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RedemptionCodes
     * const redemptionCode = await prisma.redemptionCode.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RedemptionCodeUpdateManyArgs>(args: SelectSubset<T, RedemptionCodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RedemptionCode.
     * @param {RedemptionCodeUpsertArgs} args - Arguments to update or create a RedemptionCode.
     * @example
     * // Update or create a RedemptionCode
     * const redemptionCode = await prisma.redemptionCode.upsert({
     *   create: {
     *     // ... data to create a RedemptionCode
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RedemptionCode we want to update
     *   }
     * })
     */
    upsert<T extends RedemptionCodeUpsertArgs>(args: SelectSubset<T, RedemptionCodeUpsertArgs<ExtArgs>>): Prisma__RedemptionCodeClient<$Result.GetResult<Prisma.$RedemptionCodePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RedemptionCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RedemptionCodeCountArgs} args - Arguments to filter RedemptionCodes to count.
     * @example
     * // Count the number of RedemptionCodes
     * const count = await prisma.redemptionCode.count({
     *   where: {
     *     // ... the filter for the RedemptionCodes we want to count
     *   }
     * })
    **/
    count<T extends RedemptionCodeCountArgs>(
      args?: Subset<T, RedemptionCodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RedemptionCodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RedemptionCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RedemptionCodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RedemptionCodeAggregateArgs>(args: Subset<T, RedemptionCodeAggregateArgs>): Prisma.PrismaPromise<GetRedemptionCodeAggregateType<T>>

    /**
     * Group by RedemptionCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RedemptionCodeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RedemptionCodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RedemptionCodeGroupByArgs['orderBy'] }
        : { orderBy?: RedemptionCodeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RedemptionCodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRedemptionCodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RedemptionCode model
   */
  readonly fields: RedemptionCodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RedemptionCode.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RedemptionCodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    redeemer<T extends RedemptionCode$redeemerArgs<ExtArgs> = {}>(args?: Subset<T, RedemptionCode$redeemerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RedemptionCode model
   */
  interface RedemptionCodeFieldRefs {
    readonly id: FieldRef<"RedemptionCode", 'Int'>
    readonly code: FieldRef<"RedemptionCode", 'String'>
    readonly amount: FieldRef<"RedemptionCode", 'Int'>
    readonly remark: FieldRef<"RedemptionCode", 'String'>
    readonly createdAt: FieldRef<"RedemptionCode", 'DateTime'>
    readonly expiredAt: FieldRef<"RedemptionCode", 'DateTime'>
    readonly redeemedAt: FieldRef<"RedemptionCode", 'DateTime'>
    readonly redeemerId: FieldRef<"RedemptionCode", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * RedemptionCode findUnique
   */
  export type RedemptionCodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RedemptionCode
     */
    select?: RedemptionCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RedemptionCode
     */
    omit?: RedemptionCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionCodeInclude<ExtArgs> | null
    /**
     * Filter, which RedemptionCode to fetch.
     */
    where: RedemptionCodeWhereUniqueInput
  }

  /**
   * RedemptionCode findUniqueOrThrow
   */
  export type RedemptionCodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RedemptionCode
     */
    select?: RedemptionCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RedemptionCode
     */
    omit?: RedemptionCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionCodeInclude<ExtArgs> | null
    /**
     * Filter, which RedemptionCode to fetch.
     */
    where: RedemptionCodeWhereUniqueInput
  }

  /**
   * RedemptionCode findFirst
   */
  export type RedemptionCodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RedemptionCode
     */
    select?: RedemptionCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RedemptionCode
     */
    omit?: RedemptionCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionCodeInclude<ExtArgs> | null
    /**
     * Filter, which RedemptionCode to fetch.
     */
    where?: RedemptionCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RedemptionCodes to fetch.
     */
    orderBy?: RedemptionCodeOrderByWithRelationInput | RedemptionCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RedemptionCodes.
     */
    cursor?: RedemptionCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RedemptionCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RedemptionCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RedemptionCodes.
     */
    distinct?: RedemptionCodeScalarFieldEnum | RedemptionCodeScalarFieldEnum[]
  }

  /**
   * RedemptionCode findFirstOrThrow
   */
  export type RedemptionCodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RedemptionCode
     */
    select?: RedemptionCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RedemptionCode
     */
    omit?: RedemptionCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionCodeInclude<ExtArgs> | null
    /**
     * Filter, which RedemptionCode to fetch.
     */
    where?: RedemptionCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RedemptionCodes to fetch.
     */
    orderBy?: RedemptionCodeOrderByWithRelationInput | RedemptionCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RedemptionCodes.
     */
    cursor?: RedemptionCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RedemptionCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RedemptionCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RedemptionCodes.
     */
    distinct?: RedemptionCodeScalarFieldEnum | RedemptionCodeScalarFieldEnum[]
  }

  /**
   * RedemptionCode findMany
   */
  export type RedemptionCodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RedemptionCode
     */
    select?: RedemptionCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RedemptionCode
     */
    omit?: RedemptionCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionCodeInclude<ExtArgs> | null
    /**
     * Filter, which RedemptionCodes to fetch.
     */
    where?: RedemptionCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RedemptionCodes to fetch.
     */
    orderBy?: RedemptionCodeOrderByWithRelationInput | RedemptionCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RedemptionCodes.
     */
    cursor?: RedemptionCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RedemptionCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RedemptionCodes.
     */
    skip?: number
    distinct?: RedemptionCodeScalarFieldEnum | RedemptionCodeScalarFieldEnum[]
  }

  /**
   * RedemptionCode create
   */
  export type RedemptionCodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RedemptionCode
     */
    select?: RedemptionCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RedemptionCode
     */
    omit?: RedemptionCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionCodeInclude<ExtArgs> | null
    /**
     * The data needed to create a RedemptionCode.
     */
    data: XOR<RedemptionCodeCreateInput, RedemptionCodeUncheckedCreateInput>
  }

  /**
   * RedemptionCode createMany
   */
  export type RedemptionCodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RedemptionCodes.
     */
    data: RedemptionCodeCreateManyInput | RedemptionCodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RedemptionCode update
   */
  export type RedemptionCodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RedemptionCode
     */
    select?: RedemptionCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RedemptionCode
     */
    omit?: RedemptionCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionCodeInclude<ExtArgs> | null
    /**
     * The data needed to update a RedemptionCode.
     */
    data: XOR<RedemptionCodeUpdateInput, RedemptionCodeUncheckedUpdateInput>
    /**
     * Choose, which RedemptionCode to update.
     */
    where: RedemptionCodeWhereUniqueInput
  }

  /**
   * RedemptionCode updateMany
   */
  export type RedemptionCodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RedemptionCodes.
     */
    data: XOR<RedemptionCodeUpdateManyMutationInput, RedemptionCodeUncheckedUpdateManyInput>
    /**
     * Filter which RedemptionCodes to update
     */
    where?: RedemptionCodeWhereInput
    /**
     * Limit how many RedemptionCodes to update.
     */
    limit?: number
  }

  /**
   * RedemptionCode upsert
   */
  export type RedemptionCodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RedemptionCode
     */
    select?: RedemptionCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RedemptionCode
     */
    omit?: RedemptionCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionCodeInclude<ExtArgs> | null
    /**
     * The filter to search for the RedemptionCode to update in case it exists.
     */
    where: RedemptionCodeWhereUniqueInput
    /**
     * In case the RedemptionCode found by the `where` argument doesn't exist, create a new RedemptionCode with this data.
     */
    create: XOR<RedemptionCodeCreateInput, RedemptionCodeUncheckedCreateInput>
    /**
     * In case the RedemptionCode was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RedemptionCodeUpdateInput, RedemptionCodeUncheckedUpdateInput>
  }

  /**
   * RedemptionCode delete
   */
  export type RedemptionCodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RedemptionCode
     */
    select?: RedemptionCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RedemptionCode
     */
    omit?: RedemptionCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionCodeInclude<ExtArgs> | null
    /**
     * Filter which RedemptionCode to delete.
     */
    where: RedemptionCodeWhereUniqueInput
  }

  /**
   * RedemptionCode deleteMany
   */
  export type RedemptionCodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RedemptionCodes to delete
     */
    where?: RedemptionCodeWhereInput
    /**
     * Limit how many RedemptionCodes to delete.
     */
    limit?: number
  }

  /**
   * RedemptionCode.redeemer
   */
  export type RedemptionCode$redeemerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * RedemptionCode without action
   */
  export type RedemptionCodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RedemptionCode
     */
    select?: RedemptionCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RedemptionCode
     */
    omit?: RedemptionCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RedemptionCodeInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    uid: 'uid',
    displayName: 'displayName',
    avatar: 'avatar',
    email: 'email',
    phone: 'phone',
    gitHubId: 'gitHubId',
    googleId: 'googleId',
    isActive: 'isActive',
    isDeleted: 'isDeleted',
    isAdmin: 'isAdmin',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lastLoginAt: 'lastLoginAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const WalletScalarFieldEnum: {
    id: 'id',
    uid: 'uid',
    balance: 'balance',
    version: 'version',
    ownerId: 'ownerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WalletScalarFieldEnum = (typeof WalletScalarFieldEnum)[keyof typeof WalletScalarFieldEnum]


  export const WalletMemberScalarFieldEnum: {
    id: 'id',
    walletId: 'walletId',
    userId: 'userId',
    creditLimit: 'creditLimit',
    creditAvailable: 'creditAvailable',
    creditUsed: 'creditUsed',
    isActive: 'isActive',
    joinedAt: 'joinedAt',
    leftAt: 'leftAt',
    updatedAt: 'updatedAt'
  };

  export type WalletMemberScalarFieldEnum = (typeof WalletMemberScalarFieldEnum)[keyof typeof WalletMemberScalarFieldEnum]


  export const ApiKeyScalarFieldEnum: {
    id: 'id',
    walletId: 'walletId',
    creatorId: 'creatorId',
    hashKey: 'hashKey',
    preview: 'preview',
    displayName: 'displayName',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lastUsedAt: 'lastUsedAt'
  };

  export type ApiKeyScalarFieldEnum = (typeof ApiKeyScalarFieldEnum)[keyof typeof ApiKeyScalarFieldEnum]


  export const PasskeyScalarFieldEnum: {
    id: 'id',
    publicKey: 'publicKey',
    webAuthnUserID: 'webAuthnUserID',
    counter: 'counter',
    displayName: 'displayName',
    transports: 'transports',
    deviceType: 'deviceType',
    backedUp: 'backedUp',
    isDeleted: 'isDeleted',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lastUsedAt: 'lastUsedAt',
    userId: 'userId'
  };

  export type PasskeyScalarFieldEnum = (typeof PasskeyScalarFieldEnum)[keyof typeof PasskeyScalarFieldEnum]


  export const RedemptionCodeScalarFieldEnum: {
    id: 'id',
    code: 'code',
    amount: 'amount',
    remark: 'remark',
    createdAt: 'createdAt',
    expiredAt: 'expiredAt',
    redeemedAt: 'redeemedAt',
    redeemerId: 'redeemerId'
  };

  export type RedemptionCodeScalarFieldEnum = (typeof RedemptionCodeScalarFieldEnum)[keyof typeof RedemptionCodeScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const UserOrderByRelevanceFieldEnum: {
    uid: 'uid',
    displayName: 'displayName',
    avatar: 'avatar',
    email: 'email',
    phone: 'phone',
    gitHubId: 'gitHubId',
    googleId: 'googleId'
  };

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


  export const WalletOrderByRelevanceFieldEnum: {
    uid: 'uid'
  };

  export type WalletOrderByRelevanceFieldEnum = (typeof WalletOrderByRelevanceFieldEnum)[keyof typeof WalletOrderByRelevanceFieldEnum]


  export const ApiKeyOrderByRelevanceFieldEnum: {
    hashKey: 'hashKey',
    preview: 'preview',
    displayName: 'displayName'
  };

  export type ApiKeyOrderByRelevanceFieldEnum = (typeof ApiKeyOrderByRelevanceFieldEnum)[keyof typeof ApiKeyOrderByRelevanceFieldEnum]


  export const PasskeyOrderByRelevanceFieldEnum: {
    id: 'id',
    webAuthnUserID: 'webAuthnUserID',
    displayName: 'displayName',
    transports: 'transports',
    deviceType: 'deviceType'
  };

  export type PasskeyOrderByRelevanceFieldEnum = (typeof PasskeyOrderByRelevanceFieldEnum)[keyof typeof PasskeyOrderByRelevanceFieldEnum]


  export const RedemptionCodeOrderByRelevanceFieldEnum: {
    code: 'code',
    remark: 'remark'
  };

  export type RedemptionCodeOrderByRelevanceFieldEnum = (typeof RedemptionCodeOrderByRelevanceFieldEnum)[keyof typeof RedemptionCodeOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Bytes'
   */
  export type BytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    uid?: StringFilter<"User"> | string
    displayName?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    gitHubId?: StringNullableFilter<"User"> | string | null
    googleId?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    isDeleted?: BoolFilter<"User"> | boolean
    isAdmin?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    wallet?: XOR<WalletNullableScalarRelationFilter, WalletWhereInput> | null
    walletMembers?: WalletMemberListRelationFilter
    passkeys?: PasskeyListRelationFilter
    redeemCodes?: RedemptionCodeListRelationFilter
    createdApiKeys?: ApiKeyListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    uid?: SortOrder
    displayName?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    gitHubId?: SortOrderInput | SortOrder
    googleId?: SortOrderInput | SortOrder
    isActive?: SortOrder
    isDeleted?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    wallet?: WalletOrderByWithRelationInput
    walletMembers?: WalletMemberOrderByRelationAggregateInput
    passkeys?: PasskeyOrderByRelationAggregateInput
    redeemCodes?: RedemptionCodeOrderByRelationAggregateInput
    createdApiKeys?: ApiKeyOrderByRelationAggregateInput
    _relevance?: UserOrderByRelevanceInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uid?: string
    email?: string
    phone?: string
    gitHubId?: string
    googleId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    displayName?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    isDeleted?: BoolFilter<"User"> | boolean
    isAdmin?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    wallet?: XOR<WalletNullableScalarRelationFilter, WalletWhereInput> | null
    walletMembers?: WalletMemberListRelationFilter
    passkeys?: PasskeyListRelationFilter
    redeemCodes?: RedemptionCodeListRelationFilter
    createdApiKeys?: ApiKeyListRelationFilter
  }, "id" | "uid" | "email" | "phone" | "gitHubId" | "googleId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    uid?: SortOrder
    displayName?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    gitHubId?: SortOrderInput | SortOrder
    googleId?: SortOrderInput | SortOrder
    isActive?: SortOrder
    isDeleted?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    uid?: StringWithAggregatesFilter<"User"> | string
    displayName?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    gitHubId?: StringNullableWithAggregatesFilter<"User"> | string | null
    googleId?: StringNullableWithAggregatesFilter<"User"> | string | null
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    isDeleted?: BoolWithAggregatesFilter<"User"> | boolean
    isAdmin?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type WalletWhereInput = {
    AND?: WalletWhereInput | WalletWhereInput[]
    OR?: WalletWhereInput[]
    NOT?: WalletWhereInput | WalletWhereInput[]
    id?: IntFilter<"Wallet"> | number
    uid?: StringFilter<"Wallet"> | string
    balance?: DecimalFilter<"Wallet"> | Decimal | DecimalJsLike | number | string
    version?: IntFilter<"Wallet"> | number
    ownerId?: IntFilter<"Wallet"> | number
    createdAt?: DateTimeFilter<"Wallet"> | Date | string
    updatedAt?: DateTimeFilter<"Wallet"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    members?: WalletMemberListRelationFilter
    apiKeys?: ApiKeyListRelationFilter
  }

  export type WalletOrderByWithRelationInput = {
    id?: SortOrder
    uid?: SortOrder
    balance?: SortOrder
    version?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    owner?: UserOrderByWithRelationInput
    members?: WalletMemberOrderByRelationAggregateInput
    apiKeys?: ApiKeyOrderByRelationAggregateInput
    _relevance?: WalletOrderByRelevanceInput
  }

  export type WalletWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uid?: string
    ownerId?: number
    AND?: WalletWhereInput | WalletWhereInput[]
    OR?: WalletWhereInput[]
    NOT?: WalletWhereInput | WalletWhereInput[]
    balance?: DecimalFilter<"Wallet"> | Decimal | DecimalJsLike | number | string
    version?: IntFilter<"Wallet"> | number
    createdAt?: DateTimeFilter<"Wallet"> | Date | string
    updatedAt?: DateTimeFilter<"Wallet"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    members?: WalletMemberListRelationFilter
    apiKeys?: ApiKeyListRelationFilter
  }, "id" | "uid" | "ownerId">

  export type WalletOrderByWithAggregationInput = {
    id?: SortOrder
    uid?: SortOrder
    balance?: SortOrder
    version?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WalletCountOrderByAggregateInput
    _avg?: WalletAvgOrderByAggregateInput
    _max?: WalletMaxOrderByAggregateInput
    _min?: WalletMinOrderByAggregateInput
    _sum?: WalletSumOrderByAggregateInput
  }

  export type WalletScalarWhereWithAggregatesInput = {
    AND?: WalletScalarWhereWithAggregatesInput | WalletScalarWhereWithAggregatesInput[]
    OR?: WalletScalarWhereWithAggregatesInput[]
    NOT?: WalletScalarWhereWithAggregatesInput | WalletScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Wallet"> | number
    uid?: StringWithAggregatesFilter<"Wallet"> | string
    balance?: DecimalWithAggregatesFilter<"Wallet"> | Decimal | DecimalJsLike | number | string
    version?: IntWithAggregatesFilter<"Wallet"> | number
    ownerId?: IntWithAggregatesFilter<"Wallet"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Wallet"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Wallet"> | Date | string
  }

  export type WalletMemberWhereInput = {
    AND?: WalletMemberWhereInput | WalletMemberWhereInput[]
    OR?: WalletMemberWhereInput[]
    NOT?: WalletMemberWhereInput | WalletMemberWhereInput[]
    id?: IntFilter<"WalletMember"> | number
    walletId?: IntFilter<"WalletMember"> | number
    userId?: IntFilter<"WalletMember"> | number
    creditLimit?: DecimalFilter<"WalletMember"> | Decimal | DecimalJsLike | number | string
    creditAvailable?: DecimalFilter<"WalletMember"> | Decimal | DecimalJsLike | number | string
    creditUsed?: DecimalFilter<"WalletMember"> | Decimal | DecimalJsLike | number | string
    isActive?: BoolFilter<"WalletMember"> | boolean
    joinedAt?: DateTimeFilter<"WalletMember"> | Date | string
    leftAt?: DateTimeNullableFilter<"WalletMember"> | Date | string | null
    updatedAt?: DateTimeFilter<"WalletMember"> | Date | string
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type WalletMemberOrderByWithRelationInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    creditLimit?: SortOrder
    creditAvailable?: SortOrder
    creditUsed?: SortOrder
    isActive?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    wallet?: WalletOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type WalletMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    walletId_userId?: WalletMemberWalletIdUserIdCompoundUniqueInput
    AND?: WalletMemberWhereInput | WalletMemberWhereInput[]
    OR?: WalletMemberWhereInput[]
    NOT?: WalletMemberWhereInput | WalletMemberWhereInput[]
    walletId?: IntFilter<"WalletMember"> | number
    userId?: IntFilter<"WalletMember"> | number
    creditLimit?: DecimalFilter<"WalletMember"> | Decimal | DecimalJsLike | number | string
    creditAvailable?: DecimalFilter<"WalletMember"> | Decimal | DecimalJsLike | number | string
    creditUsed?: DecimalFilter<"WalletMember"> | Decimal | DecimalJsLike | number | string
    isActive?: BoolFilter<"WalletMember"> | boolean
    joinedAt?: DateTimeFilter<"WalletMember"> | Date | string
    leftAt?: DateTimeNullableFilter<"WalletMember"> | Date | string | null
    updatedAt?: DateTimeFilter<"WalletMember"> | Date | string
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "walletId_userId">

  export type WalletMemberOrderByWithAggregationInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    creditLimit?: SortOrder
    creditAvailable?: SortOrder
    creditUsed?: SortOrder
    isActive?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: WalletMemberCountOrderByAggregateInput
    _avg?: WalletMemberAvgOrderByAggregateInput
    _max?: WalletMemberMaxOrderByAggregateInput
    _min?: WalletMemberMinOrderByAggregateInput
    _sum?: WalletMemberSumOrderByAggregateInput
  }

  export type WalletMemberScalarWhereWithAggregatesInput = {
    AND?: WalletMemberScalarWhereWithAggregatesInput | WalletMemberScalarWhereWithAggregatesInput[]
    OR?: WalletMemberScalarWhereWithAggregatesInput[]
    NOT?: WalletMemberScalarWhereWithAggregatesInput | WalletMemberScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"WalletMember"> | number
    walletId?: IntWithAggregatesFilter<"WalletMember"> | number
    userId?: IntWithAggregatesFilter<"WalletMember"> | number
    creditLimit?: DecimalWithAggregatesFilter<"WalletMember"> | Decimal | DecimalJsLike | number | string
    creditAvailable?: DecimalWithAggregatesFilter<"WalletMember"> | Decimal | DecimalJsLike | number | string
    creditUsed?: DecimalWithAggregatesFilter<"WalletMember"> | Decimal | DecimalJsLike | number | string
    isActive?: BoolWithAggregatesFilter<"WalletMember"> | boolean
    joinedAt?: DateTimeWithAggregatesFilter<"WalletMember"> | Date | string
    leftAt?: DateTimeNullableWithAggregatesFilter<"WalletMember"> | Date | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"WalletMember"> | Date | string
  }

  export type ApiKeyWhereInput = {
    AND?: ApiKeyWhereInput | ApiKeyWhereInput[]
    OR?: ApiKeyWhereInput[]
    NOT?: ApiKeyWhereInput | ApiKeyWhereInput[]
    id?: IntFilter<"ApiKey"> | number
    walletId?: IntFilter<"ApiKey"> | number
    creatorId?: IntFilter<"ApiKey"> | number
    hashKey?: StringFilter<"ApiKey"> | string
    preview?: StringFilter<"ApiKey"> | string
    displayName?: StringFilter<"ApiKey"> | string
    isActive?: BoolFilter<"ApiKey"> | boolean
    createdAt?: DateTimeFilter<"ApiKey"> | Date | string
    updatedAt?: DateTimeFilter<"ApiKey"> | Date | string
    lastUsedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
    creator?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ApiKeyOrderByWithRelationInput = {
    id?: SortOrder
    walletId?: SortOrder
    creatorId?: SortOrder
    hashKey?: SortOrder
    preview?: SortOrder
    displayName?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    wallet?: WalletOrderByWithRelationInput
    creator?: UserOrderByWithRelationInput
    _relevance?: ApiKeyOrderByRelevanceInput
  }

  export type ApiKeyWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    hashKey?: string
    AND?: ApiKeyWhereInput | ApiKeyWhereInput[]
    OR?: ApiKeyWhereInput[]
    NOT?: ApiKeyWhereInput | ApiKeyWhereInput[]
    walletId?: IntFilter<"ApiKey"> | number
    creatorId?: IntFilter<"ApiKey"> | number
    preview?: StringFilter<"ApiKey"> | string
    displayName?: StringFilter<"ApiKey"> | string
    isActive?: BoolFilter<"ApiKey"> | boolean
    createdAt?: DateTimeFilter<"ApiKey"> | Date | string
    updatedAt?: DateTimeFilter<"ApiKey"> | Date | string
    lastUsedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    wallet?: XOR<WalletScalarRelationFilter, WalletWhereInput>
    creator?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "hashKey">

  export type ApiKeyOrderByWithAggregationInput = {
    id?: SortOrder
    walletId?: SortOrder
    creatorId?: SortOrder
    hashKey?: SortOrder
    preview?: SortOrder
    displayName?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    _count?: ApiKeyCountOrderByAggregateInput
    _avg?: ApiKeyAvgOrderByAggregateInput
    _max?: ApiKeyMaxOrderByAggregateInput
    _min?: ApiKeyMinOrderByAggregateInput
    _sum?: ApiKeySumOrderByAggregateInput
  }

  export type ApiKeyScalarWhereWithAggregatesInput = {
    AND?: ApiKeyScalarWhereWithAggregatesInput | ApiKeyScalarWhereWithAggregatesInput[]
    OR?: ApiKeyScalarWhereWithAggregatesInput[]
    NOT?: ApiKeyScalarWhereWithAggregatesInput | ApiKeyScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ApiKey"> | number
    walletId?: IntWithAggregatesFilter<"ApiKey"> | number
    creatorId?: IntWithAggregatesFilter<"ApiKey"> | number
    hashKey?: StringWithAggregatesFilter<"ApiKey"> | string
    preview?: StringWithAggregatesFilter<"ApiKey"> | string
    displayName?: StringWithAggregatesFilter<"ApiKey"> | string
    isActive?: BoolWithAggregatesFilter<"ApiKey"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ApiKey"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ApiKey"> | Date | string
    lastUsedAt?: DateTimeNullableWithAggregatesFilter<"ApiKey"> | Date | string | null
  }

  export type PasskeyWhereInput = {
    AND?: PasskeyWhereInput | PasskeyWhereInput[]
    OR?: PasskeyWhereInput[]
    NOT?: PasskeyWhereInput | PasskeyWhereInput[]
    id?: StringFilter<"Passkey"> | string
    publicKey?: BytesFilter<"Passkey"> | Uint8Array
    webAuthnUserID?: StringFilter<"Passkey"> | string
    counter?: BigIntFilter<"Passkey"> | bigint | number
    displayName?: StringFilter<"Passkey"> | string
    transports?: StringNullableFilter<"Passkey"> | string | null
    deviceType?: StringFilter<"Passkey"> | string
    backedUp?: BoolFilter<"Passkey"> | boolean
    isDeleted?: BoolFilter<"Passkey"> | boolean
    createdAt?: DateTimeFilter<"Passkey"> | Date | string
    updatedAt?: DateTimeFilter<"Passkey"> | Date | string
    lastUsedAt?: DateTimeNullableFilter<"Passkey"> | Date | string | null
    userId?: IntFilter<"Passkey"> | number
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PasskeyOrderByWithRelationInput = {
    id?: SortOrder
    publicKey?: SortOrder
    webAuthnUserID?: SortOrder
    counter?: SortOrder
    displayName?: SortOrder
    transports?: SortOrderInput | SortOrder
    deviceType?: SortOrder
    backedUp?: SortOrder
    isDeleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
    _relevance?: PasskeyOrderByRelevanceInput
  }

  export type PasskeyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    webAuthnUserID_userId?: PasskeyWebAuthnUserIDUserIdCompoundUniqueInput
    AND?: PasskeyWhereInput | PasskeyWhereInput[]
    OR?: PasskeyWhereInput[]
    NOT?: PasskeyWhereInput | PasskeyWhereInput[]
    publicKey?: BytesFilter<"Passkey"> | Uint8Array
    webAuthnUserID?: StringFilter<"Passkey"> | string
    counter?: BigIntFilter<"Passkey"> | bigint | number
    displayName?: StringFilter<"Passkey"> | string
    transports?: StringNullableFilter<"Passkey"> | string | null
    deviceType?: StringFilter<"Passkey"> | string
    backedUp?: BoolFilter<"Passkey"> | boolean
    isDeleted?: BoolFilter<"Passkey"> | boolean
    createdAt?: DateTimeFilter<"Passkey"> | Date | string
    updatedAt?: DateTimeFilter<"Passkey"> | Date | string
    lastUsedAt?: DateTimeNullableFilter<"Passkey"> | Date | string | null
    userId?: IntFilter<"Passkey"> | number
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "id" | "webAuthnUserID_userId">

  export type PasskeyOrderByWithAggregationInput = {
    id?: SortOrder
    publicKey?: SortOrder
    webAuthnUserID?: SortOrder
    counter?: SortOrder
    displayName?: SortOrder
    transports?: SortOrderInput | SortOrder
    deviceType?: SortOrder
    backedUp?: SortOrder
    isDeleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    userId?: SortOrder
    _count?: PasskeyCountOrderByAggregateInput
    _avg?: PasskeyAvgOrderByAggregateInput
    _max?: PasskeyMaxOrderByAggregateInput
    _min?: PasskeyMinOrderByAggregateInput
    _sum?: PasskeySumOrderByAggregateInput
  }

  export type PasskeyScalarWhereWithAggregatesInput = {
    AND?: PasskeyScalarWhereWithAggregatesInput | PasskeyScalarWhereWithAggregatesInput[]
    OR?: PasskeyScalarWhereWithAggregatesInput[]
    NOT?: PasskeyScalarWhereWithAggregatesInput | PasskeyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Passkey"> | string
    publicKey?: BytesWithAggregatesFilter<"Passkey"> | Uint8Array
    webAuthnUserID?: StringWithAggregatesFilter<"Passkey"> | string
    counter?: BigIntWithAggregatesFilter<"Passkey"> | bigint | number
    displayName?: StringWithAggregatesFilter<"Passkey"> | string
    transports?: StringNullableWithAggregatesFilter<"Passkey"> | string | null
    deviceType?: StringWithAggregatesFilter<"Passkey"> | string
    backedUp?: BoolWithAggregatesFilter<"Passkey"> | boolean
    isDeleted?: BoolWithAggregatesFilter<"Passkey"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Passkey"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Passkey"> | Date | string
    lastUsedAt?: DateTimeNullableWithAggregatesFilter<"Passkey"> | Date | string | null
    userId?: IntWithAggregatesFilter<"Passkey"> | number
  }

  export type RedemptionCodeWhereInput = {
    AND?: RedemptionCodeWhereInput | RedemptionCodeWhereInput[]
    OR?: RedemptionCodeWhereInput[]
    NOT?: RedemptionCodeWhereInput | RedemptionCodeWhereInput[]
    id?: IntFilter<"RedemptionCode"> | number
    code?: StringFilter<"RedemptionCode"> | string
    amount?: IntFilter<"RedemptionCode"> | number
    remark?: StringFilter<"RedemptionCode"> | string
    createdAt?: DateTimeFilter<"RedemptionCode"> | Date | string
    expiredAt?: DateTimeFilter<"RedemptionCode"> | Date | string
    redeemedAt?: DateTimeNullableFilter<"RedemptionCode"> | Date | string | null
    redeemerId?: IntNullableFilter<"RedemptionCode"> | number | null
    redeemer?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type RedemptionCodeOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    amount?: SortOrder
    remark?: SortOrder
    createdAt?: SortOrder
    expiredAt?: SortOrder
    redeemedAt?: SortOrderInput | SortOrder
    redeemerId?: SortOrderInput | SortOrder
    redeemer?: UserOrderByWithRelationInput
    _relevance?: RedemptionCodeOrderByRelevanceInput
  }

  export type RedemptionCodeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    code?: string
    AND?: RedemptionCodeWhereInput | RedemptionCodeWhereInput[]
    OR?: RedemptionCodeWhereInput[]
    NOT?: RedemptionCodeWhereInput | RedemptionCodeWhereInput[]
    amount?: IntFilter<"RedemptionCode"> | number
    remark?: StringFilter<"RedemptionCode"> | string
    createdAt?: DateTimeFilter<"RedemptionCode"> | Date | string
    expiredAt?: DateTimeFilter<"RedemptionCode"> | Date | string
    redeemedAt?: DateTimeNullableFilter<"RedemptionCode"> | Date | string | null
    redeemerId?: IntNullableFilter<"RedemptionCode"> | number | null
    redeemer?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "code">

  export type RedemptionCodeOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    amount?: SortOrder
    remark?: SortOrder
    createdAt?: SortOrder
    expiredAt?: SortOrder
    redeemedAt?: SortOrderInput | SortOrder
    redeemerId?: SortOrderInput | SortOrder
    _count?: RedemptionCodeCountOrderByAggregateInput
    _avg?: RedemptionCodeAvgOrderByAggregateInput
    _max?: RedemptionCodeMaxOrderByAggregateInput
    _min?: RedemptionCodeMinOrderByAggregateInput
    _sum?: RedemptionCodeSumOrderByAggregateInput
  }

  export type RedemptionCodeScalarWhereWithAggregatesInput = {
    AND?: RedemptionCodeScalarWhereWithAggregatesInput | RedemptionCodeScalarWhereWithAggregatesInput[]
    OR?: RedemptionCodeScalarWhereWithAggregatesInput[]
    NOT?: RedemptionCodeScalarWhereWithAggregatesInput | RedemptionCodeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RedemptionCode"> | number
    code?: StringWithAggregatesFilter<"RedemptionCode"> | string
    amount?: IntWithAggregatesFilter<"RedemptionCode"> | number
    remark?: StringWithAggregatesFilter<"RedemptionCode"> | string
    createdAt?: DateTimeWithAggregatesFilter<"RedemptionCode"> | Date | string
    expiredAt?: DateTimeWithAggregatesFilter<"RedemptionCode"> | Date | string
    redeemedAt?: DateTimeNullableWithAggregatesFilter<"RedemptionCode"> | Date | string | null
    redeemerId?: IntNullableWithAggregatesFilter<"RedemptionCode"> | number | null
  }

  export type UserCreateInput = {
    uid?: string
    displayName?: string | null
    avatar?: string | null
    email?: string | null
    phone?: string | null
    gitHubId?: string | null
    googleId?: string | null
    isActive?: boolean
    isDeleted?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    wallet?: WalletCreateNestedOneWithoutOwnerInput
    walletMembers?: WalletMemberCreateNestedManyWithoutUserInput
    passkeys?: PasskeyCreateNestedManyWithoutUserInput
    redeemCodes?: RedemptionCodeCreateNestedManyWithoutRedeemerInput
    createdApiKeys?: ApiKeyCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    uid?: string
    displayName?: string | null
    avatar?: string | null
    email?: string | null
    phone?: string | null
    gitHubId?: string | null
    googleId?: string | null
    isActive?: boolean
    isDeleted?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    wallet?: WalletUncheckedCreateNestedOneWithoutOwnerInput
    walletMembers?: WalletMemberUncheckedCreateNestedManyWithoutUserInput
    passkeys?: PasskeyUncheckedCreateNestedManyWithoutUserInput
    redeemCodes?: RedemptionCodeUncheckedCreateNestedManyWithoutRedeemerInput
    createdApiKeys?: ApiKeyUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserUpdateInput = {
    uid?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gitHubId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wallet?: WalletUpdateOneWithoutOwnerNestedInput
    walletMembers?: WalletMemberUpdateManyWithoutUserNestedInput
    passkeys?: PasskeyUpdateManyWithoutUserNestedInput
    redeemCodes?: RedemptionCodeUpdateManyWithoutRedeemerNestedInput
    createdApiKeys?: ApiKeyUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uid?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gitHubId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wallet?: WalletUncheckedUpdateOneWithoutOwnerNestedInput
    walletMembers?: WalletMemberUncheckedUpdateManyWithoutUserNestedInput
    passkeys?: PasskeyUncheckedUpdateManyWithoutUserNestedInput
    redeemCodes?: RedemptionCodeUncheckedUpdateManyWithoutRedeemerNestedInput
    createdApiKeys?: ApiKeyUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    uid?: string
    displayName?: string | null
    avatar?: string | null
    email?: string | null
    phone?: string | null
    gitHubId?: string | null
    googleId?: string | null
    isActive?: boolean
    isDeleted?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    uid?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gitHubId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uid?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gitHubId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WalletCreateInput = {
    uid?: string
    balance?: Decimal | DecimalJsLike | number | string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutWalletInput
    members?: WalletMemberCreateNestedManyWithoutWalletInput
    apiKeys?: ApiKeyCreateNestedManyWithoutWalletInput
  }

  export type WalletUncheckedCreateInput = {
    id?: number
    uid?: string
    balance?: Decimal | DecimalJsLike | number | string
    version?: number
    ownerId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WalletMemberUncheckedCreateNestedManyWithoutWalletInput
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutWalletInput
  }

  export type WalletUpdateInput = {
    uid?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutWalletNestedInput
    members?: WalletMemberUpdateManyWithoutWalletNestedInput
    apiKeys?: ApiKeyUpdateManyWithoutWalletNestedInput
  }

  export type WalletUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uid?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    version?: IntFieldUpdateOperationsInput | number
    ownerId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WalletMemberUncheckedUpdateManyWithoutWalletNestedInput
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type WalletCreateManyInput = {
    id?: number
    uid?: string
    balance?: Decimal | DecimalJsLike | number | string
    version?: number
    ownerId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WalletUpdateManyMutationInput = {
    uid?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uid?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    version?: IntFieldUpdateOperationsInput | number
    ownerId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletMemberCreateInput = {
    creditLimit: Decimal | DecimalJsLike | number | string
    creditAvailable: Decimal | DecimalJsLike | number | string
    creditUsed?: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    joinedAt?: Date | string
    leftAt?: Date | string | null
    updatedAt?: Date | string
    wallet: WalletCreateNestedOneWithoutMembersInput
    user: UserCreateNestedOneWithoutWalletMembersInput
  }

  export type WalletMemberUncheckedCreateInput = {
    id?: number
    walletId: number
    userId: number
    creditLimit: Decimal | DecimalJsLike | number | string
    creditAvailable: Decimal | DecimalJsLike | number | string
    creditUsed?: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    joinedAt?: Date | string
    leftAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type WalletMemberUpdateInput = {
    creditLimit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditAvailable?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditUsed?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wallet?: WalletUpdateOneRequiredWithoutMembersNestedInput
    user?: UserUpdateOneRequiredWithoutWalletMembersNestedInput
  }

  export type WalletMemberUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    walletId?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    creditLimit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditAvailable?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditUsed?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletMemberCreateManyInput = {
    id?: number
    walletId: number
    userId: number
    creditLimit: Decimal | DecimalJsLike | number | string
    creditAvailable: Decimal | DecimalJsLike | number | string
    creditUsed?: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    joinedAt?: Date | string
    leftAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type WalletMemberUpdateManyMutationInput = {
    creditLimit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditAvailable?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditUsed?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletMemberUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    walletId?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    creditLimit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditAvailable?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditUsed?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyCreateInput = {
    hashKey: string
    preview: string
    displayName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastUsedAt?: Date | string | null
    wallet: WalletCreateNestedOneWithoutApiKeysInput
    creator: UserCreateNestedOneWithoutCreatedApiKeysInput
  }

  export type ApiKeyUncheckedCreateInput = {
    id?: number
    walletId: number
    creatorId: number
    hashKey: string
    preview: string
    displayName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastUsedAt?: Date | string | null
  }

  export type ApiKeyUpdateInput = {
    hashKey?: StringFieldUpdateOperationsInput | string
    preview?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wallet?: WalletUpdateOneRequiredWithoutApiKeysNestedInput
    creator?: UserUpdateOneRequiredWithoutCreatedApiKeysNestedInput
  }

  export type ApiKeyUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    walletId?: IntFieldUpdateOperationsInput | number
    creatorId?: IntFieldUpdateOperationsInput | number
    hashKey?: StringFieldUpdateOperationsInput | string
    preview?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ApiKeyCreateManyInput = {
    id?: number
    walletId: number
    creatorId: number
    hashKey: string
    preview: string
    displayName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastUsedAt?: Date | string | null
  }

  export type ApiKeyUpdateManyMutationInput = {
    hashKey?: StringFieldUpdateOperationsInput | string
    preview?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ApiKeyUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    walletId?: IntFieldUpdateOperationsInput | number
    creatorId?: IntFieldUpdateOperationsInput | number
    hashKey?: StringFieldUpdateOperationsInput | string
    preview?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PasskeyCreateInput = {
    id: string
    publicKey: Uint8Array
    webAuthnUserID: string
    counter?: bigint | number
    displayName?: string
    transports?: string | null
    deviceType?: string
    backedUp?: boolean
    isDeleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastUsedAt?: Date | string | null
    user: UserCreateNestedOneWithoutPasskeysInput
  }

  export type PasskeyUncheckedCreateInput = {
    id: string
    publicKey: Uint8Array
    webAuthnUserID: string
    counter?: bigint | number
    displayName?: string
    transports?: string | null
    deviceType?: string
    backedUp?: boolean
    isDeleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastUsedAt?: Date | string | null
    userId: number
  }

  export type PasskeyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicKey?: BytesFieldUpdateOperationsInput | Uint8Array
    webAuthnUserID?: StringFieldUpdateOperationsInput | string
    counter?: BigIntFieldUpdateOperationsInput | bigint | number
    displayName?: StringFieldUpdateOperationsInput | string
    transports?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: StringFieldUpdateOperationsInput | string
    backedUp?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutPasskeysNestedInput
  }

  export type PasskeyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicKey?: BytesFieldUpdateOperationsInput | Uint8Array
    webAuthnUserID?: StringFieldUpdateOperationsInput | string
    counter?: BigIntFieldUpdateOperationsInput | bigint | number
    displayName?: StringFieldUpdateOperationsInput | string
    transports?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: StringFieldUpdateOperationsInput | string
    backedUp?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type PasskeyCreateManyInput = {
    id: string
    publicKey: Uint8Array
    webAuthnUserID: string
    counter?: bigint | number
    displayName?: string
    transports?: string | null
    deviceType?: string
    backedUp?: boolean
    isDeleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastUsedAt?: Date | string | null
    userId: number
  }

  export type PasskeyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicKey?: BytesFieldUpdateOperationsInput | Uint8Array
    webAuthnUserID?: StringFieldUpdateOperationsInput | string
    counter?: BigIntFieldUpdateOperationsInput | bigint | number
    displayName?: StringFieldUpdateOperationsInput | string
    transports?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: StringFieldUpdateOperationsInput | string
    backedUp?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PasskeyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicKey?: BytesFieldUpdateOperationsInput | Uint8Array
    webAuthnUserID?: StringFieldUpdateOperationsInput | string
    counter?: BigIntFieldUpdateOperationsInput | bigint | number
    displayName?: StringFieldUpdateOperationsInput | string
    transports?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: StringFieldUpdateOperationsInput | string
    backedUp?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type RedemptionCodeCreateInput = {
    code: string
    amount: number
    remark?: string
    createdAt?: Date | string
    expiredAt?: Date | string
    redeemedAt?: Date | string | null
    redeemer?: UserCreateNestedOneWithoutRedeemCodesInput
  }

  export type RedemptionCodeUncheckedCreateInput = {
    id?: number
    code: string
    amount: number
    remark?: string
    createdAt?: Date | string
    expiredAt?: Date | string
    redeemedAt?: Date | string | null
    redeemerId?: number | null
  }

  export type RedemptionCodeUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    remark?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    redeemedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    redeemer?: UserUpdateOneWithoutRedeemCodesNestedInput
  }

  export type RedemptionCodeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    remark?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    redeemedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    redeemerId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type RedemptionCodeCreateManyInput = {
    id?: number
    code: string
    amount: number
    remark?: string
    createdAt?: Date | string
    expiredAt?: Date | string
    redeemedAt?: Date | string | null
    redeemerId?: number | null
  }

  export type RedemptionCodeUpdateManyMutationInput = {
    code?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    remark?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    redeemedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RedemptionCodeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    remark?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    redeemedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    redeemerId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type WalletNullableScalarRelationFilter = {
    is?: WalletWhereInput | null
    isNot?: WalletWhereInput | null
  }

  export type WalletMemberListRelationFilter = {
    every?: WalletMemberWhereInput
    some?: WalletMemberWhereInput
    none?: WalletMemberWhereInput
  }

  export type PasskeyListRelationFilter = {
    every?: PasskeyWhereInput
    some?: PasskeyWhereInput
    none?: PasskeyWhereInput
  }

  export type RedemptionCodeListRelationFilter = {
    every?: RedemptionCodeWhereInput
    some?: RedemptionCodeWhereInput
    none?: RedemptionCodeWhereInput
  }

  export type ApiKeyListRelationFilter = {
    every?: ApiKeyWhereInput
    some?: ApiKeyWhereInput
    none?: ApiKeyWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type WalletMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PasskeyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RedemptionCodeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ApiKeyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelevanceInput = {
    fields: UserOrderByRelevanceFieldEnum | UserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    displayName?: SortOrder
    avatar?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    gitHubId?: SortOrder
    googleId?: SortOrder
    isActive?: SortOrder
    isDeleted?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    displayName?: SortOrder
    avatar?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    gitHubId?: SortOrder
    googleId?: SortOrder
    isActive?: SortOrder
    isDeleted?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    displayName?: SortOrder
    avatar?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    gitHubId?: SortOrder
    googleId?: SortOrder
    isActive?: SortOrder
    isDeleted?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type WalletOrderByRelevanceInput = {
    fields: WalletOrderByRelevanceFieldEnum | WalletOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type WalletCountOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    balance?: SortOrder
    version?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WalletAvgOrderByAggregateInput = {
    id?: SortOrder
    balance?: SortOrder
    version?: SortOrder
    ownerId?: SortOrder
  }

  export type WalletMaxOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    balance?: SortOrder
    version?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WalletMinOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    balance?: SortOrder
    version?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WalletSumOrderByAggregateInput = {
    id?: SortOrder
    balance?: SortOrder
    version?: SortOrder
    ownerId?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type WalletScalarRelationFilter = {
    is?: WalletWhereInput
    isNot?: WalletWhereInput
  }

  export type WalletMemberWalletIdUserIdCompoundUniqueInput = {
    walletId: number
    userId: number
  }

  export type WalletMemberCountOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    creditLimit?: SortOrder
    creditAvailable?: SortOrder
    creditUsed?: SortOrder
    isActive?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WalletMemberAvgOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    creditLimit?: SortOrder
    creditAvailable?: SortOrder
    creditUsed?: SortOrder
  }

  export type WalletMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    creditLimit?: SortOrder
    creditAvailable?: SortOrder
    creditUsed?: SortOrder
    isActive?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WalletMemberMinOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    creditLimit?: SortOrder
    creditAvailable?: SortOrder
    creditUsed?: SortOrder
    isActive?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WalletMemberSumOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    creditLimit?: SortOrder
    creditAvailable?: SortOrder
    creditUsed?: SortOrder
  }

  export type ApiKeyOrderByRelevanceInput = {
    fields: ApiKeyOrderByRelevanceFieldEnum | ApiKeyOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ApiKeyCountOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    creatorId?: SortOrder
    hashKey?: SortOrder
    preview?: SortOrder
    displayName?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastUsedAt?: SortOrder
  }

  export type ApiKeyAvgOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    creatorId?: SortOrder
  }

  export type ApiKeyMaxOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    creatorId?: SortOrder
    hashKey?: SortOrder
    preview?: SortOrder
    displayName?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastUsedAt?: SortOrder
  }

  export type ApiKeyMinOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    creatorId?: SortOrder
    hashKey?: SortOrder
    preview?: SortOrder
    displayName?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastUsedAt?: SortOrder
  }

  export type ApiKeySumOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    creatorId?: SortOrder
  }

  export type BytesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[]
    notIn?: Uint8Array[]
    not?: NestedBytesFilter<$PrismaModel> | Uint8Array
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type PasskeyOrderByRelevanceInput = {
    fields: PasskeyOrderByRelevanceFieldEnum | PasskeyOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PasskeyWebAuthnUserIDUserIdCompoundUniqueInput = {
    webAuthnUserID: string
    userId: number
  }

  export type PasskeyCountOrderByAggregateInput = {
    id?: SortOrder
    publicKey?: SortOrder
    webAuthnUserID?: SortOrder
    counter?: SortOrder
    displayName?: SortOrder
    transports?: SortOrder
    deviceType?: SortOrder
    backedUp?: SortOrder
    isDeleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastUsedAt?: SortOrder
    userId?: SortOrder
  }

  export type PasskeyAvgOrderByAggregateInput = {
    counter?: SortOrder
    userId?: SortOrder
  }

  export type PasskeyMaxOrderByAggregateInput = {
    id?: SortOrder
    publicKey?: SortOrder
    webAuthnUserID?: SortOrder
    counter?: SortOrder
    displayName?: SortOrder
    transports?: SortOrder
    deviceType?: SortOrder
    backedUp?: SortOrder
    isDeleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastUsedAt?: SortOrder
    userId?: SortOrder
  }

  export type PasskeyMinOrderByAggregateInput = {
    id?: SortOrder
    publicKey?: SortOrder
    webAuthnUserID?: SortOrder
    counter?: SortOrder
    displayName?: SortOrder
    transports?: SortOrder
    deviceType?: SortOrder
    backedUp?: SortOrder
    isDeleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastUsedAt?: SortOrder
    userId?: SortOrder
  }

  export type PasskeySumOrderByAggregateInput = {
    counter?: SortOrder
    userId?: SortOrder
  }

  export type BytesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[]
    notIn?: Uint8Array[]
    not?: NestedBytesWithAggregatesFilter<$PrismaModel> | Uint8Array
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBytesFilter<$PrismaModel>
    _max?: NestedBytesFilter<$PrismaModel>
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type RedemptionCodeOrderByRelevanceInput = {
    fields: RedemptionCodeOrderByRelevanceFieldEnum | RedemptionCodeOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type RedemptionCodeCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    amount?: SortOrder
    remark?: SortOrder
    createdAt?: SortOrder
    expiredAt?: SortOrder
    redeemedAt?: SortOrder
    redeemerId?: SortOrder
  }

  export type RedemptionCodeAvgOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    redeemerId?: SortOrder
  }

  export type RedemptionCodeMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    amount?: SortOrder
    remark?: SortOrder
    createdAt?: SortOrder
    expiredAt?: SortOrder
    redeemedAt?: SortOrder
    redeemerId?: SortOrder
  }

  export type RedemptionCodeMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    amount?: SortOrder
    remark?: SortOrder
    createdAt?: SortOrder
    expiredAt?: SortOrder
    redeemedAt?: SortOrder
    redeemerId?: SortOrder
  }

  export type RedemptionCodeSumOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    redeemerId?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type WalletCreateNestedOneWithoutOwnerInput = {
    create?: XOR<WalletCreateWithoutOwnerInput, WalletUncheckedCreateWithoutOwnerInput>
    connectOrCreate?: WalletCreateOrConnectWithoutOwnerInput
    connect?: WalletWhereUniqueInput
  }

  export type WalletMemberCreateNestedManyWithoutUserInput = {
    create?: XOR<WalletMemberCreateWithoutUserInput, WalletMemberUncheckedCreateWithoutUserInput> | WalletMemberCreateWithoutUserInput[] | WalletMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WalletMemberCreateOrConnectWithoutUserInput | WalletMemberCreateOrConnectWithoutUserInput[]
    createMany?: WalletMemberCreateManyUserInputEnvelope
    connect?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
  }

  export type PasskeyCreateNestedManyWithoutUserInput = {
    create?: XOR<PasskeyCreateWithoutUserInput, PasskeyUncheckedCreateWithoutUserInput> | PasskeyCreateWithoutUserInput[] | PasskeyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasskeyCreateOrConnectWithoutUserInput | PasskeyCreateOrConnectWithoutUserInput[]
    createMany?: PasskeyCreateManyUserInputEnvelope
    connect?: PasskeyWhereUniqueInput | PasskeyWhereUniqueInput[]
  }

  export type RedemptionCodeCreateNestedManyWithoutRedeemerInput = {
    create?: XOR<RedemptionCodeCreateWithoutRedeemerInput, RedemptionCodeUncheckedCreateWithoutRedeemerInput> | RedemptionCodeCreateWithoutRedeemerInput[] | RedemptionCodeUncheckedCreateWithoutRedeemerInput[]
    connectOrCreate?: RedemptionCodeCreateOrConnectWithoutRedeemerInput | RedemptionCodeCreateOrConnectWithoutRedeemerInput[]
    createMany?: RedemptionCodeCreateManyRedeemerInputEnvelope
    connect?: RedemptionCodeWhereUniqueInput | RedemptionCodeWhereUniqueInput[]
  }

  export type ApiKeyCreateNestedManyWithoutCreatorInput = {
    create?: XOR<ApiKeyCreateWithoutCreatorInput, ApiKeyUncheckedCreateWithoutCreatorInput> | ApiKeyCreateWithoutCreatorInput[] | ApiKeyUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutCreatorInput | ApiKeyCreateOrConnectWithoutCreatorInput[]
    createMany?: ApiKeyCreateManyCreatorInputEnvelope
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
  }

  export type WalletUncheckedCreateNestedOneWithoutOwnerInput = {
    create?: XOR<WalletCreateWithoutOwnerInput, WalletUncheckedCreateWithoutOwnerInput>
    connectOrCreate?: WalletCreateOrConnectWithoutOwnerInput
    connect?: WalletWhereUniqueInput
  }

  export type WalletMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<WalletMemberCreateWithoutUserInput, WalletMemberUncheckedCreateWithoutUserInput> | WalletMemberCreateWithoutUserInput[] | WalletMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WalletMemberCreateOrConnectWithoutUserInput | WalletMemberCreateOrConnectWithoutUserInput[]
    createMany?: WalletMemberCreateManyUserInputEnvelope
    connect?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
  }

  export type PasskeyUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PasskeyCreateWithoutUserInput, PasskeyUncheckedCreateWithoutUserInput> | PasskeyCreateWithoutUserInput[] | PasskeyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasskeyCreateOrConnectWithoutUserInput | PasskeyCreateOrConnectWithoutUserInput[]
    createMany?: PasskeyCreateManyUserInputEnvelope
    connect?: PasskeyWhereUniqueInput | PasskeyWhereUniqueInput[]
  }

  export type RedemptionCodeUncheckedCreateNestedManyWithoutRedeemerInput = {
    create?: XOR<RedemptionCodeCreateWithoutRedeemerInput, RedemptionCodeUncheckedCreateWithoutRedeemerInput> | RedemptionCodeCreateWithoutRedeemerInput[] | RedemptionCodeUncheckedCreateWithoutRedeemerInput[]
    connectOrCreate?: RedemptionCodeCreateOrConnectWithoutRedeemerInput | RedemptionCodeCreateOrConnectWithoutRedeemerInput[]
    createMany?: RedemptionCodeCreateManyRedeemerInputEnvelope
    connect?: RedemptionCodeWhereUniqueInput | RedemptionCodeWhereUniqueInput[]
  }

  export type ApiKeyUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<ApiKeyCreateWithoutCreatorInput, ApiKeyUncheckedCreateWithoutCreatorInput> | ApiKeyCreateWithoutCreatorInput[] | ApiKeyUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutCreatorInput | ApiKeyCreateOrConnectWithoutCreatorInput[]
    createMany?: ApiKeyCreateManyCreatorInputEnvelope
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type WalletUpdateOneWithoutOwnerNestedInput = {
    create?: XOR<WalletCreateWithoutOwnerInput, WalletUncheckedCreateWithoutOwnerInput>
    connectOrCreate?: WalletCreateOrConnectWithoutOwnerInput
    upsert?: WalletUpsertWithoutOwnerInput
    disconnect?: WalletWhereInput | boolean
    delete?: WalletWhereInput | boolean
    connect?: WalletWhereUniqueInput
    update?: XOR<XOR<WalletUpdateToOneWithWhereWithoutOwnerInput, WalletUpdateWithoutOwnerInput>, WalletUncheckedUpdateWithoutOwnerInput>
  }

  export type WalletMemberUpdateManyWithoutUserNestedInput = {
    create?: XOR<WalletMemberCreateWithoutUserInput, WalletMemberUncheckedCreateWithoutUserInput> | WalletMemberCreateWithoutUserInput[] | WalletMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WalletMemberCreateOrConnectWithoutUserInput | WalletMemberCreateOrConnectWithoutUserInput[]
    upsert?: WalletMemberUpsertWithWhereUniqueWithoutUserInput | WalletMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WalletMemberCreateManyUserInputEnvelope
    set?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
    disconnect?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
    delete?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
    connect?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
    update?: WalletMemberUpdateWithWhereUniqueWithoutUserInput | WalletMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WalletMemberUpdateManyWithWhereWithoutUserInput | WalletMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WalletMemberScalarWhereInput | WalletMemberScalarWhereInput[]
  }

  export type PasskeyUpdateManyWithoutUserNestedInput = {
    create?: XOR<PasskeyCreateWithoutUserInput, PasskeyUncheckedCreateWithoutUserInput> | PasskeyCreateWithoutUserInput[] | PasskeyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasskeyCreateOrConnectWithoutUserInput | PasskeyCreateOrConnectWithoutUserInput[]
    upsert?: PasskeyUpsertWithWhereUniqueWithoutUserInput | PasskeyUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PasskeyCreateManyUserInputEnvelope
    set?: PasskeyWhereUniqueInput | PasskeyWhereUniqueInput[]
    disconnect?: PasskeyWhereUniqueInput | PasskeyWhereUniqueInput[]
    delete?: PasskeyWhereUniqueInput | PasskeyWhereUniqueInput[]
    connect?: PasskeyWhereUniqueInput | PasskeyWhereUniqueInput[]
    update?: PasskeyUpdateWithWhereUniqueWithoutUserInput | PasskeyUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PasskeyUpdateManyWithWhereWithoutUserInput | PasskeyUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PasskeyScalarWhereInput | PasskeyScalarWhereInput[]
  }

  export type RedemptionCodeUpdateManyWithoutRedeemerNestedInput = {
    create?: XOR<RedemptionCodeCreateWithoutRedeemerInput, RedemptionCodeUncheckedCreateWithoutRedeemerInput> | RedemptionCodeCreateWithoutRedeemerInput[] | RedemptionCodeUncheckedCreateWithoutRedeemerInput[]
    connectOrCreate?: RedemptionCodeCreateOrConnectWithoutRedeemerInput | RedemptionCodeCreateOrConnectWithoutRedeemerInput[]
    upsert?: RedemptionCodeUpsertWithWhereUniqueWithoutRedeemerInput | RedemptionCodeUpsertWithWhereUniqueWithoutRedeemerInput[]
    createMany?: RedemptionCodeCreateManyRedeemerInputEnvelope
    set?: RedemptionCodeWhereUniqueInput | RedemptionCodeWhereUniqueInput[]
    disconnect?: RedemptionCodeWhereUniqueInput | RedemptionCodeWhereUniqueInput[]
    delete?: RedemptionCodeWhereUniqueInput | RedemptionCodeWhereUniqueInput[]
    connect?: RedemptionCodeWhereUniqueInput | RedemptionCodeWhereUniqueInput[]
    update?: RedemptionCodeUpdateWithWhereUniqueWithoutRedeemerInput | RedemptionCodeUpdateWithWhereUniqueWithoutRedeemerInput[]
    updateMany?: RedemptionCodeUpdateManyWithWhereWithoutRedeemerInput | RedemptionCodeUpdateManyWithWhereWithoutRedeemerInput[]
    deleteMany?: RedemptionCodeScalarWhereInput | RedemptionCodeScalarWhereInput[]
  }

  export type ApiKeyUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<ApiKeyCreateWithoutCreatorInput, ApiKeyUncheckedCreateWithoutCreatorInput> | ApiKeyCreateWithoutCreatorInput[] | ApiKeyUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutCreatorInput | ApiKeyCreateOrConnectWithoutCreatorInput[]
    upsert?: ApiKeyUpsertWithWhereUniqueWithoutCreatorInput | ApiKeyUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: ApiKeyCreateManyCreatorInputEnvelope
    set?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    disconnect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    delete?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    update?: ApiKeyUpdateWithWhereUniqueWithoutCreatorInput | ApiKeyUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: ApiKeyUpdateManyWithWhereWithoutCreatorInput | ApiKeyUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type WalletUncheckedUpdateOneWithoutOwnerNestedInput = {
    create?: XOR<WalletCreateWithoutOwnerInput, WalletUncheckedCreateWithoutOwnerInput>
    connectOrCreate?: WalletCreateOrConnectWithoutOwnerInput
    upsert?: WalletUpsertWithoutOwnerInput
    disconnect?: WalletWhereInput | boolean
    delete?: WalletWhereInput | boolean
    connect?: WalletWhereUniqueInput
    update?: XOR<XOR<WalletUpdateToOneWithWhereWithoutOwnerInput, WalletUpdateWithoutOwnerInput>, WalletUncheckedUpdateWithoutOwnerInput>
  }

  export type WalletMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<WalletMemberCreateWithoutUserInput, WalletMemberUncheckedCreateWithoutUserInput> | WalletMemberCreateWithoutUserInput[] | WalletMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WalletMemberCreateOrConnectWithoutUserInput | WalletMemberCreateOrConnectWithoutUserInput[]
    upsert?: WalletMemberUpsertWithWhereUniqueWithoutUserInput | WalletMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WalletMemberCreateManyUserInputEnvelope
    set?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
    disconnect?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
    delete?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
    connect?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
    update?: WalletMemberUpdateWithWhereUniqueWithoutUserInput | WalletMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WalletMemberUpdateManyWithWhereWithoutUserInput | WalletMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WalletMemberScalarWhereInput | WalletMemberScalarWhereInput[]
  }

  export type PasskeyUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PasskeyCreateWithoutUserInput, PasskeyUncheckedCreateWithoutUserInput> | PasskeyCreateWithoutUserInput[] | PasskeyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasskeyCreateOrConnectWithoutUserInput | PasskeyCreateOrConnectWithoutUserInput[]
    upsert?: PasskeyUpsertWithWhereUniqueWithoutUserInput | PasskeyUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PasskeyCreateManyUserInputEnvelope
    set?: PasskeyWhereUniqueInput | PasskeyWhereUniqueInput[]
    disconnect?: PasskeyWhereUniqueInput | PasskeyWhereUniqueInput[]
    delete?: PasskeyWhereUniqueInput | PasskeyWhereUniqueInput[]
    connect?: PasskeyWhereUniqueInput | PasskeyWhereUniqueInput[]
    update?: PasskeyUpdateWithWhereUniqueWithoutUserInput | PasskeyUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PasskeyUpdateManyWithWhereWithoutUserInput | PasskeyUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PasskeyScalarWhereInput | PasskeyScalarWhereInput[]
  }

  export type RedemptionCodeUncheckedUpdateManyWithoutRedeemerNestedInput = {
    create?: XOR<RedemptionCodeCreateWithoutRedeemerInput, RedemptionCodeUncheckedCreateWithoutRedeemerInput> | RedemptionCodeCreateWithoutRedeemerInput[] | RedemptionCodeUncheckedCreateWithoutRedeemerInput[]
    connectOrCreate?: RedemptionCodeCreateOrConnectWithoutRedeemerInput | RedemptionCodeCreateOrConnectWithoutRedeemerInput[]
    upsert?: RedemptionCodeUpsertWithWhereUniqueWithoutRedeemerInput | RedemptionCodeUpsertWithWhereUniqueWithoutRedeemerInput[]
    createMany?: RedemptionCodeCreateManyRedeemerInputEnvelope
    set?: RedemptionCodeWhereUniqueInput | RedemptionCodeWhereUniqueInput[]
    disconnect?: RedemptionCodeWhereUniqueInput | RedemptionCodeWhereUniqueInput[]
    delete?: RedemptionCodeWhereUniqueInput | RedemptionCodeWhereUniqueInput[]
    connect?: RedemptionCodeWhereUniqueInput | RedemptionCodeWhereUniqueInput[]
    update?: RedemptionCodeUpdateWithWhereUniqueWithoutRedeemerInput | RedemptionCodeUpdateWithWhereUniqueWithoutRedeemerInput[]
    updateMany?: RedemptionCodeUpdateManyWithWhereWithoutRedeemerInput | RedemptionCodeUpdateManyWithWhereWithoutRedeemerInput[]
    deleteMany?: RedemptionCodeScalarWhereInput | RedemptionCodeScalarWhereInput[]
  }

  export type ApiKeyUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<ApiKeyCreateWithoutCreatorInput, ApiKeyUncheckedCreateWithoutCreatorInput> | ApiKeyCreateWithoutCreatorInput[] | ApiKeyUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutCreatorInput | ApiKeyCreateOrConnectWithoutCreatorInput[]
    upsert?: ApiKeyUpsertWithWhereUniqueWithoutCreatorInput | ApiKeyUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: ApiKeyCreateManyCreatorInputEnvelope
    set?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    disconnect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    delete?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    update?: ApiKeyUpdateWithWhereUniqueWithoutCreatorInput | ApiKeyUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: ApiKeyUpdateManyWithWhereWithoutCreatorInput | ApiKeyUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutWalletInput = {
    create?: XOR<UserCreateWithoutWalletInput, UserUncheckedCreateWithoutWalletInput>
    connectOrCreate?: UserCreateOrConnectWithoutWalletInput
    connect?: UserWhereUniqueInput
  }

  export type WalletMemberCreateNestedManyWithoutWalletInput = {
    create?: XOR<WalletMemberCreateWithoutWalletInput, WalletMemberUncheckedCreateWithoutWalletInput> | WalletMemberCreateWithoutWalletInput[] | WalletMemberUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: WalletMemberCreateOrConnectWithoutWalletInput | WalletMemberCreateOrConnectWithoutWalletInput[]
    createMany?: WalletMemberCreateManyWalletInputEnvelope
    connect?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
  }

  export type ApiKeyCreateNestedManyWithoutWalletInput = {
    create?: XOR<ApiKeyCreateWithoutWalletInput, ApiKeyUncheckedCreateWithoutWalletInput> | ApiKeyCreateWithoutWalletInput[] | ApiKeyUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutWalletInput | ApiKeyCreateOrConnectWithoutWalletInput[]
    createMany?: ApiKeyCreateManyWalletInputEnvelope
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
  }

  export type WalletMemberUncheckedCreateNestedManyWithoutWalletInput = {
    create?: XOR<WalletMemberCreateWithoutWalletInput, WalletMemberUncheckedCreateWithoutWalletInput> | WalletMemberCreateWithoutWalletInput[] | WalletMemberUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: WalletMemberCreateOrConnectWithoutWalletInput | WalletMemberCreateOrConnectWithoutWalletInput[]
    createMany?: WalletMemberCreateManyWalletInputEnvelope
    connect?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
  }

  export type ApiKeyUncheckedCreateNestedManyWithoutWalletInput = {
    create?: XOR<ApiKeyCreateWithoutWalletInput, ApiKeyUncheckedCreateWithoutWalletInput> | ApiKeyCreateWithoutWalletInput[] | ApiKeyUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutWalletInput | ApiKeyCreateOrConnectWithoutWalletInput[]
    createMany?: ApiKeyCreateManyWalletInputEnvelope
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type UserUpdateOneRequiredWithoutWalletNestedInput = {
    create?: XOR<UserCreateWithoutWalletInput, UserUncheckedCreateWithoutWalletInput>
    connectOrCreate?: UserCreateOrConnectWithoutWalletInput
    upsert?: UserUpsertWithoutWalletInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWalletInput, UserUpdateWithoutWalletInput>, UserUncheckedUpdateWithoutWalletInput>
  }

  export type WalletMemberUpdateManyWithoutWalletNestedInput = {
    create?: XOR<WalletMemberCreateWithoutWalletInput, WalletMemberUncheckedCreateWithoutWalletInput> | WalletMemberCreateWithoutWalletInput[] | WalletMemberUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: WalletMemberCreateOrConnectWithoutWalletInput | WalletMemberCreateOrConnectWithoutWalletInput[]
    upsert?: WalletMemberUpsertWithWhereUniqueWithoutWalletInput | WalletMemberUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: WalletMemberCreateManyWalletInputEnvelope
    set?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
    disconnect?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
    delete?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
    connect?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
    update?: WalletMemberUpdateWithWhereUniqueWithoutWalletInput | WalletMemberUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: WalletMemberUpdateManyWithWhereWithoutWalletInput | WalletMemberUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: WalletMemberScalarWhereInput | WalletMemberScalarWhereInput[]
  }

  export type ApiKeyUpdateManyWithoutWalletNestedInput = {
    create?: XOR<ApiKeyCreateWithoutWalletInput, ApiKeyUncheckedCreateWithoutWalletInput> | ApiKeyCreateWithoutWalletInput[] | ApiKeyUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutWalletInput | ApiKeyCreateOrConnectWithoutWalletInput[]
    upsert?: ApiKeyUpsertWithWhereUniqueWithoutWalletInput | ApiKeyUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: ApiKeyCreateManyWalletInputEnvelope
    set?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    disconnect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    delete?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    update?: ApiKeyUpdateWithWhereUniqueWithoutWalletInput | ApiKeyUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: ApiKeyUpdateManyWithWhereWithoutWalletInput | ApiKeyUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
  }

  export type WalletMemberUncheckedUpdateManyWithoutWalletNestedInput = {
    create?: XOR<WalletMemberCreateWithoutWalletInput, WalletMemberUncheckedCreateWithoutWalletInput> | WalletMemberCreateWithoutWalletInput[] | WalletMemberUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: WalletMemberCreateOrConnectWithoutWalletInput | WalletMemberCreateOrConnectWithoutWalletInput[]
    upsert?: WalletMemberUpsertWithWhereUniqueWithoutWalletInput | WalletMemberUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: WalletMemberCreateManyWalletInputEnvelope
    set?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
    disconnect?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
    delete?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
    connect?: WalletMemberWhereUniqueInput | WalletMemberWhereUniqueInput[]
    update?: WalletMemberUpdateWithWhereUniqueWithoutWalletInput | WalletMemberUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: WalletMemberUpdateManyWithWhereWithoutWalletInput | WalletMemberUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: WalletMemberScalarWhereInput | WalletMemberScalarWhereInput[]
  }

  export type ApiKeyUncheckedUpdateManyWithoutWalletNestedInput = {
    create?: XOR<ApiKeyCreateWithoutWalletInput, ApiKeyUncheckedCreateWithoutWalletInput> | ApiKeyCreateWithoutWalletInput[] | ApiKeyUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutWalletInput | ApiKeyCreateOrConnectWithoutWalletInput[]
    upsert?: ApiKeyUpsertWithWhereUniqueWithoutWalletInput | ApiKeyUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: ApiKeyCreateManyWalletInputEnvelope
    set?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    disconnect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    delete?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    update?: ApiKeyUpdateWithWhereUniqueWithoutWalletInput | ApiKeyUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: ApiKeyUpdateManyWithWhereWithoutWalletInput | ApiKeyUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
  }

  export type WalletCreateNestedOneWithoutMembersInput = {
    create?: XOR<WalletCreateWithoutMembersInput, WalletUncheckedCreateWithoutMembersInput>
    connectOrCreate?: WalletCreateOrConnectWithoutMembersInput
    connect?: WalletWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutWalletMembersInput = {
    create?: XOR<UserCreateWithoutWalletMembersInput, UserUncheckedCreateWithoutWalletMembersInput>
    connectOrCreate?: UserCreateOrConnectWithoutWalletMembersInput
    connect?: UserWhereUniqueInput
  }

  export type WalletUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<WalletCreateWithoutMembersInput, WalletUncheckedCreateWithoutMembersInput>
    connectOrCreate?: WalletCreateOrConnectWithoutMembersInput
    upsert?: WalletUpsertWithoutMembersInput
    connect?: WalletWhereUniqueInput
    update?: XOR<XOR<WalletUpdateToOneWithWhereWithoutMembersInput, WalletUpdateWithoutMembersInput>, WalletUncheckedUpdateWithoutMembersInput>
  }

  export type UserUpdateOneRequiredWithoutWalletMembersNestedInput = {
    create?: XOR<UserCreateWithoutWalletMembersInput, UserUncheckedCreateWithoutWalletMembersInput>
    connectOrCreate?: UserCreateOrConnectWithoutWalletMembersInput
    upsert?: UserUpsertWithoutWalletMembersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWalletMembersInput, UserUpdateWithoutWalletMembersInput>, UserUncheckedUpdateWithoutWalletMembersInput>
  }

  export type WalletCreateNestedOneWithoutApiKeysInput = {
    create?: XOR<WalletCreateWithoutApiKeysInput, WalletUncheckedCreateWithoutApiKeysInput>
    connectOrCreate?: WalletCreateOrConnectWithoutApiKeysInput
    connect?: WalletWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCreatedApiKeysInput = {
    create?: XOR<UserCreateWithoutCreatedApiKeysInput, UserUncheckedCreateWithoutCreatedApiKeysInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedApiKeysInput
    connect?: UserWhereUniqueInput
  }

  export type WalletUpdateOneRequiredWithoutApiKeysNestedInput = {
    create?: XOR<WalletCreateWithoutApiKeysInput, WalletUncheckedCreateWithoutApiKeysInput>
    connectOrCreate?: WalletCreateOrConnectWithoutApiKeysInput
    upsert?: WalletUpsertWithoutApiKeysInput
    connect?: WalletWhereUniqueInput
    update?: XOR<XOR<WalletUpdateToOneWithWhereWithoutApiKeysInput, WalletUpdateWithoutApiKeysInput>, WalletUncheckedUpdateWithoutApiKeysInput>
  }

  export type UserUpdateOneRequiredWithoutCreatedApiKeysNestedInput = {
    create?: XOR<UserCreateWithoutCreatedApiKeysInput, UserUncheckedCreateWithoutCreatedApiKeysInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedApiKeysInput
    upsert?: UserUpsertWithoutCreatedApiKeysInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCreatedApiKeysInput, UserUpdateWithoutCreatedApiKeysInput>, UserUncheckedUpdateWithoutCreatedApiKeysInput>
  }

  export type UserCreateNestedOneWithoutPasskeysInput = {
    create?: XOR<UserCreateWithoutPasskeysInput, UserUncheckedCreateWithoutPasskeysInput>
    connectOrCreate?: UserCreateOrConnectWithoutPasskeysInput
    connect?: UserWhereUniqueInput
  }

  export type BytesFieldUpdateOperationsInput = {
    set?: Uint8Array
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type UserUpdateOneRequiredWithoutPasskeysNestedInput = {
    create?: XOR<UserCreateWithoutPasskeysInput, UserUncheckedCreateWithoutPasskeysInput>
    connectOrCreate?: UserCreateOrConnectWithoutPasskeysInput
    upsert?: UserUpsertWithoutPasskeysInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPasskeysInput, UserUpdateWithoutPasskeysInput>, UserUncheckedUpdateWithoutPasskeysInput>
  }

  export type UserCreateNestedOneWithoutRedeemCodesInput = {
    create?: XOR<UserCreateWithoutRedeemCodesInput, UserUncheckedCreateWithoutRedeemCodesInput>
    connectOrCreate?: UserCreateOrConnectWithoutRedeemCodesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutRedeemCodesNestedInput = {
    create?: XOR<UserCreateWithoutRedeemCodesInput, UserUncheckedCreateWithoutRedeemCodesInput>
    connectOrCreate?: UserCreateOrConnectWithoutRedeemCodesInput
    upsert?: UserUpsertWithoutRedeemCodesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRedeemCodesInput, UserUpdateWithoutRedeemCodesInput>, UserUncheckedUpdateWithoutRedeemCodesInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedBytesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[]
    notIn?: Uint8Array[]
    not?: NestedBytesFilter<$PrismaModel> | Uint8Array
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedBytesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[]
    notIn?: Uint8Array[]
    not?: NestedBytesWithAggregatesFilter<$PrismaModel> | Uint8Array
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBytesFilter<$PrismaModel>
    _max?: NestedBytesFilter<$PrismaModel>
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type WalletCreateWithoutOwnerInput = {
    uid?: string
    balance?: Decimal | DecimalJsLike | number | string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WalletMemberCreateNestedManyWithoutWalletInput
    apiKeys?: ApiKeyCreateNestedManyWithoutWalletInput
  }

  export type WalletUncheckedCreateWithoutOwnerInput = {
    id?: number
    uid?: string
    balance?: Decimal | DecimalJsLike | number | string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WalletMemberUncheckedCreateNestedManyWithoutWalletInput
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutWalletInput
  }

  export type WalletCreateOrConnectWithoutOwnerInput = {
    where: WalletWhereUniqueInput
    create: XOR<WalletCreateWithoutOwnerInput, WalletUncheckedCreateWithoutOwnerInput>
  }

  export type WalletMemberCreateWithoutUserInput = {
    creditLimit: Decimal | DecimalJsLike | number | string
    creditAvailable: Decimal | DecimalJsLike | number | string
    creditUsed?: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    joinedAt?: Date | string
    leftAt?: Date | string | null
    updatedAt?: Date | string
    wallet: WalletCreateNestedOneWithoutMembersInput
  }

  export type WalletMemberUncheckedCreateWithoutUserInput = {
    id?: number
    walletId: number
    creditLimit: Decimal | DecimalJsLike | number | string
    creditAvailable: Decimal | DecimalJsLike | number | string
    creditUsed?: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    joinedAt?: Date | string
    leftAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type WalletMemberCreateOrConnectWithoutUserInput = {
    where: WalletMemberWhereUniqueInput
    create: XOR<WalletMemberCreateWithoutUserInput, WalletMemberUncheckedCreateWithoutUserInput>
  }

  export type WalletMemberCreateManyUserInputEnvelope = {
    data: WalletMemberCreateManyUserInput | WalletMemberCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PasskeyCreateWithoutUserInput = {
    id: string
    publicKey: Uint8Array
    webAuthnUserID: string
    counter?: bigint | number
    displayName?: string
    transports?: string | null
    deviceType?: string
    backedUp?: boolean
    isDeleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastUsedAt?: Date | string | null
  }

  export type PasskeyUncheckedCreateWithoutUserInput = {
    id: string
    publicKey: Uint8Array
    webAuthnUserID: string
    counter?: bigint | number
    displayName?: string
    transports?: string | null
    deviceType?: string
    backedUp?: boolean
    isDeleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastUsedAt?: Date | string | null
  }

  export type PasskeyCreateOrConnectWithoutUserInput = {
    where: PasskeyWhereUniqueInput
    create: XOR<PasskeyCreateWithoutUserInput, PasskeyUncheckedCreateWithoutUserInput>
  }

  export type PasskeyCreateManyUserInputEnvelope = {
    data: PasskeyCreateManyUserInput | PasskeyCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type RedemptionCodeCreateWithoutRedeemerInput = {
    code: string
    amount: number
    remark?: string
    createdAt?: Date | string
    expiredAt?: Date | string
    redeemedAt?: Date | string | null
  }

  export type RedemptionCodeUncheckedCreateWithoutRedeemerInput = {
    id?: number
    code: string
    amount: number
    remark?: string
    createdAt?: Date | string
    expiredAt?: Date | string
    redeemedAt?: Date | string | null
  }

  export type RedemptionCodeCreateOrConnectWithoutRedeemerInput = {
    where: RedemptionCodeWhereUniqueInput
    create: XOR<RedemptionCodeCreateWithoutRedeemerInput, RedemptionCodeUncheckedCreateWithoutRedeemerInput>
  }

  export type RedemptionCodeCreateManyRedeemerInputEnvelope = {
    data: RedemptionCodeCreateManyRedeemerInput | RedemptionCodeCreateManyRedeemerInput[]
    skipDuplicates?: boolean
  }

  export type ApiKeyCreateWithoutCreatorInput = {
    hashKey: string
    preview: string
    displayName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastUsedAt?: Date | string | null
    wallet: WalletCreateNestedOneWithoutApiKeysInput
  }

  export type ApiKeyUncheckedCreateWithoutCreatorInput = {
    id?: number
    walletId: number
    hashKey: string
    preview: string
    displayName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastUsedAt?: Date | string | null
  }

  export type ApiKeyCreateOrConnectWithoutCreatorInput = {
    where: ApiKeyWhereUniqueInput
    create: XOR<ApiKeyCreateWithoutCreatorInput, ApiKeyUncheckedCreateWithoutCreatorInput>
  }

  export type ApiKeyCreateManyCreatorInputEnvelope = {
    data: ApiKeyCreateManyCreatorInput | ApiKeyCreateManyCreatorInput[]
    skipDuplicates?: boolean
  }

  export type WalletUpsertWithoutOwnerInput = {
    update: XOR<WalletUpdateWithoutOwnerInput, WalletUncheckedUpdateWithoutOwnerInput>
    create: XOR<WalletCreateWithoutOwnerInput, WalletUncheckedCreateWithoutOwnerInput>
    where?: WalletWhereInput
  }

  export type WalletUpdateToOneWithWhereWithoutOwnerInput = {
    where?: WalletWhereInput
    data: XOR<WalletUpdateWithoutOwnerInput, WalletUncheckedUpdateWithoutOwnerInput>
  }

  export type WalletUpdateWithoutOwnerInput = {
    uid?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WalletMemberUpdateManyWithoutWalletNestedInput
    apiKeys?: ApiKeyUpdateManyWithoutWalletNestedInput
  }

  export type WalletUncheckedUpdateWithoutOwnerInput = {
    id?: IntFieldUpdateOperationsInput | number
    uid?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WalletMemberUncheckedUpdateManyWithoutWalletNestedInput
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type WalletMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: WalletMemberWhereUniqueInput
    update: XOR<WalletMemberUpdateWithoutUserInput, WalletMemberUncheckedUpdateWithoutUserInput>
    create: XOR<WalletMemberCreateWithoutUserInput, WalletMemberUncheckedCreateWithoutUserInput>
  }

  export type WalletMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: WalletMemberWhereUniqueInput
    data: XOR<WalletMemberUpdateWithoutUserInput, WalletMemberUncheckedUpdateWithoutUserInput>
  }

  export type WalletMemberUpdateManyWithWhereWithoutUserInput = {
    where: WalletMemberScalarWhereInput
    data: XOR<WalletMemberUpdateManyMutationInput, WalletMemberUncheckedUpdateManyWithoutUserInput>
  }

  export type WalletMemberScalarWhereInput = {
    AND?: WalletMemberScalarWhereInput | WalletMemberScalarWhereInput[]
    OR?: WalletMemberScalarWhereInput[]
    NOT?: WalletMemberScalarWhereInput | WalletMemberScalarWhereInput[]
    id?: IntFilter<"WalletMember"> | number
    walletId?: IntFilter<"WalletMember"> | number
    userId?: IntFilter<"WalletMember"> | number
    creditLimit?: DecimalFilter<"WalletMember"> | Decimal | DecimalJsLike | number | string
    creditAvailable?: DecimalFilter<"WalletMember"> | Decimal | DecimalJsLike | number | string
    creditUsed?: DecimalFilter<"WalletMember"> | Decimal | DecimalJsLike | number | string
    isActive?: BoolFilter<"WalletMember"> | boolean
    joinedAt?: DateTimeFilter<"WalletMember"> | Date | string
    leftAt?: DateTimeNullableFilter<"WalletMember"> | Date | string | null
    updatedAt?: DateTimeFilter<"WalletMember"> | Date | string
  }

  export type PasskeyUpsertWithWhereUniqueWithoutUserInput = {
    where: PasskeyWhereUniqueInput
    update: XOR<PasskeyUpdateWithoutUserInput, PasskeyUncheckedUpdateWithoutUserInput>
    create: XOR<PasskeyCreateWithoutUserInput, PasskeyUncheckedCreateWithoutUserInput>
  }

  export type PasskeyUpdateWithWhereUniqueWithoutUserInput = {
    where: PasskeyWhereUniqueInput
    data: XOR<PasskeyUpdateWithoutUserInput, PasskeyUncheckedUpdateWithoutUserInput>
  }

  export type PasskeyUpdateManyWithWhereWithoutUserInput = {
    where: PasskeyScalarWhereInput
    data: XOR<PasskeyUpdateManyMutationInput, PasskeyUncheckedUpdateManyWithoutUserInput>
  }

  export type PasskeyScalarWhereInput = {
    AND?: PasskeyScalarWhereInput | PasskeyScalarWhereInput[]
    OR?: PasskeyScalarWhereInput[]
    NOT?: PasskeyScalarWhereInput | PasskeyScalarWhereInput[]
    id?: StringFilter<"Passkey"> | string
    publicKey?: BytesFilter<"Passkey"> | Uint8Array
    webAuthnUserID?: StringFilter<"Passkey"> | string
    counter?: BigIntFilter<"Passkey"> | bigint | number
    displayName?: StringFilter<"Passkey"> | string
    transports?: StringNullableFilter<"Passkey"> | string | null
    deviceType?: StringFilter<"Passkey"> | string
    backedUp?: BoolFilter<"Passkey"> | boolean
    isDeleted?: BoolFilter<"Passkey"> | boolean
    createdAt?: DateTimeFilter<"Passkey"> | Date | string
    updatedAt?: DateTimeFilter<"Passkey"> | Date | string
    lastUsedAt?: DateTimeNullableFilter<"Passkey"> | Date | string | null
    userId?: IntFilter<"Passkey"> | number
  }

  export type RedemptionCodeUpsertWithWhereUniqueWithoutRedeemerInput = {
    where: RedemptionCodeWhereUniqueInput
    update: XOR<RedemptionCodeUpdateWithoutRedeemerInput, RedemptionCodeUncheckedUpdateWithoutRedeemerInput>
    create: XOR<RedemptionCodeCreateWithoutRedeemerInput, RedemptionCodeUncheckedCreateWithoutRedeemerInput>
  }

  export type RedemptionCodeUpdateWithWhereUniqueWithoutRedeemerInput = {
    where: RedemptionCodeWhereUniqueInput
    data: XOR<RedemptionCodeUpdateWithoutRedeemerInput, RedemptionCodeUncheckedUpdateWithoutRedeemerInput>
  }

  export type RedemptionCodeUpdateManyWithWhereWithoutRedeemerInput = {
    where: RedemptionCodeScalarWhereInput
    data: XOR<RedemptionCodeUpdateManyMutationInput, RedemptionCodeUncheckedUpdateManyWithoutRedeemerInput>
  }

  export type RedemptionCodeScalarWhereInput = {
    AND?: RedemptionCodeScalarWhereInput | RedemptionCodeScalarWhereInput[]
    OR?: RedemptionCodeScalarWhereInput[]
    NOT?: RedemptionCodeScalarWhereInput | RedemptionCodeScalarWhereInput[]
    id?: IntFilter<"RedemptionCode"> | number
    code?: StringFilter<"RedemptionCode"> | string
    amount?: IntFilter<"RedemptionCode"> | number
    remark?: StringFilter<"RedemptionCode"> | string
    createdAt?: DateTimeFilter<"RedemptionCode"> | Date | string
    expiredAt?: DateTimeFilter<"RedemptionCode"> | Date | string
    redeemedAt?: DateTimeNullableFilter<"RedemptionCode"> | Date | string | null
    redeemerId?: IntNullableFilter<"RedemptionCode"> | number | null
  }

  export type ApiKeyUpsertWithWhereUniqueWithoutCreatorInput = {
    where: ApiKeyWhereUniqueInput
    update: XOR<ApiKeyUpdateWithoutCreatorInput, ApiKeyUncheckedUpdateWithoutCreatorInput>
    create: XOR<ApiKeyCreateWithoutCreatorInput, ApiKeyUncheckedCreateWithoutCreatorInput>
  }

  export type ApiKeyUpdateWithWhereUniqueWithoutCreatorInput = {
    where: ApiKeyWhereUniqueInput
    data: XOR<ApiKeyUpdateWithoutCreatorInput, ApiKeyUncheckedUpdateWithoutCreatorInput>
  }

  export type ApiKeyUpdateManyWithWhereWithoutCreatorInput = {
    where: ApiKeyScalarWhereInput
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyWithoutCreatorInput>
  }

  export type ApiKeyScalarWhereInput = {
    AND?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
    OR?: ApiKeyScalarWhereInput[]
    NOT?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
    id?: IntFilter<"ApiKey"> | number
    walletId?: IntFilter<"ApiKey"> | number
    creatorId?: IntFilter<"ApiKey"> | number
    hashKey?: StringFilter<"ApiKey"> | string
    preview?: StringFilter<"ApiKey"> | string
    displayName?: StringFilter<"ApiKey"> | string
    isActive?: BoolFilter<"ApiKey"> | boolean
    createdAt?: DateTimeFilter<"ApiKey"> | Date | string
    updatedAt?: DateTimeFilter<"ApiKey"> | Date | string
    lastUsedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
  }

  export type UserCreateWithoutWalletInput = {
    uid?: string
    displayName?: string | null
    avatar?: string | null
    email?: string | null
    phone?: string | null
    gitHubId?: string | null
    googleId?: string | null
    isActive?: boolean
    isDeleted?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    walletMembers?: WalletMemberCreateNestedManyWithoutUserInput
    passkeys?: PasskeyCreateNestedManyWithoutUserInput
    redeemCodes?: RedemptionCodeCreateNestedManyWithoutRedeemerInput
    createdApiKeys?: ApiKeyCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateWithoutWalletInput = {
    id?: number
    uid?: string
    displayName?: string | null
    avatar?: string | null
    email?: string | null
    phone?: string | null
    gitHubId?: string | null
    googleId?: string | null
    isActive?: boolean
    isDeleted?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    walletMembers?: WalletMemberUncheckedCreateNestedManyWithoutUserInput
    passkeys?: PasskeyUncheckedCreateNestedManyWithoutUserInput
    redeemCodes?: RedemptionCodeUncheckedCreateNestedManyWithoutRedeemerInput
    createdApiKeys?: ApiKeyUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserCreateOrConnectWithoutWalletInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWalletInput, UserUncheckedCreateWithoutWalletInput>
  }

  export type WalletMemberCreateWithoutWalletInput = {
    creditLimit: Decimal | DecimalJsLike | number | string
    creditAvailable: Decimal | DecimalJsLike | number | string
    creditUsed?: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    joinedAt?: Date | string
    leftAt?: Date | string | null
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutWalletMembersInput
  }

  export type WalletMemberUncheckedCreateWithoutWalletInput = {
    id?: number
    userId: number
    creditLimit: Decimal | DecimalJsLike | number | string
    creditAvailable: Decimal | DecimalJsLike | number | string
    creditUsed?: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    joinedAt?: Date | string
    leftAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type WalletMemberCreateOrConnectWithoutWalletInput = {
    where: WalletMemberWhereUniqueInput
    create: XOR<WalletMemberCreateWithoutWalletInput, WalletMemberUncheckedCreateWithoutWalletInput>
  }

  export type WalletMemberCreateManyWalletInputEnvelope = {
    data: WalletMemberCreateManyWalletInput | WalletMemberCreateManyWalletInput[]
    skipDuplicates?: boolean
  }

  export type ApiKeyCreateWithoutWalletInput = {
    hashKey: string
    preview: string
    displayName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastUsedAt?: Date | string | null
    creator: UserCreateNestedOneWithoutCreatedApiKeysInput
  }

  export type ApiKeyUncheckedCreateWithoutWalletInput = {
    id?: number
    creatorId: number
    hashKey: string
    preview: string
    displayName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastUsedAt?: Date | string | null
  }

  export type ApiKeyCreateOrConnectWithoutWalletInput = {
    where: ApiKeyWhereUniqueInput
    create: XOR<ApiKeyCreateWithoutWalletInput, ApiKeyUncheckedCreateWithoutWalletInput>
  }

  export type ApiKeyCreateManyWalletInputEnvelope = {
    data: ApiKeyCreateManyWalletInput | ApiKeyCreateManyWalletInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutWalletInput = {
    update: XOR<UserUpdateWithoutWalletInput, UserUncheckedUpdateWithoutWalletInput>
    create: XOR<UserCreateWithoutWalletInput, UserUncheckedCreateWithoutWalletInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWalletInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWalletInput, UserUncheckedUpdateWithoutWalletInput>
  }

  export type UserUpdateWithoutWalletInput = {
    uid?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gitHubId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletMembers?: WalletMemberUpdateManyWithoutUserNestedInput
    passkeys?: PasskeyUpdateManyWithoutUserNestedInput
    redeemCodes?: RedemptionCodeUpdateManyWithoutRedeemerNestedInput
    createdApiKeys?: ApiKeyUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateWithoutWalletInput = {
    id?: IntFieldUpdateOperationsInput | number
    uid?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gitHubId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletMembers?: WalletMemberUncheckedUpdateManyWithoutUserNestedInput
    passkeys?: PasskeyUncheckedUpdateManyWithoutUserNestedInput
    redeemCodes?: RedemptionCodeUncheckedUpdateManyWithoutRedeemerNestedInput
    createdApiKeys?: ApiKeyUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type WalletMemberUpsertWithWhereUniqueWithoutWalletInput = {
    where: WalletMemberWhereUniqueInput
    update: XOR<WalletMemberUpdateWithoutWalletInput, WalletMemberUncheckedUpdateWithoutWalletInput>
    create: XOR<WalletMemberCreateWithoutWalletInput, WalletMemberUncheckedCreateWithoutWalletInput>
  }

  export type WalletMemberUpdateWithWhereUniqueWithoutWalletInput = {
    where: WalletMemberWhereUniqueInput
    data: XOR<WalletMemberUpdateWithoutWalletInput, WalletMemberUncheckedUpdateWithoutWalletInput>
  }

  export type WalletMemberUpdateManyWithWhereWithoutWalletInput = {
    where: WalletMemberScalarWhereInput
    data: XOR<WalletMemberUpdateManyMutationInput, WalletMemberUncheckedUpdateManyWithoutWalletInput>
  }

  export type ApiKeyUpsertWithWhereUniqueWithoutWalletInput = {
    where: ApiKeyWhereUniqueInput
    update: XOR<ApiKeyUpdateWithoutWalletInput, ApiKeyUncheckedUpdateWithoutWalletInput>
    create: XOR<ApiKeyCreateWithoutWalletInput, ApiKeyUncheckedCreateWithoutWalletInput>
  }

  export type ApiKeyUpdateWithWhereUniqueWithoutWalletInput = {
    where: ApiKeyWhereUniqueInput
    data: XOR<ApiKeyUpdateWithoutWalletInput, ApiKeyUncheckedUpdateWithoutWalletInput>
  }

  export type ApiKeyUpdateManyWithWhereWithoutWalletInput = {
    where: ApiKeyScalarWhereInput
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyWithoutWalletInput>
  }

  export type WalletCreateWithoutMembersInput = {
    uid?: string
    balance?: Decimal | DecimalJsLike | number | string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutWalletInput
    apiKeys?: ApiKeyCreateNestedManyWithoutWalletInput
  }

  export type WalletUncheckedCreateWithoutMembersInput = {
    id?: number
    uid?: string
    balance?: Decimal | DecimalJsLike | number | string
    version?: number
    ownerId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutWalletInput
  }

  export type WalletCreateOrConnectWithoutMembersInput = {
    where: WalletWhereUniqueInput
    create: XOR<WalletCreateWithoutMembersInput, WalletUncheckedCreateWithoutMembersInput>
  }

  export type UserCreateWithoutWalletMembersInput = {
    uid?: string
    displayName?: string | null
    avatar?: string | null
    email?: string | null
    phone?: string | null
    gitHubId?: string | null
    googleId?: string | null
    isActive?: boolean
    isDeleted?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    wallet?: WalletCreateNestedOneWithoutOwnerInput
    passkeys?: PasskeyCreateNestedManyWithoutUserInput
    redeemCodes?: RedemptionCodeCreateNestedManyWithoutRedeemerInput
    createdApiKeys?: ApiKeyCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateWithoutWalletMembersInput = {
    id?: number
    uid?: string
    displayName?: string | null
    avatar?: string | null
    email?: string | null
    phone?: string | null
    gitHubId?: string | null
    googleId?: string | null
    isActive?: boolean
    isDeleted?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    wallet?: WalletUncheckedCreateNestedOneWithoutOwnerInput
    passkeys?: PasskeyUncheckedCreateNestedManyWithoutUserInput
    redeemCodes?: RedemptionCodeUncheckedCreateNestedManyWithoutRedeemerInput
    createdApiKeys?: ApiKeyUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserCreateOrConnectWithoutWalletMembersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWalletMembersInput, UserUncheckedCreateWithoutWalletMembersInput>
  }

  export type WalletUpsertWithoutMembersInput = {
    update: XOR<WalletUpdateWithoutMembersInput, WalletUncheckedUpdateWithoutMembersInput>
    create: XOR<WalletCreateWithoutMembersInput, WalletUncheckedCreateWithoutMembersInput>
    where?: WalletWhereInput
  }

  export type WalletUpdateToOneWithWhereWithoutMembersInput = {
    where?: WalletWhereInput
    data: XOR<WalletUpdateWithoutMembersInput, WalletUncheckedUpdateWithoutMembersInput>
  }

  export type WalletUpdateWithoutMembersInput = {
    uid?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutWalletNestedInput
    apiKeys?: ApiKeyUpdateManyWithoutWalletNestedInput
  }

  export type WalletUncheckedUpdateWithoutMembersInput = {
    id?: IntFieldUpdateOperationsInput | number
    uid?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    version?: IntFieldUpdateOperationsInput | number
    ownerId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type UserUpsertWithoutWalletMembersInput = {
    update: XOR<UserUpdateWithoutWalletMembersInput, UserUncheckedUpdateWithoutWalletMembersInput>
    create: XOR<UserCreateWithoutWalletMembersInput, UserUncheckedCreateWithoutWalletMembersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWalletMembersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWalletMembersInput, UserUncheckedUpdateWithoutWalletMembersInput>
  }

  export type UserUpdateWithoutWalletMembersInput = {
    uid?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gitHubId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wallet?: WalletUpdateOneWithoutOwnerNestedInput
    passkeys?: PasskeyUpdateManyWithoutUserNestedInput
    redeemCodes?: RedemptionCodeUpdateManyWithoutRedeemerNestedInput
    createdApiKeys?: ApiKeyUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateWithoutWalletMembersInput = {
    id?: IntFieldUpdateOperationsInput | number
    uid?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gitHubId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wallet?: WalletUncheckedUpdateOneWithoutOwnerNestedInput
    passkeys?: PasskeyUncheckedUpdateManyWithoutUserNestedInput
    redeemCodes?: RedemptionCodeUncheckedUpdateManyWithoutRedeemerNestedInput
    createdApiKeys?: ApiKeyUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type WalletCreateWithoutApiKeysInput = {
    uid?: string
    balance?: Decimal | DecimalJsLike | number | string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutWalletInput
    members?: WalletMemberCreateNestedManyWithoutWalletInput
  }

  export type WalletUncheckedCreateWithoutApiKeysInput = {
    id?: number
    uid?: string
    balance?: Decimal | DecimalJsLike | number | string
    version?: number
    ownerId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WalletMemberUncheckedCreateNestedManyWithoutWalletInput
  }

  export type WalletCreateOrConnectWithoutApiKeysInput = {
    where: WalletWhereUniqueInput
    create: XOR<WalletCreateWithoutApiKeysInput, WalletUncheckedCreateWithoutApiKeysInput>
  }

  export type UserCreateWithoutCreatedApiKeysInput = {
    uid?: string
    displayName?: string | null
    avatar?: string | null
    email?: string | null
    phone?: string | null
    gitHubId?: string | null
    googleId?: string | null
    isActive?: boolean
    isDeleted?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    wallet?: WalletCreateNestedOneWithoutOwnerInput
    walletMembers?: WalletMemberCreateNestedManyWithoutUserInput
    passkeys?: PasskeyCreateNestedManyWithoutUserInput
    redeemCodes?: RedemptionCodeCreateNestedManyWithoutRedeemerInput
  }

  export type UserUncheckedCreateWithoutCreatedApiKeysInput = {
    id?: number
    uid?: string
    displayName?: string | null
    avatar?: string | null
    email?: string | null
    phone?: string | null
    gitHubId?: string | null
    googleId?: string | null
    isActive?: boolean
    isDeleted?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    wallet?: WalletUncheckedCreateNestedOneWithoutOwnerInput
    walletMembers?: WalletMemberUncheckedCreateNestedManyWithoutUserInput
    passkeys?: PasskeyUncheckedCreateNestedManyWithoutUserInput
    redeemCodes?: RedemptionCodeUncheckedCreateNestedManyWithoutRedeemerInput
  }

  export type UserCreateOrConnectWithoutCreatedApiKeysInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCreatedApiKeysInput, UserUncheckedCreateWithoutCreatedApiKeysInput>
  }

  export type WalletUpsertWithoutApiKeysInput = {
    update: XOR<WalletUpdateWithoutApiKeysInput, WalletUncheckedUpdateWithoutApiKeysInput>
    create: XOR<WalletCreateWithoutApiKeysInput, WalletUncheckedCreateWithoutApiKeysInput>
    where?: WalletWhereInput
  }

  export type WalletUpdateToOneWithWhereWithoutApiKeysInput = {
    where?: WalletWhereInput
    data: XOR<WalletUpdateWithoutApiKeysInput, WalletUncheckedUpdateWithoutApiKeysInput>
  }

  export type WalletUpdateWithoutApiKeysInput = {
    uid?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutWalletNestedInput
    members?: WalletMemberUpdateManyWithoutWalletNestedInput
  }

  export type WalletUncheckedUpdateWithoutApiKeysInput = {
    id?: IntFieldUpdateOperationsInput | number
    uid?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    version?: IntFieldUpdateOperationsInput | number
    ownerId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WalletMemberUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type UserUpsertWithoutCreatedApiKeysInput = {
    update: XOR<UserUpdateWithoutCreatedApiKeysInput, UserUncheckedUpdateWithoutCreatedApiKeysInput>
    create: XOR<UserCreateWithoutCreatedApiKeysInput, UserUncheckedCreateWithoutCreatedApiKeysInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCreatedApiKeysInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCreatedApiKeysInput, UserUncheckedUpdateWithoutCreatedApiKeysInput>
  }

  export type UserUpdateWithoutCreatedApiKeysInput = {
    uid?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gitHubId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wallet?: WalletUpdateOneWithoutOwnerNestedInput
    walletMembers?: WalletMemberUpdateManyWithoutUserNestedInput
    passkeys?: PasskeyUpdateManyWithoutUserNestedInput
    redeemCodes?: RedemptionCodeUpdateManyWithoutRedeemerNestedInput
  }

  export type UserUncheckedUpdateWithoutCreatedApiKeysInput = {
    id?: IntFieldUpdateOperationsInput | number
    uid?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gitHubId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wallet?: WalletUncheckedUpdateOneWithoutOwnerNestedInput
    walletMembers?: WalletMemberUncheckedUpdateManyWithoutUserNestedInput
    passkeys?: PasskeyUncheckedUpdateManyWithoutUserNestedInput
    redeemCodes?: RedemptionCodeUncheckedUpdateManyWithoutRedeemerNestedInput
  }

  export type UserCreateWithoutPasskeysInput = {
    uid?: string
    displayName?: string | null
    avatar?: string | null
    email?: string | null
    phone?: string | null
    gitHubId?: string | null
    googleId?: string | null
    isActive?: boolean
    isDeleted?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    wallet?: WalletCreateNestedOneWithoutOwnerInput
    walletMembers?: WalletMemberCreateNestedManyWithoutUserInput
    redeemCodes?: RedemptionCodeCreateNestedManyWithoutRedeemerInput
    createdApiKeys?: ApiKeyCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateWithoutPasskeysInput = {
    id?: number
    uid?: string
    displayName?: string | null
    avatar?: string | null
    email?: string | null
    phone?: string | null
    gitHubId?: string | null
    googleId?: string | null
    isActive?: boolean
    isDeleted?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    wallet?: WalletUncheckedCreateNestedOneWithoutOwnerInput
    walletMembers?: WalletMemberUncheckedCreateNestedManyWithoutUserInput
    redeemCodes?: RedemptionCodeUncheckedCreateNestedManyWithoutRedeemerInput
    createdApiKeys?: ApiKeyUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserCreateOrConnectWithoutPasskeysInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPasskeysInput, UserUncheckedCreateWithoutPasskeysInput>
  }

  export type UserUpsertWithoutPasskeysInput = {
    update: XOR<UserUpdateWithoutPasskeysInput, UserUncheckedUpdateWithoutPasskeysInput>
    create: XOR<UserCreateWithoutPasskeysInput, UserUncheckedCreateWithoutPasskeysInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPasskeysInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPasskeysInput, UserUncheckedUpdateWithoutPasskeysInput>
  }

  export type UserUpdateWithoutPasskeysInput = {
    uid?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gitHubId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wallet?: WalletUpdateOneWithoutOwnerNestedInput
    walletMembers?: WalletMemberUpdateManyWithoutUserNestedInput
    redeemCodes?: RedemptionCodeUpdateManyWithoutRedeemerNestedInput
    createdApiKeys?: ApiKeyUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateWithoutPasskeysInput = {
    id?: IntFieldUpdateOperationsInput | number
    uid?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gitHubId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wallet?: WalletUncheckedUpdateOneWithoutOwnerNestedInput
    walletMembers?: WalletMemberUncheckedUpdateManyWithoutUserNestedInput
    redeemCodes?: RedemptionCodeUncheckedUpdateManyWithoutRedeemerNestedInput
    createdApiKeys?: ApiKeyUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type UserCreateWithoutRedeemCodesInput = {
    uid?: string
    displayName?: string | null
    avatar?: string | null
    email?: string | null
    phone?: string | null
    gitHubId?: string | null
    googleId?: string | null
    isActive?: boolean
    isDeleted?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    wallet?: WalletCreateNestedOneWithoutOwnerInput
    walletMembers?: WalletMemberCreateNestedManyWithoutUserInput
    passkeys?: PasskeyCreateNestedManyWithoutUserInput
    createdApiKeys?: ApiKeyCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateWithoutRedeemCodesInput = {
    id?: number
    uid?: string
    displayName?: string | null
    avatar?: string | null
    email?: string | null
    phone?: string | null
    gitHubId?: string | null
    googleId?: string | null
    isActive?: boolean
    isDeleted?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    wallet?: WalletUncheckedCreateNestedOneWithoutOwnerInput
    walletMembers?: WalletMemberUncheckedCreateNestedManyWithoutUserInput
    passkeys?: PasskeyUncheckedCreateNestedManyWithoutUserInput
    createdApiKeys?: ApiKeyUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserCreateOrConnectWithoutRedeemCodesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRedeemCodesInput, UserUncheckedCreateWithoutRedeemCodesInput>
  }

  export type UserUpsertWithoutRedeemCodesInput = {
    update: XOR<UserUpdateWithoutRedeemCodesInput, UserUncheckedUpdateWithoutRedeemCodesInput>
    create: XOR<UserCreateWithoutRedeemCodesInput, UserUncheckedCreateWithoutRedeemCodesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRedeemCodesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRedeemCodesInput, UserUncheckedUpdateWithoutRedeemCodesInput>
  }

  export type UserUpdateWithoutRedeemCodesInput = {
    uid?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gitHubId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wallet?: WalletUpdateOneWithoutOwnerNestedInput
    walletMembers?: WalletMemberUpdateManyWithoutUserNestedInput
    passkeys?: PasskeyUpdateManyWithoutUserNestedInput
    createdApiKeys?: ApiKeyUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateWithoutRedeemCodesInput = {
    id?: IntFieldUpdateOperationsInput | number
    uid?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gitHubId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wallet?: WalletUncheckedUpdateOneWithoutOwnerNestedInput
    walletMembers?: WalletMemberUncheckedUpdateManyWithoutUserNestedInput
    passkeys?: PasskeyUncheckedUpdateManyWithoutUserNestedInput
    createdApiKeys?: ApiKeyUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type WalletMemberCreateManyUserInput = {
    id?: number
    walletId: number
    creditLimit: Decimal | DecimalJsLike | number | string
    creditAvailable: Decimal | DecimalJsLike | number | string
    creditUsed?: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    joinedAt?: Date | string
    leftAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type PasskeyCreateManyUserInput = {
    id: string
    publicKey: Uint8Array
    webAuthnUserID: string
    counter?: bigint | number
    displayName?: string
    transports?: string | null
    deviceType?: string
    backedUp?: boolean
    isDeleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastUsedAt?: Date | string | null
  }

  export type RedemptionCodeCreateManyRedeemerInput = {
    id?: number
    code: string
    amount: number
    remark?: string
    createdAt?: Date | string
    expiredAt?: Date | string
    redeemedAt?: Date | string | null
  }

  export type ApiKeyCreateManyCreatorInput = {
    id?: number
    walletId: number
    hashKey: string
    preview: string
    displayName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastUsedAt?: Date | string | null
  }

  export type WalletMemberUpdateWithoutUserInput = {
    creditLimit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditAvailable?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditUsed?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wallet?: WalletUpdateOneRequiredWithoutMembersNestedInput
  }

  export type WalletMemberUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    walletId?: IntFieldUpdateOperationsInput | number
    creditLimit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditAvailable?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditUsed?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletMemberUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    walletId?: IntFieldUpdateOperationsInput | number
    creditLimit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditAvailable?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditUsed?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasskeyUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicKey?: BytesFieldUpdateOperationsInput | Uint8Array
    webAuthnUserID?: StringFieldUpdateOperationsInput | string
    counter?: BigIntFieldUpdateOperationsInput | bigint | number
    displayName?: StringFieldUpdateOperationsInput | string
    transports?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: StringFieldUpdateOperationsInput | string
    backedUp?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PasskeyUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicKey?: BytesFieldUpdateOperationsInput | Uint8Array
    webAuthnUserID?: StringFieldUpdateOperationsInput | string
    counter?: BigIntFieldUpdateOperationsInput | bigint | number
    displayName?: StringFieldUpdateOperationsInput | string
    transports?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: StringFieldUpdateOperationsInput | string
    backedUp?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PasskeyUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    publicKey?: BytesFieldUpdateOperationsInput | Uint8Array
    webAuthnUserID?: StringFieldUpdateOperationsInput | string
    counter?: BigIntFieldUpdateOperationsInput | bigint | number
    displayName?: StringFieldUpdateOperationsInput | string
    transports?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: StringFieldUpdateOperationsInput | string
    backedUp?: BoolFieldUpdateOperationsInput | boolean
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RedemptionCodeUpdateWithoutRedeemerInput = {
    code?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    remark?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    redeemedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RedemptionCodeUncheckedUpdateWithoutRedeemerInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    remark?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    redeemedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RedemptionCodeUncheckedUpdateManyWithoutRedeemerInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    remark?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    redeemedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ApiKeyUpdateWithoutCreatorInput = {
    hashKey?: StringFieldUpdateOperationsInput | string
    preview?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wallet?: WalletUpdateOneRequiredWithoutApiKeysNestedInput
  }

  export type ApiKeyUncheckedUpdateWithoutCreatorInput = {
    id?: IntFieldUpdateOperationsInput | number
    walletId?: IntFieldUpdateOperationsInput | number
    hashKey?: StringFieldUpdateOperationsInput | string
    preview?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ApiKeyUncheckedUpdateManyWithoutCreatorInput = {
    id?: IntFieldUpdateOperationsInput | number
    walletId?: IntFieldUpdateOperationsInput | number
    hashKey?: StringFieldUpdateOperationsInput | string
    preview?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WalletMemberCreateManyWalletInput = {
    id?: number
    userId: number
    creditLimit: Decimal | DecimalJsLike | number | string
    creditAvailable: Decimal | DecimalJsLike | number | string
    creditUsed?: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    joinedAt?: Date | string
    leftAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type ApiKeyCreateManyWalletInput = {
    id?: number
    creatorId: number
    hashKey: string
    preview: string
    displayName: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastUsedAt?: Date | string | null
  }

  export type WalletMemberUpdateWithoutWalletInput = {
    creditLimit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditAvailable?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditUsed?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWalletMembersNestedInput
  }

  export type WalletMemberUncheckedUpdateWithoutWalletInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    creditLimit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditAvailable?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditUsed?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletMemberUncheckedUpdateManyWithoutWalletInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    creditLimit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditAvailable?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creditUsed?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyUpdateWithoutWalletInput = {
    hashKey?: StringFieldUpdateOperationsInput | string
    preview?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    creator?: UserUpdateOneRequiredWithoutCreatedApiKeysNestedInput
  }

  export type ApiKeyUncheckedUpdateWithoutWalletInput = {
    id?: IntFieldUpdateOperationsInput | number
    creatorId?: IntFieldUpdateOperationsInput | number
    hashKey?: StringFieldUpdateOperationsInput | string
    preview?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ApiKeyUncheckedUpdateManyWithoutWalletInput = {
    id?: IntFieldUpdateOperationsInput | number
    creatorId?: IntFieldUpdateOperationsInput | number
    hashKey?: StringFieldUpdateOperationsInput | string
    preview?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}