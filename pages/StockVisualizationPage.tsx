
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAppContext } from '../contexts/AppContext';

interface CategoryData {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A0', '#19FFFF', '#8884d8'];

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  const { formatCurrency } = useAppContext();
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-white border border-gray-300 rounded-md shadow-lg text-sm text-gray-800">
        <p className="font-semibold">{`${data.name}:`}</p>
        <p>{`${formatCurrency(data.value)}`}</p>
      </div>
    );
  }
  return null;
};

const StockVisualizationPage: React.FC = () => {
  const { items, formatCurrency } = useAppContext();

  const data: CategoryData[] = useMemo(() => {
    const categoryValues = new Map<string, number>();

    items.forEach(item => {
      const value = item.quantity * item.unitCost;
      categoryValues.set(item.category, (categoryValues.get(item.category) || 0) + value);
    });

    return Array.from(categoryValues.entries()).map(([category, value]) => ({
      name: category,
      value: value,
    })).sort((a,b) => b.value - a.value); // Sort by value descending
  }, [items]);

  const totalStockValue = useMemo(() => 
    data.reduce((acc, entry) => acc + entry.value, 0),
  [data]);

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold text-gray-800">Visualisation du Stock par Catégorie</h1>
      <p className="text-gray-600">
        Répartition de la valeur monétaire totale du stock par catégorie d'article.
      </p>

      {data.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-4 h-96 flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Valeur totale du stock: {formatCurrency(totalStockValue)}</h2>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend layout="vertical" align="right" verticalAlign="middle" formatter={(value, entry) => `${entry.payload.name} (${formatCurrency(entry.payload.value)})`} />
                </PieChart>
            </ResponsiveContainer>
        </div>
      ) : (
        <div className="p-4 bg-white rounded-lg shadow-sm text-center text-gray-500">
          Aucune donnée de stock disponible pour la visualisation.
        </div>
      )}
    </div>
  );
};

export default StockVisualizationPage;