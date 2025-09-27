import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageCircle, 
  CheckCircle, 
  User, 
  LogOut,
  Clock,
  AlertTriangle,
  Send,
  Eye,
  UserCheck,
  Download,
  FileText,
  Search,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Navigation Component
const Navigation = ({ activeTab, setActiveTab }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { id: 'under-review', label: 'Under Reviewing', icon: MessageCircle },
    { id: 'reviewed', label: 'Reviewed', icon: CheckCircle },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/support/${tabId}`);
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl border-b border-orange-200/40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl">🌶️</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                Ceylon Spices - Support Dashboard
              </h1>
            </div>
            <nav className="flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center px-4 py-2.5 text-sm font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50 bg-white/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700 bg-white/60 px-4 py-2 rounded-2xl shadow-sm">
              Welcome, <span className="font-semibold text-orange-600">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-red-600 bg-white/50 hover:bg-red-50 rounded-2xl transition-all duration-300 transform hover:scale-105"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Under Review Tab Component
const UnderReviewTab = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/support/tickets/under-review');
      setTickets(response.data.tickets);
      setStats(response.data.stats);
    } catch (error) {
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTicket = async (ticketId) => {
    try {
      await axios.patch(`/support/tickets/${ticketId}/assign`);
      toast.success('Ticket assigned successfully!');
      fetchTickets();
      if (selectedTicket && selectedTicket._id === ticketId) {
        setShowDetails(false);
        setSelectedTicket(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign ticket');
    }
  };

  const handleViewDetails = async (ticketId) => {
    try {
      const response = await axios.get(`/support/tickets/${ticketId}`);
      setSelectedTicket(response.data.ticket);
      setShowDetails(true);
    } catch (error) {
      toast.error('Failed to fetch ticket details');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityIcon = (priority) => {
    return priority === 'urgent' || priority === 'high' ? 
      <AlertTriangle className="w-4 h-4" /> : 
      <Clock className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-spice-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[{
          label: 'Urgent', value: stats.urgent || 0, icon: <AlertTriangle className='w-7 h-7' />, colors: 'from-red-500 to-rose-500'
        },{
          label: 'High', value: stats.high || 0, icon: <AlertTriangle className='w-7 h-7' />, colors: 'from-orange-500 to-red-500'
        },{
          label: 'Medium', value: stats.medium || 0, icon: <Clock className='w-7 h-7' />, colors: 'from-blue-500 to-cyan-500'
        },{
          label: 'Low', value: stats.low || 0, icon: <Clock className='w-7 h-7' />, colors: 'from-gray-500 to-slate-500'
        }].map((c,i)=> (
          <div key={i} className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-300/40 via-red-300/40 to-pink-300/40 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-orange-200/40 shadow-xl p-6 overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${c.colors} opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-full blur-2xl`}></div>
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${c.colors} text-white shadow-lg ring-1 ring-white/20`}> {c.icon} </div>
                <div className="text-right">
                  <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase">{c.label}</p>
                  <p className={`mt-1 text-3xl font-extrabold bg-gradient-to-r ${c.colors} bg-clip-text text-transparent drop-shadow`}>{c.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 via-red-50/50 to-pink-100/50 rounded-3xl blur-xl opacity-60"></div>
        <div className="relative flex justify-between items-center bg-white/80 backdrop-blur-xl border border-orange-200/30 rounded-3xl shadow-2xl px-8 py-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">Tickets Under Review</h2>
          <button
            onClick={() => {
              fetchTickets();
              toast.success('Tickets refreshed!');
            }}
            className="group relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
            title="Refresh Tickets"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
            <RefreshCw className="w-5 h-5 relative z-10" />
          </button>
        </div>
      </div>

      {/* Ticket Details Modal */}
      {showDetails && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Ticket #{selectedTicket.ticketNumber}
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedTicket.subject}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      by {selectedTicket.submittedBy?.name} ({selectedTicket.submittedBy?.email})
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-gray-700">{selectedTicket.description}</p>
                </div>

                {selectedTicket.relatedOrder && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-medium text-gray-900">Related Order</h5>
                    <p className="text-sm text-gray-600">
                      Order #{selectedTicket.relatedOrder.orderNumber} - 
                      ${selectedTicket.relatedOrder.totalAmount?.toFixed(2)}
                    </p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleAssignTicket(selectedTicket._id)}
                    className="btn-primary"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Assign to Me
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="relative text-center py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-red-100/50 rounded-3xl blur-xl opacity-60" />
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 p-12">
            <div className="bg-gradient-to-br from-orange-100 to-red-100 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-14 h-14 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No tickets under review</h3>
            <p className="text-gray-600 mb-2">All tickets have been assigned</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-300/40 via-red-300/40 to-pink-300/40 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-orange-200/30 overflow-hidden transform transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl">
                <div className="p-8">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                          #{ticket.ticketNumber}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg ${getPriorityColor(ticket.priority)}`}>
                          {getPriorityIcon(ticket.priority)}
                          <span className="ml-1">{ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</span>
                        </span>
                      </div>
                      
                      <h4 className="font-semibold text-lg text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">{ticket.subject}</h4>
                      <div className="bg-gradient-to-r from-orange-50/50 to-red-50/50 rounded-2xl p-4 mb-4">
                        <p className="text-gray-700 leading-relaxed line-clamp-2">{ticket.description}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <span className="text-orange-500 mr-2">📂</span>
                          Category: <span className="font-semibold text-gray-800 ml-1 capitalize">{ticket.category}</span>
                        </span>
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-red-500" />
                          By: <span className="font-semibold text-gray-800 ml-1">{ticket.submittedBy?.name}</span>
                        </span>
                        <span className="flex items-center">
                          <span className="text-pink-500 mr-2">📅</span>
                          Created: <span className="font-semibold text-gray-800 ml-1">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3 ml-6">
                      <button
                        onClick={() => handleViewDetails(ticket._id)}
                        className="flex items-center px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 bg-white/70 hover:bg-blue-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                      
                      <button
                        onClick={() => handleAssignTicket(ticket._id)}
                        className="flex items-center px-4 py-2 text-sm font-semibold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Assign to Me
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Reviewed Tab Component
const ReviewedTab = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [resolution, setResolution] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  // Search effect
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTickets(tickets);
    } else {
      const filtered = tickets.filter(ticket => 
        ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTickets(filtered);
    }
  }, [searchTerm, tickets]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/support/tickets/assigned');
      setTickets(response.data.tickets);
      setFilteredTickets(response.data.tickets);
      setStats(response.data.stats);
    } catch (error) {
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (ticketId) => {
    try {
      const response = await axios.get(`/support/tickets/${ticketId}`);
      setSelectedTicket(response.data.ticket);
      setShowDetails(true);
    } catch (error) {
      toast.error('Failed to fetch ticket details');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(`/support/tickets/${selectedTicket._id}/messages`, {
        message: newMessage,
        isInternal: false
      });
      toast.success('Message sent successfully!');
      setNewMessage('');
      // Refresh ticket details
      handleViewDetails(selectedTicket._id);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const data = { status: newStatus };
      if (newStatus === 'resolved' && resolution) {
        data.resolution = resolution;
      }

      await axios.patch(`/support/tickets/${selectedTicket._id}/status`, data);
      toast.success('Ticket status updated successfully!');
      setResolution('');
      fetchTickets();
      // Refresh ticket details
      handleViewDetails(selectedTicket._id);
    } catch (error) {
      toast.error('Failed to update ticket status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      assigned: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  // CSV Export Function
  const exportToCSV = () => {
    if (filteredTickets.length === 0) {
      toast.error('No tickets to export');
      return;
    }

    try {
      const csvData = filteredTickets.map(ticket => ({
        'Ticket Number': ticket.ticketNumber,
        'Subject': ticket.subject,
        'Description': ticket.description,
        'Status': ticket.status,
        'Priority': ticket.priority,
        'Category': ticket.category,
        'Customer Name': ticket.submittedBy?.name || 'N/A',
        'Customer Email': ticket.submittedBy?.email || 'N/A',
        'Customer Role': ticket.submittedBy?.role || 'N/A',
        'Created Date': new Date(ticket.createdAt).toLocaleDateString(),
        'Assigned To': ticket.assignedTo?.name || 'N/A',
        'Resolution': ticket.resolution || 'N/A',
        'Related Order': ticket.relatedOrder ? `Order #${ticket.relatedOrder.orderNumber}` : 'N/A',
        'Messages Count': ticket.messages?.length || 0
      }));

      const csvContent = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const fileName = `support_tickets_${new Date().toISOString().split('T')[0]}.csv`;
      saveAs(blob, fileName);

      toast.success('CSV file exported successfully!');
    } catch (error) {
      toast.error('Failed to export CSV file');
    }
  };

  // PDF Export Function
  const exportToPDF = async () => {
    if (filteredTickets.length === 0) {
      toast.error('No tickets to export');
      return;
    }

    try {
      toast.loading('Generating PDF report...', { id: 'pdf-export' });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Professional Header
      pdf.setFillColor(255, 140, 0); // Orange color
      pdf.rect(0, 0, pageWidth, 35, 'F');
      
      // Company Name and Details
      pdf.setFontSize(20);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CEYLON SPICES', 15, 15);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Premium Quality Spices from Sri Lanka', 15, 22);
      pdf.text('Established 1985 • ISO 22000 Certified', 15, 28);

      // Report Title
      yPosition = 50;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Support Tickets Report', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 15;

      // Company Details Section
      pdf.setTextColor(0, 0, 0);
      
      // Company Details Box
      pdf.setFillColor(248, 249, 250);
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(0.5);
      pdf.rect(15, yPosition - 5, pageWidth - 30, 45, 'FD');
      
      // Company Details Title
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 140, 0);
      pdf.text('Company Information', 20, yPosition);
      
      // Company Details Content
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      const companyDetails = [
        'Business Name: Ceylon Spices (Pvt) Ltd',
        'Registration: PV 123456789',
        'VAT Number: 123456789V',
        'Address: 123 Spice Garden Road, Colombo 07, Sri Lanka',
        'Phone: +94 11 234 5678',
        'Email: info@ceylonspices.lk',
        'Website: www.ceylonspices.lk'
      ];
      
      companyDetails.forEach((detail, index) => {
        pdf.text(detail, 20, yPosition + 8 + (index * 4));
      });
      
      yPosition += 50;

      // Enhanced Summary Section
      const totalTickets = filteredTickets.length;
      const assignedTickets = filteredTickets.filter(ticket => ticket.status === 'assigned').length;
      const inProgressTickets = filteredTickets.filter(ticket => ticket.status === 'in-progress').length;
      const resolvedTickets = filteredTickets.filter(ticket => ticket.status === 'resolved').length;
      const closedTickets = filteredTickets.filter(ticket => ticket.status === 'closed').length;
      const urgentTickets = filteredTickets.filter(ticket => ticket.priority === 'urgent').length;
      const highPriorityTickets = filteredTickets.filter(ticket => ticket.priority === 'high').length;

      // Summary Box
      pdf.setFillColor(240, 248, 255);
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(15, yPosition - 5, pageWidth - 30, 40, 'FD');
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 140, 0);
      pdf.text('Ticket Summary', 20, yPosition);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      const summaryLeft = 20;
      const summaryRight = pageWidth / 2 + 10;
      
      pdf.text(`Total Tickets: ${totalTickets}`, summaryLeft, yPosition + 8);
      pdf.text(`Assigned: ${assignedTickets}`, summaryLeft, yPosition + 13);
      pdf.text(`In Progress: ${inProgressTickets}`, summaryLeft, yPosition + 18);
      pdf.text(`Resolved: ${resolvedTickets}`, summaryLeft, yPosition + 23);
      pdf.text(`Closed: ${closedTickets}`, summaryRight, yPosition + 8);
      pdf.text(`Urgent Priority: ${urgentTickets}`, summaryRight, yPosition + 13);
      pdf.text(`High Priority: ${highPriorityTickets}`, summaryRight, yPosition + 18);
      pdf.text(`Resolution Rate: ${((resolvedTickets + closedTickets) / totalTickets * 100).toFixed(1)}%`, summaryRight, yPosition + 23);
      
      yPosition += 50;

      // Tickets Details
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 140, 0);
      pdf.text('Ticket Details', 15, yPosition);
      yPosition += 10;

      filteredTickets.forEach((ticket, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = 20;
        }

        // Ticket Header
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Ticket #${ticket.ticketNumber}`, 15, yPosition);
        
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Subject: ${ticket.subject}`, 15, yPosition + 5);
        pdf.text(`Status: ${ticket.status.toUpperCase()}`, 15, yPosition + 10);
        pdf.text(`Priority: ${ticket.priority.toUpperCase()}`, 15, yPosition + 15);
        pdf.text(`Category: ${ticket.category}`, 15, yPosition + 20);
        
        yPosition += 25;

        // Customer Information
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Customer: ${ticket.submittedBy?.name} (${ticket.submittedBy?.email})`, 20, yPosition);
        pdf.text(`Role: ${ticket.submittedBy?.role}`, 20, yPosition + 4);
        pdf.text(`Created: ${new Date(ticket.createdAt).toLocaleDateString()}`, 20, yPosition + 8);
        pdf.text(`Assigned To: ${ticket.assignedTo?.name || 'Unassigned'}`, 20, yPosition + 12);
        
        yPosition += 20;

        // Description
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);
        const description = ticket.description.length > 100 ? 
          ticket.description.substring(0, 100) + '...' : 
          ticket.description;
        pdf.text(`Description: ${description}`, 20, yPosition);
        
        yPosition += 10;

        // Resolution
        if (ticket.resolution) {
          pdf.setTextColor(0, 100, 0);
          const resolution = ticket.resolution.length > 80 ? 
            ticket.resolution.substring(0, 80) + '...' : 
            ticket.resolution;
          pdf.text(`Resolution: ${resolution}`, 20, yPosition);
          yPosition += 8;
        }

        // Related Order
        if (ticket.relatedOrder) {
          pdf.setTextColor(0, 0, 100);
          pdf.text(`Related Order: #${ticket.relatedOrder.orderNumber} - LKR ${ticket.relatedOrder.totalAmount?.toFixed(2)}`, 20, yPosition);
          yPosition += 8;
        }

        // Messages Count
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Messages: ${ticket.messages?.length || 0}`, 20, yPosition);
        
        yPosition += 15;
        
        // Add separator line
        if (index < filteredTickets.length - 1) {
          pdf.setDrawColor(200, 200, 200);
          pdf.setLineWidth(0.5);
          pdf.line(15, yPosition, pageWidth - 15, yPosition);
          yPosition += 10;
        }
      });

      // Professional Footer
      const footerY = pageHeight - 25;
      
      // Footer line
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(15, footerY - 5, pageWidth - 15, footerY - 5);
      
      // Footer content
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.setFont('helvetica', 'normal');
      
      // Left footer
      pdf.text('Ceylon Spices (Pvt) Ltd', 15, footerY);
      pdf.text('123 Spice Garden Road, Colombo 07', 15, footerY + 3);
      pdf.text('Sri Lanka', 15, footerY + 6);
      
      // Center footer
      pdf.text('This report was generated by Ceylon Spices Support System', pageWidth / 2, footerY, { align: 'center' });
      
      // Right footer
      pdf.text('www.ceylonspices.lk', pageWidth - 15, footerY, { align: 'right' });
      pdf.text('info@ceylonspices.lk', pageWidth - 15, footerY + 3, { align: 'right' });
      pdf.text('+94 11 234 5678', pageWidth - 15, footerY + 6, { align: 'right' });

      // Add page numbers to all pages
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      // Save the PDF
      const fileName = `Ceylon_Spices_Support_Tickets_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast.success('Advanced PDF report generated successfully!', { id: 'pdf-export' });
    } catch (error) {
      toast.error('Failed to generate PDF report');
      console.error('PDF generation error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-spice-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[{
          label: 'Assigned', value: stats.assigned || 0, icon: <MessageCircle className='w-7 h-7' />, colors: 'from-blue-500 to-cyan-500'
        },{
          label: 'In Progress', value: stats['in-progress'] || 0, icon: <Clock className='w-7 h-7' />, colors: 'from-purple-500 to-indigo-500'
        },{
          label: 'Resolved', value: stats.resolved || 0, icon: <CheckCircle className='w-7 h-7' />, colors: 'from-green-500 to-emerald-500'
        },{
          label: 'Closed', value: stats.closed || 0, icon: <CheckCircle className='w-7 h-7' />, colors: 'from-gray-500 to-slate-500'
        }].map((c,i)=> (
          <div key={i} className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-300/40 via-red-300/40 to-pink-300/40 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-orange-200/40 shadow-xl p-6 overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${c.colors} opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-full blur-2xl`}></div>
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${c.colors} text-white shadow-lg ring-1 ring-white/20`}> {c.icon} </div>
                <div className="text-right">
                  <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase">{c.label}</p>
                  <p className={`mt-1 text-3xl font-extrabold bg-gradient-to-r ${c.colors} bg-clip-text text-transparent drop-shadow`}>{c.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 via-red-50/50 to-pink-100/50 rounded-3xl blur-xl opacity-60"></div>
        <div className="relative flex justify-between items-center bg-white/80 backdrop-blur-xl border border-orange-200/30 rounded-3xl shadow-2xl px-8 py-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">My Assigned Tickets</h2>
          <button
            onClick={() => {
              fetchTickets();
              toast.success('Tickets refreshed!');
            }}
            className="group relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
            title="Refresh Tickets"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
            <RefreshCw className="w-5 h-5 relative z-10" />
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/30 via-red-50/30 to-pink-100/30 rounded-3xl blur-xl opacity-60"></div>
        <div className="relative bg-white/70 backdrop-blur-xl border border-orange-200/30 rounded-3xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Search className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-800">Search Tickets</h3>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="relative w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-orange-200/40 rounded-2xl text-gray-700 placeholder-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                  placeholder="Search by Ticket ID (e.g., TKT-12345)"
                />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {searchTerm ? (
                <span className="text-orange-600 font-semibold">
                  {filteredTickets.length} of {tickets.length} tickets
                </span>
              ) : (
                <span className="text-gray-500">
                  {tickets.length} total tickets
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Details Modal */}
      {showDetails && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Ticket #{selectedTicket.ticketNumber}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Left Column - Ticket Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedTicket.subject}</h4>
                    <p className="text-gray-700 mt-2">{selectedTicket.description}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-medium text-gray-900">Customer Info</h5>
                    <p className="text-sm text-gray-600">
                      Name: {selectedTicket.submittedBy?.name}<br />
                      Email: {selectedTicket.submittedBy?.email}<br />
                      Role: {selectedTicket.submittedBy?.role}
                    </p>
                  </div>

                  {selectedTicket.relatedOrder && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h5 className="font-medium text-gray-900">Related Order</h5>
                      <p className="text-sm text-gray-600">
                        Order #{selectedTicket.relatedOrder.orderNumber}<br />
                        Amount: ${selectedTicket.relatedOrder.totalAmount?.toFixed(2)}
                      </p>
                    </div>
                  )}

                  {/* Status Update */}
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      {selectedTicket.status === 'assigned' && (
                        <button
                          onClick={() => handleUpdateStatus('in-progress')}
                          className="btn-primary text-sm"
                        >
                          Start Working
                        </button>
                      )}
                      {selectedTicket.status === 'in-progress' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus('resolved')}
                            className="btn-primary text-sm"
                          >
                            Mark Resolved
                          </button>
                        </>
                      )}
                      {selectedTicket.status === 'resolved' && (
                        <button
                          onClick={() => handleUpdateStatus('closed')}
                          className="btn-secondary text-sm"
                        >
                          Close Ticket
                        </button>
                      )}
                    </div>

                    {selectedTicket.status === 'in-progress' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Resolution Notes (optional)
                        </label>
                        <textarea
                          value={resolution}
                          onChange={(e) => setResolution(e.target.value)}
                          rows={3}
                          className="input-field"
                          placeholder="Describe how the issue was resolved..."
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Messages */}
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Conversation</h5>
                  
                  <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto space-y-3">
                    {selectedTicket.messages?.map((message, index) => (
                      <div key={index} className={`flex ${
                        message.sender._id === selectedTicket.submittedBy._id ? 'justify-start' : 'justify-end'
                      }`}>
                        <div className={`max-w-xs rounded-lg p-2 ${
                          message.sender._id === selectedTicket.submittedBy._id 
                            ? 'bg-white text-gray-900' 
                            : 'bg-blue-500 text-white'
                        }`}>
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs opacity-75 mt-1">
                            {message.sender.name} - {new Date(message.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Send Message */}
                  {selectedTicket.status !== 'closed' && (
                    <form onSubmit={handleSendMessage} className="space-y-2">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={3}
                        className="input-field"
                        placeholder="Type your response..."
                        required
                      />
                      <button type="submit" className="btn-primary text-sm">
                        <Send className="w-4 h-4 mr-1" />
                        Send Message
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="relative text-center py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-red-100/50 rounded-3xl blur-xl opacity-60" />
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 p-12">
            <div className="bg-gradient-to-br from-orange-100 to-red-100 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-14 h-14 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No assigned tickets</h3>
            <p className="text-gray-600 mb-2">Tickets you assign to yourself will appear here</p>
          </div>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="relative text-center py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-red-100/50 rounded-3xl blur-xl opacity-60" />
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 p-12">
            <div className="bg-gradient-to-br from-orange-100 to-red-100 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-14 h-14 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No tickets found</h3>
            <p className="text-gray-600 mb-2">No tickets match your search criteria</p>
            <p className="text-sm text-gray-500">Try searching with a different Ticket ID</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTickets.map((ticket) => (
            <div key={ticket._id} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-300/40 via-red-300/40 to-pink-300/40 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-orange-200/30 overflow-hidden transform transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl">
                <div className="p-8">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                          #{ticket.ticketNumber}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getStatusColor(ticket.status)}`}>
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                      </div>
                      
                      <h4 className="font-semibold text-lg text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">{ticket.subject}</h4>
                      <div className="bg-gradient-to-r from-orange-50/50 to-red-50/50 rounded-2xl p-4 mb-4">
                        <p className="text-gray-700 leading-relaxed line-clamp-2">{ticket.description}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <span className="text-orange-500 mr-2">📂</span>
                          Category: <span className="font-semibold text-gray-800 ml-1 capitalize">{ticket.category}</span>
                        </span>
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-red-500" />
                          By: <span className="font-semibold text-gray-800 ml-1">{ticket.submittedBy?.name}</span>
                        </span>
                        <span className="flex items-center">
                          <span className="text-pink-500 mr-2">📅</span>
                          Created: <span className="font-semibold text-gray-800 ml-1">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-3 ml-6">
                      <button
                        onClick={() => handleViewDetails(ticket._id)}
                        className="flex items-center px-4 py-2 text-sm font-semibold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Floating Action Buttons for Export */}
          <div className="fixed bottom-8 right-8 flex flex-col space-y-4 z-50">
            {/* CSV Export Button */}
            <button
              onClick={exportToCSV}
              className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-110"
              title="Export to CSV"
            >
              <Download className="w-6 h-6" />
              <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Export CSV
              </div>
            </button>

            {/* PDF Export Button */}
            <button
              onClick={exportToPDF}
              className="group relative bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-110"
              title="Export to PDF"
            >
              <FileText className="w-6 h-6" />
              <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Export PDF
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Profile Tab Component 
const ProfileTab = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      postalCode: user?.address?.postalCode || '',
      country: user?.address?.country || 'Sri Lanka'
    }
  });
  // Validation state
  const [errors, setErrors] = useState({ name: '', phone: '' });

  const validateName = (value) => {
    if (!value.trim()) return 'Name is required';
    if (!/^[A-Za-z\s]+$/.test(value)) return 'Only letters and spaces allowed';
    return '';
  };
  const validatePhone = (value) => {
    if (!value) return ''; // optional
    if (!/^\d{10}$/.test(value)) return 'Phone must be 10 digits';
    return '';
  };
  const isFormValid = () => !errors.name && !errors.phone && profileData.name.trim() && (!profileData.phone || profileData.phone.length === 10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameErr = validateName(profileData.name);
    const phoneErr = validatePhone(profileData.phone);
    setErrors({ name: nameErr, phone: phoneErr });
    if (nameErr || phoneErr) return;
    const result = await updateProfile(profileData);
    if (result.success) setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 via-red-50/50 to-pink-100/50 rounded-3xl blur-xl opacity-60"></div>
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">Profile</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                // Refresh profile data from auth context
                setProfileData({
                  name: user?.name || '',
                  phone: user?.phone || '',
                  address: {
                    street: user?.address?.street || '',
                    city: user?.address?.city || '',
                    postalCode: user?.address?.postalCode || '',
                    country: user?.address?.country || 'Sri Lanka'
                  }
                });
                toast.success('Profile data refreshed!');
              }}
              className="group relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
              title="Refresh Profile"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
              <RefreshCw className="w-5 h-5 relative z-10" />
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 ${
                isEditing ? 'bg-white/80 backdrop-blur-sm hover:bg-gray-50 text-gray-700 hover:text-orange-600 border-2 border-gray-200 hover:border-orange-300' : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white'
              }`}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 via-red-50/50 to-pink-100/50 rounded-3xl blur-xl opacity-60"></div>
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 overflow-hidden">
          <div className="p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2 text-orange-500" />
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (/^[A-Za-z\s]*$/.test(raw)) {
                            setProfileData(prev => ({ ...prev, name: raw }));
                            setErrors(prev => ({ ...prev, name: validateName(raw) }));
                          }
                        }}
                        onBlur={() => setErrors(prev => ({ ...prev, name: validateName(profileData.name) }))
                        }
                        className={`relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 rounded-2xl text-gray-700 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-orange-100 ${errors.name ? 'border-red-400 focus:border-red-400' : 'border-orange-200/40 focus:border-orange-400'}`}
                        required
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-red-500 mr-2">📞</span>
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]{10}"  // Changed from \\d* to [0-9]{10}
                          maxLength={10}
                          value={profileData.phone}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0,10);
                            setProfileData(prev => ({ ...prev, phone: digits }));
                            setErrors(prev => ({ ...prev, phone: validatePhone(digits) }));
                          }}
                          onBlur={() => setErrors(prev => ({ ...prev, phone: validatePhone(profileData.phone) }))
                          }
                          className={`relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 rounded-2xl text-gray-700 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-red-100 ${errors.phone ? 'border-red-400 focus:border-red-400' : 'border-red-200/40 focus:border-red-400'}`}
                          placeholder="0712345678"
                          title="Please enter exactly 10 digits"  // Added custom title
                        />
                      {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="text-pink-500 mr-2">🏠</span>
                    Street Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <input
                      type="text"
                      value={profileData.address.street}
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, street: e.target.value } }))
                      }
                      className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-pink-200/40 rounded-2xl text-gray-700 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                      placeholder="123 Main Street"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-orange-500 mr-2">🏙️</span>
                      City
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="text"
                        value={profileData.address.city}
                        onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, city: e.target.value } }))
                        }
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-orange-200/40 rounded-2xl text-gray-700 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                        placeholder="Colombo"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-red-500 mr-2">📮</span>
                      Postal Code
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="text"
                        value={profileData.address.postalCode}
                        onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, postalCode: e.target.value } }))
                        }
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-red-200/40 rounded-2xl text-gray-700 focus:border-red-400 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                        placeholder="10100"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="submit"
                    disabled={!isFormValid()}
                    className={`font-semibold py-3 px-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${isFormValid() ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-white/80 backdrop-blur-sm hover:bg-gray-50 text-gray-700 hover:text-orange-600 border-2 border-gray-200 hover:border-orange-300 font-semibold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-r from-orange-50/50 to-red-50/50 rounded-2xl p-6 border border-orange-200/30">
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-orange-500 mr-2" />
                      <label className="text-sm font-semibold text-gray-700">Name</label>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                  </div>
                  <div className="bg-gradient-to-r from-red-50/50 to-pink-50/50 rounded-2xl p-6 border border-red-200/30">
                    <div className="flex items-center mb-3">
                      <span className="text-red-500 mr-2">📧</span>
                      <label className="text-sm font-semibold text-gray-700">Email</label>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                  </div>
                  <div className="bg-gradient-to-r from-pink-50/50 to-orange-50/50 rounded-2xl p-6 border border-pink-200/30">
                    <div className="flex items-center mb-3">
                      <span className="text-pink-500 mr-2">📞</span>
                      <label className="text-sm font-semibold text-gray-700">Phone</label>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50/50 to-red-50/50 rounded-2xl p-6 border border-orange-200/30">
                    <div className="flex items-center mb-3">
                      <span className="text-orange-500 mr-2">👤</span>
                      <label className="text-sm font-semibold text-gray-700">Role</label>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{user?.role}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-50/50 to-pink-50/50 rounded-2xl p-6 border border-red-200/30">
                  <div className="flex items-center mb-4">
                    <span className="text-red-500 mr-2 text-lg">🏠</span>
                    <label className="text-lg font-semibold text-gray-700">Address</label>
                  </div>
                  <p className="text-lg text-gray-900 leading-relaxed">
                    {user?.address ? (`${user.address.street}, ${user.address.city}, ${user.address.postalCode}, ${user.address.country}`) : ('Not provided')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Support Dashboard Component
const SupportDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('under-review');

  useEffect(() => {
    const path = location.pathname.split('/')[2];
    if (path && ['under-review', 'reviewed', 'profile'].includes(path)) {
      setActiveTab(path);
    } else {
      navigate('/support/under-review', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-28 left-24 w-4 h-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-70 animate-bounce" style={{animationDuration: '3.5s'}} />
        <div className="absolute top-1/3 right-32 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-60 animate-bounce" style={{animationDelay: '1s', animationDuration: '4.2s'}} />
        <div className="absolute bottom-48 left-1/3 w-5 h-5 bg-gradient-to-br from-red-400 to-pink-500 rounded-full opacity-50 animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}} />
        <div className="absolute bottom-60 right-24 w-2.5 h-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-80 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3.2s'}} />
      </div>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Routes>
          <Route path="/" element={<UnderReviewTab />} />
          <Route path="/under-review" element={<UnderReviewTab />} />
          <Route path="/reviewed" element={<ReviewedTab />} />
          <Route path="/profile" element={<ProfileTab />} />
        </Routes>
      </main>
    </div>
  );
};

export default SupportDashboard;
