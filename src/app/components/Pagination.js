'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, hasNextPage, hasPrevPage }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    router.push(`?${params.toString()}`);
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Number of pages to show
    let start = Math.max(1, page - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center space-x-2">
      {/* Previous button */}
      <button
        onClick={() => hasPrevPage && handlePageChange(page - 1)}
        disabled={!hasPrevPage}
        className={`p-2 rounded-lg flex items-center ${
          hasPrevPage
            ? 'text-gray-700 hover:bg-gray-100'
            : 'text-gray-400 cursor-not-allowed'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* First page if not in view */}
      {getPageNumbers()[0] > 1 && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className={`px-4 py-2 rounded-lg ${
              page === 1
                ? 'bg-rose-100 text-rose-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            1
          </button>
          {getPageNumbers()[0] > 2 && (
            <span className="px-2 text-gray-500">...</span>
          )}
        </>
      )}

      {/* Page numbers */}
      {getPageNumbers().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => handlePageChange(pageNum)}
          className={`px-4 py-2 rounded-lg ${
            page === pageNum
              ? 'bg-rose-100 text-rose-700 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {pageNum}
        </button>
      ))}

      {/* Last page if not in view */}
      {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
        <>
          {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
            <span className="px-2 text-gray-500">...</span>
          )}
          <button
            onClick={() => handlePageChange(totalPages)}
            className={`px-4 py-2 rounded-lg ${
              page === totalPages
                ? 'bg-rose-100 text-rose-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next button */}
      <button
        onClick={() => hasNextPage && handlePageChange(page + 1)}
        disabled={!hasNextPage}
        className={`p-2 rounded-lg flex items-center ${
          hasNextPage
            ? 'text-gray-700 hover:bg-gray-100'
            : 'text-gray-400 cursor-not-allowed'
        }`}
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
}
