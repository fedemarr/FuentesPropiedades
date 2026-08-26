"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Save,
  Plus,
  Trash2,
  GripVertical,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { guardarConfiguracion, guardarFaq, eliminarFaq } from "@/app/admin/configuracion/actions";

type Configuracion = {
  id: string;
  telefono: string;
  whatsapp: string;
  email: string;
  direccion: string;
  horarios: string;
  matricula: string;
  instagram: string | null;
  facebook: string | null;
  heroTitulo: string;
  heroSubtitulo: string | null;
  textoNosotros: string;
  textoAdmin: string;
};

type Faq = {
  id: string;
  pregunta: string;
  respuesta: string;
  orden: number;
  activa: boolean;
};

interface FormularioConfiguracionProps {
  configuracion: Configuracion;
  faqs: Faq[];
}

export function FormularioConfiguracion({
  configuracion,
  faqs: faqsIniciales,
}: FormularioConfiguracionProps) {
  const router = useRouter();
  const [pendiente, iniciarTransicion] = useTransition();
  const [tab, setTab] = useState("contacto");

  const [telefono, setTelefono] = useState(configuracion.telefono);
  const [whatsapp, setWhatsapp] = useState(configuracion.whatsapp);
  const [email, setEmail] = useState(configuracion.email);
  const [direccion, setDireccion] = useState(configuracion.direccion);
  const [horarios, setHorarios] = useState(configuracion.horarios);
  const [matricula, setMatricula] = useState(configuracion.matricula);
  const [instagram, setInstagram] = useState(configuracion.instagram ?? "");
  const [facebook, setFacebook] = useState(configuracion.facebook ?? "");
  const [heroTitulo, setHeroTitulo] = useState(configuracion.heroTitulo);
  const [heroSubtitulo, setHeroSubtitulo] = useState(configuracion.heroSubtitulo ?? "");
  const [textoNosotros, setTextoNosotros] = useState(configuracion.textoNosotros);
  const [textoAdmin, setTextoAdmin] = useState(configuracion.textoAdmin);

  const [faqs, setFaqs] = useState<Faq[]>(faqsIniciales);

  function handleGuardar() {
    iniciarTransicion(async () => {
      try {
        await guardarConfiguracion({
          telefono,
          whatsapp,
          email,
          direccion,
          horarios,
          matricula,
          instagram,
          facebook,
          heroTitulo,
          heroSubtitulo,
          textoNosotros,
          textoAdmin,
        });
        toast.success("Configuración guardada.");
        router.refresh();
      } catch {
        toast.error("No se pudo guardar la configuración.");
      }
    });
  }

  function handleGuardarFaq(index: number) {
    const faqActual = faqs[index];
    if (!faqActual) return;
    const esNueva = faqActual.id.startsWith("nueva-");
    iniciarTransicion(async () => {
      try {
        const resultado = await guardarFaq(esNueva ? null : faqActual.id, {
          pregunta: faqActual.pregunta,
          respuesta: faqActual.respuesta,
          orden: faqActual.orden,
          activa: faqActual.activa,
        });
        setFaqs((prev) =>
          prev.map((f, i) => (i === index ? { ...f, id: resultado.id } : f)),
        );
        toast.success(esNueva ? "FAQ creada." : "FAQ actualizada.");
        router.refresh();
      } catch {
        toast.error("No se pudo guardar la FAQ.");
      }
    });
  }

  function handleEliminarFaq(index: number) {
    const faqActual = faqs[index];
    if (!faqActual) return;
    if (faqActual.id.startsWith("nueva-")) {
      setFaqs((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    iniciarTransicion(async () => {
      try {
        await eliminarFaq(faqActual.id);
        setFaqs((prev) => prev.filter((_, i) => i !== index));
        toast.success("FAQ eliminada.");
        router.refresh();
      } catch {
        toast.error("No se pudo eliminar la FAQ.");
      }
    });
  }

  function actualizarFaq(index: number, campo: keyof Faq, valor: string | number | boolean) {
    setFaqs((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [campo]: valor } : f)),
    );
  }

  function agregarFaq() {
    setFaqs((prev) => [
      ...prev,
      {
        id: `nueva-${Date.now()}`,
        pregunta: "",
        respuesta: "",
        orden: prev.length,
        activa: true,
      },
    ]);
  }

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
          <TabsTrigger
            value="contacto"
            className="rounded-fp-full border border-fp-line bg-white px-4 py-1.5 text-fp-small data-[state=active]:border-fp-navy data-[state=active]:bg-fp-navy data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Contacto
          </TabsTrigger>
          <TabsTrigger
            value="redes"
            className="rounded-fp-full border border-fp-line bg-white px-4 py-1.5 text-fp-small data-[state=active]:border-fp-navy data-[state=active]:bg-fp-navy data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Redes
          </TabsTrigger>
          <TabsTrigger
            value="textos"
            className="rounded-fp-full border border-fp-line bg-white px-4 py-1.5 text-fp-small data-[state=active]:border-fp-navy data-[state=active]:bg-fp-navy data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Textos del sitio
          </TabsTrigger>
          <TabsTrigger
            value="faqs"
            className="rounded-fp-full border border-fp-line bg-white px-4 py-1.5 text-fp-small data-[state=active]:border-fp-navy data-[state=active]:bg-fp-navy data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            FAQs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacto" className="mt-4">
          <div className="rounded-fp-lg border border-fp-line bg-white p-6">
            <h3 className="text-fp-h3 text-fp-navy mb-4">Datos de contacto</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Campo label="Teléfono" value={telefono} onChange={setTelefono} />
              <Campo label="WhatsApp" value={whatsapp} onChange={setWhatsapp} />
              <Campo label="Email" value={email} onChange={setEmail} type="email" />
              <Campo label="Matrícula" value={matricula} onChange={setMatricula} />
              <Campo label="Dirección" value={direccion} onChange={setDireccion} className="sm:col-span-2" />
              <Campo label="Horarios" value={horarios} onChange={setHorarios} className="sm:col-span-2" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="redes" className="mt-4">
          <div className="rounded-fp-lg border border-fp-line bg-white p-6">
            <h3 className="text-fp-h3 text-fp-navy mb-4">Redes sociales</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Campo label="Instagram" value={instagram} onChange={setInstagram} placeholder="@" />
              <Campo label="Facebook" value={facebook} onChange={setFacebook} placeholder="URL del perfil" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="textos" className="mt-4">
          <div className="rounded-fp-lg border border-fp-line bg-white p-6">
            <h3 className="text-fp-h3 text-fp-navy mb-4">Textos del sitio</h3>
            <div className="flex flex-col gap-4">
              <CampoTextarea label="Título del hero" value={heroTitulo} onChange={setHeroTitulo} rows={2} />
              <CampoTextarea label="Subtítulo del hero" value={heroSubtitulo} onChange={setHeroSubtitulo} rows={2} />
              <CampoTextarea label="Texto - Nosotros" value={textoNosotros} onChange={setTextoNosotros} rows={4} />
              <CampoTextarea label="Texto - Administración" value={textoAdmin} onChange={setTextoAdmin} rows={4} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faqs" className="mt-4">
          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <div
                key={faq.id}
                className="rounded-fp-lg border border-fp-line bg-white p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="size-4 text-fp-slate" />
                    <span className="text-fp-label text-fp-slate">
                      FAQ {faq.orden + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-fp-small text-fp-slate">Activa</span>
                      <Switch
                        size="sm"
                        checked={faq.activa}
                        onCheckedChange={(v) => actualizarFaq(i, "activa", v)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-fp-error hover:text-fp-error"
                      onClick={() => handleEliminarFaq(i)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-fp-label text-fp-slate">Pregunta</label>
                    <Input
                      value={faq.pregunta}
                      onChange={(e) => actualizarFaq(i, "pregunta", e.target.value)}
                      placeholder="¿Pregunta frecuente?"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-fp-label text-fp-slate">Respuesta</label>
                    <Textarea
                      value={faq.respuesta}
                      onChange={(e) => actualizarFaq(i, "respuesta", e.target.value)}
                      placeholder="Respuesta..."
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-fp-label text-fp-slate">Orden</label>
                      <Input
                        type="number"
                        value={faq.orden}
                        onChange={(e) => actualizarFaq(i, "orden", Number(e.target.value))}
                        className="w-20"
                        min={0}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="self-end"
                      disabled={pendiente || (!faq.pregunta || !faq.respuesta)}
                      onClick={() => handleGuardarFaq(i)}
                    >
                      {pendiente ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Save className="size-4" />
                      )}
                      Guardar FAQ
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="self-start"
              onClick={agregarFaq}
            >
              <Plus className="size-4" />
              Agregar FAQ
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleGuardar} disabled={pendiente}>
          {pendiente ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Guardar configuración
        </Button>
      </div>
    </div>
  );
}

interface CampoProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}

function Campo({ label, value, onChange, type = "text", placeholder, className }: CampoProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-fp-label text-fp-slate">{label}</label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

interface CampoTextareaProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}

function CampoTextarea({ label, value, onChange, rows = 3 }: CampoTextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-fp-label text-fp-slate">{label}</label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
      />
    </div>
  );
}
