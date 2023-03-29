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

const byId = id => document.getElementById(id)

const populateField = settingName => {
  chrome.storage.sync.get(settingNames, result => {
    const stringVal
      = Array.isArray(result[settingName])
      ? result[settingName].join(',')
      : result[settingName] == undefined
      ? defaults[settingName]
      : result[settingName]
    byId(settingName).value = stringVal
  })
}
const onSaveSettings = event => {
  event.preventDefault()
  const stringEntry = settingName => byId(settingName).value || defaults[settingName]
  const numEntry = settingName => parseInt(byId(settingName).value ?? defaults[settingName], 10)
  const stringArrEntry = settingName => byId(settingName).value || defaults[settingName]
  const newSettings = Object.fromEntries(
    settingNames.map(name => [
      name,
      Array.isArray(byId(name).value)
        ? stringArrEntry(name)
        : typeof byId(name).value == 'number'
        ? numEntry(name)
        : stringEntry(name)
    ])
  )
  chrome.storage.sync.set(newSettings, () => alert('Settings saved'))
}

document.addEventListener('DOMContentLoaded', () => {
  settingNames.forEach(populateField)
  byId('settings-form').addEventListener('submit', onSaveSettings)
})
