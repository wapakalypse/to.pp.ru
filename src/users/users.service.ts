// src/users/users.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users: any[];

  constructor() {
    this.users = [
      {
        username: 'miro',
        password: 'iYNt47d1A3rDukbB'
      }
    ];
  }

  async findOne(username: string): Promise<any> {
    return this.users.filter((user: any) => user.username === username)[0];
  }
}
