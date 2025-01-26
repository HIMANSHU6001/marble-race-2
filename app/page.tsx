import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Link href="/game" className="text-7xl font-bebas-neue font-bold">Start</Link>
    </div>
  );
}
