import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CassandraService } from '../Cassandra/cassandra.service';

@Injectable()
export class EventsService {
  constructor(private readonly cassandra: CassandraService) {}

  async createEvent(
    name: string,
    description: string,
    start_dateTime: string,
    end_dateTime: string,
    created_by: string,
  ) {
    try{

      const client = this.cassandra.getClient();
      const id = uuidv4();
      
      const query = `
      INSERT INTO events (id, name, description, start_dateTime, end_dateTime, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
      `;
      await client.execute(
        query,
        [id, name, description, start_dateTime, end_dateTime, created_by],
        { prepare: true },
      );
      
      return { id, name, description, start_dateTime, end_dateTime, created_by };
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  }

  async getAllEvents() {
    try{

      const client = this.cassandra.getClient();
      const query = 'SELECT * FROM events';
      const result = await client.execute(query);
      console.log('Fetched events:', result.rows);
      return result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        start_dateTime: row.start_datetime,
        end_dateTime: row.end_datetime,
        created_by: row.created_by,
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');
    }
  }
  async getEventById(id: string) {
    try{

      console.log('Fetching event with id:', id);
      const client = this.cassandra.getClient(); // Make sure this is valid
      const query = 'SELECT * FROM events WHERE id = ?';
      const result = await client.execute(query, [id], { prepare: true });
      
      return result.rows[0] || { message: 'Event not found' };
    } catch (error) {
      console.error('Error fetching event by id:', error);
      throw new Error('Failed to fetch event by id');
    }
  }

  async deleteEvent(id: string) {
    try{

      const client = this.cassandra.getClient();
      const query = 'DELETE FROM events WHERE id = ?';
      await client.execute(query, [id], { prepare: true });
      return { message: `Event with id ${id} deleted successfully` };
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  }

    async updateEvent(id: string, body: any) {
      try{
        const client = this.cassandra.getClient();
        const query = `
        UPDATE events
        SET name = ?, description = ?, start_dateTime = ?, end_dateTime = ?, created_by = ?
        WHERE id = ?
        `;
        await client.execute(
        query,
        [
            body.name,
            body.description,
            body.start_dateTime,
            body.end_dateTime,
            body.created_by,
            id,
        ],
        { prepare: true },
        );
        return { message: `Event with id ${id} updated successfully` };
      } catch (error) {
        console.error('Error updating event:', error);
        throw new Error('Failed to update event');
      }
      }
}
