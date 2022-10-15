
import ServerRequest from ".."
import { PNPUser } from "../../types"

export const createNewCustomer = async (createError: ((type: string, e: any) => any), user: PNPUser) => {
    return new Promise((accept, reject) => {
        const send = {
            customer: { email: user.email, customer_name: user.name }
        }
        ServerRequest<{ data: { customer_uid: string } }>('newcustomer', send, res => accept(res.data.customer_uid), e => {
            createError('createNewCustomer', { error: e, email: user.email })
            reject(e)
        })
    })
}

