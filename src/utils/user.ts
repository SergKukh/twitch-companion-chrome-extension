import { IUser } from "../models/IUser";

export const setUser = (user: IUser): Promise<IUser> => {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.set({ user }, function () {
            resolve(user);
        });
    });
}

export const getUser = (): Promise<IUser> => {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.get(['user'], function (result) {
            resolve(result.user);
        })
    });
}

export const logout = (): Promise<boolean> => {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.remove(['user', 'access_token'], function () {
            chrome.action.setBadgeText({ text: '' });
            resolve(true);
        })
    })
}

export const addFavUser = (userId: string, streamerId: string): Promise<string[]> => {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.get(['favUsers'], function (result) {
            if (result.favUsers) {
                const favUsers = { ...result.favUsers };
                if (favUsers[userId]) {
                    if (!favUsers[userId].includes(streamerId)) {
                        favUsers[userId].push(streamerId);
                    }
                    chrome.storage.sync.set({ favUsers }, function () {
                        resolve(favUsers[userId]);
                    })
                } else {
                    favUsers[userId] = [streamerId];
                    chrome.storage.sync.set({ favUsers }, function () {
                        resolve(favUsers[userId]);
                    })
                }
            } else {
                chrome.storage.sync.set({ favUsers: { userId: [streamerId] } }, function () {
                    resolve([streamerId]);
                })
            }
        })
    })
}

export const removeFavUser = (userId: string, streamerId: string): Promise<string[]> => {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.get(['favUsers'], function (result) {
            if (result.favUsers && result.favUsers[userId]) {
                const favUsers = { ...result.favUsers };
                favUsers[userId] = favUsers[userId].filter(streamer => streamer !== streamerId);
                chrome.storage.sync.set({ favUsers }, function () {
                    resolve(favUsers[userId]);
                })
            } else {
                resolve([]);
            }
        })
    });
}

export const getFavUsers = (userId: string): Promise<string[]> => {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.get(['favUsers'], function (result) {
            if (result && result.favUsers?.[userId]) {
                resolve(result.favUsers[userId]);
            } else {
                resolve([]);
            }
        })
    })
}