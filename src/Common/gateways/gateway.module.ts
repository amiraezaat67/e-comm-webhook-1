
import { Module } from '@nestjs/common';
import { RealTimeEventsGateway } from '.'

@Module({
    providers: [RealTimeEventsGateway],
    exports: [RealTimeEventsGateway]
})
export class EventsModule { }
