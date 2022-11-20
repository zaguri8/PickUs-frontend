


import axios from "axios"
import { Lead } from "../types"

const MAKE_URL = "https://hook.eu1.make.com/thifb5s4kdas8xgw1ya9btqloh5uqf1j"
export const useMake = () => {
    const make = async (lead: Lead) => {
        try {
            const response = await axios.post(MAKE_URL, lead, { headers: { 'Content-Type': 'application/json' } })
            return response
        } catch (error) {
            return error
        }
    }
    return { make }
}