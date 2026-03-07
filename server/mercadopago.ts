const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN || "";
const MERCADO_PAGO_API = "https://api.mercadopago.com";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
    "X-Idempotency-Key": crypto.randomUUID(),
  };
}

export function isMercadoPagoConfigured(): boolean {
  return !!MERCADO_PAGO_ACCESS_TOKEN;
}

export async function createPixPayment(params: {
  amount: number;
  description: string;
  externalReference: string;
  payerEmail: string;
  payerName: string;
  notificationUrl?: string;
}) {
  const body: any = {
    transaction_amount: params.amount,
    description: params.description,
    payment_method_id: "pix",
    external_reference: params.externalReference,
    payer: {
      email: params.payerEmail,
      first_name: params.payerName,
    },
  };
  if (params.notificationUrl) {
    body.notification_url = params.notificationUrl;
  }

  const res = await fetch(`${MERCADO_PAGO_API}/v1/payments`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Mercado Pago PIX error: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  return {
    id: data.id?.toString(),
    status: data.status,
    qrCode: data.point_of_interaction?.transaction_data?.qr_code,
    qrCodeBase64: data.point_of_interaction?.transaction_data?.qr_code_base64,
    ticketUrl: data.point_of_interaction?.transaction_data?.ticket_url,
  };
}

export async function createCardPayment(params: {
  amount: number;
  description: string;
  externalReference: string;
  token: string;
  installments: number;
  payerEmail: string;
  payerName: string;
  payerDocType: string;
  payerDocNumber: string;
  notificationUrl?: string;
}) {
  const body: any = {
    transaction_amount: params.amount,
    description: params.description,
    payment_method_id: "credit_card",
    token: params.token,
    installments: params.installments,
    external_reference: params.externalReference,
    payer: {
      email: params.payerEmail,
      first_name: params.payerName,
      identification: {
        type: params.payerDocType,
        number: params.payerDocNumber,
      },
    },
  };
  if (params.notificationUrl) {
    body.notification_url = params.notificationUrl;
  }

  const res = await fetch(`${MERCADO_PAGO_API}/v1/payments`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Mercado Pago Card error: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  return {
    id: data.id?.toString(),
    status: data.status,
    statusDetail: data.status_detail,
  };
}

export async function getPayment(paymentId: string) {
  const res = await fetch(`${MERCADO_PAGO_API}/v1/payments/${paymentId}`, {
    headers: {
      "Authorization": `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Mercado Pago get payment error: ${JSON.stringify(err)}`);
  }

  return await res.json();
}
