import dotenv from "dotenv";

dotenv.config();

const config = {
  aws: {
    region: process.env.AWS_REGION || "",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    sqsEndpoint: process.env.SQS_ENDPOINT,
    sqsQueueUrls: {
      ocsenSQS: process.env.SQS_QUEUE_URL,
    },
  },
};

export default config;
