import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Item, StockMovement, PurchaseRequisition, RequisitionStatus, AttendanceRecord, Employee, Tool, Project, ProjectStatus } from '../types';

type Currency = 'CDF' | 'USD';
const USD_TO_CDF_RATE = 2800; // Taux de change de référence

interface AppContextType {
  isOnline: boolean;
  pendingSyncs: number;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (valueInCdf: number) => string;
  items: Item[];
  movements: StockMovement[];
  requisitions: PurchaseRequisition[];
  attendanceRecords: AttendanceRecord[];
  employees: Employee[];
  tools: Tool[];
  projects: Project[];
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'timestamp' | 'status'>) => void;
  addRequisition: (requisition: Omit<PurchaseRequisition, 'id' | 'timestamp' | 'status' | 'odooStatus'>) => void;
  importAttendance: (records: Omit<AttendanceRecord, 'id' | 'status'>[]) => void;
  validateAttendance: (recordIds: string[]) => void;
  getRequisitionById: (id: string) => PurchaseRequisition | undefined;
  getMovementById: (id: string) => StockMovement | undefined;
  getItemById: (id: string) => Item | undefined;
  addTool: (tool: Omit<Tool, 'id' | 'syncStatus'>) => void;
  updateTool: (toolId: string, updates: Partial<Omit<Tool, 'id' | 'syncStatus'>>) => void;
  getToolById: (id: string) => Tool | undefined;
  getEmployeeById: (id: string) => Employee | undefined;
  addProject: (project: Omit<Project, 'id'>) => void;
  getProjectById: (id: string) => Project | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// Les coûts sont maintenant en CDF
const MOCK_ITEMS: Item[] = [
  { id: 'item-1', name: 'Ciment Portland 50kg', odooRef: 'CEM-001', quantity: 120, category: 'Matériaux bruts', unitCost: 22400 }, // ~8 USD
  { id: 'item-2', name: 'Brique pleine', odooRef: 'BRI-004', quantity: 5000, category: 'Maçonnerie', unitCost: 1400 }, // ~0.5 USD
  { id: 'item-3', name: 'Barre d\'acier 12mm', odooRef: 'AC-012', quantity: 350, category: 'Ferraillage', unitCost: 42000 }, // ~15 USD
  { id: 'item-4', name: 'Sable de rivière (m3)', odooRef: 'SAB-002', quantity: 45, category: 'Matériaux bruts', unitCost: 70000 }, // ~25 USD
];

const MOCK_EMPLOYEES: Employee[] = [
  { id: 'emp-1', name: 'Jean Dupont', odooRef: 'E-1001' },
  { id: 'emp-2', name: 'Marie Curie', odooRef: 'E-1002' },
  { id: 'emp-3', name: 'Pierre Martin', odooRef: 'E-1003' },
];

const MOCK_TOOLS: Tool[] = [
    { id: 'tool-1', name: 'Perceuse-visseuse Bosch', assetTag: 'BOSCH-1001', category: 'Électroportatif', status: 'available', purchaseDate: new Date('2023-01-15').getTime(), condition: 'good', syncStatus: 'synced' },
    { id: 'tool-2', name: 'Marteau-piqueur Hilti', assetTag: 'HILTI-2005', category: 'Gros outillage', status: 'in_use', assignedTo: 'emp-1', purchaseDate: new Date('2022-11-01').getTime(), condition: 'good', syncStatus: 'synced' },
    { id: 'tool-3', name: 'Scie circulaire Makita', assetTag: 'MAKITA-3002', category: 'Électroportatif', status: 'in_maintenance', purchaseDate: new Date('2023-03-20').getTime(), condition: 'fair', lastMaintenanceDate: new Date().getTime(), syncStatus: 'synced' }
];

