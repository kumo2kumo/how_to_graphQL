import { Prisma } from "@prisma/client";
import { TypeNameMetaFieldDef } from "graphql";
import { arg, enumType, extendType, idArg, inputObjectType, intArg, nonNull, objectType, stringArg, list} from "nexus";
import { NexusGenObjectNames, NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
		t.nonNull.dateTime("createdAt")
		t.field("postedBy", {
			type: "User",
			resolve(parent, args, context) {
				return context.prisma.link.findUnique({
					where: { id: parent.id }
				}).postedBy(); 
			}
		});
		//linkにvoteしているuser
		t.nonNull.list.nonNull.field("voters", {
			type: "User",
			resolve(parent, args, context){
				return context.prisma.link.findUnique({where: { id: parent.id }}).voters() //schema.prismaのfield名
			}
		})
  },
});

//total amount of links
export const Feed = objectType({
	name: "Feed",
	definition(t){
		t.nonNull.list.nonNull.field("links", {type: Link});
		t.nonNull.int("count")
		t.id("id");
	}
})

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feed", {  // 1
			type: "Feed",
			args: {
					filter: stringArg(),
					skip: intArg(),
					take: intArg(),
					orderBy: arg({ type: list(nonNull(LinkOrderByInput)) }), 
			},
			async resolve(parent, args, context) {  
					const where = args.filter
							? {
										OR: [
												{ description: { contains: args.filter } },
												{ url: { contains: args.filter } },
										],
								}
							: {};

					const links = await context.prisma.link.findMany({  
							where,
							skip: args?.skip as number | undefined,
							take: args?.take as number | undefined,
							orderBy: args?.orderBy as
									| Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput>
									| undefined,
					});

					const count = await context.prisma.link.count({ where });  // 2
					const id = `main-feed:${JSON.stringify(args)}`;  // ex. "main-feed:{\"take\":1}"
						
					return {  // 4
							links,
							count,
							id,
					};
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
				const { description, url } = args
				const { userId } = context
				if(!userId){
					throw new Error("Cannot post without login");
				}

				const newLink = context.prisma.link.create({
					data: {
						description: args.description,
						url: args.url,
						postedBy: { connect: {id: userId}}
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
		});
		
	}
})

export const LinkOrderByInput = inputObjectType({
	name: "LinkOrderByInput",
	definition(t){
		t.field("description", {type: Sort});
		t.field("url", {type: Sort} );
		t.field("createdAt", {type: Sort} );
	},
});

export const Sort = enumType({
	name: "Sort",
	members: ["asc", "desc"]
})
