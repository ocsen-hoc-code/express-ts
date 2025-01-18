const TYPES = {
    SQSService: Symbol.for('SQSService'),
    Config: Symbol.for('Config'),
    PgConnectionConfig: Symbol.for('Config'),
    PgConnection: Symbol.for('ConPgConnectionfig'),
    MessagesRepository: Symbol.for('MessagesRepository'),
    MessagesService: Symbol.for('MessagesService'),
    UserRepository: Symbol.for("UserRepository"),
    UserService: Symbol.for("UserService"),
};

export default TYPES;