// Les budgets sont maintenant en CDF
const MOCK_PROJECTS: Project[] = [
  { id: 'proj-1', name: 'Villa de luxe - Lot A', reference: 'CHA-2024-001', clientName: 'Client Particulier', address: '123 Rue de la Plage, Nice', startDate: new Date('2024-05-10').getTime(), status: 'in_progress', budget: 420000000 }, // ~150k USD
  { id: 'proj-2', name: 'Immeuble de bureaux - B2', reference: 'CHA-2024-002', clientName: 'SCI Invest', address: '45 Avenue du Progrès, Lyon', startDate: new Date('2024-03-01').getTime(), status: 'in_progress', budget: 2100000000 }, // ~750k USD
  { id: 'proj-3', name: 'Rénovation École Primaire', reference: 'CHA-2023-015', clientName: 'Mairie de Paris', address: '1 Place de la République, Paris', startDate: new Date('2023-09-01').getTime(), endDate: new Date('2024-06-30').getTime(), status: 'completed', budget: 280000000 }, // ~100k USD
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currency, setCurrency] = useLocalStorage<Currency>('app-currency', 'CDF');

  // Local state for all data types
  const [items, setItems] = useLocalStorage<Item[]>('app-items', MOCK_ITEMS);
  const [movements, setMovements] = useLocalStorage<StockMovement[]>('app-movements', []);
  const [requisitions, setRequisitions] = useLocalStorage<PurchaseRequisition[]>('app-requisitions', []);
  const [attendanceRecords, setAttendanceRecords] = useLocalStorage<AttendanceRecord[]>('app-attendance', []);
  const [employees, setEmployees] = useLocalStorage<Employee[]>('app-employees', MOCK_EMPLOYEES);
  const [tools, setTools] = useLocalStorage<Tool[]>('app-tools', MOCK_TOOLS);
  const [projects, setProjects] = useLocalStorage<Project[]>('app-projects', MOCK_PROJECTS);
  
  const pendingMovements = movements.filter(m => m.status === 'pending').length;
  const pendingRequisitions = requisitions.filter(r => r.status === 'pending').length;
  const pendingAttendance = attendanceRecords.filter(a => a.status === 'validated').length;
  const pendingTools = tools.filter(t => t.syncStatus !== 'synced').length;
  const pendingSyncs = pendingMovements + pendingRequisitions + pendingAttendance + pendingTools;
  
  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncData = useCallback(async () => {
    if (!isOnline) return;

    // Simulate API calls
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Sync Stock Movements
    setMovements(prev => prev.map(m => m.status === 'pending' ? { ...m, status: 'synced' } : m));
    
    // Sync Purchase Requisitions
    setRequisitions(prev => prev.map(r => {
        if (r.status === 'pending') {
            // Mock Odoo response
            const randomStatus = ['Approuvée', 'Rejetée', 'En attente'][Math.floor(Math.random() * 3)] as 'Approuvée' | 'Rejetée' | 'En attente';
            return { ...r, status: 'synced-waiting', odooStatus: randomStatus };
        }
        return r;
    }));
    
    // Sync Attendance
    setAttendanceRecords(prev => prev.map(a => a.status === 'validated' ? { ...a, status: 'synced' } : a));

    // Sync Tools
    setTools(prev => prev.map(t => t.syncStatus !== 'synced' ? { ...t, syncStatus: 'synced' } : t));

    console.log('Sync completed.');
  }, [isOnline, setMovements, setRequisitions, setAttendanceRecords, setTools]);

  // Periodic Sync
  useEffect(() => {
    if (isOnline) {
      const interval = setInterval(syncData, 10000); // Sync every 10 seconds
      return () => clearInterval(interval);
    }
  }, [isOnline, syncData]);

  const addStockMovement = (movement: Omit<StockMovement, 'id' | 'timestamp' | 'status'>) => {
    const newMovement: StockMovement = {
      ...movement,
      id: `mov-${Date.now()}`,
      timestamp: Date.now(),
      status: 'pending',
    };
    setMovements(prev => [...prev, newMovement]);
    // Update item quantity
    setItems(prev => prev.map(item => {
      if (item.id === movement.itemId) {
        const newQuantity = movement.type === 'entry'
          ? item.quantity + movement.quantity
          : item.quantity - movement.quantity;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const addRequisition = (requisition: Omit<PurchaseRequisition, 'id' | 'timestamp' | 'status' | 'odooStatus'>) => {
    const newRequisition: PurchaseRequisition = {
      ...requisition,
      id: `req-${Date.now()}`,
      timestamp: Date.now(),
      status: 'pending',
    };
    setRequisitions(prev => [...prev, newRequisition]);
  };
  
  const importAttendance = (records: Omit<AttendanceRecord, 'id' | 'status'>[]) => {
      const newRecords: AttendanceRecord[] = records.map(r => ({
          ...r,
          id: `att-${Date.now()}-${Math.random()}`,
          status: 'pending',
      }));
      setAttendanceRecords(prev => [...prev, ...newRecords]);
  };
  
  const validateAttendance = (recordIds: string[]) => {
      setAttendanceRecords(prev => prev.map(r => recordIds.includes(r.id) ? {...r, status: 'validated'} : r));
  };
  
  const addTool = (tool: Omit<Tool, 'id' | 'syncStatus'>) => {
    const newTool: Tool = {
      ...tool,
      id: `tool-${Date.now()}`,
      syncStatus: 'pending_add',
    };
    setTools(prev => [...prev, newTool]);
  };
  
  const updateTool = (toolId: string, updates: Partial<Omit<Tool, 'id' | 'syncStatus'>>) => {
    setTools(prev => prev.map(tool => {
      if (tool.id === toolId) {
        const existingToolWasSynced = tool.syncStatus === 'synced';
        return { 
          ...tool, 
          ...updates, 
          syncStatus: existingToolWasSynced ? 'pending_update' : tool.syncStatus 
        };
      }
      return tool;
    }));
  };
  
  const addProject = (project: Omit<Project, 'id'>) => {
      const budgetInCdf = project.budget ? (currency === 'USD' ? project.budget * USD_TO_CDF_RATE : project.budget) : undefined;
      const newProject: Project = {
          ...project,
          id: `proj-${Date.now()}`,
          budget: budgetInCdf,
      };
      setProjects(prev => [...prev, newProject]);
  };

  const formatCurrency = (valueInCdf: number) => {
    const value = currency === 'USD' ? valueInCdf / USD_TO_CDF_RATE : valueInCdf;
    const options = {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    };
    return new Intl.NumberFormat(currency === 'CDF' ? 'fr-CD' : 'en-US', options).format(value);
  };
  
  const getRequisitionById = (id: string) => requisitions.find(r => r.id === id);
  const getMovementById = (id: string) => movements.find(m => m.id === id);
  const getItemById = (id: string) => items.find(i => i.id === id);
  const getToolById = (id: string) => tools.find(t => t.id === id);
  const getEmployeeById = (id: string) => employees.find(e => e.id === id);
  const getProjectById = (id: string) => projects.find(p => p.id === id);

  const value = {
    isOnline,
    pendingSyncs,
    currency,
    setCurrency,
    formatCurrency,
    items,
    movements,
    requisitions,
    attendanceRecords,
    employees,
    tools,
    projects,
    addStockMovement,
    addRequisition,
    importAttendance,
    validateAttendance,
    getRequisitionById,
    getMovementById,
    getItemById,
    addTool,
    updateTool,
    getToolById,
    getEmployeeById,
    addProject,
    getProjectById
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
