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

let links: NexusGenObjects["Link"][] = [ // an array of Link objects.
  {
    id: 1,
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
  {
    id: 2,
    url: "graphql.org",
    description: "GraphQL official website",
  },
];

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      resolve(parent, args, context, info) {
        return links; //returns the links array
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
				return links.find(element => element.id = id)
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
				const {description, url} = args;
		
				let idCount = links.length + 1
				const link = {
					id: idCount,
					description: description,
					url: url
				}
				links.push(link)
				return link;
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
				id: nonNull(idArg())
			},
			resolve(parent, args, context){
				const link = links.find(element => element.id == args.id)
				links = links.filter(element => element.id != args.id)
				return link
			}
		})
	}
})
