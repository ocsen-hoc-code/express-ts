import SQS from "aws-sdk/clients/sqs";

export const sqsMessageHandler = async (message: SQS.Message) => {
    console.log('Received message from SQS:', message.Body);
};