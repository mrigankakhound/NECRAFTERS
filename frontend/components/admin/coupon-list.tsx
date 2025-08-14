"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CouponForm from "./coupon-form";

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
}

interface CouponListProps {
  coupons: Coupon[];
  onEdit: (id: string, data: Partial<Coupon>) => void;
  onDelete: (id: string) => void;
}

export default function CouponList({
  coupons,
  onEdit,
  onDelete,
}: CouponListProps) {
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const handleEdit = async (data: Partial<Coupon>) => {
    if (editingCoupon) {
      await onEdit(editingCoupon.id, data);
      setEditingCoupon(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Validity</TableHead>
              <TableHead>Min. Order</TableHead>
              <TableHead>Usage / Limit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => {
              const isExpired = new Date(coupon.endDate) < new Date();
              const isLimitReached =
                coupon.globalUsageLimit &&
                coupon.currentUsageCount >= coupon.globalUsageLimit;

              return (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium">{coupon.coupon}</TableCell>
                  <TableCell>{coupon.discount}%</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>From: {format(new Date(coupon.startDate), "MMM d, yyyy")}</p>
                      <p>To: {format(new Date(coupon.endDate), "MMM d, yyyy")}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {coupon.minimumOrderValue
                      ? `₹${coupon.minimumOrderValue}`
                      : "None"}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>
                        {coupon.currentUserCount}
                        {coupon.maxUsers
                          ? ` / ${coupon.maxUsers} users`
                          : " users"}
                      </p>
                      {coupon.perUserLimit && (
                        <p className="text-gray-500">One-time per user</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                        isExpired
                          ? "bg-red-100 text-red-800"
                          : isLimitReached
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {isExpired
                        ? "Expired"
                        : isLimitReached
                        ? "Limit Reached"
                        : "Active"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        onClick={() => setEditingCoupon(coupon)}
                        size="icon"
                        variant="outline"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => onDelete(coupon.id)}
                        size="icon"
                        variant="outline"
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingCoupon} onOpenChange={(open) => !open && setEditingCoupon(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
          </DialogHeader>
          {editingCoupon && (
            <CouponForm
              initialData={editingCoupon}
              onSubmit={handleEdit}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}