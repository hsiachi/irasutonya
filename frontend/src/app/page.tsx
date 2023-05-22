import Image from "next/image";
import Input from "./input";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-between py-24">
      <div className="relative flex flex-col justify-between h-full container rounded-3xl bg-white">
        <div className="relative text-center py-8">
          <h1 className={`text-6xl font-bold font-handwriting relative inline`}>
            irasutoya
            <Image
              src="/images/cat_fish_run.png"
              alt="search"
              width="60"
              height="60"
              className="absolute right-0 top-0 -mr-16"
            />
          </h1>
        </div>
        <div className="">
          <Input />
        </div>
      </div>
    </main>
  );
}
