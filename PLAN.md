# מסמך תכנון - PM ATUAN (דשבורד ניהול פרויקטים אישי)

> מסמך זה הוא הספק (Specification) המנחה לבניית האפליקציה בסשנים הבאים.
> כל שינוי בדרישות צריך לעדכן את המסמך הזה לפני בניית קוד.
>
> **גרסה**: 3.4 (סבב מיפוי דומיין מלא - תשתיות אנרגיה / לסיכו)
> **תאריך עדכון**: 2026-05-15
>
> **שינויים בגרסה 3.4**:
> - שם האפליקציה: **PM ATUAN** (היה ללא שם רשמי)
> - דומיין יעד: **pm-atuan.web.app** (ייתוסף כ-Hosting site שני; הפריסה הנוכחית `pm-dashboard-avichai.web.app` זמנית)
> - הוסף תיאור מפורט של חברת לסיכו ושני התפקידים האפשריים (קבלן ראשי / קבלן משנה) — סעיף 1.5
> - מיקוד MVP חודד: ניהול קבצים + AI על חוזים + דשבורד פיננסי + תזכורות — סעיף 3
> - **3 מטבעות נתמכים**: ש"ח (default), דולר, יורו — שדות `currency`, `exchangeRateToILS`, `amountInILS` בכל אוסף פיננסי
> - אוסף חדש: `clients/` עם `clientType` (end_client / main_contractor / both)
> - אוסף חדש: `boq_revisions/` — snapshot של כל חשבון חלקי
> - אוסף חדש: `project_documents/` — מאחד מסמכי מכרז + הצעה + חוזה + שינויים
> - אוסף חדש: `tenders/` ו-`purchase_orders/` ו-`timesheets/` (Phase 8) — סכמה מפורטת
> - שינוי מהותי ב-`projects`: `endClientId`, `mainContractorId?`, `ourRole`, `projectNumber`, `site`, `projectType`, `contractAmount`, `warrantyPeriodMonths`
> - שינוי מהותי ב-`boq_items`: היררכיית ספרור 4 רמות (`itemCode` "XX.YY.ZZ.NNN"), 15 עמודות עפ"י תקן ישראלי, `rowType` (item/note/section_header)
> - הוסף `contractMetadata` ל-`documents` עם שדות לחילוץ אוטומטי (תאריך מסירה, ערבות, צמדות מדד, סנקציות)
> - **כל הדוגמאות הוחלפו**: משפחת לוי / אלי שלד / אריחי קרמיקה → תע"א / י.ר.ן / לסיכו / צנרת דס"ל
> - נענו כל השאלות הפתוחות (Q1, Q2, Q4 + Q7-Q12 מהסבב הקודם)
> - הוספו שאלות מינוריות שעוד פתוחות (יומן יומי / הפקת PDF של חשבון חלקי)

---

## 1. תקציר מנהלים

**שם האפליקציה**: **PM ATUAN**

**מה בונים**: אפליקציית web אישית (PWA) לניהול פרויקטי תשתיות אנרגיה. מוקד הליבה — לפי סדר חשיבות:
1. **ניהול קבצים** (חוזים, מסמכי מכרז, חשבונות חלקיים, חשבוניות, תכניות AutoCAD)
2. **חיפוש AI על תוכן** — בעיקר חוזים (RAG)
3. **דשבורד פיננסי** — תקציב מול בפועל, תזרים, יתרות לקבלנים/ספקים, חשבונות חלקיים
4. **תזכורות** — תאריכי מסירה, חוזים מסתיימים, חשבונות לתשלום, עיכובי אספקה ב-long lead items

תוספות שניבנו כצורך:
- נתונים שיובאו מ-Priority (ייצוא Excel ידני, אין הרשאת API)
- משימות ולוח זמנים פר-פרויקט
- אירועי לוח שנה (Outlook + Google Calendar)
- מיילים רלוונטיים (לעתיד)

**עבור מי**: משתמש יחיד (אביחי) - **על חשבונות פרטיים, לא ארגוניים**.

**איפה זה רץ**: מחשב נייח, מחשב נייד, טאבלט, נייד - דרך הדפדפן (PWA, ניתן להתקין למסך הבית).

**טכנולוגיה**: Next.js (Frontend) + Firebase (Backend + Hosting).

**דומיין יעד**: `pm-atuan.web.app` (ייתוסף כ-Hosting site שני בפרויקט הקיים).
**דומיין נוכחי**: `pm-dashboard-avichai.web.app` (זמני - הפריסה הנוכחית עד שמוסיפים את ה-site השני).

**עלות**: **0 ש"ח לתמיד** - Firebase Spark Plan (חינמי, ללא כרטיס אשראי).

**אסטרטגיית חיוב**: נשארים ב-**Spark Plan** (החינמי). אין סיכון תשלום כלל - אם נחרוג מהמכסה, השירות עוצר עד איפוס יומי (00:00 פסיפיק). הנתונים בטוחים תמיד.

**שדרוג עתידי** (רק אם נצטרך): אם יום אחד נראה שהמכסות לוחצות בפועל - אז נשקול מעבר ל-Blaze עם תקרת תקציב. עד אז - לא נוגעים בכרטיס אשראי.

**מטבעות נתמכים**: ש"ח (default), דולר, יורו. תצוגת ברירת מחדל ש"ח; toggle בהגדרות; שערים מתעדכנים יומית מ-API חינמי (בנק ישראל / ECB).

**פרטיות**: מוחלטת. לא ארגונית. החשבונות הם אישיים. המעסיק לא יכול לראות שום דבר.

---

## 1.5 על המשתמש והדומיין

### המשתמש
**אביחי**, מהנדס מכונות, מנהל פרויקטים בחברת **לסיכו** (Lasiko).

### החברה והתפקיד
לסיכו פועלת בתחום **תשתיות אנרגיה**:
- מערכות דלק / דס"ל
- תחנות כוח (טורבינות גז וקיטור במחזור משולב)
- שיפוצי טורבינה ותחזוקה גדולה
- מתקני התפלה
- תשתיות מים
- תשתיות תת-קרקעיות ועיליות

### שתי תצורות תפקיד — קריטי למודל הנתונים
ברוב הפרויקטים: **לסיכו = קבלן ראשי** מול המזמין הסופי (גוף ממשלתי / חברה פרטית גדולה).

במקרים חריגים: **לסיכו = קבלן משנה** של קבלן ראשי גדול יותר. דוגמה: פרויקט 2253 — לסיכו עובדת תחת **י.ר.ן בנייה ופיתוח** שזכה במכרז של תע"א.

**המודל חייב לתמוך בשתי התצורות** דרך שדה `ourRole` באוסף `projects`.

