export async function handler(event, context) {
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
  const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;

  if (!SLACK_BOT_TOKEN || !SLACK_CHANNEL_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "Missing environment variables" })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const message = body.text || "No message";

    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SLACK_BOT_TOKEN}`
      },
      body: JSON.stringify({
        channel: SLACK_CHANNEL_ID,
        text: message
      })
    });

    const result = await response.json();
    return { statusCode: 200, body: JSON.stringify(result) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) };
  }
}
