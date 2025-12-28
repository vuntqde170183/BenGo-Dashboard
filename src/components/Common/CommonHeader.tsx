import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMenuSidebar } from "@/stores/useMenuSidebar";
import { mdiBellOutline, mdiLoading } from "@mdi/js";
import { Icon } from "@mdi/react";
import type React from "react";
import { useRef, useState, useEffect } from "react";
import { useUser } from "@/context/useUserContext";
import { HamburgerMenu } from "iconsax-reactjs";

export default function CommonHeader() {
  const { toggle } = useMenuSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isLoading = false;
  const { logoutUser } = useUser();

  const handleSearchSubmit = () => {};
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm((e.target as HTMLInputElement).value);
  };
  return (
    <>
      <div
        className="w-full fixed top-0 left-0 right-0 z-50
      p-4 px-4 bg-darkCardV1 border-b border-b-darkBorderV1 flex justify-between items-center h-[78px]"
      >
        <div className="flex items-center w-[244px] justify-between">
          <button
            onClick={toggle}
            className="bg-[#29323A] flex items-center justify-center hover:bg-[#29323A]/80 !text-neutral-200/70 !p-0 !h-10 !w-10 rounded-full"
          >
            <HamburgerMenu size="20" color="#fff" />
          </button>
        </div>
        <div className="relative hidden md:block">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center gap-4"
          >
            <div className="relative w-[440px] flex justify-between items-center rounded-sm bg-[#29323A]">
              <Input
                ref={inputRef}
                placeholder="Search..."
                className="w-[90%] pr-10 border-none focus:!outline-none focus:!ring-0 focus:!border-none !bg-transparent !text-neutral-200/80 placeholder:text-neutral-200/80"
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={isLoading}
              />
              {isLoading && (
                <Icon
                  path={mdiLoading}
                  size={0.8}
                  spin
                  className="absolute right-[10px] top-1/2 transform -translate-y-1/2 text-mainActiveV1"
                />
              )}
            </div>
            <button
              type="submit"
              style={{ display: "none" }}
              aria-hidden="true"
            ></button>
          </form>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Icon path={mdiBellOutline} size={0.8} />
          </Button>
          <Button onClick={logoutUser}>Logout</Button>
        </div>
      </div>
    </>
  );
}
