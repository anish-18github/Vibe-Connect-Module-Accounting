// utils/financialYear.ts
export const getCurrentFY = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    return month >= 4
        ? `FY ${year}-${String(year + 1).slice(-2)}`
        : `FY ${year - 1}-${String(year).slice(-2)}`;
};

export const getLastFiveFYs = () => {
    const currentFY = getCurrentFY();
    const startYear = parseInt(currentFY.slice(3, 7));

    return Array.from({ length: 5 }, (_, i) => {
        const from = startYear - i;
        const to = String(from + 1).slice(-2);
        return `FY ${from}-${to}`;
    });
};
