
import React, { useState } from 'react';
import { initialOrders, couriers } from '../../data/mockData';

const OrdersPage = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  );

  const updateStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const assignCourier = (orderId, courierName) => {
    setOrders(orders.map(order =>
      order.id === orderId 
        ? { ...order, courier: courierName || null } 
        : order
    ));
  };

  const getStatusBadge = (status) => {
    const config = {
      new: { label: 'Нове', class: 'bg-yellow-100 text-yellow-700' },
      assigned: { label: 'Призначено', class: 'bg-blue-100 text-blue-700' },
      delivered: { label: 'Доставлено', class: 'bg-green-100 text-green-700' },
      cancelled: { label: 'Скасовано', class: 'bg-red-100 text-red-700' },
    };

    const { label, class: styleClass } = config[status] || { label: status, class: 'bg-gray-100 text-gray-700' };

    return (
      <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${styleClass}`}>
        {label}
      </span>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-900">Управління замовленнями</h2>
        
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Всі замовлення</option>
          <option value="new">Нові</option>
          <option value="assigned">Призначені</option>
          <option value="delivered">Доставлені</option>
          <option value="cancelled">Скасовані</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">ID замовлення</th>
              <th className="px-6 py-4 text-left">Дата</th>
              <th className="px-6 py-4 text-left">Клієнт</th>
              <th className="px-6 py-4 text-left">Телефон</th>
              <th className="px-6 py-4 text-left">Сума</th>
              <th className="px-6 py-4 text-left">Статус</th>
              <th className="px-6 py-4 text-left">Кур'єр</th>
              <th className="px-6 py-4 text-center">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-5 font-mono font-medium">{order.id}</td>
                <td className="px-6 py-5 text-gray-600">{order.date}</td>
                <td className="px-6 py-5 font-medium">{order.customer}</td>
                <td className="px-6 py-5 text-gray-600">{order.phone}</td>
                <td className="px-6 py-5 font-semibold text-emerald-600">
                  {order.total} ₴
                </td>
                <td className="px-6 py-5">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-6 py-5">
                  {order.courier ? (
                    <span className="font-medium text-gray-800">{order.courier}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="new">Нове</option>
                      <option value="assigned">Призначено</option>
                      <option value="delivered">Доставлено</option>
                      <option value="cancelled">Скасовано</option>
                    </select>

                    <select
                      value={order.courier || ''}
                      onChange={(e) => assignCourier(order.id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Не призначено</option>
                      {couriers.map((courier, index) => (
                        <option key={index} value={courier}>
                          {courier}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <p className="text-center text-gray-500 mt-10">Замовлень за вибраним фільтром не знайдено.</p>
      )}
    </div>
  );
};

export default OrdersPage;