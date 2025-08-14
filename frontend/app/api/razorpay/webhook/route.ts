import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const text = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(text)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(text);

    // Handle different event types
    switch (event.event) {
      case "payment.captured":
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      case "payment.failed":
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      case "refund.processed":
        await handleRefundProcessed(event.payload.refund.entity);
        break;
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentCaptured(payment: any) {
  const orderId = payment.notes?.orderId;
  if (!orderId) return;

  await prisma.order.update({
    where: { id: orderId },
    data: {
      isPaid: true,
      paidAt: new Date(),
      paymentResult: {
        id: payment.id,
        status: "completed",
        update_time: new Date().toISOString(),
        email: payment.email,
      },
      paymentDetails: {
        method: payment.method,
        bank: payment.bank,
        wallet: payment.wallet,
        vpa: payment.vpa,
        acquirer_data: payment.acquirer_data,
      },
    },
  });
}

async function handlePaymentFailed(payment: any) {
  const orderId = payment.notes?.orderId;
  if (!orderId) return;

  await prisma.order.update({
    where: { id: orderId },
    data: {
      isPaid: false,
      paymentResult: {
        id: payment.id,
        status: "failed",
        update_time: new Date().toISOString(),
        error_code: payment.error_code,
        error_description: payment.error_description,
      },
    },
  });
}

async function handleRefundProcessed(refund: any) {
  const orderId = refund.notes?.orderId;
  if (!orderId) return;

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "Refunded",
      refundDetails: {
        id: refund.id,
        amount: refund.amount,
        status: refund.status,
        speed_processed: refund.speed_processed,
        processed_at: new Date(refund.processed_at * 1000).toISOString(),
      },
    },
  });
}
