import { useEffect, useState } from "react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const user = localStorage.getItem("USER-REF-DETAILS");
    user && setUser(JSON.parse(user));
    console.log(user);
  }, []);
  return (
    <>
      <div className="flex items-center justify-between md:flex-row flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Dashboard
        </h1>
      </div>
      <p className="md:text-xl font-semibold border p-3 rounded-lg">
        {user && (
          <>
            Hi <span className="text-purple-700 capitalize">{user.name}, </span>
          </>
        )}{" "}
        Welcome to the Miles Talent Hub Dashboard 💐💐💐💐💐.
      </p>
    </>
  );
};

export default Dashboard;
