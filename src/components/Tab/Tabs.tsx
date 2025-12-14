import React, { useRef, useState, useEffect } from 'react';
import './tabs.css';

interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultActiveKey?: string;
  onChange?: (key: string) => void; // <-- NEW
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultActiveKey, onChange }) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey || tabs[0].key);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const calculateIndicatorPosition = () => {
    const activeIndex = tabs.findIndex((t) => t.key === activeKey);
    const activeElement = tabRefs.current[activeIndex];
    const container = tabsContainerRef.current;

    if (activeElement && container) {
      const tabRect = activeElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      setIndicatorStyle({
        width: `${tabRect.width}px`,
        transform: `translateX(${tabRect.left - containerRect.left}px)`,
      });
    }
  };

  useEffect(() => {
    calculateIndicatorPosition();
    window.addEventListener('resize', calculateIndicatorPosition);
    return () => window.removeEventListener('resize', calculateIndicatorPosition);
  }, [activeKey]);

  return (
    <>
      {/* Tabs Header */}
      <div className="mt-4 border-bottom nav-tabs-container" ref={tabsContainerRef}>
        <ul className="nav nav-tabs border-0">
          {tabs.map((tab, index) => (
            <li key={tab.key} className="nav-item">
              <button
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                className={`nav-link ${activeKey === tab.key ? 'active' : ''}`}
                onClick={() => {
                  setActiveKey(tab.key);
                  if (onChange) onChange(tab.key); // <-- CALL PARENT
                }}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="tab-indicator" style={indicatorStyle}></div>
      </div>
    </>
  );
};

export default Tabs;
