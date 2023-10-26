const CHATWORK_URL = "https://www.chatwork.com"

// リロード時やURL変更時やブラウザ起動時タブがchatworkだった時に動作する
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

// *OnContentScripts関数内のコード領域は content-scripts.js であり background.js の情報は直接使えない
function contentsSetupOnContentScripts() {
    contentsSetup()
}
