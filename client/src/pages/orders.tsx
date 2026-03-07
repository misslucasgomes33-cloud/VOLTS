import { useState, useEffect } from "react";
import { Receipt, Clock, MapPin, Zap, Package } from "lucide-react";
import { useAuth } from "@/lib/auth";
import pizzaImg from '@/assets/pizza.png';

interface Order {
  id: number;
  status: string;
  total: string;
  deliveryAddress: string | null;
  createdAt: string | null;
  restaurantId: number;
}

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  preparing: "Preparando",
  ready: "Pronto",
  picked_up: "A caminho",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  confirmed: "bg-blue-500/10 text-blue-500",
  preparing: "bg-orange-500/10 text-orange-500",
  ready: "bg-green-500/10 text-green-500",
  picked_up: "bg-primary/10 text-primary",
  delivered: "bg-zinc-500/10 text-zinc-400",
  cancelled: "bg-red-500/10 text-red-500",
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/orders?customerId=${user.id}`)
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [user]);

  const activeOrders = orders.filter(o => !["delivered", "cancelled"].includes(o.status));
  const pastOrders = orders.filter(o => ["delivered", "cancelled"].includes(o.status));

  return (
    <div className="flex flex-col min-h-full pb-24">
      <div className="bg-zinc-950 px-5 pt-8 pb-4 sticky top-0 z-40 border-b border-white/5">
        <h1 className="text-xl font-display font-bold text-white">Seus Pedidos</h1>
      </div>

      <div className="p-5 space-y-6">
        {activeOrders.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Em andamento</h2>
            {activeOrders.map(order => (
              <div key={order.id} className="bg-zinc-900 border border-primary/30 rounded-2xl p-4 shadow-[0_0_15px_rgba(255,204,0,0.05)] mb-3">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                      <img src={pizzaImg} alt="Pedido" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Pedido #{order.id}</h3>
                      <p className="text-xs text-zinc-400">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString("pt-BR") : "Agora"}
                      </p>
                    </div>
                  </div>
                  <div className={`${statusColors[order.status] || "bg-zinc-800 text-zinc-400"} px-2 py-1 rounded text-xs font-bold flex items-center gap-1`}>
                    <Zap className="w-3 h-3" fill="currentColor" />
                    {statusLabels[order.status] || order.status}
                  </div>
                </div>

                <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/5">
                  {["confirmed", "preparing", "ready", "picked_up"].map((step, idx) => {
                    const stepOrder = ["confirmed", "preparing", "ready", "picked_up"];
                    const currentIdx = stepOrder.indexOf(order.status);
                    const isActive = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;
                    return (
                      <div key={step} className="flex items-start gap-3 relative">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 z-10 ${isCurrent ? "bg-primary shadow-[0_0_8px_rgba(255,204,0,0.8)] animate-pulse" : isActive ? "bg-primary" : "bg-zinc-700"}`} />
                        {idx < 3 && <div className="absolute left-[3px] top-3 bottom-[-12px] w-[2px] bg-zinc-800" />}
                        <p className={`text-sm font-medium ${isActive ? "text-white" : "text-zinc-500"}`}>
                          {statusLabels[step]}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between text-sm">
                  <span className="text-zinc-400 flex items-center gap-1"><MapPin className="w-3 h-3"/> {order.deliveryAddress || "Endereço"}</span>
                  <span className="text-white font-bold">R$ {order.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {pastOrders.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Anteriores</h2>
            <div className="space-y-3">
              {pastOrders.map(order => (
                <div key={order.id} data-testid={`card-order-${order.id}`} className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-sm">Pedido #{order.id}</h3>
                      <p className="text-xs text-zinc-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("pt-BR") : ""} • {statusLabels[order.status]}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">R$ {order.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-white/5">
              <Package className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Nenhum pedido ainda</h3>
            <p className="text-zinc-500 text-sm max-w-[250px]">Seus pedidos aparecerão aqui assim que você fizer o primeiro!</p>
          </div>
        )}
      </div>
    </div>
  );
}
