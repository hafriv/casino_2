import React, { useState } from 'react';
import './PaymentModal.css';

const PAYMENT_SYSTEMS = [
  {
    id: 'card',
    name: 'Банковская карта',
    icon: '💳',
    minAmount: 100,
    maxAmount: 15000
  },
  {
    id: 'qiwi',
    name: 'QIWI',
    icon: '📱',
    minAmount: 100,
    maxAmount: 15000
  },
  {
    id: 'yoomoney',
    name: 'ЮMoney',
    icon: '💰',
    minAmount: 100,
    maxAmount: 15000
  }
];

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

export default function PaymentModal({ onClose, onSuccess }) {
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleAmountSelect = (value) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
      setAmount('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const finalAmount = customAmount || amount;
    if (!finalAmount) {
      setError('Выберите или введите сумму');
      return;
    }

    if (!selectedSystem) {
      setError('Выберите способ оплаты');
      return;
    }

    const amountNum = parseInt(finalAmount);
    const system = PAYMENT_SYSTEMS.find(s => s.id === selectedSystem);
    
    if (amountNum < system.minAmount || amountNum > system.maxAmount) {
      setError(`Сумма должна быть от ${system.minAmount} до ${system.maxAmount} ₽`);
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountNum,
          paymentSystem: selectedSystem
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании платежа');
      }

      const data = await response.json();
      
      // Перенаправляем на страницу оплаты
      window.location.href = data.paymentUrl;
      
      onSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={e => e.stopPropagation()}>
        <button className="payment-modal-close" onClick={onClose}>×</button>
        
        <h2 className="payment-modal-title">Пополнение баланса</h2>
        
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="payment-systems">
            {PAYMENT_SYSTEMS.map(system => (
              <button
                key={system.id}
                type="button"
                className={`payment-system ${selectedSystem === system.id ? 'selected' : ''}`}
                onClick={() => setSelectedSystem(system.id)}
              >
                <span className="payment-system-icon">{system.icon}</span>
                <span className="payment-system-name">{system.name}</span>
              </button>
            ))}
          </div>

          <div className="payment-amounts">
            <div className="preset-amounts">
              {PRESET_AMOUNTS.map(preset => (
                <button
                  key={preset}
                  type="button"
                  className={`amount-preset ${amount === preset ? 'selected' : ''}`}
                  onClick={() => handleAmountSelect(preset)}
                >
                  {preset} ₽
                </button>
              ))}
            </div>
            
            <div className="custom-amount">
              <input
                type="text"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Другая сумма"
                className="custom-amount-input"
              />
              <span className="currency">₽</span>
            </div>
          </div>

          {error && <div className="payment-error">{error}</div>}

          <button
            type="submit"
            className="payment-submit"
            disabled={isProcessing}
          >
            {isProcessing ? 'Обработка...' : 'Пополнить'}
          </button>
        </form>
      </div>
    </div>
  );
} 