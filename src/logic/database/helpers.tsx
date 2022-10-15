import { User } from "firebase/auth";
import { SAME_SPOT } from "../settings/strings";
import { getCurrentDate, getDateString } from "../../utils";
import { dateStringFromDate } from "../../utils";
import { PNPCompany, PNPCompanyRideConfirmation, PNPEvent, PNPPrivateEvent, PNPPublicRide, PNPRideConfirmation, PNPWorkersRide } from "../types";


export function getDefaultPublicEvent(user?: User | null): PNPEvent {
    return {
        eventName: 'null',
        eventLocation: 'null',
        eventId: 'null',
        eventCanAddRides: true,
        eventProducerId: user ? user.uid : 'null',
        eventShowsInGallery: false,
        eventDate: dateStringFromDate(getCurrentDate()),
        eventType: 'clubs',
        eventDetails: 'null',
        eventPrice: '50',
        eventHours: { startHour: 'null', endHour: 'null' },
        eventAgeRange: { minAge: 'null', maxAge: 'null' },
        eventAttention: { eventAttention1: 'unset', eventAttention2: 'unset' },
        expectedNumberOfPeople: 'null',
        eventImageURL: 'null'
    }
}

export function getDefaultConfirmation(event: PNPPrivateEvent): PNPRideConfirmation {
    return {
        userId: 'guest',
        eventId: event.eventId ?? '',
        rideArrival: event.eventWithPassengers,
        guests: '1',
        directionType: 'null',
        splitGuestPassengers: false,
        userName: 'null',
        phoneNumber: 'null',
        date: event?.eventDate ?? '',
        confirmationTitle: event?.eventTitle ?? '',
        rideId: 'null',
        passengers: 'unset',
        directions: 'null',
    }
}

export function getDefaultConfirmationCompanyRide(company: PNPCompany): PNPCompanyRideConfirmation {
    return {
        userId: 'guest',
        companyId: company.id,
        companyName: company.name,
        startPoint: 'null',
        userName: 'null',
        phoneNumber: 'null',
        date: getDateString(new Date().getTime()),
        rideId: 'null',
    }
}
export function getDefaultPrivateEvent(): PNPPrivateEvent {
    return {
        eventTitle: 'null',
        eventLocation: 'null',
        eventId: 'null',
        registrationRequired: false,
        eventWithPassengers: false,
        eventShowsInGallery: false,
        eventWithGuests: true,
        eventProducerId: 'null',
        eventDate: dateStringFromDate(getCurrentDate()),
        eventDetails: 'null',
        eventHours: { startHour: '00:00', endHour: '00:00' },
        eventImageURL: 'null'
    }
}

export function getDefaultPublicRide(event?: PNPEvent | null, lang?: string): PNPPublicRide {
    return {
        rideId: "null",
        eventId: event?.eventId ?? "null",
        rideDestination: event?.eventName ?? "null",
        rideStartingPoint: "null",
        rideTime: "00:00",
        ridePrice: "null",
        backTime: "04:00",
        passengers: "0",
        date: event?.eventDate ?? "null",
        extras: {
            isRidePassengersLimited: true,
            rideStatus: 'on-going',
            rideTransactionsConfirmed: false,
            rideMaxPassengers: '54',
            twoWayOnly: false,
            twoWay: true,
            rideDirection: '2',
            exactBackPoint: SAME_SPOT(lang),
            exactStartPoint: ''
        }
    }
}


export function getDefaultWorkersRide(company?: PNPCompany | null, lang?: string): PNPWorkersRide {
    return {
        id: "null",
        companyId: company?.id ?? "null",
        destination: company?.name ?? "null",
        startPoint: "null",
        rideTime: "00:00",
        backTime: "04:00",
        date: '',
        extras: {
            rideStatus: 'on-going',
            rideMaxPassengers: '54',
            twoWayOnly: false,
            twoWay: true,
            rideDirection: '2',
        }
    }
}

export function getDefaultPublicRide2(event?: PNPPrivateEvent | null, lang?: string): PNPPublicRide {
    return {
        rideId: "null",
        eventId: event?.eventId ?? "null",
        rideDestination: event?.eventTitle ?? "null",
        rideStartingPoint: "null",
        rideTime: "00:00",
        ridePrice: "0",
        backTime: "04:00",
        passengers: "0",
        date: event?.eventDate ?? "null",
        extras: {
            isRidePassengersLimited: true,
            rideStatus: 'on-going',
            rideMaxPassengers: '54',
            rideTransactionsConfirmed: false,
            twoWayOnly: false,
            twoWay: true,
            rideDirection: '2',
            exactBackPoint: SAME_SPOT(lang),
            exactStartPoint: ''
        }
    }
}