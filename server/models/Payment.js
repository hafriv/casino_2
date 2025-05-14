const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 100,
    max: 15000
  },
  paymentSystem: {
    type: String,
    required: true,
    enum: ['card', 'qiwi', 'yoomoney']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

// Индексы для оптимизации запросов
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ paymentId: 1 }, { unique: true });
paymentSchema.index({ createdAt: 1 });

// Метод для обновления статуса платежа
paymentSchema.methods.updateStatus = async function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'completed') {
    this.completedAt = new Date();
  }
  return this.save();
};

// Статический метод для получения платежей пользователя
paymentSchema.statics.getUserPayments = function(userId, limit = 10, skip = 0) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Статический метод для получения статистики платежей
paymentSchema.statics.getPaymentStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  return stats.reduce((acc, stat) => {
    acc[stat._id] = {
      count: stat.count,
      totalAmount: stat.totalAmount
    };
    return acc;
  }, {});
};

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment; 