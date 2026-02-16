"use client";

import { FileText, Shield, TrendingUp, CheckCircle, ChevronRight, MoreVertical, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const statsData = [
  {
    id: 1,
    label: "Total Contracts",
    value: "12",
    icon: FileText,
    trend: "+2 this month",
    color: "from-blue-600 to-blue-700",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: 2,
    label: "Active Policies",
    value: "8",
    badge: "67%",
    icon: Shield,
    color: "from-teal-600 to-teal-700",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
  {
    id: 3,
    label: "Total Coverage",
    value: "€450,000",
    icon: TrendingUp,
    color: "from-violet-600 to-violet-700",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    id: 4,
    label: "Verified",
    value: "12/12",
    badge: "100%",
    icon: CheckCircle,
    color: "from-emerald-600 to-emerald-700",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
];

const contractsData = [
  {
    id: 1,
    name: "Enterprise Service Agreement",
    type: "Service",
    date: "2024-02-10",
    status: "Active",
    statusColor: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200",
  },
  {
    id: 2,
    name: "Data Processing Agreement",
    type: "Privacy",
    date: "2024-02-08",
    status: "Pending Review",
    statusColor: "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200",
  },
  {
    id: 3,
    name: "Insurance Coverage Policy",
    type: "Insurance",
    date: "2024-02-05",
    status: "Active",
    statusColor: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200",
  },
  {
    id: 4,
    name: "Loan Agreement",
    type: "Financial",
    date: "2024-02-01",
    status: "Expiring Soon",
    statusColor: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
  },
  {
    id: 5,
    name: "Vendor Partnership Agreement",
    type: "Partnership",
    date: "2024-01-28",
    status: "Active",
    statusColor: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200",
  },
];

export default function DashboardPage() {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Page Header */}
      <div className="sticky top-0 z-10 p-6 md:p-8 border-b border-border bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back! Here's your contract overview
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl sm:w-auto w-full">
            + New Contract
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.id}
                  className="group overflow-hidden border-border bg-white dark:bg-slate-900/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${stat.color} transition-opacity duration-300`} />

                  <div className="relative p-6 space-y-4">
                    {/* Icon */}
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-all duration-300`}>
                        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                      {stat.badge && (
                        <Badge className="bg-emerald-600 text-white">
                          {stat.badge}
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div>
                      <p className="text-3xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {stat.label}
                      </p>
                    </div>

                    {/* Trend */}
                    {stat.trend && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        {stat.trend}
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Recent Contracts Section */}
          <Card className="border-border bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden animate-slide-up"
            style={{
              animationDelay: "0.4s",
            }}>
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Recent Contracts
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Last updated 5 minutes ago
                </p>
              </div>
              <Button
                variant="ghost"
                className="gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-foreground font-semibold">Contract Name</TableHead>
                    <TableHead className="text-foreground font-semibold">Type</TableHead>
                    <TableHead className="text-foreground font-semibold">Date</TableHead>
                    <TableHead className="text-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-right text-foreground font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contractsData.map((contract, index) => (
                    <TableRow
                      key={contract.id}
                      className="border-border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                    >
                      <TableCell className="font-medium text-foreground">
                        {contract.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <Badge variant="outline">{contract.type}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {new Date(contract.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={contract.statusColor}>
                          {contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Download</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border bg-gradient-to-r from-blue-600/10 to-teal-600/10 dark:from-blue-900/20 dark:to-teal-900/20 backdrop-blur-sm overflow-hidden animate-slide-up"
            style={{
              animationDelay: "0.5s",
            }}>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    Action Required
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You have 1 contract expiring in 30 days. Review and renew to maintain coverage.
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full sm:w-auto">
                Review Expiring Contracts
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
