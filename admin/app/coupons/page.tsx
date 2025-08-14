"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

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

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [formData, setFormData] = useState({
    coupon: "",
    discount: "",
    startDate: "",
    endDate: "",
    minimumOrderValue: "",
    maxUsers: "",
    perUserLimit: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          discount: Number(formData.discount),
          minimumOrderValue: formData.minimumOrderValue ? Number(formData.minimumOrderValue) : undefined,
          maxUsers: formData.maxUsers ? Number(formData.maxUsers) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create coupon");
      }

      const newCoupon = await response.json();
      setCoupons([...coupons, newCoupon]);
      setFormData({
        coupon: "",
        discount: "",
        startDate: "",
        endDate: "",
        minimumOrderValue: "",
        maxUsers: "",
        perUserLimit: false,
      });
      toast.success("Coupon created successfully!");
    } catch (error) {
      toast.error("Failed to create coupon");
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Coupon</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coupon">Coupon Code</Label>
                <Input
                  id="coupon"
                  placeholder="Enter coupon code"
                  value={formData.coupon}
                  onChange={(e) =>
                    setFormData({ ...formData, coupon: e.target.value.toUpperCase() })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  placeholder="Enter discount percentage"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumOrderValue">Minimum Order Value (₹)</Label>
                <Input
                  id="minimumOrderValue"
                  type="number"
                  placeholder="Optional"
                  min="0"
                  value={formData.minimumOrderValue}
                  onChange={(e) =>
                    setFormData({ ...formData, minimumOrderValue: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxUsers">Maximum Users</Label>
                <Input
                  id="maxUsers"
                  type="number"
                  placeholder="Optional (e.g., 100)"
                  min="1"
                  value={formData.maxUsers}
                  onChange={(e) =>
                    setFormData({ ...formData, maxUsers: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="perUserLimit"
                checked={formData.perUserLimit}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, perUserLimit: checked })
                }
              />
              <Label htmlFor="perUserLimit">One-time use per user</Label>
            </div>

            <Button type="submit" className="w-full">
              Create Coupon
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coupon Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Valid Period</TableHead>
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
                  coupon.maxUsers && coupon.currentUserCount >= coupon.maxUsers;

                return (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-medium">{coupon.coupon}</TableCell>
                    <TableCell>{coupon.discount}%</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>From: {new Date(coupon.startDate).toLocaleDateString()}</p>
                        <p>To: {new Date(coupon.endDate).toLocaleDateString()}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {coupon.minimumOrderValue
                        ? `₹${coupon.minimumOrderValue}`
                        : "-"}
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
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            // Handle edit
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => {
                            // Handle delete
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}