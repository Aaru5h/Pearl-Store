"use client";

import { useState } from "react";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import Link from "next/link";

export default function AdminNewProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock save
    setTimeout(() => {
      setIsSubmitting(false);
      window.history.back();
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products" 
          className="p-2 text-stone hover:text-charcoal hover:bg-fog rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-[24px] font-display font-semibold text-bark">Add New Product</h1>
          <p className="text-stone">Create a new product listing in your store.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-pebble p-6 shadow-card space-y-4">
              <div>
                <label className="block text-[14px] font-medium text-charcoal mb-2">Product Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Handcrafted Ceramic Mug"
                  className="w-full px-4 py-2 border border-pebble rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                />
              </div>
              <div>
                <label className="block text-[14px] font-medium text-charcoal mb-2">Description</label>
                <textarea 
                  rows={5}
                  required
                  placeholder="Describe your product..."
                  className="w-full px-4 py-2 border border-pebble rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal/20 resize-y"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-pebble p-6 shadow-card space-y-4">
              <h2 className="text-[16px] font-semibold text-charcoal mb-4">Media</h2>
              
              {/* Image Upload Area */}
              <div className="border-2 border-dashed border-pebble rounded-xl p-8 text-center hover:bg-fog/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-stone mx-auto mb-3" />
                <p className="text-[14px] font-medium text-charcoal mb-1">Click to upload or drag and drop</p>
                <p className="text-[13px] text-stone">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {/* Mock image thumbnails */}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-pebble p-6 shadow-card space-y-4">
              <h2 className="text-[16px] font-semibold text-charcoal mb-4">Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-medium text-charcoal mb-2">Price (₹)</label>
                  <input 
                    type="number" 
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-pebble rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-charcoal mb-2">Compare at Price (₹)</label>
                  <input 
                    type="number" 
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-pebble rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-pebble p-6 shadow-card space-y-4">
              <h2 className="text-[16px] font-semibold text-charcoal mb-4">Status</h2>
              <select className="w-full px-4 py-2 border border-pebble rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal/20 bg-white">
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
              </select>
            </div>

            <div className="bg-white rounded-2xl border border-pebble p-6 shadow-card space-y-4">
              <h2 className="text-[16px] font-semibold text-charcoal mb-4">Organization</h2>
              <div>
                <label className="block text-[14px] font-medium text-charcoal mb-2">Category</label>
                <select className="w-full px-4 py-2 border border-pebble rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal/20 bg-white">
                  <option value="">Select Category</option>
                  <option value="home-kitchen">Home & Kitchen</option>
                  <option value="decor">Decor</option>
                  <option value="wellness">Wellness</option>
                </select>
              </div>
              <div>
                <label className="block text-[14px] font-medium text-charcoal mb-2">Tags</label>
                <input 
                  type="text" 
                  placeholder="Vintage, Cotton, etc."
                  className="w-full px-4 py-2 border border-pebble rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-pebble p-6 shadow-card space-y-4">
              <h2 className="text-[16px] font-semibold text-charcoal mb-4">Inventory</h2>
              <div>
                <label className="block text-[14px] font-medium text-charcoal mb-2">Stock Quantity</label>
                <input 
                  type="number" 
                  min="0"
                  required
                  placeholder="0"
                  className="w-full px-4 py-2 border border-pebble rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                />
              </div>
              <div>
                <label className="block text-[14px] font-medium text-charcoal mb-2">SKU (Optional)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-pebble rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-pebble">
          <Link 
            href="/admin/products"
            className="px-6 py-2 text-[14px] font-medium text-stone hover:text-charcoal transition-colors"
          >
            Cancel
          </Link>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-bark text-white rounded-lg hover:bg-bark/90 transition-colors text-[14px] font-medium disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}
