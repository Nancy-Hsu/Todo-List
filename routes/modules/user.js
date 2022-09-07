const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo
const User = db.User
const passport = require('passport')
const bcrypt = require('bcryptjs')


router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
})
)

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: 'Each field below is required.' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: 'your password is not same with confirm one.' })
  }

  if (errors.length) {
    return res.render('login', {
      name,
      email,
      password,
      confirmPassword,
      errors })
  }

  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        errors.push({ message: 'The email has been used.' })
        return res.render('register', {
          name,
          email,
          password,
          confirmPassword,
          errors
        })
      }

      return User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    })
    .catch(err => { console.log(err) })
})

router.get('/logout', (req, res) => { 
  req.logOut()
  req.flash('success_msg', 'Account logged out successfully！')
  res.redirect('/users/login')
})

module.exports = router