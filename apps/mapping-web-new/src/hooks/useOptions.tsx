import { useEffect, useState } from "react";
export interface IConfig<T> {
  mannual: boolean;
  valueKey: keyof T | ((data: T) => any);
  labelKey: keyof T | ((data: T) => any);
  onsuccess?: (options: Option<T>[]) => void;
}

type Option<T = any> = {
  value: any;
  label: any;
} & T;

type TItem<T extends any[]> = T extends (infer R)[] ? R : any;

export default function useOptions<T>(
  api: () => Promise<T[]>,
  { mannual, valueKey, labelKey, onsuccess }: IConfig<T>
) {
  const [options, setOptions] = useState<Option<T>[]>([]);

  const getData = async () => {
    const res = await api();
    const newOptions = res.map<Option<T>>((item) => {
      let value: any, label: any;
      if (typeof valueKey === "function") {
        value = valueKey(item);
      } else {
        value = item[valueKey];
      }
      if (typeof labelKey === "function") {
        label = labelKey(item);
      } else {
        label = item[labelKey];
      }
      return {
        ...item,
        value,
        label,
      };
    });
    setOptions(newOptions);
    onsuccess?.(newOptions);
  };

  useEffect(() => {
    if (!mannual) {
      getData();
    }
  }, []);

  return {
    options,
    load: getData,
  };
}
