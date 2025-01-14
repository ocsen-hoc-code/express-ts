import { SQS } from 'aws-sdk';
import { injectable } from 'inversify';

@injectable()
export class SQSService {
    private sqs: SQS;

    constructor(region: string, accessKeyId: string, secretAccessKey: string, endpoint?: string) {
        this.sqs = new SQS({
            region,
            accessKeyId,
            secretAccessKey,
            endpoint,
        });
        console.log('SQSService instance created.');
    }

    /**
     * Publish a message to the SQS queue
     * @param params - SQS SendMessageRequest
     * @returns The MessageId of the published message
     */
    async publishMessage(params: SQS.Types.SendMessageRequest): Promise<string | undefined> {
        try {
            const result = await this.sqs.sendMessage(params).promise();
            console.log('Message published to SQS:', result.MessageId);
            return result.MessageId;
        } catch (error: any) {
            console.error(`Error publishing message to SQS [${error.code}]:`, error.message);
            throw new Error(`Failed to publish message: ${error.message}`);
        }
    }

    /**
     * Receive messages from the SQS queue
     * @param queueUrl - The URL of the SQS queue
     * @param maxMessages - The maximum number of messages to receive (default: 10)
     * @param waitTimeSeconds - The long-polling wait time (default: 10 seconds)
     * @returns An array of SQS messages
     */
    async receiveMessages(queueUrl: string, maxMessages = 10, waitTimeSeconds = 10): Promise<SQS.Message[]> {
        try {
            const params: SQS.Types.ReceiveMessageRequest = {
                QueueUrl: queueUrl,
                MaxNumberOfMessages: maxMessages,
                WaitTimeSeconds: waitTimeSeconds,
            };

            const result = await this.sqs.receiveMessage(params).promise();
            if (!result.Messages || result.Messages.length === 0) {
                // console.log('No messages available in the queue.');
                return [];
            }

            console.log(`Received ${result.Messages.length} messages from SQS.`);
            return result.Messages;
        } catch (error: any) {
            console.error(`Error receiving messages from SQS [${error.code}]:`, error.message);
            throw new Error(`Failed to receive messages: ${error.message}`);
        }
    }

    /**
     * Delete a message from the SQS queue
     * @param queueUrl - The URL of the SQS queue
     * @param receiptHandle - The receipt handle of the message to delete
     */
    async deleteMessage(queueUrl: string, receiptHandle: string): Promise<void> {
        try {
            const params: SQS.Types.DeleteMessageRequest = {
                QueueUrl: queueUrl,
                ReceiptHandle: receiptHandle,
            };

            await this.sqs.deleteMessage(params).promise();
            console.log('Message deleted from SQS:', receiptHandle);
        } catch (error: any) {
            console.error(`Error deleting message from SQS [${error.code}]:`, error.message);
            throw new Error(`Failed to delete message: ${error.message}`);
        }
    }
}
