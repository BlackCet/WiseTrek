import React from "react";
import { Button } from "@mui/material";
import { User, Sparkles, CloudSun, Route, Wallet, CalendarRange } from "lucide-react";

const Feature = ({ icon, bg, title, desc }) => (
  <div className="text-center group">
    <div className={`w-14 h-14 rounded-full ${bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm`}>{icon}</div>
    <h4 className="font-bold text-gray-900 text-sm mb-1">{title}</h4>
    <p className="text-xs text-gray-500">{desc}</p>
  </div>
);

export const PlannerOptions = ({ onSelectMode }) => {
  return (
    <div className="space-y-20">
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* MANUAL PLAN CARD */}
        <div onClick={() => onSelectMode('manual')} className="group relative bg-white rounded-[2.5rem] p-10 hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-transparent hover:border-blue-500 h-[420px] flex flex-col shadow-sm">
          <div className="relative flex-grow">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-blue-600"><User size={32} /></div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Custom Manual Plan</h3>
            <p className="text-gray-600 text-lg leading-relaxed">Take the driver's seat. Hand-pick every stop, hotel, and local activity with our step-by-step advisor.</p>
          </div>
          <Button variant="contained" fullWidth onClick={(e) => { e.stopPropagation(); onSelectMode('manual'); }} className="w-full rounded-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 !text-white hover:to-blue-800 font-bold py-3 shadow-lg" sx={{ textTransform: 'none' }}>
            Start Planning
          </Button>
        </div>

        {/* AI PLAN CARD */}
        <div onClick={() => onSelectMode('ai')} className="group relative bg-white rounded-[2.5rem] p-10 hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-transparent hover:border-purple-500 h-[420px] flex flex-col shadow-sm">
          <div className="relative flex-grow">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-purple-600"><Sparkles size={32} /></div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">AI Instant Advisor</h3>
            <p className="text-gray-600 text-lg leading-relaxed">Let our artificial intelligence craft the perfect day-trip instantly based on your mood and budget.</p>
          </div>
          <Button variant="contained" fullWidth onClick={(e) => { e.stopPropagation(); onSelectMode('ai'); }} className="w-full rounded-full bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 !text-white font-bold py-3 shadow-lg" sx={{ textTransform: 'none' }}>
            Let AI Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto pb-10">
        <Feature icon={<CloudSun className="text-blue-600"/>} bg="bg-blue-100" title="Live Weather" desc="Updated real-time"/>
        <Feature icon={<Route className="text-purple-600"/>} bg="bg-purple-100" title="Smart Routes" desc="Optimized paths"/>
        <Feature icon={<Wallet className="text-pink-600"/>} bg="bg-pink-100" title="Budgeting" desc="Cost management"/>
        <Feature icon={<CalendarRange className="text-orange-600"/>} bg="bg-orange-100" title="Local Events" desc="Exclusive access"/>
      </div>
    </div>
  );
};