import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Copy, Download, FileCheck, Settings2, Telescope, Trash2 } from 'lucide-react';
import { useQuotationManager } from '../hooks/useQuotationManager';
import { useQuotationActions } from './ActionsContext';
import { BUYING_QUOTATION_STATUS, BuyingQuotation } from '@/types/quotations/buying-quotation';
import { api } from '@/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';


interface DataTableRowActionsProps {
  row: Row<BuyingQuotation>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const quotation = row.original;
  const { t: tCommon } = useTranslation('common');
  const router = useRouter();
  const quotationManager = useQuotationManager();
  const { openDeleteDialog, openDownloadDialog, openDuplicateDialog, openInvoiceDialog } =
    useQuotationActions();

  const targetQuotation = () => {
    quotationManager.set('id', quotation?.id);
    quotationManager.set('sequential', quotation?.sequential);
    quotationManager.set('status', quotation?.status);
  };
    const { t: tInvoicing, ready: invoicingReady } = useTranslation('invoicing');
  

    //Download Quotation
    const { mutate: downloadQuotation } = useMutation({
      mutationFn: (data: { id: number}) =>
        api.buyingQuotation.download(data.id),
      onSuccess: () => {
        toast.success(tInvoicing('quotation.action_download_success'));
      },
      onError: (error) => {
        toast.error(
          getErrorMessage('invoicing', error, tInvoicing('quotation.action_download_failure'))
        );
      }
    });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-[160px]">
        <DropdownMenuLabel className="text-center">{tCommon('commands.actions')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Inspect */}
        <DropdownMenuItem onClick={() => router.push('/buying/quotation/' + quotation.id)}>
          <Telescope className="h-5 w-5 mr-2" /> {tCommon('commands.inspect')}
        </DropdownMenuItem>
        {/* Print */}
        <DropdownMenuItem
          onClick={() => {
            targetQuotation();
            quotation?.id && downloadQuotation({ id: quotation?.id })
          }}>
          <Download className="h-5 w-5 mr-2" /> {tCommon('commands.download')}
        </DropdownMenuItem>
        {/* Duplicate */}
        <DropdownMenuItem
          onClick={() => {
            targetQuotation();
            openDuplicateDialog?.();
          }}>
          <Copy className="h-5 w-5 mr-2" /> {tCommon('commands.duplicate')}
        </DropdownMenuItem>
        {/* Modify */}
        {(quotation.status == BUYING_QUOTATION_STATUS.Draft ||
          quotation.status == BUYING_QUOTATION_STATUS.Validated) && (
          <DropdownMenuItem onClick={() => router.push('/buying/quotation/' + quotation.id)}>
            <Settings2 className="h-5 w-5 mr-2" /> {tCommon('commands.modify')}
          </DropdownMenuItem>
        )}
        {(quotation.status == BUYING_QUOTATION_STATUS.Invoiced ||
          quotation.status == BUYING_QUOTATION_STATUS.Validated) && 
        (<DropdownMenuItem
            onClick={() => {
              targetQuotation();
              openInvoiceDialog?.();
            }}>
            <FileCheck className="h-5 w-5 mr-2" /> {tCommon('commands.to_invoice')}
          </DropdownMenuItem>
        )}
        {/* Delete */}
          <DropdownMenuItem
            onClick={() => {
              targetQuotation();
              openDeleteDialog?.();
            }}>
            <Trash2 className="h-5 w-5 mr-2" /> {tCommon('commands.delete')}
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
