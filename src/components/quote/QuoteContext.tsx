import { createContext, useContext, useState, type ReactNode } from "react";
import { QuoteModal } from "./QuoteModal";

interface QuoteCtx {
  open: () => void;
}

const Ctx = createContext<QuoteCtx | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Ctx.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <QuoteModal open={open} onOpenChange={setOpen} />
    </Ctx.Provider>
  );
}

export function useQuote() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useQuote must be used inside QuoteProvider");
  return c;
}
