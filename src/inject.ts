const HOST_KEY = "logux-devtool/host";
const LOGUX_EVENT = "logux_message";

/* utils */

const injectScript = (url: string) => {
  const script = document.createElement("script");

  script.setAttribute("type", "module");
  script.setAttribute("src", url);

  document.head.appendChild(script);
};

const bindPort = (port: chrome.runtime.Port) => {
  document.addEventListener(LOGUX_EVENT, (event) => {
    const {
      detail: { action },
    } = event as CustomEvent<{ action: AnyAction }>;

    port.postMessage(action);
  });
};

/* main */

bindPort(chrome.runtime.connect({ name: HOST_KEY }));

injectScript(chrome.runtime.getURL("scripts/bootstrap.js"));
