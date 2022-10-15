import { AppLink, FooterColumn, FooterWrapper } from "../../wrappers"
import styled from "@emotion/styled"
import routing from "../../../routing"
import React from "react"
import { primaryColor, secondaryColor, smallScreenMinSize, Stack, Text, textColorDark, textColorDark2, textColorPrimaryTitle } from "../../../styles"

const SectionHeader = styled.h3`
    margin:0px;
    padding:0px;
    color:${textColorPrimaryTitle};
    @media only screen and (max-width:${smallScreenMinSize}) {
        font-size:22px;
        padding:32px;
    }
`

const ResponsiveFooterTextStack = styled.div`
    display:flex;
    flex-direction:column;
    font-size:14px;
    @media only screen and (max-width:${smallScreenMinSize}) {
        flex-direction:row;
        width:100%;
        font-size:18px;
        justify-content:center;
        column-gap:75px;
        align-items:center;
    }
`
export default () => {
    return <FooterWrapper>

        {
            React.Children.toArray(routing.slice(0, routing.length - 1).map(route => {
                return <FooterColumn>
                    <SectionHeader >
                        {route.routePath}
                    </SectionHeader>
                    <ResponsiveFooterTextStack>
                        {React.Children.toArray((function Routes() {
                            const routes = React.Children.toArray(route.subRoutes.map(subRoute => <AppLink
                                to={subRoute.toURI()}
                                text={subRoute.routePath}
                                textProps={{
                                    textColor: textColorDark
                                }} />))
                            if (routes.length > 3) return [
                                routes.slice(0, routes.length / 2),
                                routes.slice(routes.length / 2)]
                            else return [routes]
                        })().map((routeLinkGroup) => <Stack
                            direction="column"
                            margin={2}
                            padding={2}
                            stackWidth={'max-content'}>
                            {routeLinkGroup}
                        </Stack>))}
                    </ResponsiveFooterTextStack>
                </FooterColumn >
            }))
        }
    </FooterWrapper >
}