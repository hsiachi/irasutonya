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
  if (msg.images) {
    console.log(msg.images[0]);
  }
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
        {msg.images && (
          <div className="flex relative overflow-auto h-64 items-center">
            {msg.images?.map((img, key) => (
              <Image
                src={`/data/${img.url}`}
                alt="image"
                width={200}
                height={200}
                key={key}
                className="rounded-2xl p-2 h-48 w-auto"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
