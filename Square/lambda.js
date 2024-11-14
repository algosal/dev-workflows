import { Client, Environment } from "square";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const client = new Client({
  environment: Environment.Sandbox, // or Environment.Production
  accessToken: process.env.SQUARE_ACCESS_TOKEN, // Access token from .env
});

export const handler = async (event) => {
  try {
    const { sourceId, amount, currency } = event;

    const idempotencyKey = `${new Date().getTime()}`; // Generate unique key for idempotency

    const response = await client.paymentsApi.createPayment({
      sourceId: sourceId,
      idempotencyKey: idempotencyKey,
      amountMoney: {
        amount: amount, // amount in cents
        currency: currency, // e.g., "USD"
      },
      acceptPartialAuthorization: false,
    });

    console.log("Payment created successfully:", response.result);

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          success: true,
          payment: response.result,
        },
        (key, value) => (typeof value === "bigint" ? value.toString() : value) // Convert BigInt to string
      ),
    };
  } catch (error) {
    console.error("Error in createPayment:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message || "An error occurred",
      }),
    };
  }
};
