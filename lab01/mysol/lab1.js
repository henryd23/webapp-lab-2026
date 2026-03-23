import dayjs from "dayjs";

// Movie constructor
function Movie (id, title, favorite=false, watchDate, rating, userId=1) {
    this.id = id;
    this.title = title;
    this.favorite = favorite;
    this.watchDate = watchDate ? dayjs(watchDate) : null;
    this.rating = rating>=1 && rating<=5 ? rating : null;
    this.userId = userId;

    // To print them in a more readable way (as a list)
    this.toString = () => {
        const dateStr = this.watchDate && this.watchDate.isValid ? 
            this.watchDate.format('MMMM D, YYYY') : null;
        return `Id: ${this.id}, Title: ${this.title}, Favorite: ${this.favorite}, Watch date: ${dateStr}, Rating: ${this.rating}, User id: ${this.userId}`;
    };
}

// MovieLibrary constructor
function MovieLibrary () {
    this.movieLibrary = [];

    // Function to add a movie
    this.addMovie = (movie) => {
        this.movieLibrary.push(movie);
    }

    // Function to sort movie by watchDate (ascending, with null at the end)
    this.sortDate = () => {
        const newLibrary = [...this.movieLibrary];
        newLibrary.sort((a, b) => {
            if (!a.watchDate) return 1;
            if (!b.watchDate) return -1;
            return a.watchDate.diff(b.watchDate);
        });
        return newLibrary;
    }

    // Function to sort movie by rating (ascending, with null at the end)
    this.sortRating = () => {
        const newLibrary = [...this.movieLibrary];
        newLibrary.sort((a, b) => {
            if (!a.rating) return 1;
            if (!b.rating) return -1;
            return a.rating - b.rating;
        });
        return newLibrary;
    }

    // Function to remove a movie from the library given its id
    this.removeMovie = (id) => {
        const index = this.movieLibrary.findIndex(movie => movie.id === id);
        if (index > -1) {
            this.movieLibrary.splice(index, 1);
        }
        else {
            console.log("L'id "+id+" non corrisponde a nessun film nella libreria.");
            return;
        }
    }

    // Function to update the rating of a movie
    this.updateRating = (id, rating) => {
        if (rating<1 || rating>5) {
            console.log("Il rating deve essere un valore compreso tra 1 e 5!");
            return;
        }
        const index = this.movieLibrary.findIndex(movie => movie.id === id);
        if (index > -1) {
            this.movieLibrary[index].rating = rating;
        }
        else {
            console.log("L'id "+id+" non corrisponde a nessun film nella libreria!");
            return;
        }
    }
}

function main() {
    // Create the movie library
    const movieLib = new MovieLibrary();

    // Create an object for each movie
    const movie1 = new Movie(1, "Avatar", false, "2026-03-21", 4, 2);
    const movie2 = new Movie(2, "Hangover", true, null, 3, 5);
    const movie3 = new Movie(3, "Dune", false, "2026-02-21", null, 4);
    const movie4 = new Movie(4, "Spiderman", true, "2026-02-23", 6, 7);

    // Add movies to the library
    movieLib.addMovie(movie1);
    movieLib.addMovie(movie2);
    movieLib.addMovie(movie3);
    movieLib.addMovie(movie4);

    // Print Sorted films (by date)
    console.log("\n***** List of films (sorted by date) *****");
    const dateSortedLibrary = movieLib.sortDate();
    dateSortedLibrary.forEach((movie) => console.log(movie.toString()));
    
    // Print Sorted films (by rating)
    console.log("\n***** List of films (sorted by rating) *****");
    const movieSortedLibrary = movieLib.sortRating();
    movieSortedLibrary.forEach((movie) => console.log(movie.toString()));

    // Deleting film #3
    movieLib.removeMovie(3);

    // Printing modified Library
    console.log("\n***** List of films *****");
    movieLib.movieLibrary.forEach((movie) => console.log(movie.toString()));

    // Update rating of film 4
    movieLib.updateRating(4, 5);
    // Printing modified Library
    console.log("\n***** List of films *****");
    movieLib.movieLibrary.forEach((movie) => console.log(movie.toString()));
}

main();