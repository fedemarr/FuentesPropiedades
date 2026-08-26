"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { waLink, waMensajeGeneral } from "@/lib/whatsapp";

interface BotonWhatsappProps {
  numero?: string;
  mensaje?: string;
}

export function BotonWhatsapp({
  numero = "5491112345678",
  mensaje,
}: BotonWhatsappProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <motion.a
      href={waLink(numero, mensaje ?? waMensajeGeneral())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-fp-navy text-white shadow-lg transition-transform hover:scale-110 hover:bg-fp-navy-900"
    >
      <MessageCircle className="h-6 w-6" />
    </motion.a>
  );
}
