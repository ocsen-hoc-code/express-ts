import { injectable } from "inversify";
import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";

/**
 * Injectable class for managing PostgreSQL connection pool.
 */
@injectable()
export class PgConnection {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER || "",
      host: process.env.DB_HOST || "",
      database: process.env.DB_NAME || "",
      password: process.env.DB_PASSWORD || "",
      port: parseInt(process.env.DB_PORT || "5432", 10),
    });

    console.log("PostgreSQL connection pool initialized.");
  }

  /**
   * Executes a query on the PostgreSQL database.
   * @param text The SQL query string.
   * @param params Optional query parameters.
   * @returns Query result.
   */
  public async query<T extends QueryResultRow>(text: string, params?: any[]): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }

  /**
   * Retrieves a client from the connection pool.
   * Useful for transactions or multiple queries in a single session.
   * @returns A PoolClient instance.
   */
  public async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  /**
   * Gracefully closes the connection pool.
   */
  public async close(): Promise<void> {
    await this.pool.end();
    console.log("PostgreSQL connection pool closed.");
  }
}
