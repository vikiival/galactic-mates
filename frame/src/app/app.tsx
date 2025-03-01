"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react"

const Demo = dynamic(() => import("~/components/Form"), {
  ssr: false,
});

export default function App(
  { title }: { title?: string } = { title: "Frames v2 Demo" }
) {
  const [seed, setSeed] = useState<number>(0);

  useEffect(() => {
    fetch("/api/orbitport")
      .then((res) => res.json())
      .then((data) => setSeed(data.seed));
  }, []);

  return <Demo seed={seed} />;
}
