const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));

  try {
    // Consulta para obtener los libros
    const booksParams = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "entityId = :entityId",
      ExpressionAttributeValues: {
        ":entityId": "BOOK"
      }
    };

    const booksData = await docClient.query(booksParams).promise();
    const books = booksData.Items;

    // Consulta para obtener los géneros
    const genresParams = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "entityId = :entityId",
      ExpressionAttributeValues: {
        ":entityId": "GENRE"
      }
    };

    const genresData = await docClient.query(genresParams).promise();
    const genres = genresData.Items;

    // Mapear géneros a libros
    const booksWithGenres = books.map(book => {
      return {
        ...book,
        genres: genres.filter(genre => book.genreIds && book.genreIds.includes(genre.genreId))
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: booksWithGenres
      }),
    };
  } catch (error) {
    console.error("Error fetching data: ", JSON.stringify(error, null, 2));
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not load items" }),
    };
  }
};
