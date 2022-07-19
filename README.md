# Progetto di Programmazione Avanzata 2022

L’applicazione permette agli utenti di utilizzare un sistema che consente di gestire delle aste. 


* Brugiavini Alessio
* Di Zinno Donato


Il lavoro è stato svolto totalmente a distanza per via della distanza geografica. Abbiamo comunicato tramite Microsoft Teams, sfruttando la condivisione schermo per lavorare in maniera più fluida. Tutto lo sviluppo è stato riportato sul repository di GitHub, come visibili dallo storico dei commits.

## Use case

Tramite il diagramma “Use case” sono stati modellati i requisiti richiesti nelle specifiche di progetto.
A sinistra del diagramma ci sono due tipologie di utenti: **Bid partecipant** e **Bid creator** (estensione dell’user) e **Admin**.
Queste richieste interagiscono con degli attori interni, che sono: il framework NodeJS, la libreria Express e Sequelize, un ORM di Nodejs,  e il database MySQL.

![Alt Text](https://github.com/Donato1992/ProgAvanzata-Donato-Alessio/blob/main/Img/caso%20d%20uso%20.png)

*	**Login**: permette di effettuare il login ad un dato utente. (Bid partecipant, Bid creator, Admin)
*	**Search Auction**: permette di cercare un oggetto di interesse(Bid partecipant, Bid creator)
*	**Place bid**: permette di piazzare un’offerta (Bid partecipant)
*	**Check wallet**: permette di visualizzare il saldo corrente(Bid partecipant)
*	**Post auction**: permette di creare una nuova asta( Bid creator)
*	**Credit charge**: permette di ricaricare il credito di un dato utente (Admin)
*	**Check auction statistics**: permette di controllare le statistiche delle aste (Admin)
*	**Propose new purchase condition**: permette di proporre una nuova condizione di acquisto (Bid creator)
*	**Auction history**: permette di vedere lo storico delle aste e quelle che si sono aggiudicate (Bid partecipant)


## Schema ER Database

Lo schema Entità Relazione del database progettato prevede 3 tabelle:

1)	**Users** : contente le informazioni di ogni utente
2)	**Auctions** : contenente le informazioni di un’asta
3)	**Offers** : contenente le informazioni sulle offerte

![Alt Text](https://github.com/Donato1992/ProgAvanzata-Donato-Alessio/blob/main/Img/DB.png)


## MySql

La scelta di utilizzare MySql deriva dal fatto che non abbiamo una grande quantità di dati da gestire, ed è più semplice da utilizzare per via della presenza della GUI. Inoltre è essendo uno strumento flessibile e scalabile, è utile nelle applicazioni web per quanto riguarda il lungo periodo.
Considerando il nostro DB, abbiamo la tabella user che rappresenta i dati dei singoli utenti, con un attributo ruolo che descrive appunto ciò che poi l’utente può fare o meno.
La tabella Auctions contiene tutto ciò che è relativo ad un asta, l’attributo nuova proposta è relativo alla possibilità di effettuare un compra subito.


## UML

Prima di andare a strutturare il backend Node, Express, Postman abbiamo definito i modelli del nostro sistema di dati: per ogni tabella presentata nello schema ER è stata creato uno schema che rappresenta la nostra base di dati.
Avendo usato il pattern MVC, ogni tabella sarà collegata al proprio controller che si occuperà di gestire le chiamate CRUD preposte.
La gestione delle rotte, è stata implementata utilizzando la classe Router della libreria express, andando a risolvere le richieste attraverso il Service. Le rotte fanno utilizzo del pattern Middleware per gestire l'autenticazione degli utenti tramite token JWT.

![Alt Text](https://github.com/Donato1992/ProgAvanzata-Donato-Alessio/blob/main/Img/class_diagram.png)


## Pattern utilizzati

1)	**Middleware**: Permette, all'interno delle rotte, di gestire l'autenticazione degli utenti tramite token JWT.
2)  **MVC**: Usato per gestire la struttura del backend.



## Documentazione tecnica

L'applicazione è avviabile nella sua interezza attraverso il comando docker-compose -f docker-compose.yaml up da lanciare nella root del progetto, e poi lanciando node server.js sempre dalla root di progetto. Nella versione di sviluppo vengono avviati i seguenti servizi:
-	MySql: porta 7098
-	Node: porta 8080

Le richieste implementate richiedono un’autenticazione attraverso token JWT, si possono utilizzare quelli contenuti nel file .env
Tutte le richieste sono state testate attraverso Postman.
Durante il testing delle chiamate, al posto di /:idclasse inserire il numero id relativo alla classe che si vuole testare. 


| Method | Name                                          | Url                                                                                              | Status |
|--------|-----------------------------------------------|--------------------------------------------------------------------------------------------------|--------|
| POST   | Aggiungere asta                               | http://localhost:8080/api/aste/addAsta                                                           | 200    |
| PUT    | Avvio Asta                                    | http://localhost:8080/api/aste/avvioAsta/:idasta                                                 | 200    |
| POST   | Aggiungere Offerta                            | http://localhost:8080/api/aste/addOffertaToken/:idasta                                           | 200    |
| PUT    | Aggiungere Proposta                           | http://localhost:8080/api/aste/addProposta/:idasta                                               | 200    |
| PUT    | Ricarica conto Utente                         | http://localhost:8080/api/aste/ricarica/:idutente                                		    | 200    |
| PUT    | Round                                         | http://localhost:8080/api/aste/roundAsta/:idasta                                                 | 200    |
| PUT    | Scalare Conto                                 | http://localhost:8080/api/aste/ScalaConto/:idasta						    | 200    |
| GET    | Spesa Effettuata                              | http://localhost:8080/api/aste/spesaEffettuata                                                   | 200    |
| GET    | Statistiche Asta                              | http://localhost:8080/api/aste/statisticheAsta                                                   | 200    |
| GET    | Storico Periodo                               | http://localhost:8080/api/aste/storico      						    | 200    | 
| GET    | Credito Residuo                               | http://localhost:8080/api/aste/creditoResiduo                                                    | 200    | 
| POST   | Vincita Asta             		         | http://localhost:8080/api/aste/vincitaAsta                                                       | 200    | 
| GET    | Visualizza Stato Asta         	         | http://localhost:8080/api/aste/stateAsta                                                         | 200    |
| GET    | Aste Aperte            		         | http://localhost:8080/api/aste/getApertaAstaOfferta                                              | 200    |
| POST   | Login		                         | http://localhost:8080/api/aste/login/idautente                                                   | 200    |
| POST   | Login \(Token non valido\)                    | http://localhost:8080/api/aste/login/idautente                                                   | 403    |
| POST   | Login \(Utente Non Autorizzato\)            	 | http://localhost:8080/api/aste/login/idautente                                                   | 401    |
| POST   | Aggiungere Offerta \(Token non valido\)       | http://localhost:8080/api/aste/addOffertaToken/:idasta                                           | 403    |
| POST   | Aggiungere Offerta \(Credito Insufficiente\)  | http://localhost:8080/api/aste/addOffertaToken/:idasta                                           | 403    |
| POST   | Aggiungere asta \(Messagge Error\)            | http://localhost:8080/api/aste/addAsta                                                           | 400    |
| GET    | Credito Residuo \(Token non valido\)          | http://localhost:8080/api/aste/creditoResiduo                                                    | 403    |
| PUT    | Ricarica conto Utente \(Token non valido\)    | http://localhost:8080/api/aste/ricarica/:idutente                                		    | 403    |
| PUT    | Scalare Conto \(Token non valido\)            | http://localhost:8080/api/aste/ScalaConto/:idasta						    | 403    | 
