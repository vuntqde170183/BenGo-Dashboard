import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon } from "@mdi/react";
import { mdiTrendingUp } from "@mdi/js";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: string;
    href: string;
}

export default function MetricCard({
    icon,
    title,
    value,
    subtitle,
    trend,
    href,
}: MetricCardProps) {
    return (
        <Link to={href} className="h-full block">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="h-full"
            >
                <Card className="h-full bg-gradient-to-br from-darkCardV1 via-darkCardV1 to-primary/10 border-primary/20 transition-all duration-300">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 flex flex-col gap-2">
                                <p className="text-sm uppercase text-nowrap truncate font-medium text-neutral-400">
                                    {title}
                                </p>
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-bold mt-2">{value}</h3>
                                    <div className="p-3 rounded-full bg-darkBorderV1 text-neutral-300">
                                        {icon}
                                    </div>
                                </div>
                                {subtitle && <p className="text-sm text-primary">{subtitle}</p>}
                                {trend && (
                                    <div className="flex items-center gap-1 text-primary text-sm text-nowrap">
                                        <Icon path={mdiTrendingUp} size={0.8} />
                                        <span>{trend}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </Link>
    );
}
