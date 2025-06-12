import { Controller, Post, Body, Get, Query, Delete, Put } from '@nestjs/common';
import { EventsService } from './event.service';
import { get } from 'http';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(
    @Body()
    body: {
      name: string;
      description: string;
      startDateTime: string;
      endDateTime: string;
      created_by: string;
    },
  ) {
    return this.eventsService.createEvent(
      body.name,
      body.description,
      body.startDateTime,
      body.endDateTime,
      body.created_by,
    );
  }

@Get()
async findOne(@Query('id') id?: string) {
  if (id) {
    console.log('Fetching event with id:', id);
    return this.eventsService.getEventById(id);
  }
  return this.eventsService.getAllEvents();
}

  @Delete()
  async delete(@Query('id') id: string) {
    return this.eventsService.deleteEvent(id);
  }

  @Put()
  async update(@Query('id') id: string, @Body() body: any) {
    return this.eventsService.updateEvent(id, body);
  }
}
