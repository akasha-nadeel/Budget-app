import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  PlusCircle, 
  Wallet, 
  TrendingUp, 
  Utensils, 
  Shirt, 
  HelpCircle,
  AlertCircle,
  Banknote,
  Landmark,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  LayoutList,
  GraduationCap,
  Car,
  Heart
} from 'lucide-react';

export const IconDashboard = ({ className }: { className?: string }) => <LayoutDashboard className={className} />;
export const IconCalendar = ({ className }: { className?: string }) => <CalendarDays className={className} />;
export const IconPlus = ({ className }: { className?: string }) => <PlusCircle className={className} />;
export const IconWallet = ({ className }: { className?: string }) => <Wallet className={className} />;
export const IconTrend = ({ className }: { className?: string }) => <TrendingUp className={className} />;
export const IconFood = ({ className }: { className?: string }) => <Utensils className={className} />;
export const IconClothes = ({ className }: { className?: string }) => <Shirt className={className} />;
export const IconOther = ({ className }: { className?: string }) => <HelpCircle className={className} />;
export const IconAlert = ({ className }: { className?: string }) => <AlertCircle className={className} />;
export const IconCash = ({ className }: { className?: string }) => <Banknote className={className} />;
export const IconBank = ({ className }: { className?: string }) => <Landmark className={className} />;
export const IconCard = ({ className }: { className?: string }) => <CreditCard className={className} />;
export const IconLeft = ({ className }: { className?: string }) => <ChevronLeft className={className} />;
export const IconRight = ({ className }: { className?: string }) => <ChevronRight className={className} />;
export const IconAI = ({ className }: { className?: string }) => <Sparkles className={className} />;
export const IconSun = ({ className }: { className?: string }) => <Sun className={className} />;
export const IconMoon = ({ className }: { className?: string }) => <Moon className={className} />;
export const IconCategory = ({ className }: { className?: string }) => <LayoutList className={className} />;
export const IconSchool = ({ className }: { className?: string }) => <GraduationCap className={className} />;
export const IconTransport = ({ className }: { className?: string }) => <Car className={className} />;
export const IconHeart = ({ className }: { className?: string }) => <Heart className={className} />;