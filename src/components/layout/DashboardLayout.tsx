import type { MenuItem } from "@/interface/types";
import { cn } from "@/lib/utils";
import { useMenuSidebar } from "@/stores/useMenuSidebar";
import { Icon } from "@mdi/react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import type React from "react";
import { useState } from "react";
import { getDashboardMenuItems } from "./dashboardMenuItems";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { RippleEffect } from "@/components/ui/ripple-effect";
import CommonHeader from "../Common/CommonHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hoverMenu, setHoverMenu] = useState<string | null>(null);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const location = useLocation();
  const pathname = location.pathname;
  const { isOpen } = useMenuSidebar();

  // Get admin menu items
  const dashboardMenuItems: MenuItem[] = getDashboardMenuItems();

  const isMenuActive = (menu: MenuItem) => {
    if (menu.path && pathname === menu.path) return true;
    return false;
  };

  const handleMouseEnter = (menuId: string) => {
    if (!isOpen) {
      setHoverMenu(menuId);
    }
  };

  const handleMouseLeave = () => {
    setHoverMenu(null);
  };

  const handleMenuClick = (menu: MenuItem) => {
    if (menu.subMenu && menu.subMenu.length > 0) {
      setExpandedMenu(expandedMenu === menu.id ? null : menu.id);
    }
  };

  return (
    <div className="min-h-screen bg-darkBackgroundV1" suppressHydrationWarning>
      {/* Header - Fixed at top */}
      <CommonHeader />

      {/* Content area below header */}
      <div className="flex mt-[78px] min-h-[calc(100vh-78px)]">
        {/* Sidebar */}
        <div
          className={cn(
            "bg-darkCardV1 transition-all duration-300 flex-shrink-0",
            isOpen
              ? "w-[250px]"
              : "w-0 md:w-16 overflow-hidden flex justify-center",
          )}
        >
          <div className="flex flex-col h-full bg-darkBackgroundV1">
            <nav className="flex-1 overflow-y-auto py-4 bg-darkBackgroundV1">
              <ul className={cn("", isOpen ? "pr-0 pl-2" : "px-1")}>
                {dashboardMenuItems.map((menu) => (
                  <li key={menu.id}>
                    <div
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(menu.id)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleMenuClick(menu)}
                    >
                      {!menu.subMenu || menu.subMenu.length === 0 ? (
                        <Link to={menu.path}>
                          <RippleEffect
                            rippleColor="rgba(68, 215, 182, 0.3)"
                            duration={500}
                          >
                            <div
                              className={cn(
                                "flex items-center rounded-lg p-[10px] h-[46px] text-[13px] font-semibold transition-all duration-300 border",
                                isMenuActive(menu)
                                  ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(65,198,81,0.1)]"
                                  : "text-neutral-200/70 border-transparent hover:bg-primary/5 hover:text-primary/80 hover:border-primary/10",
                                !isOpen && "!justify-center w-[46px]",
                              )}
                            >
                              <div
                                className={cn(
                                  "!w-7 !h-7 flex-shrink-0 rounded-md flex items-center justify-center transition-colors",
                                  isMenuActive(menu)
                                    ? "bg-primary/20"
                                    : "bg-darkBorderV1",
                                  isOpen ? "mr-2" : "mr-0",
                                )}
                              >
                                <Icon
                                  path={menu.icon}
                                  size={0.8}
                                  className={cn(
                                    isMenuActive(menu)
                                      ? "text-primary flex-shrink-0"
                                      : "text-neutral-200/70 flex-shrink-0",
                                  )}
                                />
                              </div>
                              {isOpen && (
                                <span className="text-nowrap">{menu.name}</span>
                              )}
                            </div>
                          </RippleEffect>
                        </Link>
                      ) : (
                        <RippleEffect
                          rippleColor="rgba(68, 215, 182, 0.3)"
                          duration={500}
                        >
                          <div
                            className={cn(
                              "flex items-center rounded-lg p-[10px] h-[46px] text-[13px] font-semibold transition-all duration-300 border",
                              isMenuActive(menu)
                                ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(65,198,81,0.1)]"
                                : "text-neutral-200/70 border-transparent hover:bg-primary/5 hover:text-primary/80 hover:border-primary/10",
                              !isOpen && "!justify-center w-[46px]",
                            )}
                          >
                            <div
                              className={cn(
                                "!w-7 !h-7 flex-shrink-0 rounded-md flex items-center justify-center transition-colors",
                                isMenuActive(menu)
                                  ? "bg-primary/20"
                                  : "bg-darkBorderV1",
                                isOpen ? "mr-2" : "mr-0",
                              )}
                            >
                              <Icon
                                path={menu.icon}
                                size={0.8}
                                className={cn(
                                  isMenuActive(menu)
                                    ? "text-primary flex-shrink-0"
                                    : "text-neutral-200/70 flex-shrink-0",
                                )}
                              />
                            </div>
                            {isOpen && (
                              <span className="text-nowrap flex items-center justify-between gap-1 flex-1">
                                {menu.name}
                                {expandedMenu === menu.id ? (
                                  <IconChevronUp size={18} className="ml-1" />
                                ) : (
                                  <IconChevronDown size={18} className="ml-1" />
                                )}
                              </span>
                            )}
                          </div>
                        </RippleEffect>
                      )}
                      {/* SubMenu expand/collapse */}
                      {isOpen && menu.subMenu && menu.subMenu.length > 0 && (
                        <AnimatePresence initial={false}>
                          {expandedMenu === menu.id && (
                            <motion.ul
                              className="ml-8 mt-1"
                              initial="collapsed"
                              animate="open"
                              exit="collapsed"
                              variants={{
                                open: { opacity: 1, height: "auto" },
                                collapsed: { opacity: 0, height: 0 },
                              }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              style={{ overflow: "hidden" }}
                            >
                              {menu.subMenu.map((sub) => (
                                <li key={sub.id}>
                                  <Link
                                    to={sub.path}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <RippleEffect
                                      rippleColor="rgba(68, 215, 182, 0.2)"
                                      duration={400}
                                    >
                                      <div
                                        className={cn(
                                          "flex items-center rounded-lg p-[8px] h-[38px] text-[13px] font-normal transition-all duration-300 border",
                                          pathname === sub.path
                                            ? "bg-primary/10 text-primary border-primary/20"
                                            : "text-neutral-200/70 border-transparent hover:bg-primary/5 hover:text-primary/80 hover:border-primary/10",
                                        )}
                                      >
                                        <Icon
                                          path={sub.icon || ""}
                                          size={0.8}
                                          className={cn(
                                            pathname === sub.path
                                              ? "text-primary flex-shrink-0"
                                              : "text-neutral-200/70 flex-shrink-0",
                                            "mr-3",
                                          )}
                                        />
                                        <span>{sub.name}</span>
                                      </div>
                                    </RippleEffect>
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      )}
                      {!isOpen && hoverMenu === menu.id && (
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -5 }}
                            transition={{ duration: 0.2 }}
                            className="fixed ml-16 mt-[-30px] dark:bg-darkBorderV1 border border-lightBorderV1 text-neutral-200 text-[13px] py-1.5 px-3 rounded-md shadow-light-grey z-50 whitespace-nowrap flex items-center"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-mainActiveV1 mr-1.5"></span>
                            <span className="font-semibold">{menu.name}</span>
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main content - automatically takes remaining width */}
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
