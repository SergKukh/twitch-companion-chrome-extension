export const getAccessToken = (): Promise<string> => {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.get(['access_token'], function (result) {
            resolve(result.access_token);
        });
    });
}

export const getClientId = (): string => {
    return 'twa54edpob784quljykf2a82yv5gxe';
}