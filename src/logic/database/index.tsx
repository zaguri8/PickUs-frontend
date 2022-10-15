import { Auth } from 'firebase/auth'
import { PNPEvent, PNPUser, PNPPublicRide, PNPPrivateEvent, PNPError, PNPRideConfirmation, PNPRideRequest, PNPTransactionConfirmation, UserDateSpecificStatistics, UserEnterStatistics, RegisterFormExtras, PPaymentPageData, PCustomerData, PProductData, UserIdAndExtraPeople, UserAndExtraPeople, PNPTransactionConfirmationExtended, PNPExplicitPrivateRide, PNPCompany, PNPWorkersRide, PNPCompanyRideConfirmation, TransactionSuccess } from '../types'
import { SnapshotOptions } from 'firebase/firestore'
import { PNPPage } from '../types'
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { initializeApp } from 'firebase/app'
import { RideStatistics } from '../types'
import { DocumentData } from 'firebase/firestore'
import { getStorage, getDownloadURL, ref as storageRef, FirebaseStorage, uploadBytes } from "firebase/storage";
import { child, Database, DatabaseReference, DataSnapshot, get, onValue, push, ref, remove, set, Unsubscribe, update } from 'firebase/database'
import {
    Firestore,
    QuerySnapshot,
    DocumentReference
} from 'firebase/firestore'
import { createNewCustomer } from '../network/payments'
import { datesComparator, getCurrentDate } from '../../utils'
import { dateStringFromDate, hyphenToMinus } from '../../utils'
import { firebaseConfig } from '../settings/config'
import { CompanyConfirmationsMapping } from '../types'

export type ExternalStoreActions = {
    /*  events */
    getErrors: () => Promise<QuerySnapshot<object> | ((options?: SnapshotOptions | undefined) => DocumentData)[]>;
    getEvents: () => Promise<QuerySnapshot<object> | ((options?: SnapshotOptions | undefined) => DocumentData)[]>;
    getRides: (userId: string) => Promise<QuerySnapshot<object> | ((options?: SnapshotOptions | undefined) => DocumentData)[] | ((options?: SnapshotOptions | undefined) => DocumentData | undefined)>;
    addError: (error: string) => Promise<DocumentReference<DocumentData>>;
    addEvent: (event: PNPEvent) => Promise<DocumentReference<DocumentData>>;
    removeEvent: (eventId: string) => Promise<void>;
    updateEvent: (event: PNPEvent) => Promise<void>;
    /* rides */
    addRide: (ride: PNPPublicRide) => Promise<DocumentReference<DocumentData>>;

}

function CreateRealTimeDatabase(auth: Auth, db: Database, storage: FirebaseStorage) {

    return new Realtime(auth, db, storage)
}
export class Realtime {
    public siteSettings: DatabaseReference
    public rides: DatabaseReference
    public allEvents: DatabaseReference
    public allCompanies: DatabaseReference
    public errs: DatabaseReference
    public users: DatabaseReference
    public linkRedirects: DatabaseReference
    public scanners: DatabaseReference
    public auth: Auth
    public storage: FirebaseStorage
    public statistics: DatabaseReference
    public privatePaymentPages: DatabaseReference
    public transactions: DatabaseReference
    public transactionConfirmations: DatabaseReference
    constructor(auth: Auth, db: Database, storage: FirebaseStorage) {
        this.siteSettings = ref(db, '/settings')
        this.allEvents = ref(db, '/events')
        this.scanners = ref(db, '/scanners')
        this.allCompanies = ref(db, '/companies')
        this.rides = ref(db, "/rides")
        this.privatePaymentPages = ref(db, '/paymentPages/private')
        this.statistics = ref(db, '/statistics')
        this.users = ref(db, '/users')
        this.errs = ref(db, '/errors')
        this.transactionConfirmations = ref(db, '/transactionConfirmations')
        this.transactions = ref(db, '/transactions')
        this.linkRedirects = ref(db, '/linkRedirects')
        this.auth = auth
        this.storage = storage
    }

    setLinkRedirect(id: string, redirectUrl: string, consume: (link: string | null) => void) {
        set(child(this.linkRedirects, id), redirectUrl).then(success => {
            consume(`https://www.pick-n-pull.co.il/#/linkRedirect/${id}`)
        }).catch(err => {
            consume(null)
            return this.createError('setLinkRedirect', err);
        })
    }

    getLinkRedirect(path: string, consume: (link: string | null, error: string | null) => void) {
        return onValue(child(this.linkRedirects, path), (snap) => {
            if (!snap.exists()) { return consume(null, "Link doesn't exist") }
            return consume(snap.val(), null)
        })
    }
    getLinkRedirectForEventId(eventId: string, consume: (link: string | null, error: string | null) => void) {
        return onValue(this.linkRedirects, (snap) => {
            if (!snap.exists()) { return consume(null, "This event  has no link") }
            snap.forEach(l => {
                if (l.val().includes(eventId)) {
                    return consume(`https://pick-n-pull.co.il/#/linkRedirect/${l.key}`, null);
                }
            })
        })
    }


    /**
     * addError
     * @param error error to be added to db
     * @returns new reference callback
     */
    async addError(error: PNPError) {
        const newPath = push(child(this.errs, error.type))
        error.errorId = newPath.key!
        return await set(newPath, error)
    }

    /**
     * addError
     * @param error error to be added to db
     * @returns new reference callback
     */
    static async addError(error: PNPError, db: Database) {
        const newPath = push(child(ref(db, 'errors'), error.type))
        error.errorId = newPath.key!
        return await set(newPath, error)
    }

    async addListenerToTransactionConfirmation(voucher: string, consume: (c: PNPTransactionConfirmation | null) => void) {
        try {
            let transactionsSnap = (await get(child(this.transactionConfirmations, voucher)));
            if (!transactionsSnap.exists()) {
                return consume(null)
            }
            return consume(transactionsSnap.val())
        } catch (E) {
            consume(null)
        }
    }

    async invalidateTransactionConfirmations(voucher: string, ridesLeft: number) {
        return await update(child(this.transactionConfirmations, voucher), {
            ridesLeft: ridesLeft,
            lastScanDate: getCurrentDate().getMilliseconds()
        })
    }




    getTransaction(customer_uid: string,
        transaction_uid: string,
        consume: (transaction: TransactionSuccess) => void,
        onError: (e: Error) => void) {
        return onValue(child(child(this.transactions, customer_uid), transaction_uid), (snap) => {
            consume(snap.val())
        }, onError)
    }


