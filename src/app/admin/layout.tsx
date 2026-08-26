import { auth } from "@/auth";
import { Sidebar } from "@/components/admin/sidebar";
import { HeaderAdmin } from "@/components/admin/header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // El middleware ya protege /admin/**, pero /admin/login vive bajo este
  // mismo layout y no tiene sesión — en ese caso no mostramos el shell.
  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-fp-bone">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-[260px]">
        <HeaderAdmin
          nombre={session.user.nombre}
          email={session.user.email ?? ""}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
