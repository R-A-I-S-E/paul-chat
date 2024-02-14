// import * as sanitizeHtml from 'sanitize-html'
export default defineLazyEventHandler(async () => {
  let response = ''
  const webhook = useRuntimeConfig().discordWebhookUrl
  const sendtoDiscord = async (message: string) => {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `**Bug Report**\n${message}`,
        }),

      })
    }
    catch (error) {
      console.error('Error:', error)
      response = 'Error sending the message'
    }
    finally {
      response = 'Message send to RAISE team'
    }
    return response
  }
  return defineEventHandler(async (event) => {
    const message = await readBody(event)
    const cleanedMessage = message
    const request = await sendtoDiscord(cleanedMessage)
    return request
  })
})
