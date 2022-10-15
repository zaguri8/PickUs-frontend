
import { PNPCompany, PNPCompanyRideConfirmation, PNPCoupon, PNPEvent, PNPPrivateEvent, PNPPrivateRide, PNPPublicRide, PNPRideConfirmation, PNPWorkersRide } from "../types";

export function isValidHttpUrl(string: string): boolean {
  let url;

  try {
    url = new URL(string.split('blob:')[1]);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export function isValidEvent(event: PNPEvent): boolean {
  const bool = event !== undefined
    && event !== null
    && (event.eventAgeRange !== null
      && event.eventAgeRange.minAge !== null
      && event.eventAgeRange.maxAge !== 'null')
    && (event.eventDate !== null
      && event.eventDate !== 'null')
    && (event.eventDetails !== null
      && event.eventDetails !== 'null')
    && (event.eventHours !== null
      && event.eventHours.startHour !== null
      && event.eventHours.endHour !== null
      && event.eventHours.startHour !== 'null'
      && event.eventHours.endHour !== 'null')
    && (event.eventImageURL !== null
      && event.eventImageURL !== 'null')
    && (event.eventLocation !== null
      && event.eventLocation !== 'null')
    && (event.eventName !== null
      && event.eventName !== 'null')
    && (event.eventPrice !== null
      && event.eventPrice !== 'null')
    && (event.eventProducerId !== null
      && event.eventProducerId !== 'null')
  return bool
}
export function isValidPrivateEvent(event: PNPPrivateEvent): boolean {
  return event !== undefined
    && event !== null
    && (event.eventDate !== null
      && event.eventDate !== 'null')
    && (event.eventHours !== null
      && event.eventHours.startHour !== null
      && event.eventHours.endHour !== null
      && event.eventHours.startHour !== 'null'
      && event.eventHours.endHour !== 'null')
    && (event.eventLocation !== null
      && event.eventLocation !== 'null')
    && (event.eventTitle !== null)
    && (event.eventTitle !== 'null')
}
export function isValidWorkersRide(event: PNPWorkersRide): boolean {
  return event !== undefined
    && event !== null
    && (event.date !== null
      && event.destination !== 'null')
    && (event.destination !== null
      && event.startPoint !== null
      && event.destination !== null)
}

export function isValidCompany(event: PNPCompany): boolean {
  return event !== undefined
    && event !== null
    && (event.name !== null
      && event.name !== 'null')
}

export function isValidCoupon(coupon: PNPCoupon) {
  return coupon
    && coupon.couponExpirationDate.length > 0
    && coupon.couponId.length > 0
    && coupon.couponValue.length > 0
}

export function isCouponExpirationValid(coupon: PNPCoupon) {
  const validateDateWithString = (date: string) => {
    const now = new Date()
    const components = date.split('/')
    return Number(components[2]) >= now.getFullYear()
      && Number(components[1]) >= now.getMonth()
      && Number(components[0]) >= now.getDay()
  }
  return isValidCoupon(coupon) && validateDateWithString(coupon.couponExpirationDate)
}

export function isValidPrivateRide(ride: PNPPrivateRide): boolean {
  return ride !== undefined
    && ride !== null
    && (ride.date !== null
      && ride.date !== 'null')
    && (ride.rideTime !== null
      && ride.rideTime !== 'null')
    && (ride.passengers !== null
      && ride.passengers !== 'null')
    && (ride.rideDestination !== null
      && ride.rideDestination !== 'null'
      && ride.rideStartingPoint !== null
      && ride.rideStartingPoint !== 'null')
}



export function isValidPublicRide(ride: PNPPublicRide): boolean {
  return ride !== undefined
    && ride !== null
    && (ride.backTime !== null
      && ride.backTime !== 'null')
    && (ride.ridePrice !== null
      && ride.ridePrice !== 'null')
    && (ride.date !== null
      && ride.date !== 'null')
    && (ride.passengers !== null
      && ride.passengers !== 'null')
    && (ride.rideDestination !== null
      && ride.rideDestination !== 'null'
      && ride.rideStartingPoint !== null
      && ride.rideStartingPoint !== 'null')
    && (ride.rideTime !== null
      && ride.rideTime !== 'null')
}
export function isValidRideConfirmation(ride: PNPRideConfirmation | undefined): boolean {
  return ride !== undefined
    && ride !== null
    && (ride.userId !== null
      && ride.userId !== 'null')
    && (ride.guests !== null
      && ride.guests !== 'null')
    && (ride.passengers !== null
      && ride.phoneNumber !== 'null')
    && (ride.phoneNumber !== null
      && ride.directionType !== 'null')
    && (ride.directionType !== null
      && ride.userName !== 'null')
    && (ride.userName !== null
      && ride.passengers !== 'null')
    && (ride.date !== null
      && ride.date !== 'null')
    && (ride.directions !== null)
}

export function isValidSingleRideConfirmation(ride: PNPRideConfirmation | undefined): boolean {
  return ride !== undefined
    && ride !== null
    && (ride.userId !== null
      && ride.userId !== 'null')
    && (ride.guests !== null
      && ride.guests !== 'null')
    && (ride.passengers !== null
      && ride.phoneNumber !== 'null')
    && (ride.phoneNumber !== null
      && ride.userName !== 'null')
    && (ride.userName !== null
      && ride.passengers !== 'null')
    && (ride.date !== null
      && ride.date !== 'null')
}

export function isValidSingleWorkersRideConfirmation(ride: PNPCompanyRideConfirmation | undefined): boolean {
  return ride !== undefined
    && ride !== null
    && (ride.userId !== null
      && ride.userId !== 'null')
    && ride.phoneNumber !== 'null'
    && (ride.phoneNumber !== null
      && ride.userName !== 'null')
    && (ride.userName !== null)
    && (ride.date !== null
      && ride.date !== 'null')
}

