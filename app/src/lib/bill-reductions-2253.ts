// קיזוזים חריגים פר חשבון — סעיפים שמקבלים עיכבון מעל 10% רגיל
// או שהוסרו מהחשבון. סעיפים עם עיכבון 10% רגיל מסוכמים בשורת summary.

export type BillReduction = {
  itemCode: string;
  description: string;
  grossCurrent: number;
  netCurrent: number;
  heldAmount: number;
  heldRate: number;          // 0..1 (e.g. 1.0 = 100% held)
  removedThisBill: number;
  type: "held" | "removed" | "removed_and_held";
};

export type BillReductionSummary = {
  standardRetentionCount: number;     // # of items with normal 10% retention
  standardRetentionTotal: number;     // total amount in normal retention
  unusualReductions: BillReduction[];
};

export const billReductionsByBill: Record<number, BillReductionSummary> = {
  1: {
    standardRetentionCount: 0,
    standardRetentionTotal: 0,
    unusualReductions: [],
  },
  2: {
    standardRetentionCount: 0,
    standardRetentionTotal: 0,
    unusualReductions: [],
  },
  3: {
    standardRetentionCount: 0,
    standardRetentionTotal: 0,
    unusualReductions: [],
  },
  4: {
    standardRetentionCount: 14,
    standardRetentionTotal: 778554,
    unusualReductions: [],
  },
  5: {
    standardRetentionCount: 15,
    standardRetentionTotal: 950393,
    unusualReductions: [],
  },
  6: {
    standardRetentionCount: 10,
    standardRetentionTotal: 952585,
    unusualReductions: [
      { itemCode: "02.38.07.010", description: "מנהל עבודה", grossCurrent: 13200, netCurrent: 0, heldAmount: 13200, heldRate: 1.0000, removedThisBill: 0, type: "held" },
      { itemCode: "02.38.07.020", description: "רתך כולל רתכת או מתקן לחיתוך", grossCurrent: 18150, netCurrent: 0, heldAmount: 18150, heldRate: 1.0000, removedThisBill: 0, type: "held" },
      { itemCode: "02.38.07.030", description: "מסגר או צנר", grossCurrent: 15600, netCurrent: 0, heldAmount: 15600, heldRate: 1.0000, removedThisBill: 0, type: "held" },
      { itemCode: "02.38.07.060", description: "מחפר CATERPILLER 229 או שו\"ע", grossCurrent: 55200, netCurrent: 0, heldAmount: 55200, heldRate: 1.0000, removedThisBill: 0, type: "held" },
      { itemCode: "02.38.07.070", description: "מחפרון JCB 3 או שו\"ע", grossCurrent: 11890, netCurrent: 0, heldAmount: 11890, heldRate: 1.0000, removedThisBill: 0, type: "held" },
    ],
  },
  7: {
    standardRetentionCount: 15,
    standardRetentionTotal: 1034199,
    unusualReductions: [
      { itemCode: "02.38.03.030", description: "ביצוע עבודת צנרת ומגופים בתאי ניקוז - V6,V8 כולל רכישה, אספק", grossCurrent: 75000, netCurrent: 0, heldAmount: 75000, heldRate: 1.0000, removedThisBill: 0, type: "held" },
      { itemCode: "02.38.07.010", description: "מנהל עבודה", grossCurrent: 13200, netCurrent: 0, heldAmount: 13200, heldRate: 1.0000, removedThisBill: 0, type: "held" },
      { itemCode: "02.38.07.020", description: "רתך כולל רתכת או מתקן לחיתוך", grossCurrent: 18150, netCurrent: 0, heldAmount: 18150, heldRate: 1.0000, removedThisBill: 0, type: "held" },
      { itemCode: "02.38.07.030", description: "מסגר או צנר", grossCurrent: 15600, netCurrent: 0, heldAmount: 15600, heldRate: 1.0000, removedThisBill: 0, type: "held" },
      { itemCode: "02.38.07.060", description: "מחפר CATERPILLER 229 או שו\"ע", grossCurrent: 55200, netCurrent: 0, heldAmount: 55200, heldRate: 1.0000, removedThisBill: 0, type: "held" },
      { itemCode: "02.38.07.070", description: "מחפרון JCB 3 או שו\"ע", grossCurrent: 11890, netCurrent: 0, heldAmount: 11890, heldRate: 1.0000, removedThisBill: 0, type: "held" },
    ],
  },
  8: {
    standardRetentionCount: 21,
    standardRetentionTotal: 1051883,
    unusualReductions: [
      { itemCode: "02.38.03.050", description: "ביצוע עבודת צנרת ומגופים בשוחות מגופים - ,V1,V3,V4,V9 כולל ר", grossCurrent: 1260000, netCurrent: 1134000, heldAmount: 126000, heldRate: 0.1000, removedThisBill: 315000, type: "removed" },
      { itemCode: "02.38.07.020", description: "רתך כולל רתכת או מתקן לחיתוך", grossCurrent: 8250, netCurrent: 7425, heldAmount: 825, heldRate: 0.1000, removedThisBill: 9900, type: "removed" },
      { itemCode: "02.38.07.030", description: "מסגר או צנר", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 15600, type: "removed" },
      { itemCode: "02.38.07.060", description: "מחפר CATERPILLER 229 או שו\"ע", grossCurrent: 27000, netCurrent: 24300, heldAmount: 2700, heldRate: 0.1000, removedThisBill: 28200, type: "removed" },
      { itemCode: "02.38.07.070", description: "מחפרון JCB 3 או שו\"ע", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 11890, type: "removed" },
    ],
  },
  9: {
    standardRetentionCount: 0,
    standardRetentionTotal: 0,
    unusualReductions: [
      { itemCode: "01.38.01.000", description: "מתקני דלק", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 1452000, type: "removed" },
      { itemCode: "02.01.01.020", description: "ביצוע חפירות גישוש לאיתור תשתיות החוצות את תוואי הצנור (ניקו", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 75900, type: "removed" },
      { itemCode: "02.01.01.030", description: "חפירת תעלה לצורך הטמנת הצינור, על פי העומקים המסומנים בתוכני", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 550560, type: "removed" },
      { itemCode: "02.01.01.040", description: "חפירה באזורי חציית תשתיות וצנרת קיימת - חפירה תבוצע עד לעומק", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 900, type: "removed" },
      { itemCode: "02.01.01.050", description: "חפירה באמצעות מחפרון זעיר עד לעומק של 20 ס\"מ מעל הצינור הקיי", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 1600, type: "removed" },
      { itemCode: "02.01.01.070", description: "חול אינרטי, נקי מכל חומר אורגני, עד לגובה 30 ס\"מ מעל לצנרת. ", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 1320600, type: "removed" },
      { itemCode: "02.01.01.100", description: "פריסת סרט זיהוי לאורך הצינור לאחר השלב הראשון של מילוי חוזר ", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 29120, type: "removed" },
      { itemCode: "02.38.01.010", description: "טיפול והתקנת צנרת דלק תת קרקעית מרותכת בקוטר \"8, עטופה בציפו", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 2200594.5, type: "removed" },
      { itemCode: "02.38.01.020", description: "ריתוך צנרת דלק (ריתוכי השקה, חדירה וכו'), כולל צילומי רדיוגר", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 913360, type: "removed" },
      { itemCode: "02.38.01.070", description: "חיתוך קר", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 3680, type: "removed" },
      { itemCode: "02.38.01.080", description: "ייצור  מלכודת זמנית ושטיפת קו חדש בקוטר 8\", לרבות רכש חומרים", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 40000, type: "removed" },
      { itemCode: "02.38.02.050", description: "ביצוע נקיון קו 8\"  חדש ע\"י דחיקת שאריות תכולת הקו באמצעות מו", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 50000, type: "removed" },
      { itemCode: "02.38.03.010", description: "ביצוע עבודת צנרת ומגופים בשוחה ראשית - V11  כולל רכישה, אספק", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 204556.0450354679, type: "removed" },
      { itemCode: "02.38.03.020", description: "ביצוע עבודת צנרת ומגופים בשוחה קיימת - M39  כולל רכישה, אספק", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 226690.762767456, type: "removed" },
      { itemCode: "02.38.03.030", description: "ביצוע עבודת צנרת ומגופים בתאי ניקוז - V6,V8 כולל רכישה, אספק", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 150000, type: "removed" },
      { itemCode: "02.38.03.040", description: "ביצוע עבודת צנרת ומגופים בתאי אוורור - V5,V7,V10 כולל רכישה,", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 135000, type: "removed" },
      { itemCode: "02.38.03.050", description: "ביצוע עבודת צנרת ומגופים בשוחות מגופים - ,V1,V3,V4,V9 כולל ר", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 1260000, type: "removed" },
      { itemCode: "02.38.06.020", description: "8\" PIPE WELDED API 5L-B W.T.-0.5, OUTSIDE P.E. COATED, THREE", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 3198024, type: "removed" },
      { itemCode: "02.38.07.010", description: "מנהל עבודה", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 22200, type: "removed" },
      { itemCode: "02.38.07.020", description: "רתך כולל רתכת או מתקן לחיתוך", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 8250, type: "removed" },
      { itemCode: "02.38.07.060", description: "מחפר CATERPILLER 229 או שו\"ע", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 27000, type: "removed" },
      { itemCode: "03.91.01.014 ק", description: "תוספת חיוצים מונוליטיים למערכת דלק - דרישת חיל האויר", grossCurrent: 0, netCurrent: 0, heldAmount: 0, heldRate: 0.0000, removedThisBill: 100798, type: "removed" },
    ],
  },
};