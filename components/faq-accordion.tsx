"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.question} className="card overflow-hidden">
            <button
              type="button"
              className="flex w-full items-center justify-between px-5 py-4 text-left"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
            >
              <span className="font-medium text-nordic-900">{item.question}</span>
              <span className="text-xl text-nordic-400">{open ? "−" : "+"}</span>
            </button>
            {open ? <p className="px-5 pb-5 text-sm leading-relaxed text-nordic-600">{item.answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
