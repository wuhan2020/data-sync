import axios from 'axios';
import * as qs from 'querystring';
import { join } from 'path';

export class GiteeClient {

  private baseUrl: string;
  private owner: string;
  private repo: string;
  private token: string;

  constructor(baseUrl: string, owner: string, repo: string, token: string) {
    this.baseUrl = baseUrl;
    this.owner = owner;
    this.repo = repo;
    if (this.baseUrl.endsWith('/')) {
      this.baseUrl = this.baseUrl.substr(0, this.baseUrl.length - 1);
    }
    this.token = token;
  }

  public static async getToken(baseUrl: string, config: GiteeAuthConfig): Promise<string> {
    try {
      const data = qs.stringify({
        grant_type: 'password',
        username: config.username,
        password: config.password,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        scope: config.scope,
      });
      const res = await axios.post(`${baseUrl}/oauth/token`, data, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      });
      return res.data.access_token;
    } catch (error) {
      console.log(error.data);
    }
    return '';
  }

  public async createFile(filePath: string, content: string, message: string): Promise<any> {
    const requestPath = join(`api/v5/repos/${this.owner}/${this.repo}/contents/${filePath}`);
    const encodedPath = encodeURI(requestPath);
    try {
      const data = qs.stringify({
        access_token: this.token,
        content,
        message,
      });
      const res = await axios.post(`${this.baseUrl}/${encodedPath}`, data, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      });
      return res.data;
    } catch (error) {
      console.log(error.data);
    }
    return undefined;
  }

  public async updateFile(filePath: string, content: string, sha: string, message: string): Promise<any> {
    const requestPath = join(`api/v5/repos/${this.owner}/${this.repo}/contents/${filePath}`);
    const encodedPath = encodeURI(requestPath);
    try {
      const data = qs.stringify({
        access_token: this.token,
        content,
        sha,
        message,
      });
      const res = await axios.put(`${this.baseUrl}/${encodedPath}`, data, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      });
      return res.data;
    } catch (error) {
      console.log(error.data);
    }
    return undefined;
  }

  public async getFileContent(filePath: string): Promise<any> {
    const requestPath = join(`api/v5/repos/${this.owner}/${this.repo}/contents`,
      `/${filePath}?access_token=${this.token}`);
    const encodedPath = encodeURI(requestPath);
    try {
      const res = await axios.get(`${this.baseUrl}/${encodedPath}`, {
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      });
      return res.data;
    } catch (error) {
      console.log(error.data);
    }
    return undefined;
  }
}

export interface GiteeConfig {
  baseUrl: string;
  owner: string;
  repo: string;
  auth: GiteeAuthConfig;
}

export interface GiteeAuthConfig {
  username: string;
  password: string;
  clientId: string;
  clientSecret: string;
  scope: string;
}
