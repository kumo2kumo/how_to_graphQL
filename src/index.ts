import { ApolloServer } from "apollo-server";
import { context } from "./context"

// 1
import { schema } from "./schema";
export const server = new ApolloServer({
    schema,
    context //you’ll now be able to access Prisma with context.prisma in all of your resolvers.
});

const port = 3000;
// 2
server.listen({port}).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});