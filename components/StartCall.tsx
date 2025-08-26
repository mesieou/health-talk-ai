import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";
import { toast } from "sonner";

export default function StartCall({ configId, accessToken }: { configId?: string, accessToken: string }) {
  const { status, connect, sendToolMessage } = useVoice();

  return (
    <AnimatePresence>
      {status.value !== "connected" ? (
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
              variants={{
                initial: { scale: 0.5 },
                enter: { scale: 1 },
                exit: { scale: 0.5 },
              }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Connect?</h2>
                <p className="text-gray-600">Start your conversation with Health Talk AI</p>
              </div>
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
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
