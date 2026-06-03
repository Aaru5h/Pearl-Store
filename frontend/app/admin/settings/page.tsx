"use client";

import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-[24px] font-display font-semibold text-bark">Settings</h1>
        <p className="text-stone">Configure store preferences and settings.</p>
      </div>

      <div className="bg-white rounded-2xl border border-pebble shadow-card overflow-hidden">
        <div className="p-6 border-b border-pebble">
          <h2 className="text-[18px] font-semibold text-charcoal mb-4">General Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[14px] font-medium text-charcoal mb-1">Store Name</label>
              <input 
                type="text" 
                defaultValue="Pearl Store"
                className="w-full px-4 py-2 border border-pebble rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-charcoal/20"
              />
            </div>
            
            <div>
              <label className="block text-[14px] font-medium text-charcoal mb-1">Contact Email</label>
              <input 
                type="email" 
                defaultValue="hello@pearlstore.com"
                className="w-full px-4 py-2 border border-pebble rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-charcoal/20"
              />
            </div>

            <div>
              <label className="block text-[14px] font-medium text-charcoal mb-1">Currency</label>
              <select className="w-full px-4 py-2 border border-pebble rounded-lg text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20">
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 bg-fog/20 flex justify-end">
          <button className="inline-flex items-center gap-2 px-6 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal/90 transition-colors text-[14px] font-medium">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
