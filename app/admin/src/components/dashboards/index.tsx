'use client';

import { TrendingUp, Users, DollarSign, Building2, Calendar, Car, Clock, MapPin } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { MOCK_DASHBOARD_STATS } from '@/helpers/mockData';

const Dashboard = () => {
    // Use mock data for template
    const data = MOCK_DASHBOARD_STATS;

    const monthlyGrowth = 12.5;
    const weeklyGrowth = 18;
    const userGrowth = 5; 

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="w-full h-full p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
                    <p className="text-text-secondary mt-1">Welcome back! Here&apos;s what&apos;s happening with your Park Nest.</p>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                    <Calendar className="h-5 w-5" />
                    <span className="text-sm">{new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</span>
                </div>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-text-secondary">Total Users</p>
                            <p className="text-3xl font-bold text-text-primary mt-2">{(data.totalUsers || 0).toLocaleString()}</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="h-4 w-4 text-success mr-1" />
                                <span className="text-sm text-success">+{userGrowth}% this month</span>
                            </div>
                        </div>
                        <div className="bg-primary/10 p-3 rounded-lg">
                            <Users className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Current Month Revenue */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-text-secondary">Monthly Revenue</p>
                            <p className="text-3xl font-bold text-text-primary mt-2">{formatCurrency(data.currentMonthRevenue || 0)}</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="h-4 w-4 text-success mr-1" />
                                <span className="text-sm text-success">+{monthlyGrowth}% this month</span>
                            </div>
                        </div>
                        <div className="bg-success/10 p-3 rounded-lg">
                            <DollarSign className="h-8 w-8 text-success" />
                        </div>
                    </div>
                </div>

                {/* Current Month Bookings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-text-secondary">Monthly Bookings</p>
                            <p className="text-3xl font-bold text-text-primary mt-2">{(data.currentMonthBookings || 0).toLocaleString()}</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="h-4 w-4 text-success mr-1" />
                                <span className="text-sm text-success">+{weeklyGrowth}% this week</span>
                            </div>
                        </div>
                        <div className="bg-primary/10 p-3 rounded-lg">
                            <Calendar className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                </div>

                {/* New Spots This Month */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-text-secondary">New Spots</p>
                            <p className="text-3xl font-bold text-text-primary mt-2">{(data.newSpotsThisMonth || 0).toLocaleString()}</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="h-4 w-4 text-success mr-1" />
                                <span className="text-sm text-success">This month</span>
                            </div>
                        </div>
                        <div className="bg-primary/10 p-3 rounded-lg">
                            <Building2 className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-text-primary">Revenue Trend</h3>
                            <p className="text-sm text-text-secondary">Monthly revenue and bookings</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            <span className="text-sm text-text-secondary">Revenue</span>
                            <div className="w-3 h-3 bg-green-600 rounded-full ml-4"></div>
                            <span className="text-sm text-text-secondary">Bookings</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data.revenueTrend || []}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                            <YAxis yAxisId="left" stroke="#6B7280" fontSize={12} />
                            <YAxis yAxisId="right" orientation="right" stroke="#6B7280" fontSize={12} />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'white', 
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#10B981" 
                                fill="url(#revenueGradient)" 
                                strokeWidth={2}
                                yAxisId="left"
                            />
                            <Area 
                                type="monotone" 
                                dataKey="bookings" 
                                stroke="#059669" 
                                fill="url(#bookingsGradient)" 
                                strokeWidth={2}
                                yAxisId="right"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Spot Type Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-text-primary">Spot Type Distribution</h3>
                            <p className="text-sm text-text-secondary">Parking spot categories</p>
                        </div>
                        <Car className="h-5 w-5 text-text-secondary" />
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.spotTypeDistribution || []}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {(data.spotTypeDistribution || []).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'white', 
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Legend 
                                verticalAlign="bottom" 
                                height={36}
                                formatter={(value: string | number) => (
                                    <span style={{ color: '#374151' }}>{String(value)}</span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Weekly Performance & Top Spots */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Bookings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-text-primary">Weekly Performance</h3>
                            <p className="text-sm text-text-secondary">Daily bookings and revenue</p>
                        </div>
                        <Clock className="h-5 w-5 text-text-secondary" />
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.weeklyPerformance || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                            <YAxis stroke="#6B7280" fontSize={12} />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'white', 
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Bar dataKey="bookings" fill="#10B981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="revenue" fill="#059669" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Performing Spots */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-text-primary">Top Performing Spots</h3>
                            <p className="text-sm text-text-secondary">Most popular parking locations</p>
                        </div>
                        <MapPin className="h-5 w-5 text-text-secondary" />
                    </div>
                    <div className="space-y-4">
                        {(data.topSpots || []).map((spot, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                        index === 0 ? 'bg-yellow-500' : 
                                        index === 1 ? 'bg-gray-400' : 
                                        index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-text-primary">{spot.name || 'Unknown Spot'}</h4>
                                        <p className="text-sm text-text-secondary">{spot.bookings || 0} bookings</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-text-primary">{formatCurrency(spot.revenue || 0)}</p>
                                    <div className="flex items-center gap-1">
                                        <span className="text-yellow-500">★</span>
                                        <span className="text-sm text-text-secondary">{spot.rating || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;