import { Unsubscribe, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { StoreSingleton } from "../../logic/database";
import {  PNPCompany, PNPCompanyRideConfirmation, PNPUser, PNPWorkersRide } from "../../logic/types";
import { isValidCompany } from "../../logic/database/validators";
import { getDateString,getDaysInMonth } from "../../utils";
import {
    getAllWeekDaysLeft,
    getAllWeekDays,
    isEqualDates,
    WEEK_LONG,
    DAYS_AMT,
    isEqualRides,
    getAllWeekDaysLeftAtDate
} from "./invitationsWorkerHelper";
const systemTime = new Date()
export type SelectedRide = { date: string, ride: PNPWorkersRide } | null

export type IRidesCalendar = {
    userConfirmations: PNPCompanyRideConfirmation[],
    rides: PNPWorkersRide[],
    today: Date,
    selectedRides: SelectedRide[],
    selectedRidesRemove: SelectedRide[],
    company: PNPCompany | null | undefined,
    weekDays: number[],
    viewingRide: PNPWorkersRide | undefined,
    setViewingRide: (ride: PNPWorkersRide | undefined) => void,
    isAllSelected: () => boolean,
    isToRemove: (ride: SelectedRide) => boolean,
    saveConfirmation: (user?: User, appUser?: PNPUser) => void,
    selectAll: (ride: PNPWorkersRide) => void,
    removeConfirmation: (user?: User, appUser?: PNPUser) => void,
    selectedExistingConfirmation: (ride: SelectedRide) => boolean,
    selectRide: (ride: SelectedRide) => void,
    weekForwards: () => void,
    weekBackwards: () => void
} | undefined


export default function useCompanyRidesCalendar(hooks: any, companyId: string): IRidesCalendar {
    const [userConfirmations, setConfirmations] = useState<PNPCompanyRideConfirmation[]>([])
    const [selectedRides, setSelectedEventRides] = useState<SelectedRide[]>([])
    const [viewingRide, setViewingRide] = useState<PNPWorkersRide>()
    const [selectedRidesRemove, setSelectedEventRidesRemove] = useState<SelectedRide[]>([])
    const [rides, setRides] = useState<PNPWorkersRide[]>([])
    const [weekDays, setWeekDays] = useState<number[]>(systemTime.getDay() === 6 ? getAllWeekDays() : getAllWeekDaysLeft());
    const [company, setCompany] = useState<PNPCompany | null>()
    const [today, setToday] = useState(new Date())
    const selectedExistingConfirmation = (ride: SelectedRide) => {
        return userConfirmations.find(x => {
            return x.date === ride?.date && ride?.ride.id === x.rideId
        }) != undefined
    }
    const isToRemove = (ride: SelectedRide) => {
        for (let x of selectedRidesRemove) {
            if (isEqualRides(ride, x))
                return true;
        }
        return false;
    }
    const isAllSelected = () => {
        return selectedRides.length === 6 || selectedRidesRemove.length === 6 || (selectedRidesRemove.length + selectedRides.length) === 6
    }

    useEffect(() => {
        let unsubscribe: Unsubscribe[] = []
        if (hooks.user)
            unsubscribe.push(StoreSingleton.get().realTime.addListenerToWorkerConfirmations(hooks.user.uid, companyId, setConfirmations))
        return () => unsubscribe.forEach(unsub => unsub());
    }, [hooks.user])

    useEffect(() => {
        //  props.loading.doLoad()
        let unsubscribe: Unsubscribe[] = []
        unsubscribe.push(StoreSingleton.get().realTime.getPrivateCompanyById(companyId, (event) => {
            if (isValidCompany(event as PNPCompany)) {
                unsubscribe.push(StoreSingleton.get().realTime.getCompanyRidesById(companyId, (rides) => {
                    if (rides as PNPWorkersRide[]) {
                        setRides(rides)
                        setCompany(event)
                    }
                }))
            } else
                setCompany(null)
        }))
        return () => {
            for (let unsub of unsubscribe)
                if (unsub)
                    unsub()
        }
    }, [])

    useEffect(() => {
        if (systemTime.getDay() === 6)
            today.setDate(today.getDate() + 1)
        if (systemTime.getDay() === 0)
            today.setDate(today.getDate() + (isEqualDates(today, systemTime) ? ((DAYS_AMT) - Math.max(getAllWeekDaysLeft().length + 1), 1) : DAYS_AMT))
    }, [])

    return {
        userConfirmations, rides, selectedExistingConfirmation, selectedRidesRemove,
        company, selectedRides, weekDays, today, isToRemove, isAllSelected, viewingRide,
        setViewingRide: (ride: PNPWorkersRide | undefined) => {
            setViewingRide(ride)
            setSelectedEventRides([])
            setSelectedEventRidesRemove([])
        },
        selectRide(r: SelectedRide) {

            let iAdd = selectedRides.findIndex(x => isEqualRides(x, r))
            if (iAdd > -1) {
                selectedRides.splice(iAdd, 1)
                return setSelectedEventRides([...selectedRides])
            }
            let iRem = selectedRidesRemove.findIndex(x => isEqualRides(x, r))
            if (iRem > -1) {
                selectedRidesRemove.splice(iRem, 1)
                return setSelectedEventRidesRemove([...selectedRidesRemove])
            }

            if (selectedExistingConfirmation(r))
                return setSelectedEventRidesRemove([...selectedRidesRemove, r])
            setSelectedEventRides([...selectedRides, r])
        },
        selectAll(ride: PNPWorkersRide) {
            if (isAllSelected()) {
                setSelectedEventRides([])
                setSelectedEventRidesRemove([])
                return
            }

            let d = new Date(today)
            d.setDate(d.getDate() - 1)
            let toAdd = [], toRemove = []
            for (let i = 0; i < DAYS_AMT - 1; i++) {
                d.setDate(d.getDate() + 1);
                const constructedRide = ({ date: getDateString(d.getTime(), true), ride })
                if (selectedExistingConfirmation(constructedRide)) {
                    toRemove.push(constructedRide)
                } else
                    toAdd.push(constructedRide)
            }

            setSelectedEventRides(toAdd)
            setSelectedEventRidesRemove(toRemove)
        },
        async removeConfirmation(user?: User, appUser?: PNPUser) {
            let relevantUser = user ?? hooks.user
            let relevantAppUser = appUser ?? hooks.appUser
            if (!company) {
                return;
            }
            if (selectedRidesRemove.length === 0) {
                return alert('יש לבחור הסעה כדי לבטל את אישור הגעה')
            }
            if (!relevantUser || !relevantAppUser) {
                return alert('עלייך להירשם על מנת לאשר/לבטל אישור הגעה להסעה')
            }
           // hooks.loading.doLoad()
            for (let r of selectedRidesRemove) {
                if (!r) continue
                await StoreSingleton.get().realTime.removeRideConfirmationWorkers(relevantUser.uid, {
                    userId: relevantUser.uid,
                    userName: relevantAppUser.name,
                    phoneNumber: relevantAppUser.phone,
                    companyId,
                    startPoint: r.ride.startPoint,
                    rideId: r.ride.id,
                    companyName: company.name,
                    date: r.date
                })
            }
            setSelectedEventRidesRemove([])
          //  hooks.loading.cancelLoad()
        },
        async saveConfirmation(user?: User, appUser?: PNPUser) {
            let relevantUser = user ?? hooks.user
            let relevantAppUser = appUser ?? hooks.appUser
            if (!company) {
                return;
            }
            if (selectedRides.length === 0) {
                return alert('יש לבחור הסעה כדי לאשר הגעה')
            }
            if (!relevantUser || !relevantAppUser) {
                return alert('עלייך להירשם על מנת לאשר הגעה להסעה')
            }
           // hooks.loading.doLoad()
            for (let r of selectedRides) {
                if (!r) continue
                const res = await StoreSingleton.get().realTime.addRideConfirmationWorkers(relevantUser.uid, {
                    userId: relevantUser.uid,
                    userName: relevantAppUser.name,
                    phoneNumber: relevantAppUser.phone,
                    companyId,
                    startPoint: r.ride.startPoint,
                    rideId: r.ride.id,
                    companyName: company.name,
                    date: r.date
                })
            }
            setSelectedEventRides([])
        //    hooks.loading.cancelLoad()
        },
        weekForwards() {
           // hooks.loading.doLoad()
            let newDays = today.getDate() + (isEqualDates(today, systemTime) ? ((DAYS_AMT) - Math.max(getAllWeekDaysLeft().length + 1), 1) : DAYS_AMT)

            if (newDays > getDaysInMonth(today) + 1) {
                today.setDate(newDays - getDaysInMonth(today))
                today.setMonth(today.getMonth() + 1)
            } else {
                today.setDate(newDays);
            }
            setWeekDays(getAllWeekDays())
            setSelectedEventRides([])
            setTimeout(() => { hooks.loading.cancelLoad() }, 300)
        },
        weekBackwards() {
            if (today.getTime() - WEEK_LONG < systemTime.getTime())
                return
           // hooks.loading.doLoad()
            const newDays = today.getDate() - DAYS_AMT
            if (newDays <= 0) {
                today.setMonth(today.getMonth() - 1)
                today.setDate(getDaysInMonth(today) + newDays)
                if (today.getMonth() < 0) {
                    today.setFullYear(today.getFullYear() - 1)
                    today.setMonth(0);
                }
            } else today.setDate(newDays);
            setWeekDays(isEqualDates(today, systemTime) ? getAllWeekDaysLeft() : getAllWeekDays())
            setSelectedEventRides([])
            setTimeout(() => { hooks.loading.cancelLoad() }, 300)
        }
    }
}