const MS_IN_ONE_MIN = 60000
const settingsNameAndDefaults = [
  { name: 'openaiKey', default: "" },
  { name: 'yourName', default: "Anon" },
  { name: 'characterName', default: "Paizuri-chan" },
  { name: 'topics', default: ["Boobs","Breasts","Titfuck","Groping","Nipples","Lactation"] },
  { name: 'moods', default: ["Happy","Horny","Lonely","Sexy","Smug","Rape mode"] },
  { name: 'characterDescription', default: "Paizuri-chan is a girl with HUGE breasts. She talks with random Japanese phrases, emotions (like (⁠≧⁠▽⁠≦⁠) etc), and compares everything to her breasts. She makes sexual and boobs analogies and relates everything to her breasts. She makes breast puns all the time. She likes to flaunt her tits. She should use kawaii language." },
  { name: 'interval', default: 10 },
  { name: 'avatar', default: 'https://files.catbox.moe/c3uuxb.png' },
]
const settingNames = settingsNameAndDefaults.map(s => s.name)
const defaults = Object.fromEntries(settingsNameAndDefaults.map(s => [s.name, s.default]))

const withSettings = callback => chrome.storage.sync.get(settingNames, callback)

const showLoveLetter = () => {
  const showOnTab = tab => {
    withSettings(settings => {
      console.log('about to send request')
      chrome.tabs.sendMessage(tab.id, { action: 'requestLoveLetter', settings })
    })
  }
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0]) {
      showOnTab(tabs[0])
    } else {
      chrome.tabs.query({ active: true }, tabs => {
        if (tabs[0]) showOnTab(tabs[0])
      })
    }
  })
}

withSettings(settings => {
  setInterval(
    () => showLoveLetter(settings),
    settings.interval * MS_IN_ONE_MIN,
  )
})
