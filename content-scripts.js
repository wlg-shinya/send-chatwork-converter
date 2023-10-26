MESSAGE_ELEMENT_PATH = "._message"

function contentsSetup() {
    waitForElement(MESSAGE_ELEMENT_PATH, () => {
        const messageNodeList = document.querySelectorAll(MESSAGE_ELEMENT_PATH)
        if (messageNodeList.length > 0) {
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