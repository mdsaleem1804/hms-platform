import React, { useState, ReactNode } from 'react';

interface AccordionSection {
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  sections: AccordionSection[];
  defaultOpen?: number;
}

export default function Accordion({ sections, defaultOpen = 0 }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);
  return (
    <div className="space-y-4">
      {sections.map((section, idx) => (
        <div key={section.title} className="border border-gray-200 rounded-lg bg-white">
          <button
            type="button"
            className={`w-full flex justify-between items-center px-6 py-4 text-lg font-semibold focus:outline-none transition-colors ${openIndex === idx ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-900'}`}
            onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            aria-expanded={openIndex === idx}
          >
            {section.title}
            <span className="ml-2 text-xl">{openIndex === idx ? '−' : '+'}</span>
          </button>
          {openIndex === idx && (
            <div className="px-6 pb-6 pt-2">{section.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
