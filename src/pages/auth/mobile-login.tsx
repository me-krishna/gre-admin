import { Card } from "@/components/ui/card";
import { UserAuthForm } from "./components/user-auth-form";

export default function MobileLogin() {
  return (
    <>
      <div className="container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8">
          {/* <div className="flex justify-center">
            <img
              src="https://res.cloudinary.com/duthqxswg/image/upload/q_100/MilesEducationWebsite-2024/miles-logo.svg"
              className="w-40 h-auto"
            />
          </div> */}
          <div className="mb-4 flex items-center justify-center">
            <h1 className="text-xl font-medium">Dr Raju's Admin</h1>
          </div>
          <Card className="p-6">
            <div className="mb-2 flex flex-col space-y-2 text-left">
              <h1 className="text-md font-semibold tracking-tight">Sign In</h1>
              {/* <p className="text-sm text-muted-foreground">
                Enter your registered Mobile Number and <br /> we will send you
                a OTP to your mobile number.
              </p> */}
            </div>
            <UserAuthForm />
          </Card>
        </div>
      </div>
    </>
  );
}
