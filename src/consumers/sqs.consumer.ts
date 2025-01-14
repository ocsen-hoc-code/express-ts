import { SQSService } from '../services/sqs.service';
import { SQS } from 'aws-sdk';

export class SQSConsumer {
    private sqsService: SQSService;
    private isRunning: boolean;

    constructor(sqsService: SQSService) {
        this.sqsService = sqsService;
        this.isRunning = false;
    }

    /**
     * Start consuming messages from the SQS queue
     * @param queueUrl The URL of the SQS queue
     * @param handler A function to process each message
     */
    async start(queueUrl: string, handler: (message: SQS.Message) => Promise<void>): Promise<void> {
        this.isRunning = true;
        console.log(`SQS Consumer started for queue: ${queueUrl}`);

        while (this.isRunning) {
            try {
                // Receive messages from the queue
                const messages = await this.sqsService.receiveMessages(queueUrl);

                // Process each message
                for (const message of messages) {
                    try {
                        if (message.Body) {
                            console.log('Processing message:', message.Body);
                            await handler(message);

                            // Delete the message after successful processing
                            if (message.ReceiptHandle) {
                                await this.sqsService.deleteMessage(queueUrl, message.ReceiptHandle);
                            }
                        }
                    } catch (err) {
                        console.log('Error processing message:', err);
                    }
                }
            } catch (err) {
                console.log('Error receiving messages:', err);
                await new Promise((resolve) => setTimeout(resolve, 5000)); // Retry after delay
            }
        }
    }

    /**
     * Stop consuming messages
     */
    stop(): void {
        this.isRunning = false;
        console.log('SQS Consumer stopped.');
    }
}
