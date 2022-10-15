import LeadPage from "../pages/LeadPage"
import { PickUSRoute, PickUSSubRoute } from "./types"
export default [new PickUSRoute({
    routePath: "/",
    element: <LeadPage />,
    subRoutes: [new PickUSSubRoute({
        routePath: 'ליד',
        element: <div>Hello 2</div>
    })]
}), new PickUSRoute({
    routePath: "מערכת Pickus",
    element: <LeadPage />,
    subRoutes: [new PickUSSubRoute({
        routePath: 'תמיכה ושאלות נפוצות',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'איך זה עובד?',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'תנאי שימוש',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'מדיניות פרטיות',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'הצהרת נגישות',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'אודות',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'יצירת קשר',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'מפת אתר',
        element: <div>Hello 2</div>
    })]
}), new PickUSRoute({
    routePath: 'סוגי הסעות',
    element: <div>Hello 2</div>,
    subRoutes: [new PickUSSubRoute({
        routePath: 'הסעות עובדים',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'הסעות קבועות',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'הסעות תלמידים',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'הסעות בדרום',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'הסעות לאירועים',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'הסעות למסיבות',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'הסעות תיירים',
        element: <div>Hello 2</div>
    })]
}), new PickUSRoute({
    routePath: "אזורי שירות",
    element: <LeadPage />,
    subRoutes: [new PickUSSubRoute({
        routePath: 'הסעות במרכז',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'הסעות בצפון',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'הסעות בשפלה',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'הסעות בדרום',
        element: <div>Hello 2</div>
    })]
}), new PickUSRoute({
    routePath: "סוגי רכבים",
    element: <div>{"Hello"}</div>,
    subRoutes: [new PickUSSubRoute({
        routePath: 'השכרת אוטובוס',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'השכרת מיניבוס',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'השכרת מידיבוס',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'השכרת מונית גדולה',
        element: <div>Hello 2</div>
    }), new PickUSSubRoute({
        routePath: 'השכרת לימוזינה',
        element: <div>Hello 2</div>
    })]
})].reverse()