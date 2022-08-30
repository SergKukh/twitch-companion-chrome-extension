const tabsListener = (tabId, changeInfo, tabInfo) => {
    if (changeInfo.url && changeInfo.url.includes('https://twitch-companion.vercel.app/auth#')) {
        const url = changeInfo.url.replace('#', '?');
        const search = new URL(url).search;
        const params = new URLSearchParams(search);
        const access_token = params.get('access_token');
        if (access_token) {
            chrome.storage.sync.set({ access_token });

        }
    }
    chrome.storage.sync.get(['access_token'], function (result) {
        if (result.access_token) {
            chrome.tabs.onUpdated.removeListener(tabsListener);
        }
    })
}

chrome.tabs.onUpdated.addListener(tabsListener);