const { urlencoded } = require('express');
const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios').default;
require('dotenv').config()
const db = require ('../models')

const User= db.user
const app = express();

// Test generico per le API
app.get('/api', (req, res) => {
  res.json({
    message: 'Test generico per le API'
  });
});




//Qui vado a fare il Login Prendendo i dati dell'utente che è loggato
const getLogin=async (req, res) => {
  // Prendo L'utente
  //La proprietà Raw mi permette di avere un Json
  let utente =await User.findOne({where: {id: req.params.idacc}, raw:true})

  //Log In tramite dove con Expires In andiamo a settare il tempo della sessione
  const token=jwt.sign({utente}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '240s' })
  console.log('Mio Token'+token)
    res.json({
        token
    });
};


//Verifica Operazioni per il Bid-Creator
const verify_bid_creator= (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
  
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, nome) => {
        if (err) {
          return res.status(403).json("Token NON VALIDO!");
        }

        if (nome.utente.role!=='bid-creator')
        {
            return res.status(401).json("Lei non è Autorizzato a Questa Operazione");
        }
        
  
        // Qui Setto l'utente che ho codificato Utilizzabile per i miei controller
        req.user = nome;
        next();
      });
    } else {
      res.status(401).json("Tu non sei autenticato");
    }
  };


//Verifica utente Bid-Partecipant
const verify_bid_partecipant= (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
  
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, nome) => {
        if (err) {
          return res.status(403).json("Token NON VALIDO!");
        }
        
        if (nome.utente.role!=='bid-partecipant')
        {
            return res.status(401).json("Lei non è Autorizzato a Questa Operazione");
        }
        
  
        // Qui Setto l'utente che ho codificato Utilizzabile per i miei controller
        req.user = nome;
        next();
      });
    } else {
      res.status(401).json("Tu non sei autenticato");
    }
  };

  const verify_admin= (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
  
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, nome) => {
        if (err) {
          return res.status(403).json("Token NON VALIDO!");
        }
        
        if (nome.utente.role!=='admin')
        {
            return res.status(401).json("Lei non è Autorizzato a Questa Operazione");
        }
        
  
        // Qui Setto l'utente che ho codificato Utilizzabile per i miei controller
        req.user = nome;
        next();
      });
    } else {
      res.status(401).json("Tu non sei autenticato");
    }
  };


module.exports = {
    getLogin,
    verify_bid_creator,
    verify_admin,
    verify_bid_partecipant
}