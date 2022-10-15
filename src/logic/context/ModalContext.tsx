import React, { createContext, useContext, useState } from "react"
const ModalContext = createContext<IModalContext | null>(null)

export interface IModalContext {
    content: any,
    open: (a: any) => void
    close: () => void
}
export const ModalContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [content, setContent] = useState<any>()
    const open = (content: any) => { setContent(content) }
    const close = () => { setContent(undefined) }
    return <ModalContext.Provider value={{ open, close, content }}>
        {children}
    </ModalContext.Provider>
}
export const useModal = () => {
    const modalState = useContext(ModalContext) as IModalContext
    return {
        ...modalState!!
    }
}