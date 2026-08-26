import { BreadcrumbAdmin } from "./breadcrumb-admin";
import { BuscadorGlobal } from "./buscador-global";
import { MenuUsuario } from "./menu-usuario";
import { SidebarMovil } from "./sidebar-movil";

interface HeaderAdminProps {
  nombre: string;
  email: string;
}

export function HeaderAdmin({ nombre, email }: HeaderAdminProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-fp-line bg-white/80 px-4 backdrop-blur-md sm:px-6">
      <SidebarMovil />
      <BreadcrumbAdmin />
      <div className="ml-auto flex items-center gap-4">
        <BuscadorGlobal />
        <MenuUsuario nombre={nombre} email={email} />
      </div>
    </header>
  );
}
