import SQS from "aws-sdk/clients/sqs";
import { MessagesService } from "../services/messages.service";
import TYPES from "../types";
import container from "../config/inversify.config";

const messagesService = container.get<MessagesService>(TYPES.MessagesService);

export const sqsMessageHandler = async (message: SQS.Message) => {
    if (!message.Body) {
        return;
    }
    const body = JSON.parse(message.Body);
    await messagesService.saveMessage(body.id, body.content);
    console.log('Received message from SQS:', message.Body);
};