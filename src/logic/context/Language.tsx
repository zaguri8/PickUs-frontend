import { createContext, useContext, useState } from "react"
const LanguageContext = createContext<ILanguageContext | null>(null)

export interface ILanguageContext {
    lang: string
    setLang: (lang: string) => void
}
export const LanguageContextProvider = (props: object) => {
    const [lang, setLang] = useState("heb")
    return <LanguageContext.Provider value={{ lang, setLang }} {...props} />
}


export const useLanguage = () => {
    const languageState = useContext(LanguageContext) as ILanguageContext
    return {
        ...languageState
    }
}