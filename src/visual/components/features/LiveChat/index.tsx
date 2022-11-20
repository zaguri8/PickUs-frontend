import React, { useEffect } from "react"
import { StyleBuilder } from "../../../styles/styles.builder"
import { PageHolder } from "../../wrappers"
import useLiveChat from "./useLiveChat"

const input_val = (e: React.BaseSyntheticEvent, i: number) => {
    return (e.target as any)[i].value
}

const withPreventDefault = (e: any, fn: any) => {
    e.preventDefault()
    fn()
}

export default () => {

    const chatClient = useLiveChat()
    if(!chatClient) return null
    // send message to server form
    return <PageHolder>


        <form
            style={new StyleBuilder()
                .padding(16)
                .minWidth(300)
                .build()}
            onSubmit={(e) => withPreventDefault(e,
                chatClient.sendMessage(input_val(e, 0)))}>
            <div style={new StyleBuilder()
                .flexColumn()
                .build()}>
                <input
                    style={new StyleBuilder()
                        .padding(8)
                        .margin(16)
                        .textAlignLeft()
                        .build()}

                    type="text" name="message" placeholder="Enter a message for server" />
                <button

                    style={new StyleBuilder()
                        .padding(8) // border with radius
                        .border(' 1px solid #000') 
                        .margin(16)
                        .build()} type="submit">Send</button>

            </div>
        </form>
    </PageHolder>
}