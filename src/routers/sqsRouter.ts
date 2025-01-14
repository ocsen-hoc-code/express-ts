import { Router, Request, Response } from 'express';
import container from '../config/inversify.config';
import { SQSService } from '../services/sqs.service';
import TYPES from '../types';
import { validatePublish } from '../validators/publishValidator';
import { validationResult } from 'express-validator';

const router = Router();
const queueUrl =  process.env.SQS_QUEUE_URL;

const sqsService = container.get<SQSService>(TYPES.SQSService);
const messageGroupId =  'ocsenGroup';
const messageDeduplicationId =  'ocsenDeduplication';

// POST /api/sqs/publish
router.post('/publish', validatePublish, async (req: Request, res: Response): Promise<void> => {

    const errors = validationResult(req);

    // Validate the message body
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { message } = req.body;

    try {
        // Publish the message to SQS
        const params: any = {
            MessageBody: JSON.stringify(message),
            QueueUrl: queueUrl,
            MessageGroupId: messageGroupId,
            MessageDeduplicationId: Date.now().toString(),
        };

        const messageId = await sqsService.publishMessage(params);
        if (!messageId) {
            res.status(500).json({ error: 'Failed to publish message' });
            return;
        }
        res.status(200).json({
            messageId: messageId,
            message: 'Message published successfully!',
        });
    } catch (error: any) {
        console.error("Error in /publish route:", error.message);
        res.status(500).json({
          error: "Failed to publish message",
          details: error.message,
        });
    }
});

export default router;
