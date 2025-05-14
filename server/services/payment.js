const config = require('../config/payment');
const Payment = require('../models/Payment');
const User = require('../models/User');

class PaymentService {
  // Создание платежа
  static async createPayment(userId, amount, paymentSystem) {
    try {
      // Проверяем лимиты
      const systemConfig = config[paymentSystem];
      if (amount < systemConfig.minAmount || amount > systemConfig.maxAmount) {
        throw new Error(`Сумма должна быть от ${systemConfig.minAmount} до ${systemConfig.maxAmount} ₽`);
      }

      // Создаем платеж в базе
      const payment = new Payment({
        userId,
        amount,
        paymentSystem,
        status: 'pending'
      });

      await payment.save();

      // Генерируем URL для оплаты
      const paymentUrl = await this.generatePaymentUrl(payment);

      return {
        success: true,
        paymentId: payment.paymentId,
        paymentUrl
      };
    } catch (error) {
      console.error('Payment creation error:', error);
      throw error;
    }
  }

  // Генерация URL для оплаты
  static async generatePaymentUrl(payment) {
    const systemConfig = config[payment.paymentSystem];
    
    switch (payment.paymentSystem) {
      case 'card':
        return await this.generateCardPaymentUrl(payment, systemConfig);
      case 'qiwi':
        return await this.generateQiwiPaymentUrl(payment, systemConfig);
      case 'yoomoney':
        return await this.generateYooMoneyPaymentUrl(payment, systemConfig);
      default:
        throw new Error('Неподдерживаемая платежная система');
    }
  }

  // Обработка webhook'а от платежной системы
  static async handleWebhook(paymentSystem, data, signature) {
    try {
      // Проверяем подпись
      if (!this.verifySignature(paymentSystem, data, signature)) {
        throw new Error('Invalid signature');
      }

      const payment = await Payment.findOne({ paymentId: data.paymentId });
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (data.status === 'success') {
        await this.handleSuccessfulPayment(payment);
      } else if (data.status === 'failed') {
        await payment.updateStatus('failed');
      }

      return { success: true };
    } catch (error) {
      console.error('Webhook handling error:', error);
      throw error;
    }
  }

  // Обработка успешного платежа
  static async handleSuccessfulPayment(payment) {
    const session = await Payment.startSession();
    session.startTransaction();

    try {
      // Обновляем статус платежа
      await payment.updateStatus('completed');

      // Пополняем баланс пользователя
      const user = await User.findById(payment.userId);
      if (user) {
        user.balance += payment.amount;
        await user.save({ session });
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Проверка подписи от платежной системы
  static verifySignature(paymentSystem, data, signature) {
    const systemConfig = config[paymentSystem];
    
    switch (paymentSystem) {
      case 'card':
        return this.verifyCardSignature(data, signature, systemConfig);
      case 'qiwi':
        return this.verifyQiwiSignature(data, signature, systemConfig);
      case 'yoomoney':
        return this.verifyYooMoneySignature(data, signature, systemConfig);
      default:
        return false;
    }
  }

  // Вспомогательные методы для работы с конкретными платежными системами
  static async generateCardPaymentUrl(payment, config) {
    // Здесь должна быть интеграция с API банковских карт
    // Например, Stripe, CloudPayments и т.д.
    return `https://payment-gateway.com/pay/${payment.paymentId}`;
  }

  static async generateQiwiPaymentUrl(payment, config) {
    // Интеграция с QIWI API
    return `https://qiwi.com/payment/${payment.paymentId}`;
  }

  static async generateYooMoneyPaymentUrl(payment, config) {
    // Интеграция с ЮMoney API
    return `https://yoomoney.ru/payment/${payment.paymentId}`;
  }

  static verifyCardSignature(data, signature, config) {
    // Проверка подписи для банковских карт
    return true; // Заглушка
  }

  static verifyQiwiSignature(data, signature, config) {
    // Проверка подписи для QIWI
    return true; // Заглушка
  }

  static verifyYooMoneySignature(data, signature, config) {
    // Проверка подписи для ЮMoney
    return true; // Заглушка
  }
}

module.exports = PaymentService; 