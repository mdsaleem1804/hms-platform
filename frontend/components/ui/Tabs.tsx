import React, { useState, ReactNode } from 'react';

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultActive?: number;
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultActive = 0 }) => {
  const [active, setActive] = useState(defaultActive);

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`px-6 py-3 -mb-px font-medium text-sm focus:outline-none transition-colors border-b-2 ${
              active === idx
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-blue-600'
            }`}
            onClick={() => setActive(idx)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[active].content}</div>
    </div>
  );
};

export default Tabs;
