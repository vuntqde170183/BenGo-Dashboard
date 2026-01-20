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
import { IconCar, IconDeviceFloppy } from "@tabler/icons-react";
import { useForm } from "react-hook-form";

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
      <div className="space-y-4 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1">
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
    <div className="space-y-4 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">
              Bảng điều khiển
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Cấu hình giá</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            {pricingConfig?.map((config: any) => (
              <Card key={config.vehicleType || config._id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconCar className="w-5 h-5" />
                    {config.vehicleType}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`${config.vehicleType}-base`}>
                        Giá cơ bản (VNĐ)
                      </Label>
                      <Input
                        id={`${config.vehicleType}-base`}
                        type="number"
                        defaultValue={config.basePrice}
                        {...register(`${config.vehicleType}.basePrice`)}
                        className="mt-1"
                      />
                      <p className="text-sm text-neutral-200 mt-1">
                        Giá khởi điểm cho loại xe này
                      </p>
                    </div>
                    <div>
                      <Label htmlFor={`${config.vehicleType}-km`}>
                        Giá mỗi KM (VNĐ)
                      </Label>
                      <Input
                        id={`${config.vehicleType}-km`}
                        type="number"
                        defaultValue={config.perKm}
                        {...register(`${config.vehicleType}.perKm`)}
                        className="mt-1"
                      />
                      <p className="text-sm text-neutral-200 mt-1">
                        Chi phí trên mỗi kilomet di chuyển
                      </p>
                    </div>
                    <div>
                      <Label htmlFor={`${config.vehicleType}-peak`}>
                        Hệ số giờ cao điểm
                      </Label>
                      <Input
                        id={`${config.vehicleType}-peak`}
                        type="number"
                        step="0.1"
                        defaultValue={config.peakHourMultiplier}
                        {...register(
                          `${config.vehicleType}.peakHourMultiplier`,
                        )}
                        className="mt-1"
                      />
                      <p className="text-sm text-neutral-200 mt-1">
                        Hệ số giá tăng cường (vd: 1.5 = tăng 50%)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => refetch()}>
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              <IconDeviceFloppy className="w-4 h-4 mr-2" />
              {isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
