MESSAGE_ELEMENT_PATH = "._message"

function contentsSetup() {
    waitForElement(MESSAGE_ELEMENT_PATH, () => {
        // メッセージの拡張メニューに独自メニューを追加
        const messageNodeList = document.querySelectorAll(MESSAGE_ELEMENT_PATH)
        for (const message of messageNodeList) {
            // 拡張メニューはメッセージの子要素として追加される
            const observer = new MutationObserver(() => {
                console.log("add child")
            })
            observer.observe(message, {
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