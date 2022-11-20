import '../../App.css'
import { useEffect, useLayoutEffect } from 'react'
import $ from 'jquery'
import { useParams } from 'react-router'
import InvitationCardWorkers from './InvitationCardWorkers'
const InvitationPageWorkers = () => {
    const { id } = useParams()
    useLayoutEffect(() => {
        $('.dim').css({ 'display': 'none' })
    }, [])

    return <div >
        <div className="App" style={{ background: 'none' }}>
            {!id && <div>Invitation is not valid</div>}
            {id && <InvitationCardWorkers  />}
        </div>
    </div>
}
export default InvitationPageWorkers