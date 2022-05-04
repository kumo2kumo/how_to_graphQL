import { extendType, idArg, intArg, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjectNames, NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
  },
});

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      resolve(parent, args, context, info) {
        return context.prisma.link.findMany();
      },
    });

		t.field("link", {
			type: "Link",
			args: {
				id: nonNull(intArg())
			},
			resolve(parent, args, context, info){
				// console.log(args) //{ id: 1 }
				const { id } = args
				return context.prisma.findUnique({
					where: {
						id: id
					}
				})
			}
		})
  },
});

export const LinkMutation = extendType({
	type: "Mutation",
	definition(t){
		t.nonNull.field("post", {
			type: "Link",
			args: {
				description: nonNull(stringArg()),
				url: nonNull(stringArg())
			},
			
			resolve(parent, args, context) {
		
				const newLink = context.prisma.link.create({
					data: {
						description: args.description,
						url: args.url
					}
				}) // return promise
				return newLink;
			}
		});

		// TODO
		// t.nonNull.field("updateLink", {
		// 	type: "Link",
		// 	args: {
		// 		id: nonNull(idArg()),
		// 		url: stringArg(),
		// 		description: stringArg()
		// 	},
		// 	resolve(parent, args, context){
		// 		const {id, url, description} = args
		// 		LinkQuery.name("link", )
		// 	}
		// })

		t.nonNull.field("deleteLink", {
			type: "Link",
			args: {
				id: nonNull(intArg())
			},
			resolve(parent, args, context){
				const deleteLink = context.prisma.link.delete({
					where: {
						id: args.id
					}
				})
				return deleteLink;
			}
		})
	}
})
