import { useState, useEffect } from "react";
import { getDispositionBreakdown } from "@/services/dashboardService";

export const useDispositionBreakdown = (filters, enabled = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getDispositionBreakdown(filters);
        setData(response);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load disposition breakdown",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, enabled]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDispositionBreakdown(filters);
      setData(response);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load disposition breakdown",
      );
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};
