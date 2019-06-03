db.todos.drop();
db.todos.insertMany([
  {
    username: 'johnd',
    content: 'Create new todo'
  },
  {
    username: 'johnd',
    content: 'Update me'
  },
  {
    username: 'johnd',
    content: 'Delete example ones'
  },
  {
    username: 'janed',
    content: 'Visit TODOs webpage'
  },
  {
    username: 'admin',
    content: 'Fix admin panel'
  }
]);