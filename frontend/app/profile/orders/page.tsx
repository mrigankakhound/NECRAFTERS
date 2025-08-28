"use client";

import { Tabs } from "@/components/ui/tabs";
import { TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { XCircle, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { FaLink } from "react-icons/fa";
import Link from "next/link";

interface OrderProduct {
  productId: string;
  name: string;
  image: string;
  size: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  products: OrderProduct[];
  paymentMethod: string;
  total: number;
  status: string;
  isPaid: boolean;
  createdAt: Date;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === "paid") return order.isPaid;
    if (activeTab === "unpaid") return !order.isPaid;
    return true; // "all" tab
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchOrders}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <FaLink className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet. Start shopping to see your order history here!
          </p>
          <Link href="/">
            <button className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90">
              Start Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page heading */}
      <h1 className="heading text-center mb-6">MY ORDERS</h1>

      {/* Tabs to filter orders based on their payment status */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="paid">Paid Orders ({orders.filter(o => o.isPaid).length})</TabsTrigger>
          <TabsTrigger value="unpaid">Unpaid Orders ({orders.filter(o => !o.isPaid).length})</TabsTrigger>
        </TabsList>

        {/* Tab content to display filtered orders */}
        <TabsContent value={activeTab} className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No {activeTab === "all" ? "" : activeTab} orders found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="text-black">
                  <TableHead className="w-[250px]">Order Id</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>View</TableHead>
                </TableRow>
              </TableHeader>

              {/* Table body displaying each order */}
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    {/* Order ID with a clickable link to view order details */}
                    <TableCell className="font-medium underline text-blue-500">
                      <Link href={`/order/${order.id}`}>{order.id}</Link>
                    </TableCell>

                    {/* Displaying product images for each order */}
                    <TableCell>
                      <div className="flex space-x-2">
                        {order.products.slice(0, 3).map((product, index) => (
                          <img
                            key={index}
                            src={product.image}
                            alt={product.name}
                            className="rounded-full bg-gray-200 w-[40px] h-[40px] object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/images/placeholder-product.png';
                            }}
                          />
                        ))}
                        {order.products.length > 3 && (
                          <div className="w-[40px] h-[40px] bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600">
                            +{order.products.length - 3}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Payment method used for the order */}
                    <TableCell>{order.paymentMethod}</TableCell>

                    {/* Total amount for the order */}
                    <TableCell className="font-semibold">₹{order.total.toFixed(2)}</TableCell>

                    {/* Order status */}
                    <TableCell>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </div>
                    </TableCell>

                    {/* Order date */}
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </TableCell>

                    {/* Link to view more details about the order */}
                    <TableCell>
                      <Link href={`/order/${order.id}`}>
                        <button className="text-blue-500 hover:text-blue-700">
                          <FaLink size={20} />
                        </button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersPage;
