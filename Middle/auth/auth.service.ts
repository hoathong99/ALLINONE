import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async register(username: string, password: string, googleToken: string) {
    console.log(username,password,googleToken);
    const data = await this.usersService.findUser(username);
    if(data){
      console.log("Username already exists triggered");
      throw new ConflictException('Username already exists');
    }
    const hashed = await bcrypt.hash(password, 10);
    return this.usersService.createUser(username, hashed);
  }

  async validateUser(username: string, password: string): Promise<any> {
    console.log("login: ", username, password);
    const data = await this.usersService.findUser(username);

    if (data) {
      const isGood = await bcrypt.compare(password, data.password);
      console.log("isGood", isGood);
      if (isGood) {
        return data;
      }
    }else{
      return null;
    }
  }

  async login(user: any) {
    console.log("login user", user);
    const payload = { username: user.email , sub: user.sub}; // or whatever ID your user has
    console.log("login payload", payload);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}