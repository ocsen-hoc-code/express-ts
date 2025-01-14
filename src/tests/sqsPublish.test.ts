import request from 'supertest';
import express from 'express';
import router from '../routers/sqsRouter';
import { SQS } from 'aws-sdk';

// Mock aws-sdk
jest.mock('aws-sdk', () => {
  const sendMessageMock = jest.fn();
  return {
    SQS: jest.fn(() => ({
      sendMessage: sendMessageMock,
    })),
    __mocks__: { sendMessageMock },
  };
});

// Import mock functions
const { sendMessageMock } = jest.requireMock('aws-sdk').__mocks__;

// Setup Express app
const app = express();
app.use(express.json());
app.use('/api/sqs', router);

describe('POST /api/sqs/publish', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SQS_QUEUE_URL = 'https://sqs.example.com/queue';
  });

  it('should return 200 and messageId if message is published successfully', async () => {
    const mockResponse = { MessageId: '12345' };

    sendMessageMock.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const response = await request(app)
      .post('/api/sqs/publish')
      .send({
        message: {
          id: '123',
          content: 'hello aws!!! (.)',
        },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      messageId: '12345',
      message: 'Message published successfully!',
    });
  });

  it('should return 500 if publishMessage fails', async () => {
    sendMessageMock.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValueOnce(new Error('SQS Error')),
    });

    const response = await request(app)
      .post('/api/sqs/publish')
      .send({
        message: {
          id: '123',
          content: 'hello aws!!! (.)',
        },
      });

    // expect(sendMessageMock).toHaveBeenCalledWith({
    //   MessageBody: JSON.stringify({
    //     id: '123',
    //     content: 'hello aws!!! (.)',
    //   }),
    //   QueueUrl: 'https://sqs.example.com/queue',
    //   MessageGroupId: 'ocsenGroup',
    //   MessageDeduplicationId: expect.any(String),
    // });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Failed to publish message',
      details: 'Failed to publish message: SQS Error',
    });
  });

  it('should return 400 if validation fails', async () => {
    const response = await request(app)
      .post('/api/sqs/publish')
      .send({}); // Missing "message"

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].msg).toBe('Message must be an object');
  });

  it('should return 500 if queueUrl is missing from environment variables', async () => {
    delete process.env.SQS_QUEUE_URL;

    const response = await request(app)
      .post('/api/sqs/publish')
      .send({
        message: {
          id: '123',
          content: 'hello aws!!! (.)',
        },
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to publish message');
  });
});
