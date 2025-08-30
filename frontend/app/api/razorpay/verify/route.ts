import { NextResponse } from "next/server";
import crypto from "crypto";
import { createOrder } from "@/app/actions/orders";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    // Initialize Razorpay instance inside the function
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderData,
    } = await request.json();

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    // Verify payment status
    if (payment.status !== 'captured') {
      return NextResponse.json(
        { error: "Payment not captured" },
        { status: 400 }
      );
    }

    // Create order in database with detailed payment information
    const result = await createOrder({
      ...orderData,
      isPaid: true,
      paidAt: new Date(),
      paymentResult: {
        id: razorpay_payment_id,
        status: "completed",
        update_time: new Date().toISOString(),
        email: payment.email,
        payer: {
          email: payment.email,
          name: payment.contact,
          phone: payment.contact,
        },
      },
      razorpay_order_id,
      razorpay_payment_id,
      paymentDetails: {
        method: payment.method,
        bank: payment.bank,
        wallet: payment.wallet,
        vpa: payment.vpa,
        acquirer_data: payment.acquirer_data,
      },
    });

    if (result.error || !result.data) {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: result.data.id,
      payment: {
        id: payment.id,
        method: payment.method,
        amount: payment.amount,
        status: payment.status,
        created_at: payment.created_at,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
