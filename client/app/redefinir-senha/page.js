import { Suspense } from "react";
import RedefinirSenha from "./redefinirSenha";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RedefinirSenha />
    </Suspense>
  );
}