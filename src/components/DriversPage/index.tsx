import { useState } from "react";
import { useAdminDrivers } from "@/hooks/useAdmin";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Car as CarIcon } from "lucide-react";
import { getStatusVariant } from "@/lib/formatters";

export default function DriversPage() {
  const [status, setStatus] = useState<string>("ALL");
  const { data, isLoading } = useAdminDrivers({
    status: status === "ALL" ? undefined : status,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Driver Management</h1>
        <p className="text-neutral-200 mt-1">
          Manage all drivers in the system
        </p>
      </div>

      <Tabs value={status} onValueChange={setStatus}>
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="APPROVED">Active</TabsTrigger>
          <TabsTrigger value="PENDING_APPROVAL">Pending</TabsTrigger>
          <TabsTrigger value="LOCKED">Blocked</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="text-center py-12 text-neutral-200">
          Loading drivers...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data?.map((driver: any) => (
            <Card
              key={driver._id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={driver.userId?.avatar} />
                      <AvatarFallback>
                        {driver.userId?.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{driver.userId?.name}</h3>
                      <p className="text-sm text-neutral-200">
                        {driver.plateNumber}
                      </p>
                    </div>
                  </div>
                  <Badge variant={driver.isOnline ? "default" : "secondary"}>
                    {driver.isOnline ? "Online" : "Offline"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-200">Vehicle:</span>
                    <div className="flex items-center gap-1">
                      <CarIcon className="w-4 h-4" />
                      <span className="font-medium">{driver.vehicleType}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-200">Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {driver.userId?.rating || 5}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-200">Status:</span>
                    <Badge variant={getStatusVariant(driver.status)}>
                      {driver.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && data?.data?.length === 0 && (
        <div className="text-center py-12 text-neutral-200">
          No drivers found
        </div>
      )}
    </div>
  );
}
