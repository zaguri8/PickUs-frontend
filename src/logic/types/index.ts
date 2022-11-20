export class Lead {
    name: string
    phone: string
    start: string
    developer: boolean
    destination: string
    date: string
    comments: string
    passengers: string
    departureTime_h: string
    backTime_h: string
    departureTime_m: string
    backTime_m: string
    constructor() {
        this.name = ""
        this.phone = ""
        this.destination = ""
        this.start = ""
        this.date = ""
        this.passengers = ""
        this.developer = false
        this.departureTime_h = ""
        this.backTime_h = ""
        this.departureTime_m = ""
        this.backTime_m = ""
        this.comments = ""
    }
    departureTime() {
        return this.departureTime_h.concat(`:$${this.departureTime_m}`)
    }
    backTime() {
        return this.backTime_h.concat(`:$${this.backTime_m}`)
    }
}
export class LeadBuilder {
    private lead: Lead = new Lead()
    name(name: string) {
        this.lead.name = name
        return this
    }
    developer() {
        this.lead.developer = true
        return this
    }
    phone(phone: string) {
        this.lead.phone = phone
        return this
    }
    start(start: string) {
        this.lead.start = start
        return this
    }
    destination(destination: string) {
        this.lead.destination = destination
        return this
    }
    date(date: string) {
        this.lead.date = date
        return this
    }
    comments(comments: string) {
        this.lead.comments = comments
        return this
    }

    passengers(passengers: string) {
        this.lead.passengers = passengers
        return this
    }
    departureTime(departureTime: string) {
        if (departureTime.indexOf(":") === -1)
            return this
        const [h, m] = departureTime.split(":")
        this.lead.departureTime_m = m
        this.lead.departureTime_h = h
        return this
    }
    backTime(backTime: string) {
        if (backTime.indexOf(":") === -1)
            return this
        const [h, m] = backTime.split(":")
        this.lead.backTime_m = m
        this.lead.backTime_h = h
        return this
    }
    build() {
        return this.lead
    }
}


export type PNPEventGraphics = {
    varArg1: string
}
export type PNPEventHours = {
    startHour: string
    endHour: string
}
export type PNPEventAgeRange = {
    minAge: string
    maxAge: string
}

export type PNPTransactionConfirmation = {
    eventId: string
    rideId: string
    amount: string
    twoWay: boolean
    ridesLeft: number
    scanned?: boolean
    confirmationVoucher: string
}

export type PNPTransactionConfirmationExtended = PNPTransactionConfirmation & {
    passengers: number | string | undefined
    customerEmail: string | undefined
    customerName: string | undefined
    customerPhone: string | undefined
    startPoint: string | undefined
    destination: string | undefined
}

// TODO : Add Ride Status 20/03/22
export type PNPPublicRide = {
    rideId: string
    eventId: string
    rideDestination: string
    rideStartingPoint: string
    rideTime: string
    ridePrice: string
    backTime: string
    passengers: string
    date: string
    extras: PNPRideExtras
}

export type PNPWorkersRide = {
    companyId: string,
    id: string,
    backTime: string,
    startPoint: string,
    destination: string,
    rideTime: string,
    date: string,
    extras: PNPWorkersRideExtras
}



export type PNPCompany = {
    id: string,
    logo: string,
    name: string
}

export type PNPWorkersRideExtras = {
    rideStatus?: 'on-going' | 'sold-out' | 'running-out'
    rideDirection: '2' | '1' // 1 - from event, 2 - to event
    rideMaxPassengers?: string
    twoWay: boolean
    twoWayOnly: boolean
}

export type PNPRideExtras = {
    isRidePassengersLimited?: boolean
    rideTransactionsConfirmed: boolean
    rideStatus?: 'on-going' | 'sold-out' | 'running-out'
    rideMaxPassengers?: string
    rideDirection: '2' | '1' // 1 - from event, 2 - to event
    twoWay: boolean
    twoWayOnly: boolean
    exactStartPoint?: string
    exactBackPoint?: string
}


export type PNPPrivateRide = {
    rideCreatorId: string
    rideName?: string
    rideId: string
    rideDestination: string
    rideStartingPoint: string
    extraStopPoints: string[]
    rideTime: string
    backTime: string
    passengers: string
    date: string
    comments: string
}


export type PNPExplicitPrivateRide = {
    customerPhone: string
    customerName: string
    rideId: string
    rideStartingPoint: string
    extraStopPoints: string[]
    extraStopPointsBack: string[]
    rideTime: string
    backTime: string
    backPoint: string
    passengers: string
    date: string
    comments: string
}
export type PNPCoupon = {
    couponId: string
    couponValue: string
    couponExpirationDate: string
}



export type PNPRideRequest = {
    eventId: string,
    requestUserId: string,
    eventName: string,
    fullName: string,
    passengers: string,
    names: string[],
    phoneNumber: string,
    startingPoint: string,
}

export type PNPUser = {
    image?: string
    customerId: string
    name: string
    admin: boolean
    coins: number
    email: string
    phone: string
    favoriteEvents: string[],
    birthDate: string
    producer: boolean
    producingEventId?: string
}
export type PNPEvent = {
    eventName: string
    eventLocation: string
    eventId: string
    eventProducerId: string
    eventShowsInGallery: boolean
    eventDate: string
    eventCanAddRides: boolean
    eventDetails: string
    eventType: string
    eventPrice: string
    eventSendsSMS?: boolean
    eventHours: PNPEventHours
    eventAgeRange: PNPEventAgeRange
    expectedNumberOfPeople: string
    eventAttention: PNPEventAttention
    eventImageURL: string
    eventMobileImageURL?: string
}

