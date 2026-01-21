'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Users,
  BarChart3,
  Shield,
  ChevronRight,
  UserCircle,
} from "lucide-react";
import { NavigationItem, SidebarProps } from '@/interfaces';
import { ASSETS } from '@/helpers/assets';

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false }) => {
  const { pathname } = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const navigate = useNavigate();
  
  // Load expanded items from localStorage on component mount
  useEffect(() => {
    const savedExpandedItems = localStorage.getItem('sidebar-expanded-items');
    if (savedExpandedItems) {
      try {
        setExpandedItems(JSON.parse(savedExpandedItems));
      } catch (error) {
        console.error('Error parsing saved expanded items:', error);
      }
    }
  }, []);
  
  // Save expanded items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sidebar-expanded-items', JSON.stringify(expandedItems));
  }, [expandedItems]);
  const navigationItems: NavigationItem[] = useMemo(() => [
    {
      id: "analytics-component",
      title: "Dashboard",
      href: "/",
      icon: BarChart3,
    },
    {
      id: "sub-admin-component",
      title: "All Admins",
      href: "/admins",
      icon: Shield,
    },
    {
      id: "users-component",
      title: "All Users",
      href: "/users",
      icon: Users,
    },
    {
      id: "profile-component",
      title: "Profile",
      href: "/profile",
      icon: UserCircle,
    },
  ], []);

  const handleToggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = useCallback((href?: string) => {
    if (!href) return false;
    
    // Exact match
    if (pathname === href) return true;
    
    // For child routes, check if pathname starts with href + '/' but not with href + '/' + another segment
    if (pathname.startsWith(href + '/')) {
      // If href is '/spots', we need to be more specific to avoid matching '/spots/verification'
      if (href === '/spots') {
        // Only match if it's a direct child of /spots (like /spots/123) but not /spots/verification
        const pathSegments = pathname.split('/');
        
        // If we're on /spots/verification, don't mark /spots as active
        if (pathSegments.length === 3 && pathSegments[2] === 'verification') {
          return false;
        }
        
        // If we're on /spots/123/verification, don't mark /spots as active
        if (pathSegments.length === 4 && pathSegments[3] === 'verification') {
          return false;
        }
      }
      
      return true;
    }
    
    return false;
  }, [pathname]);

  // Auto-expand parent items when child routes are active
  useEffect(() => {
    const autoExpandParents = () => {
      const newExpandedItems = [...expandedItems];
      
      navigationItems.forEach(item => {
        if (item.children) {
          const hasActiveChild = item.children.some(child => 
            child.href && isActive(child.href)
          );
          
          if (hasActiveChild && !newExpandedItems.includes(item.id)) {
            newExpandedItems.push(item.id);
          }
        }
      });
      
      if (newExpandedItems.length !== expandedItems.length) {
        setExpandedItems(newExpandedItems);
      }
    };
    
    autoExpandParents();
  }, [pathname, expandedItems, navigationItems, isActive]);

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.href);

    return (
      <div key={item.id} className="relative">
        <div
          className={`
            group relative flex items-center justify-between px-4 py-3.5 text-sm font-medium 
            transition-all duration-300 ease-in-out cursor-pointer rounded-lg mx-2 mb-1
            ${level > 0 ? 'ml-6' : ''}
            ${active 
              ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 shadow-md shadow-emerald-100 border border-emerald-200' 
              : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-800 hover:shadow-sm hover:border hover:border-gray-200'
            }
            ${isCollapsed ? 'justify-center px-2 mx-1' : ''}
            ${hasChildren ? 'hover:shadow-lg' : ''}
          `}
          onClick={() => {
            if (hasChildren) {
              handleToggleExpanded(item.id);
            } else if (item.href) {
              navigate(item.href);
            }
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (hasChildren) {
                handleToggleExpanded(item.id);
              }
            }
          }}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-label={item.title}
        >
          {/* Active indicator */}
          {active && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-r-full"></div>
          )}
          
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            {item.icon && (
              <div className={`
                p-2 rounded-lg transition-all duration-300
                ${active 
                  ? 'bg-emerald-100 text-emerald-600 shadow-sm' 
                  : 'text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-700'
                }
              `}>
                <item.icon className="h-5 w-5" />
              </div>
            )}
            {!isCollapsed && (
              <span className={`truncate font-medium ${active ? 'text-blue-700' : 'text-gray-700'}`}>
                {item.title}
              </span>
            )}
          </div>
          
          {hasChildren && !isCollapsed && (
            <div className={`
              flex items-center transition-transform duration-300
              ${isExpanded ? 'rotate-90' : ''}
            `}>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
            </div>
          )}
        </div>

        {hasChildren && isExpanded && !isCollapsed && (
          <div className="relative">
            {/* Animated border */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-transparent"></div>
            <div className="ml-6 space-y-1">
              {item.children?.map(child => renderNavigationItem(child, level + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`
      h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 
      border-r border-gray-200/50 flex flex-col fixed left-0 top-0 z-50
      shadow-xl shadow-gray-900/10 backdrop-blur-sm
      ${isCollapsed ? 'w-16' : 'w-64'}
      transition-all duration-300 ease-in-out
    `}>
      {/* Header */}
      <div className="flex items-center justify-center p-6 border-b border-gray-200/50 flex-shrink-0 bg-white/80 backdrop-blur-sm">
        {!isCollapsed && (
          <div className="flex items-center w-full justify-center">
            <div className="relative group">
              <img 
                src={ASSETS.logo} 
                alt="logo" 
                width={100}
                height={100}
                className="transition-transform duration-300 group-hover:scale-105"
                style={{
                  objectFit: "contain",
                  backgroundColor: "transparent"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex items-center justify-center">
            <img 
              src={ASSETS.logo} 
              alt="logo" 
              width={40}
              height={40}
              style={{
                objectFit: "contain",
                backgroundColor: "transparent"
              }}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 min-h-0">
        <div className="space-y-2 px-3">
          {navigationItems.map(item => renderNavigationItem(item))}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-6 border-t border-gray-200/50 flex-shrink-0 bg-white/60 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-xs text-gray-500 font-medium mb-1">
              Park Nest Admin
            </div>
            <div className="text-xs text-gray-400">
              © 2025 All rights reserved
            </div>
          </div>
        </div>
      )}
      {isCollapsed && (
        <div className="p-4 border-t border-gray-200/50 flex-shrink-0 bg-white/60 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-xs text-gray-400 font-bold">PN</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;