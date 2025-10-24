
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

interface PrintVoucherPageProps {
  voucherType: 'stock-exit' | 'requisition';
}

const PrintVoucherPage: React.FC<PrintVoucherPageProps> = ({ voucherType }) => {
  const { id } = useParams<{ id: string }>();
  const { getMovementById, getRequisitionById, getItemById } = useAppContext();

  const movement = voucherType === 'stock-exit' ? getMovementById(id!) : undefined;
  const requisition = voucherType === 'requisition' ? getRequisitionById(id!) : undefined;

  useEffect(() => {
    window.print();
  }, []);
  
  const renderHeader = () => (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold">GINA GROUP SERVICES</h1>
      <h2 className="text-xl font-semibold mt-2">
        {voucherType === 'stock-exit' ? 'BON DE SORTIE MATÉRIEL' : 'BON DE RÉQUISITION MATÉRIEL'}
      </h2>
    </div>
  );

  const renderStockExitDetails = () => {
    if (!movement) return <p>Bon de sortie non trouvé.</p>;
    const item = getItemById(movement.itemId);
    return (
      <div>
        {renderHeader()}
        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
            <p><strong>N° Bon:</strong> {movement.id.slice(-6)}</p>
            <p><strong>Date:</strong> {new Date(movement.timestamp).toLocaleDateString()}</p>
            <p><strong>Destination:</strong> {movement.destinationOrSource}</p>
            <p><strong>Opérateur:</strong> {movement.operator}</p>
        </div>
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2 text-left">Article</th>
              <th className="border border-gray-300 p-2 text-right">Quantité</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">{item?.name || 'Inconnu'}</td>
              <td className="border border-gray-300 p-2 text-right">{movement.quantity}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderRequisitionDetails = () => {
    if (!requisition) return <p>Bon de réquisition non trouvé.</p>;
    return (
       <div>
        {renderHeader()}
        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
            <p><strong>N° Demande:</strong> {requisition.id.slice(-6)}</p>
            <p><strong>Date:</strong> {new Date(requisition.timestamp).toLocaleDateString()}</p>
            <p><strong>Demandeur:</strong> {requisition.siteManager}</p>
        </div>
        <table className="w-full border-collapse border border-gray-400 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2 text-left">Article</th>
              <th className="border border-gray-300 p-2 text-right">Quantité Demandée</th>
            </tr>
          </thead>
          <tbody>
            {requisition.items.map((reqItem, index) => {
              const item = getItemById(reqItem.itemId);
              return (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{item?.name || 'Inconnu'}</td>
                  <td className="border border-gray-300 p-2 text-right">{reqItem.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
       </div>
    );
  };
  
  const renderFooter = () => (
      <div className="mt-20 grid grid-cols-2 gap-8 text-sm">
        <div>
            <p>Signature (Magasinier):</p>
            <div className="border-b border-gray-400 h-12 mt-2"></div>
        </div>
        <div>
            <p>Signature (Chef de Site):</p>
            <div className="border-b border-gray-400 h-12 mt-2"></div>
        </div>
      </div>
  );

  return (
    <div className="p-8 bg-white font-serif">
      {voucherType === 'stock-exit' ? renderStockExitDetails() : renderRequisitionDetails()}
      {renderFooter()}
    </div>
  );
};

export default PrintVoucherPage;
