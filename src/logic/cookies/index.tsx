



import { PNPPageStats } from '../types'
export const handleCookieInject = (pages: PNPPageStats[]) => {
    asyncLocalStorage.setItem('pnpPSettings', pages)
}
export const asyncLocalStorage = {
    setItem: async function (key: string, value: any) {
        return Promise.resolve().then(function () {
            localStorage.setItem(key, JSON.stringify(value));
        });
    },
    getItem: async function <T>(key: string): Promise<T | null> {
        return Promise.resolve().then(function () {
            const r = localStorage.getItem(key)
            if (r === null)
                return null;
            else
                return JSON.parse(r)
        });
    }
};