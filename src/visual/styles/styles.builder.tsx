import { CSSProperties } from "react"
import { PRIMARY_ORANGE } from "./colors"
import { PRIMARY_BLACK, PRIMARY_PINK, PRIMARY_WHITE, SECONDARY_WHITE } from "./colors"
import { boxShadow } from "."
export type StyleScalar = number | string
export class StyleBuilder {
    initialStyle: Partial<CSSProperties>
    constructor(props?: Partial<CSSProperties>) {
        this.initialStyle = props ?? {}
    }
    build(): CSSProperties {
        return this.initialStyle
    }
    grid(rows?: StyleScalar,
        columns?: StyleScalar) {
        this.initialStyle.display = 'grid'
        if (rows)
            this.initialStyle.gridTemplateRows = `repeat(${rows},1fr)`
        if (columns)
            this.initialStyle.gridTemplateColumns = `repeat(${columns},1fr)`
        return this
    }
    borderRadius(amount: StyleScalar) {
        this.initialStyle.borderRadius = amount + 'px'
        return this
    }
    threeHalfWidth() {
        return this.widthPercent(75)
    }
    maxWidth(amount: StyleScalar) {
        this.initialStyle.maxWidth = amount + 'px'
        return this
    }
    maxWidthPercent(amount: StyleScalar) {
        this.initialStyle.maxWidth = amount + '%'
        return this
    }
    maxHeight(amount: StyleScalar) {
        this.initialStyle.maxHeight = amount + 'px'
        return this
    }
    maxHeightPercent(amount: StyleScalar) {
        this.initialStyle.maxHeight = amount + '%'
        return this
    }


    minWidth(amount: StyleScalar) {
        this.initialStyle.minWidth = amount + 'px'
        return this
    }
    minWidthPercent(amount: StyleScalar) {
        this.initialStyle.minWidth = amount + '%'
        return this
    }
    minHeight(amount: StyleScalar) {
        this.initialStyle.minHeight = amount + 'px'
        return this
    }
    minHeightPercent(amount: StyleScalar) {
        this.initialStyle.minHeight = amount + '%'
        return this
    }
    fourthWidth() {
        return this.widthPercent(25)
    }
    fifthWidth() {
        return this.widthPercent(20)
    }
    threeHalfHeight() {
        return this.heightPercent(75)
    }
    fourthHeight() {
        return this.heightPercent(25)
    }
    fifthHeight() {
        return this.heightPercent(20)
    }
    fullFlexCenterColumns() {
        this.flexColumn()
        return this.fullCenter()
    }
    fullFlexCenterRows() {
        this.flexRow()
        return this.fullCenter()
    }
    border(
        amount: StyleScalar = 1,
        color: string = SECONDARY_WHITE) {
        this.initialStyle.border = `${amount}px solid ${color}`
        return this
    }
    fontSize(amount: StyleScalar) {
        this.initialStyle.fontSize = amount + 'px'
        return this
    }
    fullWidth() {
        return this.widthPercent(100)
    }
    fullHeight() {
        return this.heightPercent(100)
    }
    halfWidth() {
        return this.widthPercent(50)
    }
    halfHeight() {
        return this.heightPercent(50)
    }
    height(amount: StyleScalar) {
        this.initialStyle.height = amount + 'px'
        return this
    }
    heightPercent(amount: StyleScalar) {
        this.initialStyle.height = amount + '%'
        return this
    }
    width(amount: StyleScalar) {
        this.initialStyle.width = amount + 'px'
        return this
    }
    widthPercent(amount: StyleScalar) {
        this.initialStyle.width = amount + '%'
        return this
    }
    gridColumns(columns: StyleScalar) {
        this.initialStyle.gridTemplateColumns = `repeat(${columns},1fr)`
        return this
    }

    rowGap(amount: StyleScalar) {
        this.initialStyle.rowGap = amount + 'px'
    }
    columnGap(amount: StyleScalar) {
        this.initialStyle.columnGap = amount + 'px'
    }
    gridRows(rows: StyleScalar) {
        this.initialStyle.gridTemplateRows = `repeat(${rows},1fr)`
        return this
    }

    bold() {
        this.initialStyle.fontWeight = 'bold'
        return this
    }
    fontWeight(amount: StyleScalar) {
        this.initialStyle.fontWeight = amount
        return this
    }

