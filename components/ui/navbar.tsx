"use client";

import Link from 'next/link';
import { useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

export type IMenu = {
  id: number | string;
  title: string;
  url?: string;
  dropdown?: boolean;
  items?: IMenu[];
  onClick?: () => void;
  active?: boolean;
};

export type MenuProps = {
  list: IMenu[];
  className?: string;
  itemClassName?: string;
  dropdownClassName?: string;
  cursorClassName?: string;
  onSelect?: (item: IMenu) => void;
};

const Menu = ({
  list,
  className = '',
  itemClassName = '',
  dropdownClassName = '',
  cursorClassName = 'bg-foreground',
  onSelect,
}: MenuProps) => {
  const [hovered, setHovered] = useState<number | string | null>(null);

  return (
    <MotionConfig transition={{ bounce: 0, type: 'tween' }}>
      <nav className={`relative ${className}`}>
        <ul className={'flex items-center flex-wrap'}>
          {list?.map((item) => {
            const isHovered = hovered === item.id;
            const content = (
              <>
                <span className="relative z-10 flex items-center gap-1.5 font-medium">
                  {item?.title}
                  {item?.dropdown && (
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 opacity-60 ${
                        isHovered ? 'rotate-180 opacity-100' : ''
                      }`}
                    />
                  )}
                </span>
                {isHovered && !item?.dropdown && (
                  <motion.div
                    layout
                    layoutId="cursor"
                    className={`absolute h-0.5 w-full bottom-0 left-0 ${cursorClassName}`}
                  />
                )}
                {item?.active && !isHovered && !item?.dropdown && (
                  <div
                    className={`absolute h-0.5 w-full bottom-0 left-0 opacity-40 ${cursorClassName}`}
                  />
                )}
              </>
            );

            return (
              <li key={item.id} className="relative">
                {item?.url && item?.url !== '#' && !item?.onClick ? (
                  <Link
                    className={`
                      relative flex items-center justify-center rounded px-5 py-3 transition-all text-sm
                      hover:bg-foreground/10
                      ${isHovered ? 'bg-foreground/10' : ''}
                      ${item?.active ? 'text-brand-accent font-semibold' : ''}
                      ${itemClassName}
                    `}
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                    href={item.url}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={`
                      relative flex items-center justify-center rounded px-5 py-3 transition-all cursor-pointer text-left text-sm
                      hover:bg-foreground/10
                      ${isHovered ? 'bg-foreground/10' : ''}
                      ${item?.active ? 'text-brand-accent font-semibold' : ''}
                      ${itemClassName}
                    `}
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      if (onSelect) onSelect(item);
                    }}
                  >
                    {content}
                  </button>
                )}

                {item?.dropdown && isHovered && (
                  <div
                    className="absolute left-0 top-full z-50 pt-2"
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <motion.div
                      layout
                      transition={{ bounce: 0, duration: 0.2 }}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 8, opacity: 0 }}
                      style={{
                        borderRadius: '8px',
                      }}
                      className={`flex w-56 flex-col rounded bg-background border shadow-xl overflow-hidden ${dropdownClassName}`}
                      layoutId="cursor"
                    >
                      {item?.items?.map((nav) => {
                        if (nav?.url && nav?.url !== '#' && !nav?.onClick) {
                          return (
                            <Link
                              key={`link-${nav?.id}`}
                              href={`${nav?.url}`}
                              className={`w-full px-4 py-3 hover:bg-muted transition-colors text-xs uppercase tracking-wider font-semibold ${
                                nav?.active ? 'text-brand-accent bg-muted/50' : ''
                              }`}
                              onClick={() => {
                                setHovered(null);
                                if (onSelect) onSelect(nav);
                              }}
                            >
                              {nav?.title}
                            </Link>
                          );
                        }
                        return (
                          <button
                            type="button"
                            key={`btn-${nav?.id}`}
                            className={`w-full px-4 py-3 hover:bg-muted text-left transition-colors cursor-pointer text-xs uppercase tracking-wider font-semibold ${
                              nav?.active ? 'text-brand-accent bg-muted/50' : ''
                            }`}
                            onClick={() => {
                              if (nav.onClick) nav.onClick();
                              if (onSelect) onSelect(nav);
                              setHovered(null);
                            }}
                          >
                            {nav?.title}
                          </button>
                        );
                      })}
                    </motion.div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </MotionConfig>
  );
};

export default Menu;
export { Menu };
