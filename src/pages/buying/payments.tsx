
import { PaymentMain } from '@/components/buying/payment/PaymentMain';
import React from 'react';

export default function BuyingInvoicesPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden p-8">
      <PaymentMain className="p-5 my-10" />
    </div>
  );
}