### מזמיני עבודה טיפוסיים
- תעשייה אווירית (תע"א)
- חברת חשמל לישראל
- מקורות
- תש"ן (תשתיות נפט ואנרגיה)
- חברות פרטיות גדולות

### קבלני משנה טיפוסיים שלסיכו עובדת איתם
- חברות עבודות עפר
- חברות ריתוכים והנחת צנרת
- חברות חשמל ובקרה
- חברות הגנה קתודית
- חברות בקרה (טסטים)

### עבודה בו-זמנית
מספר פרויקטים פעילים במקביל בשלבים שונים.

### תחומי אחריות יומיומיים
- כתבי כמויות וחשבונות חלקיים
- תשלומים לקבלנים
- חוזים מול מזמיני עבודה ומול קבלנים
- חישובים הנדסיים
- ניהול תקציב הוצאות והכנסות
- מכרזים והצעות מחיר
- דוחות ומצגות
- קבצי Excel להצעות מחיר
- קבצי Word ומיילים
- תזכורות
- בניית דשבורדים חכמים ואינטגרציות
- תכניות הנדסיות ב-AutoCAD
- ניהול כוח אדם ושעות עבודה
- הזמנות רכש גדולות — **long lead items** קריטיים (ציוד מורכב עם זמני אספקה ארוכים)

### עקרון מנחה — גמישות מעל הכל
**אי-אפשר לבנות תבנית קשיחה**. כל פרויקט שונה. מודל הנתונים חייב:
- שדות `category` / `specialty` להיות **free text** (לא enum קשיח)
- אפשרות להוספת **custom fields** פר פרויקט
- קטגוריות מסמכים שניתן להוסיף בזמן ריצה

### השלכות לארכיטקטורה
- הליבה ב-PLAN (פרויקטים / הוצאות / קבלנים / ספקים / תשלומים / כתבי כמויות / משימות / מסמכים) תואמת לדומיין — עם התאמות.
- הוספת אוסף `clients/` נפרד עם `clientType` (end_client / main_contractor / both).
- הוספת `boq_revisions/` — כל חשבון חלקי הוא snapshot של כתב הכמויות בנקודת זמן.
- אוסף `project_documents/` מאחד מסמכי מכרז + הצעה + חוזה + שינויים תחת `type` ו-`isPrimaryContract`.
- 3 מודולים נוספים ל-Phase 8: מכרזים, הזמנות רכש, ניהול שעות עבודה — סכמה מפורטת בסעיף 12.

---

## 1.6 מחזור חיים של פרויקט (אמיתי, מאומת ע"י המשתמש)

```
1.  פרסום מכרז ע"י המזמין
2.  קבלת מסמכי מכרז
3.  הכנת הצעת מחיר
4.  הגשה
5.  (אם זכינו) חתימת חוזה
6.  תכנון הנדסי מפורט
7.  סגירת חוזים עם קבלני משנה
8.  הזמנת ציוד וחומרים
9.  המתנה לאספקה  ← קריטי. long lead items - חודשים של המתנה לטורבינות / מערכות בקרה
10. ביצוע באתר
11. טסטים למערכת (קומישנינג)
12. מסירה
13. תקופת בדק (warranty)
```

### השלכות למודל ול-UI

- **שלב 9 (המתנה לאספקה)** עומד בפני עצמו — חייב להיות בולט בדשבורד עם מעקב `expectedDeliveryDate` ב-`purchase_orders/{poId}`. דגל `isLongLeadItem` להבלטה.
- **שלב 1-4 (מכרז → הגשה)** — לפני שיש פרויקט פעיל. אוסף `tenders/` נפרד; אם זוכים, נוצר פרויקט ב-`projects/` ומוצמד `linkedProjectId` ל-tender.
- **שלב 6-8 (תכנון → רכש)** — מקור ל-`boq_items` ראשונים, חוזי קבלני משנה ב-`contractors/`, הזמנות רכש ב-`purchase_orders/`.
- **שלב 10-12 (ביצוע → מסירה)** — מקור לחשבונות חלקיים (`boq_revisions/`).
- **שלב 13 (תקופת בדק)** — שדה `warrantyPeriodMonths` ב-`projects/`; פרויקט במצב warranty עדיין במעקב אבל אינו פעיל.

---

## 1.7 דוגמאות אמיתיות לדומיין (להחלפה ב-mock + UI + AI prompts)

### מזמינים סופיים (`endClientId`)
- "תעשייה אווירית" (תע"א)
- "חברת חשמל לישראל"
- "מקורות"
- "תש"ן" (תשתיות נפט ואנרגיה)

### קבלנים ראשיים (כשלסיכו = משנה) (`mainContractorId`)
- "י.ר.ן בנייה ופיתוח"
- "אלקטרה תשתיות"
- "אורד הנדסה"

### אנחנו
- **לסיכו צמ"א** (Lasiko)

### קבלני משנה טיפוסיים (`contractors/`)
- "מ.צ. ריתוכים" — ריתוכים והנחת צנרת
- "ש.ב. עבודות עפר"
- "אלקטרו-דלק שירותים" — חשמל ובקרה למתקני דלק
- "הגנה קתודית הצפון"
- "טסטים והפעלה נ.ב." — קומישנינג

### פריטי כתב כמויות (description ב-`boq_items/`)
- "צנרת פלדה ASTM A 106 Grade B SCH 40"
- "מונה דלק LC M-5"
- "אקדח תדלוק אוטומטי NFPA 407"
- "מגוף כדורי 2\""
- "מד הפרשי לחץ מפלדת אל-חלד FM/UL"
- "גלגלון צינור גמיש 1\" באורך 30 מטר"
- "מיכל התפשטות 2.5 גלון, 275 PSI"

### פרקים בכתב כמויות (chapter / sub-chapter codes)
- `01.38.00.000` — מתקני דלק
- `02.01.00.000` — עבודות עפר ופיתוח - קו צנרת
- `02.38.01.000` — עבודות להתקנת קו צנרת
- `02.38.02.000` — עבודות ניתוק קו, ניקיון והחזרה לעבודה
- `02.38.03.000` — עבודות צנרת בשוחות
- `02.38.05.000` — הגנה קתודית
- `02.38.06.000` — רכש ואספקת חומרים
- `02.38.07.000` — עבודות רג'י

### יחידות מידה (`unit` ב-`boq_items/`)
`מטר` | `מ"ק` | `יח'` | `קומפ'` (קומפלט) | `מ"א` (מטר אורך) | `טון` | `ש"ע` (שעות עבודה) | `הערה`

### שמות פרויקטים מלאים (לתצוגה)
- "פרויקט 2253 — מערכת דס"ל למתחם תחזוקה, תע"א, באר שבע"
- "פרויקט 2288 — שדרוג מערכת דלק תחנת כוח"
- "פרויקט 2306 — הקמת מתקן אחסון דלק"

### קטגוריות הוצאה (`category` ב-`expenses/`) — חופשי, דוגמאות
- "צנרת ואביזרים"
- "ציוד דלק"
- "ציוד טורבינה"
- "קבלן משנה — ריתוכים"
- "קבלן משנה — עבודות עפר"
- "קבלן משנה — חשמל ובקרה"
- "חומרי גלם"
- "כלי עבודה"
- "תכנון הנדסי"
- "בדיקות ואישורים"
- "אחר"

---

## 2. מה הוביל להחלטות האלה (היסטוריה קצרה)

נשקלו 4 ארכיטקטורות עיקריות לפני ההכרעה הנוכחית:

1. ~~**Microsoft Power Platform** (M365 ארגוני)~~ - נדחה בגלל פרטיות. החברה הייתה רואה את כל הנתונים, אובדן בעלות בעת עזיבת עבודה
2. ~~**AppSheet** (Google Cloud)~~ - נדחה בגלל עלות ~$10/חודש
3. ~~**Notion** (חשבון אישי)~~ - נדחה בגלל מגבלות התאמה אישית והעדר סנכרון Excel
4. **Next.js + Firebase** (חשבון אישי) ← **נבחר**

**הסיבות לבחירה**:
- חינם לחלוטין
- פרטיות מלאה (חשבון Google אישי)
- בעלות מלאה (הקוד והנתונים שלי)
- גמישות אינסופית
- שימוש בחשבון Firebase שכבר קיים

---

## 3. דרישות שנאספו

### דרישות פונקציונליות
- [ ] רב-מכשיריות (מחשב, נייד, טאבלט) - דפדפן/PWA
- [ ] סנכרון בזמן אמת בין מכשירים (Firestore Listeners)
- [ ] קליטת Excel - העלאה ידנית דרך האפליקציה (וגם סנכרון מ-OneDrive אישי בעתיד)
- [ ] שילוב Outlook Calendar (חשבון אישי)
- [ ] שילוב Google Calendar (חשבון אישי)
- [ ] ניהול משימות מובנה לכל פרויקט
- [ ] תמיכה בריבוי פרויקטים
- [ ] ממשק עברית RTL
- [ ] ניהול מסמכים (PDF/Excel/תמונות/AutoCAD)
- [ ] תמיכה ב-3 מטבעות (ש"ח / דולר / יורו) עם המרה אוטומטית
- [ ] תמיכה בשתי תצורות תפקיד (קבלן ראשי / קבלן משנה) דרך `ourRole`
- [ ] מעקב אחר long lead items בהזמנות רכש

### דרישות לא-פונקציונליות
- אפס עלות נוספת
- פרטיות מלאה מהמעסיק
- בעלות מלאה על הקוד והנתונים
- נגישות מכל מכשיר ללא התקנת אפליקציה ייעודית
- אבטחה (אימות, הצפנה במעבר, גיבוי אוטומטי)
- **גמישות מעל תבניות קשיחות** — קטגוריות, התמחויות, וסוגי מסמכים = free text

### מוקד הליבה של ה-MVP (לפי סדר חשיבות)

המשתמש הגדיר את 4 הצרכים הקריטיים. כל השאר תוספות.

1. **📁 ניהול קבצים** — חוזים, מסמכי מכרז, חשבונות חלקיים, חשבוניות, תכניות AutoCAD. אסטרטגיה היברידית: קבצים קטנים (חוזים, חשבוניות) באפליקציה, תכניות גדולות (DWG, PDF גדולים) ב-Drive עם קישור.
2. **🤖 חיפוש AI על תוכן** — בעיקר חוזים. שאלות כמו "מתי תאריך המסירה?", "מה גובה הערבות?", "מה תקופת הבדק?". סעיף 9.5 בפירוט.
3. **📊 דשבורד פיננסי** — תקציב מול בפועל, תזרים, יתרות לקבלנים וספקים, סטטוס חשבונות חלקיים, ש"ח/$/€.
4. **🔔 תזכורות** — תאריכי מסירה מתקרבים, חוזים מסתיימים, חשבונות לתשלום, **עיכובי אספקה ב-long lead items**, חוזים בתקופת בדק.

### מודולים ל-MVP (מטרגטים את 4 הצרכים למעלה)
1. **ניהול פרויקטים** — CRUD, פרטים, סטטוס לפי 13 שלבי מחזור החיים.
2. **ניהול מסמכים** — `project_documents/` + `documents/` + viewer מובנה ל-PDF (PDF.js).
3. **דשבורד פיננסי** — KPIs פר פרויקט + cross-project, גרפים, יתרות.
4. **חשבונות חלקיים (כתבי כמויות)** — מבנה היררכי 4 רמות, 15 עמודות, snapshots ב-`boq_revisions/`.
5. **צ'אט AI מבוסס חוזים (RAG)** — שאלות בעברית על תוכן מסמכים.
6. **תזכורות בסיסיות** — בדשבורד, מבוסס תאריכים שב-Firestore.

### מודולים עתידיים
- אינטגרציה עם Outlook Mail
- ניהול מסמכי בטיחות (מעבר לחוזים)
- **הפקת PDF של חשבון חלקי** מ-Firestore להגשה למזמין (סבב מאוחר)
- **יומן פרויקט** (notes יומי) — אם יוחלט שצריך כמודול בסיסי
- OCR אוטומטי לחשבוניות (יכול להשתלב עם תשתית ה-AI שכבר תהיה)
- ניהול גרסאות של תכניות AutoCAD (כרגע: ידני ע"י המשתמש, האפליקציה רק קישור)

---

## 4. ארכיטקטורה כללית

```
┌──────────────────────────────────────────────────────────────────┐
│  ממשק - Next.js 15 + TypeScript + Tailwind + shadcn/ui            │
│  PWA (Progressive Web App) - ניתן להתקין על נייד וטאבלט           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐  │
│  │ דשבורד  │  │הוצאות/  │  │קבלנים/  │  │ משימות+ │  │הגדרות │  │
│  │ראשי     │  │הכנסות   │  │ספקים    │  │לוז      │  │       │  │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └────────┘  │
│  שפה: עברית RTL בלבד (בשלב ראשון)                                  │
└──────────────────────────┬───────────────────────────────────────┘
                           │ HTTPS + Firebase SDK
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│  Backend - Firebase (Google Cloud)                                │
│  ┌────────────────────┐ ┌────────────────────┐ ┌──────────────┐  │
│  │ Firestore          │ │ Authentication     │ │ Storage      │  │
│  │ (מסד נתונים NoSQL) │ │ (Google Sign-In)   │ │ (PDF/Excel)  │  │
│  └────────────────────┘ └────────────────────┘ └──────────────┘  │
│  ┌────────────────────┐ ┌────────────────────┐                    │
│  │ Cloud Functions    │ │ Hosting (אופציונלי │                    │
│  │ (פרסור Excel,       │ │  - נשתמש ב-Vercel) │                    │
│  │  webhooks, סנכרון) │ │                    │                    │
│  └────────────────────┘ └────────────────────┘                    │
└──────────────────────────────────────────────────────────────────┘
                           ▲
                           │
┌──────────────────────────┴───────────────────────────────────────┐
│  אינטגרציות חיצוניות (OAuth - חשבונות אישיים)                     │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐  │
│  │ Google Calendar  │ │ Microsoft Graph  │ │ Personal OneDrive│  │
│  │ (Calendar API)   │ │ (Outlook Cal+Mail│ │ (Excel files)    │  │
│  │                  │ │  - חשבון אישי)   │ │                  │  │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  פריסה (Deployment) - הכל חינם לתמיד                              │
│  - GitHub (קוד מקור, חשבון אישי שלך) - חינמי                       │
│  - Firebase Hosting (Hosting הממשק) - חינמי, אותו חשבון Firebase  │
│  - Firebase Project אישי (Backend + Hosting) - Spark plan         │
│                                                                  │
│  הערה: בחרנו Firebase Hosting במקום Vercel כי Vercel מבדילה בין   │
│  שימוש hobby (חינם) ל-commercial ($20/חודש). Firebase Hosting    │
│  חינמי לכל שימוש אישי וקל לחיבור.                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. פרטיות, אבטחה ובעלות

זה לב הסיבה שבחרנו במסלול הזה. נכנס לפרטים:

### הבעלות שלך - מה זה אומר בפועל
- **הקוד**: מאוחסן ב-GitHub שלך, על שמך. גם אם אני "אעלם" - הקוד שייך לך
- **הנתונים**: יושבים ב-Firestore תחת **פרויקט Firebase שיש לך גישת admin אליו**. רק לך
- **חשבון Vercel**: על שמך. אתה היחיד שיכול להפיל את האפליקציה
- **דומיין** (אם תוסיף): נרשם על שמך הפרטי, לא על שם החברה

### אבטחה מובנית
- **HTTPS** בכל מקום (אכיפה ע"י Firebase ו-Vercel)
- **Firebase Auth** - כניסה עם Google אישי, מוגן ב-2FA אם תפעיל
- **Firestore Rules** - חוקים שמבטיחים שרק אתה (UID שלך) יכול לקרוא את הנתונים שלך
- **גיבוי אוטומטי** - Firebase עושה replication. בנוסף, נגדיר Export ל-Google Drive פעם בשבוע

### מה המעסיק יכול לראות
- ❌ **לא יכול לראות**: את הנתונים, את הקוד, מה אתה עושה באפליקציה
- ❌ **לא יכול לחסום גישה**: אתה ניגש מהדפדפן הפרטי שלך
- ⚠️ **יכול לראות**: אם **מהמחשב הארגוני** אתה ניגש ל-vercel.app - הם רואים את הדומיין בלוגי רשת. **המלצה**: גישה רק מהנייד/טאבלט הפרטי

### מה לעשות אם תיסיים עבודה
- ✅ ממשיך לעבוד בלי שינוי - הכל על חשבונות אישיים
- ✅ אין סיכון אובדן גישה - אין תלות בחשבון העבודה

### מה לעשות אם תרצה לעבור פלטפורמה אחרת בעתיד
- **Firebase → אחר**: Export שכבר מוגדר → ייבוא לכל מסד אחר (Postgres, MongoDB, וכו')
- אין vendor lock-in קשה

---

## 6. מודל נתונים (Firestore)

Firestore הוא **NoSQL** (לא טבלאות עם JOIN). הקרטוגרפיה דומה לטבלאות SQL אבל עם מספר הבדלים. כאן כל "אוסף" (collection) הוא כמו טבלה, וכל מסמך (document) הוא כמו שורה.

### אסטרטגיית מבנה - אוספים ברמת השורש (לא תת-אוספים)

```
firestore/
├── users/{userId}                          ← משתמש יחיד = אתה
│   └── {displayName, email, settings, defaultCurrency, ...}
│
├── clients/{clientId}                       ← חדש (3.4)
│   └── {ownerId, name, clientType, companyId, ...}
│        clientType = 'end_client' | 'main_contractor' | 'both'
│
├── projects/{projectId}
│   └── {ownerId, projectNumber, endClientId, mainContractorId?,
│        ourRole, site, projectType, contractAmount,
│        warrantyPeriodMonths, deliveryDate, currency, ...}
│
├── expenses/{expenseId}
│   └── {ownerId, projectId, date, category, amount, currency,
│        exchangeRateToILS, amountInILS, ...}
│
├── income/{incomeId}
│   └── {ownerId, projectId, date, amount, currency, ...}
│
├── contractors/{contractorId}
│   └── {ownerId, name, specialty (free text), phone, ...}
│
├── suppliers/{supplierId}
│   └── {ownerId, name, category (free text), phone, ...}
│
├── payments/{paymentId}
│   └── {ownerId, projectId, payeeType, payeeId, amount,
│        currency, exchangeRateToILS, amountInILS, ...}
│
├── boq_items/{itemId}
│   └── {ownerId, projectId, itemCode, chapterCode,
│        subChapterCode, groupCode, itemNumber, rowType,
│        15 עמודות עפ"י תקן ישראלי, ...}
│
├── boq_revisions/{revisionId}              ← חדש (3.4)
│   └── {ownerId, projectId, revisionNumber, billDate,
│        status, totalAmount, cumulativePercent, ...}
│        snapshot של כתב הכמויות בנקודת זמן = חשבון חלקי
│
├── tasks/{taskId}
│   └── {ownerId, projectId, title, status, dueDate, ...}
│
├── schedule_items/{itemId}
│   └── {ownerId, projectId, name, startDate, endDate, ...}
│
├── documents/{documentId}
│   └── {ownerId, projectId, fileName, storage,
│        contractMetadata? (extracted), ...}
│
├── project_documents/{docId}                ← חדש (3.4)
│   └── {ownerId, projectId?, tenderId?, type,
│        isPrimaryContract, fileURL, extractedMetadata?, ...}
│        מאחד מסמכי מכרז + הצעה + חוזה + שינויים
│
└── (Phase 8 - יוסיפו אחרי MVP)
    ├── tenders/{tenderId}
    ├── purchase_orders/{poId}
    └── timesheets/{timesheetId}
```

> **למה ברמת השורש ולא תת-אוספים תחת projects**? קל יותר לעשות שאילתות חוצות פרויקטים (לדוגמה "כל המשימות הקרובות בכל הפרויקטים"). מצד שני נצטרך לסנן ידנית לפי projectId, אבל זה זול.

### שדה `ownerId` בכל מסמך
חוקי האבטחה (Firestore Rules) יבדקו ש-`ownerId == request.auth.uid` בכל קריאה. ככה אם בעתיד יצטרף משתמש - הוא לא יראה את הנתונים שלך.

### פירוט שדות פר אוסף

#### `clients/{clientId}` (חדש בגרסה 3.4)
```typescript
{
  ownerId: string,
  name: string,                    // "תעשייה אווירית" / "י.ר.ן בנייה ופיתוח"
  companyId: string?,              // ח.פ.
  clientType: 'end_client' | 'main_contractor' | 'both',
  contactPerson: string?,
  phone: string?,
  email: string?,
  address: string?,
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```
> **למה צריך**: מזמין סופי (תע"א) ≠ קבלן ראשי (י.ר.ן). בפרויקטים שבהם לסיכו = קבלן משנה, יש שני "לקוחות" — המזמין הסופי שמשלם בסוף השרשרת, והקבלן הראשי שלסיכו מדווחת אליו.

#### `projects/{projectId}`
```typescript
{
  ownerId: string,
  projectNumber: string,           // "2253" / "2288" / "2306"
  name: string,                    // "מערכת דס"ל למתחם תחזוקה, תע"א, באר שבע"
  endClientId: string,             // ref ל-clients/ (המזמין הסופי - תע"א)
  mainContractorId: string?,       // ref ל-clients/ (אם אנחנו קבלן משנה)
  ourRole: 'main_contractor' | 'subcontractor',
  site: string,                    // "באר שבע - מתחם תחזוקה"
  projectType: string,             // free text: "מערכת דס"ל" / "תחנת כוח" / ...
  tenderId: string?,               // אם נולד ממכרז (Phase 8)
  status: 'tender_phase' | 'planning' | 'procurement' | 'execution'
        | 'commissioning' | 'delivered' | 'warranty' | 'closed' | 'cancelled',
  startDate: timestamp,
  deliveryDate: timestamp?,        // יעד מסירה לפי חוזה
  actualDeliveryDate: timestamp?,
  warrantyPeriodMonths: number?,   // 12 / 24 / 36 / ...
  contractAmount: number,          // סכום החוזה (לסיכו מקבלת)
  currency: 'ILS' | 'USD' | 'EUR',
  exchangeRateToILS: number,
  amountInILS: number,             // מחושב
  actualSpent: number,             // מחושב מ-expenses (אגרגציה)
  progressPercent: number,         // 0-100
  oneDriveFolderURL: string?,
  priorityCode: string?,
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `expenses/{expenseId}`
```typescript
{
  ownerId: string,
  projectId: string,
  date: timestamp,
  category: string,                // free text - לא enum (3.4)
                                   // דוגמאות: "צנרת", "ציוד טורבינה",
                                   // "קבלן משנה - ריתוכים", "חומרי גלם"
  description: string,
  amount: number,                  // לפני מע"מ, במטבע מקור
  vat: number,
  amountWithVat: number,
  currency: 'ILS' | 'USD' | 'EUR', // default ILS (3.4)
  exchangeRateToILS: number,       // snapshot בעת היצירה
  amountInILS: number,             // מחושב = amountWithVat * exchangeRateToILS
  invoiceNumber: string?,
  invoiceDate: timestamp?,
  supplierId: string?,
  paymentStatus: 'pending' | 'partial' | 'paid' | 'cancelled',
  paidDate: timestamp?,
  linkedPurchaseOrderId: string?,  // ref ל-purchase_orders (Phase 8)
  sourceFile: string?,
  sourceRow: number?,
  attachments: string[],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `income/{incomeId}`
```typescript
{
  ownerId: string,
  projectId: string,
  date: timestamp,
  clientId: string,                // ref ל-clients/ במקום string חופשי (3.4)
  description: string,
  amount: number,
  vat: number,
  currency: 'ILS' | 'USD' | 'EUR',
  exchangeRateToILS: number,
  amountInILS: number,
  invoiceNumber: string,
  status: 'invoiced' | 'partial' | 'paid',
  paidDate: timestamp?,
  linkedBoqRevisionId: string?,    // אם בא מחשבון חלקי (3.4)
  sourceFile: string?,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `contractors/{contractorId}`
```typescript
{
  ownerId: string,
  name: string,                    // "מ.צ. ריתוכים" / "אלקטרו-דלק שירותים"
  contactPerson: string?,
  phone: string?,
  email: string?,
  specialty: string,               // free text (3.4) - לא enum
                                   // דוגמאות: "ריתוכים", "עבודות עפר",
                                   // "חשמל ובקרה", "הגנה קתודית",
                                   // "טסטים וקומישנינג"
  contractTotal: number,
  currency: 'ILS' | 'USD' | 'EUR',
  exchangeRateToILS: number,
  contractTotalInILS: number,
  totalPaid: number,               // ב-ש"ח (מחושב)
  balance: number,                 // contractTotalInILS - totalPaid
  notes: string,
  linkedProjects: string[],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `suppliers/{supplierId}`
```typescript
{
  ownerId: string,
  name: string,
  contactPerson: string?,
  phone: string?,
  email: string?,
  category: string,                // free text (3.4) - לא enum
                                   // דוגמאות: "ספק צנרת", "ספק ציוד דלק",
                                   // "ספק טורבינות", "כלי עבודה"
  paymentTerms: string,            // "שוטף + 30" / "שוטף + 45"
  isForeign: bool,                 // ספק חוץ-לארץ? (3.4)
  totalPaid: number,               // ב-ש"ח (מחושב)
  openBalance: number,             // ב-ש"ח
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `payments/{paymentId}`
```typescript
{
  ownerId: string,
  projectId: string,
  payeeType: 'contractor' | 'supplier',
  payeeId: string,
  invoiceId: string?,
  amount: number,                  // במטבע מקור
  currency: 'ILS' | 'USD' | 'EUR', // (3.4)
  exchangeRateToILS: number,
  amountInILS: number,
  paymentMethod: 'transfer' | 'cheque' | 'cash' | 'card',
  paymentDate: timestamp,
  chequeNumber: string?,
  confirmationNumber: string?,
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `boq_items/{itemId}` (עודכן 3.4 — תקן ישראלי 15 עמודות)

> **תגלית מסבב המיפוי**: "כתב כמויות" ו"חשבון חלקי" הם **אותו קובץ עם 15 עמודות**. כל חשבון חלקי הוא snapshot של כתב הכמויות בנקודת זמן — ראה `boq_revisions/` למטה.

**היררכיית ספרור (תקן ישראלי - 4 רמות)**:
```
XX.00.00.000  = פרק            (לדוגמה: 02.00.00.000 - תשתיות)
XX.YY.00.000  = תת-פרק          (02.38.00.000 - מתקני דלק)
XX.YY.ZZ.000  = קבוצת סעיפים    (02.38.01.000 - עבודות צנרת)
XX.YY.ZZ.NNN  = סעיף בודד       (02.38.01.040 - מגוף כדורי 2")
```

```typescript
{
  ownerId: string,
  projectId: string,

  // היררכיית קוד
  itemCode: string,           // "02.38.01.040" - הקוד המלא
  chapterCode: string,        // "02"
  subChapterCode: string,     // "38"
  groupCode: string,          // "01"
  itemNumber: string,         // "040"
  rowType: 'item' | 'note' | 'section_header',
                              // 'note' = תנאי חוזה, לא סעיף תשלום

  description: string,        // טקסט טכני: "מגוף כדורי 2" לפי תקן..."
  unit: string,               // free text: מטר | מ"ק | יח' | קומפ' |
                              //   מ"א | טון | ש"ע | "הערה"

  // 15 עמודות עפ"י תקן ישראלי לחשבון חלקי:
  contractUnitPrice: number,            // (4) מחיר יחידה
  contractQuantity: number,             // (5) כמות חוזה
  previousQuantity: number,             // (6) כמות קודמת
  previousPercentPaid: number,          // (7) % תשלום קודם
  measuredQuantity: number,             // (8) כמות נמדדת
  cumulativeQuantityForPayment: number, // (9) כמות מצטברת לתשלום
  percentToPay: number,                 // (10) אחוז לתשלום
  cumulativeAmount: number,             // (11) סכום מצטבר
  percentCumulativeFromContract: number,// (12) % מצטבר מחוזה
  currentBillAmount: number,            // (13) סכום לחשבון זה
  percentCurrentBillFromContract: number,// (14) % חשבון זה מחוזה
  percentCurrentFromPrevious: number,   // (15) % חשבון זה מחשבון קודם

  contractorId: string?,      // קבלן משנה שמבצע את הסעיף
  createdAt: timestamp,
  updatedAt: timestamp
}
```

> **רוחב מספרים**: כל הסכומים ב-ש"ח (מטבע הפרויקט). המרה למטבעות אחרים — דרך תקציב הפרויקט.

#### `boq_revisions/{revisionId}` (חדש בגרסה 3.4)
```typescript
{
  ownerId: string,
  projectId: string,
  revisionNumber: number,          // 1, 2, 3, ... (מספר חשבון חלקי)
  billDate: timestamp,             // תאריך החשבון
  submittedDate: timestamp?,       // תאריך הגשה למזמין
  approvedDate: timestamp?,        // תאריך אישור המזמין
  paidDate: timestamp?,
  status: 'draft' | 'submitted' | 'approved' | 'paid' | 'rejected',
  totalAmount: number,             // סכום כולל לתשלום בחשבון הזה
  cumulativePercent: number,       // % מצטבר מתחילת הפרויקט
  notes: string?,
  snapshotItemsRef: string,        // הפניה ל-snapshot של כל ה-boq_items
                                   // באותה נקודת זמן (תת-אוסף או storage)
  createdAt: timestamp,
  updatedAt: timestamp
}
```
> **למה צריך**: כשנשלח חשבון חלקי למזמין, צריך לזכור **בדיוק** מה היה המצב באותה נקודה. אם 3 חודשים אחרי המזמין שואל "מה היה הסכום ב-חשבון 4?" — אנחנו רוצים תשובה מדויקת, גם אם בינתיים עדכנו כמויות.

#### `tasks/{taskId}`
```typescript
{
  ownerId: string,
  projectId: string,
  title: string,
  description: string,
  status: 'new' | 'in_progress' | 'blocked' | 'completed' | 'cancelled',
  priority: 'low' | 'medium' | 'high' | 'critical',
  assignedTo: string?,
  dueDate: timestamp?,
  completedDate: timestamp?,
  dependsOnTaskId: string?,
  linkedBoqItemId: string?,
  googleCalendarEventId: string?,  // לסנכרון Google Calendar
  outlookCalendarEventId: string?, // לסנכרון Outlook Calendar
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `schedule_items/{itemId}`
```typescript
{
  ownerId: string,
  projectId: string,
  parentItemId: string?,      // היררכיה
  name: string,
  startDate: timestamp,
  endDate: timestamp,
  durationDays: number,       // מחושב
  progressPercent: number,
  predecessors: string[],     // מערך של scheduleItemIds תלויים
  contractorId: string?,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `documents/{documentId}` (עודכן 3.4)
```typescript
{
  ownerId: string,
  projectId: string,
  fileName: string,
  storage: 'firebase' | 'drive' | 'onedrive',
  storageURL: string?,             // אם storage='firebase'
  externalURL: string?,            // אם storage='drive'/'onedrive'
  fileSize: number,
  mimeType: string,
  type: string,                    // free text (3.4)
                                   // דוגמאות: "contract" / "invoice" /
                                   // "drawing_dwg" / "drawing_pdf" /
                                   // "test_report" / "permit" / "other"
  tags: string[],
  uploadedAt: timestamp,

  // נשלף אוטומטית מקובץ חוזה (Cloud Function + LLM)
  contractMetadata: {
    contractDate: timestamp?,
    partyA: { name: string, companyId: string? }?,    // המזמין
    partyB: { name: string, companyId: string? }?,    // הקבלן
    endClient: string?,                                // המזמין הסופי
    amount: number?,
    currency: 'ILS' | 'USD' | 'EUR'?,
    startDate: timestamp?,
    deliveryDate: timestamp?,
    warrantyMonths: number?,
    paymentTerms: string?,                             // "שוטף + 60"
    guaranteeAmount: number?,                          // ערבות ביצוע
    delayPenalty: string?,                             // סנקציות על פיגור
    indexLinkage: string?,                             // צמדות מדד
    annexes: string[]?,                                // רשימת נספחים
  }?
}
```

#### `project_documents/{docId}` (חדש בגרסה 3.4)

מאחד מסמכי פרויקט שמתפרשים על מחזור החיים — **מכרז → הצעה → חוזה → שינויים**.

```typescript
{
  ownerId: string,
  projectId: string?,              // null אם זה רק מכרז שעוד לא זכינו
  tenderId: string?,               // אם קשור למכרז (Phase 8)
  type: 'tender_publication'       // מסמכי מכרז שהמזמין פרסם
      | 'proposal'                 // ההצעה שלנו
      | 'contract'                 // החוזה החתום
      | 'amendment'                // תוספת/שינוי לחוזה
      | 'work_order'               // הוראת ביצוע
      | 'other',
  isPrimaryContract: bool,         // הקובץ הראשי לפרויקט
                                   // (3.4) הקובץ הזה:
                                   // - מופיע ראשון במסך הפרויקט
                                   // - ה-AI עונה ממנו בברירת מחדל
                                   // - סיכום אוטומטי נוצר ממנו
  fileURL: string,
  fileName: string,
  mimeType: string,
  uploadedAt: timestamp,
  extractedMetadata: any?,         // ראה contractMetadata ב-documents
  notes: string?
}
```

> **חוקיות**: רק קובץ אחד פר פרויקט יכול להיות `isPrimaryContract=true`. אכיפה בלוגיקה (לא ברמת DB).

### אוספים של Phase 8 (יוסיפו אחרי MVP)

#### `tenders/{tenderId}` (Phase 8)
```typescript
{
  ownerId: string,
  tenderNumber: string,            // מספר מכרז שהמזמין פרסם
  publishedBy: string,             // ref ל-clients/ (מי פרסם)
  publishedDate: timestamp,
  submissionDeadline: timestamp,   // ← תזכורת בדשבורד
  estimatedValue: number?,         // אומדן ערך המכרז
  status: 'evaluating'             // בוחנים אם להגיש
        | 'preparing'              // מכינים הצעה
        | 'submitted'              // הגשנו
        | 'won'                    // זכינו
        | 'lost'                   // הפסדנו
        | 'cancelled',
  ourProposedAmount: number?,      // הסכום שהגשנו
  currency: 'ILS' | 'USD' | 'EUR',
  exchangeRateToILS: number,
  amountInILS: number,
  resultDate: timestamp?,
  linkedProjectId: string?,        // אם זכינו - ref ל-projects/
  documents: string[],             // refs ל-project_documents/
  notes: string?,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `purchase_orders/{poId}` (Phase 8) — long lead items
```typescript
{
  ownerId: string,
  projectId: string,
  poNumber: string,                // מספר הזמנת רכש
  supplierId: string,              // ref ל-suppliers/
  description: string,             // "טורבינת גז GE 9F.05 מס' סידורי..."
  amount: number,
  currency: 'ILS' | 'USD' | 'EUR',
  exchangeRateToILS: number,
  amountInILS: number,
  orderDate: timestamp,
  expectedDeliveryDate: timestamp, // ← קריטי, יוצג בדשבורד
  actualDeliveryDate: timestamp?,
  status: 'ordered'                // הוזמן
        | 'in_production'          // בייצור
        | 'shipped'                // נשלח
        | 'delivered'              // התקבל
        | 'partial'                // אספקה חלקית
        | 'cancelled',
  isLongLeadItem: bool,            // ← בולט בדשבורד
  invoiceId: string?,              // ref ל-expenses (כשהחשבונית הגיעה)
  notes: string?,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `timesheets/{timesheetId}` (Phase 8)
ניהול שעות עבודה של צוות פנימי וקבלנים. סכמה מפורטת תוגדר ב-Phase 8.

### חוקי Firestore (אבטחה) - דוגמת בסיס
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ברירת מחדל - הכל חסום
    match /{document=**} {
      allow read, write: if false;
    }

    // משתמש יכול לקרוא/לכתוב רק נתונים שלו
    match /projects/{projectId} {
      allow read, write: if request.auth != null
                        && request.auth.uid == resource.data.ownerId;
      allow create: if request.auth != null
                  && request.resource.data.ownerId == request.auth.uid;
    }

    // אותו דבר לכל האוספים האחרים
    match /expenses/{id} {
      allow read, write: if request.auth != null
                        && request.auth.uid == resource.data.ownerId;
      allow create: if request.auth != null
                  && request.resource.data.ownerId == request.auth.uid;
    }

    // ... וכן הלאה לכל האוספים
  }
}
```

---

## 7. מסכי האפליקציה

### מסך 1 - דשבורד ראשי (`/`)
**אלמנטים**:
- 4 כרטיסי KPI: פרויקטים פעילים, סה"כ תקציב, סה"כ הוצאות, רווח/הפסד
- גרף קו: התקדמות הוצאות מול תקציב (אגרגציה לפי חודש)
- רשימה: 5 משימות בעדיפות גבוהה ביותר (בכל הפרויקטים)
- רשימה: 5 תשלומים בקרבה לתאריך פירעון
- אירועי יומן להיום ומחר (מסונכרן עם Outlook + Google)

### מסך 2 - רשימת פרויקטים (`/projects`)
- גריד / כרטיסי פרויקט
- סינון: סטטוס, לקוח, תאריך
- כפתורים: הוסף, ערוך, שכפל, ארכוב

### מסך 3 - פירוט פרויקט (`/projects/[id]`)
- כותרת פרויקט עם תפקיד (קבלן ראשי / קבלן משנה) ומזמין סופי
- טאבים: סקירה / מסמכים / חשבונות חלקיים / הוצאות / הכנסות / קבלנים / ספקים / לוח זמנים / משימות
- **סקירה** = החוזה הראשי בראש (`isPrimaryContract=true`) + סיכום AI אוטומטי + 10 שאלות RAG מהירות
- כל טאב מסונן אוטומטית ל-projectId הנוכחי

### מסך 4 - הוצאות והכנסות (`/finance`)
- 2 לשוניות: הוצאות / הכנסות
- תצוגות: רשימה / גרפים / לוח זמני (timeline)
- העלאת Excel ידנית
- **3 מטבעות** — הצגה בש"ח (default), toggle למטבע מקור

### מסך 5 - קבלנים וספקים (`/parties`)
- 2 לשוניות: קבלנים / ספקים
- כרטיסיה לכל אחד עם יתרה פתוחה
- כפתור "צור תשלום"
- סינון לפי `specialty` / `category` (free text)

### מסך 6 - חשבונות חלקיים (`/boq`)
- בחירת פרויקט בראש + רשימת `boq_revisions/` (חשבונות 1, 2, 3...) מהצד
- טבלה היררכית 4 רמות (פרק → תת-פרק → קבוצה → סעיף)
- 15 עמודות תקן ישראלי
- שורות `rowType='note'` מוצגות אחרת (לא חלק מהסכומים)
- כפתור "צור חשבון חלקי חדש" → יוצר snapshot ב-`boq_revisions/`
- (Phase מאוחר) כפתור "ייצא PDF" להגשה רשמית למזמין

### מסך 7 - לוח זמנים (`/schedule`)
- תצוגת גאנט (ספריית JS - נחליט בסשן הבא בין `frappe-gantt`, `dhtmlx-gantt` או built-from-scratch)
- אפשרות גרירה לשינוי תאריכים

### מסך 8 - משימות (`/tasks`)
- 3 תצוגות: רשימה / קנבן / לוח שנה
- סינון לפי פרויקט/סטטוס/עדיפות
- כל משימה עם DueDate יוצרת אוטומטית אירוע יומן

### מסך 9 - הגדרות (`/settings`)
- ניהול חיבורים: Google Calendar, Outlook (אישי), OneDrive (אישי)
- ייבוא ראשוני (העלאת קובץ Excel גדול)
- ייצוא נתונים (Backup ל-Drive)
- **מטבע ברירת מחדל לתצוגה** (ש"ח / USD / EUR)
- צפייה בשערי חליפין נוכחיים מ-`exchange_rates/`

---

## 8. Cloud Functions (לוגיקה אוטומטית בענן)

### Function 1: parseExcelOnUpload
**טריגר**: כשקובץ Excel חדש נטען ל-Firebase Storage תחת `/uploads/{ownerId}/{type}/`
**פעולה**:
1. קריאת הקובץ עם ספריית `xlsx` או `exceljs`
2. זיהוי סוג הדוח לפי שם הקובץ (expenses, income, payments, boq, ...)
3. עיבוד כל שורה: UPSERT לאוסף המתאים
4. רישום של תוצאות הפעולה לאוסף `imports/` (כמה רשומות נוספו/עודכנו)
5. שליחת התראה לאפליקציה (דרך Firestore document)

### Function 2: syncCalendarsScheduled
**טריגר**: Schedule (כל 15 דקות)
**פעולה**:
- שליפת אירועים מ-Google Calendar עם תג "Project"
- שליפת אירועים מ-Outlook Calendar עם תג "Project"
- יצירת/עדכון משימות תואמות באוסף `tasks/`

### Function 3: pushTaskToCalendars
**טריגר**: כשנוצרת/מתעדכנת משימה עם `dueDate`
**פעולה**:
- יצירת/עדכון אירוע ב-Google Calendar
- יצירת/עדכון אירוע ב-Outlook Calendar
- שמירת ה-eventIds במשימה

### Function 4: aggregateProjectStats
**טריגר**: כשנוסף/משתנה expense, payment, או task
**פעולה**:
- חישוב מחדש של `actualSpent` בפרויקט
- חישוב מחדש של `progressPercent`
- חישוב מחדש של `totalPaid` ו-`balance` בקבלן/ספק

### Function 5: dailyDigestEmail
**טריגר**: Schedule (כל בוקר ב-08:00)
**פעולה**:
- בניית מייל יומי: משימות דחופות + תשלומים קרובים + KPIs
- שליחה דרך SendGrid Free / Firebase Extensions

### Function 6: priorityExportReminder
**טריגר**: Schedule (08:00 ימים א'-ה')
**פעולה**:
- בדיקה: מתי הסנכרון האחרון של נתוני פריוריטי?
- אם > 24 שעות → שליחת התראה (Push Notification דרך FCM + מייל)

### Function 7: weeklyBackup
**טריגר**: Schedule (כל ראשון ב-02:00)
**פעולה**:
- Export של כל ה-Firestore לקובץ JSON
- שמירה ב-Firebase Storage תחת `/backups/`
- שמירה גם ב-Google Drive האישי (דרך Google Drive API)

### Function 8: dailyExchangeRateSync (חדש בגרסה 3.4)
**טריגר**: Schedule (כל בוקר ב-07:00)
**פעולה**:
- שליפת שערי חליפין מ-API חינמי (בנק ישראל / ECB / exchangerate.host)
- שמירת שערים לאוסף `exchange_rates/{date}` עם USD→ILS ו-EUR→ILS
- שערים אלה ישמשו ל-snapshot של כל רשומה חדשה (`exchangeRateToILS`)

**פורמט**:
```typescript
exchange_rates/2026-05-15 {
  date: '2026-05-15',
  USD_to_ILS: 3.65,
  EUR_to_ILS: 3.92,
  source: 'BankOfIsrael' | 'ECB' | 'exchangerate.host',
  fetchedAt: timestamp
}
```

---

## 9. אינטגרציה עם Excel

### זרימת העלאה
1. המשתמש פותח את המסך הרלוונטי (לדוגמה "הוצאות")
2. לוחץ "ייבא מ-Excel"
3. בוחר קובץ → התקבל ב-Firebase Storage
4. Cloud Function `parseExcelOnUpload` מתבצעת אוטומטית
5. עדכון Firestore → האפליקציה מקבלת עדכון בזמן אמת ומציגה את הרשומות החדשות

### מבנה Excel נדרש
לכל סוג דוח תהיה תבנית. הקובץ חייב להיות **טבלת Excel מוגדרת** (Ctrl+T):

**expenses.xlsx**
| date | category | description | amount | vat | currency | invoice_number | invoice_date | supplier_name | payment_status |
|---|---|---|---|---|---|---|---|---|---|

**income.xlsx**
| date | client | description | amount | vat | currency | invoice_number | status |
|---|---|---|---|---|---|---|---|

**payments.xlsx**
| project_name | payee_type | payee_name | invoice_number | amount | currency | payment_method | payment_date |
|---|---|---|---|---|---|---|---|

**boq.xlsx** — תקן ישראלי 15 עמודות (עודכן 3.4)
| מספר | תיאור | יחידת מידה | מחיר יחידה | כמות חוזה | כמות קודמת | % תשלום קודם | כמות נמדדת | כמות מצטברת לתשלום | אחוז לתשלום | סכום מצטבר | % מצטבר מחוזה | סכום לחשבון זה | % חשבון זה מחוזה | % חשבון זה מחשבון קודם |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

> **מספר**: "02.38.01.040" - היררכיית קוד 4 רמות
> **יחידת מידה**: free text - "מטר", "מ"ק", "יח'", "קומפ'", "מ"א", "טון", "ש"ע", "הערה"
> **סוג שורה "הערה"**: תנאי חוזה - לא סעיף תשלום. מזוהה אוטומטית או דרך עמודה נוספת `row_type`.

תבניות יופקו ב-Phase 3 על בסיס הקבצים האמיתיים שאביחי יעלה.

### סנכרון אוטומטי מ-OneDrive אישי (לעתיד)
- חיבור OAuth עם חשבון Microsoft אישי
- Function שמאזינה לתיקייה ב-OneDrive האישי
- כשמעדכנים קובץ → קוראת ומסנכרנת אוטומטית
- **לא ל-MVP** - תוספת אחרי שהבסיס יציב

---

## 9.4 אסטרטגיית אחסון מסמכים - היברידית

> מסמכים קטנים (חוזים, חשבוניות) באפליקציה. תוכניות גדולות נשארות ב-Drive/OneDrive עם קישור בלבד.

### הבעיה
- Firebase Storage חינמי: 5 GB
- סט תוכניות מלא לפרויקט: 150-500 MB
- 10 פרויקטים × 300 MB תוכניות = 3 GB - יחרוג בקרוב
- ה-Drive/OneDrive האישיים שלך כבר נותנים 15 GB חינמי

### הפתרון

```
┌─────────────────────────────────────────────────────────┐
│  באפליקציה (Firebase Storage 5GB)                       │
│  ─ חוזים (1-2 MB כל אחד)                                 │
│  ─ חשבוניות (50-200 KB)                                  │
│  ─ היתרי בנייה (200-500 KB)                              │
│  ─ קבצים שצריך לסרוק ב-AI                                │
│  ─ סך צפוי לתיק 10 פרויקטים: ~500 MB << 5 GB            │
└─────────────────────────────────────────────────────────┘
                            +
┌─────────────────────────────────────────────────────────┐
│  Drive / OneDrive (קישור בלבד באפליקציה)                │
│  ─ סטים מלאים של תוכניות (PDF גדול, DWG, RVT)           │
│  ─ ארכיון גרסאות ישנות של תוכניות                       │
│  ─ קבצי source כבדים שלא צריך לחפש בהם                   │
│  ─ סך צפוי: שם המקום מספיק, אין חיוב                     │
└─────────────────────────────────────────────────────────┘
```

### מודל נתונים - הוספה ל-documents

```typescript
documents/{documentId} {
  ownerId: string,
  projectId: string,
  fileName: string,
  category: "contract" | "invoice" | "permit" | "plan" | "other",
  storage: "firebase" | "drive" | "onedrive",   // ← חדש
  storageURL?: string,           // אם storage="firebase"
  externalURL?: string,          // אם storage="drive"/"onedrive"
  externalProvider?: "google" | "microsoft",
  thumbnail?: string,            // תמונת preview של הדף הראשון (קטנה)
  ...
}
```

### UI - איך זה מתבטא

- **בעת העלאה**: שני כפתורים - "📤 העלה לאפליקציה" / "🔗 קשר קובץ מ-Drive"
- **בכרטיס המסמך**: תווית מקור 📦 באפליקציה / ☁️ ב-Drive
- **לחיצה לצפייה**:
  - באפליקציה → PDF.js מובנה במודאל
  - ב-Drive → iframe של Drive Viewer (תומך ב-PDF, DWG, ועוד)
- **AI Agent**: סורק רק קבצים שיושבים ב-Firebase. קישורי Drive ייסרקו רק אופציונלית (דרך OAuth של Drive)

### צופה מסמכים מובנה - PDF.js

ספרייה חינמית של Mozilla:
- 100% client-side, אין שרת
- תומך בכל PDF
- ניווט בעמודים, זום, חיפוש טקסט
- הטמעה: ~10 שורות קוד

```tsx
import { Document, Page } from "react-pdf";
<Document file={fileUrl}>
  <Page pageNumber={currentPage} />
</Document>
```

### צפיית DWG / קבצי CAD

- **דרך Drive**: iframe ל-`https://drive.google.com/file/d/[ID]/preview` - תומך אוטומטית ב-DWG
- **חלופה**: Autodesk Viewer (API חינמי במכסה - 100 cloud credits/month)
- **המלצה**: להתחיל עם Drive iframe (פשוט, חינמי, עובד). Autodesk Viewer רק אם נדרשת אינטראקציה עם הקובץ

### עלויות - אם בכל זאת תחרוג מהמכסה החינמית

| תרחיש | חודש |
|------|------|
| 5-10 GB אחסון | ~₪0.50 |
| 50 GB אחסון | ~₪5 |
| 100 GB אחסון | ~₪10 |

עם האסטרטגיה ההיברידית - לא תגיע לשם תוך 5-10 שנים.

---

## 9.5 סוכן AI מלא + ניהול חוזים (Agent + RAG)

> סוכן AI שיודע לפעול על **כל** הנתונים באפליקציה: חשבוניות, חוזים, משימות, קבלנים, תזרים, מלאי. הסוכן בוחר באיזה כלי להשתמש לפי השאלה - דומה לאיך ש-Claude Code עובד.

### דרישת משתמש

המשתמש שואל שאלות חופשיות בעברית - הסוכן אמור לדעת איך לענות. דוגמאות:

| סוג שאלה | דוגמה |
|---------|------|
| חיפוש בחשבוניות/תשלומים | "תמצא חשבוניות מ-מ.צ. ריתוכים בפרויקט 2253" |
| תוכן חוזים (RAG) | "מתי תאריך מסירת הצנרת?" / "מי חתום על חוזה הטורבינה?" |
| צבירה / אגרגציה | "כמה הוצאתי החודש על צנרת בכל הפרויקטים?" |
| משימות / לוז | "מה דחוף השבוע?" / "מתי הפגישה הבאה עם הקבלן?" |
| יתרות לספקים | "מה היתרה ל-י.ר.ן?" / "מי הקבלן עם החוב הגדול?" |
| השוואות חוצות-פרויקטים | "השווה תקציב צנרת בין 2253 ל-2288" |
| מסמכים | "כל המסמכים שהועלו השבוע" |
| סיכומים | "תסכם לי מה קרה השבוע" |
| פעולות (עתידי) | "תוסיף משימה: לתאם בקרת ריתוכים עד מחר" |
| Long lead items | "אילו הזמנות רכש בעיכוב מעבר ל-30 יום?" |
| חוזים — RAG ספציפי | "מה גובה הערבות הבנקאית?" / "מה תקופת הבדק?" |

### ארכיטקטורה - Tool-Calling Agent

```
┌─────────────────────────────────────────────────────────────┐
│  משתמש שואל בצ'אט (בעמוד פרויקט או בדשבורד הראשי)            │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  LLM (Claude / Gemini / GPT) עם רשימת כלים זמינים            │
│  - searchTransactions, searchContractors, searchTasks...    │
│  - searchDocumentContent (RAG)                              │
│  - aggregate, compare, summarize                            │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  LLM מחליט: באיזה כלי להשתמש ועם איזה פרמטרים                │
│  לדוגמה: searchTransactions({                                │
│    projectId: "2253",                                       │
│    supplierName: "מ.צ. ריתוכים"                              │
│  })                                                          │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Cloud Function מריץ את הכלי בפועל                            │
│  ─ שאילתת Firestore עם סינון על ownerId                      │
│  ─ אם RAG: vector search ב-document_chunks                  │
│  ─ אם אגרגציה: aggregation pipeline                         │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  התוצאה חוזרת ל-LLM, שמרכיב תשובה בעברית                     │
│  + ציטוטים: לאן ללחוץ לראות את הנתון/מסמך המלא               │
└─────────────────────────────────────────────────────────────┘
```

### רשימת הכלים (Tools) שהסוכן יקבל

#### כלים לחיפוש בנתונים מובנים (Firestore)

```typescript
searchTransactions({
  projectId?: string,           // optional - אם לא צוין, חוצה פרויקטים
  supplierName?: string,        // חיפוש חלקי בשם הספק/קבלן
  category?: string,            // "materials" | "labor" | ...
  dateFrom?: string,
  dateTo?: string,
  amountMin?: number,
  amountMax?: number,
  paymentStatus?: string,
}): Transaction[]

searchContractors({
  projectId?: string,
  name?: string,
  specialty?: string,
  hasOpenBalance?: boolean,
}): Contractor[]

searchTasks({
  projectId?: string,
  status?: "pending" | "in-progress" | "done",
  urgency?: "today" | "this-week" | "later",
  dueBefore?: string,
}): Task[]

searchInventory({
  projectId?: string,
  itemName?: string,
  belowThreshold?: boolean,    // רק פריטים שחסרים
}): InventoryItem[]

searchDocuments({
  projectId?: string,
  category?: "contract" | "invoice" | "permit" | "other",
  uploadedAfter?: string,
  fileNameContains?: string,
}): Document[]
```

#### כלי RAG לחיפוש בתוכן מסמכים

```typescript
searchDocumentContent({
  projectId: string,            // חובה - מבודד לפרויקט
  question: string,             // השאלה בעברית
  documentId?: string,          // אם רוצים בתוך מסמך ספציפי
  topK?: number,                // כמה קטעים לקבל (default: 5)
}): { chunks: Chunk[], citations: Citation[] }
```

#### כלי אגרגציה

```typescript
aggregate({
  collection: "expenses" | "income" | "transactions" | "payments",
  projectId?: string,           // אם לא צוין, על-פני כל הפרויקטים
  groupBy?: "category" | "supplier" | "month" | "project",
  dateFrom?: string,
  dateTo?: string,
  metric: "sum" | "count" | "avg",
}): { groups: Array<{ key: string, value: number }> }

compareProjects({
  projectIds: string[],         // 2-5 פרויקטים להשוואה
  metric: "budget" | "spent" | "progress" | "balance",
  groupBy?: "category" | "month",
}): ComparisonResult
```

#### כלים עתידיים (פעולות כתיבה, פאזה 6)

```typescript
createTask({ projectId, title, dueDate, urgency }): Task
createExpense({ projectId, amount, category, supplierName, date }): Expense
markTaskDone({ taskId }): void
```

> **חשוב**: כלי כתיבה יבקשו אישור מהמשתמש לפני ביצוע - הסוכן לא יוצר/משנה דברים אוטומטית.

### אבטחה

- כל כלי מוסיף `ownerId == request.auth.uid` כסינון חובה לפני שאילתה
- Firestore Rules: גם אם הסוכן יבקש מידע של משתמש אחר, יחזור empty
- כלי RAG בודק שה-projectId שייך למשתמש המבקש לפני ביצוע
- היסטוריית הצ'אט שמורה ב-`chat_messages` עם `ownerId` ו-`projectId` (אם רלוונטי)

### איפה הצ'אט יישב ב-UI

**2 מקומות:**

1. **בדשבורד הראשי** - צ'אט גלובלי, לשאלות חוצות פרויקטים
   - "השווה את 2253 ל-2288"
   - "כמה הוצאתי החודש?"

2. **בעמוד פר-פרויקט** - צ'אט עם הקשר אוטומטי לפרויקט הזה
   - השאלה מועברת עם `projectId` מובנה - הסוכן יודע באיזה פרויקט מדובר
   - "מה המצב עם הקבלן?" - יודע לאיזה פרויקט הוא מתייחס

**UI:**
- כפתור צ'אט קבוע בפינה ימנית-תחתונה (Floating Action Button)
- פותח Drawer צד עם:
  - היסטוריית שיחה
  - שדה שאלה + 4-6 דוגמאות מוצעות
  - תשובות עם ציטוטים שניתנים ללחיצה (פותחות את המסמך/הטרנזקציה)
  - כפתור "התחל שיחה חדשה"

### שאלות RAG מומלצות לכפתורים בצ'אט החוזה הראשי (3.4)

כשהמשתמש פותח את עמוד הפרויקט, הסוכן יזהה את החוזה הראשי (`isPrimaryContract=true`) ויציע 10 שאלות מהירות:

1. "מתי תאריך המסירה הסופי?"
2. "מה תקופת הבדק?"
3. "מה גובה הערבות הבנקאית הנדרשת?"
4. "האם החוזה צמוד למדד? לאיזה?"
5. "מה הסנקציות על פיגור?"
6. "מי המפקח מטעם המזמין?"
7. "מה אחוז העכבון המותר?"
8. "אילו נספחים מצורפים?"
9. "מי האחראי על בטיחות?"
10. "מה תנאי התשלום (שוטף + X)?"

המטרה: בלחיצה אחת לקבל את התשובות הכי שאלות שמנהל פרויקט מחפש בחוזה.

### בחירת ספקים (להחלטה לפני בנייה)

| רכיב | אופציה A (חינמית) | אופציה B (איכותית) | אופציה C (מאוזנת) |
|------|-------------------|--------------------|-------------------|
| **LLM עם Tool Calling** | Gemini 2.0 Flash (חינמי במכסה) | Claude Sonnet 4 / Haiku | GPT-4o-mini |
| **Embeddings** | Voyage AI (200M tokens free) | OpenAI text-embedding-3-small | Cohere Embed Multilingual |
| **Vector DB** | Pinecone Free (100K vectors) | Qdrant Cloud Free | Firestore Vector Search (beta) |
| **תמיכה ב-Tool Calling** | מצוין | מצוין | מצוין |
| **איכות בעברית** | טובה | מצוינת | טובה מאוד |
| **עלות חודשית בשימוש אישי** | **0 ש"ח** | ~$5-10 | ~$3-5 |

**המלצה ראשונית**: התחלה עם **אופציה A** (Gemini Flash 2.0 - חינמי, מהיר, תומך מצוין ב-tool calling).

### מודל נתונים (תוספת ל-Firestore)

```typescript
// אוסף חדש: documents - מסמכים שהועלו
documents/{documentId} {
  ownerId: string,
  projectId: string,
  fileName: string,
  category: "contract" | "invoice" | "permit" | "other",
  storageURL: string,
  fileSize: number,
  uploadedAt: timestamp,
  processingStatus: "pending" | "extracting" | "embedding" | "ready" | "failed",
  pagesCount: number,
  totalChunks: number,
  extractedSupplierName?: string,    // נשלף אוטומטית מטקסט החשבונית
  extractedTotalAmount?: number,
  extractedInvoiceNumber?: string,
  extractedDate?: string,
}

// אוסף חדש: document_chunks - קטעי טקסט עם embeddings
document_chunks/{chunkId} {
  ownerId: string,
  projectId: string,
  documentId: string,
  documentName: string,
  pageNumber: number,
  chunkIndex: number,
  text: string,
  embedding: number[],          // vector 1536 או 1024
}

// אוסף חדש: chat_sessions - שיחות צ'אט
chat_sessions/{sessionId} {
  ownerId: string,
  projectId?: string,            // null = גלובלי מהדשבורד
  title: string,                 // מתעדכן אוטומטית מהשאלה הראשונה
  lastMessageAt: timestamp,
  createdAt: timestamp,
}

// אוסף חדש: chat_messages - הודעות בצ'אט
chat_messages/{messageId} {
  ownerId: string,
  sessionId: string,
  role: "user" | "assistant" | "tool",
  content: string,
  toolCalls?: Array<{ name: string, input: object, output: object }>,
  citations?: Array<{
    type: "document" | "transaction" | "task" | "contractor",
    refId: string,
    label: string,
    snippet?: string,
  }>,
  createdAt: timestamp,
}
```

### Cloud Functions חדשות

```typescript
// Function 8: processUploadedDocument
// Triggered: על העלאת קובץ ל-Storage
async function processUploadedDocument(file: StorageFile) {
  // 1. extract text
  // 2. chunk
  // 3. embed
  // 4. save to Firestore + Vector DB
  // 5. if invoice - extract structured data (supplier, amount, date)
}

// Function 9: agentChat (HTTPS Callable)
// Triggered: כשהמשתמש שולח שאלה
async function agentChat(req: {
  sessionId: string,
  projectId?: string,
  message: string,
}) {
  // 1. load history
  // 2. send to LLM with available tools
  // 3. LLM may decide to call tools
  // 4. execute tools (with ownerId filter!)
  // 5. send tool results back to LLM
  // 6. final answer + save to chat_messages
}

// כלי 1: searchTransactions (לא Cloud Function בפני עצמו - חלק מ-agentChat)
// כלי 2-N: ...
```

### עלויות חזויות (אופציה A - Gemini Flash 2.0 חינמי)

| תרחיש | חישוב | עלות |
|-------|------|------|
| 50 חוזים, 30 עמ׳ כל אחד = 1500 עמ׳ | ~750K tokens × Voyage free tier | ₪0 |
| 200 שאלות בחודש × 3 tool calls בממוצע | ~600 קריאות ל-Gemini Flash << 1500/day free | ₪0 |
| אחסון Vector DB | ~15K vectors << 100K free | ₪0 |
| **סה"כ לחודש** | | **₪0** |

המכסות החינמיות של Gemini Flash 2.0 הן 1500 בקשות ביום ו-1M tokens בחודש. אם תחרוג - העלות עדיין זניחה (~₪10/חודש בשימוש כבד).

### שלבי פיתוח (פאזה 5)

1. **Phase 5A**: העלאה ואחסון מסמכים (Storage + UI) - שבוע
2. **Phase 5B**: pipeline עיבוד (חילוץ טקסט + embeddings + Vector DB) - שבוע
3. **Phase 5C**: כלי Firestore (searchTransactions וכו') - שבוע
4. **Phase 5D**: סוכן + LLM integration + UI צ'אט - שבוע
5. **Phase 5E**: כלי כתיבה (createTask, createExpense) - שבוע

---

## 10. אינטגרציה עם Priority

> ה-IT לא נותן הרשאת API. הפתרון: ייצוא ידני מפריוריטי ל-Excel → העלאה לאפליקציה.

### הליך עבודה
1. בפריוריטי, בכל מסך רלוונטי - קליק ימני → "שלח ל-Excel"
2. שמירה במחשב
3. ב-אפליקציה: מסך "ייבוא" → "מפריוריטי" → בחירת סוג הדוח → העלאת הקובץ
4. Cloud Function מבצעת המרה ו-UPSERT לאוסף המתאים

### דוחות שכדאי לייצא
- לקוחות + יתרות
- ספקים + יתרות
- חשבוניות הוצאה והכנסה
- תקבולים ותשלומים

### תזכורת אוטומטית
Cloud Function שולחת התראה כל בוקר אם לא בוצע ייבוא ב-24 השעות האחרונות.

### תוספת אופציונלית - דוחות מתוזמנים מפריוריטי
אם מנהל הפריוריטי בארגון מסכים להגדיר דוחות מתוזמנים שנשלחים למייל - אפשר להוסיף Function שמאזינה למייל ה-**אישי** שלך (לא הארגוני!) ומסנכרנת אוטומטית. דורש שהדוחות יישלחו לכתובת הפרטית שלך.

---

## 11. אינטגרציה עם לוחות שנה

### Google Calendar (חשבון אישי)
- OAuth דרך Firebase Authentication (Google Sign-In)
- אותו אסימון משמש גם לקריאת/כתיבת אירועים
- שילוב חלק, אין מסובך

### Outlook Calendar (חשבון אישי, לא ארגוני!)
- OAuth דרך Microsoft Identity Platform
- **חשוב**: רישום אפליקציה ב-Azure תחת חשבון Microsoft **אישי** שלך (לא של החברה)
- שימוש ב-Microsoft Graph API לקריאת/כתיבת אירועים

### דגלי סנכרון
- כל משימה עם `dueDate` תיצור אירוע ב-**שני** הלוחות (אם שניהם מחוברים)
- אירוע ביומן עם תג "Project" → ייצור משימה תואמת
- מניעת כפילות: שדות `googleCalendarEventId` ו-`outlookCalendarEventId` במשימה

---

## 12. שלבי פיתוח

### Phase 0 - הכנות (משימות שלך) ⏳
- [x] בחירת ארכיטקטורה - **הושלם**
- [ ] פתיחת/וידוא חשבונות אישיים:
  - [ ] GitHub (אם אין - לפתוח על מייל פרטי)
  - [ ] Firebase (יש - לוודא שבחשבון Google **פרטי**)
  - [ ] חשבון Microsoft אישי (להמשך - לסנכרון Outlook)
- [ ] יצירת Firebase Project חדש בקונסולה (`firebase-project-mgmt` או דומה)
- [ ] **השארת ה-Project ב-Spark Plan** (ברירת המחדל) - לא לחבר כרטיס אשראי
- [ ] (אופציונלי) הגדרת התראות מייל ב-Firebase Console למצב בו השימוש מתקרב ל-80% מהמכסה - כדי שנדע מראש

### Phase 1 - תשתית (סשן הבא) 🛠️
- [ ] יצירת מבנה פרויקט Next.js 15 + TypeScript + Tailwind + shadcn/ui
- [ ] קונפיגורציית RTL וטיפוגרפיה עברית (Heebo / Rubik)
- [ ] חיבור Firebase Auth (Google Sign-In)
- [ ] הגדרת Firestore + העלאת חוקי האבטחה
- [ ] בניית מודלי TypeScript תואמים לסכמה
- [ ] עמוד לוגין + דשבורד ריק
- [ ] פריסה ל-Firebase Hosting (כתובת `your-project.web.app`)

### Phase 2 - מודולים בסיסיים
- [ ] CRUD לפרויקטים (יצירה, עריכה, מחיקה, צפייה)
- [ ] CRUD להוצאות + הכנסות
- [ ] CRUD לקבלנים + ספקים
- [ ] CRUD לתשלומים

### Phase 3 - העלאת Excel
- [ ] Cloud Function `parseExcelOnUpload`
- [ ] UI להעלאה ולחיווי התקדמות
- [ ] תבניות Excel לדוגמה לתחום תשתיות אנרגיה (build_budget.py הישן בריפו לא רלוונטי — היה לבנייה פרטית)

### Phase 4 - כתב כמויות + לוח זמנים + משימות
- [ ] מסך BoQ עם תצוגה היררכית
- [ ] מסך משימות עם 3 תצוגות (רשימה / קנבן / יומן)
- [ ] מסך לוח זמנים עם גאנט

### Phase 5 - אינטגרציות יומן
- [ ] חיבור Google Calendar
- [ ] חיבור Outlook (חשבון אישי)
- [ ] Functions לסנכרון דו-כיווני

### Phase 6 - דשבורד KPI + Polish
- [ ] גרפים ב-Recharts
- [ ] PWA Manifest + Service Worker (להתקנה כאפליקציה)
- [ ] התראות Push
- [ ] תיעוד שימוש

### Phase 7 - הרחבות (אופציונליות)
- [ ] סנכרון אוטומטי מ-OneDrive אישי
- [ ] OCR לחשבוניות (דרך Google Vision API - בתשלום, אופציונלי)
- [ ] ייצוא דוחות PDF
- [ ] Mobile app ילידית (React Native) - רק אם PWA לא מספיק

### Phase 8 - מודולים נוספים לתחום (אחרי שהבסיס יציב)
מודולים שזוהו כחיוניים לעבודה של מנהל פרויקטים בתשתיות אנרגיה (ראה סעיף 1.5):

- [ ] **מכרזים והצעות מחיר** — שלב מקדים לפרויקט (שלבים 1-4 במחזור החיים).
  - אוסף `tenders/` — סכמה מפורטת בסעיף 6.
  - מעקב אחרי מכרזים שלסיכו שוקלת / מכינה / הגישה.
  - סטטוס: evaluating / preparing / submitted / won / lost / cancelled.
  - תזכורת אוטומטית לפני `submissionDeadline`.
  - אם זוכים: יצירת אוטומטית של `projects/` עם `tenderId` מקושר.

- [ ] **הזמנות רכש (Purchase Orders) + מעקב long lead items** — קריטי לתחום.
  - אוסף `purchase_orders/` — סכמה מפורטת בסעיף 6.
  - דגל `isLongLeadItem` יוצר כרטיס בולט בדשבורד הראשי.
  - תזכורות לפני `expectedDeliveryDate`.
  - חיווי על עיכובים (delta בין expected ל-actual).
  - כשהחשבונית מתקבלת — קישור ל-`expenses/{expenseId}` דרך `linkedPurchaseOrderId`.

- [ ] **ניהול כוח אדם ושעות עבודה** — אוסף `timesheets/`.
  - מעקב אחרי שעות צוות פנימי וקבלני משנה.
  - אינטגרציה עם `tasks/` ו-`schedule_items/`.

- [ ] **הפקת PDF של חשבון חלקי** — מ-`boq_revisions/` להגשה רשמית למזמין.

---

## 13. מה אני יכול ומה אני לא יכול לעשות

### מה אני יכול לעשות בסשנים הבאים
- ✅ לכתוב את כל הקוד של ה-Frontend (React/Next.js, TypeScript)
- ✅ לכתוב את כל ה-Cloud Functions (Node.js/TypeScript)
- ✅ לכתוב חוקי Firestore Security
- ✅ לכתוב סקריפטי הגדרה ופריסה
- ✅ לכתוב תבניות Excel מותאמות
- ✅ לכתוב מדריכי step-by-step לפרסום
- ✅ לדבג בעיות אם תעלה לוגים

### מה אני לא יכול לעשות
- ❌ להיכנס לחשבון Firebase שלך ולהקים את הפרויקט במקומך
- ❌ לחבר את GitHub שלך ל-Vercel - אתה תעשה (5 דקות)
- ❌ להזין סודות API ב-Vercel - אתה תעשה
- ❌ לבנות אפליקציית מובייל ילידית (אבל PWA מספיק עבור 99% מהצרכים)

### מה אתה צריך לדעת על מה שתעשה
- כל סשן בונה משהו → אתה מבצע commit + push → אתה לוחץ "Deploy" ב-Vercel
- אם משהו לא עובד → תשלח לי screenshot/error log → אני אתקן בסשן הבא
- שאלות לאורך הדרך → שאל, אני כאן

---

## 14. שאלות פתוחות

### נענו ✅ (במצטבר עד גרסה 3.4)
1. **שם הפרויקט** ← **PM ATUAN**
2. **דומיין** ← **Firebase Hosting חינמי**, יעד: `pm-atuan.web.app` (זמני: `pm-dashboard-avichai.web.app`)
3. **שמות פרויקטים** ← שמות/מספרים חופשיים, פורמט דמו `2253` / `2288` / `2306`
4. **מטבעות** ← **3 מטבעות**: ש"ח (default), דולר, יורו. שדות `currency`, `exchangeRateToILS`, `amountInILS`.
5. **גישה משותפת בעתיד** ← לא בקרוב. `ownerId` נשמר במודל כהכנה.
6. **דוגמת Excel** ← בסבב הבא — קבצים שיתקבלו: מעקב הוצאות פר פרויקט, תזרים מזומנים / רווח-הפסד פר פרויקט.
7. **מחזור חיים של פרויקט** ← 13 שלבים (סעיף 1.6).
8. **המעורבים בפרויקט טיפוסי** ← `clients/` נפרד עם `clientType` (end_client / main_contractor / both). תמיכה בשתי תצורות תפקיד דרך `ourRole`.
9. **גודל ומשך פרויקט טיפוסי** ← תיעוד מורחב בסבב הבא, אך המבנה גמיש לכל גודל.
10. **פעולות יומיומיות** ← מוקד הליבה: ניהול קבצים + AI חוזים + דשבורד פיננסי + תזכורות (סעיף 3).
11. **מבנה כתב כמויות** ← 15 עמודות תקן ישראלי, היררכיה 4 רמות, snapshot ב-`boq_revisions/`.
12. **דוגמת חוזה** ← לסבב הבא; שדה `contractMetadata` ב-`documents/` מוכן לחילוץ.

### החלטות שנפלו ב-3.4 (סיכום ל-trace)
1. שם האפליקציה: **PM ATUAN**
2. דומיין: **Firebase Hosting חינמי** (`pm-atuan.web.app`)
3. מטבעות: **ש"ח + דולר + יורו**
4. מוקד: ניהול קבצים + AI על חוזים + דשבורד פיננסי + תזכורות
5. הסכמה תומכת בשתי תצורות (לסיכו=ראשי / משנה) דרך `ourRole`
6. כתב כמויות = חשבון חלקי. snapshot ב-`boq_revisions/`
7. היררכיה 4 רמות בקוד הסעיף (`XX.YY.ZZ.NNN`)
8. סוג שורה "הערה" קיים ואינו חייב בתשלום
9. `category` / `specialty` = **free text**, לא enum
10. שלב "המתנה לאספקה" עומד בפני עצמו - long lead items בולטים בדשבורד
11. אוסף `clients/` נפרד עם `clientType`
12. מסמכים: היברידי - חוזים + חשבוניות באפליקציה, תכניות ב-Drive
13. מכרז + הצעה + חוזה באוסף אחד (`project_documents/`) עם `type`
14. הקובץ עם `isPrimaryContract=true` הוא ה"חוזה הראשי" (סיכום אוטומטי, ברירת מחדל ל-AI)
15. ניהול גרסאות תכניות: ידנית ע"י המשתמש, האפליקציה רק קישור
16. שיתוף עם צוות: **לא ל-MVP**. `ownerId` נשמר כהכנה
17. MVP: ניהול פרויקטים + מסמכים + AI חוזים + דשבורד KPI

### קבצים שיגיעו בסבב הבא לעדכון נוסף
- קובץ Excel של מעקב הוצאות פר פרויקט (לאישור מבנה `expenses.xlsx`)
- קובץ Excel של תזרים מזומנים / רווח-הפסד פר פרויקט (לאישור מבנה דשבורד)
- PDF של חוזה מטושטש (לבחינת `contractMetadata` ולחידוד שאלות RAG)

### שאלות מינוריות שעוד פתוחות
1. **יומן פרויקט (notes יומי)** — מודול בסיסי או רק שדה במשימות? — להחליט אחרי שנראה איך מתנהל יומיומית.
2. **הפקת PDF של חשבון חלקי מ-Firestore** להגשה רשמית למזמין — Phase מאוחר אחרי שהבסיס יציב.
3. **גרסאות תכניות AutoCAD** — נשאר ידני? או UI מובנה לניהול גרסאות? — להחליט אחרי שנראה כמה גרסאות בפועל.

---

## 15. רשימת הקבצים בריפו

| קובץ | תיאור | סטטוס |
|---|---|---|
| `PLAN.md` | המסמך הזה - הספק הראשי | קיים, מתעדכן |
| `build_budget.py` | סקריפט Python ליצירת תבנית תקציב | קיים (legacy מסשן קודם — היה לבנייה פרטית, לא רלוונטי לדומיין הנוכחי) |
| `תקציב_בניית_בית_פרטי.xlsx` | קובץ תקציב לדוגמה | קיים (legacy — לא רלוונטי) |
| `app/` | קוד Next.js + Firebase integration | קיים, באוויר ב-Firebase Hosting |
| `firebase.json` | תצורת Hosting + Firestore | קיים |
| `firestore.rules` | חוקי אבטחה (ownerId-based) | קיים, לא נדחף עדיין ל-Firebase (חסרה הרשאה ל-SA) |
| `firestore.indexes.json` | אינדקסים | קיים, ריק |
| `.firebaserc` | project = pm-dashboard-avichai | קיים |
| `app/.env.local.example` | תבנית של 6 משתני סביבת Firebase | קיים |
| `app/.env.local` | ערכים אמיתיים | קיים (gitignored) |

קבצים שיתווספו בסשנים הבאים:
- `app/` - קוד Next.js
- `functions/` - קוד Cloud Functions
- `firestore.rules` - חוקי אבטחה
- `firestore.indexes.json` - אינדקסים של Firestore
- `excel_templates/` - תבניות Excel
- `scripts/` - סקריפטי הגדרה ופריסה
- `docs/` - מדריכי שימוש
