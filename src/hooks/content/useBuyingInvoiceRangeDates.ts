import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

const useInvoiceRangeDates = (id?: number, enabled: boolean = true) => {
  const { isLoading: isFetchInvoiceRangePending, data: invoiceRangeResp } = useQuery({
    queryKey: [`invoice-range-${id}`],
    queryFn: () => api.buyingInvoice.findByRange(id),
    enabled: !!id && enabled
  });

  const dateRange = React.useMemo(() => {
    if (!invoiceRangeResp) return {
      from: undefined, to: undefined
    };
    //previous date
    const previousDate = invoiceRangeResp.previous?.date
      ? new Date(invoiceRangeResp.previous.date)
      : undefined;

    //next date
    const nextDate = invoiceRangeResp.next?.date ? new Date(invoiceRangeResp.next.date) : undefined;

    return {
      from: previousDate,
      to: nextDate
    };
  }, [invoiceRangeResp]);

  return {
    dateRange: dateRange as {from:Date;to:Date},
    isFetchInvoiceRangePending
  };
};

export default useInvoiceRangeDates;