export type PNPEventAttention = {
    eventAttention1: string,
    eventAttention2: string
}

export type PNPPrivateEvent = {
    registrationRequired: boolean
    eventTitle: string
    eventLocation: string
    eventShowsInGallery: boolean
    eventId: string
    eventWithGuests: boolean
    eventWithPassengers: boolean
    eventProducerId: string
    eventDate: string
    eventDetails: string
    eventHours: PNPEventHours
    eventImageURL?: string
}

export type UserDateSpecificStatistics = {
    date: string
    numberOfUserAttended: number
}

export type UserEnterStatistics = {
    stats: UserDateSpecificStatistics[]
}

export type PNPRideConfirmation = {
    userId: string
    userName: string
    phoneNumber: string
    rideId: string
    rideArrival: boolean
    eventId: string
    passengers?: string
    guests: string
    splitGuestPassengers: boolean //  true -> חלק בהסעות חלק לא
    confirmationTitle: string
    date: string
    directions: string // 1 - to event,2 - from event,3 - two way
    directionType: string
}

export type PNPCompanyRideConfirmation = {
    userId: string
    userName: string
    phoneNumber: string
    rideId: string
    startPoint: string
    companyId: string
    companyName: string
    date: string
}

export enum PNPRideDirectionNumber {
    to_event = 1,
    back_from_event = 2,
    both_ways = 3
}

export enum PNPRideDirection {
    one_way = "to the event",
    second_way = "back from the event",
    both_ways = "to & back from the event"
}

export type PassengersDictionary = { to: number, back: number, twoWay: number, total: number }
export const eventTypes = [
    "מסיבות ומועדונים",
    "משחקי כדורגל",
    "הופעות",
    "פסטיבלים",
    "ברים",
    "ספורט כללי",
    "אירועי ילדים"
]


export type PNPError = {
    errorId: string
    date: string
    type: string
    error: string
    extraData?: { [key: string]: any }
}


export type RegisterFormExtras = {
    requireBirthDate: boolean
    requireFavoriteEvents: boolean
}

export type UserIdAndExtraPeople = { uid: string, extraPeople: PNPRideExtraPassenger[] }
export type UserAndExtraPeople = { user: PNPUser, extraPeople: PNPRideExtraPassenger[] }

export type PCustomerData = {
    'customer_name': string,
    'email': string,
    'phone': string
}
export type PProductData = {
    'name': string
    'quantity': number,
    'price': number
}



export type PPaymentPageData = {
    'payment_page_uid': string//'4e7ad1b7-3ac6-4b3d-b138-2effa8a19ca0',
    'expiry_datetime': string// '30',
    "refURL_success": string//"https://nadavsolutions.com/gserver/pnp/transactions/add",
    'more_info': string //unique_transaction_live_id,
    'customer': PCustomerData,
    'items': PProductData[],
    'amount': number,
    'payments': number,
    'currency_code': string,
    'sendEmailApproval': boolean,
    'sendEmailFailure': boolean
};

export type PNPScanData = {
    voucherNumber: string
    scannerName: string,
    scannerEmail: string,
    clientEmail: string,
    clientName: string
    date: string
}


export type qPNPAbstractRideParams = {
    startPoint: string
    destination: string
    twoWay: boolean
};
export type qPNPRideParams = qPNPAbstractRideParams & {
    km: number
    cost: number
}



export type CompanyDateConfirmations = {
    date: string,
    confirmations: (PNPCompanyRideConfirmation & { dateObject: Date })[]
}

export type CompanyConfirmationsMapping = {
    [ride: string]: CompanyDateConfirmations[]
}

export type PNPRideExtraPassenger = {
    fullName: string,
    phoneNumber: string
}

export type PNPEventRidePurchaseData = { [rideStartingPoint: string]: { amount: number, users: { uid: string, customerName: string, customerPhone: string, customerEmail: string, customerId: string, date: string, extraPeople: PNPRideExtraPassenger[] }[] } }

export type RideStatistics = {
    amount: string
    uid: string
    date: string
    extraPeople: PNPRideExtraPassenger[]
    customerName: string
    customerId: string
    customerPhone: string
    customerEmail: string
    rideStartPoint: string
}

export enum AdminScreens {
    ridesOverview, rideTransactions, rideRequests
}

export type PNPPageStats = {
    lastCached: number
    page: string
}

export enum PNPPage {
    home = 'home', login = 'login', register = 'register', createEvent = 'events', createRide = 'rides', myAccount = 'account',
}

export type ServerResponse = Partial<{
    success: string
    error: string
}>

export type Customer = {
    customer_name: string
    email: string
}
export type CreditCard = {
    auth_number: string
    exp_mm: string
    exp_yy: string
    number: string
}
export type Payments = {
    number: number
    first_amount: number
    nonfirst_amount: number

}

export type TransactionSuccess = {
    amount: string,
    transaction_uid: string,
    customer_uid: string,
    status_description: string,
    currency: string,
    date: string,
    card_holder_name: string,
    more_info: {
        productName: string,
        startPoint: string,
        amount: string,
        direction: string,
        eventDate?: string,
        eventId: string,
        rideId: string,
        twoWay: string
    },
    number_of_payments: string,
    method: string,
    approval_num: string,
    four_digits: string
}

export type TransactionFailure = {
    transactionProduct: string
    transactionTotalAmount: string
    transactionTotalPrice: string
    transactionDate: string
    status_description: string
    transactionId: string
}

