const router = require('express').Router();
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireSignin = require('../middleware/requireSignin')
let User = require('../models/user.model');

router.route('/').get((req, res) => {
  res.send('hello')
});

router.get('/protected', requireSignin, (req, res) => {
  res.send('hello user')
});
  
router.route('/signup').post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.json({error: "Please enter all the fields"})
  }

  User.findOne({username: username})
  .then((existUser) =>{
    if (existUser) {
      return res.json({error: "Username already taken"})
    }
    const newUser = new User({username, password});

    newUser.save()
      .then(() =>  res.json({message: "Successfully signed up!"}))
      .catch(err => res.status(400).json('Error: ' + err));
  })
  .catch(err => console.log(err));
});

router.route('/signin').post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.json({error: "Please enter all the fields"})
  }

  User.findOne({username: username})
  .then((existUser) =>{
    if (!existUser) {
      return res.json({error: "Username does not exist"})
    }
    if (existUser.password == password) {
      const token = jwt.sign({_id:existUser._id}, JWT_SECRET)
      const {_id, username} = existUser
      res.json({token, user: {_id, username},message: "Successfully signed in!"})
    } else {
      return res.json({error: "Username and password do not match"})
    }
    
  })
  .catch(err => console.log(err));
});

router.route('/addMovie').post((req, res) => {
  User.findById(req.body.id)
      .then(user => {
        user.movies.push({
          title: req.body.title,
          poster_path: req.body.poster_path,
          vote_average: req.body.vote_average,
          id: req.body.movie_id
        })
        user.save()
        .then(() => res.json(user.movies))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/getMovies', (req, res) => {
  User.findById(req.body.id)
  .then(user => res.json(user.movies))
  .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;