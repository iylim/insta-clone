const express = require('express');
const expressGraphql = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');

// GraphQL schema
const schema = buildSchema(`
type User {
  id : String!
  nickname : String!
  avatar : String!
}
type Post {
    id: String!
    user: User!
    caption : String!
    image : String!
}
type Query{
  user(id: String) : User!
  post(user_id: String, post_id: String) : Post!
  posts(user_id: String) : [Post]
}
`);

const userslist = {
  a: {
    id: 'a',
    nickname: 'ivy',        
    avatar: './Me.jpg',
  },
};

const postslist = {
  a: {
    a: {
      id: 'a',
      user: userslist['a'],
      caption: 'hello world!',
      image:
        './espace-room.jpg'
    },
    b: {
      id: 'b',
      user: userslist['a'],
      caption: 'First :)',
      image:
        './espace-room.jpg'
    },
    c: {
      id: 'c',
      user: userslist['a'],
      caption: 'Second',
      image: './espace-room.jpg'
    },
  }
};

// The root provides a resolver function for each API endpoint
const root = {
  user({ id }) {
    return userslist[id];
  },
  post({ user_id, post_id }) {
    return postslist[user_id][post_id];
  },
  posts({ user_id }) {
    return Object.values(postslist[user_id]);
  }
};

// Create an express server and a GraphQL endpoint
const app = express();
app.use(cors());
app.use('/graphql', expressGraphql({
  schema,
  rootValue: root,
  graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));