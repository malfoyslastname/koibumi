const byId = id => document.getElementById(id)

const populateField = async settingName => {
  const shared = await import(chrome.runtime.getURL("shared.js"))
  const settings = await shared.getSettings()
  const stringVal
    = Array.isArray(settings[settingName])
    ? settings[settingName].join(',')
    : settings[settingName] == undefined
    ? shared.defaults[settingName]
    : settings[settingName]
  byId(settingName).value = stringVal
}

const onSaveSettings = async event => {
  event.preventDefault()
  const { defaults, settingNames } = await import(chrome.runtime.getURL("shared.js"))
  const stringEntry = settingName => byId(settingName).value || defaults[settingName]
  const numEntry = settingName => parseInt(byId(settingName).value ?? defaults[settingName], 10)
  const stringArrEntry = settingName => byId(settingName).value.split(',') || defaults[settingName]
  const newSettings = Object.fromEntries(
    settingNames.map(name => [
      name,
      ['topics', 'moods'].includes(name)
        ? stringArrEntry(name)
        : isNaN(byId(name).value)
        ? stringEntry(name)
        : numEntry(name)
    ])
  )
  chrome.storage.sync.set(newSettings, () => alert('Settings saved'))
}

document.addEventListener('DOMContentLoaded', async () => {
  const shared = await import(chrome.runtime.getURL("shared.js"))
  shared.settingNames.forEach(populateField)
  byId('settings-form').addEventListener('submit', onSaveSettings)
})
