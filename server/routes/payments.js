const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/Payment');
const User = require('../models/User');

// Создание нового платежа
router.post('/create', async (req, res) => {
  try {
    const { amount, paymentSystem } = req.body;
    const userId = req.user.id; // Получаем из middleware аутентификации

    // Создаем новый платеж
    const payment = new Payment({
      userId,
      amount,
      paymentSystem,
      status: 'pending',
      paymentId: uuidv4()
    });

    await payment.save();

    // Генерируем URL для оплаты в зависимости от платежной системы
    let paymentUrl;
    switch (paymentSystem) {
      case 'card':
        paymentUrl = await generateCardPaymentUrl(payment);
        break;
      case 'qiwi':
        paymentUrl = await generateQiwiPaymentUrl(payment);
        break;
      case 'yoomoney':
        paymentUrl = await generateYooMoneyPaymentUrl(payment);
        break;
      default:
        throw new Error('Неподдерживаемая платежная система');
    }

    res.json({
      success: true,
      paymentId: payment.paymentId,
      paymentUrl
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при создании платежа'
    });
  }
});

// Webhook для обработки уведомлений от платежных систем
router.post('/webhook', async (req, res) => {
  try {
    const { paymentId, status, signature } = req.body;

    // Проверяем подпись
    if (!verifyPaymentSignature(req.body, signature)) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (status === 'success') {
      // Обновляем статус платежа
      payment.status = 'completed';
      await payment.save();

      // Пополняем баланс пользователя
      const user = await User.findById(payment.userId);
      if (user) {
        user.balance += payment.amount;
        await user.save();
      }
    } else if (status === 'failed') {
      payment.status = 'failed';
      await payment.save();
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Получение статуса платежа
router.get('/status/:paymentId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ paymentId: req.params.paymentId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({
      success: true,
      status: payment.status,
      amount: payment.amount
    });
  } catch (error) {
    console.error('Payment status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Вспомогательные функции для генерации URL платежей
async function generateCardPaymentUrl(payment) {
  // Здесь должна быть интеграция с API банковских карт
  // Например, Stripe, CloudPayments и т.д.
  return `https://payment-gateway.com/pay/${payment.paymentId}`;
}

async function generateQiwiPaymentUrl(payment) {
  // Интеграция с QIWI API
  return `https://qiwi.com/payment/${payment.paymentId}`;
}

async function generateYooMoneyPaymentUrl(payment) {
  // Интеграция с ЮMoney API
  return `https://yoomoney.ru/payment/${payment.paymentId}`;
}

function verifyPaymentSignature(data, signature) {
  // Здесь должна быть проверка подписи от платежной системы
  // Для каждой системы своя логика проверки
  return true; // Заглушка
}

module.exports = router; 