"use client";

import { Plus, Edit3, Trash2 } from "lucide-react";

export default function AddressesPage() {
  const mockAddresses = [
    {
      id: "addr_1",
      name: "John Doe",
      phone: "+91 98765 43210",
      line1: "Flat 402, Pearl Residency",
      line2: "MG Road, Indiranagar",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      isDefault: true,
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-pebble">
        <h2 className="font-sans font-semibold text-[20px] text-charcoal">
            Saved Addresses
        </h2>
        <button className="flex items-center gap-2 text-[14px] font-medium text-bark hover:text-terracotta transition-colors">
            <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockAddresses.map((addr) => (
              <div key={addr.id} className="border border-pebble rounded-xl p-6 relative">
                  {addr.isDefault && (
                      <span className="absolute top-6 right-6 px-2 py-0.5 bg-sage/10 text-sage text-[11px] font-bold uppercase tracking-wider rounded-md">
                          Default
                      </span>
                  )}
                  
                  <h3 className="font-medium text-[16px] text-charcoal mb-1">{addr.name}</h3>
                  <p className="text-[14px] text-stone mb-4">{addr.phone}</p>
                  
                  <div className="text-[14px] text-charcoal/90 leading-relaxed mb-6">
                      <p>{addr.line1}</p>
                      {addr.line2 && <p>{addr.line2}</p>}
                      <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-pebble">
                      <button className="text-[13px] font-medium text-stone hover:text-bark flex items-center gap-1.5 transition-colors">
                          <Edit3 className="w-4 h-4" /> Edit
                      </button>
                      <button className="text-[13px] font-medium text-stone hover:text-error flex items-center gap-1.5 transition-colors">
                          <Trash2 className="w-4 h-4" /> Remove
                      </button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
}
