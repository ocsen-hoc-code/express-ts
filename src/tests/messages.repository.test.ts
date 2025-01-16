import { MessagesRepository } from "../repositories/messages.repository";
import { PgConnection } from "../config/pgConnection";

jest.mock("../config/pgConnection");

describe("MessagesRepository", () => {
  let messagesRepository: MessagesRepository;
  const mockPgConnection = new PgConnection();

  beforeEach(() => {
    messagesRepository = new MessagesRepository(mockPgConnection);
    jest.clearAllMocks();
  });

  it("should save a message", async () => {
    jest.spyOn(mockPgConnection, "query").mockResolvedValue({} as any);

    await messagesRepository.saveMessage("123", "Hello World!");

    expect(mockPgConnection.query).toHaveBeenCalledWith(
      `INSERT INTO messages (id, content, created_at) VALUES ($1, $2, NOW())`,
      ["123", "Hello World!"]
    );
  });
});
