import { Outlet, useParams } from "react-router-dom";
import Sidebar from "./sidebar";
import useIsCollapsed from "@/hooks/use-is-collapsed";
import { useEffect, useState } from "react";
import { Layout, LayoutBody, LayoutHeader } from "./custom/layout";
import ThemeSwitch from "./theme-switch";
import { UserNav } from "./user-nav";

export default function AppShell() {
  const params = useParams();
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  const [showContent, setShowContent] = useState(false);
  useEffect(() => {
    const user = localStorage.getItem("USER-REF-DETAILS");
    if (!user) {
      window.location.href = "/login";
    } else {
      setShowContent(true);
    }
  }, [params]);
  return (
    <>
      {showContent && (
        <div className="relative h-full overflow-hidden bg-background">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <main
            id="content"
            className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? "md:ml-14" : "md:ml-64"} h-full`}
          >
            <Layout>
              {/* ===== Top Heading ===== */}
              <LayoutHeader>
                <div className="ml-auto flex items-center space-x-4">
                  <ThemeSwitch />
                  <UserNav />
                </div>
              </LayoutHeader>
            </Layout>
             {/* ===== Main ===== */}
            <LayoutBody className="space-y-4">
              <Outlet />
            </LayoutBody>
          </main>
        </div>
      )}
    </>
  );
}
