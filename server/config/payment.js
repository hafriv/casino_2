module.exports = {
  // Настройки для банковских карт (например, Stripe)
  card: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publicKey: process.env.STRIPE_PUBLIC_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    currency: 'RUB',
    minAmount: 100,
    maxAmount: 15000
  },

  // Настройки для QIWI
  qiwi: {
    apiKey: process.env.QIWI_API_KEY,
    secretKey: process.env.QIWI_SECRET_KEY,
    webhookSecret: process.env.QIWI_WEBHOOK_SECRET,
    currency: 'RUB',
    minAmount: 100,
    maxAmount: 15000
  },

  // Настройки для ЮMoney
  yoomoney: {
    shopId: process.env.YOOMONEY_SHOP_ID,
    secretKey: process.env.YOOMONEY_SECRET_KEY,
    webhookSecret: process.env.YOOMONEY_WEBHOOK_SECRET,
    currency: 'RUB',
    minAmount: 100,
    maxAmount: 15000
  },

  // Общие настройки
  general: {
    // URL для webhook'ов
    webhookUrl: process.env.PAYMENT_WEBHOOK_URL || 'https://your-domain.com/api/payments/webhook',
    
    // URL для возврата после оплаты
    successUrl: process.env.PAYMENT_SUCCESS_URL || 'https://your-domain.com/profile?payment=success',
    failUrl: process.env.PAYMENT_FAIL_URL || 'https://your-domain.com/profile?payment=fail',
    
    // Таймаут для ожидания оплаты (в минутах)
    paymentTimeout: 30,
    
    // Комиссия платежной системы (в процентах)
    commission: {
      card: 2.5,
      qiwi: 2.0,
      yoomoney: 2.0
    }
  }
}; 