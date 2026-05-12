'use client';

import { FlowButton } from "@/components/ui/flow-button";
import { SterlingGateKineticNavigation } from "@/components/ui/sterling-gate-kinetic-navigation";

const FlowButtonDemo = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 space-y-8">
      <SterlingGateKineticNavigation />
      <div className="text-center space-y-4 max-w-lg">
        <h1 className="text-4xl font-black tracking-tight uppercase">Flow Button Demo</h1>
        <p className="text-neutral-500 font-medium">A premium, animated button component with magnetic icons and smooth transitions.</p>
      </div>
      
      <div className="p-12 rounded-3xl border border-neutral-100 bg-white shadow-sm flex flex-col items-center gap-6">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Default Style</p>
        <FlowButton text="Flow Button" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl border border-neutral-100 bg-white flex flex-col items-center gap-4">
             <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Custom Text</p>
             <FlowButton text="Explore Stories" />
        </div>
        <div className="p-8 rounded-2xl border border-neutral-100 bg-white flex flex-col items-center gap-4">
             <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Wide Variant</p>
             <FlowButton text="Contact Our Team Today" className="px-12" />
        </div>
      </div>
    </div>
  );
}

export default FlowButtonDemo;
