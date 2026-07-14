'use client';

import { Plus } from 'lucide-react';
import useProductsMain from '@/hooks/admin/products/useProductsMain';
import ProductsStats from '@/components/features/admin/products/ProductsStats';
import ProductsTable from '@/components/features/admin/products/ProductsTable';
import ProductDrawer from '@/components/features/admin/products/ProductDrawer';
import ErrorModal from '@/components/features/admin/common/ErrorModal';
import Alert from '@/components/features/admin/common/Alert';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/api/product';
import { MESSAGES } from '@/constants/messages';

interface ProductsMainProps {
  initialProducts: Product[];
}

function ProductsMain({ initialProducts }: ProductsMainProps) {
  const { listHooks, formHooks, errorModalHooks, stats } = useProductsMain({
    initialProducts,
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Products 設定
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            公開サイトに掲載する制作物・プロダクトを管理します。
          </p>
        </div>
        <Button size="lg" onClick={formHooks.openCreate}>
          <Plus />
          プロダクトを追加
        </Button>
      </div>

      <div className="mb-6">
        <ProductsStats
          total={stats.total}
          published={stats.published}
          unpublished={stats.unpublished}
        />
      </div>

      <ProductsTable listHooks={listHooks} onEdit={formHooks.openEdit} />

      <ProductDrawer formHooks={formHooks} />

      <ErrorModal
        isOpen={errorModalHooks.isOpen}
        errorMessage={errorModalHooks.errorMessage}
        onClose={errorModalHooks.onClose}
      />
      <Alert
        open={listHooks.deleteTarget !== null}
        onOpenChange={(next) => {
          if (!next) listHooks.closeDelete();
        }}
        title={MESSAGES.confirm.deleteProduct.title}
        description={MESSAGES.confirm.deleteProduct.description}
        actionText="削除"
        onAction={listHooks.confirmDelete}
      />
    </div>
  );
}

export default ProductsMain;
