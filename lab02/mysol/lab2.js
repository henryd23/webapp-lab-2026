import dayjs from "dayjs";
import sqlite from "sqlite3";

// Movie constructor
function Film (id, title, isFavorite=false, watchDate, rating, userId=1) {
    this.id = id;
    this.title = title;
    this.isFavorite = isFavorite;
    this.watchDate = watchDate ? dayjs(watchDate).format("YYYY-MM-DD") : null;
    this.rating = rating>=1 && rating<=5 ? rating : null;
    this.userId = userId;

    // To print them in a more readable way (as a list)
    this.toString = () => {
        return `Id: ${this.id}, Title: ${this.title}, isFavorite: ${this.isFavorite}, WatchDate: ${this.watchDate}, Rating: ${this.rating}, UserId: ${this.userId}`;
    };
}

// MovieLibrary constructor
function FilmLibrary () {
    const db = new sqlite.Database("films.db", (err) => {
        if (err) throw err;
    });

    this.getAllFilms = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT films.* "+
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

    this.getAllFavorites = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT films.* "+
                        "FROM films "+
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

    this.getWatchedBefore = (watchDate) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT films.* "+
                        "FROM films "+
                        "WHERE films.watchDate < ?";
            db.all(sql, [watchDate], (err, rows) => {
                if (err) reject(err);
                else {
                    const films = rows.map((f) => new Film(f.id, f.title, f.isFavorite, f.watchDate, f.rating, f.userId));
                    resolve(films);
                }
            });
        });
    };

    this.getFilmsByTitle = (string) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT films.* "+
                        "FROM films "+
                        "WHERE films.title LIKE ?";
            db.all(sql, ["%"+string+"%"], (err, rows) => {
                if (err) reject(err);
                else {
                    const films = rows.map((f) => new Film(f.id, f.title, f.isFavorite, f.watchDate, f.rating, f.userId));
                    resolve(films);
                }
            });
        });
    };

    // Function to store a new film
    this.storeFilm = (film) => {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO films(id, title, isFavorite, watchDate, rating, userId) VALUES (?,?,?,?,?,?)";
            db.run(sql, [film.id, film.title, film.isFavorite, film.watchDate, film.rating, film.userId], function(err) {
                if(err) {
                    console.log("\nNew film was not added!");
                    reject (err);

                }
                else {
                    console.log("\nNew film succesfully added.");
                    resolve(this.lastID);
                }
            });
        });
    }

    // Function to delete a film
    this.deleteFilm = (id) => {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM films WHERE films.id = ?";
            db.run(sql, [id], function(err) {
                if(err) {
                    console.log("\nFilm (id: "+id+") was not deleted!");
                    reject (err);

                }
                else {
                    console.log("\nFilm (id: "+id+") successfully deleted.");
                    resolve(this.changes);
                }
            });
        });
    }

    // Function to delete all watchDates
    this.deleteWatchDates = () => {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE films SET watchDate = null";
            db.run(sql, [], function(err) {
                if(err) {
                    console.log("\nDelete every watchDate was not possible!");
                    reject (err);

                }
                else {
                    console.log("\nSuccessfully deleted every watchDate.");
                    resolve(this.changes);
                }
            });
        });
    }
}

function main() {
    // Create the movie library
    const filmLib = new FilmLibrary();

    // Retrieve all film as a Promise
    filmLib.getAllFilms().then(films => {
        console.log("\nFilm recuperati tramite Promise:");
        films.forEach(f => console.log(f.toString()));
    });

    // Retrieve all favorite film as a Promise
    filmLib.getAllFavorites().then(films => {
        console.log("\nFilm Preferiti recuperati tramite Promise:");
        films.forEach(f => console.log(f.toString()));
    });

    // Retrieve all films watched before a date as a Promise
    filmLib.getWatchedBefore("2026-03-20").then(films => {
        console.log("\nFilm visti prima del 24-02-2026 recuperati tramite Promise:");
        films.forEach(f => console.log(f.toString()));
    });

    // Retrieve all films whose title contain a string as a Promise
    filmLib.getFilmsByTitle("ma").then(films => {
        console.log("\nFilm il cui titolo contiene 'ma' recuperati tramite Promise:");
        films.forEach(f => console.log(f.toString()));
    });

    // Store new film and print new database
    //filmLib.storeFilm(filmX).then(() => {
    //    console.log("\nAggiunto alla libreria il film:");
    //    console.log(film6.toString());
    //})

    // Delete film from the library
    //filmLib.deleteFilm(idX).catch(err => console.error(err));

    // Delete every watchDate
    //filmLib.deleteWatchDates().catch(err => console.error(err));

}

main();