const axios = require('axios');
const qs = require('qs');

class FatSecret {
  constructor() {
    this.clientId = "29fee191867c4dec91ae270f74fc1295"; 
    this.clientSecret = "eb6f896ebc384b5c83d5da2a648e2a20"; 
    this.token = null;
    this.tokenExpires = null;
  }

  async getAccessToken() {
    const now = Date.now();

    
    if (this.token && this.tokenExpires && now < this.tokenExpires) {
      return this.token;
    }

    const tokenUrl = 'https://oauth.fatsecret.com/connect/token';
    const credentials = {
      grant_type: 'client_credentials',
      scope: 'basic',
    };

    try {
      const response = await axios.post(tokenUrl, qs.stringify(credentials), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64'),
        },
      });

      this.token = response.data.access_token;
      this.tokenExpires = now + response.data.expires_in * 1000;

      return this.token;
    } catch (err) {
      console.error('Failed to retrieve access token from FatSecret:', err.response?.data || err.message);
      throw err;
    }
  }

  async callAPI(method, params = {}) {
    const accessToken = await this.getAccessToken();

    const apiUrl = `https://platform.fatsecret.com/rest/server.api`;

    const query = {
      method,
      format: 'json',
      ...params,
    };

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: query,
      });

      return response.data;
    } catch (err) {
      console.error('FatSecret API error:', err.response?.data || err.message);
      throw err;
    }
  }
}

module.exports = FatSecret;
