import { Link, useLocation } from "wouter";
import { Home, Receipt, ShoppingCart, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location] = useLocation();

  const links = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/pedidos", icon: Receipt, label: "Pedidos" },
    { href: "/carrinho", icon: ShoppingCart, label: "Carrinho" },
    { href: "/carteira", icon: Wallet, label: "Carteira" },
    { href: "/perfil", icon: User, label: "Perfil" },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-white/5 pb-safe z-50">
      <div className="flex items-center justify-around p-3 pb-6">
        {links.map((link) => {
          const isActive = location === link.href;
          const Icon = link.icon;
          
          return (
            <Link key={link.href} href={link.href}>
              <div className="flex flex-col items-center gap-1 cursor-pointer">
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                )}>
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {link.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}