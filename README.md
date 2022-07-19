# Progetto di Programmazione Avanzata 2022

L’applicazione permette agli utenti di utilizzare un sistema che consente di gestire delle aste. 
-Brugiavini Alessio
-Di Zinno Donato

Il lavoro è stato svolto totalmente a distanza per via della distanza geografica. Abbiamo comunicato tramite Microsoft Teams, sfruttando la condivisione schermo per lavorare in maniera più fluida. Tutto lo sviluppo è stato riportato sul repository di GitHub, come visibili dallo storico dei commits.

## Use case

Tramite il diagramma “Use case” sono stati modellati i requisiti richiesti nelle specifiche di progetto.
A sinistra del diagramma ci sono due tipologie di utenti: **Bid partecipant** e **Bid creator** (estensione dell’user) e **Admin**.
Queste richieste interagiscono con degli attori interni, che sono: il framework NodeJS, la libreria Express e Sequelize, un ORM di Nodejs,  e il database MySQL.

![Alt Text](https://github.com/Donato1992/ProgAvanzata-Donato-Alessio/blob/main/Img/caso%20d%20uso%20.png)

•	**Login**: permette di effettuare il login ad un dato utente. (Bid partecipant, Bid creator, Admin)
•	**Search Auction**: permette di cercare un oggetto di interesse(Bid partecipant, Bid creator)
•	**Place bid**: permette di piazzare un’offerta (Bid partecipant)
•	**Check wallet**: permette di visualizzare il saldo corrente(Bid partecipant)
•	**Post auction**: permette di creare una nuova asta( Bid creator)
•	**Credit charge**: permette di ricaricare il credito di un dato utente (Admin)
•	**Check auction statistics**: permette di controllare le statistiche delle aste (Admin)
•	**Propose new purchase condition**: permette di proporre una nuova condizione di acquisto (Bid creator)
•	**Auction history**: permette di vedere lo storico delle aste e quelle che si sono aggiudicate (Bid partecipant)


## Schema ER Database

Lo schema Entità Relazione del database progettato prevede 4 tabelle:
•	**Users** : contente le informazioni di ogni utente
•	**Auctions** : contenente le informazioni di un’asta
•	**Offers** : contenente le informazioni sulle offerte

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

| Method | Name                                 | Url                                                                                              | Status | Time  |
|--------|--------------------------------------|--------------------------------------------------------------------------------------------------|--------|-------|
| GET    | Base Test                            | http://localhost:3000                                                                            | 200    | 3 ms  |
| GET    | Auth Test                            | http://localhost:3000/api                                                                        | 200    | 6 ms  |
| POST   | New Job                              | http://localhost:3000/api/newJob                                                                 | 200    | 18 ms |
| GET    | Job Status                           | http://localhost:3000/api/getJobStatus/62a86a015b47a2244de5b2b5                                  | 200    | 9 ms  |
| GET    | Job Info                             | http://localhost:3000/api/getJobInfo/62a86a015b47a2244de5b2b5                                    | 200    | 9 ms  |
| GET    | History                              | http://localhost:3000/api/getHistory                                                             | 200    | 38 ms |
| GET    | History \(with time params\)         | http://localhost:3000/api/getHistory?t\_min=2022\-06\-14T13:24:36Z&t\_max=2022\-06\-14T14:24:36Z | 200    | 36 ms |
| GET    | Check User Credit                    | http://localhost:3000/api/getUserCredit                                                          | 200    | 8 ms  |
| GET    | Check User Credit Copy               | http://localhost:3000/api/getUserCredit                                                          | 200    | 11 ms |
| GET    | Charge Credit                        | http://localhost:3000/api/chargeCredit?user\_email=lorenzodag@example\.com&amount=10             | 200    | 12 ms |
| GET    | Auth Test \(NO AUTH\)                | http://localhost:3000/api                                                                        | 403    | 2 ms  |
| GET    | Auth Test \(EMPTY AUTH\)             | http://localhost:3000/api                                                                        | 403    | 5 ms  |
| GET    | Auth Test \(INVALID TOKEN\)          | http://localhost:3000/api                                                                        | 403    | 2 ms  |
| GET    | Auth Test \(WRONG JWT KEY\)          | http://localhost:3000/api                                                                        | 403    | 4 ms  |
| GET    | Auth Test \(USER NOT FOUND\)         | http://localhost:3000/api                                                                        | 403    | 7 ms  |
| GET    | Job Status \(INVALID ID\)            | http://localhost:3000/api/getJobStatus/62a86a015b474de5b2b5                                      | 400    | 6 ms  |
| GET    | Job Info \(INVALID ID\)              | http://localhost:3000/api/getJobInfo/62a86a015b474de5b2b5                                        | 400    | 5 ms  |
| GET    | History \(USER W/O JOBS\)            | http://localhost:3000/api/getHistory                                                             | 200    | 7 ms  |
| GET    | Charge Credit \(NO ADMIN\)           | http://localhost:3000/api/chargeCredit?user\_email=lorenzodag@example\.com&amount=1              | 403    | 9 ms  |
| GET    | Charge Credit \(MISSING QUERY\)      | http://localhost:3000/api/chargeCredit                                                           | 400    | 5 ms  |
| GET    | Charge Credit \(NEGATIVE AMOUNT\)    | http://localhost:3000/api/chargeCredit?user\_email=lorenzodag@example\.com&amount=\-1            | 400    | 7 ms  |
| GET    | Charge Credit \(WRONG EMAIL\)        | http://localhost:3000/api/chargeCredit?user\_email=emailnonesistente@example\.com&amount=1       | 400    | 8 ms  |
| POST   | New Job \(NOT ENOUGH CREDIT\)        | http://localhost:3000/api/newJob                                                                 | 401    | 10 ms |
| POST   | New Job \(MISSING sess\_id\)         | http://localhost:3000/api/newJob                                                                 | 400    | 6 ms  |
| POST   | New Job \(MISSING n\_pred\)          | http://localhost:3000/api/newJob                                                                 | 400    | 7 ms  |
| POST   | New Job \(MISSING given\_points\)    | http://localhost:3000/api/newJob                                                                 | 400    | 8 ms  |
| POST   | New Job \(given\_points EMPTY LIST\) | http://localhost:3000/api/newJob                                                                 | 400    | 4 ms  |
| POST   | New Job \(given\_points LEN=1\)      | http://localhost:3000/api/newJob                                                                 | 400    | 6 ms  |
| POST   | New Job \(INVALID POINTS\)           | http://localhost:3000/api/newJob                                                                 | 400    | 6 ms  |
