# מסמך תכנון - דשבורד ניהול פרויקטים אישי

> מסמך זה הוא הספק (Specification) המנחה לבניית האפליקציה בסשנים הבאים.
> כל שינוי בדרישות צריך לעדכן את המסמך הזה לפני בניית קוד.
>
> **גרסה**: 3.1 (הוספת מודול ניהול חוזים + צ'אט AI מבוסס RAG פר-פרויקט)
> **תאריך עדכון**: 2026-05-15

---

## 1. תקציר מנהלים

**מה בונים**: אפליקציית web אישית (PWA) לניהול פרויקטים. דשבורד מרכזי שמרכז:
- נתונים פיננסיים מקובצי Excel (הוצאות, הכנסות, תשלומים לקבלנים/ספקים, כתבי כמויות)
- נתונים שיובאו מ-Priority (ייצוא Excel ידני, כי אין הרשאת API)
- מיילים רלוונטיים מ-Outlook (לעתיד)
- משימות ולוח זמנים פר-פרויקט
- אירועי לוח שנה (Outlook + Google Calendar)

**עבור מי**: משתמש יחיד (בעל המסמך) - **על חשבונות פרטיים, לא ארגוניים**.

**איפה זה רץ**: מחשב נייח, מחשב נייד, טאבלט, נייד - דרך הדפדפן (PWA, ניתן להתקין למסך הבית).

**טכנולוגיה**: Next.js (Frontend) + Firebase (Backend + Hosting).

**עלות**: **0 ש"ח לתמיד** - Firebase Spark Plan (חינמי, ללא כרטיס אשראי).

**אסטרטגיית חיוב**: נשארים ב-**Spark Plan** (החינמי). אין סיכון תשלום כלל - אם נחרוג מהמכסה, השירות עוצר עד איפוס יומי (00:00 פסיפיק). הנתונים בטוחים תמיד.

**שדרוג עתידי** (רק אם נצטרך): אם יום אחד נראה שהמכסות לוחצות בפועל - אז נשקול מעבר ל-Blaze עם תקרת תקציב. עד אז - לא נוגעים בכרטיס אשראי.

**פרטיות**: מוחלטת. לא ארגונית. החשבונות הם אישיים. המעסיק לא יכול לראות שום דבר.

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
- [ ] ניהול מסמכים (PDF/Excel/תמונות)

### דרישות לא-פונקציונליות
- אפס עלות נוספת
- פרטיות מלאה מהמעסיק
- בעלות מלאה על הקוד והנתונים
- נגישות מכל מכשיר ללא התקנת אפליקציה ייעודית
- אבטחה (אימות, הצפנה במעבר, גיבוי אוטומטי)

### מודולים ל-MVP
1. סקירת פרויקט - דשבורד עם KPIs
2. הוצאות והכנסות
3. תשלומים לקבלנים וספקים
4. כתבי כמויות + לוח זמנים + משימות
5. **ניהול חוזים ומסמכי פרויקט** - תיקייה ייעודית לחוזי כל פרויקט
6. **צ'אט AI מבוסס חוזים (RAG)** - שואלים שאלות על תוכן החוזים בעברית

### מודולים עתידיים
- אינטגרציה עם Outlook Mail
- ניהול מסמכי בטיחות (מעבר לחוזים)
- דוחות PDF להפקה
- OCR אוטומטי לחשבוניות (יכול להשתלב עם תשתית ה-AI שכבר תהיה)

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
│   └── {displayName, email, settings, ...}
│
├── projects/{projectId}
│   └── {ownerId, name, client, status, budget, progress, ...}
│
├── expenses/{expenseId}
│   └── {ownerId, projectId, date, category, amount, ...}
│
├── income/{incomeId}
│   └── {ownerId, projectId, date, amount, ...}
│
├── contractors/{contractorId}
│   └── {ownerId, name, phone, contractTotal, ...}
│
├── suppliers/{supplierId}
│   └── {ownerId, name, phone, category, ...}
│
├── payments/{paymentId}
│   └── {ownerId, projectId, payeeType, payeeId, amount, ...}
│
├── boq_items/{itemId}
│   └── {ownerId, projectId, section, itemNumber, qty, ...}
│
├── tasks/{taskId}
│   └── {ownerId, projectId, title, status, dueDate, ...}
│
├── schedule_items/{itemId}
│   └── {ownerId, projectId, name, startDate, endDate, ...}
│
└── documents/{documentId}
    └── {ownerId, projectId, fileName, storageURL, type, ...}
```

> **למה ברמת השורש ולא תת-אוספים תחת projects**? קל יותר לעשות שאילתות חוצות פרויקטים (לדוגמה "כל המשימות הקרובות בכל הפרויקטים"). מצד שני נצטרך לסנן ידנית לפי projectId, אבל זה זול.

### שדה `ownerId` בכל מסמך
חוקי האבטחה (Firestore Rules) יבדקו ש-`ownerId == request.auth.uid` בכל קריאה. ככה אם בעתיד יצטרף משתמש - הוא לא יראה את הנתונים שלך.

### פירוט שדות פר אוסף

#### `projects/{projectId}`
```typescript
{
  ownerId: string,            // uid שלך
  name: string,               // שם הפרויקט
  client: string,             // שם הלקוח
  status: 'active' | 'paused' | 'completed' | 'cancelled',
  startDate: timestamp,
  endDate: timestamp | null,
  budget: number,             // תקציב בש"ח
  actualSpent: number,        // מחושב מ-expenses (אגרגציה ב-Cloud Function)
  progressPercent: number,    // 0-100
  oneDriveFolderURL: string?, // קישור לתיקייה ב-OneDrive
  priorityCode: string?,      // קוד הפרויקט בפריוריטי (אם רלוונטי)
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `expenses/{expenseId}`
```typescript
{
  ownerId: string,
  projectId: string,          // הפרויקט אליו שייכת
  date: timestamp,            // תאריך ההוצאה
  category: 'materials' | 'labor' | 'subcontractor' | 'equipment' | 'other',
  description: string,
  amount: number,             // לפני מע"מ
  vat: number,                // מע"מ
  amountWithVat: number,      // מחושב
  invoiceNumber: string?,
  invoiceDate: timestamp?,
  supplierId: string?,        // קישור לאוסף suppliers
  paymentStatus: 'pending' | 'partial' | 'paid' | 'cancelled',
  paidDate: timestamp?,
  sourceFile: string?,        // אם בא מ-Excel
  sourceRow: number?,         // השורה ב-Excel המקורי (לזיהוי שינויים)
  attachments: string[],      // URLs ל-Firebase Storage
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
  client: string,
  description: string,
  amount: number,
  vat: number,
  invoiceNumber: string,
  status: 'invoiced' | 'partial' | 'paid',
  paidDate: timestamp?,
  sourceFile: string?,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `contractors/{contractorId}`
```typescript
{
  ownerId: string,
  name: string,
  contactPerson: string?,
  phone: string?,
  email: string?,
  specialty: string,          // חשמל / אינסטלציה / שלד / גמר / ...
  contractTotal: number,      // סך החוזה
  totalPaid: number,          // מחושב (Cloud Function)
  balance: number,            // מחושב = contractTotal - totalPaid
  notes: string,
  linkedProjects: string[],   // מערך של projectIds
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
  category: 'building_materials' | 'tools' | 'services' | 'other',
  paymentTerms: string,       // לדוגמה "שוטף + 30"
  totalPaid: number,          // מחושב
  openBalance: number,        // מחושב
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
  amount: number,
  paymentMethod: 'transfer' | 'cheque' | 'cash' | 'card',
  paymentDate: timestamp,
  chequeNumber: string?,
  confirmationNumber: string?,
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `boq_items/{itemId}`
```typescript
{
  ownerId: string,
  projectId: string,
  section: string,            // "5. שלד ובטון"
  itemNumber: string,         // "5.1.3"
  description: string,
  unit: string,               // מ"ר, מ"ק, יח'
  plannedQuantity: number,
  unitPrice: number,
  plannedTotal: number,       // מחושב = qty * unitPrice
  actualQuantity: number,
  completionPercent: number,
  contractorId: string?,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

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

#### `documents/{documentId}`
```typescript
{
  ownerId: string,
  projectId: string,
  fileName: string,
  storageURL: string,         // ב-Firebase Storage
  fileSize: number,
  mimeType: string,
  type: 'contract' | 'invoice' | 'approval' | 'plan' | 'other',
  tags: string[],
  uploadedAt: timestamp
}
```

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
- טאבים: סקירה / הוצאות / הכנסות / קבלנים / ספקים / כתב כמויות / לוח זמנים / משימות / מסמכים
- כל טאב מסונן אוטומטית ל-projectId הנוכחי

### מסך 4 - הוצאות והכנסות (`/finance`)
- 2 לשוניות: הוצאות / הכנסות
- תצוגות: רשימה / גרפים / לוח זמני (timeline)
- העלאת Excel ידנית

### מסך 5 - קבלנים וספקים (`/parties`)
- 2 לשוניות: קבלנים / ספקים
- כרטיסיה לכל אחד עם יתרה פתוחה
- כפתור "צור תשלום"

### מסך 6 - כתב כמויות (`/boq`)
- בחירת פרויקט בראש
- טבלה היררכית (פרק → סעיף)
- עמודות: מתוכנן/בפועל, אחוז ביצוע, עלות

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
| date | category | description | amount | vat | invoice_number | invoice_date | supplier_name | payment_status |
|---|---|---|---|---|---|---|---|---|

**income.xlsx**
| date | client | description | amount | vat | invoice_number | status |
|---|---|---|---|---|---|---|

**payments.xlsx**
| project_name | payee_type | payee_name | invoice_number | amount | payment_method | payment_date |
|---|---|---|---|---|---|---|

**boq.xlsx**
| section | item_number | description | unit | quantity | unit_price |
|---|---|---|---|---|---|

תבניות פעמיות יופקו ב-Phase 1.

### סנכרון אוטומטי מ-OneDrive אישי (לעתיד)
- חיבור OAuth עם חשבון Microsoft אישי
- Function שמאזינה לתיקייה ב-OneDrive האישי
- כשמעדכנים קובץ → קוראת ומסנכרנת אוטומטית
- **לא ל-MVP** - תוספת אחרי שהבסיס יציב

---

## 9.5 ניהול חוזים + צ'אט AI לפר-פרויקט (RAG)

> כל פרויקט מקבל תיקייה ייעודית למסמכי חוזים, וצ'אט AI שיודע לענות על שאלות מבוססות תוכן החוזים של אותו פרויקט בלבד.

### דרישה משתמש
- כל פרויקט יציג tab "חוזים" עם רשימת מסמכים (PDF/Word)
- צ'אט בעמוד הפרויקט. שואלים שאלות כמו:
  - "כמה התשלום השלישי לקבלן השלד?"
  - "מתי תאריך מסירת הגמרים?"
  - "האם יש סעיף קנס על איחור?"
  - "מי חתום על חוזה החשמל ומה תאריך החתימה?"
- התשובה מצביעה על המסמך והעמוד שממנו נשלפה (Citations)
- הצ'אט מוגבל אך ורק לחוזים של אותו פרויקט - לא דולף מידע בין פרויקטים

### ארכיטקטורת RAG (Retrieval Augmented Generation)

```
┌──────────────────────────────────────────────────────────────┐
│  1. INGESTION - העלאת חוזה                                    │
│  אתה גורר PDF לתיקיית "חוזים" של פרויקט 2253                  │
│  (מתוך האפליקציה, או דרך Drive/OneDrive מסונכרן)              │
└────────────────────┬─────────────────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  2. PROCESSING - Cloud Function אוטומטית                      │
│  ─ חילוץ טקסט (pdf-parse לטקסט, Vision API אם סרוק)          │
│  ─ Chunking - חיתוך ל-קטעים של ~500 מילים עם חפיפה            │
│  ─ Embeddings - יצירת וקטור 1536-מימדי לכל chunk              │
│  ─ אחסון: Firestore + Vector DB עם tag projectId="2253"      │
└────────────────────┬─────────────────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  3. QUERY - אתה שואל בצ'אט בעמוד פרויקט 2253                  │
│  "מתי הקבלן צריך לסיים את השלד?"                              │
└────────────────────┬─────────────────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  4. RETRIEVAL                                                 │
│  ─ embedding לשאלה                                           │
│  ─ vector similarity search - מסונן רק ל-projectId="2253"    │
│  ─ TOP-5 chunks הכי רלוונטיים                                │
└────────────────────┬─────────────────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  5. GENERATION - LLM (Claude/Gemini/GPT)                     │
│  ─ פרומפט מובנה: "ענה בעברית רק על-פי הקטעים. אם אין מידע    │
│     מספיק - אמור 'לא מצאתי בחוזים'. צטט את המקור."           │
│  ─ הצגת התשובה + רשימת מקורות (מסמך + עמוד)                  │
└──────────────────────────────────────────────────────────────┘
```

### אבטחה - הפרדה בין פרויקטים
- כל chunk ב-Vector DB מתויג ב-`projectId`
- שאילתה תמיד מסננת לפי `projectId` של הפרויקט הפעיל
- Firestore Rules: רק `ownerId == request.auth.uid` רואה גם את המסמכים וגם את ה-chunks
- הצ'אט לא יכול "לדלוף" מידע בין פרויקטים גם אם הניסוח של השאלה מבולבל

### בחירת ספקים (להחלטה לפני בנייה)

| רכיב | אופציה A (חינמית) | אופציה B (איכותית) | אופציה C (מאוזנת) |
|------|-------------------|--------------------|-------------------|
| **Embeddings** | Voyage AI (200M tokens free) | OpenAI text-embedding-3-small | Cohere Embed Multilingual |
| **Vector DB** | Pinecone Free (100K vectors) | Qdrant Cloud Free | Firestore Vector Search (beta) |
| **LLM** | Gemini 2.0 Flash (חינמי במכסה) | Claude Haiku (~$0.25/1M tokens) | GPT-4o-mini (~$0.15/1M tokens) |
| **עלות חודשית בשימוש אישי** | **0 ש"ח** | ~$3-5 | ~$2-3 |
| **איכות בעברית** | טובה | מצוינת | טובה מאוד |

**המלצה ראשונית**: התחלה עם **אופציה A** (חינמית, גם זה עובד טוב לעברית) - אם האיכות לא מספקת, מעבר ל-C או B במחיר זניח. בכל מקרה - לא lock-in, פשוט להחליף ספק LLM.

### מודל נתונים (תוספת ל-Firestore)

```typescript
// אוסף חדש: documents - מסמכים שהועלו
documents/{documentId} {
  ownerId: string,
  projectId: string,
  fileName: string,          // "חוזה_קבלן_שלד.pdf"
  category: "contract" | "invoice" | "permit" | "other",
  storageURL: string,        // Firebase Storage path
  fileSize: number,          // bytes
  uploadedAt: timestamp,
  processingStatus: "pending" | "extracting" | "embedding" | "ready" | "failed",
  pagesCount: number,
  totalChunks: number,
  totalCost: number,         // לעקוב אחרי עלות ה-embedding
}

// אוסף חדש: document_chunks - קטעי טקסט עם embeddings
document_chunks/{chunkId} {
  ownerId: string,
  projectId: string,         // לסינון מהיר!
  documentId: string,
  documentName: string,      // duplicate לתצוגת מקור
  pageNumber: number,
  chunkIndex: number,        // סדר בתוך המסמך
  text: string,              // הטקסט עצמו
  embedding: number[],       // vector של 1536 מספרים (או 1024)
}

// אוסף חדש: chat_messages - היסטוריית צ'אטים
chat_messages/{messageId} {
  ownerId: string,
  projectId: string,         // צ'אט נפרד לכל פרויקט
  role: "user" | "assistant",
  content: string,
  citations: Array<{
    documentId: string,
    documentName: string,
    pageNumber: number,
    snippet: string,
  }>,
  createdAt: timestamp,
}
```

### Cloud Functions חדשות

```typescript
// Function 8: processUploadedDocument
// Triggered: כשמועלה מסמך חדש ל-Storage תחת documents/{userId}/{projectId}/
// פעולה: חילוץ טקסט → chunking → embeddings → שמירה
async function processUploadedDocument(file: StorageFile) { ... }

// Function 9: ragChatQuery
// Triggered: HTTP callable מה-frontend כשהמשתמש שואל שאלה
// פעולה: embedding לשאלה → vector search → LLM prompt → תשובה + citations
async function ragChatQuery(req: { projectId, question, history }) { ... }
```

### עלויות חזויות (אופציה A - חינמית)

| תרחיש | חישוב | עלות |
|-------|------|------|
| 50 חוזים, 30 עמ' כל אחד = 1500 עמ' | ~750K tokens × Voyage free | ₪0 |
| 100 שאלות בחודש | ~30K input tokens × Gemini free quota | ₪0 |
| אחסון Vector DB | ~15K vectors << 100K free | ₪0 |
| **סה"כ לחודש** | | **₪0** |

הגבלות המסלול החינמי לא יחרגו עד שתהיה לך כמות פרויקטים פי 10 מהיום.

### UI - איפה החוזים והצ'אט יישבו

**בעמוד פרויקט פר-פרויקטי, יתווספו 2 רכיבים:**
1. **Tab "חוזים"** (לצד "סקירה", "פיננסי" וכו') - גריד של PDFs עם תאריך, גודל, וסטטוס עיבוד
2. **כפתור צ'אט קבוע** (פינה ימנית למטה) - פותח Drawer עם:
   - היסטוריית שיחות עם הפרויקט הזה
   - שדה שאלה
   - תשובה + רשימת ציטוטים (לחיצה פותחת את המסמך באותו עמוד)

### שלבי פיתוח

זה לא נכלל ב-MVP הראשון. הוספה בפאזה 5:
1. **Phase 5A**: העלאה ואחסון מסמכים (Storage + UI להעלאה) - שבוע
2. **Phase 5B**: pipeline עיבוד (Cloud Function + chunking + embeddings) - שבוע
3. **Phase 5C**: צ'אט UI + RAG query - שבוע

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
- [ ] תבניות Excel לדוגמה (פיתוח על בסיס `build_budget.py` הקיים)

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

1. **שם הפרויקט** באפליקציה (לדוגמה "Aviproject", "Atuan PM", "מנהל הפרויקטים")?
2. **דומיין** - תרצה לקנות דומיין אישי (לדוגמה `mypm.dev` ב-$10/שנה) או להתחיל עם תת-דומיין של Vercel חינמי?
3. **שמות פרויקטים** - יש קונבנציית מיספור (P-2026-001) או שמות חופשיים?
4. **מטבעות** - רק ש"ח, או צריך גם דולר/יורו?
5. **גישה משותפת בעתיד** - האם בעתיד יצטרפו עוד משתמשים? אם כן, כמה?
6. **דוגמת Excel** - תוכל להעלות דוגמא של קובץ אקסל אחד שאתה משתמש בו היום (אפילו מטושטש)?

---

## 15. רשימת הקבצים בריפו

| קובץ | תיאור | סטטוס |
|---|---|---|
| `PLAN.md` | המסמך הזה - הספק הראשי | קיים, מתעדכן |
| `build_budget.py` | סקריפט Python ליצירת תבנית תקציב | קיים (מסשן קודם) |
| `תקציב_בניית_בית_פרטי.xlsx` | קובץ תקציב לדוגמה | קיים |

קבצים שיתווספו בסשנים הבאים:
- `app/` - קוד Next.js
- `functions/` - קוד Cloud Functions
- `firestore.rules` - חוקי אבטחה
- `firestore.indexes.json` - אינדקסים של Firestore
- `excel_templates/` - תבניות Excel
- `scripts/` - סקריפטי הגדרה ופריסה
- `docs/` - מדריכי שימוש
