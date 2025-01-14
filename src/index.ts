import express, { Express, Request, Response } from "express";
import { config } from "dotenv";
import sqsRouter from "./routers/sqsRouter";
import { sqsMessageHandler } from "./handlers/sqs.message.handler";
import { SQSConsumer } from "./consumers/sqs.consumer";
import container from './config/inversify.config';
import { SQSService } from "./services/sqs.service";
import TYPES from "./types";
import testRouter from "./routers/testRouter";

config();
const PORT = process.env.PORT || 3000;
const app: Express = express();
const sqsService = container.get<SQSService>(TYPES.SQSService);
// Initialize SQS Consumer
const consumer = new SQSConsumer(sqsService);
app.use(express.json());

app.use("/", testRouter);
app.use("/api/sqs", sqsRouter);

// Start consuming messages from the SQS queue
consumer
  .start(process.env.SQS_QUEUE_URL || "", sqsMessageHandler)
  .then(() => {
    console.log("SQS Consumer started.");
  })
  .catch((err) => {
    console.log("Error starting SQS Consumer:", err);
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

