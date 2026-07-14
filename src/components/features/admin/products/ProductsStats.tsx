interface ProductsStatsProps {
  total: number;
  published: number;
  unpublished: number;
}

/** プロダクトの公開状況サマリ */
function ProductsStats({ total, published, unpublished }: ProductsStatsProps) {
  const items = [
    { label: '総数', value: total, className: 'text-foreground' },
    { label: '公開中', value: published, className: 'text-emerald-600' },
    { label: '非公開', value: unpublished, className: 'text-muted-foreground' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border bg-card p-4 shadow-sm"
        >
          <p className="text-xs font-medium text-muted-foreground">
            {item.label}
          </p>
          <p
            className={`mt-1 text-2xl font-bold tracking-tight ${item.className}`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ProductsStats;
