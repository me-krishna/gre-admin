import { Button } from "@/components/custom/button";
import ThemeSwitch from "@/components/theme-switch";
import { UserNav } from "@/components/user-nav";
import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import IFrameRender from "@/components/custom/Iframe-Render";
import { useParams } from "react-router-dom";
import { ReportLinks } from "@/data/reportLinks";
import { useEffect, useState } from "react";

import {
  Drawer,
  // DrawerClose,
  DrawerContent,
  // DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Sheet,
  // SheetClose,
  SheetContent,
  // SheetDescription,
  // SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Report() {
  const params = useParams();
  const [currentLink, setCurrentLink] = useState(ReportLinks[0]);

  useEffect(() => {
    setCurrentLink(
      ReportLinks.find((link) => link.id === parseInt(params?.id!)) ||
        ReportLinks[0]
    );
  }, [params]);

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      {/* ===== Main ===== */}
      <LayoutBody className="space-y-4">
        <div className="flex items-center justify-between md:flex-row flex-col space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {currentLink.title}
          </h1>
          <div className="flex items-center space-x-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Explination</Button>
              </SheetTrigger>
              <SheetContent className="w-[80%] sm:max-w-[940px]">
                <SheetHeader>
                  <SheetTitle>Explination</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">{currentLink.explanation}</div>
              </SheetContent>
            </Sheet>

            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">Send Report on Whatsapp</Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Send Report on Whatsapp</DrawerTitle>
                    {/* <DrawerDescription>
                      Set your daily activity goal.
                    </DrawerDescription> */}
                  </DrawerHeader>
                  <div className="p-4 pb-0">
                    {/* <div className="mt-3 h-[120px]">test</div> */}
                  </div>
                  <DrawerFooter>
                    <Button>Send</Button>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        <IFrameRender src={currentLink.link} />
      </LayoutBody>
    </Layout>
  );
}
