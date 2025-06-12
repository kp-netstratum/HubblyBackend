import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CassandraService } from '../Cassandra/cassandra.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CassandraService],
})
export class UsersModule {}
