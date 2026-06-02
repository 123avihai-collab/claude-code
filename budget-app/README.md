# כלכלת בית — אפליקציית ניהול הכנסות והוצאות

אפליקציית Web (PWA) בעברית (RTL) לניהול הכנסות, הוצאות, תקציב חודשי ודוחות
למשק בית. נתונים נשמרים בענן עם חשבון אישי (התחברות/הרשמה).

## טכנולוגיות
- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS v4** (RTL)
- **Supabase** — Postgres, Auth ו-Row Level Security
- **Recharts** — גרפים · **SheetJS (xlsx)** — ייבוא/ייצוא Excel/CSV
- **PWA** — ניתן להתקנה בנייד (manifest + service worker)

## יכולות
- רישום הכנסות/הוצאות עם קטגוריות וסינון חודשי
- תקציב חודשי לכל קטגוריה + התראות חריגה (80% / 100%)
- דוחות וגרפים (מגמה חודשית, התפלגות לפי קטגוריה)
- ייבוא וייצוא Excel/CSV + תבנית להורדה
- ניהול קטגוריות (הוספה/עריכה/ארכוב)

## הקמה

### 1. יצירת פרויקט Supabase
1. היכנס ל-[supabase.com](https://supabase.com) → **New project**.
2. ב-**SQL Editor** הרץ את התוכן של `supabase/migrations/0001_init.sql`
   (יוצר טבלאות, RLS, view לסיכום חודשי, ו-trigger שמזריע קטגוריות ברירת מחדל
   למשתמש חדש).
3. ב-**Project Settings → API** העתק את `Project URL` ואת מפתח ה-`anon public`.
4. ב-**Authentication → URL Configuration** הוסף ל-Redirect URLs:
   `http://localhost:3000/auth/callback` (ובהמשך גם דומיין הפרודקשן).

### 2. משתני סביבה
העתק את `.env.example` ל-`.env.local` ומלא:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
```
> מפתח ה-anon בטוח בצד הלקוח **רק** מפני ש-RLS מופעל. אל תחשוף את
> `service_role`.

### 3. הרצה
```bash
npm install
npm run dev      # http://localhost:3000
```
הרשמה דרך `/signup`. אם אישור אימייל מופעל ב-Supabase — אשר את האימייל ואז התחבר.

## פקודות
- `npm run dev` — שרת פיתוח
- `npm run build` — בנייה לפרודקשן
- `npm run start` — הרצת build
- `npm run lint` — בדיקת קוד

## פריסה (Vercel)
דחוף את התיקייה ל-Git, חבר ל-Vercel, והגדר את אותם משתני הסביבה. הוסף את דומיין
הפרודקשן ל-Redirect URLs ב-Supabase.

## מבנה
```
src/
  app/(auth)/      דפי התחברות/הרשמה + callback
  app/(app)/       דשבורד, תנועות, תקציב, דוחות, הגדרות (מוגן)
  app/actions/     Server Actions (אימות, תנועות, קטגוריות, תקציב)
  lib/supabase/    קליינטים (browser/server) + הגנת session
  lib/db/          טיפוסים ושאילתות
  lib/excel/       ייבוא/ייצוא
  components/      רכיבי UI, ניווט וגרפים
supabase/migrations/0001_init.sql   סכמת בסיס הנתונים
```
