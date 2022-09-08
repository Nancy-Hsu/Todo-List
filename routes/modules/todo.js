const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo
const User = db.User

//show new page
router.get('/new/', (req, res) => {
  return res.render('new')
})

//create new todo
router.post('/', (req, res) => {
  const UserId = req.user.id
  const name = req.body.name
  return Todo.create({ name, UserId  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// show detail page
router.get('/:id', (req, res) => {
  const id = req.params.id
  const userId = req.user.id
  return Todo.findOne({ where: { userId, id } })
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

// show edit page
router.get('/:id/edit', (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where: { userId, id } })
    .then(todo => res.render('edit', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

// edit the data
router.put('/:id', (req, res) => {
  const id = req.params.id
  const userId = req.user.id
  const { name, isDone } = req.body

  return Todo.update({ name, isDone: isDone === 'on' }, { where: { id, userId } })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))

  // return Todo.findOne({ where: { userId, id } })
  // .then(todo => { 
  //   return todo.update({ name, isDone: isDone === 'on' })
  //     .then((updatedtodo) => res.render('detail', { todo: updatedtodo.toJSON() }))
  // })
})

//delete
router.delete('/:id', (req, res) => {
  const id = req.params.id
  const userId = req.user.id
  return Todo.destroy({ where: { id, userId } })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))

})


module.exports = router