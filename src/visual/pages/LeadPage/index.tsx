import { LeadScene } from "../../components/features"
import { PageHolder } from "../../components/wrappers"
import { Text } from "../../styles"
export default () => {
    return <PageHolder>
        <Text fontSize={20}>משווים מחירים ונוסעים, שנתחיל? קדימה!</Text>
        <Text fontWeight="bold">אז אנחנו PickUS, עם מי יש הכבוד?</Text>
        <LeadScene/>
    </PageHolder>
}