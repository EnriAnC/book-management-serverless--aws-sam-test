import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient(process.env.REGION);
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));

  try {
    // Consulta para obtener los libros
    const genresParams = {
      TableName: TABLE_NAME,
      IndexName: "InverseIndex",
      KeyConditionExpression: "#SK = :SK",
      ExpressionAttributeNames: {
        "#SK": "SK",
      },
      ExpressionAttributeValues: {
        ":SK": "METADATA#GENRE",
      },
    };

    const commandGenres = new QueryCommand(genresParams);
    console.log("command: ", commandGenres);
    const genresData = await docClient.send(commandGenres);
    console.log("genresData: ", genresData);
    const genres = genresData.Items;
    console.log("genres: ", genres);

    return genres;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw new Error("Could not load items");
  }
};
