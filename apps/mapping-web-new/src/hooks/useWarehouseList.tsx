
import { useMemo, useState, useEffect } from "react";
import { postApiWarehouseGetPageData } from "@/services";
import type { MenuProps } from "antd";
import { useStore } from "@/store";
import { PAGINATION } from "../constants";

export default function useWarehouseList() {
    const [warehouseList, setWarehouseList] = useState<API.WarehouseInfoDTO[]>([]);
    const [items, setItems] = useState<MenuProps['items']>([]);
    const { editorStore } = useStore();

    const fetchData = () => {
        postApiWarehouseGetPageData(PAGINATION).then(res => {
            const data = res?.resultData?.pageData ?? []
            setWarehouseList(data);
            const newItems: MenuProps['items'] = data.map(d => ({
                label: d.aliasName!,
                key: d.id!,
                onClick: ({key}) => {
                    const item = data.find(w => w.id === key);
                    editorStore.setWarehouse(item!)
                }
            }))
            setItems(newItems);
        })
    }

    useEffect(() => {
        fetchData();
    }, [])

    return {
        warehouseList,
        items
    }
}