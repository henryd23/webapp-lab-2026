import dayjs from "dayjs";

// Movie constructor
export function Film (id, title, isFavorite=false, watchDate, rating, userId=1) {
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