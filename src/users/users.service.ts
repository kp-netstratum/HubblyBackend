import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CassandraService } from '../Cassandra/cassandra.service';

@Injectable()
export class UsersService {
  constructor(private readonly cassandra: CassandraService) {}

  async createUser(username: string, email: string) {
    console.log('Creating user:', username, email);
    const client = this.cassandra.getClient();
    const id = uuidv4();
    const createdAt = new Date();

    const query =
      'INSERT INTO users (id, username, email, created_at) VALUES (?, ?, ?, ?)';
    await client.execute(query, [id, username, email, createdAt], {
      prepare: true,
    });

    return { id, username, email, createdAt };
  }

  async getAllUsers() {
    const client = this.cassandra.getClient();
    const query = 'SELECT * FROM users';
    const result = await client.execute(query);

    return result.rows.map((row) => ({
      id: row.id,
      username: row.username,
      email: row.email,
      createdAt: row.created_at,
    }));
  }

  async getUserById(id: string) {
    console.log('Fetching user with id:', id);
    const client = this.cassandra.getClient();
    const query = 'SELECT * FROM users WHERE id = ?';
    const result = await client.execute(query, [id], { prepare: true });

    if (result.rowLength === 0) {
      throw new Error(`User with id ${id} not found`);
    }

    const row = result.first();
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      createdAt: row.created_at,
    };
  }

  async deleteUser(id: string) {
    const client = this.cassandra.getClient();
    const query = 'DELETE FROM users WHERE id = ?';
    await client.execute(query, [id], { prepare: true });

    return { message: `User with id ${id} deleted successfully` };
  }

  async updateUser(id: string, username?: string, email?: string) {
    const client = this.cassandra.getClient();
    const updates: string[] = [];
    const values: any[] = [];

    if (username) {
      updates.push('username = ?');
      values.push(username);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    values.push(id); // Add id **after** update values

    await client.execute(query, values, { prepare: true });

    return { message: `User with id ${id} updated successfully` };
  }
}
