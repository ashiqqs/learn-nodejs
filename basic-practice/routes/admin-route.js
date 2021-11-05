const express = require('express');
const routeLog = require('../middleware/logger');

const adminRouter = express.Router();
adminRouter.use(express.json());
adminRouter.use(routeLog);

adminRouter.get('/', (req, res) => {
    res.send('Admin page');
});

adminRouter.get('/users', (req, res) => {
    res.send('Admin users page');
});

adminRouter.get('/users/:id', (req, res) => {
    res.send(`Admin user page ${req.params.id}`);
});

adminRouter.get('/users/:id/:name', (req, res) => {
    if(req.params.name === 'ashiq') {
        res.send(`Admin user page ${req.params.id} ${req.params.name}`);
    } else {
        throw new Error('Name is not known');
    }
});


module.exports = adminRouter;