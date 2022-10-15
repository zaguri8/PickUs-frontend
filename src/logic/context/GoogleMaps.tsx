import { createContext, useContext, useState, useEffect } from "react"
import { Loader } from '@googlemaps/js-api-loader';
const GoogleMapsContext = createContext<IGoogleContext | null>(null)

export const GoogleMapsContextProvider = (props: object) => {
    const [google, setGoogle] = useState<any>(null)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        const loader = new Loader({
            apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
            version: "weekly",
            libraries: ["places"]
        })
        loader.load().then(setGoogle).catch(setError)
    }, [])
    return <GoogleMapsContext.Provider value={{ google, error }} {...props} />
}

export interface IGoogleContext {
    google: any
    error: any
}
export const useGoogleState = () => {
    const googleState = useContext(GoogleMapsContext)
    return {
        google: googleState?.google
    }
}

export const onGoogleLoaded = (callBack: () => void) => {
    let tryes = 0;
    const tryTerval = setInterval(() => {
        tryes++
        if (tryes === 10 || window.google != null) {
            clearInterval(tryTerval)
            callBack()
        }
    }, 1000)
}