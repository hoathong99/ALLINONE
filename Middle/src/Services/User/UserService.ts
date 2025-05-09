import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [{ id: 1, username: 'admin', password: 'admin' }];

  async findByUsername(username: string) {
    return this.users.find(user => user.username === username);
  }

  async findById(id: number) {
    return this.users.find(user => user.id === id);
  }
}
