const { Model, where } = require('sequelize')
const {Event, UserProfile, Transaction, User, Trans_Event} = require('../models')
var bcrypt = require('bcryptjs');
const transaction = require('../models/transaction');

class Controller {
 //----------------------------------------REGISTER LOGIN--------------------------------------   
    static async registerForm(req,res) {
        try {
            res.render('register')
        } catch (error) {
            res.send(error)
        }
    }
    
    static async registerPost(req,res) {
        try {
            let {email, name} = req.body
            await User.create(req.body)
            let data = await User.findOne({where : {email}})
            await UserProfile.create({
                name,
                UserId : data.id
            })
            res.redirect('/login')
        } catch (error) {
            res.send(error)
        }
    }
    
    static async loginForm(req, res) {
        try {
            res.render('login')
        } catch (error) {
            res.send(error)
        }
    }

    static async loginPost(req, res) {
        try {
            console.log(req.body)
            let {email, password} = req.body
            let hash = await User.findOne({
                where : {
                    email
                },
                include : {
                    model : UserProfile
                }
            })
            if(!hash) {
                const error = "invalid email/pasword"
                return res.redirect(`/login?error=${error}`)
            }
            const isMatch = await bcrypt.compare(password, hash.password);
            if(isMatch) {
                req.session.UserId = hash.id
                req.session.role = hash.role 
                req.session.name = hash.UserProfile.name
                req.session.UserProfileId = hash.UserProfile.id
                //set session
                if(hash.role === 'admin') {
                    return res.redirect('/admin')
                }
                return res.redirect('/home')
            } else {
                const error = "invalid email/pasword"
                return res.redirect(`/login?error=${error}`)
            }
        
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async logout(req,res) {
        try {
            console.log(req.session);
            req.session.destroy((err) => {
                if (err) {
                    console.error('Failed to destroy session:', err);
                    return res.status(500).send('Failed to log out.');
                }
                res.redirect('/home');
            });
        } catch (error) {
            console.error('Error during logout:', error);
            res.status(500).send('Failed to log out.');
        }
    }

 //----------------------------------------REGISTER LOGIN--------------------------------------   

 //-----------------------------------------FEATURES--------------------------------------------
    static async home(req, res) {
        try {
            let name= req.session.name
            let data = await Event.findAll()
            res.render('homeBoot', {data,name})
        } catch (error) {
            res.send(error)
        }
    }

    static async profile(req, res) {
        try {
            console.log(req.session.UserId)
            const id = req.session.UserId
            let data = await User.findByPk(id,{
                include : {
                    model : UserProfile,
                    include: {
                        model : Transaction,
                        include : {
                            model : Event
                        }
                    }
                }
            })
            res.send(data)
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async buyTicket(req, res) {
        try {
            let data = await Event.findAll()
            if(!req.session.cart) {
                req.session.cart = [];
            }
          
            res.render('buyTicket' , {data, cart: req.session.cart})
        } catch (error) {
            res.send(error)
        }
    }

    static async postTicket(req,res) {
        try {
           
            let {EventId, name, price } = req.body
            let count = 0
            for(let i = 0; i < req.session.cart.length; i++) {
                if(req.session.cart[i].EventId === EventId) {
                    req.session.cart[i].quantity += 1
                    count++
                }
                
            }
            if(count == 0) {
                const cart_data = {
                    EventId,
                    name,
                    price : parseFloat(price),
                    quantity : 1
                }
                
                req.session.cart.push(cart_data)
                res.redirect('/ticket')
            }
        } catch (error) {
            
        }
    }

    static async deleteCart(req, res) {
        try {
            const {id} = req.query
            for(let i = 0; i < req.session.cart.length; i++) {
                if(req.session.cart[i].EventId === id) {
                    req.session.cart.splice(i, 1)
                }
            }
            res.redirect('/ticket')
        } catch (error) {
            res.send(error)
        }
    }

    static async trans(req, res) {
        try {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            const charactersLength = characters.length;
            for (let i = 0; i < 7; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            console.log(req.session.cart)
            let form = req.session
            let time = new Date()
            let data = req.session.cart
            
            console.log(req.session)
            await Transaction.create({
                name : `${form.name}${result}`,
                UserProfileId : form.UserProfileId
            })
            let trans = await Transaction.findOne({
                where : {name : `${form.name}${result}`}
            })
            console.log(trans)
            data = data.map(el => {
                Trans_Event.create({
                    EventId : el.EventId,
                    TransactionId : trans.id
                })
            })
           
            res.redirect('/home')
        } catch (error) {
            res.send(error)
        }
    }

    static async eventDetail(req, res) {
        try {
            res.send('masuk')
        } catch (error) {
            res.send(error)
        }
    }


 


 //-----------------------------------------FEATURES--------------------------------------------
    
//-------------------------------------------------ADMIN----------------------------------------

    static async admin(req,res) {
        try {
            console.log(req.session.role)
            res.send('Masuk ADMIN')
        } catch (error) {
            console.log(error)
            res.send(error)
        }
}

    static async eventList(req,res) {
        try {
            let event = await Event.findAll()
            res.render('adminList', {event})
        } catch (error) {
            res.send(error)
        }
    }

    static async addEvent(req,res) {
        try {
            res.render('add')
        } catch (error) {
            res.send(error)
        }
    }

    static async handlerAdd(req,res) {
        try {
            await Event.create(req.body)
           res.redirect('/admin') 
        } catch (error) {
            res.send(error)
        }
    }

    static async renderEdit(req,res) {
        try {
            const {id} = req.query
            let data = await Event.findByPk(id)
            res.render('edit', {data})
        } catch (error) {
            res.send(error)
        }
    }

    static async handlerEdit(req,res) {
        try {
            let {name, category, date, location, price} = req.body
            const {id} = req.params
            await Event.update({
                name,
                category,
                date,
                location,
                price
            },{
                where : {
                    id
                }
            })
            res.redirect('/admin')
        } catch (error) {
            res.send(error)
        }
    }

    static async delete(req,res) {
        try {
            const {id} = req.params
            await Event.destroy({
                where : {
                    id
                }
            })
            res.redirect('/admin')
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = Controller