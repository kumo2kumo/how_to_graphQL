import { makeSchema } from 'nexus'
import { join } from 'path'
import * as types from './graphql'

export const schema = makeSchema({
  types, // 1
  outputs: {
    schema: join(process.cwd(), "schema.graphql"), // 2
    typegen: join(process.cwd(), "nexus-typegen.ts"), // 3
  },
  contextType: {
      // configure Nexus to know the type of your GraphQL context
      module: join(process.cwd(), "./src/context.ts"),
      export: "Context"
  }
})