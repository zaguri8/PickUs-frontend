import React from "react";
import { Stack, secondaryColor, Text, mobileMaxSize, smallScreenMinSize } from "../../styles";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { TextProperties } from "../../styles/types";
import '../../../index.css'
const PageHolder = ({ children }: { children: React.ReactNode }) => {

    return <Stack direction={'column'}
        stackWidth={'100%'}
        alignment={'center'}
        style={{ marginTop: '16px' }}>
        {children}
    </Stack>
}

const AppLink = ({ text, to, textProps }: { text: string, to: string, textProps: TextProperties }) => {
    return <Link
        style={{
            textDecoration: 'none',
            color: 'none',
        }}
        onClick={() => {
            window.scrollTo(0,0)
        }}
        to={to}>
        <Text {...textProps}>
            <span className="appLink">
                {text}
            </span>
        </Text>
    </Link>
}

const FooterColumn = ({ children }: { children: React.ReactNode }) => <Stack
    direction="column"
    alignment="center"
    justify="center"
    stackWidth="100%"
>
    {children}
</Stack>


const FooterWrapper = styled.div`
    position:relative;
    bottom:0;
    direction:ltr;
    width:100%;
    place-items:center;
    padding:32px;
    background:${secondaryColor};
    display:grid;
    grid-template-rows:1fr;
    grid-template-columns:repeat(4,1fr);

    @media only screen and (max-width:${smallScreenMinSize}) {
        grid-template-rows:repeat(4,1fr);
        grid-template-columns:1fr;
        padding-top:0px;
        height:fit-content;
    }
`

const UserMenu = styled.div`
    width:100%;
    height:100%;
    position:absolute;
    top:0;
    :hover {
        transition:.1s linear;
        ::before {
            content:'התנתק';
            display:block;
            text-align:center;
            border-radius:8px;
            padding:4px;
            top:16px;
            position:absolute;
            width:100%;
            height:fit-content;
            background:whitesmoke;

          
        }
        :hover {
            filter:brightness(98%);
        }
    }

`

export {
    PageHolder,
    UserMenu,
    FooterWrapper,
    FooterColumn,
    AppLink
}
