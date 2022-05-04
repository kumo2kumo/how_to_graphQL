import * as jwt from "jsonwebtoken";
export const APP_SECRET = "GraphQL-is-aw3some";

export interface AuthTokenPayload {
    userId: number;
}

export function decodeAuthHeader(authHeader: String): AuthTokenPayload {
    // get rid of the "Bearer" and keep only the token
    const token = authHeader.replace("Bearer ", "");
    if(!token){
        throw new Error("no token found");
    }
    // decodes the token.
    return jwt.verify(token, APP_SECRET) as AuthTokenPayload
}