    getAllTransactionConfirmations(
        eventId: string,
        consume: (transactions: PNPTransactionConfirmationExtended[]) => void,
        onError: (e: Error) => void) {
        return onValue(this.transactionConfirmations, (snap) => {
            let output: PNPTransactionConfirmationExtended[] = []
            snap.forEach(confirmation => {
                if (confirmation.child('eventId').val() === eventId) {
                    output.push(confirmation.val())
                }
            })
            consume(output)
        }, onError)
    }

    getAllTransactions(customer_uid: string, consume: (transactions: TransactionSuccess[]) => void, onError: (e: Error) => void) {
        return onValue(child(this.transactions, customer_uid), (snap) => {
            const transactions: TransactionSuccess[] = []
            snap.forEach(transactionSnap => {
                transactions.push(transactionSnap.val())
            })

            let spl, spl2;
            transactions.sort((e1: TransactionSuccess, e2: TransactionSuccess) => {
                spl = dateStringFromDate(new Date(e1.date)).split('/');
                spl2 = dateStringFromDate(new Date(e2.date)).split('/');
                if (Number(spl[2]) > Number(spl2[2])) {
                    return -1;
                } else if (Number(spl2[2]) > Number(spl[2]))
                    return 1;

                if (Number(spl[1]) > Number(spl2[1])) {
                    return -1;
                } else if (Number(spl2[1]) > Number(spl[1]))
                    return 1;

                if (Number(spl[0]) > Number(spl2[0])) {
                    return -1;
                } else if (Number(spl2[2]) > Number(spl[2]))
                    return 1;
                return 0;
            })
            consume(transactions)
        }, onError)
    }

    getAllTransactionsForEvent(eid: string, consume: (transactions: RideStatistics[]) => void, onError: (e: Error) => void) {
        return onValue(this.transactions, (snap) => {
            const allTransactions: RideStatistics[] = []
            let nextRef: DataSnapshot | null = null
            snap.forEach(user => {
                let i = 0;
                user.forEach(transaction => {
                    nextRef = transaction.child('more_info')
                    if (nextRef.exists() && nextRef!.child('eventId').val() === eid) {
                        allTransactions.push({
                            rideStartPoint: nextRef!.child('startPoint').val(),
                            uid: user.key! + `_nm_${i}`,
                            customerId: transaction.child('customer_uid').val(),
                            customerPhone: nextRef!.child('customerPhone').val(),
                            customerEmail: nextRef!.child('customerEmail').val(),
                            customerName: nextRef!.child('customerName').val(),
                            date: transaction!.child('date').val(),
                            extraPeople: nextRef!.child('extraPeople').val(),
                            amount: nextRef!.child('amount').val()
                        })
                        i++;
                    }
                })
            })
            allTransactions.sort(datesComparator)
            consume(allTransactions)
        }, onError)
    }

    addListenertoRidesForDates = (transactions: TransactionSuccess[],
        onSuccess: (transformedTransactions: TransactionSuccess[]) => void,
        onFailure: (o: Error) => void) => {
        onValue(child(child(this.rides, 'public'), 'ridesForEvents'), (snap) => {
            let i = 0;
            let output = Array.from(transactions);
            transactions.forEach(transaction => {
                let tChild = snap.child(transaction.more_info.eventId)
                    .child(transaction.more_info.rideId);
                let rideDate = tChild.child('date')
                    .val();
                let rideTime = tChild.child('rideTime')
                    .val();
                output[i++].more_info.eventDate = rideDate + " " + rideTime;
            })
            onSuccess(output);
        }, onFailure);
    }

    addListersForRideSearch(onSuccess: (rides: PNPPublicRide[]) => void, onFailure: (o: Error) => void) {
        return onValue(child(child(this.rides, 'public'), 'ridesForEvents'), snap => {
            const rides: PNPPublicRide[] = []
            snap.forEach(eventSnap => {
                eventSnap.forEach(rideSnap => {
                    rides.push(rideSnap.val())
                })
            })
            onSuccess(rides)
        }, onFailure)
    }

    getAllPublicEvents = (consume: (events: PNPEvent[]) => void) => {
        const pRef = this.allEvents
        return onValue(child(pRef, 'public'), (snap) => {
            const events: PNPEvent[] = []
            snap.forEach(eventCategorySnap => {
                eventCategorySnap.forEach(eventSnap => {
                    events.push(eventSnap.val())
                })
            })
            consume(events)
        })
    }
    getAllPrivateEvents = (consume: (events: PNPEvent[]) => void) => {
        const pRef = this.allEvents
        return onValue(child(pRef, 'private'), (snap) => {
            const events: PNPEvent[] = []
            snap.forEach(eventCategorySnap => {
                eventCategorySnap.forEach(eventSnap => {
                    events.push(eventSnap.val())
                })
            })
            consume(events)
        })
    }


    async giveScannerPermissionsByEmail(email: string, eventId: string) {
        return await this.getUserIdByEmail(email, async (userId) => {
            this.updateUser({
                producer: true,
                producingEventId: eventId
            }, userId)
        }, () => { })
    }

    async takeScannerPermissionsByEmail(email: string) {
        return await this.getUserIdByEmail(email, async (userId) => {
            this.updateUser({ producer: false }, userId)
        }, () => { })
    }

    // Makes a user responsible of a private event
    // takes user as parameter and does the changes
    async makeUserResponsible(userId: string,
        event: PNPPrivateEvent) {
        event.eventProducerId = userId
        return await this.updatePrivateEvent(event.eventId, event)
    }

    // Edit confirmations functions
    // NOTES: update_confirmation , delete_confirmation
    async updateConfirmation(eventId: string,
        userName: string,
        confirmation: PNPRideConfirmation) {
        return await get(child(child(this.rides, 'confirmations'), eventId))
            .then(snap => {
                let ret: PNPRideConfirmation | undefined
                snap.forEach(cSnap => {
                    if (cSnap.child('userName').val() === userName) {
                        ret = cSnap.val() as PNPRideConfirmation
                        update(cSnap.ref, confirmation)
                    }
                })
                return ret
            })
    }
    async deleteConfirmation(eventId: string,
        userName: string) {
        return await get(child(child(this.rides, 'confirmations'), eventId))
            .then(snap => {
                let ret: PNPRideConfirmation | undefined;
                snap.forEach(cSnap => {
                    if (cSnap.child('userName').val() === userName) {
                        ret = cSnap.val() as PNPRideConfirmation
                        remove(cSnap.ref)
                    }
                })
                return ret
            }).catch((e) => this.createError("deleteConfirmation", e));
    }

    async getUserIdByEmail(email: string,
        consume: ((userId: string) => void),
        error: (() => void)) {
        await get(this.users)
            .then(snap => {
                snap.forEach(child => {
                    if (child.child('email').val() === email) {
                        consume(child.key!)
                        return
                    }
                })
                error()
            }).catch((e) => this.createError("getUserIdByEmail", e));
    }



