import { inject, injectable } from 'inversify';
import TYPES from '../types';
import { MessageRepository } from '../repositories/message.repository';

@injectable()
export class MessageService {
  constructor(
    @inject(TYPES.MessageRepository) private messageRepository: MessageRepository
  ) {}

  // Create a new message
  async createMessage(data: any) {
    return await this.messageRepository.create(data);
  }

  // Retrieve all messages
  async getAllMessages() {
    return await this.messageRepository.findAll();
  }

  // Retrieve a message by ID
  async getMessageById(id: string) {
    return await this.messageRepository.findById(id);
  }

  // Update a message by ID
  async updateMessageById(id: string, newData: any) {
    return await this.messageRepository.updateById(id, newData);
  }

  // Delete a message by ID
  async deleteMessageById(id: string) {
    return await this.messageRepository.deleteById(id);
  }
}
