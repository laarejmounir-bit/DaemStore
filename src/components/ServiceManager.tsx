import React, { useState } from 'react';
import { useServices } from '../hooks/useServices';
import { X, Trash2, Save, Plus } from 'lucide-react';
import { doc, getDoc, getDocFromServer } from 'firebase/firestore';
import { db } from '../firebase';

export const ServiceManager: React.FC = () => {
  const { services, loading, updateService, refetch } = useServices();
  const [editingOption, setEditingOption] = useState<{
    serviceId: string;
    optionName: string;
    isSpecial: boolean;
    plans: any[];
  } | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">جاري التحميل...</div>;
  }

  const handleEditClick = async (serviceId: string, optionName: string, isSpecial: boolean) => {
    setIsFetching(true);
    try {
      // Fetch fresh data from Firestore to ensure we have the latest prices and quantities
      // Using getDocFromServer to explicitly bypass any local cache
      const docRef = doc(db, 'services', serviceId);
      const docSnap = await getDocFromServer(docRef);
      
      if (docSnap.exists()) {
        const serviceData = docSnap.data();
        let currentPlans: any[] = [];
        
        if (!isSpecial) {
          const option = serviceData.options?.find((o: any) => o.name === optionName);
          if (option && option.plans) {
            currentPlans = option.plans;
          }
        } else {
          const special = serviceData.specials?.find((s: any) => s.name === optionName);
          if (special && special.plans) {
            currentPlans = special.plans;
          }
        }

        setEditingOption({
          serviceId,
          optionName,
          isSpecial,
          plans: JSON.parse(JSON.stringify(currentPlans))
        });
      }
    } catch (error) {
      console.error("Error fetching latest service data:", error);
      alert("حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsFetching(false);
    }
  };

  const handlePlanChange = (index: number, field: 'quantity' | 'price' | 'name', value: string) => {
    if (!editingOption) return;
    const newPlans = [...editingOption.plans];
    newPlans[index] = { ...newPlans[index], [field]: value };
    setEditingOption({ ...editingOption, plans: newPlans });
  };

  const handleAddPlan = () => {
    if (!editingOption) return;
    setEditingOption({
      ...editingOption,
      plans: [...editingOption.plans, { quantity: '', price: '' }]
    });
  };

  const handleRemovePlan = (index: number) => {
    if (!editingOption) return;
    const newPlans = [...editingOption.plans];
    newPlans.splice(index, 1);
    setEditingOption({ ...editingOption, plans: newPlans });
  };

  const handleSave = async () => {
    if (!editingOption) return;
    
    try {
      // Fetch the absolute latest document from the server before saving
      // This prevents overwriting other options with stale data from the local state
      const docRef = doc(db, 'services', editingOption.serviceId);
      const docSnap = await getDocFromServer(docRef);
      
      if (!docSnap.exists()) {
        alert("الخدمة غير موجودة.");
        return;
      }

      const serviceData = docSnap.data();
      
      if (!editingOption.isSpecial) {
        const optionIndex = serviceData.options?.findIndex((o: any) => o.name === editingOption.optionName);
        if (optionIndex !== undefined && optionIndex !== -1) {
          serviceData.options[optionIndex].plans = editingOption.plans;
        }
      } else {
        const specialIndex = serviceData.specials?.findIndex((s: any) => s.name === editingOption.optionName);
        if (specialIndex !== undefined && specialIndex !== -1) {
          serviceData.specials[specialIndex].plans = editingOption.plans;
        }
      }

      await updateService(editingOption.serviceId, serviceData);
      await refetch();
      setEditingOption(null);
    } catch (error) {
      console.error("Error saving service:", error);
      alert("حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.");
    }
  };

  const handleDelete = async () => {
    if (!editingOption) return;
    if (!window.confirm('هل أنت متأكد من حذف هذه الخدمة بالكامل؟')) return;

    try {
      // Fetch the absolute latest document from the server before deleting
      const docRef = doc(db, 'services', editingOption.serviceId);
      const docSnap = await getDocFromServer(docRef);
      
      if (!docSnap.exists()) {
        alert("الخدمة غير موجودة.");
        return;
      }

      const serviceData = docSnap.data();
      
      if (!editingOption.isSpecial) {
        serviceData.options = serviceData.options?.filter((o: any) => o.name !== editingOption.optionName);
      } else {
        serviceData.specials = serviceData.specials?.filter((s: any) => s.name !== editingOption.optionName);
      }

      await updateService(editingOption.serviceId, serviceData);
      await refetch();
      setEditingOption(null);
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("حدث خطأ أثناء الحذف. يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="space-y-12">
      {services.map(service => (
        <div key={service.id} className="space-y-6">
          <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">{service.name}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {service.options?.map((option: any) => (
              <div 
                key={option.name}
                onClick={() => handleEditClick(service.id, option.name, false)}
                className="bg-slate-900 hover:bg-slate-800 cursor-pointer p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all flex items-center justify-center text-center group shadow-lg"
              >
                <span className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">{option.name}</span>
              </div>
            ))}

            {service.specials?.map((special: any) => (
              <div 
                key={special.name}
                onClick={() => handleEditClick(service.id, special.name, true)}
                className="bg-slate-900 hover:bg-slate-800 cursor-pointer p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all flex items-center justify-center text-center group shadow-lg"
              >
                <span className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">{special.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {isFetching && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 px-6 py-4 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white font-medium">جاري جلب البيانات...</span>
          </div>
        </div>
      )}

      {editingOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl my-8">
            <div className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
              <h3 className="text-xl font-bold text-white">{editingOption.optionName}</h3>
              <button onClick={() => setEditingOption(null)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {editingOption.plans.map((plan, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end bg-slate-800/50 p-4 rounded-xl border border-white/5">
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-400 mb-2">الكمية / الاسم</label>
                    <input
                      type="text"
                      value={plan.name !== undefined ? plan.name : (plan.quantity || '')}
                      onChange={(e) => handlePlanChange(idx, plan.name !== undefined ? 'name' : 'quantity', e.target.value)}
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      dir="ltr"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-400 mb-2">السعر (ر.س)</label>
                    <input
                      type="number"
                      value={plan.price !== undefined ? plan.price : ''}
                      onChange={(e) => handlePlanChange(idx, 'price', e.target.value)}
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      dir="ltr"
                    />
                  </div>
                  <button 
                    onClick={() => handleRemovePlan(idx)}
                    className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-colors w-full sm:w-auto flex justify-center"
                    title="حذف الباقة"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={handleAddPlan}
                className="w-full py-4 border-2 border-dashed border-white/10 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                إضافة باقة جديدة
              </button>
            </div>

            <div className="p-6 border-t border-white/5 flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-slate-900 z-10">
              <button
                onClick={handleSave}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                حفظ التغييرات
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                حذف الخدمة بالكامل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
