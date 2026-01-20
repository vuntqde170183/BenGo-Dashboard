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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { IconDeviceFloppy, IconPencilDollar, IconX } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { getVehicleIcon } from "@/lib/vehicle-helpers";
import Icon from "@mdi/react";
import { mdiCashEdit } from "@mdi/js";

const getVehicleTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    BIKE: "Xe máy",
    VAN: "Xe tải nhỏ",
    TRUCK: "Xe tải",
  };
  return typeMap[type] || type;
};

export default function PricingPage() {
  const { data: pricingResponse, isLoading, refetch } = usePricing();
  const { mutate: updatePricing, isPending } = useUpdatePricing();
  const [editingVehicle, setEditingVehicle] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (vehicleType: string) => (data: any) => {
    const payload = {
      basePrice: parseFloat(data.basePrice),
      perKm: parseFloat(data.perKm),
      peakHourMultiplier: parseFloat(data.peakHourMultiplier),
    };

    updatePricing(
      { vehicleType, data: payload },
      {
        onSuccess: () => {
          refetch();
          setEditingVehicle(null);
        },
      },
    );
  };

  const handleEdit = (vehicleType: string) => {
    setEditingVehicle(vehicleType);
  };

  const handleCancel = () => {
    setEditingVehicle(null);
    reset();
  };

  // Extract the actual pricing config array from the response
  const pricingConfig = Array.isArray(pricingResponse)
    ? pricingResponse
    : (pricingResponse as any)?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-4 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1">
        <Skeleton className="h-12 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-darkBorderV1">
              <CardHeader className="border-b border-b-darkBorderV1 py-3">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="pt-4">
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {pricingConfig?.map((config: any) => {
          const isEditing = editingVehicle === config.vehicleType;

          return (
            <Card
              key={config.vehicleType || config._id}
              className={`border-darkBorderV1 bg-darkBackgroundV1/20 flex flex-col transition-all duration-300 ${isEditing ? "ring-2 ring-primary/50 lg:col-span-1 shadow-lg" : "hover:border-primary/50"}`}
            >
              <CardHeader className="border-b border-b-darkBorderV1 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {getVehicleIcon(config.vehicleType)}
                    </div>
                    <span className="font-bold text-lg text-primary tracking-tight">
                      {getVehicleTypeLabel(config.vehicleType)}
                    </span>
                  </div>
                  {!isEditing && (
                    <Button
                      size="icon"
                      onClick={() => handleEdit(config.vehicleType)}
                      title="Chỉnh sửa"
                    >
                      <Icon path={mdiCashEdit} size={0.8} />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6 flex-grow">
                {isEditing ? (
                  <form
                    onSubmit={handleSubmit(onSubmit(config.vehicleType))}
                    className="space-y-5"
                  >
                    <div className="space-y-4">
                      <div className="group">
                        <Label
                          htmlFor={`${config.vehicleType}-base`}
                          className="text-xs font-bold uppercase text-neutral-400 group-focus-within:text-primary transition-colors"
                        >
                          Giá cơ bản (VNĐ)
                        </Label>
                        <Input
                          id={`${config.vehicleType}-base`}
                          type="number"
                          defaultValue={config.basePrice}
                          {...register("basePrice", { required: true })}
                          className="mt-1.5 bg-darkBackgroundV1/50 border-darkBorderV1 focus:border-primary/50 transition-all"
                        />
                      </div>
                      <div className="group">
                        <Label
                          htmlFor={`${config.vehicleType}-km`}
                          className="text-xs font-bold uppercase text-neutral-400 group-focus-within:text-primary transition-colors"
                        >
                          Giá mỗi KM (VNĐ)
                        </Label>
                        <Input
                          id={`${config.vehicleType}-km`}
                          type="number"
                          defaultValue={config.perKm}
                          {...register("perKm", { required: true })}
                          className="mt-1.5 bg-darkBackgroundV1/50 border-darkBorderV1 focus:border-primary/50 transition-all"
                        />
                      </div>
                      <div className="group">
                        <Label
                          htmlFor={`${config.vehicleType}-peak`}
                          className="text-xs font-bold uppercase text-neutral-400 group-focus-within:text-primary transition-colors"
                        >
                          Hệ số giờ cao điểm
                        </Label>
                        <Input
                          id={`${config.vehicleType}-peak`}
                          type="number"
                          step="0.1"
                          defaultValue={config.peakHourMultiplier}
                          {...register("peakHourMultiplier", {
                            required: true,
                          })}
                          className="mt-1.5 bg-darkBackgroundV1/50 border-darkBorderV1 focus:border-primary/50 transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <Button type="submit" disabled={isPending}>
                        <IconDeviceFloppy className="w-4 h-4" />
                        {isPending ? "Đang lưu..." : "Lưu thay đổi"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isPending}
                      >
                        <IconX className="w-4 h-4" />
                        Hủy chỉnh sửa
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center py-2 text-center border-b border-darkBorderV1/50 pb-6">
                      <p className="text-sm font-medium text-neutral-400 mb-1 uppercase tracking-widest">
                        Giá cơ bản
                      </p>
                      <p className="text-3xl font-black text-white">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(config.basePrice)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-darkBackgroundV1/40 border border-darkBorderV1/50 flex flex-col items-center justify-center text-center gap-1">
                        <p className="text-xs uppercase font-bold text-neutral-400 tracking-wider mb-1">
                          Giá / KM
                        </p>
                        <p className="font-bold text-white text-sm">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(config.perKm)}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-darkBackgroundV1/40 border border-darkBorderV1/50 flex flex-col items-center justify-center text-center gap-1">
                        <p className="text-xs uppercase font-bold text-neutral-400 tracking-wider mb-1">
                          Hệ số cao điểm
                        </p>
                        <div className="flex justify-between items-center w-full">
                          <p className="font-bold text-primary text-sm italic">
                            x{config.peakHourMultiplier}
                          </p>
                          <span className="text-sm text-green-500 font-medium">
                            +
                            {((config.peakHourMultiplier - 1) * 100).toFixed(0)}
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary/5 rounded-lg p-3 text-center border border-primary/10">
                      <p className="text-sm text-neutral-400 leading-relaxed italic">
                        Áp dụng cấu hình giá tự động dựa trên loại phương tiện{" "}
                        {getVehicleTypeLabel(config.vehicleType).toLowerCase()}.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </motion.div>
    </div>
  );
}
