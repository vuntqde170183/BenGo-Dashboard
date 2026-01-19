import Icon from "@mdi/react";
import { mdiMotorbike, mdiTruck, mdiVanPassenger } from "@mdi/js";
import { Car as CarIcon } from "lucide-react";

export const getVehicleIcon = (type: string) => {
  switch (type) {
    case "BIKE":
      return <Icon path={mdiMotorbike} size={0.9} />;
    case "TRUCK":
      return <Icon path={mdiTruck} size={0.9} />;
    case "VAN":
      return <Icon path={mdiVanPassenger} size={0.9} />;
    default:
      return <CarIcon className="w-4 h-4" />;
  }
};
