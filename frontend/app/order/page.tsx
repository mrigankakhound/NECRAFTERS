"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Loader2, Package, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface OrderProduct {
  productId: string;
  name: string;
  image: string;
  size: string;
  qty: number;
  price: number;
}

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

interface Order {
  id: string;
  userId: string;
  products: OrderProduct[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  total: number;
  totalBeforeDiscount?: number;
  couponApplied?: string;
  totalSaved?: number;
  shippingPrice: number;
  taxPrice?: number;
  status: string;
  isPaid: boolean;
  paidAt?: Date;
  createdAt: Date;
  user: {
    username: string;
    email: string;
  };
}

const OrderPage = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchLatestOrder();
  }, []);

  const fetchLatestOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders/latest');
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("No orders found");
        } else {
          throw new Error('Failed to fetch order');
        }
        return;
      }

      const data = await response.json();
      setOrder(data.order);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h2>
          <p className="text-gray-600 mb-6">
            {error === "No orders found" 
              ? "You haven't placed any orders yet. Start shopping to see your order details here!"
              : "There was an error loading your order details. Please try again later."}
          </p>
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full">Start Shopping</Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" className="w-full">View Profile</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-full mx-auto bg-white shadow-md">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Back to Home link */}
            <div className="flex items-center mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <Link href="/" className="text-sm font-medium hover:text-primary">
                Back to Home
              </Link>
            </div>

            {/* Thank You message and Order ID */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">
                THANK YOU {order.user.username}
              </h1>
              <p className="text-gray-600">Order ID: {order.id}</p>
            </div>

            {/* Order Details Section */}
            <div className="mb-6 border rounded-lg overflow-hidden">
              <div className="flex flex-wrap">
                {/* Order number */}
                <div className="w-full sm:w-1/2 md:w-1/4 p-4 border-b sm:border-b-0 sm:border-r">
                  <div className="font-semibold text-sm mb-1">
                    ORDER NUMBER:
                  </div>
                  <div className="font-mono text-sm">{order.id}</div>
                </div>

                {/* Order status */}
                <div className="w-full sm:w-1/2 md:w-1/4 p-4 border-b sm:border-b-0 sm:border-r">
                  <div className="font-semibold text-sm mb-1">
                    ORDER STATUS:
                  </div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </div>
                </div>

                {/* Order date */}
                <div className="w-full sm:w-1/2 md:w-1/4 p-4 border-b md:border-b-0 md:border-r">
                  <div className="font-semibold text-sm mb-1">DATE:</div>
                  <div>{formatDate(order.createdAt)}</div>
                </div>

                {/* Customer email */}
                <div className="w-full sm:w-1/2 md:w-1/4 p-4 border-b sm:border-b-0 sm:border-r">
                  <div className="font-semibold text-sm mb-1">EMAIL:</div>
                  <div className="truncate">{order.user.email}</div>
                </div>

                {/* Total amount */}
                <div className="w-full sm:w-1/2 md:w-1/4 p-4">
                  <div className="font-semibold text-sm mb-1">TOTAL:</div>
                  <div className="text-lg font-bold text-primary">₹{order.total.toFixed(2)}</div>
                </div>
              </div>

              {/* Payment method */}
              <div className="border-t p-4">
                <div className="font-semibold text-sm mb-1">
                  PAYMENT METHOD:
                </div>
                <div className="flex items-center justify-between">
                  <span>{order.paymentMethod}</span>
                  {order.isPaid && order.paidAt && (
                    <div className="text-sm text-green-600">
                      Paid on {formatDate(order.paidAt)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order confirmation and delivery information */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                {/* Confirmation message */}
                <div className="flex items-center mb-4">
                  <CheckCircle2 className="w-[50px] h-[50px] text-green-500 mr-2 flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-semibold">
                      Your order is confirmed
                    </h2>
                    <p className="text-gray-600">
                      Order will be delivered to you in 2-3 days on the
                      following address
                    </p>
                  </div>
                </div>

                {/* Shipping address */}
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </span>
                    <span className="text-gray-600">
                      {order.shippingAddress.phoneNumber}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.address1}
                    {order.shippingAddress.address2 && (
                      <>
                        <br />
                        {order.shippingAddress.address2}
                      </>
                    )}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                    <br />
                    PIN Code: {order.shippingAddress.zipCode}
                    <br />
                    {order.shippingAddress.country}
                  </p>
                </div>

                {/* Ordered items list */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">
                      {order.products.length} Item{order.products.length > 1 ? 's' : ''}
                    </span>
                    <span className="font-medium">
                      ₹{order.totalBeforeDiscount?.toFixed(2) || order.total.toFixed(2)}
                    </span>
                  </div>

                  {/* Product details */}
                  <div className="space-y-4">
                    {order.products.map((product, index) => (
                      <div key={index} className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="mr-4 w-[60px] h-[60px] object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder-product.png';
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-600">
                            {product.size} • Qty {product.qty}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="font-medium mr-2">
                              ₹{product.price.toFixed(2)}
                            </span>
                            {order.totalBeforeDiscount && order.totalBeforeDiscount > order.total && (
                              <span className="text-sm text-green-600">
                                {Math.round(((order.totalBeforeDiscount - order.total) / order.totalBeforeDiscount) * 100)}% off
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Billing and Savings Section */}
              <div className="flex-1">
                {order.totalSaved && order.totalSaved > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-green-700">
                        Yay! You have saved ₹{order.totalSaved.toFixed(2)} on this order
                      </span>
                    </div>
                  </div>
                )}

                {/* Bill details */}
                <div className="bg-gray-100 rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-4">Bill Details</h2>
                  <div className="space-y-2">
                    {/* Total MRP */}
                    <div className="flex justify-between">
                      <span>Total MRP</span>
                      <span>₹{order.totalBeforeDiscount?.toFixed(2) || order.total.toFixed(2)}</span>
                    </div>

                    {/* Total discount */}
                    {order.totalSaved && order.totalSaved > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Total Discount</span>
                        <span>- ₹{order.totalSaved.toFixed(2)}</span>
                      </div>
                    )}

                    {/* Shipping charges */}
                    <div className="flex justify-between">
                      <span>Shipping Charges</span>
                      <span>₹{order.shippingPrice.toFixed(2)}</span>
                    </div>

                    {/* Tax */}
                    {order.taxPrice && order.taxPrice > 0 && (
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>₹{order.taxPrice.toFixed(2)}</span>
                      </div>
                    )}

                    {/* Subtotal */}
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total Amount</span>
                      <span>₹{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3 mt-4">
                  <Link href="/">
                    <Button className="w-full">CONTINUE SHOPPING</Button>
                  </Link>
                  <Link href="/profile/orders">
                    <Button variant="outline" className="w-full">VIEW ALL ORDERS</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
