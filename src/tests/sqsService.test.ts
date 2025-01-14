import { SQSService } from '../services/sqs.service';
import { SQS } from 'aws-sdk';

jest.mock('aws-sdk', () => {
  const sendMessageMock = jest.fn();
  const receiveMessageMock = jest.fn();
  const deleteMessageMock = jest.fn();

  return {
    SQS: jest.fn(() => ({
      sendMessage: sendMessageMock,
      receiveMessage: receiveMessageMock,
      deleteMessage: deleteMessageMock,
    })),
    __mocks__: { sendMessageMock, receiveMessageMock, deleteMessageMock },
  };
});

// Import the mock functions
const { sendMessageMock, receiveMessageMock, deleteMessageMock } = jest.requireMock('aws-sdk').__mocks__;

describe('SQSService', () => {
  let sqsService: SQSService;

  beforeEach(() => {
    sqsService = new SQSService('us-east-1', 'mockAccessKey', 'mockSecretKey');
    jest.clearAllMocks();
  });

  describe('publishMessage', () => {
    it('should publish a message to SQS and return the MessageId', async () => {
      const params = {
        QueueUrl: 'https://sqs.example.com/12345/queue',
        MessageBody: 'Test Message',
      };
      const response = { MessageId: '12345' };

      sendMessageMock.mockReturnValueOnce({
        promise: jest.fn().mockResolvedValueOnce(response),
      });

      const result = await sqsService.publishMessage(params);

      expect(sendMessageMock).toHaveBeenCalledWith(params);
      expect(result).toBe('12345');
    });

    it('should throw an error if publishing a message fails', async () => {
      const params = {
        QueueUrl: 'https://sqs.example.com/12345/queue',
        MessageBody: 'Test Message',
      };

      sendMessageMock.mockReturnValueOnce({
        promise: jest.fn().mockRejectedValueOnce(new Error('SQS Error')),
      });

      await expect(sqsService.publishMessage(params)).rejects.toThrow('Failed to publish message: SQS Error');
    });
  });

  describe('receiveMessages', () => {
    it('should receive messages from SQS and return them', async () => {
      const queueUrl = 'https://sqs.example.com/12345/queue';
      const messages = [
        { MessageId: '1', Body: 'Message 1' },
        { MessageId: '2', Body: 'Message 2' },
      ];

      receiveMessageMock.mockReturnValueOnce({
        promise: jest.fn().mockResolvedValueOnce({ Messages: messages }),
      });

      const result = await sqsService.receiveMessages(queueUrl);

      expect(receiveMessageMock).toHaveBeenCalledWith({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 10,
      });
      expect(result).toEqual(messages);
    });

    it('should return an empty array if no messages are received', async () => {
      const queueUrl = 'https://sqs.example.com/12345/queue';

      receiveMessageMock.mockReturnValueOnce({
        promise: jest.fn().mockResolvedValueOnce({}),
      });

      const result = await sqsService.receiveMessages(queueUrl);

      expect(receiveMessageMock).toHaveBeenCalledWith({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 10,
      });
      expect(result).toEqual([]);
    });
  });

  describe('deleteMessage', () => {
    it('should delete a message from SQS', async () => {
      const queueUrl = 'https://sqs.example.com/12345/queue';
      const receiptHandle = 'abc123';

      deleteMessageMock.mockReturnValueOnce({
        promise: jest.fn().mockResolvedValueOnce({}),
      });

      await sqsService.deleteMessage(queueUrl, receiptHandle);

      expect(deleteMessageMock).toHaveBeenCalledWith({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      });
    });

    it('should throw an error if deleting a message fails', async () => {
      const queueUrl = 'https://sqs.example.com/12345/queue';
      const receiptHandle = 'abc123';

      deleteMessageMock.mockReturnValueOnce({
        promise: jest.fn().mockRejectedValueOnce(new Error('SQS Error')),
      });

      await expect(sqsService.deleteMessage(queueUrl, receiptHandle)).rejects.toThrow('Failed to delete message: SQS Error');
    });
  });
});
