import { usePricing, useUpdatePricing } from "@/hooks/useAdmin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Car, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function PricingPage() {
  const { data: pricingConfig, isLoading, refetch } = usePricing();
  const { mutate: updatePricing, isPending } = useUpdatePricing();

  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    updatePricing(data, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 bg-white p-4 rounded-lg border border-lightBorderV1">
        <Skeleton className="h-12 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white p-4 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pricing Configuration</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {pricingConfig?.map((config: any) => (
              <Card key={config.vehicleType || config._id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    {config.vehicleType}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`${config.vehicleType}-base`}>
                        Base Price (VND)
                      </Label>
                      <Input
                        id={`${config.vehicleType}-base`}
                        type="number"
                        defaultValue={config.basePrice}
                        {...register(`${config.vehicleType}.basePrice`)}
                        className="mt-1"
                      />
                      <p className="text-xs text-neutral-200 mt-1">
                        Starting fare for this vehicle type
                      </p>
                    </div>
                    <div>
                      <Label htmlFor={`${config.vehicleType}-km`}>
                        Price per KM (VND)
                      </Label>
                      <Input
                        id={`${config.vehicleType}-km`}
                        type="number"
                        defaultValue={config.perKm}
                        {...register(`${config.vehicleType}.perKm`)}
                        className="mt-1"
                      />
                      <p className="text-xs text-neutral-200 mt-1">
                        Cost per kilometer traveled
                      </p>
                    </div>
                    <div>
                      <Label htmlFor={`${config.vehicleType}-peak`}>
                        Peak Hour Multiplier
                      </Label>
                      <Input
                        id={`${config.vehicleType}-peak`}
                        type="number"
                        step="0.1"
                        defaultValue={config.peakHourMultiplier}
                        {...register(
                          `${config.vehicleType}.peakHourMultiplier`
                        )}
                        className="mt-1"
                      />
                      <p className="text-xs text-neutral-200 mt-1">
                        Surge pricing multiplier (e.g., 1.5 = 50% increase)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => refetch()}>
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-mainTextHoverV1 hover:bg-primary/90 text-neutral-200"
            >
              <Save className="w-4 h-4 mr-2" />
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
