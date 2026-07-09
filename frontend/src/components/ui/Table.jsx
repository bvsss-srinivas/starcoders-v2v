import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function Table({ className, children, ...props }) {
  return (
    <div className="relative w-full overflow-auto rounded-md border border-[var(--color-brand-border)]">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children, ...props }) {
  return (
    <thead className={cn("sticky top-0 bg-[var(--color-brand-background)] border-b border-[var(--color-brand-border)]", className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }) {
  return (
    <tbody className={cn("bg-white", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ className, children, ...props }) {
  return (
    <tr
      className={cn(
        "border-b border-[var(--color-brand-border)] transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50 group",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ className, sortable, sortDirection, onSort, children, ...props }) {
  return (
    <th
      className={cn(
        "h-10 px-4 text-left align-middle font-medium text-[var(--color-brand-text-muted)]",
        sortable && "cursor-pointer select-none hover:text-[var(--color-brand-text)]",
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && (
          <span className="flex flex-col">
            <ChevronUp className={cn("h-3 w-3 -mb-1 text-gray-300", sortDirection === 'asc' && "text-[var(--color-brand-primary)]")} />
            <ChevronDown className={cn("h-3 w-3 text-gray-300", sortDirection === 'desc' && "text-[var(--color-brand-primary)]")} />
          </span>
        )}
      </div>
    </th>
  );
}

export function TableCell({ className, numeric, children, ...props }) {
  return (
    <td
      className={cn(
        "p-4 align-middle text-[var(--color-brand-text)]",
        numeric && "text-right tabular-data",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}

// For row-level actions revealed on hover
export function TableActions({ className, children }) {
  return (
    <div className={cn("flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity", className)}>
      {children}
    </div>
  );
}
