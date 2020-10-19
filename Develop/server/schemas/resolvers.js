const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user){
                const userData = await User.findOne({_id: context.user._id})
                .select('-__v -password')
            
                return userData;
            }
            throw new AuthenticationError('Not logged in');
        }
        
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);

            const token = signToken(user);
            console.log(token);
            //return user;
            return { user, token };
          },
      login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });

        const token = signToken(user);

        if(!user){
            throw new AuthenticationError('Incorrect Credentials');
        }
        const correctPw = await user.isCorrectPassword(password);

        if(!correctPw){
            throw new AuthenticationError('Incorrect Password!');
        }
        return {token, user};
      },
      saveBook: async (parent, { bookData }, context) => {
          if(context.user){
              console.log("context user is: ", context.user);
            //const book = await Book.create({bookData});

           const updateUser = await User.findOneAndUpdate(
                {_id: context.user._id},
                { $push: {savedBooks: bookData}},
                {new: true}
            );
            console.log("Our book is: ", book);
            return updateUser;
          }
          throw new AuthenticationError('You need to be logged in!');
    },
      removeBook: async (parent, {bookId}, context)=>{
          if(context.user){
              const updateUser = await User.findOneAndUpdate(
                  {_id: context.user._id},
                  {$pull: {savedBooks: {bookId}}},
                  {new: true}
              );
              return updateUser;
          }
          throw new AuthenticationError('Please log in before removing a book!')
      }
    }
  };
  
  module.exports = resolvers;