import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { query, onSnapshot, updateDoc, doc, orderBy, collection, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Settings, 
  Users, 
  LogOut, 
  Search, 
  Copy, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  Menu,
  X,
  Music2,
  Heart,
  Eye,
  ArrowRight,
  Plus
} from 'lucide-react';

import { useAppServices, ICON_MAP } from './contexts/ServicesContext';

const ADMIN_EMAIL = 'mounirlaarej@hotmail.com';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= 3) {
      setError('تم تجاوز الحد المسموح، الرجاء المحاولة لاحقاً');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        setError('ليس لديك صلاحية للدخول هنا');
        setAttempts(prev => prev + 1);
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError('بيانات الدخول غير صحيحة');
      setAttempts(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 font-sans text-slate-300" dir="rtl">
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#39ff14]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#39ff14]/20">
            <LayoutDashboard className="w-8 h-8 text-[#39ff14]" />
          </div>
          <h2 className="text-2xl font-bold text-white">تسجيل دخول الإدارة</h2>
          <p className="text-slate-500 mt-2">Fame Store Admin</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14] transition-all"
              required
              disabled={attempts >= 3 || loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14] transition-all"
              required
              disabled={attempts >= 3 || loading}
            />
          </div>
          <button
            type="submit"
            disabled={attempts >= 3 || loading}
            className="w-full bg-[#39ff14] text-black py-3 rounded-xl font-bold hover:bg-[#32e612] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-[0_0_15px_rgba(57,255,20,0.3)]"
          >
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminOrders({ orders, filter, setFilter, searchQuery, setSearchQuery, selectedOrder, setSelectedOrder, getStatusBadge, handleUpdateStatus, copyToClipboard, handleDeleteOrder }: any) {
  const filteredOrders = orders.filter((order: any) => {
    const matchesFilter = filter === 'الكل' || order.status === filter;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customerPhone && order.customerPhone.includes(searchQuery)) ||
      (order.customerEmail && order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">إدارة الطلبات</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/5 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse"></div>
            <span className="text-sm text-slate-400">مباشر</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-4 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {['الكل', 'جديد', 'قيد التنفيذ', 'مكتمل', 'ملغي'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === tab 
                  ? 'bg-[#39ff14] text-black shadow-[0_0_10px_rgba(57,255,20,0.2)]' 
                  : 'bg-black/50 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="بحث برقم الطلب أو الجوال..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-white focus:outline-none focus:border-[#39ff14] transition-colors text-sm"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-black/50 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-slate-400">رقم الطلب</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-400">العميل</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-400">التاريخ</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-400">السعر</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-400">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">لا توجد طلبات مطابقة</td>
                </tr>
              ) : (
                filteredOrders.map((order: any) => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-white">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 text-sm text-slate-300" dir="ltr">
                      {order.customerPhone || order.customerEmail || 'غير متوفر'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400" dir="ltr">
                      {order.createdAt?.toDate().toLocaleDateString('en-GB') || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#39ff14]">{order.totalAmount} ر.س</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function AdminCustomers({ customers, handleDeleteCustomer }: { customers: any[], handleDeleteCustomer: (id: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter((customer: any) => {
    const matchesSearch = 
      (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (customer.phone && customer.phone.includes(searchQuery)) ||
      (customer.name && customer.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">إدارة العملاء</h1>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-4 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="relative w-full lg:w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="بحث بالاسم، البريد أو الجوال..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-white focus:outline-none focus:border-[#39ff14] transition-colors text-sm"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-black/50 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-slate-400">الاسم</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-400">البريد الإلكتروني</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-400">رقم الجوال</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-400">تاريخ التسجيل</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-400">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">لا يوجد عملاء مطابقين</td>
                </tr>
              ) : (
                filteredCustomers.map((customer: any) => (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-white">{customer.name || 'غير متوفر'}</td>
                    <td className="px-6 py-4 text-sm text-slate-300" dir="ltr">
                      {customer.email || 'غير متوفر'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300" dir="ltr">
                      {customer.phone || 'غير متوفر'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400" dir="ltr">
                      {customer.createdAt?.toDate().toLocaleDateString('en-GB') || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="حذف العميل"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function AdminServices({ showToast }: { showToast: (msg: string, type: 'success' | 'error') => void }) {
  const { services, deleteService, addService } = useAppServices();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    id: '',
    name: '',
    iconName: 'tiktok',
    color: 'text-emerald-400',
    options: [] as any[]
  });

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.id || !newService.name) {
      showToast('الرجاء إكمال البيانات الأساسية', 'error');
      return;
    }
    try {
      await addService(newService);
      setIsAddModalOpen(false);
      setNewService({ id: '', name: '', iconName: 'tiktok', color: 'text-emerald-400', options: [] });
      showToast('تم إضافة الخدمة بنجاح', 'success');
    } catch (err) {
      console.error("Error adding service:", err);
      showToast('حدث خطأ أثناء إضافة الخدمة', 'error');
    }
  };

  const addOption = () => {
    setNewService({
      ...newService,
      options: [...newService.options, { name: '', iconName: 'users', plans: [] }]
    });
  };

  const updateOption = (idx: number, field: string, value: any) => {
    const updatedOptions = [...newService.options];
    updatedOptions[idx] = { ...updatedOptions[idx], [field]: value };
    setNewService({ ...newService, options: updatedOptions });
  };

  const removeOption = (idx: number) => {
    setNewService({
      ...newService,
      options: newService.options.filter((_, i) => i !== idx)
    });
  };

  const addPlan = (optIdx: number) => {
    const updatedOptions = [...newService.options];
    updatedOptions[optIdx].plans = [...updatedOptions[optIdx].plans, { quantity: '', price: '' }];
    setNewService({ ...newService, options: updatedOptions });
  };

  const updatePlan = (optIdx: number, planIdx: number, field: string, value: string) => {
    const updatedOptions = [...newService.options];
    updatedOptions[optIdx].plans[planIdx] = { ...updatedOptions[optIdx].plans[planIdx], [field]: value };
    setNewService({ ...newService, options: updatedOptions });
  };

  const removePlan = (optIdx: number, planIdx: number) => {
    const updatedOptions = [...newService.options];
    updatedOptions[optIdx].plans = updatedOptions[optIdx].plans.filter((_: any, i: number) => i !== planIdx);
    setNewService({ ...newService, options: updatedOptions });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">إدارة الخدمات</h1>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-[#39ff14] text-black px-4 py-2 rounded-xl font-bold hover:bg-[#32e612] transition-all shadow-[0_0_15px_rgba(57,255,20,0.2)]"
        >
          <Plus className="w-5 h-5" />
          إضافة خدمة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((service, idx) => {
          const Icon = ICON_MAP[service.iconName] || Music2;
          return (
            <div key={idx} className="bg-[#111] border border-white/5 rounded-3xl p-6 hover:border-[#39ff14]/30 transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#39ff14]/10 rounded-2xl flex items-center justify-center border border-[#39ff14]/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-[#39ff14]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{service.name}</h3>
                    <p className="text-slate-400 text-sm">{service.options?.length || 0} باقات رئيسية</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
                      deleteService(service.id);
                      showToast('تم حذف الخدمة بنجاح', 'success');
                    }
                  }}
                  className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                {service.options?.map((opt: any, oIdx: number) => {
                  const OptIcon = ICON_MAP[opt.iconName] || Users;
                  return (
                    <div key={oIdx} className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3 text-slate-300">
                        <div className="text-slate-500">
                          <OptIcon className="w-5 h-5" />
                        </div>
                        <span className="font-medium">{opt.name}</span>
                      </div>
                      <span className="text-xs font-bold bg-white/5 text-slate-400 px-2 py-1 rounded-lg">{opt.plans?.length || 0} خطة</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Service Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#111]/95 backdrop-blur z-10">
                <h2 className="text-xl font-bold text-white">إضافة خدمة جديدة</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors bg-black/50 rounded-xl">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddService} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">معرف الخدمة (ID)</label>
                    <input
                      type="text"
                      value={newService.id}
                      onChange={(e) => setNewService({ ...newService, id: e.target.value })}
                      placeholder="مثلاً: instagram"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#39ff14]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">اسم الخدمة</label>
                    <input
                      type="text"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      placeholder="مثلاً: إنستقرام"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#39ff14]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">الأيقونة</label>
                    <select
                      value={newService.iconName}
                      onChange={(e) => setNewService({ ...newService, iconName: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#39ff14]"
                    >
                      {Object.keys(ICON_MAP).map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">اللون (Tailwind class)</label>
                    <input
                      type="text"
                      value={newService.color}
                      onChange={(e) => setNewService({ ...newService, color: e.target.value })}
                      placeholder="مثلاً: text-pink-400"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#39ff14]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">خيارات الخدمة (Options)</h3>
                    <button 
                      type="button"
                      onClick={addOption}
                      className="text-sm bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg border border-white/10 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> إضافة خيار
                    </button>
                  </div>

                  {newService.options.map((opt, oIdx) => (
                    <div key={oIdx} className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={opt.name}
                            onChange={(e) => updateOption(oIdx, 'name', e.target.value)}
                            placeholder="اسم الخيار (مثلاً: متابعين)"
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#39ff14] text-sm"
                          />
                        </div>
                        <div className="w-32">
                          <select
                            value={opt.iconName}
                            onChange={(e) => updateOption(oIdx, 'iconName', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#39ff14] text-sm"
                          >
                            {Object.keys(ICON_MAP).map(icon => (
                              <option key={icon} value={icon}>{icon}</option>
                            ))}
                          </select>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeOption(oIdx)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-400">الخطط (Plans)</h4>
                          <button 
                            type="button"
                            onClick={() => addPlan(oIdx)}
                            className="text-xs bg-white/5 hover:bg-white/10 text-white px-2 py-1 rounded-md border border-white/10"
                          >
                            إضافة خطة
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {opt.plans.map((plan: any, pIdx: number) => (
                            <div key={pIdx} className="flex items-center gap-2 bg-black/50 p-2 rounded-xl border border-white/5">
                              <input
                                type="text"
                                value={plan.quantity}
                                onChange={(e) => updatePlan(oIdx, pIdx, 'quantity', e.target.value)}
                                placeholder="الكمية"
                                className="flex-1 bg-transparent border-none focus:ring-0 text-xs text-white"
                              />
                              <input
                                type="text"
                                value={plan.price}
                                onChange={(e) => updatePlan(oIdx, pIdx, 'price', e.target.value)}
                                placeholder="السعر"
                                className="w-20 bg-transparent border-none focus:ring-0 text-xs text-[#39ff14] font-bold"
                              />
                              <button 
                                type="button"
                                onClick={() => removePlan(oIdx, pIdx)}
                                className="text-slate-500 hover:text-red-500"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#39ff14] text-black py-4 rounded-2xl font-bold hover:bg-[#32e612] transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] mt-4"
                >
                  حفظ الخدمة
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function AdminHome({ orders, customers }: { orders: any[], customers: any[] }) {
  const totalRevenue = orders.filter(o => o.status === 'مكتمل').reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
  const completedOrders = orders.filter(o => o.status === 'مكتمل').length;
  const newOrders = orders.filter(o => o.status === 'جديد').length;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">نظرة عامة</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
              <div className="text-amber-400 font-bold text-xl">ر.س</div>
            </div>
            <div>
              <p className="text-slate-400 text-sm">إجمالي الإيرادات</p>
              <h3 className="text-2xl font-bold text-white">{totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#39ff14]/10 rounded-2xl flex items-center justify-center border border-[#39ff14]/20">
              <ShoppingCart className="w-6 h-6 text-[#39ff14]" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">إجمالي الطلبات</p>
              <h3 className="text-2xl font-bold text-white">{orders.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
              <AlertCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">طلبات جديدة</p>
              <h3 className="text-2xl font-bold text-white">{newOrders}</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">طلبات مكتملة</p>
              <h3 className="text-2xl font-bold text-white">{completedOrders}</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">إجمالي العملاء</p>
              <h3 className="text-2xl font-bold text-white">{customers.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">أحدث الطلبات</h3>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-black/50 rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 font-mono text-xs">
                  #{order.id.slice(-4).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium" dir="ltr">{order.customerPhone || order.customerEmail || 'غير متوفر'}</p>
                  <p className="text-slate-500 text-sm">{order.createdAt?.toDate().toLocaleDateString('en-GB') || 'N/A'}</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-[#39ff14] font-bold">{order.totalAmount} ر.س</p>
                <p className="text-slate-500 text-sm">{order.status}</p>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center text-slate-500 py-8">لا توجد طلبات بعد</div>
          )}
        </div>
      </div>
    </>
  );
}

export function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [filter, setFilter] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === ADMIN_EMAIL) {
        setUser(currentUser);
      } else {
        navigate('/admin/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribeOrders = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ref: doc.ref,
        ...doc.data()
      }));
      setOrders(fetchedOrders);
    });

    const qUsers = query(collection(db, 'users'));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomers(fetchedUsers);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeUsers();
    };
  }, [user]);

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#39ff14]">جاري التحميل...</div>;
  }

  if (!user) return null;



  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'مكتمل':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20"><CheckCircle2 className="w-3 h-3" /> مكتمل</span>;
      case 'قيد التنفيذ':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20"><Clock className="w-3 h-3" /> قيد التنفيذ</span>;
      case 'ملغي':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20"><XCircle className="w-3 h-3" /> ملغي</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20"><AlertCircle className="w-3 h-3" /> جديد</span>;
    }
  };

  const handleUpdateStatus = async (orderRef: any, newStatus: string) => {
    try {
      await updateDoc(orderRef, { status: newStatus });
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      showToast('تم تحديث حالة الطلب بنجاح', 'success');
    } catch (err) {
      console.error("Error updating status:", err);
      showToast('حدث خطأ أثناء تحديث الحالة', 'error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('تم النسخ!', 'success');
  };

  const handleDeleteOrder = async (orderId: string, orderRef: any) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      try {
        await deleteDoc(orderRef);
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
        showToast('تم حذف الطلب بنجاح', 'success');
      } catch (err) {
        console.error("Error deleting order:", err);
        showToast('حدث خطأ أثناء حذف الطلب', 'error');
      }
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      try {
        await deleteDoc(doc(db, 'users', customerId));
        showToast('تم حذف العميل بنجاح', 'success');
      } catch (err) {
        console.error("Error deleting customer:", err);
        showToast('حدث خطأ أثناء حذف العميل', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-300 font-sans flex" dir="rtl">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 w-64 bg-[#111] border-l border-white/5 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 transition-transform duration-300 z-50 flex flex-col`}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#39ff14]/10 rounded-xl flex items-center justify-center border border-[#39ff14]/20">
              <LayoutDashboard className="w-5 h-5 text-[#39ff14]" />
            </div>
            <span className="text-xl font-bold text-white">Fame Store</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => { setActiveTab('home'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'home' ? 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <LayoutDashboard className="w-5 h-5" />
            الرئيسية
          </button>
          <button onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'orders' ? 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <ShoppingCart className="w-5 h-5" />
            الطلبات
          </button>
          <button onClick={() => { setActiveTab('services'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'services' ? 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Settings className="w-5 h-5" />
            الخدمات
          </button>
          <button onClick={() => { setActiveTab('customers'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'customers' ? 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Users className="w-5 h-5" />
            العملاء
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => { signOut(auth); navigate('/admin/login'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:mr-64 p-4 lg:p-8">
        <div className="lg:hidden mb-4">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-[#111] border border-white/5 rounded-xl text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
        
        {activeTab === 'home' && (
          <AdminHome orders={orders} customers={customers} />
        )}
        {activeTab === 'orders' && (
          <AdminOrders 
            orders={orders} 
            filter={filter} 
            setFilter={setFilter} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            selectedOrder={selectedOrder} 
            setSelectedOrder={setSelectedOrder} 
            getStatusBadge={getStatusBadge}
            handleUpdateStatus={handleUpdateStatus}
            copyToClipboard={copyToClipboard}
            handleDeleteOrder={handleDeleteOrder}
          />
        )}
        {activeTab === 'services' && (
          <AdminServices showToast={showToast} />
        )}
        {activeTab === 'customers' && (
          <AdminCustomers customers={customers} handleDeleteCustomer={handleDeleteCustomer} />
        )}
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#111]/95 backdrop-blur z-10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                تفاصيل الطلب <span className="text-[#39ff14] font-mono text-sm">#{selectedOrder.id.slice(-6).toUpperCase()}</span>
              </h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-slate-400 hover:text-white transition-colors bg-black/50 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/50 border border-white/5 rounded-2xl p-4">
                  <div className="text-sm text-slate-500 mb-1">معلومات العميل</div>
                  <div className="font-medium text-white" dir="ltr">{selectedOrder.customerPhone || selectedOrder.customerEmail || 'غير متوفر'}</div>
                  {selectedOrder.customerName && <div className="text-sm text-slate-400 mt-1">{selectedOrder.customerName}</div>}
                </div>
                <div className="bg-black/50 border border-white/5 rounded-2xl p-4">
                  <div className="text-sm text-slate-500 mb-1">تاريخ الطلب</div>
                  <div className="font-medium text-white" dir="ltr">
                    {selectedOrder.createdAt?.toDate().toLocaleString('en-GB') || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Services List */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">الخدمات المطلوبة</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="bg-black/50 border border-white/5 rounded-2xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-bold text-white">{item.option?.name || item.serviceName}</div>
                          <div className="text-sm text-slate-400 mt-1">الكمية: {item.plan?.quantity || item.quantity}</div>
                        </div>
                        <div className="font-bold text-[#39ff14]">{item.plan?.price || item.price} ر.س</div>
                      </div>
                      <div className="bg-[#1a1a1a] rounded-xl p-3 flex items-center justify-between gap-4 border border-white/5">
                        <div className="text-sm font-mono text-slate-300 truncate" dir="ltr">
                          {item.link}
                        </div>
                        <button 
                          onClick={() => copyToClipboard(item.link)}
                          className="p-2 text-slate-400 hover:text-[#39ff14] hover:bg-[#39ff14]/10 rounded-lg transition-colors shrink-0"
                          title="نسخ الرابط"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-black/50 border border-white/5 rounded-2xl p-5">
                <h3 className="text-lg font-bold text-white mb-4">تحديث حالة الطلب</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <select 
                    value={selectedOrder.status || 'جديد'}
                    onChange={(e) => setSelectedOrder({...selectedOrder, status: e.target.value})}
                    className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39ff14] transition-colors"
                  >
                    <option value="جديد">جديد</option>
                    <option value="قيد التنفيذ">قيد التنفيذ</option>
                    <option value="مكتمل">مكتمل</option>
                    <option value="ملغي">ملغي</option>
                  </select>
                  <button 
                    onClick={() => handleUpdateStatus(selectedOrder.ref, selectedOrder.status)}
                    className="bg-[#39ff14] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#32e612] transition-all shadow-[0_0_15px_rgba(57,255,20,0.2)] whitespace-nowrap"
                  >
                    حفظ التحديث
                  </button>
                  <button 
                    onClick={() => handleDeleteOrder(selectedOrder.id, selectedOrder.ref)}
                    className="bg-red-500/10 text-red-500 border border-red-500/20 px-8 py-3 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all whitespace-nowrap"
                  >
                    حذف الطلب
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-xl font-medium shadow-2xl flex items-center gap-3 ${
              toast.type === 'success' 
                ? 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20' 
                : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
