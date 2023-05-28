import axios, { AxiosPromise } from "axios";
import generateJWT from "./jwt";
// const jwt: string = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyODExNTMiLCJpYXQiOjE2NzM5OTc0MjUsImV4cCI6MTY3Mzk5ODAyNSwicGVybWlzc2lvbnMiOnsiaW5zdGFsbGF0aW9ucyI6eyJyZWFkIjp0cnVlLCJ3cml0ZSI6dHJ1ZX19fQ.P6K9_yXUE9vhH0Rxw2SCZ8o8C_hrNVlE4D5n9OtuZr-sP0GDWmZ-kDVbiTT6W20er45jx5dac5X3lGI9pZshP5fgErbkDCUO-rjer_j9k6QyMVarKqXm3DQPzQIMNM8Y-UAl4gHjjMZi6gEKQcQA0olJEblnejVZZ8muX2BS-0QHWFXu4qHZEk33GoNDzYK4m2wSI_Dq05FF2bVqHCJtRxSB2Zs3ABNOsQ5u-Fhs7BCM4tu6RUtyC9zwDaRygPjS0VuARfblGWV-cKQd2z3jMBMQjA1q40nyFmCFNMEGsmuWR9zJVVfry0maQMrx3uXe2xNwkHvEDViqApNkpBXejA'

/**
 * Generates a JWT token for authentication with the GitHub API and returns 
 * the installation ID for the authenticated app.
 * 
 * @returns A Promise that resolves to the installation ID, or 500 if there's an error
 */
async function getInstallationId(): Promise<number> {
  const jwt: string = await generateJWT()!

  try {
    const response = await fetch('https://api.github.com/app/installations', {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: 'application/vnd.github+json'
      }
    });

    if (!response.ok) {
      throw new Error('Error $ {response.status}: $ {response.statusText}');
    }

    const data = await response.json();
    return data.id

  } catch (error) {
    console.error(error);
    return 500;
  }
}


/**
 * Generates an installation access token for the authenticated GitHub application 
 * specified in the .env file.
 * 
 * @returns A Promise that resolves to the installation access token, or 'error' if there's an error
 */
export default async function generateInstallToken() : Promise<string> {
  const jwt: string = await generateJWT()!
  
  const config = {
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'Your-App-Name'
    }
  }

  try {
    const response = await axios.post("https://api.github.com/app/installations/33091048/access_tokens", {
      installation_id: process.env.INSTALL_ID,
      repository: 'all',
      permissions: {
        contents: 'read'
      }
    }, config)

    const token: string = response.data.token
    return token

  } catch (e) {
    console.log(e)
    return 'error'
  }
}