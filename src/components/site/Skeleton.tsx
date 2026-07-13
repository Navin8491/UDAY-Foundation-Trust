"use client";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200/70 dark:bg-slate-800/70 rounded-lg ${className}`} />
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen py-16 px-4 flex flex-col gap-8 container-page">
      {/* Hero Skeleton */}
      <div className="h-64 w-full rounded-[2rem] animate-pulse bg-slate-200/50 dark:bg-slate-800/50" />
      {/* Body Skeleton */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="col-span-2 flex flex-col gap-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-48 w-full mt-4" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full mt-4" />
        </div>
      </div>
    </div>
  );
}
