"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import CouponForm from "@/components/admin/coupon-form";
import CouponList from "@/components/admin/coupon-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Coupon {
  id: string;
  coupon: string;
  startDate: string;
  endDate: string;
  discount: number;
  minimumOrderValue?: number;
  maxUsers?: number;
  perUserLimit: boolean;
  currentUserCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function CouponsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch coupons on mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch("/api/admin/coupons");
      if (!response.ok) {
        throw new Error("Failed to fetch coupons");
      }
      const data = await response.json();
      setCoupons(data);
    } catch (error) {
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: Partial<Coupon>) => {
    try {
      const response = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create coupon");
      }

      const newCoupon = await response.json();
      setCoupons((prev) => [...prev, newCoupon]);
      setIsCreating(false);
      toast.success("Coupon created successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create coupon");
    }
  };

  const handleEdit = async (id: string, data: Partial<Coupon>) => {
    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update coupon");
      }

      const updatedCoupon = await response.json();
      setCoupons((prev) => prev.map((c) => (c.id === id ? updatedCoupon : c)));
      toast.success("Coupon updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update coupon");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete coupon");
      }

      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast.success("Coupon deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete coupon");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Coupons</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      {coupons.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No coupons found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setIsCreating(true)}
          >
            Create your first coupon
          </Button>
        </div>
      ) : (
        <CouponList
          coupons={coupons}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Coupon</DialogTitle>
          </DialogHeader>
          <CouponForm onSubmit={handleCreate} />
        </DialogContent>
      </Dialog>
    </div>
  );
}