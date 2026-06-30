import { Navbar } from "@/modules/home/components/navbar";
import { getCurrentUserRole } from "@/lib/data/user";
export default async function Rootlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userRole = await getCurrentUserRole();
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar userRole={userRole} />
      <div className="flex-1 flex flex-col px-4 pb-4 ">
        <div
          className="fixed inset-0 -z-10 bg-background 
  bg-[radial-gradient(#dadde2_1px,transparent_1px)] bg-size-[16px_16px] 
  dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] dark:bg-size-[16px_16px]"
        ></div>
        {children}
      </div>
    </main>
  );
}
