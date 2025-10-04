import { motion } from "framer-motion";
import { FC } from "react";

interface ShapeProps {
  className?: string;
}

export const Shape: FC<ShapeProps> = ({ className }) => (
  <motion.div
    className={`${className} relative w-[100px] h-[100px] shadow-2xl overflow-hidden`}
    style={{
      backgroundColor: "#ffffff",
    }}
    animate={{ y: [0, -10, 0], rotate: 45 }}
    transition={{
      duration: 1,
      ease: "easeInOut",
    }}
  >
    {/*  */}
  </motion.div>
);
