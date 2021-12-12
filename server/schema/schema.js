const graphql = require('graphql');
var _lodash = require('lodash');

//dummy data
var usersData = [
     {id: '101', name: 'Nasruddin Gayasuddin khan', age: 29, profession: 'Programmer'},
     {id: '102', name: 'Sufiya Nasruddin Khan', age: 22, profession: 'Cooking'},
     {id: '103', name: 'Jalaluddin Gayasuddin khan', age: 25, profession: 'Driving'}
];
var hobbiesData = [
    { id: '1000', title: 'Programming', description: 'Using computers to make the world a better place', userId: '101'},
    { id: '2000', title: 'Rowing', description: 'Sweat and feel better before eating donouts', userId: '101'},
    { id: '3000', title: 'Swimming', description: 'Get in the water and learn to become the water', userId: '103'},
    { id: '4000', title: 'Fencing', description: 'A hobby for fency people', userId: '103'},
    {id: '5000', title: 'Hiking', description: 'Wear hiking boots and explore the world', userId: '102'},
];

var postsData = [
    {id: '1', comment: 'Building a Mind', userId: '101'},
    {id: '2', comment: 'GraphQL is Amazing', userId: '101'},
    {id: '3', comment: 'How to Change the World', userId: '102'},
    {id: '4', comment: 'How to Change the World', userId: '102'},
    {id: '5', comment: 'How to Change the World', userId: '103'}
]

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull

} = graphql
const UserType = new GraphQLObjectType({
    name: 'User',
    description :'document for user...',
    fields:()=>({
        id: { type: GraphQLID},
        name: { type: GraphQLString },
        age: { type: GraphQLInt},
        profession: {type: GraphQLString},
        posts:{
            type: new GraphQLList(postType),
            resolve( parent, args) {
                return _lodash.filter(postsData, {userId : parent.id})
            }
        },
        hobbies:{
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return _lodash.filter(hobbiesData, { userId: parent.id })
            }
        }
    })
});

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobby for user...',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {
                return _lodash.find(usersData, { id: parent.userId })
            }
        }
    })
});


const postType = new GraphQLObjectType({
    name: 'post',
    description: 'Post description',
    fields: () => ({
        id: { type: GraphQLID },
        comment: { type: GraphQLString },
        user:{
            type: UserType,
            resolve(parent, args) {
                return _lodash.find(usersData, {id: parent.userId})
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description.',
    fields: {
        user:{
            type: UserType,
            args:{
                id: { type: GraphQLString }
            },
            resolve( parent, args){
              return  _lodash.find(usersData, {id: args.id})
            }
        },
        hobby: {
            type: HobbyType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parent, args) {
                return _lodash.find(hobbiesData, { id: args.id })
            }
        },
        post:{
            type: postType,
            args: {
                id: { type: GraphQLID }            },
            resolve(parent, args) {
                return _lodash.find(postsData, { id: args.id })
            }
        },
        users:{
            type : new GraphQLList(UserType),
            resolve(parent, args){
                return usersData;
            }
        },
        hobbies:{
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return hobbiesData;
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'mutation',
    fields:{
        createUser:{
            type: UserType,
            args: {
                //
                name: {
                    type: GraphQLString
                },
                age: {
                    type: GraphQLInt
                },
                profession: {
                    type: GraphQLString
                }
            },
            resolve( parent, args){
                let user = {
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                }
                return user;
            }

        },
        createPost: {
            type: postType,
            args: {
                //
                comment: {
                    type: GraphQLString
                },
                userId: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                let post = {
                    comment: args.comment,
                    userId: args.userId
                   
                }
                return post;
            }

        },
      //  id: '1000', title: 'Programming', description: 'Using computers to make the world a better place', userId
        createHobbies: {
            type: HobbyType,
            args: {
                //
                title: {
                    type: GraphQLString
                },
                description: {
                    type: GraphQLString
                },
                userId: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                let hobbies = {
                    title: args.title,
                    userId: args.userId,
                    description: args.description

                }
                return hobbies;
            }

        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation
})