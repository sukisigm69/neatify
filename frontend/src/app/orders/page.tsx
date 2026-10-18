"use client";

import { useEffect } from "react";
import { useOrderStore, Order } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderCard } from "@/components/OrderCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { EmptyState } from "@/components/EmptyState";
import { ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  const { orders, loading, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[72px]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-16 py-10">
          <div className="mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-on-surface">Pesanan Saya</h1>
            <p className="text-on-surface-variant mt-1.5 text-sm">Riwayat pembelian tiket</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} type="order" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              title="Belum ada pesanan"
              message="Riwayat pesanan akan muncul setelah kamu membeli tiket."
              icon={<ShoppingBag className="text-primary-container" size={24} />}
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order: Order) => (
                <OrderCard key={order.invoiceNumber} order={order} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
