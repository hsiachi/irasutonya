import { Message } from "@/types/conversation";
import classNames from "classnames";
import Image from "next/image";

export default function Message({ msg }: { msg: Message }) {
  const isRobot = msg.role === "bot";
  const avatarUrl =
    msg.role === "bot"
      ? "/images/pet_robot_cat.png"
      : "/images/drink_tapioka_tea_schoolboy.png";
  const Avatar = () => (
    <Image
      src={avatarUrl}
      alt="avatar"
      width="60"
      height="60"
      className="flex-grow-0"
    />
  );
  return (
    <div
      className={classNames(
        isRobot ? "justify-start" : "flex-row-reverse",
        "flex px-4 my-6 items-start font-sans text-xl"
      )}
    >
      <Avatar />
      <div
        className={classNames(
          isRobot ? "mx-2 bg-gray-100" : "bg-blue-200",
          "mt-2 max-w-xl px-4 py-2 rounded-lg"
        )}
      >
        <div>{msg.text}</div>
        <div>
          {msg.images?.map((img, key) => (
            <Image
              src={`/data/${img}`}
              alt="image"
              width="200"
              height="200"
              key={key}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
