const settingsNameAndDefaults = [
  { name: 'openaiKey', default: "" },
  { name: 'yourName', default: "Anon" },
  { name: 'characterName', default: "Paizuri-chan" },
  { name: 'topics', default: ["Boobs","Breasts","Titfuck","Groping","Nipples","Lactation"] },
  { name: 'moods', default: ["Happy","Horny","Lonely","Sexy","Smug","Rape mode"] },
  { name: 'characterDescription', default: "Paizuri-chan is a girl with HUGE breasts. She talks with random Japanese phrases, emotions (like (⁠≧⁠▽⁠≦⁠) etc), and compares everything to her breasts. She makes sexual and boobs analogies and relates everything to her breasts. She makes breast puns all the time. She likes to flaunt her tits. She should use kawaii language." },
  { name: 'interval', default: 10 },
]
const settingNames = settingsNameAndDefaults.map(s => s.name)
const defaults = Object.fromEntries(settingsNameAndDefaults.map(s => [s.name, s.default]))
const withSettings = callback => chrome.storage.sync.get(settingNames, callback)

chrome.runtime.onMessage.addListener(request => {
  withSettings(settings => {
    if (request.action === 'requestLoveLetter' && settings.openaiKey?.length > 0) {
      console.log('received request')
      fetchLoveLetterTxt(settings)
        .then(txt => {
          console.log('here3')
          byId('loveLetter')?.remove()
          document.body.insertAdjacentHTML('beforeend', loveLetterMarkup(txt))
          setTimeout(() => {
            byId('loveLetter').style.opacity = '1'
          }, 100)
          byId('dismissButton').addEventListener('click', () => {
            byId('loveLetter').remove()
          })
        })
    }

  })
})

const fetchLoveLetterTxt = settings => {
  const mood = randomEl(settings.moods)
  const topic = randomEl(settings.topics)
  return fetch("https://api.openai.com/v1/chat/completions", {
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
            `Take on the role of ${settings.characterName} and write a text message in character to ${settings.yourName}. The mood in the message should be ${mood}, and talk about ${topic}. It should be short, 2-3 lines. Do not include quotation marks. ${settings.characterDescription}\n\n`
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
    .then(r => r.json())
    .then(j => j.choices[0].message.content)
}

const byId = id => document.getElementById(id)

const randomEl = arr => {
  const elIndex = Math.floor(Math.random() * arr.length)
  return arr[elIndex]
}

const loveLetterMarkup = content => `
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
    "
  >
    <div
      id="dismissButton"
      style="
        float: right;
        cursor: pointer;
      "
    >
      ❌
    </div>
    <div>
      ${content}
    </div>
  </div>
`
