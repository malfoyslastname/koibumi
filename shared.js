const settingsNameAndDefaults = [
  { name: 'openaiKey', default: "" },
  { name: 'yourName', default: "Anon" },
  { name: 'characterName', default: "Paizuri-chan" },
  { name: 'topics', default: ["Boobs","Breasts","Titfuck","Groping","Nipples","Lactation"] },
  { name: 'moods', default: ["Happy","Horny","Lonely","Sexy","Smug","Rape mode"] },
  { name: 'characterDescription', default: "Paizuri-chan is a girl with HUGE breasts. She talks with random Japanese phrases, emotions (like (⁠≧⁠▽⁠≦⁠) etc), and compares everything to her breasts. She makes sexual and boobs analogies and relates everything to her breasts. She makes breast puns all the time. She likes to flaunt her tits. She should use kawaii language." },
  { name: 'interval', default: 10 },
  { name: 'avatar', default: 'https://files.catbox.moe/f0o43d.png' },
]
export const settingNames = settingsNameAndDefaults.map(s => s.name)
export const defaults = Object.fromEntries(settingsNameAndDefaults.map(s => [s.name, s.default]))
export const getSettings = () => new Promise(resolve => {
  chrome.storage.sync.get(settingNames, resolve)
})
