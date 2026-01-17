import React, { useState } from 'react';
import {
  Building2, Crown, Search, Filter, ChevronDown, ChevronRight,
  X, AlertTriangle, CheckCircle, Clock, Ban, Users, TrendingUp,
  TrendingDown, RefreshCw, Database, AlertCircle, Settings, Info,
  ExternalLink, Menu, LayoutGrid, List
} from 'lucide-react';
import clsx from 'clsx';
import {
  rooms, roomTypeSummary, ownerRollup, opsData, roomTypeComparison,
  technicalData, getRoomDetails, formatCurrency, formatPercent, formatRS, getEffectiveWindow
} from './data/sampleData';
import './App.css';

// Simple Tooltip Component
const Tooltip = ({ text, children, position = 'top', align = 'center' }) => (
  <div className="group relative border-b border-dotted border-slate-300 inline-block cursor-help">
    {children}
    <div className={clsx(
      "absolute hidden group-hover:block w-56 p-2 bg-slate-900 text-white text-[10px] rounded-lg shadow-2xl z-[100] text-center font-normal leading-tight ring-1 ring-white/10",
      position === 'top' ? "bottom-full mb-2" : "top-full mt-2",
      align === 'center' && "left-1/2 -translate-x-1/2",
      align === 'left' && "left-0",
      align === 'right' && "right-0"
    )}>
      {text}
      <div className={clsx(
        "absolute border-4 border-transparent",
        align === 'center' && "left-1/2 -translate-x-1/2",
        align === 'left' && "left-4",
        align === 'right' && "right-4",
        position === 'top' ? "top-full border-t-slate-900" : "bottom-full border-b-slate-900"
      )} />
    </div>
  </div>
);

// Badge Components
const CIRSBadge = ({ status }) => {
  const styles = {
    'Ready': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Not Ready': 'bg-amber-100 text-amber-700 border-amber-200',
    'Blocked': 'bg-red-100 text-red-700 border-red-200',
    'Occupied': 'bg-blue-100 text-blue-700 border-blue-200'
  };
  return (
    <span className={clsx('px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider whitespace-nowrap', styles[status])}>
      {status}
    </span>
  );
};

const RiskBadge = ({ level }) => {
  const styles = {
    'Low': 'bg-emerald-100 text-emerald-700',
    'Medium': 'bg-amber-100 text-amber-700',
    'High': 'bg-red-100 text-red-700'
  };
  return (
    <span className={clsx('px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider', styles[level])}>
      {level} Risk
    </span>
  );
};

const OutlierBadge = ({ reason }) => (
  <Tooltip text={reason}>
    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-700 rounded uppercase tracking-wider border border-orange-200">
      Outlier
    </span>
  </Tooltip>
);

