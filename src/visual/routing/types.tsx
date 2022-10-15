import React from "react"
import { Route } from "react-router"
import { PageHolder } from "../components/wrappers"
import { Stack, Text } from "../styles"
import { textColorDark2 } from "../styles"
import Tree from '../assets/TreeVectorSet/Vector 38.svg'
import { Image } from "@mantine/core"
export const ISBETA = true
export class PickUSSubRoute {
    element: React.ReactNode
    routePath: string
    parentPath: string = "/"
    constructor({ routePath, element }: { routePath: string, element: React.ReactNode }) {
        this.routePath = routePath
        this.element = ISBETA ? <Stack direction="row"
        padding={32}
        justify="space-around">
            <Text style={{background:`url('${Tree}')`,backgroundPosition:'left center',  fontSize: '24px', fontWeight: 'bold', color: textColorDark2 }}>
                {routePath}
            </Text>
        </Stack> : element
    }
    toURI = () => {
        return this.parentPath + "/" + encodeURI(this.routePath.replaceAll(' ', '-').replaceAll("?", ""));
    }
    toRoute = () => <Route path={this.toURI()} element={<PageHolder>{this.element}</PageHolder>} />
}
export class PickUSRoute {
    element: React.ReactNode
    routePath: string
    subRoutes: PickUSSubRoute[]
    constructor({ routePath, element, subRoutes = [] }: { routePath: string, element: React.ReactNode, subRoutes: PickUSSubRoute[] }) {
        this.routePath = routePath
        this.element = element
        subRoutes.forEach(route => route.parentPath = this.toURI())
        this.subRoutes = subRoutes
    }
    toURI = () => encodeURI(this.routePath.replaceAll(' ', '-').replaceAll('?', ""));
    toRoute = () => <React.Fragment>
        <Route path={this.toURI()} element={<PageHolder>{this.element}</PageHolder>} />
        {React.Children.toArray(this.subRoutes.map(route => route.toRoute()))}
    </React.Fragment>
}