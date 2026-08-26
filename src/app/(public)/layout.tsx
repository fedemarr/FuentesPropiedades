import { NavbarPublica } from "@/components/publicos/navbar";
import { FooterPublico } from "@/components/publicos/footer";
import { BotonWhatsapp } from "@/components/publicos/boton-whatsapp";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarPublica />
      {/* Offset para la navbar fija */}
      <div className="flex min-h-screen flex-col pt-[88px]">
        <main className="flex-1">{children}</main>
        <FooterPublico />
      </div>
      <BotonWhatsapp />
    </>
  );
}
