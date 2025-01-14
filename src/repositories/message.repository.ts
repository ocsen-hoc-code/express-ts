import { injectable } from 'inversify';
import MessageModel from '../models/message';

@injectable()
export class MessageRepository {
  // Create a new message
  async create(data: any) {
    return await MessageModel.create({ data });
  }

  // Retrieve all messages
  async findAll() {
    return await MessageModel.findAll();
  }

  // Retrieve a message by ID
  async findById(id: string) {
    return await MessageModel.findByPk(id);
  }

  // Update a message by ID
  async updateById(id: string, newData: any) {
    const message = await MessageModel.findByPk(id);
    if (!message) {
      throw new Error(`Message with ID ${id} not found.`);
    }
    return await message.update({ data: newData });
  }

  // Delete a message by ID
  async deleteById(id: string) {
    const message = await MessageModel.findByPk(id);
    if (!message) {
      throw new Error(`Message with ID ${id} not found.`);
    }
    await message.destroy();
    return { success: true, message: `Message with ID ${id} has been deleted.` };
  }
}
