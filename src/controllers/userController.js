const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const server = require('../server');
//const cash_pool = require('../config/db');
//var cash ='';

/*exports.updateCash = async (req, res, next) => {
    try {
      if (cash.length == 0) {
        const result = await cash_pool.query('SELECT post_number, author, text FROM (SELECT text, author, ROW_NUMBER() OVER (order by timestamp desc) as post_number FROM public.feeds) where (post_number >= 1) and (post_number <= 1000)');
        cash=result;
        console.log('cash updated');
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    next();
  };*/
 /* 
  exports.getPostFeed = async (req, res) => {
    const { offset, limit } = req.body;
    var result = '';
    var offset_lim = Number(offset) + Number(limit);
    try {
      if (offset_lim > 1000) {
        result = await cash_pool.query('SELECT post_number, author, text FROM (SELECT text, author, ROW_NUMBER() OVER (order by timestamp desc) as post_number FROM public.feeds) where (post_number >= $1) and (post_number <= $2) ', [offset, offset_lim]);
        console.log('result from DB');
        res.status(200).json(result.rows);
  }
      else {
        let out_buff=[];
        for (let i = Number(offset); i < offset_lim; i++ ) {
          out_buff.push(cash.rows[i]);
        }
        res.status(200).json(out_buff);
        console.log('result from cash');
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };*/
  
  exports.getList = async (req, res) => {
    const { id_sender, id_receiver } = req.body;
    try {
      result = await pool.query('SELECT * FROM posts where (id_sender=$1) and (id_receiver=$2) or (id_sender=$2) and (id_receiver=$1) ORDER BY timestamp DESC', [id_sender, id_receiver]);
      res.status(200).json(result.rows);
    } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.postSend = async (req, res) => {
  const { id_sender,id_receiver, text } = req.body;
  try {
    const result = await pool.query('INSERT INTO posts(id_sender, id_receiver, text)	VALUES ($1, $2, $3)', [id_sender,id_receiver, text]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/*
exports.postCreate = async (req, res) => {
  const { author, text } = req.body;
  try {
    const result = await pool.query('INSERT INTO public.feeds (author, text) VALUES ($1, $2)  RETURNING *', [author, text]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  cash ='';
};*/

/*
exports.getUserSearch = async (req, res) => {
  const { first_name, second_name } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM people where first_name LIKE $1 and second_name LIKE $2', [first_name, second_name]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.loginUser = async (req, res) => {
  const { id, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1 and password = $2', [id,crypto.createHash('sha256').update(password).digest('hex')]);
//    const result = await pool.query('SELECT password FROM users WHERE id = $1', [id]);
    if (result.rowCount>0) {
      res.status(200).send(jwt.sign(id,password));
    } else {
      res.status(200).send('Incorrect login / password');
    }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
*/
/*exports.getUser = async (req, res) => {
  const {id} = req.body;
try {
  const result = await pool.query('SELECT * FROM people WHERE id = $1', [id]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};*/
/*
exports.createUser = async (req, res) => {
  const { first_name, second_name, sex, age, city, interests, password } = req.body;
  try {
    const result = await pool.query('INSERT INTO users (first_name, second_name, sex, age, city, interests, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', [first_name, second_name, sex, age, city, interests, crypto.createHash('sha256').update(password).digest('hex')]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
*/
/*exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
*/
//module.exports = userController;