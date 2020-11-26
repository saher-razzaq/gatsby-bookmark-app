const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require('faunadb'),
  q = faunadb.query;
var client = new faunadb.Client({ secret: 'fnAD7ch7meACBUZCW18l25sk0VZSUhAEeCWbP07i' });  

const typeDefs = gql`
  type Query {
    bookmarks: [Bookmark]!
  }

  type Mutation {
    addBookmark(url: String!,title: String!,desc: String!): Bookmark
  }
  type Bookmark {
    id: ID!
    url: String!
    title: String!
    desc: String!  
  }
`;
let index=3;
const bookmarks=[
    {id:1,url:'https://www.smashingmagazine.com/',title:'smash magzine',desc:'this is a smash magazine'},
    {id:2,url:'https://www.smashingmagazine.com/',title:'smash magzine',desc:'this is a smash magazine'},
    {id:3,url:'https://www.smashingmagazine.com/',title:'smash magzine',desc:'this is a smash magazine'}
]

const resolvers = {
  Query: {
    bookmarks: async (parent, args, context) => {
     try {
        let result = await client.query(
            q.Map(
             q.Paginate(q.Documents(q.Collection("links"))),
      q.Lambda(x=>q.Get(x)))
          );
          console.log(result)
          return result.data.map(d=>{
            return {
                id: d.ref.id,
                url: d.data.url,
                title: d.data.title,
                desc: d.data.desc,

              }
          });
     }
     catch(error){
         return error.toString();
     }
    }
  },
  Mutation: {
    addBookmark: async ( _ ,{url,title,desc}) => {
       try {
        var result=await client.query(
            q.Create(q.Collection('links'),{data:{url,title,desc}})
        );
        return result.ref.data;
       }
       catch(error){
        return error.toString();  
       }
    }   
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
});

exports.handler = server.createHandler();