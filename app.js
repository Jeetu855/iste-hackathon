//jshint esversion:6

const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const _ = require('lodash')
const mongoose = require('mongoose')
const md5 = require('md5')

const homeStartingContent =
  'Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.'
const aboutContent =
  'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.'
const contactContent =
  'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.'

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/womensxpDB')

const postSchema = new mongoose.Schema({
  title: String,
  content: String
})

const userSchema = new mongoose.Schema({
  username: String,
  password: String
})

const User = mongoose.model('User', userSchema)

const Post = mongoose.model('Post', postSchema)

app.get('/', (req, res) => {
  res.render('root')
})

app.get('/signup', (req, res) => {
  res.render('signup')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/signup', (req, res) => {
  const username = req.body.username
  const password = md5(req.body.password)
  const newUser = new User({
    username: username,
    password: password
  })
  newUser.save(err => {
    if (!err) {
      res.redirect('/home')
    }
  })
})

app.post('/login', (req, res) => {
  const username = req.body.username
  const password = md5(req.body.password)

  User.findOne({ username: username }, (err, foundUser) => {
    if (!err && foundUser) {
      console.log(foundUser)
      if (foundUser.password === password) {
        res.redirect('/home')
      } else {
        res.redirect('/login')
      }
    }
  })
})

app.get('/home', (req, res) => {
  Post.find({}, (err, posts) => {
    //*here posts is an array containing post objects
    if (!err) {
      // console.log(posts)
      res.render('home', { startingContent: homeStartingContent, posts: posts })
    } //we pass an array of post objects in which we then apply for each
  })
})

app.get('/about', (req, res) => {
  res.render('about', { aboutContent: aboutContent })
})

app.get('/compose', (req, res) => {
  res.render('compose')
})

app.post('/compose', (req, res) => {
  // const post = {
  //   title: req.body.postTitle,
  //   content: req.body.postBody
  // }

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  })
  post.save(err => {
    if (!err) {
      console.log('Added new post')
      res.redirect('/')
    }
  })
})
app.get('/posts/:postId', (req, res) => {
  const requestedPostId = req.params.postId
  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render('post', {
      title: post.title,
      content: post.content
    })
  })
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Server started on port 3000')
})
