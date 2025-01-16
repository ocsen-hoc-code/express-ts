import { injectable, inject } from "inversify";
import { PgConnection } from "../config/pgConnection";
import TYPES from "../types";

/**
 * Repository for managing message-related database operations.
 */
@injectable()
export class MessagesRepository {
  private pgConnection: PgConnection;

  constructor(@inject(TYPES.PgConnection) pgConnection: PgConnection) {
    this.pgConnection = pgConnection;
  }

  /**
   * Inserts a new message into the database.
   * @param id The ID of the message.
   * @param content The content of the message.
   */
  public async saveMessage(id: string, content: string): Promise<void> {
    const query = `INSERT INTO messages (id, content, created_at) VALUES ($1, $2, NOW())`;
    await this.pgConnection.query(query, [id, content]);
  }

  /**
   * Retrieves all messages from the database.
   * @returns An array of messages.
   */
  public async getAllMessages(): Promise<{ id: string; content: string }[]> {
    const query = `SELECT id, content FROM messages ORDER BY created_at DESC`;
    const result = await this.pgConnection.query<{
      id: string;
      content: string;
    }>(query);
    return result.rows;
  }
}
