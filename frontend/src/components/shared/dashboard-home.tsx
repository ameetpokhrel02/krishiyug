import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardHome({ role }: { role: string }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome to the {role} dashboard of Krishiyug Suraksha AI.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Awaiting witness verification</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-success/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. 45,000</div>
            <p className="text-xs text-muted-foreground">In last 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-warning/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Low</div>
            <p className="text-xs text-muted-foreground">98.5% accuracy</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
