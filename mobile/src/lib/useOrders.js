import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { notify } from "./notify";

// تحميل قائمة وتحديثها كلما عاد المستخدم للشاشة أو سحب للتحديث
export function useFocusedQuery(queryFn) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await queryFn();
    if (error) notify("تعذر تحميل البيانات", error.message);
    setData(data || []);
    setLoading(false);
    setRefreshing(false);
  }, [queryFn]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const refresh = () => {
    setRefreshing(true);
    load();
  };

  return { data, loading, refreshing, refresh };
}
