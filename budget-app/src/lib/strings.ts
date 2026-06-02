/** כל מחרוזות הממשק במקום אחד — מקל על הרחבה רב-לשונית בעתיד. */
export const t = {
  appName: "כלכלת בית",
  appShort: "כלכלת בית",
  tagline: "ניהול הכנסות והוצאות למשפחה",

  // ניווט
  nav: {
    dashboard: "סקירה",
    transactions: "תנועות",
    budgets: "תקציב",
    reports: "דוחות",
    forecast: "צפי",
    settings: "הגדרות",
    logout: "התנתקות",
  },

  // אימות
  auth: {
    login: "התחברות",
    signup: "הרשמה",
    email: "אימייל",
    password: "סיסמה",
    displayName: "שם תצוגה",
    loginCta: "התחבר",
    signupCta: "צור חשבון",
    noAccount: "אין לך חשבון?",
    haveAccount: "כבר יש לך חשבון?",
    checkEmail: "שלחנו אליך אימייל לאישור החשבון. אנא אשר ולאחר מכן התחבר.",
  },

  // כללי
  common: {
    income: "הכנסה",
    expense: "הוצאה",
    amount: "סכום",
    category: "קטגוריה",
    date: "תאריך",
    note: "הערה",
    type: "סוג",
    save: "שמירה",
    cancel: "ביטול",
    add: "הוספה",
    edit: "עריכה",
    delete: "מחיקה",
    confirmDelete: "למחוק?",
    total: "סה״כ",
    balance: "מאזן",
    remaining: "נותר",
    spent: "נוצל",
    none: "—",
    loading: "טוען...",
    empty: "אין נתונים להצגה",
  },
} as const;
