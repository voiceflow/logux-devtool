const hostPort = chrome.runtime.connect({ name: "logux-devtool/host" });

document.addEventListener("logux_message", (event) => {
  const {
    detail: { action },
  } = event as CustomEvent<{ action: AnyAction }>;

  hostPort.postMessage(action);
});

/* inject script */

const script = document.createElement("script");

script.setAttribute("type", "module");
script.setAttribute("src", chrome.runtime.getURL("scripts/bootstrap.js"));

document.head.appendChild(script);
