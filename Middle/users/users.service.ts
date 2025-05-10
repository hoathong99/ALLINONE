import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

enum ROLE {
  USER="USER",
  ADMIN="ADMIN"
}

interface userInfo {
  name: string,
  email: string,
  password: string,
  sub?: string, // gg ID
  role: ROLE,
  employeeCode?: string
}

@Injectable()
export class UsersService {
  private findUserUrl;
  private createUserUrl; 
  constructor() {
    this.findUserUrl = `${process.env.VITE_N8N_URL}/webhook/Login`;
    this.createUserUrl = `${process.env.VITE_N8N_URL}/webhook/createUser`;
  }

  private users = new Map<string, { username: string; password: string }>();

  createUser(username: string, password: string) {
    // if (this.users.has(username)) {
    //   throw new Error('User already exists');
    // }

    let userInfo: userInfo = {
      email: username,
      name: "not implemented yet",
      password: password,
      sub: "not implemented yet",
      role: ROLE.USER
    }
    axios.post(this.createUserUrl, userInfo)
      .then(data => { return data })
      .catch(error => { throw (error) });
    this.users.set(username, { username, password });
    return { username };
  }

  async findUser(username: string): Promise<any> {
    try {
      const userInfo = { email: username };
      const response = await axios.post(this.findUserUrl, userInfo);
      console.log("n8n login:", response);
      if(response){
      return response.data;
      }else{
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

}