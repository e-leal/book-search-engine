const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function (req, res, next) {
    console.log("The req is: ",req.headers)
    //console.log("authorization token: ", req.headers.authorization);
    console.log("Our token result is: HERE");
    //console.log("our token result is: ",(req.body.token || req.query.token || req.headers.authorization));
    // allows token to be sent via  req.body, req.query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
    // console.log("body token: ", req.body.token);
    // console.log("query token: ", req.query.token);
    // console.log("authorization token: ", req.headers.authorization);
    console.log("Our token is: ", token);
    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      
      token = token.split(' ').pop().trim();
      console.log("we made it to the split token: ", token);
    }

    if (!token) {
      return req;
      //return res.status(400).json({ message: 'You have no token!' });
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      console.log("we made it all the way to jwt verify!: ", req.user);
    } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: 'invalid token!' });
    }

    // send to next endpoint
    //next();
    // return updated request object
    return req;
  },
  signToken: function ({ username, email}) {
    const payload = { username, email };
    console.log("my payload is: ", payload)
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  }
};
