import { PNPEvent } from './logic/types'
import CryptoJS from 'crypto-js'
export const reverseDate = (date: any) => {
    const split = (date as string)
        .replaceAll('-', '/')
        .split('/')
        .reverse()
        .join('/')
    return split
}
export const hyphenToMinus = (date: string) => {

    return date.replaceAll('/', '-')
}

export const unReverseDate = (date: any) => {
    const split = (date as string)
        .replaceAll('/', '-')
        .split('-')
        .reverse()
        .join('-')
    return split
}

export const getCurrentDate = () => {
    const date = new Date()
    date.setMonth(date.getMonth() + 1)
    return date
}
export function millisToMinutesAndSeconds(duration:string) {
    const a = duration.includes('min');
    const b = duration.includes('hour');
    const c = a && b;
    if (c) {
        const x = duration.split(' ')
        const hours = Number(x[0]);
        const minutes = Number(x[2]);

        return { hours, minutes }

    } else return { minutes: Number(duration.split(" ")[0]), hours: 0 }
}

export const datesComparator = (a:{date:string}, b:{date:string}) => {
    let bComps = b.date.split(' ')
    let bCompDate = bComps[0].split('-')
    let bCompTime = bComps[1].split(':')
    let aComps = a.date.split(' ')
    let aCompDate = aComps[0].split('-')
    let aCompTime = aComps[1].split(':')
    return new Date(Number(bCompDate[0]), Number(bCompDate[1]), Number(bCompDate[2]),
    Number(bCompTime[0]), Number(bCompTime[1]), Number(bCompTime[2])).getTime() - new Date(Number(aCompDate[0]), Number(aCompDate[1]), Number(aCompDate[2]),
    Number(aCompTime[0]), Number(aCompTime[1]), Number(aCompTime[2])).getTime()
}
export const getDateString = (dateMili:number, inc1 = false) => {
    const date = new Date(dateMili)
    const day = ("0" + date.getDate()).slice(-2)
    const month = ("0" + (date.getMonth() + (inc1 ? 1 : 0))).slice(-2)
    return `${day}/${month}/${date.getFullYear()}`
}
export const getDateStringShort = (dateMili:number, inc1 = false) => {
    const date = new Date(dateMili)
    const day = ("0" + date.getDate()).slice(-2)
    const month = ("0" + (date.getMonth() + (inc1 ? 1 : 0))).slice(-2)
    const year = (date.getFullYear() + "").slice(-2)
    return `${day}/${month}/${year}`
}
export function getDaysInCurrentMonth() {
    const date = new Date();
    return getDaysInMonth(date);
}
export function getDaysInMonth(date:Date) {
    return new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate();
}
export const getDateTimeString = (dateMili:number) => {
    const date = new Date(dateMili)
    let hour:any = date.getHours()
    let min:any = date.getMinutes()
    let sec:any = date.getSeconds()
    if (hour < 10)
        hour = "0" + hour
    if (min < 10)
        min = "0" + min
    if (sec < 10)
        sec = "0" + sec
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${hour}:${min}:${sec}`
}
export const isValidPhoneNumber = (phone:string) => {

    return phone.match(/^0(5[^7]|[2-4]|[8-9]|7[0-9])[0-9]{7}$/)
}


export const encryptMacdonald = (message:string) => {
    let secret = process.env.REACT_APP_NADAVSOLUTIONS_API_KEY;
    var encryptedAES = CryptoJS.AES.encrypt(message, secret!!);
    return encryptedAES.toString();
}

export const decryptMacdonald = (encryptedAES:string) => {
    let secret = process.env.REACT_APP_NADAVSOLUTIONS_API_KEY;
    let decrypted = CryptoJS.AES.decrypt(encryptedAES, secret!!)
    let plain = decrypted.toString(CryptoJS.enc.Utf8);
    return plain;
}

export function getValidImageUrl(event:PNPEvent) {
    let eventImageURL = event.eventImageURL
    let eventMobileImageURL = event.eventMobileImageURL

    if (window.innerWidth > 700) {

        if (eventImageURL && eventImageURL !== null && eventImageURL.includes('https'))
            return eventImageURL
        else return eventMobileImageURL
    } else {
        if (eventMobileImageURL && eventMobileImageURL !== null && eventMobileImageURL.includes('https'))
            return eventMobileImageURL
        else return eventImageURL
    }
}



export const dateStringFromDate = (date: Date) => {
    const d = String(date.getDate()).length === 1 ? "0" + date.getDate() : String(date.getDate())
    const m = String(date.getMonth()).length === 1 ? "0" + date.getMonth() : String(date.getMonth())
    const y = date.getFullYear()
    return d + "/" + m + "/" + y
}