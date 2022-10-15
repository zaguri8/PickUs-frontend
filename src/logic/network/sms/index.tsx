import ServerRequest from ".."
import { ServerResponse } from "../../types"

export function sendSMSRequest(
    type: 'ride' | 'client',
    object: any,
    state: string) {
    return new Promise((resolve, reject) => {
        if (type == 'ride') {
            ServerRequest<ServerResponse>('sendridesms', {
                ride: object,
                text: state
            }, result => {
                if (result.success) resolve(result.success)
                else if (result.error) reject(result.error)
            }, error => { reject(error) })
        } else if (type === 'client') {
            ServerRequest<ServerResponse>('sendclientsms', {
                client: object,
                text: state
            }, result => {
                if (result.success)
                    resolve(result.success)
                else if (result.error)
                    reject(result.error)
            }, error => { reject(error) })
        }
    })
}