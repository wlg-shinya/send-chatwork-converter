MESSAGE_ELEMENT_PATH = "._message"

function contentsSetup() {
    waitForElement(MESSAGE_ELEMENT_PATH, () => {
        // メッセージのアクションメニューに独自メニューを追加
        const messageNodeList = document.querySelectorAll(MESSAGE_ELEMENT_PATH)
        for (const message of messageNodeList) {
            // アクションメニューはメッセージの子要素として追加されるのでそれを監視
            new MutationObserver(() => {
                // アクションメニューが見つからない場合は何もしない
                const messageActionNav = message.querySelector(".messageActionNav")
                if (!messageActionNav) return

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
                    label.textContent = "コンバータに送る"
                    const button = document.createElement("button")
                    button.appendChild(label)
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
            }).observe(message, {
                childList: true
            })
        }
    })
}

function waitForElement(querySelectorPath, func) {
    const intervalId = setInterval(() => {
        if (document.querySelector(querySelectorPath) != null) {
            clearInterval(intervalId)
            func()
        }
    }, 100);
}