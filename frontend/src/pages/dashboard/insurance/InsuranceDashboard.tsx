import { motion } from 'framer-motion';
import {
  Shield, FileText, CheckCircle2, XCircle,
  AlertTriangle, TrendingUp, Search, Filter,
  ArrowUpRight, Clock, MapPin, Eye, Moon, Sun,
  CloudRain, Activity, ScanSearch, ShieldCheck, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from '@/providers/theme-provider';

export const InsuranceDashboard = () => {
  const { theme, setTheme } = useTheme();

  const stats = [
    { title: 'Total Claims', value: '1,248', change: '+12%', icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Pending Review', value: '42', change: '-5%', icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
    { title: 'Approved', value: '892', change: '+18%', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
    { title: 'Rejected', value: '314', change: '+2%', icon: XCircle, color: 'text-danger', bg: 'bg-danger/10' },
  ];

  const recentClaims = [
    { id: 'CLM-7821', farmer: 'Ram Bahadur', type: 'Livestock', amount: 'Rs. 45,000', status: 'Pending', risk: 'Low', location: 'Pokhara, Kaski' },
    { id: 'CLM-7822', farmer: 'Sita Devi', type: 'Crop (Paddy)', amount: 'Rs. 28,500', status: 'Approved', risk: 'Low', location: 'Bharatpur, Chitwan' },
    { id: 'CLM-7823', farmer: 'Hari Prasad', type: 'Livestock', amount: 'Rs. 120,000', status: 'In Review', risk: 'Medium', location: 'Lumbini, Rupandehi' },
    { id: 'CLM-7824', farmer: 'Maya Sharma', type: 'Crop (Maize)', amount: 'Rs. 15,200', status: 'Rejected', risk: 'High', location: 'Itahari, Sunsari' },
    { id: 'CLM-7825', farmer: 'Gopal Thapa', type: 'Crop (Wheat)', amount: 'Rs. 32,000', status: 'Pending', risk: 'Low', location: 'Dhangadhi, Kailali' },
  ];

  return (
    <div className="space-y-8 pb-12 min-h-screen bg-background text-foreground p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Insurance Officer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Agent. Here is your claims overview for today.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 bg-card border border-border rounded-xl hover:bg-muted transition-colors flex items-center justify-center"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
          <button className="px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-md flex items-center gap-2">
            <Search className="w-4 h-4" /> Search Claims
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="border-none shadow-sm bg-card overflow-hidden group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-colors group-hover:scale-110 duration-300`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold ${stat.change.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                    {stat.change}
                    <TrendingUp className={`w-3 h-3 ${stat.change.startsWith('+') ? '' : 'rotate-180'}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Claims Table Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: Ward Approved Claims */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" /> Verified by Ward (Ready for Payout)
              </h2>
              <span className="px-2.5 py-1 bg-success/10 text-success text-xs font-bold rounded-lg">3 Priority</span>
            </div>
            <Card className="border-none shadow-sm bg-card overflow-hidden border-l-4 border-l-success">
              <div className="p-4 bg-success/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center text-success">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">CLM-9012 - Livestock Loss</p>
                    <p className="text-xs text-muted-foreground font-medium">Approved by Ward 7 Officer • 2h ago</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-success text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all">
                  Process Payout
                </button>
              </div>
            </Card>
          </div>

          {/* Section: Fraud Detection Review */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                <ScanSearch className="w-5 h-5 text-indigo-600" /> Fraud Detection Workspace
              </h2>
              <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-600 text-xs font-bold rounded-lg">Admin Forwarded</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'DOC-551', name: 'Krishna Prasad', doc: 'Citizenship Doc', aiScore: '94%', clarity: 'High' },
                { id: 'DOC-552', name: 'Bimala Rai', doc: 'Policy Proof', aiScore: '62%', clarity: 'Medium' }
              ].map((doc, idx) => (
                <Card key={idx} className="border-none shadow-sm bg-card overflow-hidden group border border-border">
                  <CardHeader className="p-4 bg-muted/30 border-b border-border flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-bold text-primary">{doc.id}</CardTitle>
                    <div className="p-1.5 bg-indigo-500/10 text-indigo-600 rounded-md">
                      <FileText className="w-4 h-4" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <p className="text-sm font-semibold">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.doc}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="p-2 bg-muted/50 rounded-lg">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">AI Score</p>
                          <span className="text-sm font-bold">{doc.aiScore}</span>
                       </div>
                       <div className="p-2 bg-muted/50 rounded-lg">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Clarity</p>
                          <span className="text-sm font-bold text-indigo-600">{doc.clarity}</span>
                       </div>
                    </div>
                    <button className="w-full py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                       <CheckCircle2 className="w-4 h-4" /> Verify & Notify
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Recent Claims
              </h2>
              <button className="text-sm font-medium text-primary hover:underline transition-colors">View All</button>
            </div>
            <Card className="border-none shadow-sm bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Claim ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Farmer</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">AI Risk</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentClaims.map((claim) => (
                      <tr key={claim.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-primary">{claim.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">{claim.farmer}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" /> {claim.location}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium">{claim.amount}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            claim.status === 'Approved' ? 'bg-success/20 text-success' :
                            claim.status === 'Rejected' ? 'bg-danger/20 text-danger' :
                            'bg-warning/20 text-warning'
                          }`}>
                            {claim.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${
                               claim.risk === 'Low' ? 'bg-success' :
                               claim.risk === 'Medium' ? 'bg-warning' : 'bg-danger'
                             }`} />
                             <span className="text-sm text-muted-foreground">{claim.risk}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

        {/* AI Insights Sidebar */}
        <div className="space-y-8">
          <div className="space-y-6">
             <h2 className="text-xl font-heading font-bold flex items-center gap-2">
               <Shield className="w-5 h-5 text-primary" /> AI Insights
             </h2>
             <Card className="border-none shadow-sm bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Shield className="w-24 h-24 rotate-12" />
               </div>
               <CardContent className="p-6 relative z-10">
                 <p className="text-primary-foreground/70 text-sm mb-4">Fraud detection accuracy</p>
                 <div className="flex items-end gap-2 mb-6">
                   <h3 className="text-4xl font-bold">98.2%</h3>
                   <span className="text-success text-sm font-bold flex items-center mb-1">
                     <ArrowUpRight className="w-4 h-4" /> +1.4%
                   </span>
                 </div>
                 <div className="space-y-4">
                   <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                     <div className="flex items-center gap-3 mb-2">
                       <AlertTriangle className="w-4 h-4 text-accent" />
                       <span className="text-sm font-semibold">Anomalous Activity</span>
                     </div>
                     <p className="text-xs text-primary-foreground/80">3 claims from Rupandehi flagged for potential photo manipulation.</p>
                   </div>
                   <button className="w-full py-3 bg-accent text-accent-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-colors">
                     Review High Risk Claims
                   </button>
                 </div>
               </CardContent>
             </Card>
          </div>

          {/* Weather Correlation */}
          <div className="space-y-6">
             <h2 className="text-xl font-heading font-bold flex items-center gap-2">
               <CloudRain className="w-5 h-5 text-primary" /> Weather Analysis
             </h2>
             <Card className="border-none shadow-sm bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                   <span className="text-sm font-medium text-muted-foreground">Regional Correlation</span>
                   <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-lg">High Match</span>
                </div>
                <p className="text-sm text-foreground mb-4 leading-relaxed">
                   Satellite data confirms severe hailstorm in **Kaski District** on May 8th, matching 12 active claims.
                </p>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                   <div className="h-full bg-primary w-[85%]" />
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">85% of claims match meteorological data.</p>
             </Card>
          </div>

          {/* Activity Feed */}
          <div className="space-y-6">
             <h2 className="text-xl font-heading font-bold">Recent Activity</h2>
             <div className="space-y-4">
                {[
                  { user: 'Ward Officer', action: 'Verified', target: 'CLM-7821', time: '10m ago' },
                  { user: 'AI Bot', action: 'Flagged', target: 'CLM-7824', time: '1h ago' },
                  { user: 'System', action: 'Paid', target: 'CLM-7815', time: '3h ago' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {item.user} <span className="font-normal text-muted-foreground">{item.action}</span> {item.target}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="space-y-6">
             <h2 className="text-xl font-heading font-bold">Quick Actions</h2>
             <div className="grid grid-cols-1 gap-3">
                <button className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-sm transition-all group text-foreground">
                   <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <FileText className="w-5 h-5" />
                   </div>
                   <div className="text-left">
                      <p className="text-sm font-bold">Generate Report</p>
                      <p className="text-xs text-muted-foreground">Monthly claims summary</p>
                   </div>
                </button>
                <button className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-success/50 hover:shadow-sm transition-all group text-foreground">
                   <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center group-hover:bg-success group-hover:text-primary-foreground transition-colors">
                      <CheckCircle2 className="w-5 h-5" />
                   </div>
                   <div className="text-left">
                      <p className="text-sm font-bold">Batch Approval</p>
                      <p className="text-xs text-muted-foreground">Approve low-risk claims</p>
                   </div>
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
