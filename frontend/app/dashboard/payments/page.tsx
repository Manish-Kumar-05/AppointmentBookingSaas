// "use client";

// import { bankApiService } from "@/lib/api/bank";
// import { BankFormData } from "@/lib/validators/bank";
// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import BankForm from "@/components/BankComponents/BankForm";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Building2,
//   ShieldCheck,
//   Plus,
//   Pencil,
//   Loader2,
//   Landmark,
//   Wallet,
//   ArrowUpRight,
// } from "lucide-react";

// const PaymentsPage = () => {
//   const [bank, setBank] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [openForm, setOpenForm] = useState(false);

//   const fetchBankDetail = async () => {
//     try {
//       setLoading(true);
//       const data = await bankApiService.getUserBankDetail();
//       setBank(data);
//     } catch {
//       setBank(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBankDetail();
//   }, []);

//   const formDefaults: Partial<BankFormData> | undefined = bank
//     ? {
//         accountHolderName: bank.accountHolderName,
//         bankName: bank.bankName,
//         bankBranch: bank.bankBranch,
//         ifscCode: bank.ifscCode,
//         accountNumber: "",
//       }
//     : undefined;

//   return (
//     <div className="max-w-7xl space-y-10 p-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
//         <div className="space-y-1">
//           <h2 className="text-5xl font-black tracking-tight text-foreground">
//             Payouts
//           </h2>
//           <p className="text-muted-foreground font-medium">
//             Manage your bank accounts and transfer settings.
//           </p>
//         </div>

//         {bank && (
//           <Button
//             onClick={() => setOpenForm(true)}
//             className="rounded-2xl px-6 h-12 font-bold shadow-lg shadow-primary/10 transition-all hover:scale-105 active:scale-95 gap-2 cursor-pointer"
//           >
//             <Pencil className="w-4 h-4" /> Edit Account
//           </Button>
//         )}
//       </div>

//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-24 gap-4 bg-muted/50 rounded-[3rem] border-2 border-dashed border-border">
//           <Loader2 className="w-10 h-10 animate-spin text-primary" />
//           <p className="text-muted-foreground font-bold animate-pulse uppercase tracking-widest text-xs">
//             Securing Connection...
//           </p>
//         </div>
//       ) : bank ? (
//         /* The "Fintech" Bank Card */
//         <div className="group relative">
//           <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
//           <div className="relative bg-card border border-border rounded-[2rem] p-8 shadow-sm overflow-hidden">
//             {/* Background Branding */}
//             <Landmark className="absolute -right-12 -bottom-12 w-64 h-64 text-muted opacity-[0.2] pointer-events-none" />

//             <div className="flex flex-col md:flex-row gap-12 relative z-10">
//               <div className="space-y-8 flex-1">
//                 <div className="flex items-center gap-4">
//                   <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center shadow-inner">
//                     <Building2 className="w-7 h-7 text-primary-foreground" />
//                   </div>
//                   <div>
//                     <h3 className="text-2xl font-black text-card-foreground leading-tight tracking-tight">
//                       {bank.bankName.toUpperCase()}
//                     </h3>
//                     <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">
//                       {bank.bankBranch}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
//                   <div className="space-y-1">
//                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
//                       Account Holder
//                     </p>
//                     <p className="font-bold text-foreground truncate">
//                       {bank.accountHolderName.toUpperCase()}
//                     </p>
//                   </div>
//                   <div className="space-y-1">
//                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
//                       IFSC Code
//                     </p>
//                     <p className="font-bold text-foreground">
//                       {bank.ifscCode.toUpperCase()}
//                     </p>
//                   </div>
//                   <div className="space-y-1 col-span-2 md:col-span-1">
//                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
//                       Account Number
//                     </p>
//                     <p className="font-mono font-bold text-lg text-foreground tracking-tighter">
//                       •••• •••• {bank?.accountNumberLast4}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Status Section */}
//               <div className="flex flex-row md:flex-col justify-between items-end md:items-end border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8">
//                 <div className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full flex items-center gap-2 border border-emerald-500/20">
//                   <ShieldCheck className="w-4 h-4" />
//                   <span className="text-[10px] font-black uppercase tracking-tight">
//                     Verified Payouts
//                   </span>
//                 </div>
//                 <div className="text-right hidden md:block">
//                   <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest mb-1">
//                     Last Updated
//                   </p>
//                   <p className="text-xs font-bold text-muted-foreground">
//                     Today, 12:13 AM
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         /* Enhanced Empty State */
//         <div className="border-4 border-dashed border-border rounded-[3rem] p-6 text-center bg-muted/20 flex flex-col items-center group hover:border-primary/20 transition-colors">
//           <div className="w-24 h-24 bg-card rounded-[2rem] shadow-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-border">
//             <Wallet className="w-10 h-10 text-muted-foreground/40" />
//           </div>
//           <h3 className="text-3xl font-black text-foreground">
//             Ready to get paid?
//           </h3>
//           <p className="text-muted-foreground mt-3 mb-10 max-w-xs text-lg font-medium">
//             Connect your bank account to start receiving automated payouts for
//             your bookings.
//           </p>
//           <Button
//             onClick={() => setOpenForm(true)}
//             className="rounded-full px-12 h-16 font-black text-xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all cursor-pointer"
//           >
//             Add Payout Method <ArrowUpRight className="ml-2 w-5 h-5" />
//           </Button>
//         </div>
//       )}

//       {/* Security Disclaimer */}
//       <div className="flex items-center justify-center gap-3 px-8 py-2 bg-muted/30 rounded-2xl border border-border">
//         <ShieldCheck className="w-5 h-5 text-muted-foreground" />
//         <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
//           Your data is encrypted with 256-bit SSL security. We never store full
//           account numbers.
//         </p>
//       </div>

//       <Dialog open={openForm} onOpenChange={setOpenForm}>
//         <DialogContent className="sm:max-w-lg rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-background">
//           <div className="bg-primary p-8 text-primary-foreground">
//             <DialogTitle className="text-3xl font-black tracking-tight">
//               {bank ? "Update Details" : "Account Setup"}
//             </DialogTitle>
//             <p className="opacity-80 text-sm mt-1">
//               Please ensure your IFSC and account match your passbook.
//             </p>
//           </div>
//           <div className="p-8">
//             <BankForm
//               defaultValues={formDefaults}
//               maskedAccount={bank?.accountNumber}
//               onClose={() => {
//                 setOpenForm(false);
//                 fetchBankDetail();
//               }}
//             />
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default PaymentsPage;
