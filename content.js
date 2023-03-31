const byId = id => document.getElementById(id)
const randomEl = arr => arr[Math.floor(Math.random() * arr.length)]

chrome.runtime.onMessage.addListener(request => {
  ;(async () => {
    console.log('request received')
    const shared = await import(chrome.runtime.getURL("shared.js"))
    const settings = await shared.getSettings()
    if (request.action === 'requestLoveLetter' && settings.openaiKey?.length > 0) {
      console.log('confirmed request is for a love letter')
      const txt = await fetchLoveLetterTxt(settings)
      byId('loveLetter')?.remove()
      document.body.insertAdjacentHTML('beforeend', loveLetterMarkup(txt, settings.avatar))
      setTimeout(() => { byId('loveLetter').style.opacity = '1' }, 100)
      byId('dismissButton').addEventListener('click', () => byId('loveLetter').remove())
    }
  })()
})

const fetchLoveLetterTxt = async settings => {
  const mood = randomEl(settings.moods)
  const topic = randomEl(settings.topics)
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "authorization": `Bearer ${settings.openaiKey}`,
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      messages: [
        {
          role: 'user',
          content:
            `Take on the role of ${settings.characterName} and write a text message in character to ${settings.yourName}.\n\n${settings.characterDescription}\n\nThe mood in the message should be ${mood}, and talk about ${topic}. It should be short, 2-3 lines. Do not include quotation marks.\n\n`
        }
      ],
      temperature: 0.9,
      max_tokens: 200,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      model: 'gpt-3.5-turbo',
      stream: false,
    }),
  })
  const json = await resp.json()
  return json.choices[0].message.content
}

const loveLetterMarkup = (content, avatar) => `
  <div
    id="loveLetter"
    style="
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #f1f1f1;
      border: 3px solid #ccc;
      padding: 20px;
      z-index: 1000000000000;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
      width: 400px;
      border-radius: 5px;
      box-shadow: 5px 5px 5px rgba(0,0,0,0.3);
      font-size: 14px;
      font-family: Arial, sans-serif;
      color: black;
    "
  >
    ${closeBtn}
    ${singleMsg(avatar, content)}
  </div>
`

const closeBtn = `
  <div
    id="dismissButton"
    style="
      float: right;
      cursor: pointer;
      padding: 5px;
    "
  >
    ❌
  </div>
`

const singleMsg = (avatarUrl, msgTxt) => `
  <div style="display: flex;">
    <div style="flex: 0 0 auto;">
      <div
        style="
          width: 50px;
          height: 50px;
          overflow: hidden;
          margin-right: 10px;
          border-radius: 5px;
        "
      >
        <img
          src="${avatarUrl}"
          alt="avatar"
          style="width: 100%; height: auto; object-fit: cover;"
        >
      </div>
    </div>
    <div style="flex: 1;">
      ${msgTxt}
    </div>
  </div>
`
