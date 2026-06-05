import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prefeitura Digital 360 — MK Audiovisual" },
      {
        name: "description",
        content:
          "Transformando cidadãos em divulgadores oficiais do município. Plataforma 360° + Totem Fotográfico para eventos públicos.",
      },
      { property: "og:title", content: "Prefeitura Digital 360 — MK Audiovisual" },
      {
        property: "og:description",
        content: "Marketing orgânico em massa para a sua gestão municipal.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/apresentacao.html");
  }, []);
  return (
    <div style={{ minHeight: "100vh", background: "#05070d", color: "#f5b324", display: "grid", placeItems: "center", fontFamily: "sans-serif" }}>
      Carregando apresentação…
    </div>
  );
}