    getUserById(id: string, consume: (u: PNPUser) => void): Unsubscribe {
        return onValue(child(this.users, id), (snap) => {
            consume(snap.val())
        })
    }

    async getUserById2(id: string, consume: (u: PNPUser) => void) {
        return await get(child(this.users, id)).then(snap =>
            consume(snap.val()))
            .catch((e) => this.createError("getUserById2", e));
    }




    async addRideRequest(request: PNPRideRequest) {
        if (!this.auth.currentUser)
            return
        const newRef = push(child(child(this.rides, 'rideRequests'), request.eventId))
        return await set(newRef, request)
    }


    /**
     * createError
     * @param type error type
     * @param e error to be created
     * @returns new refernce callback
     */
    async createError(type: string, e: any) {
        const date = new Date().toUTCString()
        const err: PNPError = {
            type: type,
            date: date,
            errorId: '',
            error: e.message ? e.message : e ? { ...e } : ''
        }
        return this.addError(err)
    }
    /**
  * createErrorCustomer
  * @param type error type
  * @param extraData  extra error to be created
  * @returns new refernce callback
  */
    async createErrorCustomer(type: string, extraData?: { email: string, more: any }) {
        const date = new Date().toUTCString()
        const err: PNPError = {
            type: type,
            date: date,
            errorId: '',
            extraData: extraData,
            error: ''
        }
        return this.addError(err)
    }

    /**
  * createError
  * @param type error type
  * @param e error to be created
  * @returns new refernce callback
  */
    static async createError(type: string, e: any, db: Database) {
        const date = new Date().toUTCString()
        const err: PNPError = {
            type: type,
            date: date,
            errorId: '',
            error: e
        }
        return Realtime.addError(err, db)
    }

    /**
     * getRideConfirmationByEventId
     * @param eventId to get confirmation for
     * @returns confirmation of event attendance for current user if exists
     */
    getRideConfirmationByEventId(eventId: string, userId: string, consume: ((confirmation: PNPRideConfirmation | null) => void)) {
        return onValue(child(child(child(this.rides, 'confirmations'), eventId), userId), (snap) => {
            if (snap.exists()) {
                consume(snap.val())
            } else consume(null)
        })
    }

    /**
  * getRideAllConfirmationByEventId
  * @param eventId to get confirmation for
  * @returns confirmation of event attendance for current user if exists
  */
    getAllRideConfirmationByEventId(eventId: string, consume: ((confirmations: PNPRideConfirmation[] | null) => void)) {
        return onValue(child(child(this.rides, 'confirmations'), eventId), (snap) => {
            if (snap.exists()) {
                const total: PNPRideConfirmation[] = []
                snap.forEach((userConfirmationsSnap) => {
                    total.push(userConfirmationsSnap.val())
                })
                consume(total)
            } else consume(null)
        })
    }

    addListenerToUsers(consume: (users: PNPUser[]) => void, error: (e: Error) => void) {
        return onValue(this.users, (userSnaps) => {
            const users: PNPUser[] = []
            userSnaps.forEach(snap => {
                users.push(snap.val())
            })
            consume(users)
        }, error)
    }




    async removeTransaction(customerId: string, rideName: string) {
        const transacs = await get(this.transactions)
        let removed = false
        transacs.child(customerId).forEach(transaction => {
            if (transaction.child('more_info').child('startPoint').val() === rideName) {
                remove(child(this.transactionConfirmations, transaction.child('approval_num').val()))
                remove(transaction.ref)
                removed = true
            }
        })
        return removed
    }

    async getAllUsersByIds(
        csvData: boolean,
        ids_and_extraPeople: UserIdAndExtraPeople[]): Promise<UserAndExtraPeople[] | null> {
        type ExtraPeople = { [uid: string]: { fullName: string, phoneNumber: string }[] }
        return await get(this.users)
            .then(snap => {
                const total: UserAndExtraPeople[] = []
                const extraPeople: ExtraPeople = {}
                for (const id_and_p of ids_and_extraPeople) {
                    let uid = csvData ? id_and_p.uid.split('_nm')[0] : id_and_p.uid;
                    if (!extraPeople[uid]) {
                        extraPeople[uid] = id_and_p.extraPeople
                    } else {
                        if (id_and_p.extraPeople && !extraPeople[uid].includes(id_and_p.extraPeople[id_and_p.extraPeople.length - 1]))
                            extraPeople[uid].push(...id_and_p.extraPeople)
                    }
                }
                snap.forEach(userSnap => {
                    var uid = userSnap.child('customerId').val()
                    if (extraPeople[uid] || extraPeople[uid] === null) {
                        total.push({
                            user: userSnap.val(),
                            extraPeople: extraPeople[uid]
                        })
                    }
                })
                return total
            }).catch(e => { this.createError('getAllUsersByIds', e); return null; })
    }

    /**
     * addRideConfirmation
     * @param confirmation confirmation to be added for current user
     * @returns new reference callback
     */
    async addRideConfirmation(confirmation: PNPRideConfirmation): Promise<object | void> {
        let newPath = push(child(child(this.rides, 'confirmations'), confirmation.eventId))
        return await set(newPath, confirmation)
    }

    /**
 * addRideConfirmationWorkers
 * @param confirmation confirmation to be added for current user
 * @returns new reference callback
 */
    async addRideConfirmationWorkers(uid: string, confirmation: PNPCompanyRideConfirmation): Promise<any | boolean> {
        return set(child(child(child(child(child(this.rides, 'confirmationsWorkers'), confirmation.companyId), hyphenToMinus(confirmation.date)), confirmation.rideId), uid), confirmation)
    }

    /**
* removeRideConfirmationWorkers
* @param confirmation confirmation to be added for current user
* @returns new reference callback
*/
    async removeRideConfirmationWorkers(uid: string, confirmation: PNPCompanyRideConfirmation): Promise<any | boolean> {
        return remove(child(child(child(child(child(this.rides, 'confirmationsWorkers'), confirmation.companyId), hyphenToMinus(confirmation.date)), confirmation.rideId), uid))
    }

    addListenerToWorkerConfirmations(uid: string, companyId: string, consume: (rides: PNPCompanyRideConfirmation[]) => void) {
        return onValue(child(child(this.rides, 'confirmationsWorkers'), companyId), (val) => {
            const allConfirmations: PNPCompanyRideConfirmation[] = []
            val.forEach(date => {
                date.forEach(ride => {
                    if (ride.hasChild(uid)) {
                        allConfirmations.push(ride.child(uid).val())
                    }
                })
            })
            consume(allConfirmations)
        })
    }

