import {
    Linking,
    Platform,
    NativeModules,
    DeviceEventEmitter,
} from 'react-native';

const RNUpgrade = NativeModules.upgrade;
const ANDROID_PLATFORM = Platform.OS === 'android';

export function handlerVersionString(version) {
    let versions = version.split('.');
    let number = 0;
    if (versions.length === 3) {
      number = parseInt(versions[0]) * 10000 + parseInt(versions[1]) * 100 + parseInt(versions[2])
    } else {
      number = parseInt(versions[0]) * 10000 + parseInt(versions[1]) * 100
    }
    return number;
}

// 不考虑字母
function s2i(s) {
    return s.split('').reduce(function(a, c) {
        let code = c.charCodeAt(0);
        if (48<=code && code < 58) {
            a.push(code-48);
        }
        return a;
    }, []).reduce(function(a, c) {
        return 10*a + c;
    }, 0);
}

// 1: 大于 0: 等于 -1: 小于
export function versionCmp(s1, s2) {
    let a = s1.split('.').map(function(s) {
        return s2i(s);
    });
    let b = s2.split('.').map(function(s) {
        return s2i(s);
    });
    let n = a.length < b.length ? a.length : b.length;
    for (let i = 0; i < n; i++) {
        if (a[i] < b[i]) {
            return -1;
        } else if (a[i] > b[i]) {
            return 1;
        }
    }
    if (a.length < b.length) return -1;
    if (a.length > b.length) return 1;
    let last1 = s1.charCodeAt(s1.length-1) | 0x20,
      last2 = s2.charCodeAt(s2.length-1) | 0x20;
    return last1 > last2 ? 1 : last1 < last2 ? -1 : 0;
}

/**
 * IOS检测更新
 * @param appId   appstore的应用id
 * @param version  本地版本
 */
export async function checkUpdate(appId, version) {
    if (!ANDROID_PLATFORM) {
        try {
            const response = await fetch(
                `https://itunes.apple.com/cn/lookup?id=${appId}&t=${Date.now()}`
            );
            const res = await response.json();
            if (res.results.length < 1) {
                return {
                    code: -1,
                    msg: '此APPID为未上架的APP或者查询不到'
                };
            }
            const msg = res.results[0];
            if (versionCmp(version, msg.version) === 1) {
                return {
                    code: 1,
                    msg: msg.releaseNotes,
                    version: msg.version
                };
            } else {
                return {
                    code: 0,
                    msg: '没有新版'
                };
            }
        } catch (e) {
            return {
                code: -1,
                msg: '你可能没有连接网络哦'
            };
        }
    }
}

/**
 * 升级 android平台
 * @param apkUrl   android传入apk地址
 */
export const upgrade = (apkUrl) => {
    if (ANDROID_PLATFORM) {
        RNUpgrade.upgrade(apkUrl);
    }
};
/**
 * 根据appid打开苹果商店
 * @param appid
 */
export const openAPPStore = (appid) => {
    if (!ANDROID_PLATFORM) {
        RNUpgrade.openAPPStore(appid);
    }
};

/**
 * android apk下载回调
 * @param callBack
 */
export const addDownLoadListener = (callBack) => {
    if (ANDROID_PLATFORM) {
        return DeviceEventEmitter.addListener('LOAD_PROGRESS', callBack);
    }
};

/** app版本号，如1.0.1 */
export const versionName = RNUpgrade.versionName;
