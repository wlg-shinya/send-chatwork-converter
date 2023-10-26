import { APP_NAME, SETTING_STORAGE_KEY } from "./global-settings.js"
let setting = {}

main()
async function main() {
    await initialize()
    const root = createRoot()
    contentsUrlSetting(root)
    root.appendChild(document.createElement("br")) // 直後のコンテンツとつまり過ぎないようにする調整
    contentsSaveButton(root)
}

async function initialize() {
    // 保存済みの設定を得る
    const result = await chrome.storage.sync.get(SETTING_STORAGE_KEY)
    if (typeof result[SETTING_STORAGE_KEY] !== 'undefined') {
        setting = result[SETTING_STORAGE_KEY]
    }
}

function save() {
    chrome.storage.sync.set({
        [SETTING_STORAGE_KEY]: currentSetting()
    })
        .then(() => {
        })
        .catch((err) => {
            throw err
        })
}

function currentSetting() {
    const current = {
        url: ""
    }
    // URL
    const url = document.querySelector(`#url`)
    if (url) {
        current.url = url.value
    }
    return current
}

function createRoot() {
    const card = document.createElement("div")
    card.classList.add("card")
    const cardHead = document.createElement("div")
    cardHead.classList.add("card-header")
    cardHead.textContent = APP_NAME
    card.appendChild(cardHead)
    const cardBody = document.createElement("div")
    cardBody.classList.add("card-body")
    card.appendChild(cardBody)
    document.body.appendChild(card)
    return cardBody
}

function contentsUrlSetting(parent) {
    const label = document.createElement("span")
    label.classList.add("fw-bold")
    label.textContent = "chatworkコンバータのURL"
    parent.appendChild(label)
    const input = document.createElement("input")
    input.id = "url"
    input.classList.add("form-control")
    input.value = setting.url
    parent.appendChild(input)
}

function contentsSaveButton(parent) {
    const div = document.createElement("div")
    div.classList.add("d-flex")
    const button = document.createElement("button")
    div.appendChild(button)
    button.classList.add("btn")
    button.classList.add("btn-primary")
    button.classList.add("flex-fill")
    button.onclick = save
    button.textContent = "保存"
    parent.appendChild(div)
}