// Filter Drawer Component
const FilterDrawer = ({ isOpen, onClose, isRSEnabled }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-80 bg-white h-full shadow-2xl flex flex-col drawer-enter overflow-visible">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" /> Filters
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Date Range</label>
            <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 font-medium">
              <option>Last 30 Days</option>
              <option>Last 60 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Room Type</label>
            <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 font-medium">
              <option>All Room Types</option>
              <option>Studio</option>
              <option>1BR Suite</option>
              <option>2BR Suite</option>
              <option>Penthouse</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">CIRS</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Ready', 'Not Ready', 'Blocked', 'Occupied'].map(status => (
                <label key={status} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-white transition-colors">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
                  <span className="font-medium text-xs font-roboto">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {isRSEnabled && (
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                  Individual Owners Only
                </div>
              </label>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  Outliers Only
                </span>
              </label>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <button onClick={onClose} className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-lg">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// ... (Rest of components will follow in fragments to avoid token limit)
export default function App() {
  const [activeTab, setActiveTab] = useState('performance');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isRSEnabled, setIsRSEnabled] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Filter Pills (Mock)
  const activeFilters = [
    { label: 'Date Range', value: 'Last 30 Days' },
    { label: 'Room Type', value: 'All' },
    { label: 'CIRS', value: 'Ready, Not Ready, Blocked, Occupied' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-roboto text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-40 sticky top-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsFiltersOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors relative"
          >
            <Filter className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
          </button>
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-sm shadow-blue-100">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">The Code</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hotel Performance Hub</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setIsRSEnabled(true)}
              className={clsx(
                "px-3 py-1.5 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider",
                isRSEnabled ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              RS Enabled
            </button>
            <button
              onClick={() => setIsRSEnabled(false)}
              className={clsx(
                "px-3 py-1.5 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider",
                !isRSEnabled ? "bg-white text-slate-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Standard Mode
            </button>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Updated</p>
            <p className="text-sm font-bold text-slate-600">7m Ago</p>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-slate-200 px-6 sticky top-[73px] z-30 overflow-visible">
        <div className="flex items-center justify-between">
          <nav className="flex gap-1">
            {[
              { id: 'performance', label: 'Performance Analysis' },
              { id: 'ops', label: 'Ops Planning' },
              { id: 'comparison', label: 'Room Type Comparison' },
              ...(isRSEnabled ? [{ id: 'technical', label: 'Algorithm & Debug' }] : [])
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'px-4 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-700 bg-indigo-50/30'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2 pl-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active:</span>
            {activeFilters.map(f => (
              <Tooltip key={f.label} text={`Current filter applied to the view: ${f.label}`} position="bottom">
                <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full cursor-help hover:bg-white transition-colors">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{f.label}:</span>
                  <span className="text-[10px] font-bold text-slate-900 whitespace-nowrap">{f.value}</span>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>

      <FilterDrawer isOpen={isFiltersOpen} onClose={() => setIsFiltersOpen(false)} isRSEnabled={isRSEnabled} />

      <main className="flex-1 p-8 overflow-y-auto bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'performance' && <PerformanceTab onRoomClick={setSelectedRoom} isRSEnabled={isRSEnabled} />}
          {activeTab === 'ops' && <OpsTab onRoomClick={setSelectedRoom} isRSEnabled={isRSEnabled} />}
          {activeTab === 'comparison' && <ComparisonTab isRSEnabled={isRSEnabled} />}
          {activeTab === 'technical' && isRSEnabled && <TechnicalTab />}
        </div>
      </main>

      <RoomDetailsDrawer room={selectedRoom} onClose={() => setSelectedRoom(null)} isRSEnabled={isRSEnabled} />
    </div>
  );
}

// ... Placeholder for Tab components (I'll add them in an immediate next edit)
function PerformanceTab({ onRoomClick, isRSEnabled }) {
  const [subView, setSubView] = useState('roomType');
  const [expanded, setExpanded] = useState({ 'studio': true });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900">Performance Analysis</h2>
          <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
            {[
              { id: 'roomType', label: 'By Room Type' },
              ...(isRSEnabled ? [{ id: 'owner', label: 'By Owner' }] : []),
              { id: 'all', label: 'All Units' }
            ].map(view => (
              <button
                key={view.id}
                onClick={() => setSubView(view.id)}
                className={clsx(
                  'px-4 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap',
                  subView === view.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search Units..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64" />
        </div>
      </div>

      {
        subView === 'roomType' && (
          <div className="space-y-4">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-2">Cohort Group Monitoring</p>
            {roomTypeSummary.map(rt => (
              <div key={rt.id} className="bg-white rounded-xl border border-slate-200 overflow-visible shadow-sm transition-all hover:shadow-md">
                <button
                  onClick={() => setExpanded(e => ({ ...e, [rt.id]: !e[rt.id] }))}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={clsx("p-1 rounded-full transition-transform", expanded[rt.id] ? "rotate-180 bg-slate-200" : "")}>
                      <ChevronDown className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{rt.name}</h3>
                      <div className="flex gap-3 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rt.count} Units</span>
                        {rt.outlierCount > 0 && isRSEnabled && <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{rt.outlierCount} Outliers</span>}
                      </div>
                    </div>
                  </div>
                  <div className={clsx("grid gap-4 text-right", isRSEnabled ? "grid-cols-5" : "grid-cols-4")}>
                    <div className="group cursor-help">
                      <Tooltip text="Percentage of nights booked in the reporting period.">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Occupancy</p>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{rt.avgOccupancy}%</p>
                      </Tooltip>
                    </div>
                    <div className="group cursor-help">
                      <Tooltip text="Average Daily Rate: Total revenue divided by paid nights.">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">ADR</p>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{formatCurrency(rt.avgADR)}</p>
                      </Tooltip>
                    </div>
                    <div className="group cursor-help">
                      <Tooltip text="Revenue Per Available Room: Total revenue divided by total unit capacity.">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">RevPAR</p>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{formatCurrency(rt.revPAR)}</p>
                      </Tooltip>
                    </div>
                    <div className="group cursor-help">
                      <Tooltip text="Gross actual revenue earned in the reporting period.">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Revenue</p>
                        <p className="text-sm font-bold text-blue-700 group-hover:text-blue-800 transition-colors">{formatCurrency(rt.totalRevenue)}</p>
                      </Tooltip>
                    </div>
                    {isRSEnabled && (
                      <div className="group cursor-help">
                        <Tooltip text="Percentage of available nights in the next 30-day window.">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 whitespace-nowrap">Future Availability</p>
                          <p className="text-sm font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">{rt.avgFutureAvailability}%</p>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </button>

                {expanded[rt.id] && (
                  <div className="border-t border-slate-200 overflow-x-auto">
                    <table className="w-full text-sm min-w-[1000px]">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-widest text-[10px] border-b border-slate-200 sticky top-0 z-20">
                        <tr>
                          <th className="px-4 py-4 text-left w-20">
                            <Tooltip text={isRSEnabled ? "Priority within this Room Type." : "Relative rank within group."} position="bottom" align="left">
                              <span className="underline decoration-dotted decoration-slate-300">{isRSEnabled ? 'Priority' : 'Rank'}</span>
                            </Tooltip>
                          </th>
                          <th className="px-4 py-4 text-left w-16">Unit</th>
                          <th className="px-4 py-4 text-right w-24 border-l border-slate-200">
                            <Tooltip text="Total occupancy % (Guest + Owner + Blocked)." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 font-bold text-slate-700">Total Occ <Info className="w-3 h-3 text-slate-400" /></span>
                            </Tooltip>
                          </th>
                          <th className="px-4 py-4 text-right w-24">
                            <Tooltip text="Percentage of guest stays (paid bookings)." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300">Guest Occ <Info className="w-3 h-3 text-slate-300" /></span>
                            </Tooltip>
                          </th>
                          <th className="px-4 py-4 text-right w-24">
                            <Tooltip text="Percentage of owner personal stay nights." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300">Owner Occ <Info className="w-3 h-3 text-slate-300" /></span>
                            </Tooltip>
                          </th>
                          <th className="px-4 py-4 text-right w-24">
                            <Tooltip text="Percentage of nights blocked for maintenance or other reasons." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300">Blocked <Info className="w-3 h-3 text-slate-300" /></span>
                            </Tooltip>
                          </th>
                          <th className="px-4 py-4 text-right w-28 border-l border-slate-200">Actual Rev</th>
                          {isRSEnabled && (
                            <th className="px-4 py-4 text-right w-28">
                              <Tooltip text="Estimated revenue value of owner stay nights." position="bottom">
                                <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 whitespace-nowrap">Imputed Rev <Info className="w-3 h-3 text-slate-300" /></span>
                              </Tooltip>
                            </th>
                          )}
                          <th className="px-4 py-4 text-right w-24 border-l border-slate-200">
                            <Tooltip text="Total future booked nights % (Guest + Owner + Blocked)." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 leading-[1.1] font-bold text-slate-700">Total Future <br /> Occ <Info className="w-3 h-3 text-slate-400" /></span>
                            </Tooltip>
                          </th>
                          <th className="px-4 py-4 text-right w-24">
                            <Tooltip text="Future guest bookings." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 leading-[1.1]">Future <br /> Guest <Info className="w-3 h-3 text-slate-300" /></span>
                            </Tooltip>
                          </th>
                          <th className="px-4 py-4 text-right w-24">
                            <Tooltip text="Future owner bookings." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 leading-[1.1]">Future <br /> Owner <Info className="w-3 h-3 text-slate-300" /></span>
                            </Tooltip>
                          </th>
                          <th className="px-4 py-4 text-right w-24">
                            <Tooltip text="Future blocked nights." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 leading-[1.1]">Future <br /> Blocked <Info className="w-3 h-3 text-slate-300" /></span>
                            </Tooltip>
                          </th>
                          <th className="px-4 py-4 text-right w-24">
                            <Tooltip text="Percentage of nights available in the next 30 days." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 leading-[1.1]">Future <br /> Available <Info className="w-3 h-3 text-slate-300" /></span>
                            </Tooltip>
                          </th>
                          {isRSEnabled && (
                            <th className="px-4 py-4 text-right w-24 border-l border-slate-200">
                              <Tooltip text="Relative performance score (0-100) within room type cohort." position="bottom">
                                <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 whitespace-nowrap">Revenue Score <Info className="w-3 h-3 text-slate-300" /></span>
                              </Tooltip>
                            </th>
                          )}
                          {isRSEnabled && <th className="px-4 py-4 text-right text-slate-400 w-16">Trend</th>}
                          <th className={clsx("px-4 py-4 text-right w-20", !isRSEnabled && "border-l border-slate-200")}>
                            <Tooltip text="Average Daily Rate." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300">ADR <Info className="w-3 h-3 text-slate-300" /></span>
                            </Tooltip>
                          </th>
                          <th className="px-4 py-4 text-right w-20">
                            <Tooltip text="Revenue Per Available Room." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300">RevPAR <Info className="w-3 h-3 text-slate-300" /></span>
                            </Tooltip>
                          </th>
                          {isRSEnabled && <th className="px-4 py-4 text-left w-32 border-l border-slate-200">Owner</th>}
                          <th className="px-4 py-4 text-left w-24">
                            <Tooltip text="Check-In Readiness Status: Real-time operational state." position="bottom" align="right">
                              <span className="flex items-center gap-1 underline decoration-dotted decoration-slate-300">CIRS <Info className="w-3 h-3 text-slate-300" /></span>
                            </Tooltip>
                          </th>
                          <th className="px-4 py-4 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {rooms.filter(r => r.roomTypeId === rt.id).map(room => (
                          <tr key={room.id} onClick={() => onRoomClick(room)} className="hover:bg-slate-50 cursor-pointer transition-colors group">
                            <td className="px-4 py-4 font-bold text-slate-400 text-xs w-24">#{room.rank}</td>
                            <td className="px-4 py-4 font-bold text-slate-900 text-xs w-16">{room.number}</td>
                            <td className="px-4 py-4 text-right font-bold text-slate-900 text-xs w-24 border-l border-slate-200 bg-slate-50/50">{room.occupancy}%</td>
                            <td className="px-4 py-4 text-right font-bold text-slate-700 text-xs w-24">
                              {room.guestOccupancyPct}% <span className="text-[10px] text-slate-400 font-normal">({room.guestNights})</span>
                            </td>
                            <td className="px-4 py-4 text-right font-bold text-slate-700 text-xs w-24">
                              {room.ownerOccupancyPct}% <span className="text-[10px] text-slate-400 font-normal">({room.ownerNights})</span>
                            </td>
                            <td className="px-4 py-4 text-right font-bold text-slate-700 text-xs w-24">
                              {room.blockedOccupancyPct}% <span className="text-[10px] text-slate-400 font-normal">({room.blockedNights})</span>
                            </td>
                            <td className="px-4 py-4 text-right w-28 border-l border-slate-200">
                              <span className="font-bold text-blue-600 text-xs">{formatCurrency(room.actualRevenue)}</span>
                            </td>
                            {isRSEnabled && (
                              <td className="px-4 py-4 text-right whitespace-nowrap w-28">
                                <span className="font-bold text-slate-600 text-xs">{formatCurrency(room.imputedRevenue)}</span>
                                <span className="text-[9px] font-bold text-slate-400 ml-0.5">({room.ownerNights})</span>
                              </td>
                            )}
                            <td className="px-4 py-4 text-right font-bold text-slate-900 text-[10px] whitespace-nowrap w-24 border-l border-slate-200 bg-slate-50/50">
                              {Math.round((30 - room.futureAvailableNights) / 30 * 100)}% <span className="text-[9px] text-slate-400 font-normal">({30 - room.futureAvailableNights})</span>
                            </td>
                            <td className="px-4 py-4 text-right font-bold text-slate-700 text-[10px] whitespace-nowrap w-24">
                              {room.futureGuestPct}% <span className="text-[9px] text-slate-400 font-normal">({room.futureGuestNights})</span>
                            </td>
                            <td className="px-4 py-4 text-right font-bold text-slate-700 text-[10px] whitespace-nowrap w-24">
                              {room.futureOwnerPct}% <span className="text-[9px] text-slate-400 font-normal">({room.futureOwnerNights})</span>
                            </td>
                            <td className="px-4 py-4 text-right font-bold text-slate-700 text-[10px] whitespace-nowrap w-24">
                              {room.futureBlockedPct}% <span className="text-[9px] text-slate-400 font-normal">({room.futureBlockedNights})</span>
                            </td>
                            <td className="px-4 py-4 text-right font-bold text-slate-700 text-[10px] whitespace-nowrap w-24">{room.futureAvailableNights} / 30</td>
                            {isRSEnabled && <td className="px-4 py-4 text-right font-black text-slate-900 text-xs w-24 border-l border-slate-200">{formatRS(room.rs)}</td>}
                            {isRSEnabled && (
                              <td className={clsx('px-4 py-4 text-right font-bold text-[10px] w-16', room.rsChange >= 0 ? 'text-emerald-600' : 'text-red-500')}>
                                {room.rsChange >= 0 ? '+' : ''}{room.rsChange}
                              </td>
                            )}
                            <td className={clsx("px-4 py-4 text-right font-bold text-slate-600 text-[10px] w-20", !isRSEnabled && "border-l border-slate-200")}>{formatCurrency(room.adr)}</td>
                            <td className="px-4 py-4 text-right font-bold text-slate-600 text-[10px] w-20">{formatCurrency(Math.round(room.adr * room.occupancy / 100))}</td>
                            {isRSEnabled && (
                              <td className="px-4 py-4 w-32 border-l border-slate-200">
                                <div className="flex items-center gap-1.5 overflow-hidden">
                                  {room.owner.isCrown && <Crown className="w-3 h-3 text-amber-500 fill-amber-100 shrink-0" />}
                                  <span className="font-bold text-slate-700 text-[10px] truncate max-w-[70px]">{room.owner.name}</span>
                                </div>
                              </td>
                            )}
                            <td className="px-4 py-4 w-24"><CIRSBadge status={room.cirs} /></td>
                            <td className="px-4 py-4 text-right w-10">
                              <div className="flex items-center justify-end gap-1">
                                {room.isOutlier && isRSEnabled && <OutlierBadge reason={room.outlierReason} />}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      }

      {
        subView === 'owner' && (
          <div className="space-y-4">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-2">Portfolio Management View</p>
            {ownerRollup.slice(0, 15).map(owner => (
              <div key={owner.id} className="bg-white rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md relative hover:z-30">
                <button
                  onClick={() => setExpanded(e => ({ ...e, [owner.id]: !e[owner.id] }))}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className={clsx("p-1 rounded-full transition-transform", expanded[owner.id] ? "rotate-180 bg-slate-200" : "")}>
                      <ChevronDown className="w-5 h-5 text-slate-500" />
                    </div>
                    {owner.isCrown && <Crown className="w-5 h-5 text-amber-500 fill-amber-50" />}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{owner.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{owner.units} Portfolio Units</span>
                        {getEffectiveWindow(owner.onboardedAt, '2026-01-01').isPartial && (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wider">
                            Effective: {getEffectiveWindow(owner.onboardedAt, '2026-01-01').windowLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-10 text-right">
                    <div className="group cursor-help">
                      <Tooltip text="Actual revenue earned by this portfolio in the period.">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Actual Rev</p>
                        <p className="text-sm font-bold text-blue-700 group-hover:text-blue-800 transition-colors">{formatCurrency(owner.totalActualRevenue)}</p>
                      </Tooltip>
                    </div>
                    <div className="group cursor-help">
                      <Tooltip text="Estimated revenue value of all owner stays across units.">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Imputed Rev</p>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{formatCurrency(owner.totalImputedRevenue)}</p>
                      </Tooltip>
                    </div>
                    <div className="group cursor-help">
                      <Tooltip text="Average occupancy frequency across the portfolio.">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Occupancy</p>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{owner.occupancyPct}% <span className="text-[10px] font-bold text-slate-400">({owner.totalOwnerNights})</span></p>
                      </Tooltip>
                    </div>
                    <div className="group cursor-help">
                      <Tooltip text="Available capacity for bookings over the next 30 days.">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 whitespace-nowrap">Future Availability</p>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{owner.futureAvailabilityPct}% {isRSEnabled && <span className="text-[10px] font-bold text-slate-400">({owner.totalOwnerNights})</span>}</p>
                      </Tooltip>
                    </div>
                    {isRSEnabled && (
                      <div className="group cursor-help">
                        <Tooltip text="Average relative performance score for this portfolio.">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Avg Score</p>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{formatRS(owner.avgRS)}</p>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </button>
                {expanded[owner.id] && (
                  <div className="border-t border-slate-200 bg-slate-50/30 overflow-x-auto">
                    <table className="w-full text-sm min-w-[1000px]">
                      <thead className="bg-slate-100/50 text-slate-500 font-bold uppercase tracking-widest text-[10px] border-b border-slate-100 sticky top-0 z-20">
                        <tr>
                          <th className="px-6 py-4 text-left w-16">Unit</th>
                          <th className="px-6 py-4 text-left w-32">Room Type</th>
                          <th className="px-6 py-4 text-left w-24">
                            <Tooltip text="Check-In Readiness Status: Real-time operational state." position="bottom" align="left">
                              <span className="flex items-center gap-1 underline decoration-dotted decoration-slate-300">CIRS <Info className="w-3 h-3 text-slate-300" /></span>
                            </Tooltip>
                          </th>
                          <th className="px-6 py-4 text-right w-24 border-l border-slate-200">
                            <Tooltip text="Total occupancy % (Guest + Owner + Blocked)." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 font-bold text-slate-700">Total Occ <Info className="w-3 h-3 text-slate-400" /></span>
                            </Tooltip>
                          </th>
                          <th className="px-6 py-4 text-right w-24">
                            <Tooltip text="Percentage of guest stays (paid bookings)." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300">Guest Occ <Info className="w-3 h-3 text-slate-300" /></span>
                            </Tooltip>
                          </th>
                          <th className="px-6 py-4 text-right w-24">
                            <Tooltip text="Percentage of owner personal stay nights." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300">Owner Occ <Info className="w-3 h-3 text-slate-300" /></span>
                            </Tooltip>
                          </th>
                          <th className="px-6 py-4 text-right w-24">
                            <Tooltip text="Percentage of nights blocked for maintenance or other reasons." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300">Blocked <Info className="w-3 h-3 text-slate-300" /></span>
                            </Tooltip>
                          </th>
                          <th className="px-6 py-4 text-right w-28 border-l border-slate-200">Actual Rev</th>
                          {isRSEnabled && (
                            <th className="px-6 py-4 text-right w-24">
                              <Tooltip text="Estimated revenue value of owner stay nights." position="bottom">
                                <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 whitespace-nowrap">Imputed Rev <Info className="w-3 h-3 text-slate-300" /></span>
                              </Tooltip>
                            </th>
                          )}
                          <th className="px-6 py-4 text-right w-24 border-l border-slate-200">
                            <Tooltip text="Total future booked nights % (Guest + Owner + Blocked)." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 leading-[1.1] font-bold text-slate-700">Total Future <br /> Occ <Info className="w-3 h-3 text-slate-400" /></span>
                            </Tooltip>
                          </th>
                          <th className="px-6 py-4 text-right w-24">
                            <Tooltip text="Future guest bookings." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 leading-[1.1]">Future <br /> Guest <Info className="w-3 h-3 text-slate-300" /></span>
                            </Tooltip>
                          </th>
                          <th className="px-6 py-4 text-right w-24">
                            <Tooltip text="Future owner bookings." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 leading-[1.1]">Future <br /> Owner <Info className="w-3 h-3 text-slate-300" /></span>
                            </Tooltip>
                          </th>
                          <th className="px-6 py-4 text-right w-24">
                            <Tooltip text="Future blocked nights." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 leading-[1.1]">Future <br /> Blocked <Info className="w-3 h-3 text-slate-300" /></span>
                            </Tooltip>
                          </th>
                          <th className="px-6 py-4 text-right w-28">
                            <Tooltip text="Available capacity for bookings over the next 30 days." position="bottom">
                              <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 leading-[1.1]">Future <br /> Avail <Info className="w-3 h-3 text-slate-300" /></span>
                            </Tooltip>
                          </th>
                          {isRSEnabled && (
                            <th className="px-6 py-4 text-right w-24 border-l border-slate-200">
                              <Tooltip text="Relative performance score (0-100) within room type cohort." position="bottom">
                                <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 whitespace-nowrap">Revenue Score <Info className="w-3 h-3 text-slate-300" /></span>
                              </Tooltip>
                            </th>
                          )}
                          <th className={clsx("px-8 py-4 text-right w-24 font-bold", !isRSEnabled && "border-l border-slate-200")}>
                            <Tooltip text={isRSEnabled ? "Priority within this Room Type cohort." : "Relative rank within group."} position="bottom" align="right">
                              <span className="underline decoration-dotted decoration-slate-300">{isRSEnabled ? 'Priority' : 'Rank'}</span>
                            </Tooltip>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {owner.rooms.map(room => (
                          <tr key={room.id} onClick={() => onRoomClick(room)} className="hover:bg-white cursor-pointer transition-colors bg-white/50">
                            <td className="px-8 py-3 font-bold text-slate-900 w-16">{room.number}</td>
                            <td className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase w-32">{room.roomTypeName}</td>
                            <td className="px-6 py-3 w-24"><CIRSBadge status={room.cirs} /></td>
                            <td className="px-6 py-3 text-right font-bold text-slate-900 w-24 border-l border-slate-200 bg-slate-50/50">{room.occupancy}%</td>
                            <td className="px-6 py-3 text-right font-bold text-slate-700 w-24">
                              {room.guestOccupancyPct}% <span className="text-[10px] text-slate-400 font-normal">({room.guestNights})</span>
                            </td>
                            <td className="px-6 py-3 text-right font-bold text-slate-700 w-24">
                              {room.ownerOccupancyPct}% <span className="text-[10px] text-slate-400 font-normal">({room.ownerNights})</span>
                            </td>
                            <td className="px-6 py-3 text-right font-bold text-slate-700 w-24">
                              {room.blockedOccupancyPct}% <span className="text-[10px] text-slate-400 font-normal">({room.blockedNights})</span>
                            </td>
                            <td className="px-6 py-3 text-right font-bold text-blue-600 w-28 border-l border-slate-200">{formatCurrency(room.actualRevenue)}</td>
                            {isRSEnabled && (
                              <td className="px-6 py-3 text-right whitespace-nowrap w-24">
                                <span className="font-bold text-slate-600 text-xs">{formatCurrency(room.imputedRevenue)}</span>
                                <span className="text-[9px] font-bold text-slate-400 ml-0.5">({room.ownerNights})</span>
                              </td>
                            )}
                            <td className="px-6 py-3 text-right font-bold text-slate-900 text-[10px] whitespace-nowrap w-24 border-l border-slate-200 bg-slate-50/50">
                              {Math.round((30 - room.futureAvailableNights) / 30 * 100)}% <span className="text-[9px] text-slate-400 font-normal">({30 - room.futureAvailableNights})</span>
                            </td>
                            <td className="px-6 py-3 text-right font-bold text-slate-700 text-[10px] whitespace-nowrap w-24">
                              {room.futureGuestPct}% <span className="text-[9px] text-slate-400 font-normal">({room.futureGuestNights})</span>
                            </td>
                            <td className="px-6 py-3 text-right font-bold text-slate-700 text-[10px] whitespace-nowrap w-24">
                              {room.futureOwnerPct}% <span className="text-[9px] text-slate-400 font-normal">({room.futureOwnerNights})</span>
                            </td>
                            <td className="px-6 py-3 text-right font-bold text-slate-700 text-[10px] whitespace-nowrap w-24">
                              {room.futureBlockedPct}% <span className="text-[9px] text-slate-400 font-normal">({room.futureBlockedNights})</span>
                            </td>
                            <td className="px-6 py-3 text-right font-bold text-slate-700 text-xs w-28">{room.futureAvailableNights} / 30</td>
                            {isRSEnabled && <td className="px-6 py-3 text-right font-black w-24 border-l border-slate-200">{formatRS(room.rs)}</td>}
                            <td className={clsx("px-8 py-3 text-right font-bold text-slate-400 text-xs w-32", !isRSEnabled && "border-l border-slate-200")}>#{room.rank}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      }

      {
        subView === 'all' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
            <table className={clsx("w-full text-sm text-left", isRSEnabled ? "min-w-[1400px]" : "min-w-[1000px]")}>
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-widest text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-6 py-5 w-24 font-bold">
                    <Tooltip text={isRSEnabled ? "Priority within Room Type cohort." : "Internal unit ID."} position="bottom" align="left">
                      <span className="underline decoration-dotted decoration-slate-300">{isRSEnabled ? 'Priority' : 'ID'}</span>
                    </Tooltip>
                  </th>
                  <th className="px-6 py-5 w-16">Unit</th>
                  <th className="px-6 py-5 w-32">Group Type</th>
                  {isRSEnabled && <th className="px-6 py-5 w-40">Portfolio Owner</th>}
                  <th className="px-6 py-5 w-24">
                    <Tooltip text="Check-In Readiness Status: Real-time operational state." position="bottom">
                      <span className="flex items-center gap-1 underline decoration-dotted decoration-slate-300">CIRS <Info className="w-3 h-3 text-slate-300" /></span>
                    </Tooltip>
                  </th>
                  <th className="px-6 py-5 text-right font-bold w-24 border-l border-slate-200">
                    <Tooltip text="Total occupancy % (Guest + Owner + Blocked)." position="bottom">
                      <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 font-bold text-slate-700">Total Occ <Info className="w-3 h-3 text-slate-400" /></span>
                    </Tooltip>
                  </th>
                  <th className="px-6 py-5 text-right font-bold w-24">
                    <Tooltip text="Percentage of guest stays (paid bookings)." position="bottom">
                      <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300">Guest Occ <Info className="w-3 h-3 text-slate-300" /></span>
                    </Tooltip>
                  </th>
                  <th className="px-6 py-5 text-right font-bold w-24">
                    <Tooltip text="Percentage of owner personal stay nights." position="bottom">
                      <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300">Owner Occ <Info className="w-3 h-3 text-slate-300" /></span>
                    </Tooltip>
                  </th>
                  <th className="px-6 py-5 text-right font-bold w-24">
                    <Tooltip text="Percentage of nights blocked for maintenance or other reasons." position="bottom">
                      <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300">Blocked <Info className="w-3 h-3 text-slate-300" /></span>
                    </Tooltip>
                  </th>
                  <th className="px-6 py-5 text-right font-bold w-28 border-l border-slate-200">Actual Revenue</th>
                  {isRSEnabled && (
                    <th className="px-6 py-5 text-right font-bold group w-28">
                      <Tooltip text="Estimated revenue value of owner stay nights." position="bottom">
                        <div className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300">Imputed Rev <Info className="w-3 h-3 text-slate-400" /></div>
                      </Tooltip>
                    </th>
                  )}
                  <th className="px-6 py-5 text-right font-bold w-24">
                    <Tooltip text="Total future booked nights % (Guest + Owner + Blocked)." position="bottom">
                      <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 leading-[1.1] font-bold text-slate-700">Total Future <br /> Occ <Info className="w-3 h-3 text-slate-400" /></span>
                    </Tooltip>
                  </th>
                  <th className="px-6 py-5 text-right font-bold w-24">
                    <Tooltip text="Future guest bookings." position="bottom">
                      <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 leading-[1.1]">Future <br /> Guest <Info className="w-3 h-3 text-slate-300" /></span>
                    </Tooltip>
                  </th>
                  <th className="px-6 py-5 text-right font-bold w-24">
                    <Tooltip text="Future owner bookings." position="bottom">
                      <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 leading-[1.1]">Future <br /> Owner <Info className="w-3 h-3 text-slate-300" /></span>
                    </Tooltip>
                  </th>
                  <th className="px-6 py-5 text-right font-bold w-24">
                    <Tooltip text="Future blocked nights." position="bottom">
                      <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 leading-[1.1]">Future <br /> Blocked <Info className="w-3 h-3 text-slate-300" /></span>
                    </Tooltip>
                  </th>
                  <th className="px-6 py-5 text-right font-bold w-24">
                    <Tooltip text="Percentage of nights available in the next 30 days." position="bottom">
                      <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 leading-[1.1]">Future <br /> Availability <Info className="w-3 h-3 text-slate-300" /></span>
                    </Tooltip>
                  </th>
                  {isRSEnabled && (
                    <th className="px-6 py-5 text-right font-bold w-24 border-l border-slate-200">
                      <Tooltip text="Relative performance score (0-100) within room type cohort." position="bottom" align="right">
                        <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300 whitespace-nowrap">Revenue Score <Info className="w-3 h-3 text-slate-300" /></span>
                      </Tooltip>
                    </th>
                  )}
                  <th className={clsx("px-6 py-5 w-10", !isRSEnabled && "border-l border-slate-200")}></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.slice(0, 50).map(room => (
                  <tr key={room.id} onClick={() => onRoomClick(room)} className="hover:bg-slate-50 cursor-pointer transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-400">#{room.rank}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{room.number}</td>
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">{room.roomTypeName}</td>
                    {isRSEnabled && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {room.owner.isCrown && <Crown className="w-3 h-3 text-amber-500" />}
                          <span className="text-[10px] font-bold text-slate-600 truncate max-w-[100px]">{room.owner.name}</span>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4"><CIRSBadge status={room.cirs} /></td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900 w-24 border-l border-slate-200 bg-slate-50/50">{room.occupancy}%</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-700 w-24">
                      {room.guestOccupancyPct}% <span className="text-[10px] text-slate-400 font-normal">({room.guestNights})</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-700 w-24">
                      {room.ownerOccupancyPct}% <span className="text-[10px] text-slate-400 font-normal">({room.ownerNights})</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-700 w-24">
                      {room.blockedOccupancyPct}% <span className="text-[10px] text-slate-400 font-normal">({room.blockedNights})</span>
                    </td>
                    <td className="px-6 py-4 text-right border-l border-slate-200">
                      <span className="font-bold text-blue-600">{formatCurrency(room.actualRevenue)}</span>
                    </td>
                    {isRSEnabled && (
                      <td className="px-6 py-4 text-right font-bold text-slate-600 text-xs">
                        {formatCurrency(room.imputedRevenue)} <span className="text-[10px] font-bold text-slate-400 ml-0.5">({room.ownerNights})</span>
                      </td>
                    )}
                    <td className="px-6 py-4 text-right font-bold text-slate-900 w-24 bg-slate-50/50">
                      {Math.round((30 - room.futureAvailableNights) / 30 * 100)}% <span className="text-[9px] text-slate-400 font-normal">({30 - room.futureAvailableNights})</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-700 text-[10px] whitespace-nowrap w-24">
                      {room.futureGuestPct}% <span className="text-[9px] text-slate-400 font-normal">({room.futureGuestNights})</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-700 text-[10px] whitespace-nowrap w-24">
                      {room.futureOwnerPct}% <span className="text-[9px] text-slate-400 font-normal">({room.futureOwnerNights})</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-700 text-[10px] whitespace-nowrap w-24">
                      {room.futureBlockedPct}% <span className="text-[9px] text-slate-400 font-normal">({room.futureBlockedNights})</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-700 text-xs">{room.futureAvailableNights} / 30</td>
                    {isRSEnabled && <td className="px-6 py-4 text-right font-black text-slate-900 border-l border-slate-200">{formatRS(room.rs)}</td>}
                    <td className={clsx("px-6 py-4 text-right", !isRSEnabled && "border-l border-slate-200")}>
                      <div className="flex items-center justify-end gap-2">
                        {room.isOutlier && isRSEnabled && <OutlierBadge reason={room.outlierReason} />}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div >
  );
}


function OpsTab({ onRoomClick, isRSEnabled }) {
  const [horizon, setHorizon] = useState('Next 24h');
  const [expanded, setExpanded] = useState({ 'studio': true });
  const highRiskTypes = opsData.roomTypeReadiness.filter(rt => rt.riskLevel === 'High');

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Ops Planning</h2>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Readiness Risk Monitoring</p>

        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-lg w-fit mt-6">
          {opsData.horizons.map(h => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={clsx(
                'px-6 py-2 text-xs font-bold rounded-lg transition-all',
                horizon === h
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {highRiskTypes.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 flex items-start gap-4 shadow-sm animate-pulse-subtle">
          <div className="p-2.5 bg-red-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-red-900 text-lg uppercase tracking-tight">
              Action Required: {highRiskTypes.length} High Risk Groups
            </h3>
            <p className="mt-1 text-sm text-red-800 font-bold">
              Check top units for Ready status. Priority turnover needed.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-visible shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-widest text-[10px] border-b border-slate-200">
            <tr>
              <th className="px-4 py-4 w-12"></th>
              <th className="px-4 py-4">Room Type</th>
              <th className="px-4 py-4 text-center">
                <Tooltip text="Scheduled guest arrivals in the chosen horizon.">
                  <span className="flex items-center justify-center gap-1 underline decoration-dotted decoration-slate-300">Arrivals <Info className="w-3 h-3 text-slate-300" /></span>
                </Tooltip>
              </th>
              <th className="px-4 py-4 text-center">
                <Tooltip text="Scheduled guest departures in the chosen horizon.">
                  <span className="flex items-center justify-center gap-1 underline decoration-dotted decoration-slate-300">Departures <Info className="w-3 h-3 text-slate-300" /></span>
                </Tooltip>
              </th>
              <th className="px-4 py-4 text-center text-emerald-600">Ready</th>
              <th className="px-4 py-4 text-center text-amber-600">Not Ready</th>
              <th className="px-4 py-4 text-center text-red-600">Blocked</th>
              <th className="px-4 py-4 text-center text-blue-600">Occupied</th>
              <th className="px-4 py-4 text-center">
                <Tooltip text="Level of operational turnover pressure (High/Med/Low).">
                  <span className="flex items-center justify-center gap-1 underline decoration-dotted decoration-slate-300">Risk Level <Info className="w-3 h-3 text-slate-300" /></span>
                </Tooltip>
              </th>
              <th className="px-4 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {opsData.roomTypeReadiness.map(rt => (
              <React.Fragment key={rt.roomTypeId}>
                <tr className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-5 text-center">
                    <button
                      onClick={() => setExpanded(e => ({ ...e, [rt.roomTypeId]: !e[rt.roomTypeId] }))}
                      className="p-1.5 hover:bg-slate-200 rounded-lg transition-all text-slate-400"
                    >
                      {expanded[rt.roomTypeId] ? <ChevronDown className="w-5 h-5 text-blue-600" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                  </td>
                  <td className="px-4 py-5 font-bold text-slate-900 text-lg">{rt.roomTypeName}</td>
                  <td className="px-4 py-5 text-center font-bold text-slate-700 bg-slate-50/50">{rt.arrivals}</td>
                  <td className="px-4 py-5 text-center text-slate-600 font-bold">{rt.departures}</td>
                  <td className="px-4 py-5 text-center text-emerald-700 font-bold bg-emerald-50/30">{rt.readyCount}</td>
                  <td className="px-4 py-5 text-center text-amber-700 font-bold bg-amber-50/30">{rt.notReadyCount}</td>
                  <td className="px-4 py-5 text-center text-red-700 font-bold bg-red-50/30">{rt.blockedCount}</td>
                  <td className="px-4 py-5 text-center text-blue-700 font-bold bg-blue-50/30">{rt.occupiedCount}</td>
                  <td className="px-4 py-5 text-center"><RiskBadge level={rt.riskLevel} /></td>
                  <td className="px-4 py-5 text-right pr-6">
                    <button className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800">
                      Units Details
                    </button>
                  </td>
                </tr>
                {expanded[rt.roomTypeId] && (
                  <tr className="bg-slate-50/50 shadow-inner whitespace-nowrap">
                    <td colSpan="10" className="p-0">
                      <div className="px-16 py-6 border-b border-slate-200 overflow-visible">
                        <table className="w-full text-sm bg-white border border-slate-200 rounded-xl overflow-visible shadow-sm">
                          <thead className="bg-slate-100/80 text-[10px] text-slate-500 font-black uppercase tracking-widest border-b border-slate-200">
                            <tr>
                              <th className="px-6 py-3 text-left">Unit Rank</th>
                              <th className="px-6 py-3 text-left">Internal ID</th>
                              {isRSEnabled && <th className="px-6 py-3 text-left">Portfolio Owner</th>}
                              <th className="px-6 py-3 text-left">CIRS</th>
                              <th className="px-6 py-3 text-left">Condition</th>
                              <th className="px-6 py-3"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {rt.rooms.slice(0, 10).map(room => (
                              <tr key={room.id} onClick={() => onRoomClick(room)} className="hover:bg-indigo-50/50 cursor-pointer group transition-colors">
                                <td className="px-6 py-3.5 font-bold text-slate-400">#{room.rank}</td>
                                <td className="px-6 py-3.5 font-bold text-slate-900">{room.number}</td>
                                {isRSEnabled && <td className="px-6 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate max-w-[120px]">{room.owner.name}</td>}
                                <td className="px-6 py-3.5"><CIRSBadge status={room.cirs} /></td>
                                <td className={clsx("px-6 py-4 text-xs font-bold whitespace-normal",
                                  room.readinessNote?.includes("At Risk") ? "text-red-600" :
                                    room.readinessNote?.includes("Good") ? "text-emerald-600" : "text-slate-500"
                                )}>
                                  <div className="flex items-center gap-1.5">
                                    {room.readinessNote?.includes("At Risk") && <AlertCircle className="w-3.5 h-3.5" />}
                                    {room.readinessNote || "Standard Turnover"}
                                  </div>
                                </td>
                                <td className="px-6 py-3.5 text-right">
                                  <ExternalLink className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100" />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ComparisonTab({ isRSEnabled }) {
  const calculationExplainer = "Percent difference in actual revenue between the highest-earning unit and the lowest-earning unit in a group. Target spread < 10%.";

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Room Type Comparison</h2>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Structural Performance Metrics</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-widest text-[10px] border-b border-slate-200">
            <tr>
              <th className="px-6 py-5">Room Type</th>
              <th className="px-4 py-5 text-center">Units</th>
              <th className="px-4 py-5 text-center whitespace-nowrap">
                <Tooltip text="Average group occupancy % in the period.">
                  <span className="flex items-center justify-center gap-1 underline decoration-dotted decoration-slate-300">Occupancy % <Info className="w-3 h-3 text-slate-300" /></span>
                </Tooltip>
              </th>
              <th className="px-4 py-5 text-right font-bold">
                <Tooltip text="Average Daily Rate for this cohort.">
                  <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300">ADR <Info className="w-3 h-3 text-slate-300" /></span>
                </Tooltip>
              </th>
              <th className="px-4 py-5 text-right font-bold">
                <Tooltip text="Revenue Per Available Room.">
                  <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300">RevPAR <Info className="w-3 h-3 text-slate-300" /></span>
                </Tooltip>
              </th>
              <th className="px-4 py-5 text-right font-bold">Actual Rev</th>
              {isRSEnabled && (
                <th className="px-4 py-5 text-right font-bold">
                  <Tooltip text="Revenue attributed to owner stay nights.">
                    <span className="flex items-center justify-end gap-1 underline decoration-dotted decoration-slate-300">Imputed Rev <Info className="w-3 h-3 text-slate-300" /></span>
                  </Tooltip>
                </th>
              )}
              <th className="px-4 py-5 text-center font-bold">Cancel %</th>
              <th className="px-4 py-5 text-center">
                <Tooltip text="Nights blocked for maintenance or external factors.">
                  <span className="flex items-center justify-center gap-1 underline decoration-dotted decoration-slate-300">Blocked <Info className="w-3 h-3 text-slate-300" /></span>
                </Tooltip>
              </th>
              {isRSEnabled && (
                <th className="px-4 py-5 text-center">
                  <Tooltip text="Total nights used by owners for personal stays.">
                    <span className="flex items-center justify-center gap-1 underline decoration-dotted decoration-slate-300 whitespace-nowrap">Owner Stays <Info className="w-3 h-3 text-slate-300" /></span>
                  </Tooltip>
                </th>
              )}
              {isRSEnabled && (
                <th className="px-6 py-5 text-left group">
                  <Tooltip text={calculationExplainer}>
                    <div className="flex items-center gap-1.5 underline decoration-dotted decoration-slate-300">
                      Fairness Spread <Info className="w-3 h-3 text-slate-400" />
                    </div>
                  </Tooltip>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {roomTypeComparison.map(rt => (
              <tr key={rt.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5 font-bold text-slate-900">{rt.name}</td>
                <td className="px-4 py-5 text-center font-bold text-slate-500">{rt.count}</td>
                <td className="px-4 py-5 text-center font-bold text-slate-900">{rt.avgOccupancy}%</td>
                <td className="px-4 py-5 text-right font-bold text-slate-600">{formatCurrency(rt.avgADR)}</td>
                <td className="px-4 py-5 text-right font-bold text-slate-600">{formatCurrency(rt.revPAR)}</td>
                <td className="px-4 py-5 text-right font-bold text-blue-700">{formatCurrency(rt.totalRevenue)}</td>
                {isRSEnabled && <td className="px-4 py-5 text-right font-bold text-slate-700">{formatCurrency(rt.imputedRevenue)}</td>}
                <td className="px-4 py-5 text-center font-bold text-red-500">{rt.cancellationRate}%</td>
                <td className="px-4 py-5 text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-slate-900">{rt.blockedNightsPct}%</span>
                    <span className="text-[10px] font-bold text-slate-400">({rt.blockedNights} nt)</span>
                  </div>
                </td>
                {isRSEnabled && (
                  <td className="px-4 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-slate-900">{rt.ownerStayNightsPct}%</span>
                      <span className="text-[10px] font-bold text-slate-400">({rt.ownerStayNights} nt)</span>
                    </div>
                  </td>
                )}

                {isRSEnabled && (
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-indigo-50 text-blue-700 rounded text-[10px] font-black uppercase tracking-wider">
                          {rt.fairnessSpread.pct}% Spread
                        </span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400">
                        H: {formatCurrency(rt.fairnessSpread.top)} / L: {formatCurrency(rt.fairnessSpread.bottom)}
                      </div>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  );
}

function TechnicalTab() {
  const [openSections, setOpenSections] = useState({ recompute: true });
  const toggle = (section) => setOpenSections(s => ({ ...s, [section]: !s[section] }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible">
        <button onClick={() => toggle('recompute')} className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
              <RefreshCw className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-900">Algorithm Job Logs</span>
          </div>
          {openSections.recompute ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
        </button>
        {openSections.recompute && (
          <div className="border-t border-slate-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-widest text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Job Hash</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Rows Processed</th>
                  <th className="px-6 py-4 text-right">Anomalies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {technicalData.recomputeJobs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{job.id}</td>
                    <td className="px-6 py-4 text-slate-700">{job.startTime}</td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        'px-2 py-0.5 text-[10px] rounded-full font-black uppercase tracking-wider',
                        job.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      )}>{job.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">{job.rowsProcessed}</td>
                    <td className="px-6 py-4 text-right text-red-600 font-bold">{job.errors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible h-fit col-span-1 lg:col-span-2">
          <button onClick={() => toggle('freshness')} className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors rounded-t-xl">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-slate-400" />
              <div className="text-left">
                <h3 className="text-lg font-bold text-slate-900">Input Freshness & Anomalies</h3>
                <p className="text-xs text-slate-500">Data source health and validation alerts.</p>
              </div>
            </div>
            {openSections.freshness ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          </button>

          {openSections.freshness && (
            <div className="border-t border-slate-200 p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {technicalData.anomalies.map((anomaly, idx) => (
                  <div key={idx} className={clsx("p-4 rounded-lg border flex items-start gap-3",
                    anomaly.type === 'critical' ? 'bg-red-50 border-red-200' :
                      anomaly.type === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'
                  )}>
                    <AlertTriangle className={clsx("w-5 h-5 mt-0.5",
                      anomaly.type === 'critical' ? 'text-red-600' :
                        anomaly.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
                    )} />
                    <div>
                      <h4 className={clsx("font-bold text-sm",
                        anomaly.type === 'critical' ? 'text-red-900' :
                          anomaly.type === 'warning' ? 'text-amber-900' : 'text-blue-900'
                      )}>{anomaly.message}</h4>
                      <p className={clsx("text-xs mt-1",
                        anomaly.type === 'critical' ? 'text-red-700' :
                          anomaly.type === 'warning' ? 'text-amber-700' : 'text-blue-700'
                      )}>{anomaly.details}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left">Source</th>
                      <th className="px-4 py-3 text-left">Last Updated</th>
                      <th className="px-4 py-3 text-center">Coverage</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {technicalData.inputFreshness.map((row, i) => (
                      <tr key={i} className="bg-white">
                        <td className="px-4 py-3 font-medium text-slate-900">{row.source}</td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">{row.lastUpdated}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold", row.coverage === 100 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                            {row.coverage}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {row.alert ? (
                            <span className="text-red-600 font-bold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {row.alert}
                            </span>
                          ) : <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Healthy</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible h-fit">
          <button onClick={() => toggle('outlier')} className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-slate-400" />
              <span className="font-bold text-lg text-slate-900">Outlier Configuration</span>
            </div>
            {openSections.outlier ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          </button>
          {openSections.outlier && (
            <div className="border-t border-slate-200 p-6 space-y-6">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex justify-between items-center group cursor-help transition-all hover:bg-slate-100">
                <Tooltip text="Percent deviation from median revenue score allowed before a unit is flagged as an outlier.">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-dotted border-slate-300">Active Threshold</span>
                </Tooltip>
                <span className="text-lg font-black text-blue-700">{technicalData.outlierConfig.threshold}% from Median</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(technicalData.outlierConfig.outliersByRoomType).map(([type, count]) => (
                  <div key={type} className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{type}</span>
                    <span className="font-black text-slate-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const RoomDetailsDrawer = ({ room, onClose, isRSEnabled }) => {
  if (!room) return null;
  const details = getRoomDetails(room.id);

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[500px] bg-white h-full flex flex-col shadow-2xl drawer-enter overflow-visible">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Unit {room.number}</h2>
              {room.owner.isCrown && isRSEnabled && <Crown className="w-5.5 h-5.5 text-amber-500 fill-amber-50" />}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {room.roomTypeName}
              {isRSEnabled && <span className="ml-2 text-slate-300">|</span>}
              {isRSEnabled && <span className="ml-2">{room.owner.name}</span>}
            </p>
            {room.owner.onboardedAt && getEffectiveWindow(room.owner.onboardedAt, '2026-01-01').isPartial && isRSEnabled && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-100 rounded text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                <Info className="w-3 h-3" />
                Effective: {getEffectiveWindow(room.owner.onboardedAt, '2026-01-01').windowLabel}
              </div>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Rank</span>
              <span className="text-2xl font-black text-blue-700">#{room.rank}</span>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CIRS</span>
              <CIRSBadge status={room.cirs} />
            </div>
            {room.isOutlier && isRSEnabled && (
              <>
                <div className="h-10 w-px bg-slate-200" />
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alerts</span>
                  <OutlierBadge reason={room.outlierReason} />
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Primary Period Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Actual Revenue</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(room.actualRevenue)}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{room.bookings} Total Bookings</p>
              </div>
              {isRSEnabled && (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Owner Imputed</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(room.imputedRevenue)}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{room.ownerNights} Owner Stays</p>
                </div>
              )}

              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 col-span-2 space-y-3">
                <div className="flex items-baseline justify-between border-b border-slate-200 pb-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Occupancy Breakdown</p>
                  <p className="text-sm font-black text-slate-900">{room.occupancy}% Total</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-white rounded border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Guest</p>
                    <p className="text-lg font-bold text-slate-700">{room.guestOccupancyPct}%</p>
                    <p className="text-[9px] font-bold text-slate-400">({room.guestNights} nights)</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Owner</p>
                    <p className="text-lg font-bold text-slate-700">{room.ownerOccupancyPct}%</p>
                    <p className="text-[9px] font-bold text-slate-400">({room.ownerNights} nights)</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Blocked</p>
                    <p className="text-lg font-bold text-slate-700">{room.blockedOccupancyPct}%</p>
                    <p className="text-[9px] font-bold text-slate-400">({room.blockedNights} nights)</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 col-span-2 space-y-3">
                <div className="flex items-baseline justify-between border-b border-slate-200 pb-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Future Occupancy Breakdown</p>
                  <p className="text-sm font-black text-slate-900">{Math.round((30 - room.futureAvailableNights) / 30 * 100)}% Total</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-white rounded border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Guest</p>
                    <p className="text-lg font-bold text-slate-700">{room.futureGuestPct}%</p>
                    <p className="text-[9px] font-bold text-slate-400">({room.futureGuestNights} nights)</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Owner</p>
                    <p className="text-lg font-bold text-slate-700">{room.futureOwnerPct}%</p>
                    <p className="text-[9px] font-bold text-slate-400">({room.futureOwnerNights} nights)</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Blocked</p>
                    <p className="text-lg font-bold text-slate-700">{room.futureBlockedPct}%</p>
                    <p className="text-[9px] font-bold text-slate-400">({room.futureBlockedNights} nights)</p>
                  </div>
                </div>
              </div>
              {isRSEnabled && (
                <div className="bg-blue-600 rounded-xl p-5 shadow-lg shadow-blue-100 col-span-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1">Revenue Score (RS)</p>
                      <p className="text-3xl font-black text-white">{formatRS(room.rs)}</p>
                    </div>
                    <div className={clsx(
                      'px-3 py-1 rounded-lg text-sm font-bold',
                      room.rsChange >= 0 ? 'bg-emerald-400 text-indigo-900' : 'bg-red-400 text-white'
                    )}>
                      {room.rsChange >= 0 ? '+' : ''}{room.rsChange} Trend
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-slate-100/50 rounded-xl border border-slate-200 p-5 col-span-2 group cursor-help">
                <Tooltip text="Percentage of the next 30 days currently available for guest bookings.">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 border-b border-dotted border-slate-300 w-fit">Future Availability</p>
                </Tooltip>
                <div className="flex items-center gap-3">
                  <p className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{room.futureAvailableNights} Nights Available</p>
                  <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200 uppercase tracking-wider">Next 30D Window</span>
                </div>
              </div>
            </div>
          </div>

          {isRSEnabled && (
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-6">Explainability Timeline</h3>
              <div className="space-y-6 relative ml-3">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200" />
                {details?.rsDrivers.map((event, i) => (
                  <div key={i} className="relative pl-8">
                    <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-slate-400 ring-4 ring-white" />
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{event.timestamp}</p>
                        <p className="text-sm font-bold text-slate-900 mt-1">{event.description}</p>
                      </div>
                      <div className={clsx('text-sm font-black', event.delta >= 0 ? 'text-emerald-600' : 'text-red-500')}>
                        {event.delta >= 0 ? '+' : ''}{event.delta}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Recent Stays</h3>
            <div className="space-y-3">
              {details?.bookingHistory.map((bk, i) => {
                if (!isRSEnabled && bk.channel === 'Owner') return null;
                return (
                  <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>
                      <p className="text-[10px] font-bold text-blue-600 font-mono">{bk.id}</p>
                      <p className="text-sm font-bold text-slate-900">{bk.dates}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(bk.revenue)}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{bk.channel}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
