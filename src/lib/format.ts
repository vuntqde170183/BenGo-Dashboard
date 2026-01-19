export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return typeof dateString === 'string' ? dateString : "";
  
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatDateOnly = (dateString: string | Date): string => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return typeof dateString === 'string' ? dateString : "";
  
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const formatRelativeTime = (date: string | Date): string => {
  const rtf = new Intl.RelativeTimeFormat('vi-VN', { numeric: 'auto' });
  const diff = new Date(date).getTime() - Date.now();
  const minutes = Math.floor(diff / 60000);
  
  if (Math.abs(minutes) < 60) {
    return rtf.format(minutes, 'minute');
  }
  const hours = Math.floor(minutes / 60);
  if (Math.abs(hours) < 24) {
    return rtf.format(hours, 'hour');
  }
  const days = Math.floor(hours / 24);
  return rtf.format(days, 'day');
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('vi-VN').format(number);
};

export const formatAddress = (address: string): string => {
  if (!address) return "";
  if (address.length < 10) return address;

  return `${address.substring(0, 4)}…${address.substring(address.length - 4)}`;
};

export const shortenText = (text: string, maxLength: number = 100): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const formatArea = (value: number): string => {
  return `${formatNumber(value)} m²`;
};

/**
 * Format currency in abbreviated form (K, M, B, T)
 * Used for dashboard metrics
 */
export const formatAbbreviatedCurrency = (value: string | number) => {
  const num = typeof value === 'string' ? Number.parseFloat(value) : value;
  if (Number.isNaN(num)) return "0";

  if (num >= 1000000000000) {
    return `$${(num / 1000000000000).toFixed(0)}T`;
  } else if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(2)}B`;
  } else if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(2)}K`;
  } else {
    return `$${num.toFixed(2)}`;
  }
};

export const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  const variants: Record<string, any> = {
    PENDING: 'secondary',
    ACCEPTED: 'default',
    PICKED_UP: 'default',
    DELIVERED: 'outline',
    CANCELLED: 'destructive',
    OPEN: 'secondary',
    IN_PROGRESS: 'default',
    RESOLVED: 'outline',
    APPROVED: 'outline',
    LOCKED: 'destructive'
  };
  return variants[status] || 'default';
};

export const getPriorityVariant = (priority: string): "default" | "destructive" | "secondary" => {
  const variants: Record<string, any> = {
    LOW: 'default',
    MEDIUM: 'secondary',
    HIGH: 'destructive',
    URGENT: 'destructive'
  };
  return variants[priority] || 'default';
};
