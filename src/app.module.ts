import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CassandraService } from './Cassandra/cassandra.service';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/event.module';
import { CassandraModule } from './Cassandra/cassandra.module';

@Module({
  imports: [UsersModule, EventsModule, CassandraModule],
  controllers: [AppController],
  providers: [AppService, CassandraService],
  exports: [CassandraService],
})
export class AppModule {}
