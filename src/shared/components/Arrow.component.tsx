import { motion } from "framer-motion";
import { FC } from "react";

interface ArrowProps {
  className?: string;
}

export const Arrow: FC<ArrowProps> = ({ className }) => {
  const arrows = [0, 1, 2];
  return (
    <div className={className}>
      {arrows.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: [0, 1, 1], x: [0, 20, 1] }}
          transition={{
            duration: 2,
            repeat: 1,
            delay: index * 0.2,
          }}
          style={{
            marginBottom: index * 3,
            marginLeft: index * 18,
            rotate: 5,
          }}
        >
          <div className="w-4 h-4 border-b-2 border-r-2 border-transparent [border-image:linear-gradient(to_bottom_right,#ff0000,#ff00fb,#ff00ff)_1]"></div>
        </motion.div>
      ))}
    </div>
  );
};
