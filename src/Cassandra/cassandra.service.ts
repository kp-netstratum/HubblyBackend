// src/cassandra/cassandra.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'cassandra-driver';

@Injectable()
export class CassandraService implements OnModuleInit {
  private client: Client;

  async onModuleInit() {
    this.client = new Client({
      contactPoints: ['127.0.0.1'],
      localDataCenter: 'datacenter1',
      keyspace: 'hubbly',
    });

    await this.client.connect();
    console.log('✅ Connected to Cassandra');
  }

  getClient(): Client {
    return this.client;
  }
}
