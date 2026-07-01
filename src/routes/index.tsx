import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "NayePankh Foundation — Empowering Youth, Transforming Lives" },
      {
        name: "description",
        content:
          "NayePankh Foundation nurtures ambitious young minds with real-world skills, mentorship, and community impact projects.",
      },
      { property: "og:title", content: "NayePankh Foundation" },
      {
        property: "og:description",
        content: "Empowering Youth, Transforming Lives — internships, mentorship, and impact.",
      },
    ],
  }),
});

function Index() {
  useEffect(() => {
    window.location.replace("/site/index.html");
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui" }}>
      <p>Loading NayePankh Foundation…</p>
    </div>
  );
}