    addListenerToCompanyConfirmations(companyId: string, consume: (confirmationMapping: CompanyConfirmationsMapping) => void) {
        return onValue(child(child(this.rides, 'confirmationsWorkers'), companyId), (val) => {
            let allConfirmations: any = {};
            val.forEach(dateSnap => {
                const date = dateSnap.key!
                let confirmations: PNPCompanyRideConfirmation[] = []
                dateSnap.forEach(ride => {
                    let rideVal: any;

                    ride.forEach(confirmation => {
                        if (!rideVal)
                            rideVal = confirmation.child('startPoint').val()
                        confirmations.push(confirmation.val())
                    })
                    if (!allConfirmations[rideVal])
                        allConfirmations[rideVal] = [{ date, confirmations }]
                    else
                        allConfirmations[rideVal].push({ date, confirmations })
                })
            })
            consume(allConfirmations)
        })
    }
    /**
       * addPublicRide
       * @param ride a public ride to be added
       * @returns a new reference or error reference
       */
    addPublicRide = async (eventId: string, ride: PNPPublicRide, privateEvent: boolean = false): Promise<object | void> => {
        ride.eventId = eventId
        const newRef = push(child(child(child(this.rides, privateEvent ? 'private' : 'public'), 'ridesForEvents'), eventId))
        ride.rideId = newRef.key!

        if (ride.extras.isRidePassengersLimited) {
            let newStatus: 'on-going' | 'sold-out' | 'running-out';
            let ticketsLeft = Number(ride.extras.rideMaxPassengers) - Number(ride.passengers)
            if (ticketsLeft <= 0) {
                newStatus = 'sold-out'
            } else if (ticketsLeft <= 15) {
                newStatus = 'running-out'
            } else {
                newStatus = 'on-going'
            }
            ride.extras.rideStatus = newStatus;
        }
        return await set(newRef, ride).catch((e) => { this.createError('addPublicRide', e) })
    }

    addWorkersRide = async (eventId: string, ride: PNPWorkersRide): Promise<object | void> => {
        ride.companyId = eventId
        const newRef = push(child(child(this.rides, 'workers'), eventId))
        ride.id = newRef.key!
        return await set(newRef, ride).catch((e) => { this.createError('addWorkersRide', e) })
    }

    removeWorkersRide = async (companyId: string, rideId: string): Promise<object | void> => {
        await remove(child(child(child(this.rides, 'confirmationsWorkers'), companyId), rideId))
        return await remove(child(child(child(this.rides, 'workers'), companyId), rideId))
    }
    removePublicRide = async (eventId: string, rideId: string): Promise<object | void> => {
        return await remove(child(child(child(child(this.rides, 'public'), 'ridesForEvents'), eventId), rideId))
    }
    removePrivateRide = async (eventId: string, rideId: string): Promise<object | void> => {
        return await remove(child(child(child(child(this.rides, 'private'), 'ridesForEvents'), eventId), rideId))
    }

    async removePrivateEvent(eventId: string) {
        await remove(child(child(child(this.allEvents, 'private'), 'approved'), eventId))
            .catch((e) => { this.createError('removePrivateEvent', e) })
        return await remove(child(child(child(this.rides, 'private'), 'ridesForEvents'), eventId))
            .catch((e) => { this.createError('removePrivateEvent', e) })
    }

    /**
 * addPrivateRide
 * @param ride a private ride to be added
 * @returns a new reference or error reference
 */
    addPrivateRideExplicit = async (ride: PNPExplicitPrivateRide): Promise<object | void> => {
        if (this.auth.currentUser) {
            const p = push(child(child(child(this.rides, 'private'), 'ridesForPeople'), this.auth.currentUser!.uid))
            ride.rideId = p.key!
            return await set(p, ride)
                .catch((e) => { this.createError('addPrivateRideExplicit', e) })
        }
    }

    /**
* addPrivateRide
* @param ride a private ride to be added
* @returns a new reference or error reference
*/
    getAllPrivateRideExplicit = (consume: (rides: PNPExplicitPrivateRide[]) => void,
        error: (error: any) => void) => {
        return onValue(child(child(this.rides, 'private'), 'ridesForPeople'), (snap) => {
            let ret: PNPExplicitPrivateRide[] = []
            const currentDate = getCurrentDate()
            snap.forEach(cusSnap => {
                cusSnap.forEach(rideSnap => {
                    const date = rideSnap.child('date').val().split('/')
                    if (date[2] >= currentDate.getFullYear() && date[1] >= currentDate.getMonth())
                        if (date[0] >= currentDate.getDate())
                            ret.push(rideSnap.val())
                        else remove(rideSnap.ref)
                    else remove(rideSnap.ref)
                })
            })
            consume(ret)
        }, error)
    }




    addPrivateEvent = async (event: PNPPrivateEvent, imageBuffer?: ArrayBuffer): Promise<{ id: string } | void> => {
        if (this.auth.currentUser) {
            const p = push(child(child(this.allEvents, 'private'), 'waiting'))
            event.eventId = p.key!
            event.eventProducerId = this.auth.currentUser.uid
            if (imageBuffer) {
                return await uploadBytes(storageRef(this.storage, 'PrivateEventImages/' + "/" + event.eventId), imageBuffer)
                    .then(async snap => {
                        return await getDownloadURL(snap.ref)
                            .then(async url => {
                                event.eventImageURL = url
                                return await set(p, event).then(() => {
                                    return { id: p.key! }
                                }).catch((e) => { this.createError('addPrivateEvent', e) })
                            })
                    })
            } else {
                return await set(p, event).then(() => {
                    return { id: event.eventId }
                }).catch((e) => { this.createError('addPrivateEvent', e) })
            }
        }
    }


    addListenerToPrivateEvents = (consume: (o: { [type: string]: PNPPrivateEvent[] }) => void, includeWaiting: boolean) => {
        return onValue(child(this.allEvents, 'private'), snap => {
            const hashTable: { [type: string]: PNPPrivateEvent[] } = {}

            let p: any = null;
            snap.forEach((type) => {
                p = type.key!
                if (includeWaiting || p !== 'waiting') {
                    type.forEach(event => {
                        if (!p || !hashTable[p])
                            hashTable[p] = [event.val()]
                        else hashTable[p].push(event.val())
                    })
                }
            })

            let spl, spl2;
            for (var k of Object.keys(hashTable))
                hashTable[k].sort((e1: PNPPrivateEvent, e2: PNPPrivateEvent) => {
                    spl = e1.eventDate.split('/');
                    spl2 = e2.eventDate.split('/');
                    if (Number(spl[2]) > Number(spl2[2])) {
                        return -1;
                    } else if (Number(spl2[2]) > Number(spl[2]))
                        return 1;

                    if (Number(spl[1]) > Number(spl2[1])) {
                        return -1;
                    } else if (Number(spl2[1]) > Number(spl[1]))
                        return 1;

                    if (Number(spl[0]) > Number(spl2[0])) {
                        return -1;
                    } else if (Number(spl2[2]) > Number(spl[2]))
                        return 1;
                    return 0;
                })
            consume(hashTable)
        })
    }





