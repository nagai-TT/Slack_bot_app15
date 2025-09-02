export async function handler(event, context) {
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
  const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;
  try {
    const response = await fetch("https://slack.com/api/conversations.history?channel=" + SLACK_CHANNEL_ID, {
      method: "GET",
      headers: { "Authorization": `Bearer ${SLACK_BOT_TOKEN}` }
    });
    const result = await response.json();
    const latest = { OPE1: null, OPE2: null, OPE3: null };
    for (const msg of result.messages) {
      if (!msg.text) continue;
      for (const ope of ["OPE1", "OPE2", "OPE3"]) {
        if (!latest[ope] && msg.text.includes(ope)) {
          latest[ope] = msg.text;
        }
      }
      if (latest.OPE1 && latest.OPE2 && latest.OPE3) break;
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true, latest }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) };
  }
}
