import { SETTING_STORAGE_KEY } from "./global-settings.js"
const CHATWORK_URL = "https://www.chatwork.com"

// リロード時やURL変更時やブラウザ起動時に動作する
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    executeContentScripts(tab)
})
// タブ変更時に動作する
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId)
        .then((tab) => {
            executeContentScripts(tab)
        })
})
// content_scripts側からの要求ごとに動作する
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'jumpToChatconv':
            onJumpToChatconv(message.arg)
            break
        default: break
    }
    sendResponse()
})

function executeContentScripts(tab) {
    try {
        // chatwork以外のタブは何もしない
        if (!tab.url?.startsWith(CHATWORK_URL)) return

        // コンテンツ構築要求
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: contentsSetupOnContentScripts,
        })
    } catch (error) {
        throw error
    }
}

async function onJumpToChatconv(messageLink) {
    const url = encodeURIComponent(messageLink)
    let setting = {}
    const result = await chrome.storage.sync.get(SETTING_STORAGE_KEY)
    if (typeof result[SETTING_STORAGE_KEY] !== 'undefined') {
        setting = result[SETTING_STORAGE_KEY]
    }
    chrome.tabs.create({
        url: `${setting.url}?message_link=${url}`,
        active: false,
    })
}

// *OnContentScripts関数内のコード領域は content-scripts.js であり background.js の情報は直接使えない
function contentsSetupOnContentScripts() {
    contentsSetup()
}
