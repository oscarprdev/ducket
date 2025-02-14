import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface TablePaginationProps {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({
  itemsPerPage,
  currentPage,
  totalItems,
  onPageChange,
}: TablePaginationProps) {
  const totalPages = Math.ceil(Number(totalItems) / itemsPerPage);

  return (
    <div className="flex items-center justify-between border-t px-4 py-4">
      <div className="ml-auto flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>
        <div className="flex items-center gap-2 text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  );
}
