import React, { createContext, useContext, useMemo, useState } from 'react';
import 'firebase/compat/auth';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useParams } from 'react-router';
import { PageHolder } from '../components/wrappers';
import { CHOOSE_RIDE, CONFIRM_EVENT_ARRIVAL, CONFIRM_EVENT_ARRIVAL_2, SIDE } from '../../logic/settings/strings';

import useCompanyRidesCalendar, { IRidesCalendar } from './CompanyRidesCalendar';
import {
    CalendarCompanyImageStyle, CalendarControlsStyle,
    CalendarListStyle, CalendarListWrapperStyle,
    CalendarWelcomeStyle, CompanyNameHeaderStyle,
    ControlStyle, HeaderParagpraphCalendar,
    RidesCalendarStackStyle,
    CalendarShowingWeekStyle,
    SubmitConfirmationStyle,
    ToolTipStyle, WeekDaysRideList, ColorSquareSelected, ColorSquareSelectedToRemove, ColorSquareConfirmed, ColorSquareMap
} from './InvitationUIProver';
import { showingWeek } from './invitationsWorkerHelper';
import PNPList from '../components/wrappers/PNPList';
import { CollapsingList } from '../components/wrappers/PNPList';
import { PNPWorkersRide } from '../../logic/types';
import { useUser } from '../../logic/context/Firebase';
import { useLanguage } from '../../logic/context/Language';
import { Stack } from '../styles';
// this page was written bad when i just started front-end development, but im too lazy to update it



const Context = createContext<IRidesCalendar | null>(null)
export const useIWContextConsumer = () => {
    const context = useContext(Context);
    return context
}
const Provider = ({ children }: { children: any }) => {
    const { id } = useParams()
    const userContext = useUser()
    const calendar = useCompanyRidesCalendar(userContext, id??'')
    return <Context.Provider value={calendar}>
        {children}
    </Context.Provider>
}
function InvitationCardWorkers() {
    const calendar = useIWContextConsumer()
    const user = useUser()
    const language = useLanguage()
    const companyDoesNotExist = !calendar?.company
    const companyValid = calendar?.company != null
    if (companyDoesNotExist) {
        return <div style={{ padding: '32px' }}>Event Does not exist</div>
    } else if (companyValid) {
        return <PageHolder>

            {calendar.company && calendar.company.logo ? <img alt='No image for this event'
                style={CalendarCompanyImageStyle}
                src={calendar.company.logo} /> : null}
            <Stack columnGap={1} direction="column">
                <span style={CompanyNameHeaderStyle}>{calendar.company?.name}</span>
                {/* <Stack direction={'row'} >
                    <p style={HeaderParagpraphCalendar}><LocationOnIcon className="img_pin_location" /><>{calendar.company?.name}</></p>
                    <p style={HeaderParagpraphCalendar}><CalendarTodayIcon /><>{new Date().getUTCDay()}</> </p>
                </Stack> */}
            </Stack>
            <div style={CalendarListWrapperStyle}>
                <div style={CalendarListStyle}>
                    {/* Arriving to rides Check box */}
                    <div style={{ width: '100%' }} dir={SIDE(language.lang)}>
                        {user.appUser && <span
                            style={CalendarWelcomeStyle} >
                            {language.lang === 'heb' ? `היי ${user.appUser.name}, אנא בחר את התחנה הרצויה וסמן את הימים שבהם תגיע להסעה. לאחר מכן לחץ ״אשר הגעה״.` : `Hello ${user.appUser.name}, choose the station and mark the days on which you will arrive for the shuttle, then click confirm arrival`}
                        </span>}
                        <br />

                        <Stack direction={'row'} justify={'space-between'} style={CalendarControlsStyle}>
                            <ArrowForwardIosIcon style={ControlStyle} onClick={() => calendar?.weekForwards()} />
                            <div style={CalendarShowingWeekStyle}>{showingWeek(calendar.today)}</div>
                            <ArrowBackIosIcon style={ControlStyle} onClick={() => calendar?.weekBackwards()} />
                        </Stack>
                        <PNPList<PNPWorkersRide>
                            renderRow={(ride) => <WeekDaysRideList {...{ ride }} />}
                            items={calendar.rides!}
                            ElementWrapper={Stack}
                            inlineCenter />
                    </div>
                    <Stack rowGap={1}
                        style={RidesCalendarStackStyle}>

                        {/* {!event.registrationRequired && <TextField classes={classes}
                            onChange={(e) => updateConfirmationName(e.target.value)}
                            name='fullname'
                            placeholder={FULL_NAME(props.language.lang)} />}
                        {!event.registrationRequired && <TextField classes={classes}
                            name='phone'
                            type='tel'
                            onChange={(e) => updateConfirmationPhone(e.target.value)}
                            place holder={PHONE_NUMBER(props.language.lang)} />} */}
                    </Stack>

                </div>
            </div>
        </PageHolder >
    } else return null
}

export default () => {
    return <Provider>
        <InvitationCardWorkers />
    </Provider>
}