    pnpShadow() {
        let boxShad = boxShadow()
        this.initialStyle.boxShadow = boxShad.boxShadow
        return this
    }
    boxShadow(shad: string) {
        this.initialStyle.boxShadow = shad
        return this
    }
    flexRow() {
        this.initialStyle.display = 'flex'
        this.initialStyle.flexDirection = 'row'
        return this
    }
    flexColumn() {
        this.initialStyle.display = 'flex'
        this.initialStyle.flexDirection = 'column'
        return this
    }
    fullCenter() {
        this.justifyCenter()
        this.alignCenter()
        this.placeItemsCenter()
        return this.selfCenter()
    }
    placeItemsCenter() {
        this.initialStyle.placeItems = 'center'
        return this
    }
    fontFamily(family: string) {
        this.initialStyle.fontFamily = family
        return this
    }
    alignItemsStart() {
        this.initialStyle.alignItems = 'start'
        return this
    }
    alignItemsEnd() {
        this.initialStyle.alignItems = 'end'
        return this
    }
    textAlignCenter() {
        this.initialStyle.textAlign = 'center'
        return this
    }
    textAlignRight() {
        this.initialStyle.textAlign = 'right'
        return this
    }
    textAlignLeft() {
        this.initialStyle.textAlign = 'left'
        return this
    }
    textAlignStart() {
        this.initialStyle.textAlign = 'start'
        return this
    }
    textAlignEnd() {
        this.initialStyle.textAlign = 'end'
        return this
    }
    textColor(color: string) {
        this.initialStyle.color = color
        return this
    }
    overflowX(overflow: any) {
        this.initialStyle.overflowX = overflow
        return this
    }
    overflowY(overflow: any) {
        this.initialStyle.overflowY = overflow
        return this
    }
    overflow(overflow: any) {
        this.initialStyle.overflow = overflow
        return this
    }
    pinkBackground() {
        return this.background(PRIMARY_PINK)
    }
    whiteBackground() {
        return this.backroundColor(PRIMARY_WHITE)
    }
    gradientBackground() {
        return this.background(PRIMARY_ORANGE)
    }
    animation(animate: string) {
        this.initialStyle.animation = animate
        return this
    }
    transition(amount: StyleScalar) {
        this.initialStyle.transition = amount + 's'
    }
    semiWhiteBackground() {
        return this.backroundColor(SECONDARY_WHITE)
    }
    whiteText() {
        return this.textColor(PRIMARY_WHITE)
    }
    pinkText() {
        return this.textColor(PRIMARY_PINK)
    }
    semiWhiteText() {
        return this.textColor(SECONDARY_WHITE)
    }
    blackText() {
        return this.textColor(PRIMARY_BLACK)
    }
    blackBackground() {
        return this.backroundColor(PRIMARY_BLACK)
    }
    rtl() {
        this.initialStyle.direction = 'rtl'
        return this
    }
    ltr() {
        this.initialStyle.direction = 'ltr'
        return this
    }
    absolute() {
        this.initialStyle.position = 'absolute'
        return this
    }
    relative() {
        this.initialStyle.position = 'relative'
        return this
    }
    fixed() {
        this.initialStyle.position = 'fixed'
        return this
    }
    top(amount: StyleScalar) {
        this.initialStyle.top = amount + 'px'
    }
    left(amount: StyleScalar) {
        this.initialStyle.left = amount + 'px'
    }
    right(amount: StyleScalar) {
        this.initialStyle.right = amount + 'px'
    }
    bottom(amount: StyleScalar) {
        this.initialStyle.bottom = amount + 'px'
    }
    justifyCenter() {
        this.initialStyle.justifyContent = 'center'
        return this
    }
    alignCenter() {
        this.initialStyle.alignItems = 'center'
        return this
    }
    selfCenter() {
        this.initialStyle.alignSelf = 'center'
        return this
    }
    inlineAutoMargin() {
        this.initialStyle.marginLeft = 'auto'
        this.initialStyle.marginRight = 'auto'
        return this
    }
    padding(amount: StyleScalar) {
        this.initialStyle.padding = amount + "px"
        return this
    }
    paddingLeft(amount: StyleScalar) {
        this.initialStyle.paddingLeft = amount + "px"
        return this
    }
    paddingRight(amount: StyleScalar) {
        this.initialStyle.paddingRight = amount + "px"
        return this
    }
    paddingBottom(amount: StyleScalar) {
        this.initialStyle.paddingBottom = amount + "px"
        return this
    }
    paddingTop(amount: StyleScalar) {
        this.initialStyle.paddingTop = amount + "px"
        return this
    }
    marginLeft(amount: StyleScalar) {
        this.initialStyle.marginLeft = amount + "px"
        return this

    }
    margin(amount: StyleScalar) {
        this.initialStyle.margin = amount + "px"
        return this
    }
    marginRight(amount: StyleScalar) {
        this.initialStyle.marginRight = amount + "px"
        return this
    }
    marginBottom(amount: StyleScalar) {
        this.initialStyle.marginBottom = amount + "px"
        return this
    }
    marginTop(amount: StyleScalar) {
        this.initialStyle.marginTop = amount + "px"
        return this
    }
    background(background: string) {
        this.initialStyle.background = background
        return this
    }
    backroundColor(color: string) {
        this.initialStyle.backgroundColor = color
        return this
    }

}
