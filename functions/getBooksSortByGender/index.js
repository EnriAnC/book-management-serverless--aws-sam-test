const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "sa-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));

  try {
    // Consulta para obtener los libros
    const booksParams = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "#entityId = :entityId",
      ExpressionAttributeNames: {
        "#entityId": "entityId"
      },
      ExpressionAttributeValues: {
        ":entityId": "BOOK"
      }
    };

    const commandBooks = new QueryCommand(booksParams);
    console.log("commandBooks: ", commandBooks);
    const booksData = await docClient.send(commandBooks);
    console.log("booksData: ", booksData);
    const books = booksData.Items;
    console.log("books: ", books);

    // Consulta para obtener los géneros
    const genresParams = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "#entityId = :entityId",
      ExpressionAttributeNames: {
        "#entityId": "entityId"
      },
      ExpressionAttributeValues: {
        ":entityId": "GENRE"
      }
    };

    const commandGenres = new QueryCommand(genresParams);
    console.log("commandGenres: ", commandGenres);
    const genresData = await docClient.send(commandGenres);
    console.log("genresData: ", genresData);
    const genres = genresData.Items;
    console.log("genres: ", genres);

    // Mapear géneros y libros
    const booksWithGenres = books.map(book => {
      return {
        ...book,
        genres: genres.filter(genre => book.genreIds && book.genreIds.includes(genre.genreId))
      };
    });
    console.log("booksWithGenres: ", booksWithGenres);
    return booksWithGenres;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw new Error("Could not load items");
  }
}

function mapBookToSchema(book) {
  return {
    bookId: book.bookId,
    title: book.title,
    author: book.authorId,
    pubicationDate: book.pubicationDate,
    genres: book.genres.map(genre => ({ genreId: genre.genreId, name: genre.name }))
  };
}