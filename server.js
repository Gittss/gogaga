const express=require('express')
const mongoose=require('mongoose')
const path=require('path')
const bodyparser=require('body-parser')
const exphand=require('express-handlebars')
const Handlebars=require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
require('dotenv/config')
const User=require('./models/user')

var PORT=process.env.PORT || 3030
 
var app=express()
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

app.set('views',path.join(__dirname,'/views/'));    
app.engine('hbs',exphand({extname:'hbs',handlebars: allowInsecurePrototypeAccess(Handlebars), defaultLayout:'mainlayout', layoutsDir:__dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');

app.use(express.static('public'))
app.use('/',express.static(__dirname+'/public'));

app.listen(PORT,()=>{
    console.log('Express server started at '+PORT)
})

mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true, useUnifiedTopology:true},(err)=>{
    if(!err) console.log('MongoDB connected')
    else console.log(err)
})

app.get('/',(req,res)=>{
    res.render('home',{title:'Welcome to GOGAGA'})
})

app.get('/gogaga/add',(req,res)=>{
    res.render('add',{title:'Add user'})
})

app.post('/gogaga/add',(req,res)=>{
    var user=new User(req.body)
    user.save((err)=>{
        if(!err) res.redirect('/gogaga/list')
        else{
            if(err.name=='ValidationError'){
                handleValidationError(err,req.body)
                res.render('add',{title:'Add user',user: req.body})
            }else console.log(err)
        }
    })
})

app.get('/gogaga/list',(req,res)=>{
    User.find((err,docs)=>{
        if(!err){
            if(docs==null) res.render('list',{title:'No users added yet'})
            else res.render('list',{title:'Our users', user:docs})
        }
        else console.log(err)
    })
})

function handleValidationError(err,body){
    for(field in err.errors)
    {
        switch(err.errors[field].path){
            case 'name':    
                body['nameError']=err.errors[field].message;
                break;
            case 'mobile':
                body['mobileError']=err.errors[field].message;
                break;
            default: break;
        }
    }
}