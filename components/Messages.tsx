"use client";
import { cn } from "@/utils";
import { useVoice } from "@humeai/voice-react";
import Expressions from "./Expressions";
import { AnimatePresence, motion } from "motion/react";
import { ComponentRef, forwardRef } from "react";

const Messages = forwardRef<
  ComponentRef<typeof motion.div>,
  Record<never, never>
>(function Messages(_, ref) {
  const { messages } = useVoice();

  return (
    <motion.div
      layoutScroll
      className={"grow overflow-auto p-4 pt-32"}
      ref={ref}
    >
      <motion.div
        className={"max-w-2xl mx-auto w-full flex flex-col gap-4 pb-24"}
      >
        <AnimatePresence mode={"popLayout"}>
          {messages.map((msg, index) => {
            if (
              msg.type === "user_message" ||
              msg.type === "assistant_message"
            ) {
              return (
                <motion.div
                  key={msg.type + index}
                  className={cn(
                    "w-[80%]",
                    "border rounded-2xl shadow-sm",
                    msg.type === "user_message"
                      ? "ml-auto bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-300"
                      : "bg-white border-gray-200"
                  )}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 0,
                  }}
                >
                  <div className={"flex items-center justify-between pt-4 px-4"}>
                    <div
                      className={cn(
                        "text-xs capitalize font-medium leading-none tracking-tight",
                        msg.type === "user_message" ? "text-white/70" : "text-gray-500"
                      )}
                    >
                      {msg.message.role === "user" ? "You" : "Health Talk AI"}
                    </div>
                    <div
                      className={cn(
                        "text-xs font-medium leading-none tracking-tight",
                        msg.type === "user_message" ? "text-white/70" : "text-gray-500"
                      )}
                    >
                      {msg.receivedAt.toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                        second: undefined,
                      })}
                    </div>
                  </div>
                  <div className={cn(
                    "pb-4 px-4 leading-relaxed",
                    msg.type === "user_message" ? "text-white" : "text-gray-800"
                  )}>{msg.message.content}</div>
                  <Expressions values={{ ...msg.models.prosody?.scores }} />
                </motion.div>
              );
            }

            return null;
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

export default Messages;
