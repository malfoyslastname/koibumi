const MS_IN_ONE_MIN = 60000
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const queryTab = q => new Promise(resolve => chrome.tabs.query(q, tabs => resolve(tabs[0])))

const showLoveLetter = async settings => {
  const tab = (await queryTab({ active: true, currentWindow: true }))
           ?? (await queryTab({ active: true }))
  console.log("tab found: ", tab)
  if (tab) chrome.tabs.sendMessage(tab.id, { action: 'requestLoveLetter', settings })
}

const main = async () => {
  console.log('main loop begin')
  const shared = await import(chrome.runtime.getURL("shared.js"))
  const settings = await shared.getSettings()
  await showLoveLetter(settings)
  const minsToWait = settings.interval || shared.defaults.interval
  console.log(`Waiting ${minsToWait} minutes.`)
  await sleep((minsToWait) * MS_IN_ONE_MIN)
  return main()
}

main()