    /**
    * addListenerToRideRequests
    * @param consume a callback to consume the ride requests array
    * @returns onValue change listener for ride requests
    */

    addListenerToRideRequestsByEventId = (eventId: string, consume: (requests: PNPRideRequest[]) => void) => {
        return onValue(child(child(this.rides, 'rideRequests'), eventId), (snap) => {
            const requests: PNPRideRequest[] = []
            const hash: { [id: string]: boolean } = {}
            const decode = (s: DataSnapshot) => {
                if (!hash[s.child('requestUserId').val() as string]) {
                    requests.push(s.val())
                    hash[requests[requests.length - 1].requestUserId] = true
                }
            }
            snap.forEach(decode)
            consume(requests)
        })
    }


    /**
     * addListenerToClubEvents
     * @param consume a callback to consume the events array
     * @returns onValue change listener for club events
     */
    addListenerToClubEvents = (consume: (o: PNPEvent[]) => void) => {
        return onValue(child(child(this.allEvents, 'public'), 'clubs'), snap => {
            const ret: PNPEvent[] = []
            snap.forEach(ev => {
                ret.push(ev.val())
            })

            ret.sort((a, b) => {
                const x = a.eventDate.split('/')
                const y = b.eventDate.split('/')
                if (x.length < 3 || y.length < 3)
                    return 0
                else if (Number(x[2]) > Number(y[2]) || Number(x[1] > y[1]) || Number(x[0]) > Number(y[0])) {
                    return 1
                } else if (Number(x[2]) < Number(y[2]) || Number(x[1] < y[1]) || Number(x[0]) < Number(y[0])) {
                    return -1
                } else return 0
            })
            consume(ret)
        })
    }
    /**
   * addListenerToCultureEvents
   * @param consume a callback to consume the events array
   * @returns onValue change listener for culture events
   */
    addListenerToCultureEvents = (consume: (o: PNPEvent[]) => void) => {
        return onValue(child(child(this.allEvents, 'public'), 'culture'), snap => {
            const ret: PNPEvent[] = []
            snap.forEach(ev => {
                ret.push(ev.val())
            })
            consume(ret)
        })
    }
    /**
* addListenerToPublicEvents
* @param consume a callback to consume the events array
* @returns onValue change listener for events
*/


    addListenerToPublicEvents = (consume: (o: { [type: string]: PNPEvent[] }) => void, includeWaiting: boolean) => {
        return onValue(child(this.allEvents, 'public'), snap => {
            const hashTable: { [type: string]: PNPEvent[] } = {}

            let p: any = null;
            snap.forEach((type) => {
                p = type.key!
                if (includeWaiting || p !== 'waiting') {
                    type.forEach(event => {
                        if (!p || !hashTable[p])
                            hashTable[p] = [event.val()]
                        else hashTable[p].push(event.val())
                    })
                }
            })

            let spl, spl2;
            for (var k of Object.keys(hashTable))
                hashTable[k].sort((e1: PNPEvent, e2: PNPEvent) => {
                    spl = e1.eventDate.split('/');
                    spl2 = e2.eventDate.split('/');
                    if (Number(spl[2]) > Number(spl2[2])) {
                        return -1;
                    } else if (Number(spl2[2]) > Number(spl[2]))
                        return 1;

                    if (Number(spl[1]) > Number(spl2[1])) {
                        return -1;
                    } else if (Number(spl2[1]) > Number(spl[1]))
                        return 1;

                    if (Number(spl[0]) > Number(spl2[0])) {
                        return -1;
                    } else if (Number(spl2[2]) > Number(spl[2]))
                        return 1;
                    return 0;
                })
            consume(hashTable)
        })
    }





    /**
     * addListenerToCurrentUser
     * @param userId a userid to be listened to
     * @param consume callback that consumes the PNP user
     * @returns onValue change listener for user
     */
    addListenerToCurrentUser = (consume: (o: PNPUser) => void) => {
        if (this.auth.currentUser != null)
            return onValue(child(this.users, this.auth.currentUser!.uid), (snap) => consume(snap.val()))
    }
    /**
     * updateClubEvent
     * @param eventId eventid to be updated
     * @param event event info to be updated
     * @returns update callback
     */
    updateClubEvent = async (eventId: string, event: object) => {
        return await update(child(child(child(this.allEvents, 'public'), 'clubs'), eventId), event)
            .catch((e) => { this.createError('updateClubEvent', e) })
    }

    async setScanner(eventid: string, uid: string, uname: string) {
        return await set(child(child(this.scanners, eventid), uid),
            { userId: uid, userName: uname })
    }

    async removeScanner(eventid: string, uid: string) {
        return await remove(child(child(this.scanners, eventid), uid))
    }

    getAllScanners(eventId: string, consume: (names: string[]) => void) {
        return onValue(child(this.scanners, eventId), snap => {
            let output: string[] = []
            snap.forEach(u => {
                output.push(u.child('userName').val())
            })
            consume(output)
        })
    }


    updateEvent = async (eventId: string, event: any,
        mobileImageBuffer?: ArrayBuffer | null,
        desktopImageBuffer?: ArrayBuffer | null,
        eventOldType?: string) => {
        const uploadEvent = async () => {
            if (eventOldType !== event.eventType) {
                // remove the event from old type route
                await remove(child(child(child(this.allEvents, 'public'), eventOldType ?? event.eventType), eventId))
                    .catch((e) => { this.createError('updateClubEvent', e) })
                // add the event to new type route
                return await set(child(child(child(this.allEvents, 'public'), event.eventType), eventId), event)
                    .catch((e) => { this.createError('updateClubEvent', e) })
            }
            // update same route
            return await update(child(child(child(this.allEvents, 'public'), eventOldType ?? event.eventType), eventId), event)
                .catch((e) => { this.createError('updateClubEvent', e) })
        }

        if ((mobileImageBuffer && mobileImageBuffer !== null) || (desktopImageBuffer && desktopImageBuffer !== null)) {
            if (mobileImageBuffer !== null) {
                return await uploadBytes(storageRef(this.storage, 'EventImages/' + "Mobile" + '/' + event.eventType + "/" + event.eventId), mobileImageBuffer!)
                    .then(async snap => {
                        return await getDownloadURL(snap.ref)
                            .then(async mobileUrl => {
                                if (desktopImageBuffer !== null) {
                                    return await uploadBytes(storageRef(this.storage, 'EventImages/' + "Desktop" + '/' + event.eventType + "/" + event.eventId), desktopImageBuffer!)
                                        .then(async snapDesktop => {
                                            return await getDownloadURL(snapDesktop.ref)
                                                .then(async destkopUrl => {
                                                    event.eventMobileImageURL = mobileUrl
                                                    event.eventImageURL = destkopUrl
                                                    return uploadEvent();
                                                })
                                        })
                                } else {
                                    event.eventMobileImageURL = mobileUrl
                                    return uploadEvent();
                                }
                            })
                    })
            } else {
                return await uploadBytes(storageRef(this.storage, 'EventImages/' + "Desktop" + '/' + event.eventType + "/" + event.eventId), desktopImageBuffer!)
                    .then(async snapDesktop => {
                        return await getDownloadURL(snapDesktop.ref)
                            .then(async destkopUrl => {
                                event.eventImageURL = destkopUrl
                                return uploadEvent();
                            })
                    })
            }
        } else return await uploadEvent()

    }

