const express = require('express')
const adminRouter = require('./routes/admin-route');
const multer = require('multer');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');

const errMiddlware = (err, req, res, next) => {
  console.log(`Log Error: ${new Date().toLocaleDateString()} - Error on ${req.originalUrl}`);
  res.render('pages/error', {
      message: err.message,
      error: null
  });
}
//adminRouter.use(errMiddlware);

app.get('/', (req, res)=>{
  res.format({
    html: ()=>{
      res.render('pages/home',{
        name: 'Ashiq'
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

//#region Uploading Files

const UPLOAD_PATH = './uploads';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = file.originalname.replace(fileExtension, '')
    .toLowerCase().replace(' ','_')+'_'+Date.now()+fileExtension;
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return cb(new Error('Please upload an image'));
    }
    cb(undefined, true);
  }
});

app.use((err, req, res, next)=>{
  console.log(`Log Error: ${new Date().toLocaleDateString()} - Error on ${req.originalUrl}`);
  if(err instanceof multer.MulterError){
    res.status(500).send(err.message);
  }else{
    next(err);
  }
});



app.post('/upload', upload.fields([
  {name: 'upload', maxCount: 1},
  {name: 'upload-multiple', maxCount: 3}]
  ), (req, res)=>{
  res.json(req.files);
});

//#endregion


app.use('/admin',adminRouter);

app.listen(3000,()=>{
  console.log('server listening on 3000');
})