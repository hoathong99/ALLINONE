// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const findUserUrl = "http://localhost:5678/webhook/Login";
const createUserUrl = "http://localhost:5678/webhook-test/createUser";
@Injectable()
export class AuthService {
  private client: OAuth2Client;

  constructor() {
    // Initialize the Google OAuth client with your Google Client ID
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

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

  /**
   * Handles the login flow by checking if the user exists in the database
   * via n8n webhook and creating the user if not found.
   * @param {string} token - The Google ID token from the frontend.
   * @returns {Promise<any>} - The user object.
   */
  async login(idToken: string) {
    // Step 1: Verify the Google ID token
    const userInfo = await this.verifyGoogleToken(idToken);

    // Step 2: Call the n8n webhook to check if the user already exists in the database
    // const findUserUrl = process.env.N8N_FIND_USER_WEBHOOK;
    // const createUserUrl = process.env.N8N_CREATE_USER_WEBHOOK;

    let user;
    try {
      // Attempt to find the user using the n8n webhook
      const findUserResponse = await axios.post(findUserUrl, {
        email: userInfo.email,
        name: userInfo.name
      })

      const result = findUserResponse.data;

      const isEmptyObject = result && Object.keys(result).length === 0;
      const isEmptyArray = Array.isArray(result) && result.length === 0;
      console.log("n8n response", result);
      if (isEmptyObject || isEmptyArray) {
        console.log('User not found. Creating user...');
        const createUserResponse = await axios.post(createUserUrl, {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          sub: userInfo.sub,
        });
        user = createUserResponse.data;
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
}
