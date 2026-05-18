// קיזוזים פר חשבון — מחושב מהקובץ "כתב כמויות מצטבר"
// סוגים:
//   - "removed" = הברוטו ירד (הסעיף הוסר רשמית מהחשבון)
//   - "held" = הנטו ירד אבל הברוטו נשאר (המפקח החזיק תשלום)

export type BillReduction = {
  itemCode: string;
  description: string;
  type: "removed" | "held";
  grossBefore: number;
  grossAfter: number;
  grossDrop: number;
  netDrop: number;
};

export const billReductionsByBill: Record<number, BillReduction[]> = {
  2: [],
  3: [],
  4: [
    { itemCode: "01.38.01.000", description: "מתקני דלק", type: "held", grossBefore: 547799.9999999999, grossAfter: 547799.9999999999, grossDrop: 0, netDrop: 54780.0 },
    { itemCode: "02.38.03.010", description: "ביצוע עבודת צנרת ומגופים בשוחה ראשית - V11  כולל רכישה, אספק", type: "held", grossBefore: 204556.0450354679, grossAfter: 204556.0450354679, grossDrop: 0, netDrop: 20455.604503546783 },
    { itemCode: "02.38.06.020", description: "8\" PIPE WELDED API 5L-B W.T.-0.5, OUTSIDE P.E. COATED, THREE", type: "held", grossBefore: 3170880, grossAfter: 3170880, grossDrop: 0, netDrop: 317088 },
  ],
  5: [],
  6: [
    { itemCode: "02.38.07.010", description: "מנהל עבודה", type: "held", grossBefore: 13200, grossAfter: 13200, grossDrop: 0, netDrop: 11880 },
    { itemCode: "02.38.07.020", description: "רתך כולל רתכת או מתקן לחיתוך", type: "held", grossBefore: 18150, grossAfter: 18150, grossDrop: 0, netDrop: 16335 },
    { itemCode: "02.38.07.030", description: "מסגר או צנר", type: "held", grossBefore: 15600, grossAfter: 15600, grossDrop: 0, netDrop: 14040 },
    { itemCode: "02.38.07.060", description: "מחפר CATERPILLER 229 או שו\"ע", type: "held", grossBefore: 55200, grossAfter: 55200, grossDrop: 0, netDrop: 49680 },
    { itemCode: "02.38.07.070", description: "מחפרון JCB 3 או שו\"ע", type: "held", grossBefore: 11890, grossAfter: 11890, grossDrop: 0, netDrop: 10701 },
  ],
  7: [
    { itemCode: "02.38.03.030", description: "ביצוע עבודת צנרת ומגופים בתאי ניקוז - V6,V8 כולל רכישה, אספק", type: "held", grossBefore: 75000, grossAfter: 75000, grossDrop: 0, netDrop: 67500 },
  ],
  8: [
    { itemCode: "02.38.03.050", description: "ביצוע עבודת צנרת ומגופים בשוחות מגופים - ,V1,V3,V4,V9 כולל ר", type: "removed", grossBefore: 1575000, grossAfter: 1260000, grossDrop: 315000, netDrop: 283500 },
    { itemCode: "02.38.07.020", description: "רתך כולל רתכת או מתקן לחיתוך", type: "removed", grossBefore: 18150, grossAfter: 8250, grossDrop: 9900, netDrop: 7425 },
    { itemCode: "02.38.07.030", description: "מסגר או צנר", type: "removed", grossBefore: 15600, grossAfter: 0, grossDrop: 15600, netDrop: 0 },
    { itemCode: "02.38.07.060", description: "מחפר CATERPILLER 229 או שו\"ע", type: "removed", grossBefore: 55200, grossAfter: 27000, grossDrop: 28200, netDrop: 24300 },
    { itemCode: "02.38.07.070", description: "מחפרון JCB 3 או שו\"ע", type: "removed", grossBefore: 11890, grossAfter: 0, grossDrop: 11890, netDrop: 0 },
  ],
  9: [
    { itemCode: "01.38.01.000", description: "מתקני דלק", type: "removed", grossBefore: 1452000, grossAfter: 0, grossDrop: 1452000, netDrop: 1452000 },
    { itemCode: "02.01.01.020", description: "ביצוע חפירות גישוש לאיתור תשתיות החוצות את תוואי הצנור (ניקו", type: "removed", grossBefore: 75900, grossAfter: 0, grossDrop: 75900, netDrop: 68310 },
    { itemCode: "02.01.01.030", description: "חפירת תעלה לצורך הטמנת הצינור, על פי העומקים המסומנים בתוכני", type: "removed", grossBefore: 550560, grossAfter: 0, grossDrop: 550560, netDrop: 495504 },
    { itemCode: "02.01.01.040", description: "חפירה באזורי חציית תשתיות וצנרת קיימת - חפירה תבוצע עד לעומק", type: "removed", grossBefore: 900, grossAfter: 0, grossDrop: 900, netDrop: 810 },
    { itemCode: "02.01.01.050", description: "חפירה באמצעות מחפרון זעיר עד לעומק של 20 ס\"מ מעל הצינור הקיי", type: "removed", grossBefore: 1600, grossAfter: 0, grossDrop: 1600, netDrop: 1440 },
    { itemCode: "02.01.01.070", description: "חול אינרטי, נקי מכל חומר אורגני, עד לגובה 30 ס\"מ מעל לצנרת. ", type: "removed", grossBefore: 1320600, grossAfter: 0, grossDrop: 1320600, netDrop: 1188540 },
    { itemCode: "02.01.01.100", description: "פריסת סרט זיהוי לאורך הצינור לאחר השלב הראשון של מילוי חוזר ", type: "removed", grossBefore: 29120, grossAfter: 0, grossDrop: 29120, netDrop: 26208 },
    { itemCode: "02.38.01.010", description: "טיפול והתקנת צנרת דלק תת קרקעית מרותכת בקוטר \"8, עטופה בציפו", type: "removed", grossBefore: 2200594.5, grossAfter: 0, grossDrop: 2200594.5, netDrop: 1980535.05 },
    { itemCode: "02.38.01.020", description: "ריתוך צנרת דלק (ריתוכי השקה, חדירה וכו'), כולל צילומי רדיוגר", type: "removed", grossBefore: 913360, grossAfter: 0, grossDrop: 913360, netDrop: 822024 },
    { itemCode: "02.38.01.070", description: "חיתוך קר", type: "removed", grossBefore: 3680, grossAfter: 0, grossDrop: 3680, netDrop: 3312 },
    { itemCode: "02.38.01.080", description: "ייצור  מלכודת זמנית ושטיפת קו חדש בקוטר 8\", לרבות רכש חומרים", type: "removed", grossBefore: 40000, grossAfter: 0, grossDrop: 40000, netDrop: 36000 },
    { itemCode: "02.38.02.050", description: "ביצוע נקיון קו 8\"  חדש ע\"י דחיקת שאריות תכולת הקו באמצעות מו", type: "removed", grossBefore: 50000, grossAfter: 0, grossDrop: 50000, netDrop: 45000 },
    { itemCode: "02.38.03.010", description: "ביצוע עבודת צנרת ומגופים בשוחה ראשית - V11  כולל רכישה, אספק", type: "removed", grossBefore: 204556.0450354679, grossAfter: 0, grossDrop: 204556.0450354679, netDrop: 184100.4405319211 },
    { itemCode: "02.38.03.020", description: "ביצוע עבודת צנרת ומגופים בשוחה קיימת - M39  כולל רכישה, אספק", type: "removed", grossBefore: 226690.762767456, grossAfter: 0, grossDrop: 226690.762767456, netDrop: 204021.68649071042 },
    { itemCode: "02.38.03.030", description: "ביצוע עבודת צנרת ומגופים בתאי ניקוז - V6,V8 כולל רכישה, אספק", type: "removed", grossBefore: 150000, grossAfter: 0, grossDrop: 150000, netDrop: 135000 },
    { itemCode: "02.38.03.040", description: "ביצוע עבודת צנרת ומגופים בתאי אוורור - V5,V7,V10 כולל רכישה,", type: "removed", grossBefore: 135000, grossAfter: 0, grossDrop: 135000, netDrop: 121500 },
    { itemCode: "02.38.03.050", description: "ביצוע עבודת צנרת ומגופים בשוחות מגופים - ,V1,V3,V4,V9 כולל ר", type: "removed", grossBefore: 1260000, grossAfter: 0, grossDrop: 1260000, netDrop: 1134000 },
    { itemCode: "02.38.06.020", description: "8\" PIPE WELDED API 5L-B W.T.-0.5, OUTSIDE P.E. COATED, THREE", type: "removed", grossBefore: 3198024, grossAfter: 0, grossDrop: 3198024, netDrop: 2878221.6 },
    { itemCode: "02.38.07.010", description: "מנהל עבודה", type: "removed", grossBefore: 22200, grossAfter: 0, grossDrop: 22200, netDrop: 19980 },
    { itemCode: "02.38.07.020", description: "רתך כולל רתכת או מתקן לחיתוך", type: "removed", grossBefore: 8250, grossAfter: 0, grossDrop: 8250, netDrop: 7425 },
    { itemCode: "02.38.07.060", description: "מחפר CATERPILLER 229 או שו\"ע", type: "removed", grossBefore: 27000, grossAfter: 0, grossDrop: 27000, netDrop: 24300 },
    { itemCode: "03.91.01.014 ק", description: "תוספת חיוצים מונוליטיים למערכת דלק - דרישת חיל האויר", type: "removed", grossBefore: 100798, grossAfter: 0, grossDrop: 100798, netDrop: 90718.2 },
  ],
};