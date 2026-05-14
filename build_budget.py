#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""מחולל קובץ אקסל: תקציב לבניית בית פרטי.

מייצר קובץ .xlsx עם 4 גיליונות: הסבר, סיכום, תקציב מפורט, מימון ותזרים.
כל הסכומים הם הערכות בלבד (מחירי 2026, מרכז הארץ) וניתנים לעריכה.
"""

from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

OUT = "תקציב_בניית_בית_פרטי.xlsx"

# ---------- פלטת צבעים ----------
NAVY   = "1F3864"
BLUE   = "2F5597"
LBLUE  = "D6E4F0"
SUBTOT = "BDD7EE"
GREY   = "F2F2F2"
INPUT  = "FFF2CC"   # צהוב - תא להזנה ידנית
ACCENT = "C55A11"
GOOD   = "E2EFDA"
WHITE  = "FFFFFF"

_thin = Side(style="thin", color="B0B0B0")
BORDER = Border(left=_thin, right=_thin, top=_thin, bottom=_thin)

CUR = '#,##0 "₪"'   # 1,234 ₪
PCT = '0%'


def cell(ws, coord, value=None, *, bold=False, size=11, fill=None,
         font_color="000000", align="right", fmt=None, wrap=False,
         border=True, italic=False):
    c = ws[coord]
    if value is not None:
        c.value = value
    c.font = Font(name="Calibri", bold=bold, size=size,
                  color=font_color, italic=italic)
    if fill:
        c.fill = PatternFill("solid", fgColor=fill)
    c.alignment = Alignment(horizontal=align, vertical="center", wrap_text=wrap)
    if fmt:
        c.number_format = fmt
    if border:
        c.border = BORDER
    return c


def merge(ws, rng, value, **kw):
    ws.merge_cells(rng)
    first = rng.split(":")[0]
    cell(ws, first, value, **kw)
    fill = kw.get("fill")
    for row in ws[rng]:
        for c in row:
            c.border = BORDER
            if fill:
                c.fill = PatternFill("solid", fgColor=fill)


# ---------- נתוני התקציב המפורט ----------
# כל פריט: (שם, יחידה, מחיר ליחידה, כמות, הערה)
# כמות "AREA" => הפנייה לשטח הבנייה בגיליון "סיכום"
DATA = [
 ("1. קרקע ועלויות רכישה", [
   ("עלות המגרש / הקרקע", "קומפלט", 900000, 1, "משתנה מאוד לפי אזור ומיקום"),
   ("מס רכישה", "קומפלט", 32000, 1, "לפי מדרגות שווי"),
   ("שכ\"ט עו\"ד, אגרות ורישום בטאבו", "קומפלט", 15000, 1, ""),
   ("דמי תיווך", "קומפלט", 0, 1, "אם רלוונטי"),
   ("מדידה, מפה טופוגרפית ובדיקת קרקע", "קומפלט", 9000, 1, ""),
 ]),
 ("2. תכנון, ייעוץ והיתרים", [
   ("תכנון אדריכלי", "קומפלט", 55000, 1, ""),
   ("מהנדס קונסטרוקציה", "קומפלט", 20000, 1, ""),
   ("יועצים (קרקע, אינסטלציה, חשמל, בטיחות)", "קומפלט", 22000, 1, ""),
   ("אגרות בנייה והיתר בנייה", "קומפלט", 45000, 1, "תלוי רשות מקומית"),
   ("היטל השבחה", "קומפלט", 0, 1, "אם חל"),
   ("חיבורי תשתית (חשמל, מים, ביוב, גז)", "קומפלט", 45000, 1, ""),
   ("ניהול ופיקוח הנדסי / מנהל פרויקט", "קומפלט", 65000, 1, ""),
 ]),
 ("3. עבודות עפר והכשרת קרקע", [
   ("חפירה, יישור ופינוי עודף", "מ\"ר", 55, 250, ""),
   ("מילוי מובא והידוק", "מ\"ק", 90, 120, ""),
   ("דיפון / קירות תמך", "מ\"ר", 350, 0, "רק אם נדרש טופוגרפית"),
   ("התארגנות אתר (גידור, חיבור זמני)", "קומפלט", 12000, 1, ""),
 ]),
 ("4. שלד ובטון", [
   ("יסודות ורפסודת בטון", "מ\"ר", 480, "AREA", ""),
   ("שלד בטון - עמודים, קורות ותקרות", "מ\"ר", 1150, "AREA", ""),
   ("ממ\"ד (מרחב מוגן)", "קומפלט", 38000, 1, ""),
   ("מדרגות בטון פנים", "קומפלט", 14000, 1, ""),
   ("משאבת בטון ואביזרים", "קומפלט", 9000, 1, ""),
 ]),
 ("5. בנייה, מעטפת ואיטום", [
   ("בנייה - בלוקים וקירות", "מ\"ר", 380, "AREA", ""),
   ("איטום (גג, יסודות, חדרים רטובים)", "מ\"ר", 130, "AREA", ""),
   ("בידוד תרמי ואקוסטי", "מ\"ר", 95, "AREA", ""),
   ("גג רעפים / גג שטוח", "מ\"ר", 320, 110, ""),
 ]),
 ("6. אלומיניום ונגרות חוץ", [
   ("חלונות, ויטרינות ותריסים", "מ\"ר", 2300, 38, ""),
   ("דלת כניסה", "קומפלט", 13000, 1, ""),
   ("פרגולה / סוכך / מעקות חוץ", "קומפלט", 18000, 1, ""),
 ]),
 ("7. אינסטלציה ומערכות מים", [
   ("צנרת מים, ביוב ונקזים", "נק'", 480, 42, ""),
   ("דוד שמש ומערכת חימום מים", "קומפלט", 7000, 1, ""),
   ("כלים סניטריים, ברזים ואביזרים", "קומפלט", 32000, 1, ""),
   ("חימום תת-רצפתי", "מ\"ר", 220, 0, "אופציונלי"),
 ]),
 ("8. חשמל, תקשורת ובית חכם", [
   ("נקודות חשמל, מאור וכוח", "נק'", 190, 180, ""),
   ("לוח חשמל ראשי ומשני", "קומפלט", 9000, 1, ""),
   ("תקשורת, רשת ומולטימדיה", "נק'", 260, 30, ""),
   ("מערכת בית חכם / אזעקה / מצלמות", "קומפלט", 28000, 1, "אופציונלי"),
 ]),
 ("9. מיזוג אוויר", [
   ("מערכת מיזוג מרכזי / מיני-מרכזי", "קומפלט", 58000, 1, ""),
   ("תעלות, מפזרים ותרמוסטטים", "קומפלט", 12000, 1, ""),
 ]),
 ("10. טיח, צבע, ריצוף וחיפוי", [
   ("טיח פנים וחוץ", "מ\"ר", 78, 720, ""),
   ("צבע ושפכטל", "מ\"ר", 38, 720, ""),
   ("ריצוף פנים וחיפוי קירות", "מ\"ר", 290, 200, ""),
   ("חיפוי חוץ (אבן / טיח אקרילי)", "מ\"ר", 260, 200, ""),
   ("אבני שפה, סיפים ופנלים", "קומפלט", 9000, 1, ""),
 ]),
 ("11. גמרים פנימיים", [
   ("מטבח - ארונות, משטח ואי", "קומפלט", 85000, 1, ""),
   ("חדרי רחצה - ארונות, מקלחונים ואביזרים", "יח'", 16000, 3, ""),
   ("דלתות פנים", "יח'", 2600, 8, ""),
   ("נגרות פנים / ארונות קיר / ספריות", "קומפלט", 45000, 1, ""),
   ("מערכת גבס, תקרות וניסור", "מ\"ר", 130, "AREA", ""),
   ("גופי תאורה", "קומפלט", 22000, 1, ""),
 ]),
 ("12. עבודות חוץ ופיתוח", [
   ("גינון, דשא והשקיה", "מ\"ר", 180, 220, ""),
   ("ריצוף חצר, חניה ושבילים", "מ\"ר", 260, 160, ""),
   ("גדר, שער ומעקות חוץ", "מ\"ר", 620, 55, ""),
   ("בריכה / ג'קוזי / אקסטרות", "קומפלט", 0, 1, "אופציונלי"),
   ("מחסן / פרגולת רכב", "קומפלט", 25000, 1, ""),
 ]),
 ("13. ניהול, הובלה ובלת\"מ", [
   ("הובלה, התארגנות וניקיון אתר", "קומפלט", 16000, 1, ""),
   ("ביטוח עבודות קבלניות", "קומפלט", 8000, 1, ""),
   ("אגרות, אישורי אכלוס וטופס 4", "קומפלט", 12000, 1, ""),
   ("ריהוט והתאמות לאחר אכלוס", "קומפלט", 60000, 1, ""),
   ("רזרבה לבלת\"מ (בלתי-צפוי)", "קומפלט", 130000, 1, "מומלץ 8%-12% מעלות הבנייה"),
 ]),
]

WIDTHS = [38, 12, 9, 17, 18, 14, 19, 16, 16, 11, 30]

wb = Workbook()
ws_help = wb.active
ws_help.title = "הסבר"
ws_sum = wb.create_sheet("סיכום")
ws_det = wb.create_sheet("תקציב מפורט")
ws_fin = wb.create_sheet("מימון ותזרים")
for ws in (ws_help, ws_sum, ws_det, ws_fin):
    ws.sheet_view.rightToLeft = True

# ============================================================
# גיליון: תקציב מפורט
# ============================================================
for i, w in enumerate(WIDTHS, start=1):
    ws_det.column_dimensions[chr(64 + i)].width = w

merge(ws_det, "A1:K1", "תקציב מפורט - בניית בית פרטי",
      bold=True, size=16, fill=NAVY, font_color=WHITE, align="center")
ws_det.row_dimensions[1].height = 26
merge(ws_det, "A2:K2",
      "תאים צהובים = להזנה ידנית | שאר התאים מחושבים אוטומטית | המע\"מ לפי השיעור בגיליון \"סיכום\"",
      italic=True, size=10, fill=GREY, align="center")

HEAD = ["סעיף", "יחידה", "כמות",
        "מחיר ליח' (ללא מע\"מ)",
        "עלות מתוכננת (ללא מע\"מ)",
        "מע\"מ", "סה\"כ מתוכנן (כולל מע\"מ)",
        "שולם בפועל", "יתרה לתשלום",
        "% ביצוע", "הערות"]
for i, h in enumerate(HEAD, start=1):
    cell(ws_det, f"{chr(64+i)}4", h, bold=True, size=10, fill=BLUE,
         font_color=WHITE, align="center", wrap=True)
ws_det.row_dimensions[4].height = 38

r = 5
subtotal_rows = []
for cat_name, items in DATA:
    merge(ws_det, f"A{r}:K{r}", cat_name, bold=True, size=12,
          fill=ACCENT, font_color=WHITE)
    ws_det.row_dimensions[r].height = 20
    r += 1
    first_item = r
    for name, unit, price, qty, note in items:
        cell(ws_det, f"A{r}", name)
        cell(ws_det, f"B{r}", unit, align="center")
        if qty == "AREA":
            cell(ws_det, f"C{r}", "='סיכום'!$B$4", align="center")
        else:
            cell(ws_det, f"C{r}", qty, align="center", fill=INPUT)
        cell(ws_det, f"D{r}", price, fmt=CUR, fill=INPUT)
        cell(ws_det, f"E{r}", f"=C{r}*D{r}", fmt=CUR, fill=GREY)
        cell(ws_det, f"F{r}", f"=E{r}*'סיכום'!$B$5", fmt=CUR, fill=GREY)
        cell(ws_det, f"G{r}", f"=E{r}+F{r}", fmt=CUR, fill=LBLUE, bold=True)
        cell(ws_det, f"H{r}", 0, fmt=CUR, fill=INPUT)
        cell(ws_det, f"I{r}", f"=G{r}-H{r}", fmt=CUR)
        cell(ws_det, f"J{r}", f"=IF(G{r}>0,H{r}/G{r},0)", fmt=PCT, align="center")
        cell(ws_det, f"K{r}", note, size=9, align="right", wrap=True)
        r += 1
    last_item = r - 1
    # שורת סיכום ביניים
    merge(ws_det, f"A{r}:D{r}", f"סה\"כ {cat_name}", bold=True, fill=SUBTOT)
    for col in ("E", "F", "G", "H", "I"):
        cell(ws_det, f"{col}{r}", f"=SUM({col}{first_item}:{col}{last_item})",
             fmt=CUR, bold=True, fill=SUBTOT)
    cell(ws_det, f"J{r}", f"=IF(G{r}>0,H{r}/G{r},0)", fmt=PCT, bold=True,
         fill=SUBTOT, align="center")
    cell(ws_det, f"K{r}", "", fill=SUBTOT)
    subtotal_rows.append(r)
    r += 1
    cell(ws_det, f"A{r}", "", border=False)  # רווח
    r += 1

# סיכום כללי
grand = r
merge(ws_det, f"A{grand}:D{grand}",
      "סה\"כ כללי לפרויקט (כולל מע\"מ)",
      bold=True, size=13, fill=NAVY, font_color=WHITE)
for col in ("E", "F", "G", "H", "I"):
    expr = "=" + "+".join(f"{col}{sr}" for sr in subtotal_rows)
    cell(ws_det, f"{col}{grand}", expr, fmt=CUR, bold=True, size=13,
         fill=NAVY, font_color=WHITE)
cell(ws_det, f"J{grand}", f"=IF(G{grand}>0,H{grand}/G{grand},0)", fmt=PCT,
     bold=True, size=13, fill=NAVY, font_color=WHITE, align="center")
cell(ws_det, f"K{grand}", "", fill=NAVY)
ws_det.row_dimensions[grand].height = 24
ws_det.freeze_panes = "A5"
GRAND_G = f"'תקציב מפורט'!G{grand}"

# ============================================================
# גיליון: סיכום
# ============================================================
for col, w in zip("ABCDEF", [34, 20, 20, 20, 14, 4]):
    ws_sum.column_dimensions[col].width = w

merge(ws_sum, "A1:F1", "סיכום תקציב - בניית בית פרטי",
      bold=True, size=16, fill=NAVY, font_color=WHITE, align="center")
ws_sum.row_dimensions[1].height = 26

merge(ws_sum, "A3:F3", "הנחות יסוד ופרמטרים (ניתן לעריכה)",
      bold=True, size=12, fill=ACCENT, font_color=WHITE)
cell(ws_sum, "A4", "שטח בנייה מתוכנן (מ\"ר)", bold=True)
cell(ws_sum, "B4", 180, fill=INPUT, bold=True, align="center")
cell(ws_sum, "A5", "שיעור מע\"מ", bold=True)
cell(ws_sum, "B5", 0.18, fill=INPUT, bold=True, align="center", fmt=PCT)
cell(ws_sum, "A6", "רזרבה מומלצת לבלת\"מ", bold=True)
cell(ws_sum, "B6", 0.10, fill=INPUT, bold=True, align="center", fmt=PCT)
for rr in (4, 5, 6):
    for col in "CDEF":
        cell(ws_sum, f"{col}{rr}", "", border=False)

merge(ws_sum, "A8:F8", "ריכוז תקציב לפי קטגוריות",
      bold=True, size=12, fill=ACCENT, font_color=WHITE)
SUM_HEAD = ["קטגוריה", "מתוכנן (כולל מע\"מ)",
            "שולם בפועל", "יתרה לתשלום",
            "% ביצוע"]
for i, h in enumerate(SUM_HEAD):
    cell(ws_sum, f"{chr(65+i)}9", h, bold=True, fill=BLUE, font_color=WHITE,
         align="center", wrap=True)
ws_sum.row_dimensions[9].height = 30

sr_start = 10
for idx, (cat_name, _) in enumerate(DATA):
    rr = sr_start + idx
    sr = subtotal_rows[idx]
    cell(ws_sum, f"A{rr}", cat_name)
    cell(ws_sum, f"B{rr}", f"='תקציב מפורט'!G{sr}", fmt=CUR)
    cell(ws_sum, f"C{rr}", f"='תקציב מפורט'!H{sr}", fmt=CUR)
    cell(ws_sum, f"D{rr}", f"='תקציב מפורט'!I{sr}", fmt=CUR)
    cell(ws_sum, f"E{rr}", f"=IF(B{rr}>0,C{rr}/B{rr},0)", fmt=PCT, align="center")
sr_end = sr_start + len(DATA) - 1

tot = sr_end + 1
cell(ws_sum, f"A{tot}", "סה\"כ כללי", bold=True, size=12,
     fill=NAVY, font_color=WHITE)
for col in ("B", "C", "D"):
    cell(ws_sum, f"{col}{tot}", f"=SUM({col}{sr_start}:{col}{sr_end})",
         fmt=CUR, bold=True, size=12, fill=NAVY, font_color=WHITE)
cell(ws_sum, f"E{tot}", f"=IF(B{tot}>0,C{tot}/B{tot},0)", fmt=PCT, bold=True,
     size=12, fill=NAVY, font_color=WHITE, align="center")
TOTAL_BUDGET = f"'סיכום'!$B${tot}"

# מדדים מרכזיים
k = tot + 2
merge(ws_sum, f"A{k}:F{k}", "מדדים מרכזיים",
      bold=True, size=12, fill=ACCENT, font_color=WHITE)
kpis = [
    ("סה\"כ תקציב הפרויקט (כולל מע\"מ)", f"=B{tot}", CUR),
    ("סה\"כ שולם עד כה", f"=C{tot}", CUR),
    ("יתרה לתשלום", f"=D{tot}", CUR),
    ("אחוז התקדמות כספי", f"=E{tot}", PCT),
    ("עלות למ\"ר (כולל מע\"מ)", f"=IF(B4>0,B{tot}/B4,0)", CUR),
]
for i, (label, expr, fmt) in enumerate(kpis):
    rr = k + 1 + i
    merge(ws_sum, f"A{rr}:C{rr}", label, bold=True, fill=LBLUE)
    merge(ws_sum, f"D{rr}:E{rr}", None)
    cell(ws_sum, f"D{rr}", expr, fmt=fmt, bold=True, size=12, fill=GOOD,
         align="center")
    cell(ws_sum, f"F{rr}", "", border=False)
ws_sum.freeze_panes = "A2"

# ============================================================
# גיליון: מימון ותזרים
# ============================================================
for col, w in zip("ABCDEF", [32, 30, 18, 18, 18, 4]):
    ws_fin.column_dimensions[col].width = w

merge(ws_fin, "A1:E1", "מימון ותזרים מזומנים",
      bold=True, size=16, fill=NAVY, font_color=WHITE, align="center")
ws_fin.row_dimensions[1].height = 26

merge(ws_fin, "A3:C3", "מקורות מימון",
      bold=True, size=12, fill=ACCENT, font_color=WHITE)
cell(ws_fin, "A4", "מקור", bold=True, fill=BLUE, font_color=WHITE, align="center")
merge(ws_fin, "B4:C4", "סכום", bold=True, fill=BLUE, font_color=WHITE, align="center")
sources = ["הון עצמי / חיסכון", "משכנתא",
           "הלוואת גישור / משלימה",
           "מענקים / סיוע / מתנה", "מקורות נוספים"]
fr = 5
for s in sources:
    cell(ws_fin, f"A{fr}", s)
    merge(ws_fin, f"B{fr}:C{fr}", 0, fmt=CUR, fill=INPUT)
    fr += 1
src_total = fr
cell(ws_fin, f"A{src_total}", "סה\"כ מקורות מימון",
     bold=True, size=12, fill=NAVY, font_color=WHITE)
merge(ws_fin, f"B{src_total}:C{src_total}", f"=SUM(B5:B{src_total-1})",
      fmt=CUR, bold=True, size=12, fill=NAVY, font_color=WHITE)

# בדיקת איזון
b = src_total + 2
merge(ws_fin, f"A{b}:C{b}", "בדיקת איזון תקציב מול מימון",
      bold=True, size=12, fill=ACCENT, font_color=WHITE)
cell(ws_fin, f"A{b+1}", "סה\"כ תקציב הפרויקט", bold=True, fill=LBLUE)
merge(ws_fin, f"B{b+1}:C{b+1}", f"={TOTAL_BUDGET}", fmt=CUR, bold=True, fill=LBLUE)
cell(ws_fin, f"A{b+2}", "סה\"כ מקורות מימון", bold=True, fill=LBLUE)
merge(ws_fin, f"B{b+2}:C{b+2}", f"=B{src_total}", fmt=CUR, bold=True, fill=LBLUE)
cell(ws_fin, f"A{b+3}", "פער (עודף / גירעון)", bold=True, fill=GOOD)
merge(ws_fin, f"B{b+3}:C{b+3}", f"=B{b+2}-B{b+1}", fmt=CUR, bold=True, fill=GOOD)

# תזרים חודשי
c = b + 5
merge(ws_fin, f"A{c}:E{c}", "תזרים מזומנים חודשי (תבנית ל-18 חודשים)",
      bold=True, size=12, fill=ACCENT, font_color=WHITE)
CF_HEAD = ["חודש", "שלב עיקרי",
           "תשלום מתוכנן", "תשלום בפועל",
           "מצטבר בפועל"]
ch = c + 1
for i, h in enumerate(CF_HEAD):
    cell(ws_fin, f"{chr(65+i)}{ch}", h, bold=True, fill=BLUE, font_color=WHITE,
         align="center")
stages = [
    "היתרים, אגרות וחיבורי תשתית",
    "עבודות עפר ויסודות",
    "יסודות ותחילת שלד",
    "שלד בטון",
    "שלד וגג",
    "בנייה ומעטפת",
    "איטום ובידוד",
    "אינסטלציה וחשמל גס",
    "טיח פנים וחוץ",
    "חלונות ואלומיניום",
    "ריצוף וחיפוי",
    "מיזוג אוויר",
    "גבס, תקרות וצבע",
    "מטבח ונגרות",
    "כלים סניטריים וחשמל סופי",
    "דלתות פנים וגמרים",
    "פיתוח חוץ וגינון",
    "ניקיון, טופס 4 ומסירה",
]
cf_first = ch + 1
for i, stage in enumerate(stages):
    rr = cf_first + i
    cell(ws_fin, f"A{rr}", i + 1, align="center", bold=True)
    cell(ws_fin, f"B{rr}", stage)
    cell(ws_fin, f"C{rr}", 0, fmt=CUR, fill=INPUT)
    cell(ws_fin, f"D{rr}", 0, fmt=CUR, fill=INPUT)
    if i == 0:
        cell(ws_fin, f"E{rr}", f"=D{rr}", fmt=CUR, fill=GREY)
    else:
        cell(ws_fin, f"E{rr}", f"=E{rr-1}+D{rr}", fmt=CUR, fill=GREY)
cf_last = cf_first + len(stages) - 1
ct = cf_last + 1
cell(ws_fin, f"A{ct}", "", fill=NAVY)
cell(ws_fin, f"B{ct}", "סה\"כ", bold=True, fill=NAVY, font_color=WHITE)
cell(ws_fin, f"C{ct}", f"=SUM(C{cf_first}:C{cf_last})", fmt=CUR, bold=True,
     fill=NAVY, font_color=WHITE)
cell(ws_fin, f"D{ct}", f"=SUM(D{cf_first}:D{cf_last})", fmt=CUR, bold=True,
     fill=NAVY, font_color=WHITE)
cell(ws_fin, f"E{ct}", f"=E{cf_last}", fmt=CUR, bold=True, fill=NAVY,
     font_color=WHITE)
ws_fin.freeze_panes = "A2"

# ============================================================
# גיליון: הסבר
# ============================================================
ws_help.column_dimensions["A"].width = 4
ws_help.column_dimensions["B"].width = 110
merge(ws_help, "A1:B1", "תקציב לבניית בית פרטי - הסבר והוראות שימוש",
      bold=True, size=16, fill=NAVY, font_color=WHITE, align="center")
ws_help.row_dimensions[1].height = 28

lines = [
    ("הקובץ כולל 4 גיליונות:", True),
    ("• הסבר - הגיליון הנוכחי: הסבר כללי והוראות שימוש.", False),
    ("• סיכום - תמונת מצב כוללת: ריכוז לפי קטגוריות ומדדים מרכזיים. כאן מגדירים את שטח הבנייה ואת שיעור המע\"מ.", False),
    ("• תקציב מפורט - 13 קטגוריות עם כל סעיפי העלות. כאן ממלאים מחירים ומעקבים תשלומים בפועל.", False),
    ("• מימון ותזרים - מקורות המימון (הון עצמי, משכנתא) ופריסת תשלומים חודשית.", False),
    ("", False),
    ("איך לעבוד עם הקובץ:", True),
    ("• תאים בצבע צהוב מיועדים להזנה ידנית - מחירים, כמויות ותשלומים בפועל.", False),
    ("• כל שאר התאים מחושבים אוטומטית בנוסחאות - מומלץ לא לדרוס אותם.", False),
    ("• המע\"מ מחושב אוטומטית לפי השיעור שבגיליון \"סיכום\" (ברירת מחדל 18%).", False),
    ("• סעיפים המסומנים כ\"מ\\\"ר\" עם כמות מופנים לשטח הבנייה - שינוי השטח מעדכן אותם אוטומטית.", False),
    ("• סעיפים לא רלוונטיים - השאירו מחיר 0 (לא ישפיעו על הסיכום).", False),
    ("", False),
    ("הערות חשובות:", True),
    ("• כל הסכומים הם הערכות בלבד (מחירי 2026, מרכז הארץ) לבית בשטח כ-180 מ\"ר - יש להתאים להצעות מחיר בפועל.", False),
    ("• מומלץ לשמור רזרבה של 8%-12% מעלות הבנייה להוצאות בלתי-צפויות.", False),
    ("• עלות הקרקע היא הרכיב המשתנה ביותר - עדכנו לפי המגרש הספציפי שלכם.", False),
    ("• הקובץ אינו תחליף לייעוץ מקצועי של אדריכל, מנהל פרויקט או שמאי.", False),
]
hr = 3
for text, is_head in lines:
    if text == "":
        hr += 1
        continue
    if is_head:
        cell(ws_help, f"B{hr}", text, bold=True, size=12, fill=LBLUE, wrap=True)
    else:
        cell(ws_help, f"B{hr}", text, size=11, wrap=True, border=False)
    cell(ws_help, f"A{hr}", "", border=False)
    ws_help.row_dimensions[hr].height = 20
    hr += 1

ws_help.sheet_properties.tabColor = NAVY
ws_sum.sheet_properties.tabColor = ACCENT
ws_det.sheet_properties.tabColor = BLUE
ws_fin.sheet_properties.tabColor = "375623"

wb.active = wb.sheetnames.index("סיכום")
wb.save(OUT)
print(f"נוצר: {OUT}")
print(f"שורת סיכום כללי בתקציב המפורט: {grand}")
