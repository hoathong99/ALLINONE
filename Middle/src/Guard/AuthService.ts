// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { error } from 'console';
import { ConfigService } from '@nestjs/config';

enum ROLE {
  USER="USER",
  ADMIN="ADMIN"
}

interface userInfo {
  name: string,
  email: string,
  sub?: string, // gg ID
  role: ROLE,
  employeeCode?: string
}

interface registerPayload {
  email:string,
  password: string,
  googleToken: string
}

@Injectable()
export class AuthService {
  private client: OAuth2Client;
  private n8nBaseUrl;
  private findUserUrl;
  private createUserUrl; 

  constructor(private readonly configService: ConfigService) {
    // Initialize the Google OAuth client with your Google Client ID
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    this.n8nBaseUrl = this.configService.get<number>('n8nUrl');
    // this.findUserUrl = `${this.configService.get<number>('n8nUrl')}/webhook/Login`;
    // this.createUserUrl = `${this.configService.get<number>('n8nUrl')}/webhook/CreateUser`;
    this.findUserUrl = `${process.env.VITE_N8N_URL}/webhook/Login`;
    this.createUserUrl = `${process.env.VITE_N8N_URL}/webhook-test/createUser`;
  }
  // n8nBaseUrl(): string {
  //   return this.configService.get<string>('N8N_BASE_URL', 'http://13.212.177.47:5678');
  // }


  /**
   * Verifies the Google ID token and returns the user's info if valid.
   * @param {string} idToken - The Google ID token from the frontend.
   * @returns {Promise<any>} - The user payload if the token is valid.
   */
  async verifyGoogleToken(idToken: string) {
    try {
      // Verify the token using Google's OAuth2Client
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID, // Your Google Client ID
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token payload');
      }

      return {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        sub: payload.sub, // This is the Google user ID
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired Google token');
    }
  }

  async verifyToken(idToken: string) {
    try {
      let ggUser = await this.verifyGoogleToken(idToken);
      const findUserResponse = await axios.post(this.findUserUrl, {
        sub: ggUser.sub
      })
      const result = findUserResponse.data;
      const isEmptyObject = result && Object.keys(result).length === 0;

      if (isEmptyObject) {
        throw new UnauthorizedException('no user found');
      }
      return result;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired Google token');
    }
  }

  /**
   * Handles the login flow by checking if the user exists in the database
   * via n8n webhook and creating the user if not found.
   * @param {string} token - The Google ID token from the frontend.
   * @returns {Promise<any>} - The user object.
   */
  async login(idToken: string) {
    // Step 1: Verify the Google ID token
    console.log("findUserURL",this.findUserUrl);
    const userInfo = await this.verifyGoogleToken(idToken);

    // Step 2: Call the n8n webhook to check if the user already exists in the database
    let user;
    try {
      // Attempt to find the user using the n8n webhook
      const findUserResponse = await axios.post(this.findUserUrl, {
        sub: userInfo.sub
      });

      const result = findUserResponse.data;
      console.log("login res", result);
      const isEmptyObject = result && Object.keys(result).length === 0;

      if (isEmptyObject) {
        console.log('User not found...');
        // const createUserResponse = await axios.post(createUserUrl, {
        //   email: userInfo.email,
        //   name: userInfo.name,
        //   picture: userInfo.picture,
        //   sub: userInfo.sub,
        // });
        // user = createUserResponse.data;

        // if(userInfo.name&&userInfo.email){                                         // this will add google account to user DB if not register yet
        //   let userDetail : userInfo = {
        //     name: userInfo.name,
        //     email: userInfo.email,
        //     sub: userInfo.sub,
        //     role: ROLE.USER
        //   }
        //   this.register(userDetail);
        // }else{
        //   console.log('GOOGLE ACCOUNT IS MISSING CONTAIN NAME OR EMAIL');
        // }

      } else {
        user = result;
      }

      // If user exists, the response will have the user data
      user = findUserResponse.data;
    } catch (error) {
      console.log('User not found in DB, proceeding to create user...');
    }

    // if (!user) {
    //   const createUserResponse = await axios.post(createUserUrl, {
    //     email: userInfo.email,
    //     name: userInfo.name,
    //     picture: userInfo.picture,
    //     sub: userInfo.sub,
    //   });

    //   // Set the user data returned from the create user webhook
    //   user = createUserResponse.data;
    // }

    // Return the user object after login and/or creation
    return {
      message: 'Login successful',
      user,
    };
  }

  async register(Payload: registerPayload) {

    this.verifyGoogleToken(Payload.googleToken).then((data)=>{
      let userInfo : userInfo = {
        email: Payload.email,
        name: data.name?data.name:"",
        sub: data.sub,
        role: ROLE.USER
      }
      axios.post(this.createUserUrl, userInfo)
      .then(data => { return data })
      .catch(error => { throw (error) });
    })
  }

  async checkUseInDB(user : any) {

    const extract = {
      name: user.name,
      email: user.email,
      sub: user.sub
    }
    try {
      // Attempt to find the user using the n8n webhook
      const findUserResponse = await axios.post(this.findUserUrl, {
        email: extract.email,
        name: extract.name,
        sub: extract.sub
      })

      const result = findUserResponse.data;
      const isEmptyObject = result && Object.keys(result).length === 0;

      if (isEmptyObject) {
        console.log('User not found.');
        return false;
      }
      // If user exists, the response will have the user data
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
