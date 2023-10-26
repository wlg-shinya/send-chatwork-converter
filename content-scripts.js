function contentsSetup() {
    waitForElement("#_timeLine > div", (messageRoot) => {
        // チャット投稿の根っこ以下の要素に変化があるか監視
        new MutationObserver(() => {
            // 各メッセージのアクションメニューに独自メニューを追加
            const messageNodeList = document.querySelectorAll("._message")
            for (const message of messageNodeList) {
                // アクションメニューが見つかるまで待つ
                waitForElement(".messageActionNav", (messageActionNav) => {
                    // 独自メニューの構築と追加
                    const MENU_ID = "link-to-chatconv"
                    if (!document.querySelector(`#${MENU_ID}`)) {
                        // 必要な既存要素の存在チェック
                        const moreActionButton = document.querySelector(".moreActionButton")
                        if (!moreActionButton) throw Error("Not found moreActionButton")
                        const moreActionButtonParent = moreActionButton.parentElement
                        if (!moreActionButtonParent) throw Error("Not found moreActionButton's parent")
                        const actionButton = document.querySelector(".actionButton")
                        if (!actionButton) throw Error("Not found actionButton")
                        const actionLabel = document.querySelector(".actionLabel")
                        if (!actionLabel) throw Error("Not found actionLabel")
                        // 独自メニュー構築
                        const label = document.createElement("span")
                        label.textContent = "コンバータで変換"
                        const button = document.createElement("button")
                        button.appendChild(label)
                        button.onclick = () => {
                            const messageLink = `https://www.chatwork.com/#!rid${message.getAttribute("data-rid")}-${message.getAttribute("data-mid")}`
                            console.log(messageLink)
                            chrome.runtime.sendMessage({
                                type: 'jumpToChatconv',
                                arg: messageLink
                            })
                                .then(() => {
                                })
                                .catch((err) => {
                                    throw err
                                })
                        }
                        const menu = document.createElement("li")
                        menu.appendChild(button)
                        menu.id = MENU_ID
                        // デザイン統一のため同等の要素からclassを頂く
                        label.className = actionLabel.className
                        button.className = actionButton.className
                        menu.className = moreActionButtonParent.className
                        // 「…」ボタン前に追加
                        messageActionNav.insertBefore(menu, moreActionButtonParent)
                    }
                })
            }
        }).observe(messageRoot, {
            childList: true,
            subtree: true
        })
    })
}

function waitForElement(querySelectorPath, func) {
    const intervalId = setInterval(() => {
        const element = document.querySelector(querySelectorPath)
        if (element != null) {
            clearInterval(intervalId)
            func(element)
        }
    }, 100);
}