const HOST_KEY = "logux-devtool/host";
const LOGUX_EVENT = "logux_message";
const LOGUX_NOTIFY = "logux_notify";

/* utils */

const injectScript = (url: string) => {
  const script = document.createElement("script");

  script.setAttribute("type", "module");
  script.setAttribute("src", url);

  document.head.appendChild(script);
};

const bindPort = (port: chrome.runtime.Port) => {
  const messageHandler = (action: AnyAction) => {
    document.dispatchEvent(
      new CustomEvent<{ action: AnyAction }>(LOGUX_NOTIFY, {
        detail: { action },
      })
    );
  };

  document.addEventListener(LOGUX_EVENT, (event) => {
    const {
      detail: { action },
    } = event as CustomEvent<{ action: AnyAction }>;

    port.postMessage(action);
  });

  port.onMessage.addListener(messageHandler);
  port.onDisconnect.addListener(() => {
    port.onMessage.removeListener(messageHandler);
  });
};

/* main */

bindPort(chrome.runtime.connect({ name: HOST_KEY }));

injectScript(chrome.runtime.getURL("scripts/bootstrap.js"));
