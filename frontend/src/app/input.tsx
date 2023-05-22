import Image from "next/image";

export default function Input() {
  return (
    <div className="w-full p-8 flex">
      <div className="flex-1 mx-4">
        <input
          type="text"
          className="w-full caret-gray-600 focus:outline-0 px-2 -py-2 border-b-8 font-handwriting text-4xl"
          placeholder="Search..."
        />
      </div>

      <button className="rounded-lg -mb-2 p-2 font-handwriting hover:cursor-pointer transition hover:rotate-12">
        <Image
          src="/images/airplane6_blue.png"
          alt="search"
          width="80"
          height="80"
        />
      </button>
    </div>
  );
}
