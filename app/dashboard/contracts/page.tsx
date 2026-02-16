"use client";

import { FileText, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function ContractsPage() {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Page Header */}
      <div className="sticky top-0 z-10 p-6 md:p-8 border-b border-border bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                My Contracts
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage and analyze all your contracts in one place
              </p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-xl sm:w-auto w-full">
              <Plus className="w-4 h-4 mr-2" />
              New Contract
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search contracts by name or type..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="sm:w-auto w-full">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Empty State */}
          <Card className="border-border bg-white dark:bg-slate-900/50 backdrop-blur-sm py-12 px-6 text-center animate-slide-up">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No contracts yet
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start by uploading your first contract or creating a new one to begin managing your documents with AI-powered insights.
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Contract
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
