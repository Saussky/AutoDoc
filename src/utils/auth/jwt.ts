import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config()


/**
 * Generates and returns a JWT token 
 * using a private key located in a file path 
 * saved as an environment variable.
 * @returns {Promise<string>} - A promise that resolves into the generated JWT token.
 */
export default async function generateJWT(): Promise<string> {
    /** The id of the Github app */
    const appId: string = process.env.GITHUB_APP_ID!

    /** The header object of the JWT */
    const header = {
        alg: 'RS256',
        typ: 'JWT'
    };

    /** 
     * The string contents of the private key used to sign the JWT. 
     * The key is read from a file
     */
    const privateKey = Buffer.from(process.env.PEM_PRIVATE_KEY!, 'base64').toString('utf-8');

    /** 
     * The payload of the JWT. 
     * Contains app id, issued at time, expiration time, and permissions
     */
    const payload = {
        iss: appId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (10 * 50), // expires in 10 minutes
        permissions: {
            installations: {
                "read": true,
                "write": true
            }
        }
    };

    /** 
     * The JWT generated by signing the header and payload using 
     * the RS256 algorithm and the provided private key. 
     */
    const token = jwt.sign(payload, privateKey, { header });
    return token;
}