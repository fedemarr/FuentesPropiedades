import { SidebarContenido } from "./sidebar-contenido";

/** Sidebar fija de escritorio — 260px, solo visible en lg+. En mobile se usa
 * SidebarMovil (drawer). */
export function Sidebar() {
  return (
    <aside className="hidden w-[260px] shrink-0 lg:block">
      <div className="fixed inset-y-0 left-0 w-[260px]">
        <SidebarContenido />
      </div>
    </aside>
  );
}
