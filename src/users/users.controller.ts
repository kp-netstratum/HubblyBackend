import { Controller, Post, Body, Get, Param, Delete, Query, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() body: { username: string; email: string }) {
    return this.usersService.createUser(body.username, body.email);
  }

  @Get()
  async findAll() {
    return this.usersService.getAllUsers();
  }

  @Get()
  async findOne(@Query('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Delete()
  async delete(@Query('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Put()
  async update(
    @Query('id') id: string,
    @Body() body: { username?: string; email?: string },
  ) {
    // Assuming the service has an updateUser method
    if (!body.username && !body.email) {
      throw new Error('At least one field (username or email) must be provided for update');
    }
    return this.usersService.updateUser(id, body.username, body.email);
  }


}

