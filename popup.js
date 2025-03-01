import { APP_NAME, CONVERTER_NAME, SETTING_STORAGE_KEY } from "./global-settings.js";
let setting = {};

// TODO: デフォルト設定にChatworkコンバータ正式URLを記載する

main();
async function main() {
  await initialize();
  const card = createCard();
  contentsUrlSetting(card.body);
  contentsSaveButton(card.footer);
}

async function initialize() {
  // 保存済みの設定を得る
  const result = await chrome.storage.sync.get(SETTING_STORAGE_KEY);
  if (typeof result[SETTING_STORAGE_KEY] !== "undefined") {
    setting = result[SETTING_STORAGE_KEY];
  }
}

function save() {
  chrome.storage.sync
    .set({
      [SETTING_STORAGE_KEY]: currentSetting(),
    })
    .then(() => {})
    .catch((err) => {
      throw err;
    });
}

function currentSetting() {
  const current = {
    url: "",
  };
  // URL
  const url = document.querySelector(`#url`);
  if (url) {
    current.url = url.value;
  }
  return current;
}

function createCard() {
  const card = document.createElement("div");
  card.classList.add("card");
  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");
  const icon = document.createElement("img");
  icon.classList.add("me-1");
  icon.src = chrome.runtime.getURL("images/icon16.png");
  cardHeader.appendChild(icon);
  const title = document.createElement("span");
  title.textContent = APP_NAME;
  cardHeader.appendChild(title);
  card.appendChild(cardHeader);
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  card.appendChild(cardBody);
  const cardFooter = document.createElement("div");
  cardBody.classList.add("card-footer");
  card.appendChild(cardFooter);
  document.body.appendChild(card);
  return { header: cardHeader, body: cardBody, footer: cardFooter };
}

function contentsUrlSetting(parent) {
  const label = document.createElement("span");
  label.classList.add("fw-bold");
  label.textContent = `${CONVERTER_NAME}のURL`;
  parent.appendChild(label);
  const input = document.createElement("input");
  input.id = "url";
  input.classList.add("form-control");
  input.value = setting.url;
  parent.appendChild(input);
}

function contentsSaveButton(parent) {
  const div = document.createElement("div");
  div.classList.add("d-flex");
  div.classList.add("justify-content-center");
  const button = document.createElement("button");
  div.appendChild(button);
  button.classList.add("btn");
  button.classList.add("btn-primary");
  button.classList.add("col-4");
  button.classList.add("m-2");
  button.onclick = save;
  button.textContent = "保存";
  parent.appendChild(div);
}
