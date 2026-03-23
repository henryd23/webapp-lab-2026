import express from 'express';
import * as filmDao from './filmDao.js';

const app = express();
app.use(express.json());  // middleware per leggere JSON nel body delle richieste

// Ricevi ogni film (anche secondo eventuali filtri)
app.get('/api/films', (req, res) => {
    const filter = req.query.filter; // undefined se non passato

    let queryPromise;
    if (filter == 'favorites') queryPromise = filmDao.getAllFavorites();
    else if (filter == 'mostrated') queryPromise = filmDao.getMostRated();
    else if (filter == 'lastmonth') queryPromise = filmDao.getLastMonthWatch();
    else if (filter == 'unseen') queryPromise = filmDao.getUnseen();
    else queryPromise = filmDao.getAllFilms();  // nessun filtro = tutti

    queryPromise
        .then(films => res.json(films))
        .catch(err => res.status(500).json({error: err.message}));
});

// Ricevi film dato un Id
app.get('/api/films/:id', (req, res) => {
    const id = req.params.id;

    filmDao.getFilmById(id)
        .then(film => { 
            if (typeof film === 'string') res.status(404).json({error: "Film non trovato!"});
            else res.json(film);
        })
        .catch(err => res.status(500).json({error: err.message}));
});

// Crea nuovo film
app.post('/api/films', (req, res) => {
    const title = req.body.title;
    const isFavorite = req.body.isFavorite;
    const watchDate = req.body.watchDate;
    const rating = req.body.rating;
    const userId = req.body.userId;

    filmDao.createFilm(title, isFavorite, watchDate, rating, userId)
        .then(film => res.status(201).json({id: film, success: "Film creato con successo."}))
        .catch(err => res.status(500).json({error: err.message}));
});

// Aggiorna un film esistente
app.put('/api/films/:id', (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const isFavorite = req.body.isFavorite;
    const watchDate = req.body.watchDate;
    const rating = req.body.rating;
    const userId = req.body.userId;

    filmDao.updateFilm(id, title, isFavorite, watchDate, rating, userId)
        .then(film => res.status(200).json({id: film, success: "Film aggiornato con successo."}))
        .catch(err => res.status(500).json({error: err.message}));
})

// Aggiorna il rating di un film
app.patch('/api/films/:id/rating', (req, res) => {
    const id = req.params.id;
    const rating = req.body.rating;

    filmDao.updateRating(id, rating)
        .then(film => res.status(200).json({id: film, success: "Rating di film aggiornato con successo."}))
        .catch(err => res.status(500).json({error: err.message}));
})

// Aggiorna il rating di un film
app.patch('/api/films/:id/isfavorite', (req, res) => {
    const id = req.params.id;
    const isFavorite = req.body.isFavorite;

    filmDao.updateIsFavorite(id, isFavorite)
        .then(film => res.status(200).json({id: film, success: "IsFavorite di film aggiornato con successo."}))
        .catch(err => res.status(500).json({error: err.message}));
})

// Elimina un film dato il suo id
app.delete('/api/films/:id', (req, res) => {
    const id = req.params.id;

    filmDao.deleteFilm(id)
        .then(film => res.status(204).json({id: film, success: "Film eliminato con successo."}))
        .catch(err => res.status(500).json({error: err.message}));
})

app.listen(3000, () => console.log('Server avviato su http://localhost:3000'));
