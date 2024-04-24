export default async function sendWebhookResponse(url: string, data: any) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Failed to send webhook response:", response.statusText);
    }
  } catch (error) {
    console.error("Error sending webhook:", error);
  }
}
