import { PRIMARY_BLACK, PRIMARY_ORANGE, SECONDARY_WHITE } from "../styles/colors"
import { IRidesCalendar, SelectedRide } from "./CompanyRidesCalendar"
import { determineOffset, getDayName, isEqualDates } from "./invitationsWorkerHelper"
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import React, { CSSProperties, useCallback, useMemo } from "react";
import { v4 } from "uuid";
import { PNPWorkersRide } from "../../logic/types"
import { getDateString } from "../../utils"
import { useIWContextConsumer } from "./InvitationCardWorkers"
import styled from "@emotion/styled"
import { primaryColor, greenColor, Stack, textColorDark, textColorDark2 } from "../styles";
import { CollapsingList } from "../components/wrappers/PNPList"
const systemTime = new Date()
// JSX
const SpanStyle = { fontFamily: 'Open Sans Hebrew' } as CSSProperties
export const SubmitConfirmationStyle = (lang: string) => ({
    ... {
        fontFamily:'Open Sans Hebrew',
        fontWeight: 'bolder',
        textTransform: 'none', margin: '16px', padding: '8px',
        fontSize: '13px',
        maxWidth: 'fit-content'
    }
}) as CSSProperties

export const ColorSquareMap = { marginInline: 'auto', width: 'max-content', padding: '8px', fontSize: '12px', borderRadius: '8px', background: 'white' }
export const ColorSquareConfirmed = { width: '12px', height: '12px', marginInline: '4px', background: 'gray' } as CSSProperties
export const ColorSquareSelected = { width: '12px', height: '12px', marginInline: '4px', background: 'rgba(0,0,0,0.8)' } as CSSProperties
export const ColorSquareSelectedToRemove = { width: '12px', marginInline: '4px', height: '12px', background: '#bd3333' } as CSSProperties
export const CalendarShowingWeekStyle = { fontWeight: '200', color: PRIMARY_BLACK } as CSSProperties
export const ControlStyle = { cursor: 'pointer', color: greenColor } as CSSProperties
export const ToolTipStyle = { fontFamily: 'Open Sans Hebrew', fontSize: '18px' } as CSSProperties
export const CalendarListWrapperStyle = { width: '100%', background: primaryColor } as CSSProperties
export const CalendarCompanyImageStyle = {
    width: '50%',
    maxWidth: '250px',
    height: '50%'
} as CSSProperties
export const CalendarListStyle = { width: '85%', background: primaryColor, minWidth: 'fit-content', marginLeft: 'auto', marginRight: 'auto', padding: '16px' } as CSSProperties
export const CalendarWelcomeStyle = {
    ...{
        marginInline: 'auto',
        fontSize: '16px',
        maxWidth: '400px',
        color: SECONDARY_WHITE, fontFamily: 'Open Sans Hebrew'
    }
} as CSSProperties
export const CalendarControlsStyle = { background: 'white', padding: '8px', width: '100%', borderRadius: '4px', maxWidth: '500px', marginInline: 'auto' } as CSSProperties
export const CompanyNameHeaderStyle = {
    ...SpanStyle,
    textAlign:'center',
    fontWeight: 'bold', paddingTop: '8px',
    color: textColorDark, fontSize: '20px'
} as CSSProperties
export const RidesCalendarStackStyle = { width: '300px', marginLeft: 'auto', marginRight: 'auto' } as CSSProperties
export const HeaderParagpraphCalendar = {
    color: textColorDark,
    display:'grid',
    gridTemplateRows:'1fr 1fr 1fr',
    gridTemplateColumns:"1fr",
    fontSize: '16px'
} as CSSProperties
const RidesCardStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '8px',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    marginBlock: '8px',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
} as CSSProperties
const typographyStyle = {
    fontFamily: 'Open Sans Hebrew',
    color: greenColor,
    fontSize: '18px'
}
const CalendarStackStyle = {
    maxWidth: '600px',

    width: '100%',
    ...RidesCardStyle
}
export const rideTitleStyle = {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
}
const CalendarRideRow = (p: SelectedRide & { index: number, weekDay: number }) => {
    const calendar = useIWContextConsumer()
    if (!calendar) return null
    return (<div
        dir='rtl'
        onClick={() => { calendar.selectRide(p) }} style={styleForRide(p, calendar)} /*value={p.ride.id}*/>
        <div style={rideTitleStyle} >
            <Stack direction={'row'} style={{ columnGap: '8px' }}>
                <DirectionsBusIcon style={{ color: PRIMARY_ORANGE }} />
                <Stack className='eventRideRowName_ePage' direction={'row'} alignment={'center'} justify={'center'}>
                    <div>{getDayName(p.weekDay)}</div>
                    <b style={{ marginInline: '4px' }}> - {p.date}</b>
                </Stack>
            </Stack>
            <Stack alignment={'center'} justify={'center'}>
                <span style={{ fontSize: '12px' }}>{p.ride.rideTime}</span>

                <span style={{ fontSize: '12px' }}>{p.ride.backTime}</span>
            </Stack>
        </div>
    </div>)
}
const FloatingList = styled.div`
@keyframes float {
from {
   transform: translateY(0px);
}
to {
   transform: translateY(2.75px);
}
}
animation: float 1s linear infinite alternate;
`
export function WeekDaysRideList({ ride }: { ride: PNPWorkersRide }) {
    const calendar = useIWContextConsumer()

    return useMemo(() => <FloatingList>
        <Stack alignSelf={'center'} rowGap={1} style={CalendarStackStyle}>
            <React.Fragment
                key={ride.id + ride.startPoint + Math.random() * Number.MAX_VALUE}>
                <Stack direction="column" alignment="center">
                    <span
                        style={typographyStyle} >
                        {ride.startPoint}
                    </span>
                    <span style={{ fontFamily: 'Open Sans Hebrew', fontSize: '14px' }} >בחר הסעה</span>
                </Stack>

                {calendar && <CollapsingList<number>
                    ride={ride}
                    items={calendar.weekDays}
                    renderRow={(day, index) => <CalendarRideRow index={index!} key={v4()}
                        date={(() => {
                            const d = new Date(calendar.today)
                            d.setDate(d.getDate() + index! - (isEqualDates(d, new Date()) ? 0 : 1))
                            if (systemTime.getDay() === 6)
                                d.setDate(d.getDate() + 1)
                            return getDateString(d.getTime(), true)
                        })()} weekDay={day} ride={ride} />} />}
            </React.Fragment>
        </Stack >
    </FloatingList>, [calendar])
}

export const styleForRide = (selected: SelectedRide, calendar: IRidesCalendar) => (calendar && selected) ? (() => {
    const equal = calendar.selectedRides.find(x => x?.date === selected.date && x?.ride === selected.ride)
    const isToRemove = calendar.isToRemove(selected)
    const exists = calendar.selectedExistingConfirmation(selected)
    return ({
        width: '100%',
        background: (isToRemove) ? '#bd3333' : exists ? 'gray' : (equal) ? 'rgba(0,0,0,0.8)' : selected.ride.extras.rideStatus === 'sold-out' ? `` : 'none',
        backgroundSize: (selected.ride.extras.rideStatus === 'sold-out' && !equal) ? '125px 50px' : '100%',
        color: ((equal || isToRemove || exists) ? 'white' : 'black'),
        border: '.1px solid lightgray',
        borderRadius: '8px',
        marginLeft: 'auto',
        marginBlock: '5px',
        marginRight: 'auto',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: selected.ride.extras.rideStatus === 'sold-out' && !equal ? '50% center' : 'center center',
        padding: '8px',
        display: 'flex',
    })
})() : {}