    updatePrivateEvent = async (eventId: string, event: any, blob?: ArrayBuffer) => {
        const uploadEvent = async () => {
            // update same route
            return await update(child(child(child(this.allEvents, 'private'), 'approved'), eventId), event)
                .catch((e) => { this.createError('updatePrivateEvent', e) })
        }
        if (blob) {
            return await uploadBytes(storageRef(this.storage, 'PrivateEventImages/' + "/" + event.eventId), blob)
                .then(async snap => {
                    return await getDownloadURL(snap.ref)
                        .then(async url => {
                            event.eventImageURL = url
                            return uploadEvent();
                        })
                })
        } else return await uploadEvent()

    }

    /**
     * removeRideRequestByUser&EventIds
     * @param eventId eventId to be for ride request to be removed from
     * @param userId requesteer userId
     * @returns remove callback
     */

    removeRideRequest = async (eventId: string, userId: string) => {
        get(child(child(this.rides, 'rideRequests'), eventId))
            .then(snap => {
                snap.forEach(aChild => {
                    if (aChild.child('requestUserId').val() === userId && aChild.child('eventId').val() === eventId) {
                        remove(aChild.ref)
                            .catch((e) => { this.createError('removeRideRequest', e) })
                    }
                })
            })

    }
    /**
     * removeClubEvent
     * @param eventId eventid to be removed
     * @returns remove callback
     */
    removeClubEvent = async (eventId: string) => {
        return await remove(child(child(child(this.allEvents, 'public'), 'clubs'), eventId))
            .catch((e) => { this.createError('removeClubEvent', e) })
    }

    removeEvent = async (event: PNPEvent) => {
        return await remove(child(child(child(this.allEvents, 'public'), event.eventType), event.eventId))
            .catch((e) => { this.createError('removeEvent', e) })
            .then(async () => {
                return await remove(child(child(child(this.rides, 'public'), 'ridesForEvents'), event.eventId))
                    .catch(e => { this.createError('removeEvent', e) })
            })
    }
    /**
   * updateCultureEvent
   * @param eventId eventid to be updated
   * @param event event info to be updated
   * @returns update callback
   */
    updateCultureEvent = async (eventId: string, event: object) => {
        return await update(child(child(child(this.allEvents, 'public'), 'culture'), eventId), event)
            .catch(e => {
                const date = new Date().toDateString()
                const err: PNPError = {
                    type: 'updateCultureEvent',
                    date: date,
                    errorId: '',
                    error: e
                }
                return this.addError(err)
            })
    }


    /**
     * updatePrivateRide
     * @param rideId rideId to be updated
     * @param ride ride values to be updated
     * @returns update callback
     */
    updatePrivateRide = async (rideId: string, ride: object) => {
        return await update(child(child(this.rides, 'private'), rideId), ride)
    }


    /**
 * updatePublicRide
 * @param eventId eventId that the ride is connected to
 * @param rideId rideId to be updated
 * @param ride ride values to be updated
 * @returns update callback
 */
    updatePublicRide = async (eventId: string, rideId: string, ride: any, privateEvent: boolean = false) => {

        if (ride.extras.isRidePassengersLimited) {
            let newStatus: 'on-going' | 'sold-out' | 'running-out';
            let ticketsLeft = Number(ride.extras.rideMaxPassengers) - Number(ride.passengers)
            if (ticketsLeft <= 0) {
                newStatus = 'sold-out'
            } else if (ticketsLeft <= 15) {
                newStatus = 'running-out'
            } else {
                newStatus = 'on-going'
            }
            ride.extras.rideStatus = newStatus;
        }
        return await update(child(child(child(child(this.rides, privateEvent ? 'private' : 'public'),
            'ridesForEvents'), eventId), rideId), ride)
    }

    updateWorkersRide = async (companyId: string, rideId: string, ride: any) => {

        if (ride.extras.isRidePassengersLimited) {
            let newStatus: 'on-going' | 'sold-out' | 'running-out';
            let ticketsLeft = Number(ride.extras.rideMaxPassengers) - Number(ride.passengers)
            if (ticketsLeft <= 0) {
                newStatus = 'sold-out'
            } else if (ticketsLeft <= 15) {
                newStatus = 'running-out'
            } else {
                newStatus = 'on-going'
            }
            ride.extras.rideStatus = newStatus;
        }
        return await update(child(child(child(this.rides, 'workers'), companyId), rideId), ride)
    }
    /**
      * updateCurrentUser
      * @param user user values to be updated
      * @returns update callback
      */
    updateCurrentUser = async (user: object) => {
        if (this.auth.currentUser)
            return await update(child(this.users, this.auth.currentUser!.uid), user)
    }

    /**
     * updateUser
     * @param user user values to be updated
     * @returns update callback
     */
    updateUser = async (user: object, id: string) => {
        if (this.auth.currentUser)
            return await update(child(this.users, id), user)
    }


    /**
      * updateCurrentUser
      * @param user user values to be updated
      * @returns update callback
      */
    static updateCurrentUser = async (user: object, auth: Auth, db: Database) => {
        if (auth.currentUser)
            return await update(child(ref(db, 'users'), auth.currentUser!.uid), user)
    }

    /**
    * removeCultureEvent
    * @param eventId eventid to be removed
    * @returns remove callback
    */
    removeCultureEvent = async (eventId: string) => {
        return await remove(child(child(child(this.allEvents, 'public'), 'culture'), eventId))
            .catch((e) => { this.createError('removeCultureEvent', e) })
    }

