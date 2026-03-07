import { ArrowLeft, MapPin, Zap, QrCode, CreditCard, Loader2, Copy, Check, X, AlertTriangle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

import burgerImg from '@/assets/burger.png';

export default function Cart() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [deliveryType, setDeliveryType] = useState("portaria");
  const [doorFee, setDoorFee] = useState([5]);
  const [isFastDelivery, setIsFastDelivery] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card">("pix");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const subtotal = 38.90;
  const baseFastDeliveryFee = 12.00;
  const standardDeliveryFee = 0;
  
  let deliveryFee = 0;
  if (isFastDelivery) {
    deliveryFee += baseFastDeliveryFee;
  } else {
    deliveryFee += standardDeliveryFee;
  }
  if (deliveryType === "porta") {
    deliveryFee += doorFee[0];
  }
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    if (!user) {
      toast({ title: "Faça login para continuar", variant: "destructive" });
      return;
    }
    setShowPayment(true);
  };

  const processOrderPayment = async () => {
    if (!user) return;
    setPaymentLoading(true);
    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: user.id,
          restaurantId: "placeholder",
          total: subtotal.toString(),
          deliveryFee: deliveryFee.toString(),
          deliveryAddress: deliveryType === "porta" ? "Entrega na porta" : "Entrega na portaria",
          notes: isFastDelivery ? "Entrega Flash" : "",
        }),
      });
      const order = await orderRes.json();

      const payRes = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          userId: user.id,
          paymentMethod,
        }),
      });
      const payData = await payRes.json();
      setPaymentResult(payData);

      if (payData.simulatedPayment) {
        toast({ title: "Pagamento criado em modo simulação" });
      }
    } catch (error: any) {
      toast({ title: error.message || "Erro ao processar", variant: "destructive" });
    } finally {
      setPaymentLoading(false);
    }
  };

  const simulateApproval = async () => {
    if (!paymentResult?.transactionId) return;
    setPaymentLoading(true);
    try {
      await fetch("/api/payments/simulate-approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: paymentResult.transactionId }),
      });
      toast({ title: "Pagamento aprovado! Pedido confirmado." });
      setShowPayment(false);
      setPaymentResult(null);
      setLocation("/pedidos");
    } catch {
      toast({ title: "Erro ao simular aprovação", variant: "destructive" });
    } finally {
      setPaymentLoading(false);
    }
  };

  const copyPixCode = () => {
    if (paymentResult?.pixQrCode) {
      navigator.clipboard.writeText(paymentResult.pixQrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-32">
      <div className="bg-zinc-950 px-5 pt-8 pb-4 sticky top-0 z-40 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => setLocation("/home")} className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5 text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-display font-bold text-white">Carrinho</h1>
        <div className="w-10 h-10"></div>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-4 pb-6 border-b border-white/5">
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
            <img src={burgerImg} alt="Volt Burger" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-base">Volt Burger</h3>
            <p className="text-sm text-zinc-400">1x Double Smash Premium</p>
            <p className="font-semibold text-primary mt-1">R$ 38,90</p>
          </div>
        </div>

        <div className="py-6 border-b border-white/5">
           <h3 className="font-bold text-white mb-4 flex items-center gap-2">
             <Zap className="w-4 h-4 text-primary" />
             Velocidade de Entrega
           </h3>
           <div className="grid grid-cols-2 gap-3">
             <div 
               onClick={() => setIsFastDelivery(false)}
               className={`p-3 rounded-xl border cursor-pointer transition-colors ${!isFastDelivery ? 'bg-primary/10 border-primary/50 text-white' : 'bg-zinc-900 border-white/5 text-zinc-400'}`}
             >
               <span className="block font-bold text-sm mb-1">Padrão</span>
               <span className="block text-xs">30-45 min</span>
               <span className="block text-xs font-bold mt-2 text-primary">Grátis</span>
             </div>
             <div 
               onClick={() => setIsFastDelivery(true)}
               className={`p-3 rounded-xl border cursor-pointer transition-colors ${isFastDelivery ? 'bg-primary/10 border-primary/50 text-white' : 'bg-zinc-900 border-white/5 text-zinc-400'}`}
             >
               <span className="block font-bold text-sm mb-1 text-primary flex items-center gap-1"><Zap className="w-3 h-3" fill="currentColor"/> Flash</span>
               <span className="block text-xs">15-20 min</span>
               <span className="block text-xs font-bold mt-2">+ R$ 12,00</span>
             </div>
           </div>
        </div>

        <div className="py-6 border-b border-white/5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Opções de Entrega Local
          </h3>
          
          <RadioGroup value={deliveryType} onValueChange={setDeliveryType} className="space-y-3">
            <div className="flex items-center space-x-3 bg-zinc-900 p-4 rounded-xl border border-white/5 has-[[data-state=checked]]:border-primary/50 has-[[data-state=checked]]:bg-primary/5 transition-all">
              <RadioGroupItem value="portaria" id="portaria" className="text-primary border-zinc-600" />
              <Label htmlFor="portaria" className="flex-1 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Entregar na portaria (padrão)</span>
                  <span className="text-primary text-sm font-semibold">Grátis</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">Você desce para buscar</p>
              </Label>
            </div>
            
            <div className="flex flex-col space-y-3 bg-zinc-900 p-4 rounded-xl border border-white/5 has-[[data-state=checked]]:border-primary/50 has-[[data-state=checked]]:bg-primary/5 transition-all">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="porta" id="porta" className="text-primary border-zinc-600" />
                <Label htmlFor="porta" className="flex-1 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white text-sm">Entregar na porta do apto / condomínio</span>
                    <span className="text-white text-sm font-semibold whitespace-nowrap">+ R$ {doorFee[0]},00</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">O entregador entra e vai até você</p>
                </Label>
              </div>

              {deliveryType === "porta" && (
                <div className="pt-4 border-t border-white/5 mt-2 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-zinc-300">Defina a taxa (caixinha)</span>
                    <span className="text-primary font-bold bg-primary/10 px-2 py-1 rounded-md text-sm">R$ {doorFee[0]},00</span>
                  </div>
                  <Slider 
                    defaultValue={[5]} 
                    min={5} 
                    max={13} 
                    step={1}
                    value={doorFee}
                    onValueChange={setDoorFee}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2 text-[10px] text-zinc-500 font-medium">
                    <span>Mínimo R$ 5</span>
                    <span>Máximo R$ 13</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-3 text-center bg-black/20 p-2 rounded-lg border border-white/5">
                    Esta taxa é visível e repassada integralmente ao entregador.
                  </p>
                </div>
              )}
            </div>
          </RadioGroup>
        </div>

        <div className="py-6 space-y-3">
          <div className="flex justify-between text-sm text-zinc-400">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between text-sm text-zinc-400">
            <span>Taxa Base ({isFastDelivery ? 'Flash' : 'Padrão'})</span>
            <span className={isFastDelivery ? "text-white" : "text-primary font-medium"}>
              {isFastDelivery ? `R$ ${baseFastDeliveryFee.toFixed(2).replace('.', ',')}` : 'Grátis'}
            </span>
          </div>
          {deliveryType === 'porta' && (
             <div className="flex justify-between text-sm text-zinc-400">
               <span>Taxa de Porta (Condomínio)</span>
               <span className="text-white">+ R$ {doorFee[0].toFixed(2).replace('.', ',')}</span>
             </div>
          )}
          <div className="flex justify-between font-bold text-lg text-white pt-2 border-t border-white/5 mt-2">
            <span>Total</span>
            <span className="text-primary">R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
          <p className="text-[10px] text-green-500 text-right uppercase tracking-wider font-bold">Vocé ganhará +12 pts fidelidade e R$ 0,50 de cashback</p>
        </div>
      </div>

      <div className="fixed bottom-[80px] w-full max-w-[430px] p-5 bg-background/90 backdrop-blur-md z-40 border-t border-white/5">
        <Button 
          data-testid="button-checkout"
          onClick={handleCheckout}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(255,204,0,0.2)]"
        >
          Finalizar Pedido
        </Button>
      </div>

      {showPayment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">Pagamento</h3>
              <button onClick={() => { setShowPayment(false); setPaymentResult(null); }} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="bg-zinc-800/50 rounded-2xl p-4 text-center border border-white/5">
                <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Total do Pedido</p>
                <p className="text-3xl font-black text-primary">R$ {total.toFixed(2).replace(".", ",")}</p>
              </div>

              {!paymentResult ? (
                <>
                  <div className="space-y-3">
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Forma de pagamento</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        data-testid="button-order-pix"
                        onClick={() => setPaymentMethod("pix")}
                        className={`p-4 rounded-2xl border-2 text-center transition-all ${paymentMethod === "pix" ? "border-green-500 bg-green-500/10" : "border-white/10 bg-zinc-800/50"}`}
                      >
                        <QrCode className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === "pix" ? "text-green-500" : "text-zinc-400"}`} />
                        <span className={`text-sm font-bold ${paymentMethod === "pix" ? "text-green-500" : "text-zinc-300"}`}>PIX</span>
                        <p className="text-[10px] text-zinc-500 mt-1">Aprovação instantânea</p>
                      </button>
                      <button
                        data-testid="button-order-card"
                        onClick={() => setPaymentMethod("credit_card")}
                        className={`p-4 rounded-2xl border-2 text-center transition-all ${paymentMethod === "credit_card" ? "border-blue-500 bg-blue-500/10" : "border-white/10 bg-zinc-800/50"}`}
                      >
                        <CreditCard className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === "credit_card" ? "text-blue-500" : "text-zinc-400"}`} />
                        <span className={`text-sm font-bold ${paymentMethod === "credit_card" ? "text-blue-500" : "text-zinc-300"}`}>Cartão</span>
                        <p className="text-[10px] text-zinc-500 mt-1">Crédito em até 12x</p>
                      </button>
                    </div>
                  </div>

                  <Button
                    data-testid="button-process-payment"
                    onClick={processOrderPayment}
                    disabled={paymentLoading}
                    className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl"
                  >
                    {paymentLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pagar R$ ${total.toFixed(2).replace(".", ",")}`}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  {paymentResult.pixQrCode ? (
                    <>
                      <div className="bg-white rounded-2xl p-6 flex items-center justify-center">
                        <img src={`data:image/png;base64,${paymentResult.pixQrCodeBase64}`} alt="QR Code PIX" className="w-48 h-48" />
                      </div>
                      <button onClick={copyPixCode} className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl">
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Código copiado!" : "Copiar código PIX"}
                      </button>
                      <p className="text-center text-xs text-zinc-500">Escaneie o QR Code ou copie o código para pagar</p>
                    </>
                  ) : paymentResult.simulatedPayment ? (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto border border-yellow-500/30">
                        <AlertTriangle className="w-8 h-8 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-white font-bold">Modo Simulação</p>
                        <p className="text-xs text-zinc-400 mt-1">O Mercado Pago ainda não está configurado. Simule a aprovação para testar.</p>
                      </div>
                      <Button
                        data-testid="button-simulate-order-approve"
                        onClick={simulateApproval}
                        disabled={paymentLoading}
                        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl"
                      >
                        {paymentLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simular Aprovação"}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-white font-bold">Aguardando pagamento...</p>
                      <p className="text-xs text-zinc-400 mt-2">Status: {paymentResult.status}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 justify-center pt-2">
                <img src="https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/6.6.92/mercadopago/logo__large@2x.png" alt="Mercado Pago" className="h-5 opacity-50" />
                <span className="text-[10px] text-zinc-600">Pagamento seguro</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
