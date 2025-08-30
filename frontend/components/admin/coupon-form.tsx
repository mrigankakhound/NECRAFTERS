"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface CouponFormData {
  id?: string;
  coupon: string;
  startDate: string;
  endDate: string;
  discount: number;
  minimumOrderValue?: number;
  maxUsers?: number;
  perUserLimit: boolean;
  currentUserCount?: number;
}

interface CouponFormProps {
  initialData?: CouponFormData;
  onSubmit: (data: Partial<CouponFormData>) => Promise<void>;
  isEditing?: boolean;
}

export default function CouponForm({
  initialData,
  onSubmit,
  isEditing = false,
}: CouponFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CouponFormData>(
    initialData || {
      coupon: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      discount: 0,
      minimumOrderValue: undefined,
      maxUsers: undefined,
      perUserLimit: false,
      currentUserCount: 0,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.coupon) {
        throw new Error("Coupon code is required");
      }
      if (!formData.endDate) {
        throw new Error("End date is required");
      }
      if (formData.discount <= 0 || formData.discount > 100) {
        throw new Error("Discount must be between 0 and 100");
      }
      if (formData.minimumOrderValue && formData.minimumOrderValue < 0) {
        throw new Error("Minimum order value cannot be negative");
      }
      if (formData.maxUsers && formData.maxUsers < 1) {
        throw new Error("Maximum users must be at least 1");
      }

      await onSubmit(formData);
      
      if (!isEditing) {
        // Reset form for new coupon creation
        setFormData({
          coupon: "",
          startDate: new Date().toISOString().split("T")[0],
          endDate: "",
          discount: 0,
          minimumOrderValue: undefined,
          maxUsers: undefined,
          perUserLimit: false,
          currentUserCount: 0,
        });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="coupon">Coupon Code</Label>
          <Input
            id="coupon"
            value={formData.coupon}
            onChange={(e) =>
              setFormData({ ...formData, coupon: e.target.value.toUpperCase() })
            }
            placeholder="e.g., SUMMER2024"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount">Discount Percentage</Label>
          <Input
            id="discount"
            type="number"
            min="0"
            max="100"
            value={formData.discount}
            onChange={(e) =>
              setFormData({ ...formData, discount: Number(e.target.value) })
            }
            placeholder="e.g., 10"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minimumOrderValue">Minimum Order Value (₹)</Label>
          <Input
            id="minimumOrderValue"
            type="number"
            min="0"
            value={formData.minimumOrderValue || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                minimumOrderValue: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder="Optional"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxUsers">Maximum Number of Users</Label>
          <Input
            id="maxUsers"
            type="number"
            min="1"
            value={formData.maxUsers || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxUsers: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder="e.g., 10, 50, 100"
            disabled={loading}
          />
          <p className="text-sm text-gray-500">
            Set how many unique users can use this coupon
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="perUserLimit"
            checked={formData.perUserLimit}
            onChange={(e) =>
              setFormData({ ...formData, perUserLimit: e.target.checked })
            }
            disabled={loading}
          />
          <Label htmlFor="perUserLimit">One-time use per user</Label>
        </div>

        {isEditing && typeof formData.currentUserCount !== 'undefined' && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Current Usage: {formData.currentUserCount}
              {formData.maxUsers &&
                ` / ${formData.maxUsers} (${
                  formData.maxUsers - formData.currentUserCount
                } remaining)`}
            </p>
          </div>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Loading..." : isEditing ? "Update Coupon" : "Create Coupon"}
      </Button>
    </form>
  );
}