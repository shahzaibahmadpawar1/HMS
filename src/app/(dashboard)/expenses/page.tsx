import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import * as motion from "framer-motion/client";

export default function ExpensesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8 flex flex-col relative z-10">
        
        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">Expenses</h1>
            <p className="text-[13.5px] text-slate-500 font-medium">Total: Rs 3,000 this month</p>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="month" 
              defaultValue="2026-09"
              className="h-9 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[10px] text-[13px] font-medium text-slate-700 dark:text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            />
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 px-4 rounded-[10px] text-[13px] font-semibold gap-1.5 shadow-sm">
              <Plus className="w-4 h-4" /> Add Expense
            </Button>
          </div>
        </motion.div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Table Area */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left table-fixed">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700/60">
                    <tr>
                      <th className="w-[20%] px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Category</th>
                      <th className="w-[30%] px-2 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Description</th>
                      <th className="w-[20%] px-2 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                      <th className="w-[15%] px-2 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                      <th className="w-[15%] px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="inline-flex px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700">
                          Transport
                        </span>
                      </td>
                      <td className="px-2 py-3.5 text-[13px] text-slate-700 dark:text-slate-200 font-medium">
                        transport
                      </td>
                      <td className="px-2 py-3.5 text-[12.5px] text-slate-500 font-medium">
                        05/09/2026
                      </td>
                      <td className="px-2 py-3.5 text-[13px] font-bold text-amber-500">
                        Rs 3,000
                      </td>
                      <td className="px-4 py-3.5 text-[12px] text-slate-400 font-medium text-right">
                        —
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Sidebar Summary */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/60 p-5 sticky top-24">
              <div className="text-[13px] font-bold text-slate-900 dark:text-slate-100 mb-4">By Category</div>
              
              <div className="py-2.5 border-b border-slate-200/80 dark:border-slate-700/60">
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-[12.5px] font-medium text-slate-600 dark:text-slate-300">Transport</span>
                  <span className="text-[13px] font-bold text-amber-500">Rs 3,000</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-full"></div>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-baseline">
                <span className="text-[13px] font-bold text-slate-900 dark:text-slate-100">Total</span>
                <span className="text-[14px] font-extrabold text-red-500">Rs 3,000</span>
              </div>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
