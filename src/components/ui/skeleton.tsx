function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[#DEE2E6] dark:bg-darkBorderV1 ${className}`}
      {...props}
    />
  );
}

export { Skeleton };
