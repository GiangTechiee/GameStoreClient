import { FaWindows, FaPlaystation, FaXbox, FaApple, FaAndroid } from "react-icons/fa";
import { SiNintendoswitch } from "react-icons/si";

const platformIcons = {
  PC: <FaWindows className="text-blue-500" />,
  PS: <FaPlaystation className="text-blue-700" />,
  Xbox: <FaXbox className="text-green-500" />,
  NS: <SiNintendoswitch className="text-red-500" />,
  iOS: <FaApple className="text-gray-700" />,
  Android: <FaAndroid className="text-green-600" />,
};

const PlatformIcons = ({ platforms }) => {
  if (!platforms) return null;
  const platformList = platforms.split(',').map((p) => p.trim());
  return (
    <span className="flex gap-2">
      {platformList.map((platform) => (
        <span key={platform} title={platform}>
          {platformIcons[platform] || <span>{platform}</span>}
        </span>
      ))}
    </span>
  );
};

export default PlatformIcons;