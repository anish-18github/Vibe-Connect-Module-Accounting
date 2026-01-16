import type { TcsOption, TdsOption } from "../../components/Table/ItemTable/ItemTable";
import api from "./apiConfig";

export interface TaxOption {
    id: string;
    name: string;
    rate: number;
}

/* ---------- TDS ---------- */
export const getTDS = async (): Promise<TdsOption[]> => {
    const res = await api.get('TDS/');
    return res.data;
};

/* ---------- TCS ---------- */
export const getTCS = async (): Promise<TcsOption[]> => {
    const res = await api.get('TCS/');
    return res.data;    
};

export const createTCS = async (payload: {
    name: string;
    rate: number;
}): Promise<TaxOption> => {
    const res = await api.post('TCS/', payload);
    return res.data;
};
