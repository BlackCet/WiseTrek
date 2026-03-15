import React from 'react';
import { DollarSign, Plane, Hotel, UtensilsCrossed, Activity, ShoppingBag, TrendingUp } from 'lucide-react';

export function BudgetBreakdown({ budget, total, currency }) {
  const getIcon = (iconName) => {
    switch (iconName?.toLowerCase()) {
      case 'plane': return <Plane className="w-5 h-5" />;
      case 'hotel': return <Hotel className="w-5 h-5" />;
      case 'food': return <UtensilsCrossed className="w-5 h-5" />;
      case 'activities': return <Activity className="w-5 h-5" />;
      case 'shopping': return <ShoppingBag className="w-5 h-5" />;
      case 'other': return <TrendingUp className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  const getPercentage = (amount) => {
    if (!total || total === 0) return 0;
    return ((amount / total) * 100).toFixed(1);
  };

  const getColor = (category) => {
    const colors = {
      plane: 'from-blue-500 to-blue-600',
      hotel: 'from-purple-500 to-purple-600',
      food: 'from-orange-500 to-orange-600',
      activities: 'from-green-500 to-green-600',
      shopping: 'from-pink-500 to-pink-600',
      other: 'from-gray-500 to-gray-600',
    };
    return colors[category?.toLowerCase()] || 'from-blue-500 to-blue-600';
  };

  if (!budget || budget.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-linear-to-r from-green-500 to-emerald-500 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Budget Breakdown</h3>
          <p className="text-sm text-gray-600 font-semibold">Total: {currency}{total.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-4">
        {budget.map((item, index) => (
          <div key={index} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-linear-to-r ${getColor(item.icon)} flex items-center justify-center text-white shadow-sm`}>
                  {getIcon(item.icon)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{item.category}</p>
                  <p className="text-xs font-semibold text-gray-500">{getPercentage(item.amount)}% of total</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black">{currency}{item.amount.toLocaleString()}</p>
              </div>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full bg-linear-to-r ${getColor(item.icon)} transition-all duration-500`}
                style={{ width: `${getPercentage(item.amount)}%` }}
              />
            </div>

            {item.breakdown && (
              <div className="mt-3 ml-13 space-y-2 bg-gray-50 rounded-lg p-3">
                {item.breakdown.map((detail, idx) => (
                  <div key={idx} className="flex justify-between text-sm font-medium">
                    <span className="text-gray-600">• {detail.item}</span>
                    <span className="text-gray-900 font-bold">{currency}{detail.cost}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-gray-600 mb-1">Daily Average</p>
              <p className="text-2xl font-black text-gray-900">{currency}{(total / 7).toFixed(0)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-600 mb-1">Per Person</p>
              <p className="text-2xl font-black text-gray-900">{currency}{(total / 2).toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}