import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useAuth";

interface DashboardHeaderProps {
  title: string;
  username?: string;
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardHeader({
  title,
  username: propUsername,
}: DashboardHeaderProps) {
  const { data: userProfile } = useProfile();
  const username = propUsername || userProfile?.data?.name || "User";

  return (
    <motion.div
      variants={item}
      initial="hidden"
      animate="show"
      className="relative bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 py-8 min-h-[100px] overflow-visible"
    >
      {/* Background Image */}
      <img
        src="/images/circle-scatter-haikei.svg"
        alt="Background pattern"
        className="absolute inset-0 object-cover opacity-20 z-0"
      />

      {/* Robot Image */}
      <img
        src="/images/robot1.webp"
        alt="Robot"
        width={1000}
        height={1000}
        draggable={false}
        loading="eager"
        className="absolute bottom-0 right-0 h-[200px] w-auto object-contain z-10"
      />

      {/* Content */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="dark:text-neutral-200">
            Welcome, Admin{" "}
            <span className="font-semibold text-green-600">{username}</span> -
            System Overview & Analytics
          </p>
        </div>
      </div>
    </motion.div>
  );
}
