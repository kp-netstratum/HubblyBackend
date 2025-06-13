// src/cassandra/cassandra.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'cassandra-driver';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class CassandraService implements OnModuleInit {
  private client: Client;

  async onModuleInit() {
    this.client = new Client({
      cloud: {
        secureConnectBundle: path.join(__dirname, '../../secure-connect-test.zip'),
      },
      credentials: {
        username: process.env.ASTRA_DB_USERNAME as string,
        password: process.env.ASTRA_DB_PASSWORD as string,
      },
      keyspace: 'test', // ✅ Ensure this matches the keyspace in Astra dashboard
    });

    await this.client.connect();
    console.log('✅ Connected to Cassandra');

    // Create tables separately
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS events (
        id uuid PRIMARY KEY,
        created_by uuid,
        description text,
        end_datetime text,
        name text,
        start_datetime text
      )
    `);

    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY,
        created_at timestamp,
        email text,
        username text
      )
    `);
  }

  getClient(): Client {
    return this.client;
  }
}
