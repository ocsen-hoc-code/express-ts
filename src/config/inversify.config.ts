import { Container } from 'inversify';
import TYPES from '../types';
import { SQSService } from '../services/sqs.service';
import config from './config';
import { PgConnection } from './pgConnection';
import { MessagesRepository } from '../repositories/messages.repository';
import { MessagesService } from '../services/messages.service';

const container = new Container();

// Bind Config
container.bind<typeof config>(TYPES.Config).toConstantValue(config);

// Bind SQSService
container.bind<SQSService>(TYPES.SQSService).toDynamicValue(() => {
    return new SQSService(
        config.aws.region,
        config.aws.accessKeyId,
        config.aws.secretAccessKey,
        config.aws.sqsEndpoint
    );
}).inSingletonScope();

// Bind PgConnection
container.bind<PgConnection>(TYPES.PgConnection).to(PgConnection).inSingletonScope();

// Bind MessagesRepository
container.bind<MessagesRepository>(TYPES.MessagesRepository).to(MessagesRepository).inSingletonScope();

// Bind MessagesService
container.bind<MessagesService>(TYPES.MessagesService).to(MessagesService).inSingletonScope();

export default container;
