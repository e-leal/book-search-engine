const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const {authenticationError} = require('apollo-server-express');

const resolvers = {
    Query: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
          
            return { token, user };
          },
      login: async (parent, {email, password}) => {
        const user = await User.findOne({email});

        if(!user){
            throw new AuthenticationError('Incorrect Credentials');
        }
        const correctPw = await user.isCorrectPassword(password);

        if(!correctPw){
            throw new AuthenticationError('Incorrect Password!');
        }
        return {token, user};
      }
    }
  };
  
  module.exports = resolvers;