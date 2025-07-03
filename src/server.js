const express = require('express');
//import express, { json } from 'express';
const app = express();
const routes = require('./routes');
const { body, validationResult } = require('express-validator');
const userController = require('./controllers/userController');


app.use(express.json());

app.post('/post/create', 
body('text').notEmpty(),
body('id_sender').notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  routes
);

//app.use(userController.updateCash);

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});