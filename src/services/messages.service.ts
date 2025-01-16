import { injectable, inject } from "inversify";
import { MessagesRepository } from "../repositories/messages.repository";
import TYPES from "../types";

/**
 * Service for managing messages and business logic.
 */
@injectable()
export class MessagesService {
  private messagesRepository: MessagesRepository;

  constructor(
    @inject(TYPES.MessagesRepository) messagesRepository: MessagesRepository
  ) {
    this.messagesRepository = messagesRepository;
  }

  /**
   * Save a new message to the database.
   * @param id The ID of the message.
   * @param content The content of the message.
   */
  public async saveMessage(id: string, content: string): Promise<void> {
    await this.messagesRepository.saveMessage(id, content);
  }

  /**
   * Retrieve all messages.
   * @returns An array of messages.
   */
  public async getAllMessages(): Promise<{ id: string; content: string }[]> {
    return this.messagesRepository.getAllMessages();
  }
}
