"use client";

import { useEffect, useState } from "react";
import { getAvailableCoupons } from "@/app/actions/coupons";
import { format } from "date-fns";
import { Tag, Copy } from "lucide-react";
import { toast } from "sonner";

interface CouponListProps {
  onSelectCoupon: (coupon: string) => void;
}

interface Coupon {
  id: string;
  coupon: string;
  startDate: string;
  endDate: string;
  discount: number;
}

export default function CouponList({ onSelectCoupon }: CouponListProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const result = await getAvailableCoupons();
        if (result.success && result.data) {
          setCoupons(result.data);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const handleCouponClick = (coupon: string) => {
    onSelectCoupon(coupon);
    toast.success("Coupon code copied!");
  };

  if (loading) {
    return (
      <div className="mt-6 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-lg mb-3"></div>
        <div className="h-24 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="mt-6 text-center py-6 bg-gray-50 rounded-lg">
        <Tag className="h-6 w-6 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-500">No active coupons available</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <Tag className="h-5 w-5" />
        Available Coupons
      </h3>
      <div className="space-y-3">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-primary/20 transition-colors cursor-pointer group"
            onClick={() => handleCouponClick(coupon.coupon)}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{coupon.coupon}</p>
                  <Copy className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {coupon.discount}% off on your order
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Valid till {format(new Date(coupon.endDate), "dd MMM yyyy")}
                </p>
              </div>
              <div className="text-lg font-bold text-primary">
                {coupon.discount}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
