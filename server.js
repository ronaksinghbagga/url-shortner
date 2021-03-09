const express = require('express');
const mongoose = require('mongoose');
const app = express();
const shortUrl = require('./models/shortUrl');

mongoose.connect('mongodb://localhost/urlShortner', {
    useNewUrlParser: true, useUnifiedTopology:true
});
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));

app.get('/',async (req,res)=> {
    const shortUrls = await shortUrl.find()
    res.render('index', {shortUrls: shortUrls})
});
app.post('/shortUrls', async(req,res) => {
    await shortUrl.create({full:req.body.fullUrl })
    res.redirect('/')
});

app.get('/:shortUrl', async (req,res) => {
    const shortURL =  await shortUrl.findOne({short: req.params.shortUrl})
    if(shortURL == null) return res.sendStatus(404)

    shortURL.clicks++
    shortURL.save()

    res.redirect(shortURL.full);
});
app.listen(process.env.PORT || 5000);
