import React from 'react';
import { MapPin, Clock3, Mail, ClipboardList, Heart } from 'lucide-react';
import { STORE_INFO } from '../data/desserts';
import { HeartDoodle, SparkleDoodle, WavyCreamDivider } from './DessertDoodles';

export const VisitContactSection: React.FC = () => <section id="contact" className="relative bg-[#FFF8F4] py-16 sm:py-24 overflow-hidden text-[#2B1410]">
  <div className="absolute -left-20 top-10 w-80 h-80 bg-[#FED7AA]/35 rounded-full blur-3xl"/><div className="absolute -right-20 bottom-0 w-96 h-96 bg-[#FDA4AF]/25 rounded-full blur-3xl"/>
  <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
    <div className="bg-white/90 backdrop-blur-md border border-[#F5DDD5] shadow-sweet-lg rounded-[36px] sm:rounded-[44px] px-6 sm:px-10 py-8 sm:py-10 grid md:grid-cols-12 gap-8 items-center">
      <div className="md:col-span-4"><div className="flex items-start gap-3"><MapPin className="w-6 h-6 text-[#9E1236] mt-1 shrink-0"/><div><h2 className="font-serif text-4xl sm:text-5xl font-bold">Visit Us ♡</h2><p className="text-[10px] sm:text-[11px] font-extrabold tracking-[.18em] text-[#8A4A3E] mt-2">GRAB A SWEET TREAT OR PLACE A CUSTOM ORDER!</p><p className="mt-5 text-lg leading-snug">1100 Louisiana St.<br/><strong>Houston, Texas</strong></p></div></div></div>
      <div className="md:col-span-3 md:border-l border-[#F3D7CE] md:pl-8"><div className="flex items-center gap-2 mb-3"><Clock3 className="w-5 h-5 text-[#9E1236]"/><strong>Store Hours</strong></div><div className="space-y-1 text-sm text-[#553028]">{STORE_INFO.hours.map(h=><div key={h.days} className="flex justify-between gap-4"><span>{h.days}</span><b>{h.time}</b></div>)}</div></div>
      <div className="md:col-span-3 md:border-l border-[#F3D7CE] md:pl-8"><div className="flex items-center gap-2 mb-2"><Mail className="w-5 h-5 text-[#9E1236]"/><strong>Email Us</strong></div><p className="text-sm break-all mb-5">{STORE_INFO.email}</p><div className="flex items-center gap-2 mb-2"><ClipboardList className="w-5 h-5 text-[#9E1236]"/><strong>Custom Orders</strong></div><p className="text-sm">We are currently working on a <u className="font-bold">{STORE_INFO.leadTime}</u>.</p></div>
      <div className="md:col-span-2 text-center md:text-right"><div className="font-script text-3xl text-[#9E1236] font-bold rotate-[-4deg] inline-block">Local Desserts<br/>Brighter Days ♡</div></div>
    </div>
  </div>
</section>;
