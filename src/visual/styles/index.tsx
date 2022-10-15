import styled from "@emotion/styled";
import { CSSProperties } from "react";
import { StackProperties, InputProperties, ButtonProperties, TextProperties } from "./types";

// other style props
const boxShadowLight = 'rgba(0, 0, 0, 0.1) 0px 4px 12px'

// colors
const greenColor = '#12BD95'
const primaryColor = '#E9EDEC'
const overlayColor = 'rgba(249,255,254,0.4)'
const secondaryColor = "#E8E8E8"
const textColorPrimaryTitle = "rgb(1,26,37)"
const textColorDark = "rgb(32,50,70)"
const textColorDark2 = "rgb(18, 189, 171)"

const mobileMinSize = "320px"
const mobileMaxSize = "480px"

const ipadSizeMinSize = "481px"
const ipadSizeMaxSize = "768px"

const smallScreenMinSize = "769px"
const smallScreenMaxSize = "1024px"

const desktopMinSize = "1025px"
const desktopMaxSize = "1200px"

const largeScreenSize = "1201px"

const RoundedButton = styled.label<{ type: 'light' | 'dark' | 'flat' }>`
  color:${props => props.type === 'dark' || props.type === 'flat' ? '#0B2535' : greenColor};
  font-size:14px;
  cursor:pointer;
  position:relative;
  border-radius:4px;
  border: 2px solid ${props => props.type === 'dark' || props.type === 'flat' ? '#0B2535' : greenColor};
  padding-inline: 8px;
  transition:.175s linear;
  font-weight:bold;
  :hover {
    background:${props => props.type === 'flat' ? 'none' : props.type === 'dark' ? '#0B2535' : greenColor};
    color:${props => props.type !== 'flat' ? 'white' : '#0B2535'};
  }
`

// css properties
const TimeLineIconStyle = (withBorder: boolean) => ({
  background: 'white',
  padding: '4px',
  width: '30px',
  height: '30px',
  border: withBorder ? `2px solid ${greenColor} ` : '1px solid black',
  borderRadius: '50%'
}) as CSSProperties
const TimeLineStyle = {
  position: 'absolute',
  width: '100%',
  top: '20%',
  borderColor: 'white',
  opacity: '0.5'
} as CSSProperties
const ModalCloseButtonStyle = { position: 'absolute', bottom: 0, margin: '8px' } as CSSProperties


// emotion
const Stack = styled.div<StackProperties>`
    align-items:${props => props.alignment};
    justify-content:${props => props.justify};
    align-self:${props => props.alignSelf};
    row-gap:${props => props.rowGap + "px"};
    column-gap:${props => props.columnGap + "px"};
    flex-direction:${props => props.direction};
    display:flex;
    max-width:${props => props.maxWidth};
    width:${props => props.stackWidth};
    background:${props => props.background};
    color:${props => props.textColor};
    height:${props => props.stackHeight};
    padding:${props => props.padding + 'px'};
    margin:${props => props.margin + 'px'};
`
const Form = styled.form<StackProperties>`
align-items:${props => props.alignment};
justify-content:${props => props.justify};
row-gap:${props => props.rowGap + "px"};
column-gap:${props => props.columnGap + "px"};
flex-direction:${props => props.direction};
display:flex;
max-width:${props => props.maxWidth};
width:${props => props.stackWidth};
background:${props => props.background};
color:${props => props.textColor};
height:${props => props.stackHeight};
padding:${props => props.padding + 'px'};
margin:${props => props.margin + 'px'};
`

const Input = styled.input<InputProperties>`
    background:${props => props.background};
    color:${props => props.textColor};
    box-shadow: rgb(38, 57, 77) 0px 10px 20px -10px;
    height:${props => props.height};
    padding:${props => props.padding + 'px'};
    font-size:${props => props.fontSize + 'px'};
    padding-inline:${props => props.paddingInline + 'px'};
    padding-block:${props => props.paddingBlock + 'px'};
    margin:${props => props.margin + 'px'};
    text-align: right;
    text-indent: 5px;
    font-size: 12.6px;
    font-family:Open Sans Hebrew;
    max-width:${props => props.maxWidth};
    border-radius: 8px;
    border: solid 1.5px #D3D3D3;
    -webkit-transition: 1s; /* Safari */
    transition: 1s;

      [type=text]:hover{
        box-shadow: 0 0 5pt 0.5pt #D3D3D3;
      }
      [type=text]:focus {
        box-shadow: 0 0 5pt 2pt #D3D3D3;
        outline-width: 0px;
      }
      ::placeholder {
        font-weight:bold;
        color:${textColorDark};
      }
`

const Text = styled.label<TextProperties>`
    background:${props => props.background};
    color:${props => props.textColor};
    direction:rtl;
    cursor: ${props => props.withCursor ? 'pointer' : 'normal'};
    height:${props => props.height};
    padding:${props => props.padding + 'px'};
    font-weight:${props => props.fontWeight};
    font-size:${props => props.fontSize + 'px'};
    margin:${props => props.margin + 'px'};
    padding-inline:${props => props.paddingInline + 'px'};
    font-family:Open Sans Hebrew;
    max-width:${props => props.maxWidth};
`


const Button = styled.button<ButtonProperties>`
  border:none;
  border-radius:4px;
  background:${props => props.background};
  color:${props => props.textColor};
  box-shadow: rgb(38, 57, 77) 0px 10px 20px -10px;
  height:${props => props.height};
  width:${props => props.width};
  font-weight:${props => props.fontWeight};
  font-size: ${props => props.fontSize + 'px'};
  padding:${props => props.padding + 'px'};
  align-self:${props => props.alignSelf};
  margin:${props => props.margin + 'px'};
  font-family:Open Sans Hebrew;
  max-width:${props => props.maxWidth};
  transition:.1s linear;
  border:1px solid transparent;
  :hover {
    filter:brightness(95%);
    cursor:pointer;
  }
  :active {
    filter:brightness(90%);
  }
`


const ModalWrapperStyle = styled.div`
  position:absolute;
  width:100%;
  height:100%;
  display:grid;
  place-items:center;
  background:rgba(0,0,0,0.15);
`
const ModalContentStyle = styled.div`
  width:50%;
  position:relative;
  display:flex;
  flex-direction:column;
  align-items:center;
  padding:8px;
  min-width:300px;
  min-height:200px;
  height:50%;
  transition:.5s linear;
  max-height:100px;
  border-radius:8px;
  background:${primaryColor};
  -webkit-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
`



export {
  Stack,
  Button,
  Form,
  Text,
  Input,
  ModalWrapperStyle,
  ModalContentStyle,
  TimeLineIconStyle,
  ModalCloseButtonStyle,
  RoundedButton,
  TimeLineStyle,
  greenColor,
  primaryColor,
  textColorDark,
  textColorDark2,
  secondaryColor,
  boxShadowLight,
  overlayColor,
  ipadSizeMaxSize,
  ipadSizeMinSize,
  mobileMaxSize,
  mobileMinSize,
  smallScreenMaxSize,
  textColorPrimaryTitle,
  smallScreenMinSize,
  desktopMaxSize,
  desktopMinSize,
  largeScreenSize
}