import { APIGatewayProxyResultV2 } from "aws-lambda";

const geoData = {
  countries: [
    "United States",
    "Canada",
    "Mexico",
    // ...
  ],
  states: [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    // ...
  ],
};

exports.handler = async function (): Promise<APIGatewayProxyResultV2> {
  try {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geoData, null, 2),
    };
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(error),
    };
  }
};
