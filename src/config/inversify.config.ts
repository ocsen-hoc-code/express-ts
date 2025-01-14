import { Container } from 'inversify';
import TYPES from '../types';
import { SQSService } from '../services/sqs.service';
import config from './config';

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

export default container;
