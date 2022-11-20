import { PNPWorkersRide,PNPCompany } from "../../../logic/types"
import { isValidWorkersRide } from "../../../logic/database/validators"
import React, { CSSProperties, useState } from "react"
import { Stack, TextField, Button, MenuItem, Checkbox, Select } from "@mui/material"
import { submitButton ,textFieldStyle} from "../../styles"
import { SECONDARY_WHITE,PRIMARY_BLACK,PRIMARY_PINK } from "../../styles/colors"
import { getDefaultWorkersRide } from "../../../logic/database/helpers"
import { StoreSingleton } from "../../../logic/database"
const labelStyle = { color: PRIMARY_PINK, fontWeight: 'bold' } as CSSProperties
type AddUpdateRideProps = { ride?: PNPWorkersRide, company: PNPCompany }
const AddUpdateCompanyRide = (props: AddUpdateRideProps) => {
    const [ride, setRide] = useState<PNPWorkersRide>(props.ride ? props.ride : getDefaultWorkersRide(props.company, 'he'))
    const changeRideStartingPoint = (newStartPoint: string) => {
        setRide({
            ...ride,
            startPoint: newStartPoint
        })
    }

    const changeRideWays = (twoWay: boolean) => {
        setRide({
            ...ride,
            extras: { ...ride.extras, twoWay: twoWay }
        })
    }

    const changeRideDirections = (directions: '1' | '2') => {
        setRide({
            ...ride,
            extras: { ...ride.extras, rideDirection: directions }
        })
    }



    const changeRidePassengerLimit = (max: string) => {
        setRide({
            ...ride,
            extras: { ...ride.extras, rideMaxPassengers: max }
        })
    }

    const changeRideTime = (newTime: string) => {
        setRide({
            ...ride,
            rideTime: newTime
        })
    }
    const changeRideBackTime = (newTime: string) => {
        setRide({
            ...ride,
            backTime: newTime
        })
    }

    const createNewRide = () => {
        if (isValidWorkersRide(ride)) {
            // props.loading.doLoad()

            if (props.ride) {
                StoreSingleton.get().realTime.updateWorkersRide(props.company.id, ride.id, ride)
                    .then(() => {
                        // props.loading.cancelLoad()
                        // props.loading.closeDialog()
                        alert(`ערכת נסיעה בהצלחה : \n נסיעה מ ${ride.startPoint} ל ${ride.destination} \n בשעה : ${ride.rideTime}`)
                    }).catch((e) => {
                        // props.loading.cancelLoad()
                        // props.loading.closeDialog()
                        alert('אירעתה שגיאה בעריכת ההסעה, אנא יידע את המתכנת')
                    })
            } else {

                StoreSingleton.get().realTime.addWorkersRide(ride.companyId, ride)
                    .then(() => {
                        // props.loading.cancelLoad()
                        // props.loading.closeDialog()
                        alert(`הוספת נסיעה נוספת בהצלחה : \n נסיעה מ ${ride.startPoint} ל ${ride.destination} \n בשעה : ${ride.rideTime}`)
                    }).catch(() => {
                        // props.loading.cancelLoad()
                        // props.loading.closeDialog()
                        alert('אירעתה שגיאה בהוספת ההסעה, אנא יידע את המתכנת')
                    })
            }

        } else {
            alert('אנא וודא שמילאת נכון את כל השדות הדרושים')
        }

    }
    return <Stack spacing={2} style={{ padding: '16px', minWidth: '250px' }}>


        {function changeRideWaysField() {
            return <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <label style={labelStyle}>
                    {'הסעה דו כיוונית'}
                </label>
                <Checkbox
                    style={{ width: 'fit-content', alignSelf: 'center' }}
                    checked={ride.extras.twoWay}
                    onChange={(e) => {
                        changeRideWays(e.target.checked)
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                /></div>
        }()}

        {function rideDirectionField() {
            if (!ride.extras.twoWay)
                return (<Stack direction='column' spacing={2}>
                    <label style={labelStyle}>{'בחר כיוון נסיעה'}</label>
                    <Select
                        value={ride.extras.rideDirection}
                        style={{ color: PRIMARY_BLACK, borderRadius: '32px', background: SECONDARY_WHITE }}
                        onChange={(e) => {
                            if (e.target.value === '1' || e.target.value === '2')
                                changeRideDirections(e.target.value)
                        }}>
                        <MenuItem value={'1'}>{'חזור בלבד'}</MenuItem>
                        <MenuItem value={'2'}>{'הלוך בלבד'}</MenuItem>
                    </Select></Stack>)
            else return null
        }()}

        {function startingPointField() {
            if (ride.extras.twoWay || ride.extras.rideDirection === '2')
                return (<Stack direction='column' spacing={2}>
                    <label style={labelStyle}>{'הכנס נקודת יציאה'}</label>
                    <TextField
                        autoComplete=""
                        InputLabelProps={{
                            style: { color: PRIMARY_BLACK },
                        }}

                        style={labelStyle}
                        placeholder={props.ride ? props.ride.startPoint : 'נקודת יציאה'}
                        onChange={(e) => changeRideStartingPoint(e.target.value)}
                    />
                </Stack>)
            else return null
        }()}

        {function rideTimeField() {
            return <React.Fragment>
                <label style={labelStyle}> {'הכנס שעת יציאה'}</label>
                <TextField
                    InputLabelProps={{
                        style: { color: PRIMARY_BLACK },
                    }}
                    required
                    type='time'
                    style={labelStyle}

                    placeholder={props.ride ? props.ride.rideTime : '00:00'}
                    name='time'
                    onChange={(e) => changeRideTime(e.target.value)}
                />
            </React.Fragment>
        }()}

        {function rideBackTimeField() {
            return <React.Fragment>
                <label style={labelStyle}> {'הכנס שעת חזרה'}</label>
                <TextField
                    InputLabelProps={{
                        style: { color: PRIMARY_BLACK },
                    }}
                    required
                    type='time'
                    style={labelStyle}

                    placeholder={props.ride ? props.ride.backTime : '00:00'}
                    name='time'
                    onChange={(e) => changeRideBackTime(e.target.value)}
                />
            </React.Fragment>
        }()}


        {function limitMaxNumberOfAttendancesField() {
            return <React.Fragment>
                <label style={labelStyle}> {'הגבל מספר מקומות'}</label>
                <TextField
                    InputLabelProps={{
                        style: { color: PRIMARY_BLACK },
                    }}
                    required
                    type='number'
                    inputProps={{ inputMode: 'numeric', min: 0, max: 250 }}
                    style={labelStyle}

                    placeholder={props.ride && props.ride.extras.rideMaxPassengers ? props.ride.extras.rideMaxPassengers : 'הכנס מספר מקומות'}
                    name='number of'
                    onChange={(e) => changeRidePassengerLimit(e.target.value)}
                />
            </React.Fragment>
        }()}

        {function submitField() {
            return <Button style={{
                ...submitButton(false),
                ...{ width: '100%', maxHeight: '50px',marginTop:'8px' }
            }}
                onClick={() => createNewRide()}
            >{props.ride ? 'שמור שינויים' : 'הוסף הסעה'}</Button>
        }()}
    </Stack>
}


export default AddUpdateCompanyRide