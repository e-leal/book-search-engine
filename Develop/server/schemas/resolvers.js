const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const {authenticationError} = require('apollo-server-express');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user){
                const userData = await User.findOne({_id: context.user._id})
                .select('-__v -password')
                .populate('books')
            
                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },
        users: async () => {
            return User.find();
        },
        user: async (parent, {email}) => {
            return User.findOne({email});
        },
        books: async () => {
            return Book.find();
          },
          book: async (parent, { title }) => {
            return Book.findOne({ title });
          }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            console.log("addUser user is: ",user)
            const token = signToken(user);
            console.log(token);
            //return user;
            return { user, token };
          },
      login: async (parent, {email, password}) => {
        const user = await User.findOne({email});
        console.log("login user is: ",user)
        if(!user){
            throw new AuthenticationError('Incorrect Credentials');
        }
        const correctPw = await user.isCorrectPassword(password);

        if(!correctPw){
            throw new AuthenticationError('Incorrect Password!');
        }
        const token = signToken(user);
        return {token, user};
      },
      saveBook: async (parent, {authors, description, title, bookId, image, link}) => {
          if(context.user){
            const book = await Book.create({authors, description, title, bookId, image, link});

            await User.findByIdAndUpdate(
                {_id: context.user._id},
                { $push: {books: book._id}},
                {new: true}
            );
            return book;
          }
          throw new AuthenticationError('You need to be logged in!');
    },
      removeBook: async (parent, {bookId})=>{
          Book.findOneAndDelete({bookId});
      }
    }
  };
  
  module.exports = resolvers;