"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { useCart } from "@/store/useCart";
import { validateCoupon } from "@/app/actions/coupons";


import {
  Truck,
  MapPin,
  Phone,
  User2,
  Building2,
  Home,
  IndianRupee,
  Tag,
  ShoppingBag,
  Banknote,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getAuthenticatedUserId } from "@/app/actions/auth";
import CouponList from "@/components/checkout/CouponList";

type PaymentMethod = "razorpay";

interface ShippingAddress {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CheckoutClientProps {
  initialShippingAddress: ShippingAddress | null;
}

export default function CheckoutClient({
  initialShippingAddress,
}: CheckoutClientProps) {
  const router = useRouter();
  const {
    items,
    subtotal,
    total,
    discount,
    appliedCoupon,
    clearCart,
    applyCoupon,
  } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(initialShippingAddress);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateShippingForm = (data: Record<string, string>) => {
    const errors: Record<string, string> = {};

    if (!data.firstName?.trim()) errors.firstName = "First name is required";
    if (!data.lastName?.trim()) errors.lastName = "Last name is required";
    if (!data.phoneNumber?.trim())
      errors.phoneNumber = "Phone number is required";
    else if (!/^\+?[\d\s-]{10,}$/.test(data.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number";
    }
    if (!data.address1?.trim()) errors.address1 = "Address is required";
    if (!data.city?.trim()) errors.city = "City is required";
    if (!data.state?.trim()) errors.state = "State is required";
    if (!data.zipCode?.trim()) errors.zipCode = "PIN code is required";
    else if (!/^\d{6}$/.test(data.zipCode)) {
      errors.zipCode = "Please enter a valid 6-digit PIN code";
    }
    if (!data.country?.trim()) errors.country = "Country is required";

    return errors;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const result = await validateCoupon(couponCode);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success && result.data) {
        // Apply the coupon to the cart
        applyCoupon({
          coupon: result.data.couponCode,
          discount: result.data.discount,
        });
        toast.success("Coupon applied successfully!");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("Failed to apply coupon");
    }
  };

  const initializeRazorpay = async () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);

    return new Promise((resolve) => {
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const shippingData = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        phoneNumber: formData.get("phoneNumber") as string,
        address1: formData.get("address1") as string,
        address2: formData.get("address2") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        zipCode: formData.get("zipCode") as string,
        country: formData.get("country") as string,
      };

      // Validate form
      const errors = validateShippingForm(shippingData);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setIsLoading(false);
        return;
      }
      setFormErrors({});