    /**
     * addClubEvent
     * @param event event to be added
     * @returns new reference callback
     */

    addClubEvent = async (event: PNPEvent): Promise<object | void> => {
        const newRef = push(child(child(this.allEvents, 'public'), 'clubs'))
        event.eventId = newRef.key!
        return await set(newRef, event)
            .catch((e) => { this.createError('addClubEvent', e) })
    }
    /**
       * addCultureEvent
       * @param event event to be added
       * @returns new reference callback
       */
    addCultureEvent = async (event: PNPEvent): Promise<object | void> => {
        const newRef = push(child(child(this.allEvents, 'public'), 'culture'))
        event.eventId = newRef.key!
        return await set(newRef, event)
            .catch((e) => { this.createError('addCultureEvent', e) })
    }


    /**
    * createEvent
    * @param event event to be added
    * @param blob : image blob for event *required
    * @param uploadEventImage
    * @returns new reference callback
    */
    createEvent = async (event: PNPEvent, blob: ArrayBuffer): Promise<object | void> => {
        const newRef = push(child(child(this.allEvents, 'public'), 'waiting'))
        event.eventId = newRef.key!
        return await uploadBytes(storageRef(this.storage, 'EventImages/' + event.eventType + "/" + event.eventId), blob)
            .then(async snap => {
                return await getDownloadURL(snap.ref)
                    .then(async url => {
                        event.eventImageURL = url
                        return await set(newRef, event)
                            .catch((e) => { this.createError('addEvent', e) })
                    })
            })
    }

    addListenerToWaitingEvents(consume: (waiting: PNPEvent[]) => void) {
        return onValue(child(child(this.allEvents, 'public'), 'waiting'), snap => {
            const events: PNPEvent[] = []
            snap.forEach(event => {
                events.push(event.val())
            })
            consume(events)
        })
    }

    addListenerToPublicAndWaitingEvents(consumePublicEvents: (waiting: PNPEvent[]) => void, consumeWaitingEvents: (o: PNPEvent[]) => void) {

        return onValue(child(this.allEvents, 'public'), snap => {
            const approvedEvents: PNPEvent[] = []
            const waitingEvents: PNPEvent[] = []
            snap.forEach((type) => {
                if (type.key! !== 'waiting') {
                    type.forEach(event => {
                        approvedEvents.push(event.val())
                    })
                } else {
                    type.forEach(event => {
                        waitingEvents.push(event.val())
                    })
                }

            })
            consumePublicEvents(approvedEvents)
            consumeWaitingEvents(waitingEvents)
        })
    }

    addUserStatistic(page: PNPPage) {
        let stat = 'numberOfUsersAttended'
        const pageValue = page.valueOf()
        let dateString = dateStringFromDate(getCurrentDate()).replaceAll('/', '-')
        try {
            get(child(child(child(this.statistics, pageValue), dateString), stat))
                .then(snapshot => {
                    const val = snapshot.val()
                    update(child(child(this.statistics, pageValue), dateString), { numberOfUsersAttended: val ? (val + 1) : 1 })
                })
        } catch (e) { }

    }

    addListenerToUserStatistics(consume: (stats: UserEnterStatistics) => void) {
        return onValue(child(this.statistics, PNPPage.home), (snap) => {
            let output: UserEnterStatistics;
            let all_stats: UserDateSpecificStatistics[] = [];
            snap.forEach(date => {
                let actualStringDate = date.key!
                all_stats.push({ date: actualStringDate, numberOfUserAttended: date.child('numberOfUsersAttended').val() })
            })
            output = { stats: all_stats }
            consume(output)
        })
    }

    addBrowsingStat(page: PNPPage, stat: 'leaveNoAttendance' | 'leaveWithAttendance') {
        const pageValue = page.valueOf()
        let dateString = dateStringFromDate(getCurrentDate()).replaceAll('/', '-')
        try {
            get(child(child(child(this.statistics, pageValue), dateString), stat))
                .then(snapshot => {
                    const val = snapshot.val()
                    switch (stat) {
                        case 'leaveNoAttendance':
                            update(child(child(this.statistics, pageValue), dateString), { leaveNoAttendance: val ? (val + 1) : 1 })
                            break;
                        case 'leaveWithAttendance':
                            update(child(child(this.statistics, pageValue), dateString), { leaveWithAttendance: val ? (val + 1) : 1 })
                            break;
                    }
                })
        } catch (e) { }

    }

    async updateWebsiteRegistrationPage(
        extras: RegisterFormExtras) {
        let result = await set(child(this.siteSettings, 'home'), extras)
        return result
    }

    addListenerToRegistrationPage(consume: (extras: RegisterFormExtras) => void, error?: () => void) {
        return onValue(child(this.siteSettings, 'home'), (snap) => {
            consume(snap.val())
        }, error)
    }

    addListenerToBrowsingStat(page: PNPPage, date: string, consume: (data: { leaveNoAttendance: number, leaveWithAttendance: number }) => void) {
        return onValue(child(child(this.statistics, page.valueOf()), date), (snap) => {
            const withAttendnace = snap.child('leaveWithAttendance').val()
            const noAttendance = snap.child('leaveNoAttendance').val()
            consume({ leaveNoAttendance: noAttendance, leaveWithAttendance: withAttendnace })
        })
    }

    approveEvent = async (eventId: string) => {
        const eventRef = child(child(child(this.allEvents, 'public'), 'waiting'), eventId)
        get(eventRef)
            .then(snap => {
                remove(eventRef)
                    .then(async () => {
                        const event = snap.val()
                        return await set(child(child(child(this.allEvents, 'public'), event.eventType!), eventId), event)
                    }).catch(e => {
                        this.createError('approveEvent', e)
                    })
            }).catch(e => {
                this.createError('approveEvent', e)
            })
    }

    approvePrivateEvent = async (eventId: string) => {
        const eventRef = child(child(child(this.allEvents, 'private'), 'waiting'), eventId)
        get(eventRef)
            .then(snap => {
                remove(eventRef)
                    .then(async () => {
                        const event = snap.val()
                        return await set(child(child(child(this.allEvents, 'private'), 'approved'), eventId), event)
                    }).catch(e => {
                        this.createError('approvePrivateEvent', e)
                    })
            }).catch(e => {
                this.createError('approvePrivateEvent', e)
            })
    }

    declineEvent = async (eventId: string) => {
        const eventRef = child(child(child(this.allEvents, 'public'), 'waiting'), eventId)
        get(eventRef)
            .then(snap => {
                remove(eventRef)
                    .then(async () => {
                        const event = snap.val()
                        return await set(child(child(child(this.allEvents, 'public'), 'declined'), eventId), event)
                    }).catch(e => {
                        this.createError('declineEvent', e)
                    })
            }).catch(e => {
                this.createError('declineEvent', e)
            })
    }


