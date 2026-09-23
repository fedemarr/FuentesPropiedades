"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { formatearNumero } from "@/lib/formato";

interface InputPrecioProps {
  id?: string;
  value: number | undefined;
  onChange: (valor: number | undefined) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

/** Input de precio/expensas con separador de miles a la argentina.
 *
 * Bug real que hizo que un alquiler de $550.000 se guardara como $550: un
 * <input type="number"> nativo interpreta el "." siempre como coma
 * decimal — es el estándar HTML, no depende del idioma del navegador. Acá
 * en Argentina el punto se usa para miles, así que "550.000" tipeado en un
 * input nativo se guarda como quinientos cincuenta (550.000 = 550 con tres
 * decimales en cero).
 *
 * Este input muestra el número con puntos de miles cuando no tiene foco, y
 * mientras se escribe ignora cualquier "." o "," — son solo separadores
 * visuales, el precio siempre es un entero. */
export function InputPrecio({
  id,
  value,
  onChange,
  onBlur,
  disabled,
  placeholder,
}: InputPrecioProps) {
  const [enFoco, setEnFoco] = useState(false);
  const [textoEditando, setTextoEditando] = useState("");

  const valorMostrado = enFoco
    ? textoEditando
    : value === undefined
      ? ""
      : formatearNumero(value);

  return (
    <Input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      disabled={disabled}
      placeholder={placeholder}
      value={valorMostrado}
      onFocus={() => {
        setTextoEditando(value === undefined ? "" : String(value));
        setEnFoco(true);
      }}
      onChange={(e) => {
        const soloDigitos = e.target.value.replace(/\D/g, "");
        setTextoEditando(soloDigitos);
        onChange(soloDigitos === "" ? undefined : Number(soloDigitos));
      }}
      onBlur={() => {
        setEnFoco(false);
        onBlur?.();
      }}
    />
  );
}
