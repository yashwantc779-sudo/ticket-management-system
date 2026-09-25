import { useCallback, useEffect, useState } from "react";

import { getTickets } from "../api/ticketApi";

function useTickets() {
  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const [pageSize] = useState(5);

  const [totalCount, setTotalCount] =
    useState(0);

  const [filters, setFilters] = useState({
    search: "",
    client: "",
    department: "",
    status: "",
  });

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        page_size: pageSize,
      };

      if (filters.search) {
        params.search = filters.search;
      }

      if (filters.client) {
        params.client = filters.client;
      }

      if (filters.department) {
        params.department =
          filters.department;
      }

      if (filters.status) {
        params.status = filters.status;
      }

      const data = await getTickets(params);

      setTickets(data.results || data);

      setTotalCount(
        data.count || data.length || 0
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
          "Failed to load tickets"
      );
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const updateFilters = (newFilters) => {
    setFilters((previous) => ({
      ...previous,
      ...newFilters,
    }));

    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      client: "",
      department: "",
      status: "",
    });

    setPage(1);
  };

  return {
    tickets,
    loading,
    error,

    page,
    pageSize,
    totalCount,

    filters,

    setPage,
    updateFilters,
    resetFilters,

    refresh: fetchTickets,
  };
}

export default useTickets;