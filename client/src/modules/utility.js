export const translate = (item, isBook) => {
  const obj = {
    type: item.Type || (isBook ? "Book" : "Movie"),
    id: isBook ? item.ISBN : item.movieId,
    Title: item.Title,
    Rating: item.Rating,
    genre: item.genre,
  };
  if (isBook) {
    obj.authors = item.authors;
    obj.ImageURL = item.ImageURL;
    obj.Description = item.Description;
    obj.NumPages = item.NumPages;
    obj.GoodreadsLink = item.GoodreadsLink;
  } else {
    obj.actors = item.actors;
    obj.directors = item.directors;
    obj.Description = item.Overview;
  }
  return obj;
};
