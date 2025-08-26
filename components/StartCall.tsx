import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";
import { toast } from "sonner";
import FloatingElements from "./FloatingElements";

export default function StartCall({ configId, accessToken }: { configId?: string, accessToken: string }) {
  const { status, connect, sendToolMessage } = useVoice();

  return (
    <AnimatePresence>
      {status.value !== "connected" ? (
        <>
          <FloatingElements />
          <motion.div
            className={"fixed inset-0 p-4 flex items-center justify-center bg-background"}
            initial="initial"
            animate="enter"
            exit="exit"
            variants={{
              initial: { opacity: 0 },
              enter: { opacity: 1 },
              exit: { opacity: 0 },
            }}
          >
          <AnimatePresence>
            <motion.div
              className="flex flex-col items-center justify-center"
              variants={{
                initial: { scale: 0.5 },
                enter: { scale: 1 },
                exit: { scale: 0.5 },
              }}
            >
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <motion.h2
                  className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(16, 185, 129, 0)",
                      "0 0 20px rgba(16, 185, 129, 0.3)",
                      "0 0 0px rgba(16, 185, 129, 0)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Ready to Connect?
                </motion.h2>
                <motion.p
                  className="text-gray-600 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  Start your conversation with Health Talk AI
                </motion.p>
                <motion.div
                  className="flex justify-center items-center gap-2 mt-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 text-emerald-500"
                  >
                    ✨
                  </motion.div>
                  <span className="text-sm text-emerald-600 font-medium">
                    Powered by empathic AI
                  </span>
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 text-teal-500"
                  >
                    💚
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <Button
                  className={"z-50 flex items-center gap-3 rounded-full px-8 py-6 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"}
                onClick={() => {
                  connect({
                    auth: { type: "accessToken", value: accessToken },
                    configId,
                  })
                    .then(() => {
                      // Expose sendToolMessage for tool responses as per Hume docs
                      (window as any)._humeSendToolMessage = sendToolMessage;
                      console.log('🔗 EVI connected');
                    })
                    .catch(() => {
                      toast.error("Unable to start call");
                    });
                }}
              >
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Phone
                    className={"size-4 fill-current"}
                    strokeWidth={0}
                  />
                </div>
                <span>Start Conversation</span>
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
