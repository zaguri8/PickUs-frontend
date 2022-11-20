import { DatePicker, TimeInput } from "@mantine/dates"
import { IconBus, IconCalendar, IconLoader, IconMan, IconNote, IconSend } from "@tabler/icons"
import React, { CSSProperties, useCallback, useEffect, useState } from "react"
import { useUser } from "../../../logic/context/Firebase"
import { useModal } from "../../../logic/context/ModalContext"
import { LeadBuilder } from "../../../logic/types"
import { Button, Form, greenColor, Input, ModalContentStyle, ModalWrapperStyle, TimeLineIconStyle, TimeLineStyle, Stack, Text, overlayColor, boxShadowLight, ModalCloseButtonStyle, RoundedButton } from "../../styles"
import { UserMenu } from "../wrappers"
import { Loader } from "@mantine/core"
import { useNavigate } from "react-router"
import useLeadRequests from "../../../logic/hooks/useLeadRequests"
const useLeadBuilder = () => {
    const [leadBuilder, setLead] = useState<LeadBuilder>(new LeadBuilder())
    const [stage, setStage] = useState<number>(1)
    const updateLead = (leadBuilder: LeadBuilder) => {
        setLead(leadBuilder)
        setStage(s => s + 1)
    }
    return { updateLead, leadBuilder, stage, setStage }
}
// to date string
const toDateString = (date: Date) => {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

const LeadScene = () => {

    const {
        updateLead,
        stage,
        leadBuilder,
        setStage
    } = useLeadBuilder()
    const { user } = useUser()
    const {
        sendSMSRequest,
        sendStartFillingRequest,
        sendLeftPageRequest
    } = useLeadRequests()
    const LeadInput = useCallback(({ title,
        type = "text",
        required = false }: Partial<HTMLInputElement>) => <Input padding={8}
            height={'35px'}
            paddingBlock={18}
            type={type}
            required={required}
            placeholder={title}
            width={'100%'}
            style={{ minWidth: '100%' }} />,
        [leadBuilder]
    )
    const [date, setDate] = useState<Date | null>(new Date())
    const LeadStage = useCallback(() => {
        switch (stage) {
            case 1:
                return <React.Fragment>
                    <LeadInput required title="הקלד שם מלא.." />
                    <LeadInput required title='הקלד מספר נייד לקבלת הצעת מחיר..' type="number" />
                </React.Fragment>
            case 2:
                return <React.Fragment>
                    <LeadInput required title="הקלד נקודת איסוף,לדוגמא: הוד השרון" />
                    <LeadInput required title='הקלד נקודת הגעה, לדוגמא: באר שבע' />
                </React.Fragment>
            case 3:
                return <div style={{ width: '100%' }}>
                    <Text fontSize={14} fontWeight={'bold'}>תאריך נסיעה</Text>
                    <DatePicker required value={date} onChange={setDate} />
                    <Text fontSize={14} fontWeight={'bold'}>שעת יציאה</Text>
                    <LeadInput required title='שעת יציאה' style={{ width: '95%' } as any} type={'time'} />
                    <Text fontSize={14} fontWeight={'bold'}>שעת חזרה</Text>
                    <LeadInput required title='שעת חזרה' style={{ width: '95%' } as any} type={'time'} />
                </div>
            case 4:
                return <React.Fragment>
                    <LeadInput required title="הקלד מספר נוסעים.." type="number" />
                    <LeadInput title='הקלד הערות..' />
                </React.Fragment>
            default: return null
        }
    }, [stage, leadBuilder, date])


    const callback = useCallback(async (s: number = stage) => {
        const lead = leadBuilder.build()
        if (lead.phone) {
            try {
                await sendLeftPageRequest(lead)
            } catch (e) { console.log(e) }
        }
    }, [stage, leadBuilder])

    useEffect(() => {
        window.addEventListener('unload', callback as any)
        return () => {
            callback()
            window.removeEventListener('unload', callback as any)
        }
    }, [])


    const Submit = useCallback((e: any) => {
        e.preventDefault()
        switch (stage) {
            case 1:
                const name = e.target[0].value
                const phone = e.target[1].value
                updateLead(leadBuilder.name(name)
                    .phone(phone))
                sendStartFillingRequest({
                    name,
                    phone
                })
                break;
            case 2:
                updateLead(leadBuilder.start(e.target[0].value)
                    .destination(e.target[1].value))
                break;
            case 3:
                updateLead(leadBuilder.date(toDateString(new Date(e.target[0].value)))
                    .departureTime(e.target[2].value)
                    .backTime(e.target[3].value))
                break;
            case 4:
                updateLead(leadBuilder.passengers(e.target[0].value)
                    .comments(e.target[1].value))
                break;
            case 5: {
                setStage(6);
                (async () => {
                    try {
                        const result = await sendSMSRequest(
                            leadBuilder.build()
                        )
                        alert(result)
                        window.location.reload()
                    } catch (e) {
                        alert(e)
                        setStage(5)
                    }
                })()
            }
                break;
        }
    }, [leadBuilder, stage, user])

    const LeadTimeLine = useCallback(() => {
        return <Stack justify="space-around" stackWidth="100%" alignSelf="center" margin={32} style={{ position: 'relative' }}>
            <IconMan z={2} color={'black'} style={TimeLineIconStyle(stage >= 1)} opacity={stage >= 1 ? 1 : 0.5} />
            <IconBus z={2} style={TimeLineIconStyle(stage >= 2)} opacity={stage >= 2 ? 1 : 0.5} />
            <IconCalendar z={2} style={TimeLineIconStyle(stage >= 3)} opacity={stage >= 3 ? 1 : 0.5} />
            <IconNote z={2} style={TimeLineIconStyle(stage >= 4)} opacity={stage >= 4 ? 1 : 0.5} />
            <IconSend z={2} style={TimeLineIconStyle(stage >= 5)} opacity={stage >= 5 ? 1 : 0.5} />
            <hr style={TimeLineStyle} />
        </Stack>
    }, [stage])
    const LeadDetails = useCallback(() => stage >= 5 ? (function () {
        const lead = leadBuilder.build()
        return <Stack direction="column" rowGap={4}
            alignment={'center'}
            background={overlayColor}
            style={{ borderRadius: '8px', boxShadow: boxShadowLight }} padding={4}>
            <Text><b>שם:</b> {lead.name}</Text>
            <Text><b>מס טלפון:</b> {lead.phone}</Text>
            <Text><b>נק' יציאה:</b> {lead.start}</Text>
            <Text><b>נק' חזרה:</b> {lead.destination}</Text>
            <Text><b>תאריך נסיעה:</b> {lead.date}</Text>
            <Text><b>שעת יציאה:</b> {lead.departureTime()}</Text>
            <Text><b>שעת חזרה:</b> {lead.backTime()}</Text>
            <Text><b>מספר נוסעים:</b> {lead.passengers}</Text>
            <Text><b>הערות:</b> {lead.comments}</Text>
        </Stack>
    })() : null, [leadBuilder, stage])

    return <Form padding={16}
        direction={'column'}
        rowGap={8}
        stackWidth={'100%'}
        maxWidth={'400px'}
        onSubmit={Submit}>
        <LeadStage />
        <LeadDetails />
        <Button
            fontSize={18}
            padding={8}
            disabled={stage === 6}
            width={'80%'}
            margin={8}
            background={greenColor}
            textColor={'white'}
            fontWeight={'bold'}
            alignSelf={'center'}
            type={'submit'}>
            {stage > 5 ? <Loader color={'black'} width={25} height={25} /> : stage === 5 ? 'שלח' : 'הבא'}
        </Button>
        <LeadTimeLine />
    </Form>
}

const Toolbar = () => {
    const { user, signOut, signInPopUp, setUser } = useUser()
    const router = useNavigate()
    const topLeft = { position: 'absolute', left: 16, top: '25%' } as CSSProperties
    const topRight = { position: 'absolute', right: '10vw', top: '25%' } as CSSProperties
    return <Stack
        justify={'center'}
        direction={'row'}
        padding={8}
        style={{ borderBottom: '1px solid lightgray', position: 'relative' }}>
        <RoundedButton style={topRight} type='light'>נסיעות</RoundedButton>
        <Text fontWeight="bold" fontSize={22} onClick={() => router('/')}>PickUS</Text>
        {user ? <RoundedButton style={topLeft} type='flat'>
            {`${user.email?.split('@')[0]}`}
            <UserMenu onClick={() => {
                // loading state
                setUser(undefined)
                setTimeout(() => {
                    signOut()
                }, 1000)
            }} />
        </RoundedButton> : user === null ? <RoundedButton type="dark" style={topLeft} onClick={() => {
            // loading state
            setUser(undefined)
            // sign-in window
            signInPopUp()
        }}>כניסה/הרשמה</RoundedButton> : <Loader color={'black'} width={25} height={25} style={topLeft} />}
    </Stack>
}

const Modal = () => {
    const modal = useModal()
    return <ModalWrapperStyle>
        <ModalContentStyle>
            <Stack alignSelf="center" alignment="center">
                {modal.content}
            </Stack>
            <Button onClick={() => modal.close()} style={ModalCloseButtonStyle}> Close  </Button>
        </ModalContentStyle>
    </ModalWrapperStyle>
}
export {
    Toolbar,
    LeadScene,
    Modal
}