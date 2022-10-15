import React, { CSSProperties } from "react"

export type StackProperties = Partial<{
    alignment: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-evenly' | 'space-around' = 'center',
    justify: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-evenly' | 'space-around' = 'center',
    rowGap: number = 0,
    alignSelf: string = "inherit",
    stackWidth: string = "100%",
    textColor: string = "black",
    stackHeight: string = "fit-content",
    columnGap: number = 0,
    direction: 'column' | 'row' = 'column',
    background: string = 'none',
    padding: number = 0
    maxWidth: string = "100%",
    margin: number = 0
}>

export type InputProperties = Partial<{
    width: string = "100%",
    maxWidth: string = "100%",
    paddingBlock: number = 0,
    fontSize: number = 16,
    paddingInline: number = 0,
    textColor: string = "black",
    height: string = "fit-content",
    alignSelf: string = 'inherit',
    fontWeight: 'normal' | 'bold' | 'bolder' = 'normal',
    background: string = 'none',
    padding: number = 0
    margin: number = 0
}>

export type ButtonProperties = InputProperties
export type TextProperties = InputProperties & { withCursor?: boolean = false }
