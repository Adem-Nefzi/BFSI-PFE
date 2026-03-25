"use client";

import { ContractUploadForm } from "@/components/views/dashboard/contract-upload-form";
import { EmptyContractsState } from "@/components/views/dashboard/empty-contracts-state";
import { ContractsList } from "@/components/views/dashboard/contracts-list";
import { ContactsHeader } from "@/components/views/dashboard/contacts-header";
import { useState, useEffect } from "react";
import { getContracts } from "@/lib/actions/contract.action";
import { Card } from "@/components/ui/card";

export default function ContactsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showContracts, setShowContracts] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if there are any existing contracts on mount
  useEffect(() => {
    const checkContracts = async () => {
      try {
        const result = await getContracts();
        if (
          result.success &&
          Array.isArray(result.contracts) &&
          result.contracts.length > 0
        ) {
          setShowContracts(true);
        }
      } catch (error) {
        console.error("Failed to check contracts:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkContracts();
  }, []);

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowContracts(true);
  };

  if (isChecking) {
    return (
      <>
        <div className="min-h-screen bg-background text-foreground overflow-hidden">
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 right-1/3 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <main className="relative z-10 flex flex-col h-screen overflow-auto items-center justify-center">
            <div className="text-center">
              <div className="mb-4 inline-block p-4 bg-background dark:bg-card rounded-full border border-border/50">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              </div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <main className="flex flex-col min-h-screen">
          <ContactsHeader />

          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
              <Card className="rounded-2xl border-border/60 p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    Upload Contract
                  </h2>
                  <p className="mt-2 text-sm md:text-base text-muted-foreground">
                    Add PDF contracts and let the AI pipeline extract summary,
                    key points, and legal-business insights.
                  </p>
                </div>
                <ContractUploadForm onUploadSuccess={handleUploadSuccess} />
              </Card>

              <Card className="rounded-2xl border-border/60 p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    Your Contracts
                  </h2>
                  <p className="mt-2 text-sm md:text-base text-muted-foreground">
                    Review contract lifecycle, trigger analysis, and ask AI
                    questions per file.
                  </p>
                </div>

                {showContracts ? (
                  <ContractsList refreshTrigger={refreshTrigger} />
                ) : (
                  <EmptyContractsState />
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
