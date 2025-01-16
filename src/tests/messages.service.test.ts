import { MessagesService } from "../services/messages.service";
import { MessagesRepository } from "../repositories/messages.repository";
import { PgConnection } from "../config/pgConnection";

jest.mock("../config/pgConnection");
jest.mock("../repositories/messages.repository");

describe("MessagesService", () => {
  const mockPgConnection = new PgConnection();
  let messagesService: MessagesService;
  let mockMessagesRepository: jest.Mocked<MessagesRepository>;

  beforeEach(() => {
    mockMessagesRepository =
      new MessagesRepository(mockPgConnection) as jest.Mocked<MessagesRepository>;
    messagesService = new MessagesService(mockMessagesRepository);
    jest.clearAllMocks();
  });

  it("should save a message", async () => {
    mockMessagesRepository.saveMessage.mockResolvedValue();

    await messagesService.saveMessage("123", "Hello World!");

    expect(mockMessagesRepository.saveMessage).toHaveBeenCalledWith(
      "123",
      "Hello World!"
    );
  });
});
