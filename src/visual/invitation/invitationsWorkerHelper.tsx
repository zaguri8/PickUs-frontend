import { getDateString, getDaysInCurrentMonth, getDaysInMonth  } from "../../utils";
import moment from 'moment'
import { IRidesCalendar, SelectedRide } from "./CompanyRidesCalendar";
import { PNPCompanyRideConfirmation } from "../../logic/types";

const systemTime = new Date();
export const getAllWeekDaysLeft = () => {
    const todaysDate = systemTime;
    let days = []
    for (let i = todaysDate.getDay() + 1; i < DAYS_AMT; i++) {
        days.push(i);
    }
    return days;
}

export const getAllWeekDaysLeftAtDate = (date: Date) => {
    let days = []
    for (let i = date.getDay() + 1; i < DAYS_AMT; i++) {
        days.push(i);
    }
    return days;
}


export const getAllWeekDays = () => {
    let days = []
    for (let i = 1; i < DAYS_AMT; i++) {
        days.push(i);
    }
    return days;
}
export function getWeekDays() {
    return moment.weekdays()
}
export function getMonths() {
    return moment.months();
}

export function determineOffset(today: Date) {
    return isEqualDates(today, systemTime) ? 0 : getAllWeekDaysLeft().length
}
export const userHasConfirmationForDate = (confirmations: PNPCompanyRideConfirmation[],
    dateRange: { d1: string, d2: string }) => {

    let month = Number(dateRange.d1.split('/')[1]);
    let day_start = Number(dateRange.d1.split('/')[0]);
    let day_end = Number(dateRange.d2.split('/')[0]);
    for (let conf of confirmations) {
        const conf_d_com = conf.date.split('/')
        const day = Number(conf_d_com[0])
        const conf_month = Number(conf_d_com[1])
        if (conf_month === month) {
            if (day >= day_start && day <= day_end || day_end < 5) {
                return conf
            } else {

            }
        }
    }
}

export const MONTHS_AMT = 12
export const DAYS_AMT = 7
export const SECONDS_FOR_MIN = 60
export const MILIS_FOR_SEC = 1000
export const WEEK_LONG = (DAYS_AMT) * MONTHS_AMT * Math.pow(SECONDS_FOR_MIN, 2) * MILIS_FOR_SEC
export const isEqualDates = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}
export const isEqualRides = (r1: SelectedRide, r2: SelectedRide) => r1?.date === r2?.date && r1?.ride === r2?.ride
export const nameforDir = (dir: number) => dir === 1 ? '????????' : dir === 2 ? '????????' : '???????? ???? ?????????????? (???????? ????????)'
export const showingWeek = (d: Date) => {
    const newD1 = new Date(d)
    newD1.setDate(newD1.getDate() - (systemTime.getDay() === 0 ? 1 : 0))
    const start = getDateString(newD1.getTime(), true)
    const newD = new Date(d)
    newD.setDate(newD.getDate() + DAYS_AMT - 2)
    const end = getDateString(newD.getTime(), true)
    return end + " - " + start
}
export const getDateWithDayString = (day: number) => {
    const today = new Date();
    const date = getDateString(today.getTime());
    const c = date.split("/");
    c[0] = Number(c[0]) + day + "";
    if (Number(c[0]) > getDaysInCurrentMonth())
        c[1] = Number(c[1]) + 1 + "";
    if (Number(c[1]) > MONTHS_AMT)
        c[2] = Number(c[2]) + 1 + "";
    else if (Number(c[0]) <= today.getDay() && Number(c[1]) === today.getMonth() && Number(c[2]) === today.getFullYear())
        return date;
    return c.join('/');
}


export const getDayName = (day: number) => {

    switch (day) {
        case 1:
        case 0:
            return "??????????";
        case 2:
            return "??????";
        case 3:
            return "??????????";
        case 4:
            return "??????????";
        case 5:
            return '??????????';
        case 6:
            return "????????";
        case 7:
            return "??????";
    }
}
export const getDayLetter = (day: number) => {

    switch (day) {
        case 1:
        case 0:
            return "??'";
        case 2:
            return "??'";
        case 3:
            return "??'";
        case 4:
            return "??'";
        case 5:
            return "??'";
        case 6:
            return "??'";
        case 7:
            return "??'";
    }
}

export const getMonthName = (m: number) => {

    switch (m) {
        case 1:
        case 0:
            return '??????????'
        case 2:
            return "????????????"
        case 3:
            return "??????"
        case 4:
            return "??????????"
        case 5:
            return "??????"
        case 6:
            return "????????"
        case 7:
            return "????????"
        case 8:
            return "????????????"
        case 9:
            return "????????????"
        case 10:
            return "??????????????"
        case 11:
            return "????????????"
        case 12:
            return "??????????"
    }
}

