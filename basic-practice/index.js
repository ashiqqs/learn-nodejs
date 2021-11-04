const express = require('express')

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res)=>{

  res.format({
    html: ()=>{
      res.render('pages/contact',{
        name: 'Page'
      })
    },
    json: ()=>{
      res.json({message: 'Hello World'});
    },
    default: ()=>{
      res.status(406).send('Not Acceptable');
    }
    
  });
}
);

app.listen(3000,()=>{
  console.log('server listening on 3000');
})