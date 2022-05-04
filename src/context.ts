import { PrismaClient } from "@prisma/client";
import { decodeAuthHeader } from "./utils/auth";
import { Request } from "express"

export const prisma = new PrismaClient();

export interface Context {
    prisma: PrismaClient;
    // every resolver has access to the userId@context
    userId?: number;
}

// export const context: Context = { // it can be imported and used by the GraphQL server.
//     prisma
// }

export const context = ({ req }: { req: Request }): Context => {
    const token = 
        req && req.headers.authorization
            ? decodeAuthHeader(req.headers.authorization)
            : null;
    return {
        prisma, 
        userId : token?.userId
    }
}