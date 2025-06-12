import { Module } from '@nestjs/common';
import { EventsService } from './event.service';
import { EventsController } from './event.controller';
import { CassandraService } from '../Cassandra/cassandra.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService, CassandraService],
})
export class EventsModule {}
