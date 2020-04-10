var passport = require('passport');
var express = require('express');
var router = express.Router();

function authenticationMiddleware() {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login?fail=true')
  }
}

router.get('/login', function (req, res) {
  if (req.query.fail)
    res.render('login', { message: 'Usuário e/ou senha incorretos!' });
  else
    res.render('login', { message: null });
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/chat', failureRedirect: '/login?fail=true' })
);

router.get('/', function (req, res, next) {
  res.render('login', { message: null });
});

router.get('/chat', authenticationMiddleware(), function (req, res) {
  res.render('chat', {});
});

router.get('/users/:pagina?', authenticationMiddleware(), function (req, res) {
  const pagina = parseInt(req.params.pagina || "1");
  global.db.findAll(pagina, (e, docs) => {
    if (e) { return console.log(e); }

    global.db.countAll((e, count) => {
      if (e) { return console.log(e); }

      const qtdPaginas = Math.ceil(count / global.db.TAMANHO_PAGINA);
      res.render('users', { title: 'Lista de Clientes', docs, count, qtdPaginas, pagina });
    })
  })
});

router.get('/new', function (req, res, next) {
  res.render('new', { title: 'Novo Cadastro', doc: { "username": "", "age": "", "email": "" }, action: '/new' });
});

router.post('/new', function (req, res) {
  var username = req.body.username;
  var email = req.body.email;
  var age = parseInt(req.body.age);
  var password = "$2a$06$HT.EmXYUUhNo3UQMl9APmeC0SwoGsx7FtMoAWdzGicZJ4wR1J8alW";
  global.db.insert({ username, age, email, password }, (err, result) => {
    if (err) { return console.log(err); }
    res.redirect('/login');
  })
})

router.get('/edit/:id', authenticationMiddleware(), function (req, res, next) {
  var id = req.params.id;
  global.db.findOne(id, (e, docs) => {
    if (e) { return console.log(e); }
    res.render('new', { title: 'Edição de Cliente', doc: docs[0], action: '/edit/' + docs[0]._id });
  });
})

router.post('/edit/:id', authenticationMiddleware(),  function (req, res) {
  var id = req.params.id;
  var username = req.body.username;
  var email = req.body.email;
  var age = parseInt(req.body.age);
  var password = "$2a$06$HT.EmXYUUhNo3UQMl9APmeC0SwoGsx7FtMoAWdzGicZJ4wR1J8alW";
  global.db.update(id, { username, age, email, password }, (e, result) => {
    if (e) { return console.log('atualizado', e); }
    res.redirect('/users');
  });
});

router.get('/delete/:id', authenticationMiddleware(), function (req, res) {
  var id = req.params.id;
  global.db.deleteOne(id, (e, r) => {
    if (e) { return console.log(e); }
    res.redirect('/users');
  });
});

module.exports = router;
