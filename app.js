const express = require('express')
const Controller = require('./controllers/controller')
const app = express()
var session = require('express-session')
const port = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }))


  
  function adminOnly(req, res, next) {
    try {
        console.log(req.session);
        if (!req.session.UserId || req.session.role !== 'admin') {
            const error = 'Admin access only. Please log in as an admin.';
            return res.redirect(`/login?error=${encodeURIComponent(error)}`);
        }
        next();
    } catch (error) {
        next(error);
    }
}

  app.get('/register', Controller.registerForm)
  app.post('/register', Controller.registerPost)
  app.get('/login', Controller.loginForm)
  app.post('/login', Controller.loginPost)
  app.get('/home', Controller.home)
  app.get('/logout', Controller.logout)


app.use(async (req, res, next) => {
    try {
        console.log(req.session)
        if (!req.session.UserId) {
            const error = 'login first';
            return res.redirect(`/login?error=${encodeURIComponent(error)}`);
        }
        
        next();
    } catch (error) {
        next(error);
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.get('/profile', Controller.profile)
  app.get('/eventDetail/:id', Controller.eventDetail)
  app.get('/ticket', Controller.buyTicket)
  app.post('/ticket', Controller.postTicket)
  app.get('/remove_item', Controller.deleteCart)
  app.get('/transaction', Controller.trans)
  

//-----------------------ADMIN---------------------------------
  
app.get('/admin',adminOnly, Controller.eventList)
app.get('/admin/addEvent',adminOnly, Controller.addEvent)
app.post('/admin/addEvent',adminOnly, Controller.handlerAdd)
app.get('/admin/edit/:id',adminOnly, Controller.renderEdit)
app.post('/admin/edit/:id',adminOnly, Controller.handlerEdit)
app.get('/admin/delete/:id',adminOnly, Controller.delete)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})