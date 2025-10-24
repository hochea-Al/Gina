
import React, { useState, ChangeEvent } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AttendanceRecord } from '../types';

const AttendancePage: React.FC = () => {
  const { attendanceRecords, employees, importAttendance, validateAttendance } = useAppContext();
  const [selected, setSelected] = useState<string[]>([]);

  const pendingRecords = attendanceRecords.filter(r => r.status === 'pending');

  const handleFileImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // This is a mock parser. In a real app, you would use a library like Papaparse.
      // Format: employeeId,checkIn(timestamp),checkOut(timestamp),siteId,biometricDeviceId
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').slice(1); // Skip header
        const newRecords = lines.map(line => {
          const [employeeId, checkIn, checkOut, siteId, biometricDeviceId] = line.split(',');
          if (!employeeId || !checkIn || !checkOut) return null;
          const checkInTime = parseInt(checkIn, 10);
          const checkOutTime = parseInt(checkOut, 10);
          const workedHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
          return { employeeId, checkIn: checkInTime, checkOut: checkOutTime, workedHours, siteId, biometricDeviceId };
        }).filter(Boolean) as Omit<AttendanceRecord, 'id' | 'status'>[];
        importAttendance(newRecords);
        alert(`${newRecords.length} enregistrements importés.`);
      };
      reader.readAsText(file);
    }
  };
  
  const handleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  
  const handleValidate = () => {
    validateAttendance(selected);
    setSelected([]);
  };
  
  const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'Inconnu';

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Importer Pointages</h2>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <label htmlFor="file-upload" className="w-full cursor-pointer bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg border-2 border-dashed border-gray-300 hover:bg-gray-200 text-center block">
            Charger un fichier (CSV/TXT)
          </label>
          <input id="file-upload" type="file" accept=".csv,.txt" onChange={handleFileImport} className="hidden" />
          <p className="text-xs text-gray-500 mt-2">Format: employeeId,checkIn(timestamp),checkOut(timestamp),siteId,deviceId</p>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Pointages à Valider</h2>
        {pendingRecords.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {pendingRecords.map(rec => (
                <li key={rec.id} className="p-4 flex items-center">
                  <input type="checkbox" checked={selected.includes(rec.id)} onChange={() => handleSelect(rec.id)} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-4"/>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{getEmployeeName(rec.employeeId)}</p>
                    <p className="text-sm text-gray-500">
                      Entrée: {new Date(rec.checkIn).toLocaleTimeString()} | Sortie: {new Date(rec.checkOut).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">Durée: {rec.workedHours.toFixed(2)}h</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-4 bg-gray-50 border-t">
              <button onClick={handleValidate} disabled={selected.length === 0} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
                Valider ({selected.length})
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-white rounded-lg shadow-sm text-center text-gray-500">
            Aucun pointage en attente de validation.
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
