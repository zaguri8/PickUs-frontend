

import axios from "axios";
export default function ServerRequest<T>(path: string, body: any, success: (any: T) => void, error: (error: any) => void) {
    axios.post("https://www.nadavsolutions.com/gserver/" + path,
        { ...body, credentials: { key: process.env.REACT_APP_NADAVSOLUTIONS_API_KEY } })
        .then(result => success(result.data))
        .catch(er => error(er))
}

export async function ServerPRequest<T>(path: string, body: any): Promise<T> {
    return axios.post("https://www.nadavsolutions.com/gserver/" + path,
        { ...body, credentials: { key: process.env.REACT_APP_NADAVSOLUTIONS_API_KEY } })
        .then(result => result.data as T)
        .catch(er => er)
}