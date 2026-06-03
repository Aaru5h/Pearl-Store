"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";

export default function DeliveryStep() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we'd save this to a checkout store or backend
    router.push("/checkout/payment");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-pebble">
        <MapPin className="w-6 h-6 text-terracotta" />
        <h2 className="text-[24px] font-display text-bark">Delivery Details</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-[14px] font-medium text-charcoal">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-pebble bg-cream/50 focus:bg-white focus:border-stone focus:ring-1 focus:ring-stone transition-all outline-none text-charcoal"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-[14px] font-medium text-charcoal">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-pebble bg-cream/50 focus:bg-white focus:border-stone focus:ring-1 focus:ring-stone transition-all outline-none text-charcoal"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-[14px] font-medium text-charcoal">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full md:w-1/2 px-4 py-3 rounded-lg border border-pebble bg-cream/50 focus:bg-white focus:border-stone focus:ring-1 focus:ring-stone transition-all outline-none text-charcoal"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="addressLine1" className="block text-[14px] font-medium text-charcoal">Address Line 1</label>
          <input
            type="text"
            id="addressLine1"
            name="addressLine1"
            required
            value={formData.addressLine1}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-pebble bg-cream/50 focus:bg-white focus:border-stone focus:ring-1 focus:ring-stone transition-all outline-none text-charcoal"
            placeholder="House/Flat No., Building Name, Street"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="addressLine2" className="block text-[14px] font-medium text-charcoal">Address Line 2 (Optional)</label>
          <input
            type="text"
            id="addressLine2"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-pebble bg-cream/50 focus:bg-white focus:border-stone focus:ring-1 focus:ring-stone transition-all outline-none text-charcoal"
            placeholder="Landmark, Area, etc."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="city" className="block text-[14px] font-medium text-charcoal">City</label>
            <input
              type="text"
              id="city"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-pebble bg-cream/50 focus:bg-white focus:border-stone focus:ring-1 focus:ring-stone transition-all outline-none text-charcoal"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="state" className="block text-[14px] font-medium text-charcoal">State</label>
            <input
              type="text"
              id="state"
              name="state"
              required
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-pebble bg-cream/50 focus:bg-white focus:border-stone focus:ring-1 focus:ring-stone transition-all outline-none text-charcoal"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="pincode" className="block text-[14px] font-medium text-charcoal">PIN Code</label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              required
              value={formData.pincode}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-pebble bg-cream/50 focus:bg-white focus:border-stone focus:ring-1 focus:ring-stone transition-all outline-none text-charcoal"
            />
          </div>
        </div>

        <div className="pt-8 flex justify-end">
           <button type="submit" className="btn-primary py-4 px-8 w-full md:w-auto flex justify-center items-center gap-2">
               Continue to Payment <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </form>
    </div>
  );
}
