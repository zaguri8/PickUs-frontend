import ServerRequest from "../network"
import { Lead, ServerResponse } from "../types";
import { useMake } from "./useMake";


enum SMSParam {
    phone = '[טלפון]',
    name = '[שם]',
    code = '[קוד]',
    company = '[חברה]',
    date = '[תאריך]',
    time = '[שעה]',
    address = '[כתובת]',
    city = '[עיר]',
    country = '[מדינה]',
    zip = '[מיקוד]',
    ride = '[טיול]',
    driver = '[נהג]',
    car = '[רכב]',
    seats = '[מקומות]',
    passengers = '[נוסעים]',
    passengersNames = '[שמות_נוסעים]',
    passengersPhones = '[טלפוני_נוסעים]',
    startPoint = '[נקודת_יציאה]',
    backPoint = '[נקודת_חזרה]',
}

export default function useLeadRequests() {
    async function sendSMSRequest(lead: Lead | undefined | null) {
        return new Promise<string>((resolve, reject) => {
            if (!lead) return reject('lead is undefined');
            ServerRequest<ServerResponse>('sendleadsms',
                lead,
                result => result.success ? resolve(result.success) : reject(result.error),
                error => reject(error.message ?? 'unknown error'))
        })
    }
    async function sendStartFillingRequest(lead: { phone: string, name: string } | undefined | null) {
        return new Promise<string>((resolve, reject) => {
            if (!lead) return reject('lead is undefined');
            try {
                ServerRequest<ServerResponse>('startFormFilling',
                    lead,
                    result => result.success ? resolve(result.success) : reject(result.error),
                    error => reject(error.message ?? 'unknown error'))
            } catch (e) { }
        })
    }

    async function sendLeftPageRequest(lead: Lead | undefined | null) {
        return new Promise<string>((resolve, reject) => {
            if (!lead) return reject('lead is undefined');
            try {
                ServerRequest<ServerResponse>('formFillingStopped',
                    lead,
                    result => result.success ? resolve(result.success) : reject(result.error),
                    error => reject(error.message ?? 'unknown error'))
            } catch (e) { }
        })
    }

    return {
        sendSMSRequest,
        sendStartFillingRequest,
        sendLeftPageRequest
    }
}