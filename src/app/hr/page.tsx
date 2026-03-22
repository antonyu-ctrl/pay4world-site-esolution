'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { employees } from '@/data/employees';
// import { attendanceRecords, dailyAttendance } from '@/data/attendance';
import { payrollEntries } from '@/data/payroll';
import { departments } from '@/data/departments';
import { formatCurrency } from '@/lib/utils';
import { STAT_GRADIENTS } from '@/lib/constants';

import Card from '@/components/shared/Card';
import StatCard from '@/components/shared/StatCard';
import SectionHeader from '@/components/shared/SectionHeader';
import SearchInput from '@/components/shared/SearchInput';
import FilterTabs from '@/components/shared/FilterTabs';
import Button from '@/components/shared/Button';
import Badge from '@/components/shared/Badge';
// import BarChartCard from '@/components/charts/BarChartCard';

import {
  Users,
  UserCheck,
  UserMinus,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutGrid,
  List,
  Mail,
  Phone,
  Calendar,
  Building2,
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;

const monthOptions = [
  '2026년 3월',
  '2026년 2월',
  '2026년 1월',
  '2025년 12월',
  '2025년 11월',
  '2025년 10월',
];

export default function HRPage() {
  const { lang, t } = useLanguage();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedDept, setExpandedDept] = useState<string | null>(null);
  const [payrollMonth, setPayrollMonth] = useState('2026년 3월');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  // Dashboard counts
  const totalCount = employees.length;
  const activeCount = employees.filter((e) => e.status === 'active').length;
  const leaveCount = employees.filter((e) => e.status === 'leave').length;
  const resignedCount = employees.filter((e) => e.status === 'resigned').length;

  // Department list for filter
  const deptOptions = useMemo(() => {
    const depts = [...new Set(employees.map((e) => e.department))];
    return [
      { id: 'all', label: t.common.all },
      ...depts.map((d) => {
        const emp = employees.find((e) => e.department === d);
        return { id: d, label: lang === 'ko' ? d : (emp?.departmentEn || d) };
      }),
    ];
  }, [lang, t.common.all]);

  // Status filter tabs
  const statusOptions = [
    { id: 'all', label: lang === 'ko' ? '전체' : 'All' },
    { id: 'active', label: lang === 'ko' ? '재직' : 'Active' },
    { id: 'leave', label: lang === 'ko' ? '휴가' : 'Leave' },
    { id: 'resigned', label: lang === 'ko' ? '퇴사' : 'Resigned' },
  ];

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    let result = employees;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) => e.name.toLowerCase().includes(q) || e.nameEn.toLowerCase().includes(q)
      );
    }
    if (departmentFilter !== 'all') {
      result = result.filter((e) => e.department === departmentFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter((e) => e.status === statusFilter);
    }
    return result;
  }, [searchQuery, departmentFilter, statusFilter]);

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page on filter change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const handleStatusChange = (id: string) => {
    setStatusFilter(id);
    setCurrentPage(1);
  };
  const handleDeptChange = (value: string) => {
    setDepartmentFilter(value);
    setCurrentPage(1);
  };

  // Payroll totals
  const payrollTotals = useMemo(() => {
    const totals = payrollEntries.reduce(
      (acc, e) => ({
        baseSalary: acc.baseSalary + e.baseSalary,
        allowances: acc.allowances + e.allowances,
        deductions: acc.deductions + e.deductions,
        netPay: acc.netPay + e.netPay,
      }),
      { baseSalary: 0, allowances: 0, deductions: 0, netPay: 0 }
    );
    return totals;
  }, []);

  // Status badge
  const renderStatusBadge = (status: string) => {
    const map: Record<string, { variant: 'active' | 'leave' | 'resigned'; label: string }> = {
      active: { variant: 'active', label: lang === 'ko' ? '재직' : 'Active' },
      leave: { variant: 'leave', label: lang === 'ko' ? '휴직' : 'Leave' },
      resigned: { variant: 'resigned', label: lang === 'ko' ? '퇴직' : 'Resigned' },
    };
    const s = map[status] || map.active;
    return <Badge variant={s.variant} label={s.label} />;
  };

  // Avatar
  const Avatar = ({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) => {
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];
    const idx = name.charCodeAt(0) % colors.length;
    const sizeClasses = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' };
    return (
      <div className={`${colors[idx]} ${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold shrink-0`}>
        {name.charAt(0)}
      </div>
    );
  };

  // Format date
  const fmtDate = (d: string) => {
    const dt = new Date(d);
    return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t.hr.title}</h1>
        <p className="text-gray-500 mt-1">{t.hr.subtitle}</p>
      </div>

      {/* Section 1 - Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={lang === 'ko' ? '전체 직원' : 'Total Employees'}
          value={`${totalCount}${lang === 'ko' ? '명' : ''}`}
          icon={<Users />}
          gradient={STAT_GRADIENTS.blue}
        />
        <StatCard
          title={lang === 'ko' ? '재직 중' : 'Active'}
          value={`${activeCount}${lang === 'ko' ? '명' : ''}`}
          icon={<UserCheck />}
          gradient={STAT_GRADIENTS.green}
        />
        <StatCard
          title={lang === 'ko' ? '휴가 중' : 'On Leave'}
          value={`${leaveCount}${lang === 'ko' ? '명' : ''}`}
          icon={<Clock />}
          gradient={STAT_GRADIENTS.orange}
        />
        <StatCard
          title={lang === 'ko' ? '퇴사' : 'Resigned'}
          value={`${resignedCount}${lang === 'ko' ? '명' : ''}`}
          icon={<UserMinus />}
          gradient={STAT_GRADIENTS.gray}
        />
      </div>

      {/* Section 2 - Employee Directory */}
      <Card>
        <SectionHeader title={lang === 'ko' ? '직원 목록' : 'Employee Directory'} />
        {/* Filters Bar */}
        <div className="mt-4 flex flex-col lg:flex-row lg:items-center gap-3">
          <SearchInput
            placeholder={lang === 'ko' ? '직원 이름 검색...' : 'Search by name...'}
            value={searchQuery}
            onChange={handleSearchChange}
            className="lg:w-56"
          />
          <div className="relative">
            <select
              value={departmentFilter}
              onChange={(e) => handleDeptChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full lg:w-auto"
            >
              {deptOptions.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <FilterTabs options={statusOptions} activeId={statusFilter} onChange={handleStatusChange} />
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-brand-100 text-brand-700' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-brand-100 text-brand-700' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table View */}
        {viewMode === 'table' && (
          <>
            {/* Mobile Card View */}
            <div className="mt-5 md:hidden space-y-3">
              {paginatedEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer"
                  onClick={() => setSelectedEmployee(selectedEmployee === emp.id ? null : emp.id)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar name={emp.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {lang === 'ko' ? emp.name : emp.nameEn}
                        </h4>
                        {renderStatusBadge(emp.status)}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {lang === 'ko' ? emp.position : emp.positionEn}
                      </p>
                      <p className="text-xs text-gray-500">
                        {lang === 'ko' ? emp.department : emp.departmentEn}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{emp.phone}</span>
                    </div>
                  </div>
                  {selectedEmployee === emp.id && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t.hr.bio}</p>
                        <p className="text-sm text-gray-700">{lang === 'ko' ? emp.bio : emp.bioEn}</p>
                      </div>
                      {emp.skills && emp.skills.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t.hr.skills}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {emp.skills.map((skill, i) => (
                              <span key={i} className="bg-brand-100 text-brand-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="mt-5 overflow-x-auto hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 text-gray-500 font-medium w-12" />
                    <th className="text-left py-3 px-3 text-gray-500 font-medium">{t.hr.employeeName}</th>
                    <th className="text-left py-3 px-3 text-gray-500 font-medium">{t.hr.position}</th>
                    <th className="text-left py-3 px-3 text-gray-500 font-medium">{t.hr.department}</th>
                    <th className="text-left py-3 px-3 text-gray-500 font-medium">{t.hr.email}</th>
                    <th className="text-left py-3 px-3 text-gray-500 font-medium">{t.hr.phone}</th>
                    <th className="text-center py-3 px-3 text-gray-500 font-medium">{t.hr.status}</th>
                    <th className="text-left py-3 px-3 text-gray-500 font-medium">{t.hr.joinDate}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEmployees.map((emp) => (
                    <React.Fragment key={emp.id}>
                      <tr
                        onClick={() => setSelectedEmployee(selectedEmployee === emp.id ? null : emp.id)}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-3">
                          <Avatar name={emp.name} size="sm" />
                        </td>
                        <td className="py-3 px-3 text-gray-900 font-medium">
                          {lang === 'ko' ? emp.name : emp.nameEn}
                        </td>
                        <td className="py-3 px-3 text-gray-600">
                          {lang === 'ko' ? emp.position : emp.positionEn}
                        </td>
                        <td className="py-3 px-3 text-gray-600">
                          {lang === 'ko' ? emp.department : emp.departmentEn}
                        </td>
                        <td className="py-3 px-3 text-gray-500 text-xs">{emp.email}</td>
                        <td className="py-3 px-3 text-gray-500 text-xs">{emp.phone}</td>
                        <td className="py-3 px-3 text-center">{renderStatusBadge(emp.status)}</td>
                        <td className="py-3 px-3 text-gray-500 text-xs">{fmtDate(emp.joinDate)}</td>
                      </tr>
                      {selectedEmployee === emp.id && (
                        <tr key={`${emp.id}-detail`} className="bg-gray-50">
                          <td colSpan={8} className="px-6 py-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t.hr.bio}</p>
                                <p className="text-sm text-gray-700">{lang === 'ko' ? emp.bio : emp.bioEn}</p>
                              </div>
                              {emp.skills && emp.skills.length > 0 && (
                                <div className="flex-1">
                                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t.hr.skills}</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {emp.skills.map((skill, i) => (
                                      <span key={i} className="bg-brand-100 text-brand-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedEmployees.map((emp) => (
              <div
                key={emp.id}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <Avatar name={emp.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">
                      {lang === 'ko' ? emp.name : emp.nameEn}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {lang === 'ko' ? emp.position : emp.positionEn}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Building2 className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {lang === 'ko' ? emp.department : emp.departmentEn}
                      </span>
                    </div>
                    <div className="mt-2">{renderStatusBadge(emp.status)}</div>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{emp.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{fmtDate(emp.joinDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-brand-600 text-white'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </Card>

      {/* Section 3 - Payroll Summary */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '급여 현황' : 'Payroll Summary'}
          action={
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={payrollMonth}
                  onChange={(e) => setPayrollMonth(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {monthOptions.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <Button variant="secondary" size="sm">
                <Download className="w-4 h-4 mr-1.5" />
                {lang === 'ko' ? '급여명세서 일괄 다운로드' : 'Download All Payslips'}
              </Button>
            </div>
          }
        />

        {/* Mobile Card View */}
        <div className="mt-5 md:hidden space-y-3">
          {payrollEntries.map((entry) => (
            <div key={entry.employeeId} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {lang === 'ko' ? entry.employeeName : entry.employeeNameEn}
                  </p>
                  <p className="text-xs text-gray-500">
                    {lang === 'ko' ? entry.department : entry.departmentEn}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">{t.hr.baseSalary}</p>
                  <p className="text-gray-700">{formatCurrency(entry.baseSalary)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">{t.hr.allowances}</p>
                  <p className="text-emerald-600">+{formatCurrency(entry.allowances)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">{t.hr.deductions}</p>
                  <p className="text-red-500">-{formatCurrency(entry.deductions)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">{t.hr.netPay}</p>
                  <p className="text-gray-900 font-bold">{formatCurrency(entry.netPay)}</p>
                </div>
              </div>
            </div>
          ))}
          {/* Mobile Totals Card */}
          <div className="bg-gray-50 rounded-xl border-2 border-gray-300 p-4">
            <p className="text-sm font-bold text-gray-900 mb-3">{t.common.total}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">{t.hr.baseSalary}</p>
                <p className="font-bold text-gray-900">{formatCurrency(payrollTotals.baseSalary)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">{t.hr.allowances}</p>
                <p className="font-bold text-emerald-600">+{formatCurrency(payrollTotals.allowances)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">{t.hr.deductions}</p>
                <p className="font-bold text-red-500">-{formatCurrency(payrollTotals.deductions)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">{t.hr.netPay}</p>
                <p className="font-bold text-gray-900">{formatCurrency(payrollTotals.netPay)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="mt-5 overflow-x-auto hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 text-gray-500 font-medium">{lang === 'ko' ? '직원명' : 'Employee'}</th>
                <th className="text-left py-3 px-3 text-gray-500 font-medium">{t.hr.department}</th>
                <th className="text-right py-3 px-3 text-gray-500 font-medium">{t.hr.baseSalary}</th>
                <th className="text-right py-3 px-3 text-gray-500 font-medium">{t.hr.allowances}</th>
                <th className="text-right py-3 px-3 text-gray-500 font-medium">{t.hr.deductions}</th>
                <th className="text-right py-3 px-3 text-gray-500 font-medium">{t.hr.netPay}</th>
              </tr>
            </thead>
            <tbody>
              {payrollEntries.map((entry) => (
                <tr key={entry.employeeId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3 text-gray-900 font-medium">
                    {lang === 'ko' ? entry.employeeName : entry.employeeNameEn}
                  </td>
                  <td className="py-3 px-3 text-gray-600">
                    {lang === 'ko' ? entry.department : entry.departmentEn}
                  </td>
                  <td className="py-3 px-3 text-right text-gray-700">{formatCurrency(entry.baseSalary)}</td>
                  <td className="py-3 px-3 text-right text-emerald-600">+{formatCurrency(entry.allowances)}</td>
                  <td className="py-3 px-3 text-right text-red-500">-{formatCurrency(entry.deductions)}</td>
                  <td className="py-3 px-3 text-right text-gray-900 font-bold">{formatCurrency(entry.netPay)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 bg-gray-50">
                <td className="py-3 px-3 font-bold text-gray-900">{t.common.total}</td>
                <td className="py-3 px-3" />
                <td className="py-3 px-3 text-right font-bold text-gray-900">{formatCurrency(payrollTotals.baseSalary)}</td>
                <td className="py-3 px-3 text-right font-bold text-emerald-600">+{formatCurrency(payrollTotals.allowances)}</td>
                <td className="py-3 px-3 text-right font-bold text-red-500">-{formatCurrency(payrollTotals.deductions)}</td>
                <td className="py-3 px-3 text-right font-bold text-gray-900">{formatCurrency(payrollTotals.netPay)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Section 5 - Department Overview */}
      <Card>
        <SectionHeader title={lang === 'ko' ? '부서 현황' : 'Department Overview'} />
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => {
            const isExpanded = expandedDept === dept.id;
            const utilColor =
              dept.budgetUtilization >= 95
                ? 'bg-red-500'
                : dept.budgetUtilization >= 80
                ? 'bg-yellow-500'
                : 'bg-green-500';
            const utilBgColor =
              dept.budgetUtilization >= 95
                ? 'bg-red-100'
                : dept.budgetUtilization >= 80
                ? 'bg-yellow-100'
                : 'bg-green-100';

            return (
              <div
                key={dept.id}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setExpandedDept(isExpanded ? null : dept.id)}
                  className="w-full p-5 text-left"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {lang === 'ko' ? dept.nameKo : dept.nameEn}
                      </h4>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {lang === 'ko' ? `팀장: ${dept.head}` : `Lead: ${dept.headEn}`}
                      </p>
                    </div>
                    <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-600">
                        {dept.employeeCount}{lang === 'ko' ? '명' : ' members'}
                      </span>
                    </div>
                    <div className="text-gray-600">
                      {formatCurrency(dept.budget)}{lang === 'ko' ? '/월' : '/mo'}
                    </div>
                  </div>

                  {/* Budget utilization bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500">{lang === 'ko' ? '예산 집행률' : 'Budget Utilization'}</span>
                      <span className={`font-semibold ${dept.budgetUtilization >= 95 ? 'text-red-600' : dept.budgetUtilization >= 80 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {dept.budgetUtilization}%
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full ${utilBgColor}`}>
                      <div
                        className={`h-2 rounded-full ${utilColor} transition-all`}
                        style={{ width: `${Math.min(dept.budgetUtilization, 100)}%` }}
                      />
                    </div>
                  </div>
                </button>

                {/* Expanded member list */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50 px-5 py-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      {lang === 'ko' ? '부서원' : 'Members'}
                    </p>
                    <ul className="space-y-2">
                      {dept.members.map((member, mi) => {
                        // Find the employee to get status
                        const emp = employees.find((e) => e.name === member.name);
                        return (
                          <li key={mi} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-bold text-white">
                                {member.name.charAt(0)}
                              </div>
                              <span className="text-sm text-gray-800">
                                {lang === 'ko' ? member.name : member.nameEn}
                              </span>
                              <span className="text-xs text-gray-400">
                                {lang === 'ko' ? member.position : member.positionEn}
                              </span>
                            </div>
                            {emp && renderStatusBadge(emp.status)}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
