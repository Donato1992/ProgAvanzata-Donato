const { urlencoded } = require('express');
const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios').default;
require('dotenv').config()
const db = require ('../models')

const User= db.user
const app = express();


app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});




//verifico se il token è giusto
const provaPost= async(req, res) => {
      res.json({
        message: 'Post created...',
        nome: req.user
      });
    }


//Qui vado a fare il Login Prendendo i dati dell'utente che è loggato
const getLogin=async (req, res) => {
  // Prendo L'utente
  //La proprietà Raw mi permette di avere un
  let utente =await User.findOne({where: {id: req.params.idacc}, raw:true})
  console.log("Ruolo Preso"+utente.nome)

  //Log In tramite dove con Expires In andiamo a settare il tempo della sessione
  const token=jwt.sign({utente}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '240s' })
  console.log('Mio Token'+token)
    res.json({
        token
    });
};


//Verifica Token
const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, nome) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }

      // Qui Setto l'utente che ho codificato
      req.user = nome;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
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
        console.log("VEDIAMO CHE RUOLO"+nome.utente.role)
        if (nome.utente.role!=='bid-creator')
        {
            return res.status(401).json("Lei non è Autorizzato a Questa Operazione");
        }
        
  
        // Qui Setto l'utente che ho codificato
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
        console.log("VEDIAMO CHE RUOLO"+nome.utente.role)
        if (nome.utente.role!=='bid-partecipant')
        {
            return res.status(401).json("Lei non è Autorizzato a Questa Operazione");
        }
        
  
        // Qui Setto l'utente che ho codificato
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
        console.log("VEDIAMO CHE RUOLO"+nome.utente.role)
        if (nome.utente.role!=='admin')
        {
            return res.status(401).json("Lei non è Autorizzato a Questa Operazione");
        }
        
  
        // Qui Setto l'utente che ho codificato
        req.user = nome;
        next();
      });
    } else {
      res.status(401).json("Tu non sei autenticato");
    }
  };


module.exports = {
    getLogin,
    provaPost,
    verify,
    verify_bid_creator,
    verify_admin,
    verify_bid_partecipant
}