      // Save shipping address to database
      const addressResponse = await fetch("/api/user/shipping-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shippingData),
      });

      if (!addressResponse.ok) {
        throw new Error("Failed to save shipping address");
      }

      // Get user ID using server action
      const { userId, error } = await getAuthenticatedUserId();
      if (error || !userId) {
        toast.error("Please login to continue");
        router.push("/login");
        return;
      }

      const orderData = {
        userId,
        products: items.map((item) => ({
          productId: item.uid,
          name: item.name,
          image: item.image,
          size: item.size,
          qty: item.quantity,
          price: item.price,
        })),
        shippingAddress: shippingData,
        paymentMethod,
        total,
        totalBeforeDiscount: subtotal,
        couponApplied: appliedCoupon?.coupon || undefined,
        totalSaved: discount,
      };

      // Initialize Razorpay
      const res = await initializeRazorpay();
      if (!res) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      const razorpayResponse = await fetch("/api/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
        }),
      });

      const data = await razorpayResponse.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Number(data.amount), // Ensure amount is a number
        currency: "INR",
        name: "Your Store Name",
        description: "Thank you for your purchase",
        order_id: data.id,
        handler: async (response: any) => {
          const verifyResponse = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderData,
            }),
          });

          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            clearCart();
            toast.success("Payment successful and order placed!");
            router.push(`/order/${verifyData.orderId}`);
          }
        },
        prefill: {
          name: `${shippingData.firstName} ${shippingData.lastName}`,
          contact: shippingData.phoneNumber,
        },
        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong during checkout");
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return "Processing...";
    return `Pay ₹${total.toFixed(2)} with Razorpay`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-500">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Shipping Address
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-gray-700 font-medium"
                      >
                        <span className="flex items-center gap-2">
                          <User2 className="h-4 w-4" />
                          First Name
                        </span>
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        required
                        defaultValue={shippingAddress?.firstName}
                        className={`border-gray-200 focus:border-primary ${
                          formErrors.firstName ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.firstName && (
                        <p className="text-sm text-red-500">
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-gray-700 font-medium"
                      >
                        <span className="flex items-center gap-2">
                          <User2 className="h-4 w-4" />
                          Last Name
                        </span>
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        required
                        defaultValue={shippingAddress?.lastName}
                        className={`border-gray-200 focus:border-primary ${
                          formErrors.lastName ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.lastName && (
                        <p className="text-sm text-red-500">
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phoneNumber"
                      className="text-gray-700 font-medium"
                    >
                      <span className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      required
                      defaultValue={shippingAddress?.phoneNumber}
                      className={`border-gray-200 focus:border-primary ${
                        formErrors.phoneNumber ? "border-red-500" : ""
                      }`}
                    />
                    {formErrors.phoneNumber && (
                      <p className="text-sm text-red-500">
                        {formErrors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="address1"
                      className="text-gray-700 font-medium"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address
                      </span>
                    </Label>
                    <Input
                      id="address1"
                      name="address1"
                      required
                      defaultValue={shippingAddress?.address1}
                      className={`border-gray-200 focus:border-primary ${
                        formErrors.address1 ? "border-red-500" : ""
                      }`}
                    />
                    {formErrors.address1 && (
                      <p className="text-sm text-red-500">
                        {formErrors.address1}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="address2"
                      className="text-gray-700 font-medium"
                    >
                      <span className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Apartment, suite, etc. (optional)
                      </span>
                    </Label>
                    <Input
                      id="address2"
                      name="address2"
                      defaultValue={shippingAddress?.address2}
                      className="border-gray-200 focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="city"
                        className="text-gray-700 font-medium"
                      >
                        <span className="flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          City
                        </span>
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        required
                        defaultValue={shippingAddress?.city}
                        className={`border-gray-200 focus:border-primary ${
                          formErrors.city ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.city && (
                        <p className="text-sm text-red-500">
                          {formErrors.city}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="state"
                        className="text-gray-700 font-medium"
                      >
                        State
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        required
                        defaultValue={shippingAddress?.state}
                        className={`border-gray-200 focus:border-primary ${
                          formErrors.state ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.state && (
                        <p className="text-sm text-red-500">
                          {formErrors.state}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="zipCode"
                        className="text-gray-700 font-medium"
                      >
                        PIN Code
                      </Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        required
                        defaultValue={shippingAddress?.zipCode}
                        className={`border-gray-200 focus:border-primary ${
                          formErrors.zipCode ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.zipCode && (
                        <p className="text-sm text-red-500">
                          {formErrors.zipCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="country"
                      className="text-gray-700 font-medium"
                    >
                      Country
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      required
                      defaultValue={shippingAddress?.country || "India"}
                      className={`border-gray-200 focus:border-primary ${
                        formErrors.country ? "border-red-500" : ""
                      }`}
                    />
                    {formErrors.country && (
                      <p className="text-sm text-red-500">
                        {formErrors.country}
                      </p>
                    )}
                  </div>

                  <Separator className="my-8" />
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <IndianRupee className="h-6 w-6 text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Payment Method
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-primary bg-primary/5">
                        <input
                          type="radio"
                          checked={true}
                          readOnly
                          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary"
                        />
                        <Label className="flex items-center gap-2 cursor-pointer">
                          <IndianRupee className="h-5 w-5" />
                          <span>Razorpay</span>
                        </Label>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed">
                        <input
                          type="radio"
                          disabled
                          className="w-4 h-4 text-gray-400 bg-gray-100 border-gray-300 cursor-not-allowed"
                        />
                        <Label className="flex items-center gap-2 cursor-not-allowed text-gray-400">
                          <Banknote className="h-5 w-5" />
                          <span>Cash on Delivery</span>
                          <span className="text-xs text-red-500 ml-2">(Unavailable)</span>
                        </Label>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full py-6 text-lg mt-8"
                      disabled={isLoading || items.length === 0}
                    >
                      {getButtonText()}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-8">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.uid}
                      className="flex gap-4 py-4 border-b border-gray-100"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Size: {item.size}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                          <p className="font-medium">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="border-gray-200"
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim()}
                        className="shrink-0"
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        Apply
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({appliedCoupon.discount}%)</span>
                          <span>-₹{discount.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Coupon List */}
                    <CouponList onSelectCoupon={(code: string) => {
                      setCouponCode(code);
                      handleApplyCoupon();
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
