import sqlite from "sqlite3";
import { Film } from './FilmModel.js';

const db = new sqlite.Database("films.db", (err) => {
    if (err) throw err;
});



export const getAllFilms = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT films.* " +
            "FROM films";
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else {
                const films = rows.map((f) => new Film(f.id, f.title, f.isFavorite, f.watchDate, f.rating, f.userId));
                resolve(films);
            }
        });
    });
};

export const getAllFavorites = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT films.* " +
            "FROM films " +
            "WHERE films.isFavorite = 1";
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else {
                const films = rows.map((f) => new Film(f.id, f.title, f.isFavorite, f.watchDate, f.rating, f.userId));
                resolve(films);
            }
        });
    });
};

export const getMostRated = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT films.* " +
            "FROM films " +
            "WHERE films.rating = 5";
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else {
                const films = rows.map((f) => new Film(f.id, f.title, f.isFavorite, f.watchDate, f.rating, f.userId));
                resolve(films);
            }
        });
    });
};

export const getLastMonthWatch = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT films.* " +
            "FROM films " +
            "WHERE films.watchDate >= date('now', '-1 month')";
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else {
                const films = rows.map((f) => new Film(f.id, f.title, f.isFavorite, f.watchDate, f.rating, f.userId));
                resolve(films);
            }
        });
    });
};

export const getUnseen = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT films.* " +
            "FROM films " +
            "WHERE films.watchDate IS NULL";
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else {
                const films = rows.map((f) => new Film(f.id, f.title, f.isFavorite, f.watchDate, f.rating, f.userId));
                resolve(films);
            }
        });
    });
};

export const getFilmById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT films.* " +
            "FROM films "+
            "WHERE films.id = ?";
        db.get(sql, [id], (err, row) => {
            if(err)
                reject(err);
            else if(row !== undefined)
                resolve(new Film(row.id, row.title, row.isFavorite, row.watchDate, row.rating, row.userId));
            else
                resolve("Film not available, check the id.");
        });
    });
};

// Function to create a new film
export const createFilm = (title, isFavorite, watchDate, rating, userId) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO films(title, isFavorite, watchDate, rating, userId) VALUES (?,?,?,?,?)";
        db.run(sql, [title, isFavorite, watchDate, rating, userId], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(this.lastID);
            }
        });
    });
}

// Function to update a film
export const updateFilm = (id, title, isFavorite, watchDate, rating, userId) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE films SET title=?, isFavorite=?, watchDate=?, rating=?, userId=? WHERE id = ?";
        db.run(sql, [title, isFavorite, watchDate, rating, userId, id], function (err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
}

// Function to update a rating
export const updateRating = (id, rating) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE films SET rating=? WHERE id = ?";
        db.run(sql, [rating, id], function (err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
}

// Function to update a isFavorite
export const updateIsFavorite = (id, isFavorite) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE films SET isFavorite=? WHERE id = ?";
        db.run(sql, [isFavorite, id], function (err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
}

// Function to delete a film
export const deleteFilm = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM films WHERE films.id = ?";
        db.run(sql, [id], function (err) {
            if (err) reject(err)
            else resolve(this.changes);
        });
    });
}