import { CHATCONV_NAME, SETTING_STORAGE_KEY } from "./global-settings.js"
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
        // content-scripts.js は手動で読み込む。manifestに任せていると拡張機能の新規インストール時にすでにタブが開かれている場合に読み込まれないため
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content-scripts.js"]
        })
            .then(() => {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: contentsSetupOnContentScripts,
                    args: [CHATCONV_NAME]
                })
                    .then(() => {
                    })
                    .catch((err) => {
                        throw err
                    })
            })
            .catch((err) => {
                throw err
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

// *OnContentScripts関数は background.js の情報は参照できない状態で実行される
// ref. https://developer.chrome.com/docs/extensions/reference/scripting/#type-ScriptInjection
// その代わりに content-scripts.js の情報は参照できるように保証している
function contentsSetupOnContentScripts(chatconvName) {
    contentsSetup(chatconvName)
}