    /**
     * 
     * @param image image to be updated for user
     * @returns update callback
     */
    updateUserImage = async (image: string): Promise<object | void> => {
        return await this.updateCurrentUser({ image: image })
            .catch((e) => { this.createError('updateUserImage', e) })
    }


    /**
     * addUser
     * @param user a user to be added to db
     * @returns new reference callback
     */
    addUser = async (user: PNPUser): Promise<object | undefined> => {
        if (this.auth.currentUser === null) return
        createNewCustomer((type: string, e: any) => this.createErrorCustomer(type, e), user)
            .then(async (customerUid: any) => {
                user.customerId = customerUid
                return await set(child(this.users, this.auth.currentUser!.uid), user)
                    .catch((e) => {
                        alert("אירעתה בעיית חיבור אינטרנט בעת הרשמה, אנא נסה/י להרשם מחדש")
                        this.auth.currentUser?.delete();
                        this.createError('addUser', e)
                    })
            }).catch(e => {
                alert("אירעתה בעיית חיבור אינטרנט בעת הרשמה, אנא נסה/י להרשם מחדש")
                this.auth.currentUser?.delete();
                this.createError('addUser', e)
            })
    }
    /**
 * addUser
 * @param user a user to be added to db
 * @returns new reference callback
 */
    static addUserNoAuth = async (path: DatabaseReference, user: PNPUser): Promise<object | void> => {
        return await set(path, user)
    }



    /**
     * 
     * @param id private event to be fetched by id
     * @returns private event if found
     */
    getPrivateEventById = (id: string, consume: ((event: PNPPrivateEvent) => void)) => {
        return onValue(child(child(child(this.allEvents, 'private'), 'approved'), id), (val) => {
            consume(val.val())
        })
    }


    /**
        * 
        * @param id private event to be fetched by id
        * @returns private event if found
        */
    getPrivateCompanyById = (id: string, consume: ((event: PNPCompany) => void)) => {
        return onValue(child(this.allCompanies, id), (val) => {
            consume(val.val() as PNPCompany)
        })
    }

    /**
     * getPrivateEventRidesById
     * @param id eventId to fetch rides for
     * @returns all rides for given event
     */
    getPrivateEventRidesById = (id: string, consume: (consume: PNPPublicRide[]) => void) => {

        return onValue(child(child(child(this.rides, 'private'), 'ridesForEvents'), id), (snap) => {
            const ret: PNPPublicRide[] = []
            snap.forEach(ride => {
                ret.push(ride.val())
            })
            consume(ret)
        })
    }


    /**
     * getPrivateEventRidesById
     * @param id eventId to fetch rides for
     * @returns all rides for given event
     */
    getCompanyRidesById = (id: string, consume: (consume: PNPWorkersRide[]) => void) => {
        return onValue(child(child(this.rides, 'workers'), id), (snap) => {
            const ret: PNPWorkersRide[] = []
            snap.forEach(ride => {
                ret.push(ride.val() as PNPWorkersRide)
            })
            consume(ret)
        })
    }


    /**
 * getPrivateEventRidesById
 * @param id eventId to fetch rides for
 * @returns all rides for given event
 */
    getCompanyRideById = (companyId: string, rideId: string, consume: (consume: PNPWorkersRide) => void) => {
        return onValue(child(child(child(this.rides, 'workers'), companyId), rideId), (snap) => {
            consume(snap.val() as PNPWorkersRide)
        })
    }
    /**
       * getPublicRidesByEventId
       * @param eventId eventId to fetch rides for
       * @returns all rides for given event
       */
    getPublicRidesByEventId = (id: string, consume: (consume: PNPPublicRide[]) => void) => {
        return onValue(child(child(child(this.rides, 'public'), 'ridesForEvents'), id), (snap) => {
            const ret: PNPPublicRide[] = []
            snap.forEach(ride => {
                ret.push(ride.val())
            })
            consume(ret)
        }, (e) => { console.log(e) })
    }

    getPublicRideById = async (eventId: string, rideId: string) => {
        return await get(child(child(child(child(this.rides, 'public'), 'ridesForEvents'), eventId), rideId))
            .then(snap => snap.val())
    }

    /**
     * getPublicEventById
     * @param id eventid to fetch
     * @returns event by id
     */
    getPublicEventById = (id: string, consume: ((event: PNPEvent | null) => void)) => {
        return onValue(child(this.allEvents, 'public'), (data) => {
            let consumed = false
            data.forEach((c => {
                if (c.exists() && c.hasChild(id)) {
                    consume(c.child(id).val())
                    consumed = true
                }
            }))
            if (!consumed) consume(null)
        })
    }


    async getPendingPrivateTransaction(customerEmail: string): Promise<{ customer: PCustomerData, product: PProductData }> {
        const snapshot = await get(
            child(this.privatePaymentPages, customerEmail.replaceAll('.', '').replaceAll('$', "").replaceAll('#', ''))
        )
        return snapshot.val()
    }

    async addPendingPrivateTransaction(customerEmail: string,
        pTransaction: { customer: PCustomerData, product: PProductData }) {
        return await set(
            child(this.privatePaymentPages, customerEmail.replaceAll('.', '').replaceAll('$', "").replaceAll('#', '')),
            pTransaction)
    }

    async removePendingPrivateTransaction(customerEmail: string) {
        return await remove(
            child(this.privatePaymentPages, customerEmail)
        )
    }

    SPECIFICS_EXTESION = {
        invalidateTConfirmationByUID: async (email: string, rideId: string) => {
            const transactions = (await get(this.transactions));
            transactions.forEach(userTransactions => {
                userTransactions.forEach(transaction => {
                    let t_info = transaction.child('more_info').val()
                    if (t_info.customerEmail === email && rideId === t_info.rideId) {
                        remove(transaction.ref)
                        return true
                    }
                })
            })
            return false
        },

    }
}

export type FirebaseTools = {
    auth: Auth,
    realTime: Realtime,
    db: Database
    temp: Firestore
}
function Store(auth: Auth, db: Database, firestore: Firestore): FirebaseTools {
    return {
        auth: auth,
        realTime: CreateRealTimeDatabase(auth, db, getStorage(auth.app)),
        temp: firestore,
        db: db
    }
}
export class StoreSingleton {
    public static instance: FirebaseTools | undefined;
    static get(): FirebaseTools {
        if (!this.instance) {
            const app = initializeApp(firebaseConfig)
            const auth = getAuth(app)
            this.instance = Store(auth, getDatabase(app), getFirestore(app))
        }
        return this.instance!!
    }
}


