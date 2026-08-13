import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  setDoc,
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  TrendingUp, 
  Zap,
  LogOut, 
  Search, 
  Bell, 
  ChevronDown, 
  Eye, 
  ShoppingCart, 
  Target, 
  DollarSign, 
  MoreVertical,
  Menu,
  X,
  Clock,
  User,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

import { ServiceManager } from './ServiceManager';

interface OrderItem {
  plan: string;
  quantity: string;
  link: string;
  price: string;
}

interface Order {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  createdAt: any;
  items: OrderItem[];
}

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'customers' | 'reports' | 'services'>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [monthlyTarget, setMonthlyTarget] = useState(60000);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    });

    // Fetch Settings
    const settingsUnsubscribe = onSnapshot(doc(db, 'settings', 'dashboard'), (docSnap) => {
      if (docSnap.exists()) {
        setMonthlyTarget(docSnap.data().monthlyTarget || 60000);
      }
    });

    return () => {
      unsubscribe();
      settingsUnsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateMonthlyTarget = async () => {
    const newTarget = parseFloat(tempTarget);
    if (isNaN(newTarget)) return;
    
    try {
      await updateDoc(doc(db, 'settings', 'dashboard'), { monthlyTarget: newTarget });
      setIsEditingTarget(false);
    } catch (err) {
      console.error('Error updating target:', err);
      // If document doesn't exist, we might need to set it first
      try {
        await setDoc(doc(db, 'settings', 'dashboard'), { monthlyTarget: newTarget });
        setIsEditingTarget(false);
      } catch (e) {
        console.error('Final fallback failed:', e);
      }
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'orders', orderToDelete.id));
      setOrderToDelete(null);
    } catch (err) {
      console.error('Error deleting order:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'طلب جديد':
      case 'new':
        return <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold">طلب جديد</span>;
      case 'قيد التنفيذ':
      case 'processing':
        return <span className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-xs font-bold">قيد التنفيذ</span>;
      case 'مكتمل':
      case 'completed':
        return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold">مكتمل</span>;
      default:
        return <span className="px-3 py-1 bg-slate-800/50 text-slate-400 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '...';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    
    // Gregorian Format: YYYY/MM/DD
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}/${m}/${d}`;
  };

  // Calculate Stats
  const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;
  
  // Prepare Chart Data (Full Gregorian Month)
  const getChartData = () => {
    const dailyData: { [key: string]: number } = {};
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // Get number of days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return `${day}/${month + 1}`;
    });

    monthDays.forEach(day => dailyData[day] = 0);

    orders.forEach(order => {
      if (order.createdAt) {
        const date = order.createdAt instanceof Timestamp ? order.createdAt.toDate() : new Timestamp(order.createdAt.seconds, order.createdAt.nanoseconds).toDate();
        if (date.getMonth() === month && date.getFullYear() === year) {
          const dayKey = `${date.getDate()}/${date.getMonth() + 1}`;
          if (dailyData[dayKey] !== undefined) {
            dailyData[dayKey] += order.totalAmount || 0;
          }
        }
      }
    });

    return Object.entries(dailyData).map(([day, sales]) => ({ day, sales }));
  };

  const chartData = getChartData();

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (order.customerName || '').toLowerCase().includes(searchLower) ||
      (order.customerPhone || '').includes(searchTerm) ||
      (order.orderId || '').toLowerCase().includes(searchLower)
    );
  });

  // Unique Customers
  const customers = Array.from(new Set(orders.map(o => o.customerPhone))).map(phone => {
    const lastOrder = orders.find(o => o.customerPhone === phone);
    const customerOrders = orders.filter(o => o.customerPhone === phone);
    return {
      name: lastOrder?.customerName || 'عميل مجهول',
      phone: phone,
      totalSpent: customerOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      orderCount: customerOrders.length,
      lastOrderDate: lastOrder?.createdAt
    };
  });

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans" dir="rtl">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <span className="text-xl font-bold tracking-tight">داعم <span className="text-emerald-400">ستور</span></span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          <button 
            onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>الرئيسية</span>
          </button>
          <button 
            onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <Package className="w-5 h-5" />
            <span>الطلبات</span>
          </button>
          <button 
            onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'reports' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>التقارير</span>
          </button>
          <button 
            onClick={() => { setActiveTab('customers'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'customers' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <Users className="w-5 h-5" />
            <span>العملاء</span>
          </button>
          <button 
            onClick={() => { setActiveTab('services'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'services' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <Target className="w-5 h-5" />
            <span>الخدمات</span>
          </button>
        </nav>

        <div className="absolute bottom-8 left-4 right-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/100/10 rounded-xl transition-all font-bold"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:mr-64 min-w-0">
        {/* Header */}
        <header className="h-20 bg-slate-900 border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-300">
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="ابحث عن طلب، عميل..." 
                className="bg-slate-800 border-none rounded-full py-2 pr-10 pl-4 text-sm w-64 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-300 hover:bg-slate-800 rounded-full transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">أدمن المتجر</p>
                <p className="text-[10px] text-slate-400">مدير النظام</p>
              </div>
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
                A
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
          {activeTab === 'dashboard' ? (
            <>
              {/* Page Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-white">ملخص المتجر</h1>
                  <p className="text-slate-400 text-[10px] md:text-sm mt-1">داعم ستور • آخر تحديث: الآن</p>
                </div>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="bg-slate-900 border border-white/10 text-slate-200 px-3 py-2 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2"
                >
                  <span>عرض كافة الطلبات</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <div className="bg-slate-900 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2 md:mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/10 rounded-xl md:rounded-2xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
                    </div>
                    <MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-slate-400 cursor-pointer" />
                  </div>
                  <p className="text-slate-400 text-[10px] md:text-sm font-bold">إجمالي المبيعات</p>
                  <h3 className="text-lg md:text-2xl font-black text-white mt-0.5 md:mt-1">{totalSales.toLocaleString()} <span className="text-[10px] md:text-xs font-bold text-slate-400">ر.س</span></h3>
                </div>

                <div className="bg-slate-900 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2 md:mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/10 rounded-xl md:rounded-2xl flex items-center justify-center">
                      <Eye className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    </div>
                    <MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-slate-400 cursor-pointer" />
                  </div>
                  <p className="text-slate-400 text-[10px] md:text-sm font-bold">الزيارات</p>
                  <h3 className="text-lg md:text-2xl font-black text-white mt-0.5 md:mt-1">{(totalOrdersCount * 5.8).toFixed(0)}</h3>
                </div>

                <div className="bg-slate-900 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2 md:mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500/10 rounded-xl md:rounded-2xl flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                    </div>
                    <MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-slate-400 cursor-pointer" />
                  </div>
                  <p className="text-slate-400 text-[10px] md:text-sm font-bold">إجمالي الطلبات</p>
                  <h3 className="text-lg md:text-2xl font-black text-white mt-0.5 md:mt-1">{totalOrdersCount}</h3>
                </div>

                <div className="bg-slate-900 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2 md:mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/10 rounded-xl md:rounded-2xl flex items-center justify-center">
                      <Target className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                    </div>
                    <MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-slate-400 cursor-pointer" />
                  </div>
                  <p className="text-slate-400 text-[10px] md:text-sm font-bold">هدف الشهر</p>
                  {isEditingTarget ? (
                    <div className="flex items-center gap-2 mt-0.5 md:mt-1">
                      <input 
                        type="number" 
                        value={tempTarget}
                        onChange={(e) => setTempTarget(e.target.value)}
                        autoFocus
                        className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-2 py-1 text-xs md:text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <button onClick={updateMonthlyTarget} className="p-1 bg-emerald-500 text-white rounded-lg">
                        <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    </div>
                  ) : (
                    <h3 
                      onClick={() => { setTempTarget(monthlyTarget.toString()); setIsEditingTarget(true); }}
                      className="text-lg md:text-2xl font-black text-white mt-0.5 md:mt-1 cursor-pointer hover:text-emerald-400 transition-colors"
                    >
                      {monthlyTarget.toLocaleString()} <span className="text-[10px] md:text-xs font-bold text-slate-400">ر.س</span>
                    </h3>
                  )}
                </div>
              </div>

              {/* Chart Section */}
              <div className="bg-emerald-500/10 p-4 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-emerald-500/20 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <h3 className="text-sm md:text-lg font-bold text-[#004d5a]">إحصائيات المبيعات ({new Date().toLocaleDateString('ar-SA', { month: 'long' })})</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 md:w-3 md:h-3 bg-slate-900 rounded-full"></span>
                    <span className="text-[10px] md:text-xs font-bold text-slate-400">المبيعات</span>
                  </div>
                </div>
                <div className="h-[200px] md:h-[300px] min-h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={chartData} 
                      margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
                      barGap={0}
                      barCategoryGap={1}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccf2eb" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#004d5a', fontSize: 7, fontWeight: 'bold' }} 
                        dy={10}
                        interval={1}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#004d5a', fontSize: 10, fontWeight: 'bold' }} 
                      />
                      <Tooltip 
                        cursor={{ fill: '#ffffff44' }}
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          borderRadius: '12px', 
                          border: 'none',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          fontFamily: 'inherit',
                          textAlign: 'right',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="sales" radius={[2, 2, 0, 0]} barSize={null}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#004d5a" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 shadow-sm overflow-hidden">
                <div className="p-5 md:p-8 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-800 rounded-lg md:rounded-xl flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-slate-300" />
                    </div>
                    <h3 className="text-sm md:text-lg font-bold text-white">أحدث الطلبات</h3>
                  </div>
                  <button onClick={() => setActiveTab('orders')} className="text-emerald-400 text-xs md:text-sm font-bold hover:underline">عرض الكل</button>
                </div>

                <div className="overflow-x-auto w-full">
                  <table className="w-full text-right min-w-[600px] md:min-w-full">
                    <thead>
                      <tr className="bg-slate-800/50 text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                        <th className="px-4 md:px-8 py-3 md:py-4">العميل</th>
                        <th className="px-4 md:px-8 py-3 md:py-4">رقم الطلب</th>
                        <th className="px-4 md:px-8 py-3 md:py-4">الإجمالي</th>
                        <th className="px-4 md:px-8 py-3 md:py-4">الوقت</th>
                        <th className="px-4 md:px-8 py-3 md:py-4">الحالة</th>
                        <th className="px-4 md:px-8 py-3 md:py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-8 py-12 text-center">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
                            <p className="text-slate-400 mt-2">جاري تحميل الطلبات...</p>
                          </td>
                        </tr>
                      ) : filteredOrders.slice(0, 5).map((order) => (
                        <tr 
                          key={order.id} 
                          onClick={() => setSelectedOrder(order)}
                          className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                        >
                          <td className="px-4 md:px-8 py-4 md:py-5">
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 text-xs md:text-sm font-bold">
                                {(order.customerName || ' ').charAt(0)}
                              </div>
                              <span className="text-xs md:text-sm font-bold text-white truncate max-w-[100px] md:max-w-none">{order.customerName || 'Guest'}</span>
                            </div>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-5">
                            <span className="text-xs md:text-sm font-mono text-slate-400">#{(order.orderId || '').includes('#') ? order.orderId.split('#')[1] : (order.orderId || '').slice(-6)}</span>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-5">
                            <span className="text-xs md:text-sm font-black text-white">{order.totalAmount} ر.س</span>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-5">
                            <span className="text-[10px] md:text-xs text-slate-400">{formatTime(order.createdAt)}</span>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-5">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-5">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrder(order);
                                }}
                                className="p-1 md:p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                              >
                                <Eye className="w-3 h-3 md:w-4 md:h-4" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOrderToDelete(order);
                                }}
                                className="p-1 md:p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                              >
                                <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : activeTab === 'orders' ? (
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-xl md:text-2xl font-bold text-white">كافة الطلبات ({filteredOrders.length})</h1>
                <div className="relative w-full md:w-64">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="بحث في الطلبات..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-xl py-2 pr-10 pl-4 text-sm w-full focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 shadow-sm overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-right min-w-[700px] md:min-w-full">
                    <thead>
                      <tr className="bg-slate-800/50 text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                        <th className="px-4 md:px-8 py-3 md:py-4">العميل</th>
                        <th className="px-4 md:px-8 py-3 md:py-4">رقم الطلب</th>
                        <th className="px-4 md:px-8 py-3 md:py-4">الإجمالي</th>
                        <th className="px-4 md:px-8 py-3 md:py-4">التاريخ</th>
                        <th className="px-4 md:px-8 py-3 md:py-4">الحالة</th>
                        <th className="px-4 md:px-8 py-3 md:py-4">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredOrders.map((order) => (
                        <tr 
                          key={order.id} 
                          onClick={() => setSelectedOrder(order)}
                          className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                        >
                          <td className="px-4 md:px-8 py-4 md:py-5">
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 text-xs md:text-sm font-bold">
                                {(order.customerName || ' ').charAt(0)}
                              </div>
                              <div>
                                <p className="text-xs md:text-sm font-bold text-white">{order.customerName || 'Guest'}</p>
                                <p className="text-[10px] md:text-xs text-slate-400">{order.customerPhone || ''}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-5">
                            <span className="text-xs md:text-sm font-mono text-slate-400">#{(order.orderId || '').includes('#') ? order.orderId.split('#')[1] : (order.orderId || '').slice(-6)}</span>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-5">
                            <span className="text-xs md:text-sm font-black text-white">{order.totalAmount} ر.س</span>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-5">
                            <span className="text-[10px] md:text-xs text-slate-400">{formatTime(order.createdAt)}</span>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-5">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-5">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrder(order);
                                }}
                                className="text-emerald-400 text-[10px] md:text-xs font-bold hover:underline"
                              >
                                تفاصيل
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOrderToDelete(order);
                                }}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === 'customers' ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">العملاء ({customers.length})</h1>
              </div>

              <div className="bg-slate-900 rounded-[2.5rem] border border-white/10 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="bg-slate-800/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="px-8 py-4">العميل</th>
                        <th className="px-8 py-4">الجوال</th>
                        <th className="px-8 py-4">عدد الطلبات</th>
                        <th className="px-8 py-4">إجمالي المدفوعات</th>
                        <th className="px-8 py-4">آخر طلب</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {customers.map((customer, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/50 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 font-bold">
                                {customer.name.charAt(0)}
                              </div>
                              <span className="text-sm font-bold text-white">{customer.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-sm font-mono text-slate-400">{customer.phone}</span>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-sm font-bold text-white">{customer.orderCount}</span>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-sm font-black text-emerald-400">{customer.totalSpent.toLocaleString()} ر.س</span>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-xs text-slate-400">{formatTime(customer.lastOrderDate)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === 'services' ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">إدارة الخدمات</h1>
              </div>
              <div className="bg-slate-950 p-6 sm:p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
                <ServiceManager />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">التقارير</h1>
              </div>
              <div className="bg-slate-900 p-12 rounded-[2.5rem] border border-white/10 shadow-sm text-center">
                <TrendingUp className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white">التقارير التفصيلية</h3>
                <p className="text-slate-400 mt-2">هذه الصفحة قيد التطوير حالياً.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Order Deletion Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setOrderToDelete(null)}></div>
          <div className="relative w-full max-w-md bg-slate-900 rounded-[2rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">تأكيد حذف الطلب</h3>
            <p className="text-slate-400 text-center mb-8">هل أنت متأكد من رغبتك في حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.</p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setOrderToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-all disabled:opacity-50"
              >
                إلغاء
              </button>
              <button 
                onClick={handleDeleteOrder}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'حذف الطلب'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">تفاصيل الطلب #{(selectedOrder.orderId || '').includes('#') ? selectedOrder.orderId.split('#')[1] : (selectedOrder.orderId || '').slice(-6)}</h3>
                  <p className="text-white/60 text-xs">{formatTime(selectedOrder.createdAt)}</p>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-bold">معلومات العميل</span>
                  </div>
                  <p className="text-sm font-bold text-white">{selectedOrder.customerName}</p>
                  <p className="text-sm text-slate-300 mt-1">{selectedOrder.customerPhone}</p>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold">حالة الطلب الحالية</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(selectedOrder.status)}
                    <div className="relative flex-1">
                      <select 
                        value={selectedOrder.status}
                        disabled={isUpdatingStatus}
                        onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg py-1 px-2 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="طلب جديد">طلب جديد</option>
                        <option value="قيد التنفيذ">قيد التنفيذ</option>
                        <option value="مكتمل">مكتمل</option>
                      </select>
                      <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                  <span>الخدمات المطلوبة</span>
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="bg-slate-900 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{item.plan}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-400">الرابط:</span>
                            <a 
                              href={item.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                            >
                              {item.link.length > 30 ? item.link.substring(0, 30) + '...' : item.link}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-white">{item.price} ر.س</p>
                        <p className="text-[10px] text-slate-400">الكمية: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-white/5 pt-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">إجمالي الطلب</p>
                  <p className="text-2xl font-black text-white">{selectedOrder.totalAmount} ر.س</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-all"
                  >
                    إغلاق
                  </button>
                  <button 
                    onClick={() => {
                      if (selectedOrder.status !== 'مكتمل') {
                        updateOrderStatus(selectedOrder.id, 'مكتمل');
                      }
                    }}
                    disabled={isUpdatingStatus || selectedOrder.status === 'مكتمل'}
                    className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUpdatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>{selectedOrder.status === 'مكتمل' ? 'مكتمل بالفعل' : 'تحديد كمكتمل'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
