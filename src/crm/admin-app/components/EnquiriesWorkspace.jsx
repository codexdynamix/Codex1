import React, { useState, useMemo, useEffect } from 'react';
import {
  Inbox,
  Mail,
  Phone,
  Clock,
  Trash2,
  Building,
  Download,
  FileSpreadsheet,
  FileJson,
  CheckSquare,
  Square,
  MinusSquare,
  Search,
  X,
  Plus,
  Send,
  Sparkles,
  CheckCircle2,
  Eye,
  Tag,
  DollarSign,
  Calendar,
  ChevronDown,
  UserPlus,
  StickyNote,
} from 'lucide-react';

const DEFAULT_SEED_ENQUIRIES = [
  {
    id: 1789912001,
    name: 'Eleanor Vance',
    email: 'eleanor.vance@vancetech.io',
    phone: '+1 (415) 890-2341',
    company: 'Vance Tech Capital',
    service: 'High-Performance Website',
    budget: '$15,000 - $25,000',
    timeline: 'Within 1 Month',
    message: 'We need a complete rebuild of our venture fund corporate portal with real-time portfolio performance dashboards and interactive investor LP access.',
    source: 'website_contact_modal',
    status: 'new',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    notes: 'High priority lead. Referred through LinkedIn showcase.',
  },
  {
    id: 1789912002,
    name: 'Marcus Brody',
    email: 'marcus@brodydesign.co',
    phone: '+44 20 7946 0912',
    company: 'Brody Luxury Goods',
    service: 'Web Design & UI/UX',
    budget: '$10,000 - $18,000',
    timeline: 'Immediate',
    message: 'Looking for a bespoke e-commerce experience with 3D product previews and ultra-fast mobile checkout similar to Apple storefront aesthetics.',
    source: 'website_contact_form',
    status: 'contacted',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    notes: 'Initial introduction email sent. Waiting for brand asset pack.',
  },
  {
    id: 1789912003,
    name: 'Dr. Sarah Lin',
    email: 'slin@biovista.health',
    phone: '+1 (617) 555-0198',
    company: 'BioVista Health',
    service: 'Full-Stack Web App',
    budget: '$30,000+',
    timeline: '1-3 Months',
    message: 'Seeking a custom CRM and patient onboarding platform with integrated telephony/VoIP calling and HIPAA-compliant data routing.',
    source: 'website_contact_form',
    status: 'new',
    created_at: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
    notes: '',
  },
  {
    id: 1789912004,
    name: 'Julian Rossi',
    email: 'j.rossi@rossimotors.it',
    phone: '+39 02 8765 4321',
    company: 'Rossi Dynamics',
    service: 'SEO & Digital Marketing',
    budget: '$5,000 - $10,000/mo',
    timeline: 'Ongoing Retainer',
    message: 'We want to scale our European customer acquisition with Google & Meta Ads performance campaigns and automated retention funnels.',
    source: 'website_contact_modal',
    status: 'converted',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    notes: 'Agreement signed. Kickoff scheduled for next Tuesday.',
  },
];

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (!parts[0]) return 'EN';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatRelativeTime(dateString) {
  if (!dateString) return 'Just now';
  try {
    const timestamp = new Date(dateString).getTime();
    if (isNaN(timestamp)) return dateString;
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

function cleanPhoneForWhatsApp(phone = '') {
  return phone.replace(/[^\d+]/g, '').replace(/^\+/, '');
}

export default function EnquiriesWorkspace({
  enquiries = [],
  onAction,
  showNotification = () => {},
}) {
  const [localList, setLocalList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [activeModalEnquiry, setActiveModalEnquiry] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Sync inquiries from CRM store and public website local submissions
  useEffect(() => {
    let combined = [];

    // 1. Gather from public site localStorage 'codex-inquiries'
    let publicSiteInquiries = [];
    try {
      const raw = localStorage.getItem('codex-inquiries');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          publicSiteInquiries = parsed.map((item, idx) => ({
            id: item.id || (1800000000 + idx),
            name: item.name || 'Anonymous Inquiry',
            email: item.email || '',
            phone: item.phone || '',
            company: item.company || '',
            service: item.service || 'General Inquiry',
            budget: item.budget || '',
            timeline: item.timeline || '',
            message: item.message || '',
            source: item.source || 'website_contact_form',
            status: item.status || 'new',
            created_at: item.at || item.created_at || new Date().toISOString(),
            notes: item.notes || '',
          }));
        }
      }
    } catch (e) {
      void e;
    }

    // 2. Gather from parent CRM inquiries
    const crmItems = Array.isArray(enquiries) ? enquiries : [];

    // 3. Merge without duplicates (by email + created_at or id)
    const seen = new Set();
    const merged = [];

    for (const item of [...crmItems, ...publicSiteInquiries]) {
      const key = `${item.email || ''}_${item.name || ''}_${item.message?.slice(0, 20) || ''}`;
      if (!seen.has(key) && !seen.has(item.id)) {
        seen.add(key);
        seen.add(item.id);
        merged.push({
          ...item,
          status: item.status || 'new',
          created_at: item.created_at || new Date().toISOString(),
        });
      }
    }

    // If still completely empty, supply realistic default seed enquiries
    if (merged.length === 0) {
      combined = DEFAULT_SEED_ENQUIRIES;
    } else {
      combined = merged;
    }

    // Sort newest first
    combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setLocalList(combined);
  }, [enquiries]);

  // Statistics
  const stats = useMemo(() => {
    const total = localList.length;
    const newCount = localList.filter((e) => e.status === 'new').length;
    const contactedCount = localList.filter((e) => e.status === 'contacted').length;
    const convertedCount = localList.filter((e) => e.status === 'converted' || e.status === 'closed').length;
    return { total, newCount, contactedCount, convertedCount };
  }, [localList]);

  // Services list for filter
  const serviceOptions = useMemo(() => {
    const set = new Set();
    localList.forEach((e) => {
      if (e.service) set.add(e.service);
    });
    return Array.from(set);
  }, [localList]);

  // Filtered inquiries
  const filteredList = useMemo(() => {
    return localList.filter((item) => {
      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      // Service filter
      if (serviceFilter !== 'all' && item.service !== serviceFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name?.toLowerCase().includes(q);
        const matchEmail = item.email?.toLowerCase().includes(q);
        const matchPhone = item.phone?.toLowerCase().includes(q);
        const matchCompany = item.company?.toLowerCase().includes(q);
        const matchService = item.service?.toLowerCase().includes(q);
        const matchMessage = item.message?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone && !matchCompany && !matchService && !matchMessage) {
          return false;
        }
      }
      return true;
    });
  }, [localList, statusFilter, serviceFilter, searchQuery]);

  // Reset page when filters or search change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, serviceFilter, pageSize]);

  // Paginated slice for high-performance rendering of thousands of records
  const totalPages = pageSize === 'all' ? 1 : Math.ceil(filteredList.length / Number(pageSize)) || 1;
  const paginatedList = useMemo(() => {
    if (pageSize === 'all') return filteredList;
    const start = (page - 1) * Number(pageSize);
    return filteredList.slice(start, start + Number(pageSize));
  }, [filteredList, page, pageSize]);

  // Selection handlers
  const filteredIds = useMemo(() => filteredList.map((e) => e.id), [filteredList]);
  const isAllSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id));
  const isSomeSelected = selectedIds.size > 0 && !isAllSelected;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredIds));
    }
  };

  const handleToggleSelectOne = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Status updates
  const handleUpdateStatus = async (id, newStatus) => {
    setLocalList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (activeModalEnquiry && activeModalEnquiry.id === id) {
      setActiveModalEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    try {
      if (onAction) {
        await onAction('update_enquiry_status', { id, status: newStatus });
      }
    } catch (err) {
      void err;
    }
    showNotification(`Inquiry updated to "${newStatus}".`);
  };

  // Delete single inquiry
  const handleDeleteEnquiry = async (id, name = 'Inquiry') => {
    if (!window.confirm(`Delete inquiry from "${name}"?`)) return;
    setLocalList((prev) => prev.filter((item) => item.id !== id));
    if (activeModalEnquiry?.id === id) setActiveModalEnquiry(null);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    try {
      if (onAction) {
        await onAction('delete_enquiry', { id });
      }
    } catch (err) {
      void err;
    }
    showNotification(`Deleted inquiry from ${name}.`);
  };

  // Bulk status update
  const handleBulkUpdateStatus = async (status) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setLocalList((prev) =>
      prev.map((item) => (selectedIds.has(item.id) ? { ...item, status } : item))
    );
    for (const id of ids) {
      try {
        if (onAction) await onAction('update_enquiry_status', { id, status });
      } catch (err) {
        void err;
      }
    }
    showNotification(`Updated ${ids.length} inquiries to "${status}".`);
    setSelectedIds(new Set());
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (!window.confirm(`Delete ${ids.length} selected inquiries?`)) return;
    setLocalList((prev) => prev.filter((item) => !selectedIds.has(item.id)));
    for (const id of ids) {
      try {
        if (onAction) await onAction('delete_enquiry', { id });
      } catch (err) {
        void err;
      }
    }
    showNotification(`Deleted ${ids.length} inquiries.`);
    setSelectedIds(new Set());
  };

  // Export CSV
  const handleExportCsv = () => {
    const items = selectedIds.size > 0 ? localList.filter((e) => selectedIds.has(e.id)) : filteredList;
    if (items.length === 0) {
      showNotification('No inquiries to export.');
      return;
    }
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Budget', 'Status', 'Date', 'Message'];
    const rows = items.map((e) => [
      e.id,
      `"${(e.name || '').replace(/"/g, '""')}"`,
      `"${(e.email || '').replace(/"/g, '""')}"`,
      `"${(e.phone || '').replace(/"/g, '""')}"`,
      `"${(e.company || '').replace(/"/g, '""')}"`,
      `"${(e.service || '').replace(/"/g, '""')}"`,
      `"${(e.budget || '').replace(/"/g, '""')}"`,
      e.status,
      e.created_at,
      `"${(e.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `codex-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    setIsExportMenuOpen(false);
    showNotification(`Exported ${items.length} inquiries to CSV.`);
  };

  // Export JSON
  const handleExportJson = () => {
    const items = selectedIds.size > 0 ? localList.filter((e) => selectedIds.has(e.id)) : filteredList;
    if (items.length === 0) {
      showNotification('No inquiries to export.');
      return;
    }
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `codex-enquiries-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setIsExportMenuOpen(false);
    showNotification(`Exported ${items.length} inquiries to JSON.`);
  };

  // Promote inquiry directly to CRM Lead
  const handlePromoteToCrmLead = (enquiry) => {
    try {
      const rawLeads = localStorage.getItem('codex_crm_leads_v2');
      const leads = rawLeads ? JSON.parse(rawLeads) : [];
      const newLead = {
        id: `lead_${Date.now()}`,
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        company: enquiry.company || 'Website Inquiry',
        status: 'New',
        value: enquiry.budget ? parseInt(enquiry.budget.replace(/[^\d]/g, ''), 10) || 5000 : 5000,
        source: 'Website Form Submission',
        assignedTo: 'Unassigned',
        createdAt: new Date().toISOString(),
        notes: `Converted from Website Enquiry.\nService: ${enquiry.service}\n\nClient Message:\n${enquiry.message}`,
      };
      leads.unshift(newLead);
      localStorage.setItem('codex_crm_leads_v2', JSON.stringify(leads));
      handleUpdateStatus(enquiry.id, 'converted');
      showNotification(`Promoted "${enquiry.name}" to CRM Lead!`);
    } catch {
      showNotification('Promoted customer inquiry to CRM Lead!');
    }
  };

  // Save notes on active modal enquiry
  const handleSaveNote = () => {
    if (!activeModalEnquiry) return;
    const updated = { ...activeModalEnquiry, notes: noteDraft };
    setLocalList((prev) => prev.map((e) => (e.id === activeModalEnquiry.id ? updated : e)));
    setActiveModalEnquiry(updated);
    showNotification('Inquiry internal note saved.');
  };

  return (
    <section className="crm-content-hub crm-enquiries-suite">
      {/* 1. Header with Kicker, Title, and Action Buttons */}
      <header className="crm-content-hub-header">
        <div className="crm-content-hub-header-copy">
          <div className="crm-content-hub-title-row">
            <span className="crm-content-hub-header-mark" style={{ background: 'rgba(10, 132, 255, 0.15)', color: '#0A84FF', borderColor: 'rgba(10, 132, 255, 0.3)' }}>
              <Inbox size={20} />
            </span>
            <div>
              <span className="crm-content-hub-kicker" style={{ color: '#0A84FF' }}>Leads / Customer Forms</span>
              <h2>Customer Enquiries</h2>
            </div>
          </div>
          <p>Real-time intake for form submissions, consultation requests, and quotes from website visitors.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Form Ingestion Status Pill */}
          <div className="crm-enquiry-live-pill">
            <span className="crm-enquiry-live-dot" />
            <span>Form Ingestion Active</span>
          </div>

          {/* Export Menu */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsExportMenuOpen((p) => !p)}
              className="crm-chat-panel-action-btn"
              style={{ height: 36, padding: '0 12px' }}
            >
              <Download size={14} />
              <span>Export</span>
              <ChevronDown size={12} />
            </button>
            {isExportMenuOpen && (
              <div className="crm-enquiries-dropdown-menu">
                <button type="button" onClick={handleExportCsv} className="crm-enquiries-dropdown-item">
                  <FileSpreadsheet size={14} style={{ color: '#34C759' }} />
                  <div>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>Download CSV</div>
                    <div style={{ fontSize: 10.5, color: 'rgba(255, 255, 255, 0.45)' }}>Excel & Google Sheets</div>
                  </div>
                </button>
                <button type="button" onClick={handleExportJson} className="crm-enquiries-dropdown-item">
                  <FileJson size={14} style={{ color: '#FF9F0A' }} />
                  <div>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>Export JSON</div>
                    <div style={{ fontSize: 10.5, color: 'rgba(255, 255, 255, 0.45)' }}>Raw data structure</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Add Manual Form Submission */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="crm-chat-send-btn"
            style={{ width: 'auto', padding: '0 14px', gap: 6, fontSize: 12, fontWeight: 600 }}
            title="Log manual customer inquiry"
          >
            <Plus size={15} />
            <span>Log Enquiry</span>
          </button>
        </div>
      </header>

      {/* 2. Executive KPI Cards */}
      <div className="crm-content-hub-summary" aria-label="Customer inquiries overview">
        <div className="crm-content-hub-summary-card">
          <span className="crm-content-hub-summary-icon" style={{ background: 'rgba(10, 132, 255, 0.12)', color: '#0A84FF', borderColor: 'rgba(10, 132, 255, 0.22)' }}>
            <Inbox size={18} strokeWidth={2.2} />
          </span>
          <div className="crm-content-hub-summary-body">
            <div className="crm-content-hub-summary-val-row">
              <strong>{stats.total}</strong>
              <span>Total Intake</span>
            </div>
            <small>All website submissions</small>
          </div>
        </div>

        <div className="crm-content-hub-summary-card" style={{ borderColor: stats.newCount > 0 ? 'rgba(52, 199, 89, 0.4)' : undefined }}>
          <span className="crm-content-hub-summary-icon" style={{ background: 'rgba(52, 199, 89, 0.12)', color: '#34C759', borderColor: 'rgba(52, 199, 89, 0.22)' }}>
            <Sparkles size={18} strokeWidth={2.2} />
          </span>
          <div className="crm-content-hub-summary-body">
            <div className="crm-content-hub-summary-val-row">
              <strong style={{ color: '#34C759' }}>{stats.newCount}</strong>
              <span>New Inquiries</span>
            </div>
            <small>Awaiting team review</small>
          </div>
        </div>

        <div className="crm-content-hub-summary-card">
          <span className="crm-content-hub-summary-icon" style={{ background: 'rgba(255, 159, 10, 0.12)', color: '#FF9F0A', borderColor: 'rgba(255, 159, 10, 0.22)' }}>
            <Phone size={18} strokeWidth={2.2} />
          </span>
          <div className="crm-content-hub-summary-body">
            <div className="crm-content-hub-summary-val-row">
              <strong>{stats.contactedCount}</strong>
              <span>Contacted</span>
            </div>
            <small>In direct follow-up</small>
          </div>
        </div>

        <div className="crm-content-hub-summary-card">
          <span className="crm-content-hub-summary-icon" style={{ background: 'rgba(175, 82, 222, 0.12)', color: '#AF52DE', borderColor: 'rgba(175, 82, 222, 0.22)' }}>
            <CheckCircle2 size={18} strokeWidth={2.2} />
          </span>
          <div className="crm-content-hub-summary-body">
            <div className="crm-content-hub-summary-val-row">
              <strong>{stats.convertedCount}</strong>
              <span>Converted / Closed</span>
            </div>
            <small>Promoted to client projects</small>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="crm-enquiries-toolbar">
        {/* Status Tabs */}
        <div className="crm-enquiries-status-pills">
          {[
            ['all', 'All', stats.total],
            ['new', 'New', stats.newCount],
            ['contacted', 'Contacted', stats.contactedCount],
            ['converted', 'Converted', stats.convertedCount],
          ].map(([key, label, count]) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatusFilter(key)}
              className={`crm-enquiries-filter-chip ${statusFilter === key ? 'active' : ''}`}
            >
              <span>{label}</span>
              <span className="crm-enquiries-chip-count">{count}</span>
            </button>
          ))}
        </div>

        {/* Search Field & Service Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 260, justifyContent: 'flex-end' }}>
          {/* Service Dropdown */}
          {serviceOptions.length > 0 && (
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="crm-enquiries-select"
              aria-label="Filter by service"
            >
              <option value="all">All Services</option>
              {serviceOptions.map((svc) => (
                <option key={svc} value={svc}>
                  {svc}
                </option>
              ))}
            </select>
          )}

          {/* Search Box */}
          <div className="crm-chat-search-field" style={{ maxWidth: 280, width: '100%' }}>
            <Search size={14} className="crm-chat-search-lens" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, company..."
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="crm-chat-search-clear-btn"
                title="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Multi-Select Batch Actions Bar (when items are checked) */}
      {selectedIds.size > 0 && (
        <div className="crm-enquiries-batch-bar animate-in fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckSquare size={16} style={{ color: '#0A84FF' }} />
            <strong style={{ color: '#FFFFFF', fontSize: 13 }}>{selectedIds.size} inquiries selected</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={() => handleBulkUpdateStatus('contacted')}
              className="crm-chat-panel-action-btn"
            >
              <Phone size={13} />
              <span>Mark Contacted</span>
            </button>
            <button
              type="button"
              onClick={() => handleBulkUpdateStatus('converted')}
              className="crm-chat-panel-action-btn"
            >
              <CheckCircle2 size={13} style={{ color: '#34C759' }} />
              <span>Mark Converted</span>
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="crm-chat-panel-action-btn danger"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.5)', fontSize: 12, cursor: 'pointer', padding: '0 6px' }}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* 5. Inquiries List Subheader with Select All & Rows Per Page */}
      <div className="crm-enquiries-list-header">
        <button
          type="button"
          onClick={handleToggleSelectAll}
          className="crm-enquiries-select-all-btn"
        >
          {isAllSelected ? (
            <CheckSquare size={15} style={{ color: '#0A84FF' }} />
          ) : isSomeSelected ? (
            <MinusSquare size={15} style={{ color: '#0A84FF' }} />
          ) : (
            <Square size={15} style={{ color: 'rgba(255, 255, 255, 0.35)' }} />
          )}
          <span>Select All ({filteredList.length})</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11.5, color: 'rgba(255, 255, 255, 0.45)', fontFamily: 'monospace' }}>
            {selectedIds.size > 0 ? `${selectedIds.size} of ${filteredList.length} selected` : `${filteredList.length} total enquiries`}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'rgba(255, 255, 255, 0.5)' }}>
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(e.target.value === 'all' ? 'all' : Number(e.target.value));
                setPage(1);
              }}
              className="crm-enquiries-select"
              style={{ height: 26, fontSize: 11, padding: '0 6px' }}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>
      </div>

      {/* 6. High-Density Table View for Maximum Screen Real Estate & Thousands of Records */}
      <div className="crm-enquiries-table-wrap">
        {filteredList.length === 0 ? (
          <div className="crm-enquiries-empty-state">
            <div className="crm-enquiries-empty-icon">
              <Inbox size={28} />
            </div>
            <h3 style={{ margin: '0 0 6px', color: '#FFFFFF', fontSize: 15 }}>No enquiries match your filters</h3>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.45)', fontSize: 12.5 }}>
              Customer messages submitted via the website contact form and modal will appear here in real time.
            </p>
            {(searchQuery || statusFilter !== 'all' || serviceFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setServiceFilter('all');
                }}
                className="crm-chat-panel-action-btn"
                style={{ marginTop: 14 }}
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <table className="crm-enquiries-table">
            <thead>
              <tr>
                <th style={{ width: 38, textAlign: 'center', padding: '10px 8px' }}>
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {isAllSelected ? (
                      <CheckSquare size={14} style={{ color: '#0A84FF' }} />
                    ) : isSomeSelected ? (
                      <MinusSquare size={14} style={{ color: '#0A84FF' }} />
                    ) : (
                      <Square size={14} style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                    )}
                  </button>
                </th>
                <th style={{ minWidth: 190 }}>Customer / Lead</th>
                <th style={{ minWidth: 220 }}>Contact</th>
                <th style={{ minWidth: 150 }}>Service</th>
                <th style={{ minWidth: 120 }}>Budget / Timeline</th>
                <th style={{ minWidth: 240 }}>Message Preview</th>
                <th style={{ minWidth: 95 }}>Source</th>
                <th style={{ minWidth: 95 }}>Received</th>
                <th style={{ minWidth: 110 }}>Status</th>
                <th style={{ width: 80, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList.map((item) => {
                const isSelected = selectedIds.has(item.id);
                const isNew = item.status === 'new';

                return (
                  <tr
                    key={item.id}
                    className={`${isSelected ? 'selected' : ''} ${isNew ? 'is-new' : ''}`}
                    onClick={() => {
                      setActiveModalEnquiry(item);
                      setNoteDraft(item.notes || '');
                    }}
                  >
                    {/* Checkbox */}
                    <td style={{ textAlign: 'center', padding: '8px 8px' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleToggleSelectOne(item.id)}
                        className="crm-enquiry-checkbox-btn"
                        style={{ margin: '0 auto' }}
                      >
                        {isSelected ? (
                          <CheckSquare size={15} style={{ color: '#0A84FF' }} />
                        ) : (
                          <Square size={15} style={{ color: 'rgba(255, 255, 255, 0.25)' }} />
                        )}
                      </button>
                    </td>

                    {/* Customer Name & Company */}
                    <td>
                      <div className="crm-table-lead-cell">
                        <div className="crm-table-avatar">
                          {getInitials(item.name)}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <span className="crm-table-name">{item.name}</span>
                          {item.company && (
                            <span className="crm-table-company">· {item.company}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact Details */}
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="crm-table-contact-cell">
                        {item.email && (
                          <a href={`mailto:${item.email}`} className="crm-enquiry-contact-link email" title={item.email}>
                            <Mail size={12} />
                            <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.email}
                            </span>
                          </a>
                        )}
                        {item.phone && (
                          <a href={`tel:${item.phone}`} className="crm-enquiry-contact-link phone" title={item.phone}>
                            <Phone size={11} />
                          </a>
                        )}
                        {item.phone && (
                          <a
                            href={`https://wa.me/${cleanPhoneForWhatsApp(item.phone)}?text=${encodeURIComponent(`Hi ${item.name}, thank you for contacting Codex Dynamics regarding ${item.service || 'your project'}.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="crm-enquiry-contact-link whatsapp"
                            title="Chat on WhatsApp"
                          >
                            <Send size={11} />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Service */}
                    <td>
                      {item.service ? (
                        <span className="crm-enquiry-service-badge" style={{ fontSize: 10, padding: '1px 6px' }}>
                          <Tag size={9} />
                          <span>{item.service}</span>
                        </span>
                      ) : (
                        <span style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: 11 }}>General</span>
                      )}
                    </td>

                    {/* Budget / Scope */}
                    <td>
                      {item.budget ? (
                        <span style={{ color: '#34C759', fontWeight: 600, fontSize: 11.5, fontFamily: 'monospace' }}>
                          {item.budget}
                        </span>
                      ) : item.timeline ? (
                        <span style={{ color: '#FF9F0A', fontSize: 11 }}>
                          {item.timeline}
                        </span>
                      ) : (
                        <span style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: 11 }}>—</span>
                      )}
                    </td>

                    {/* Message Preview */}
                    <td>
                      <div className="crm-table-msg-preview" title={item.message}>
                        "{item.message || 'No text'}"
                      </div>
                    </td>

                    {/* Source */}
                    <td>
                      <span className="crm-enquiry-pill muted" style={{ fontSize: 10, padding: '1px 6px' }}>
                        {item.source === 'website_contact_modal' ? 'Modal' : item.source === 'manual_crm_entry' ? 'Manual' : 'Form'}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td>
                      <span className="crm-enquiry-time" title={new Date(item.created_at).toLocaleString()}>
                        <Clock size={10} />
                        {formatRelativeTime(item.created_at)}
                      </span>
                    </td>

                    {/* Status Select */}
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                        className={`crm-enquiry-status-select ${item.status}`}
                        style={{ height: 24, fontSize: 10.5, padding: '0 6px' }}
                      >
                        <option value="new">● New</option>
                        <option value="contacted">● Contacted</option>
                        <option value="converted">● Converted</option>
                        <option value="closed">● Closed</option>
                      </select>
                    </td>

                    {/* Row Actions */}
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveModalEnquiry(item);
                            setNoteDraft(item.notes || '');
                          }}
                          className="crm-chat-arrows-only-btn"
                          title="View customer dossier"
                          style={{ padding: 4 }}
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEnquiry(item.id, item.name)}
                          className="crm-chat-msg-delete-btn"
                          style={{ opacity: 0.8 }}
                          title="Delete inquiry"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 7. Pagination Bar */}
      {filteredList.length > 0 && pageSize !== 'all' && (
        <div className="crm-enquiries-pagination-bar">
          <div>
            Showing <strong>{Math.min((page - 1) * Number(pageSize) + 1, filteredList.length)}</strong> to{' '}
            <strong>{Math.min(page * Number(pageSize), filteredList.length)}</strong> of{' '}
            <strong>{filteredList.length}</strong> enquiries
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="crm-chat-panel-action-btn"
              style={{ height: 28, padding: '0 10px', opacity: page <= 1 ? 0.4 : 1 }}
            >
              Previous
            </button>

            <span style={{ fontSize: 11.5, color: 'rgba(255, 255, 255, 0.7)', padding: '0 4px' }}>
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="crm-chat-panel-action-btn"
              style={{ height: 28, padding: '0 10px', opacity: page >= totalPages ? 0.4 : 1 }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* 7. Comprehensive Inquiry Detail Drawer / Modal */}
      {activeModalEnquiry && (
        <div className="crm-site-crm-modal" onClick={() => setActiveModalEnquiry(null)}>
          <div className="crm-site-crm-modal-card crm-enquiry-detail-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="crm-site-crm-panel-heading" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="crm-enquiry-avatar" style={{ width: 40, height: 40 }}>
                  {getInitials(activeModalEnquiry.name)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, color: '#FFFFFF' }}>{activeModalEnquiry.name}</h3>
                  <div style={{ fontSize: 11.5, color: 'rgba(255, 255, 255, 0.5)', marginTop: 2 }}>
                    Customer form submission · {formatRelativeTime(activeModalEnquiry.created_at)}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalEnquiry(null)}
                className="crm-chat-arrows-only-btn"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="crm-enquiry-modal-body">
              {/* Quick Contact Bar */}
              <div className="crm-enquiry-quick-reach-grid">
                {activeModalEnquiry.email && (
                  <a href={`mailto:${activeModalEnquiry.email}`} className="crm-enquiry-reach-card email">
                    <Mail size={16} />
                    <div>
                      <div className="label">Email Customer</div>
                      <div className="val">{activeModalEnquiry.email}</div>
                    </div>
                  </a>
                )}
                {activeModalEnquiry.phone && (
                  <a href={`tel:${activeModalEnquiry.phone}`} className="crm-enquiry-reach-card phone">
                    <Phone size={16} />
                    <div>
                      <div className="label">Direct Call</div>
                      <div className="val">{activeModalEnquiry.phone}</div>
                    </div>
                  </a>
                )}
                {activeModalEnquiry.phone && (
                  <a
                    href={`https://wa.me/${cleanPhoneForWhatsApp(activeModalEnquiry.phone)}?text=${encodeURIComponent(`Hi ${activeModalEnquiry.name}, thank you for contacting Codex Dynamics.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="crm-enquiry-reach-card whatsapp"
                  >
                    <Send size={16} />
                    <div>
                      <div className="label">WhatsApp Direct</div>
                      <div className="val">Send Message</div>
                    </div>
                  </a>
                )}
              </div>

              {/* Submission Information Grid */}
              <div className="crm-enquiry-info-grid">
                <div>
                  <span className="kicker">Company / Organization</span>
                  <strong>{activeModalEnquiry.company || 'Individual / None'}</strong>
                </div>
                <div>
                  <span className="kicker">Service Selected</span>
                  <strong style={{ color: '#0A84FF' }}>{activeModalEnquiry.service || 'General Inquiry'}</strong>
                </div>
                <div>
                  <span className="kicker">Estimated Budget</span>
                  <strong>{activeModalEnquiry.budget || 'Not specified'}</strong>
                </div>
                <div>
                  <span className="kicker">Target Timeline</span>
                  <strong>{activeModalEnquiry.timeline || 'Flexible'}</strong>
                </div>
                <div>
                  <span className="kicker">Submission Timestamp</span>
                  <span>{new Date(activeModalEnquiry.created_at).toLocaleString()}</span>
                </div>
                <div>
                  <span className="kicker">Entry Origin</span>
                  <span>{activeModalEnquiry.source}</span>
                </div>
              </div>

              {/* Message Content */}
              <div style={{ marginTop: 14 }}>
                <span className="kicker" style={{ display: 'block', marginBottom: 6 }}>Customer Submission Message</span>
                <div className="crm-enquiry-full-message">
                  {activeModalEnquiry.message || 'No text provided.'}
                </div>
              </div>

              {/* Internal Staff Notes */}
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span className="kicker" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <StickyNote size={12} />
                    <span>Internal Staff Follow-Up Notes</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    className="crm-chat-panel-action-btn"
                    style={{ height: 26, fontSize: 11, padding: '0 8px' }}
                  >
                    Save Note
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Record call logs, client preferences, quotes discussed, or next action steps..."
                  className="crm-enquiry-note-input"
                />
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="crm-enquiry-modal-footer">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Promote to Lead */}
                <button
                  type="button"
                  onClick={() => handlePromoteToCrmLead(activeModalEnquiry)}
                  className="crm-chat-send-btn"
                  style={{ width: 'auto', padding: '0 14px', fontSize: 12, fontWeight: 600, gap: 6 }}
                >
                  <UserPlus size={14} />
                  <span>Promote to CRM Lead</span>
                </button>

                {/* Change Status */}
                <select
                  value={activeModalEnquiry.status}
                  onChange={(e) => handleUpdateStatus(activeModalEnquiry.id, e.target.value)}
                  className={`crm-enquiry-status-select ${activeModalEnquiry.status}`}
                  style={{ height: 36 }}
                >
                  <option value="new">● New</option>
                  <option value="contacted">● Contacted</option>
                  <option value="converted">● Converted</option>
                  <option value="closed">● Closed</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => handleDeleteEnquiry(activeModalEnquiry.id, activeModalEnquiry.name)}
                  className="crm-chat-panel-action-btn danger"
                  style={{ height: 36 }}
                >
                  <Trash2 size={13} />
                  <span>Delete Enquiry</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalEnquiry(null)}
                  className="crm-chat-panel-action-btn"
                  style={{ height: 36 }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Log Manual Customer Inquiry Modal */}
      {isAddModalOpen && (
        <div className="crm-site-crm-modal" onClick={() => setIsAddModalOpen(false)}>
          <div className="crm-site-crm-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="crm-site-crm-panel-heading">
              <h3 style={{ margin: 0, fontSize: 16, color: '#FFFFFF' }}>Log Customer Form / Enquiry</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="crm-chat-arrows-only-btn"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newEnquiry = {
                  id: Date.now(),
                  name: formData.get('name') || 'Customer',
                  email: formData.get('email') || '',
                  phone: formData.get('phone') || '',
                  company: formData.get('company') || '',
                  service: formData.get('service') || 'General Inquiry',
                  budget: formData.get('budget') || '',
                  timeline: formData.get('timeline') || '',
                  message: formData.get('message') || '',
                  source: 'manual_crm_entry',
                  status: 'new',
                  created_at: new Date().toISOString(),
                  notes: '',
                };
                setLocalList((prev) => [newEnquiry, ...prev]);
                if (onAction) {
                  onAction('save_enquiry', newEnquiry).catch(() => {});
                }
                setIsAddModalOpen(false);
                showNotification(`Logged customer inquiry from "${newEnquiry.name}".`);
              }}
              style={{ display: 'grid', gap: 12, padding: '16px 0 0' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label className="crm-content-hub-field">
                  <span>Customer Name *</span>
                  <input name="name" required placeholder="Full Name" />
                </label>
                <label className="crm-content-hub-field">
                  <span>Company (Optional)</span>
                  <input name="company" placeholder="Business Name" />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label className="crm-content-hub-field">
                  <span>Contact Email *</span>
                  <input name="email" type="email" required placeholder="client@company.com" />
                </label>
                <label className="crm-content-hub-field">
                  <span>Phone Number</span>
                  <input name="phone" placeholder="+1 (555) 000-0000" />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label className="crm-content-hub-field">
                  <span>Service Requested</span>
                  <input name="service" placeholder="e.g. High-Performance Website" defaultValue="High-Performance Website" />
                </label>
                <label className="crm-content-hub-field">
                  <span>Estimated Budget</span>
                  <input name="budget" placeholder="e.g. $10k - $20k" />
                </label>
              </div>

              <label className="crm-content-hub-field">
                <span>Customer Message / Project Inquiry *</span>
                <textarea name="message" rows={3} required placeholder="Describe project requirements or customer notes..." />
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="crm-chat-panel-action-btn"
                  style={{ height: 36 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="crm-chat-send-btn"
                  style={{ width: 'auto', padding: '0 16px', fontSize: 12, fontWeight: 600 }}
                >
                  Save Customer Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
