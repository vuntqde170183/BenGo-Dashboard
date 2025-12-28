import { useOrderDetails } from "@/hooks/useAdmin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MapPin, Package, DollarSign, Calendar } from "lucide-react";
import { formatCurrency, formatDate, getStatusVariant } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export function OrderDetailsDialog({
  isOpen,
  onClose,
  orderId,
}: OrderDetailsDialogProps) {
  const { data: order, isLoading } = useOrderDetails(orderId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order #{order?._id?.slice(-8)}</span>
            {order && (
              <Badge
                variant={getStatusVariant(order.status)}
                className="text-lg px-4 py-2"
              >
                {order.status}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : !order ? (
          <div className="text-center py-8 text-neutral-200">
            Order not found
          </div>
        ) : (
          <div className="space-y-6">
            {/* Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Route Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-neutral-200">
                    Map Integration Coming Soon
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={order.customerId?.avatar} />
                      <AvatarFallback>
                        {order.customerId?.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{order.customerId?.name}</p>
                      <p className="text-sm text-neutral-200">
                        {order.customerId?.phone}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Driver Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Driver</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {order.driverId ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={order.driverId?.avatar} />
                        <AvatarFallback>
                          {order.driverId?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{order.driverId?.name}</p>
                        <p className="text-sm text-neutral-200">
                          {order.driverId?.phone}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-neutral-200">No driver assigned yet</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Route Details */}
            <Card>
              <CardHeader>
                <CardTitle>Route Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Pickup Location</p>
                    <p className="text-sm text-gray-600">
                      {order.pickup?.address}
                    </p>
                    <p className="text-xs text-neutral-200 mt-1">
                      {order.pickup?.lat}, {order.pickup?.lng}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Dropoff Location</p>
                    <p className="text-sm text-gray-600">
                      {order.dropoff?.address}
                    </p>
                    <p className="text-xs text-neutral-200 mt-1">
                      {order.dropoff?.lat}, {order.dropoff?.lng}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="w-4 h-4" />
                    <span>Vehicle Type:</span>
                  </div>
                  <Badge variant="outline">{order.vehicleType}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">{order.distanceKm} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <Badge
                    variant={
                      order.paymentStatus === "PAID" ? "default" : "secondary"
                    }
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Created At:</span>
                  </div>
                  <span className="font-medium">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-lg font-bold">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Total:</span>
                  </div>
                  <span>{formatCurrency(order.totalPrice)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Goods Images */}
            {order.goodsImages && order.goodsImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Goods Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {order.goodsImages.map((img: string, idx: number) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Goods ${idx + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {order.note && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{order.note}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
