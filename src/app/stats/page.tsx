"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Users,
  TrendingUp,
  Smartphone,
  Monitor,
  RefreshCw,
  Copy,
  Check,
  ArrowRight,
  SlidersHorizontal,
  Hotel,
  ShieldCheck,
  Clock,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  KeyRound,
  ShieldAlert,
  Calendar,
  CalendarDays,
  BarChart3,
  Filter,
  Download,
  Timer,
  Flame,
  MousePointerClick,
  Layers,
} from "lucide-react";
import { DashboardReport } from "@/lib/analytics-store";
import { toast } from "sonner";
import { hotelConfig } from "@/config/hotel.config";

// Convert all numeric digits to Persian numerals using Estedad font glyphs
const toPersianDigits = (val: string | number | undefined | null): string => {
  if (val === undefined || val === null) return "";
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(val)
    .replace(/\d/g, (d) => persianDigits[Number(d)])
    .replace(/,/g, "٬");
};

export default function AnalyticsStatsPage() {
  const [data, setData] = useState<DashboardReport | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Date Filter State
  const [selectedRange, setSelectedRange] = useState<"today" | "7d" | "30d" | "all" | "custom">("7d");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaSvg, setCaptchaSvg] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [refreshingCaptcha, setRefreshingCaptcha] = useState(false);
  const [authError, setAuthError] = useState("");
  const [submittingAuth, setSubmittingAuth] = useState(false);

  // Link Generator State
  const [genSource, setGenSource] = useState("instagram");
  const [genMedium, setGenMedium] = useState("story");
  const [genCampaign, setGenCampaign] = useState("summer_pilot");

  const fetchCaptcha = async () => {
    try {
      setRefreshingCaptcha(true);
      const res = await fetch("/api/analytics/auth?action=captcha");
      const json = await res.json();
      if (json.success) {
        setCaptchaSvg(json.svg);
        setCaptchaToken(json.token);
        setCaptchaInput("");
      }
    } catch {
      toast.error("خطا در بارگذاری تصویر امنیتی");
    } finally {
      setRefreshingCaptcha(false);
    }
  };

  const fetchStats = async (isManual = false, overrideRange?: string) => {
    if (isManual) setRefreshing(true);
    try {
      const activeRange = overrideRange !== undefined ? overrideRange : selectedRange;
      let url = `/api/analytics?range=${activeRange}`;
      if (activeRange === "custom") {
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
      }

      const res = await fetch(url);

      if (res.status === 401) {
        setIsAuthenticated(false);
        setData(null);
        fetchCaptcha();
        if (isManual) toast.error("نشست امنیتی منقضی شده است. لطفاً مجدداً وارد شوید.");
        return;
      }

      const json = await res.json();
      if (json.success && json.report) {
        setData(json.report);
        setIsAuthenticated(true);
        if (isManual) toast.success("داده‌های آماری به‌روزرسانی شدند");
      }
    } catch {
      toast.error("خطا در دریافت اطلاعات آماری");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/analytics/auth?action=me");
        const json = await res.json();
        if (json.authenticated) {
          setIsAuthenticated(true);
          fetchStats();
        } else {
          setIsAuthenticated(false);
          setLoading(false);
          fetchCaptcha();
        }
      } catch {
        setIsAuthenticated(false);
        setLoading(false);
        fetchCaptcha();
      }
    };

    checkSession();

    // Auto-refresh every 30 seconds if authenticated
    const interval = setInterval(() => {
      if (isAuthenticated) fetchStats(false);
    }, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, selectedRange]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setAuthError("لطفاً نام کاربری را وارد کنید.");
      return;
    }
    if (!passwordInput.trim()) {
      setAuthError("لطفاً رمز عبور را وارد کنید.");
      return;
    }
    if (!captchaInput.trim()) {
      setAuthError("لطفاً کد امنیتی داخل تصویر را وارد کنید.");
      return;
    }

    setSubmittingAuth(true);
    setAuthError("");

    try {
      const res = await fetch("/api/analytics/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          username: usernameInput.trim(),
          password: passwordInput.trim(),
          captchaInput: captchaInput.trim(),
          captchaToken,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setIsAuthenticated(true);
        toast.success("ورود امن با موفقیت انجام شد.");
        fetchStats();
      } else {
        setAuthError(json.error || "نام کاربری، رمز عبور یا کد امنیتی نادرست است.");
        fetchCaptcha();
      }
    } catch {
      setAuthError("خطا در برقراری ارتباط امن با سرور.");
      fetchCaptcha();
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/analytics/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } finally {
      setIsAuthenticated(false);
      setData(null);
      setUsernameInput("");
      setPasswordInput("");
      setCaptchaInput("");
      setAuthError("");
      fetchCaptcha();
      toast.info("با موفقیت از سیستم خارج شدید.");
    }
  };


  const generatedUrl = typeof window !== "undefined"
    ? `${window.location.origin}/?utm_source=${genSource}&utm_medium=${genMedium}&utm_campaign=${genCampaign}`
    : `${hotelConfig.meta.siteUrl}/?utm_source=${genSource}&utm_medium=${genMedium}&utm_campaign=${genCampaign}`;

  const copyGeneratedLink = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    toast.success("لینک کمپین کپی شد");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCsv = () => {
    if (!data) {
      toast.error("داده‌ای برای خروجی گرفتن وجود ندارد");
      return;
    }

    try {
      const rows: string[] = [];

      // Title & Metadata
      rows.push("گزارش پایش هوشمند ترافیک و سرنخ‌های فروش هتل آوات اصفهان");
      rows.push(`بازه زمانی گزارش:,${data.summary.dateRangeLabel || "انتخاب شده"}`);
      rows.push(`تاریخ خروجی فایل:,${new Date().toLocaleDateString("fa-IR")} ${new Date().toLocaleTimeString("fa-IR")}`);
      rows.push("");

      // Executive Summary
      rows.push("خلاصه شاخص‌های عملکرد کلیدی (Executive KPIs)");
      rows.push(`کل بازدیدکنندگان یکتا,${data.summary.totalVisitors}`);
      rows.push(`تعداد لیدهای تماس و واتس‌اپ,${data.summary.totalLeads}`);
      rows.push(`تماس‌های تلفنی ثبت‌شده,${data.summary.totalCalls}`);
      rows.push(`چت‌های واتس‌اپ ثبت‌شده,${data.summary.totalWhatsApp}`);
      rows.push(`نرخ تبدیل بازدید به لید (CR %),${data.summary.conversionRate}%`);
      rows.push(`میانگین مدت حضور در سایت,${data.summary.avgDwellTimeFormatted || "-"}`);
      rows.push(`سهم کاربران موبایل,${data.devices.mobileShare}%`);
      rows.push(`برترین کانال جذب,${data.summary.topSource}`);
      rows.push(`محبوب‌ترین اتاق استعلام شده,${data.summary.topRoom}`);
      rows.push("");

      // Scroll Depth & Engagement
      rows.push("رفتار و کیفیت ترافیک: عمق اسکرول صفحه (Scroll Depth)");
      rows.push(`ورود به هیرو (۲۵٪),${data.engagement?.scrollDepth?.depth25 || 0}%`);
      rows.push(`مشاهده و بررسی اتاق‌ها (۵۰٪),${data.engagement?.scrollDepth?.depth50 || 0}%`);
      rows.push(`بررسی موقعیت و دسترسی (۷۵٪),${data.engagement?.scrollDepth?.depth75 || 0}%`);
      rows.push(`پایان صفحه و گالری (۱۰۰٪),${data.engagement?.scrollDepth?.depth100 || 0}%`);
      rows.push("");

      // CTA Placements
      rows.push("محل اقدام به تماس مسافران (CTA Placements)");
      rows.push("محل کلیک,تعداد لید,سهم درصد");
      if (data.engagement?.ctaPlacements) {
        data.engagement.ctaPlacements.forEach((p) => {
          rows.push(`"${p.label}",${p.count},${p.share}%`);
        });
      }
      rows.push("");

      // Channels Table
      rows.push("عملکرد تفکیکی کانال‌های ورودی (UTM Attribution)");
      rows.push("کانال ورودی (Source),کمپین (Campaign),رسانه (Medium),بازدیدکنندگان,تماس تلفنی,واتس‌اپ,مجموع لیدها,نرخ تبدیل (CR %)");
      data.channels.forEach((c) => {
        rows.push(`"${c.source}","${c.campaign || "—"}","${c.medium || "—"}",${c.visitors},${c.calls},${c.whatsapp},${c.leads},${c.conversionRate}%`);
      });
      rows.push("");

      // Rooms Breakdown
      rows.push("تقاضای رزرو به تفکیک اتاق‌های عمارت");
      rows.push("نام اتاق,تعداد لید,تماس تلفنی,واتس‌اپ,سهم درصد");
      data.rooms.forEach((r) => {
        rows.push(`"${r.room}",${r.leads},${r.calls},${r.whatsapp},${r.share}%`);
      });
      rows.push("");

      // Heatmap Info
      rows.push("الگوی زمانی تقاضا و رزرو (Time-based Pattern)");
      rows.push(`ساعت طلایی بیشترین تماس:,${data.heatmap?.peakHourLabel || "۲۰:۰۰ تا ۲۳:۰۰"}`);
      rows.push(`روزهای اوج تقاضای هفتگی:,${data.heatmap?.peakDayLabel || "چهارشنبه و پنج‌شنبه"}`);
      rows.push("");

      // Recent Leads Log
      rows.push("لاگ زنده آخرین سرنخ‌های دریافتی (Recent Leads Feed)");
      rows.push("ردیف,نوع رویداد,اتاق استعلام‌شده,منبع ورودی,کمپین,زمان ثبت");
      data.recentLeads.forEach((l, idx) => {
        const typeStr = l.eventName.includes("call") ? "تماس تلفنی" : "پیام واتس‌اپ";
        const dateStr = new Date(l.timestamp).toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        rows.push(`${idx + 1},"${typeStr}","${l.room || "استعلام عمومی"}","${l.utmSource || "direct"}","${l.utmCampaign || "—"}","${dateStr}"`);
      });

      // Encode UTF-8 BOM so Persian characters display natively in Excel
      const csvContent = "\uFEFF" + rows.join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      const fileDate = new Date().toISOString().split("T")[0];
      downloadLink.href = url;
      downloadLink.setAttribute("download", `${hotelConfig.brand.id}-analytics-${fileDate}.csv`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);

      toast.success("گزارش اکسل (CSV) با موفقیت دریافت شد");
    } catch {
      toast.error("خطا در ایجاد خروجی فایل");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6 text-center" dir="rtl">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#172554] animate-spin" />
          <p className="text-sm font-semibold text-[#172554]">در حال بررسی نشست امنیتی و بارگذاری...</p>
        </div>
      </div>
    );
  }

  // Render Secure Login Lock Screen if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center p-4 sm:p-6 font-estedad stats-dashboard" dir="rtl">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#dfd9cc] shadow-xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2.5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shadow-inner text-[#172554]">
              <Lock className="w-8 h-8 text-amber-700" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#172554] text-white">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>سامانه امن پایش و تحلیلی</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-[#172554]">
              ورود به داشبورد تحلیلی
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#172554] block">
                نام کاربری
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value);
                  if (authError) setAuthError("");
                }}
                autoFocus
                placeholder="نام کاربری..."
                className="w-full h-11 px-3.5 rounded-xl bg-[#faf8f5] border border-[#dfd9cc] text-sm font-medium text-[#172554] focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition-all text-left"
                dir="ltr"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#172554] block">
                رمز عبور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError("");
                  }}
                  placeholder="رمز عبور..."
                  className="w-full h-11 pr-3.5 pl-11 rounded-xl bg-[#faf8f5] border border-[#dfd9cc] text-sm font-medium text-[#172554] focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition-all text-left"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Visual SVG CAPTCHA */}
            <div className="space-y-2 pt-1 border-t border-[#f0ece4]">
              <div className="flex items-center justify-between text-xs font-bold text-[#172554]">
                <span>کد امنیتی (کپچا)</span>
                <button
                  type="button"
                  onClick={fetchCaptcha}
                  disabled={refreshingCaptcha}
                  className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${refreshingCaptcha ? "animate-spin" : ""}`} />
                  <span>تصویر جدید</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="shrink-0 flex items-center justify-center select-none"
                  dangerouslySetInnerHTML={{ __html: captchaSvg }}
                />

                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => {
                    setCaptchaInput(e.target.value);
                    if (authError) setAuthError("");
                  }}
                  placeholder="کد تصویر..."
                  maxLength={6}
                  className="flex-1 h-[54px] px-3 rounded-xl bg-[#faf8f5] border border-[#dfd9cc] text-base font-black font-mono tracking-widest text-[#172554] uppercase text-center focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition-all"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Error Alert */}
            {authError && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold leading-relaxed">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submittingAuth}
              className="w-full h-12 rounded-xl bg-[#172554] hover:bg-[#0f172a] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98 disabled:opacity-70 mt-2"
            >
              {submittingAuth ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>در حال اعتبارسنجی امن...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span> ورود</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-[#f0ece4] flex items-center justify-between text-xs text-stone-500">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-stone-600 hover:text-[#172554] font-medium transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>بازگشت به صفحه اصلی</span>
            </Link>

            <span className="text-[11px] text-stone-400">سامانه رمزنگاری‌شده</span>
          </div>
        </div>
      </div>
    );
  }


  const summary = data?.summary || {
    totalVisitors: 0,
    totalPageviews: 0,
    totalLeads: 0,
    totalCalls: 0,
    totalWhatsApp: 0,
    conversionRate: 0,
    topSource: "direct",
    topRoom: "اتاق تالار آیینه",
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#172554] p-4 sm:p-6 lg:p-10 select-none font-estedad stats-dashboard" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8 font-estedad">
        {/* Top Header & Brand Bar */}
        <header className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dfd9cc] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#172554] text-white font-estedad">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                پایلوت
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 font-estedad">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                داده‌های زنده
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#172554] tracking-tight font-estedad">
              داشبورد پایش تقاضا و کانال‌های ورودی
            </h1>
            <p className="text-xs sm:text-sm text-[#555f6d]">
              سنجش تقاضای رزرو مستقیم، تبدیل تماس‌ها به رزرو قطعی و سهم کانال‌های ورودی {hotelConfig.meta.fullNameFa}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="flex-1 sm:flex-initial h-10 px-4 rounded-xl bg-[#faf8f5] hover:bg-slate-100 border border-[#dfd9cc] text-xs font-semibold text-[#172554] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>به‌روزرسانی</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="flex-1 sm:flex-initial h-10 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="دریافت فایل اکسل تفصیلی گزارش"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>خروجی اکسل (CSV)</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="h-10 px-4 rounded-xl bg-[#172554] hover:bg-[#0f172a] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <span>مشاهده سایت</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="h-10 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="خروج از نشست مدیریتی"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </header>

        {/* Date & Period Filter Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#dfd9cc] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Quick Period Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <div className="flex items-center gap-1 bg-[#f7f5f0] p-1 rounded-xl border border-[#dfd9cc]/60">
              <button
                onClick={() => {
                  setSelectedRange("today");
                  fetchStats(false, "today");
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedRange === "today"
                    ? "bg-[#172554] text-white shadow-xs"
                    : "text-[#555f6d] hover:text-[#172554] hover:bg-white/60"
                }`}
              >
                امروز
              </button>

              <button
                onClick={() => {
                  setSelectedRange("7d");
                  fetchStats(false, "7d");
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedRange === "7d"
                    ? "bg-[#172554] text-white shadow-xs"
                    : "text-[#555f6d] hover:text-[#172554] hover:bg-white/60"
                }`}
              >
                <span>۷ روز اخیر</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  selectedRange === "7d" ? "bg-amber-400 text-stone-900" : "bg-amber-100 text-amber-900"
                }`}>
                  هفتگی
                </span>
              </button>

              <button
                onClick={() => {
                  setSelectedRange("30d");
                  fetchStats(false, "30d");
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedRange === "30d"
                    ? "bg-[#172554] text-white shadow-xs"
                    : "text-[#555f6d] hover:text-[#172554] hover:bg-white/60"
                }`}
              >
                ۳۰ روز اخیر (ماهانه)
              </button>

              <button
                onClick={() => {
                  setSelectedRange("all");
                  fetchStats(false, "all");
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedRange === "all"
                    ? "bg-[#172554] text-white shadow-xs"
                    : "text-[#555f6d] hover:text-[#172554] hover:bg-white/60"
                }`}
              >
                کل دوره
              </button>
            </div>
          </div>

            {/* Active Period Label & Custom Date Picker */}
          <div className="flex items-center justify-between md:justify-end gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-amber-900 font-semibold font-estedad">
              <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>بازه فعال:</span>
              <span className="font-bold text-[#172554]">
                {toPersianDigits(data?.summary.dateRangeLabel || "۷ روز اخیر (هفتگی)")}
              </span>
            </div>

            {/* Custom Date Filter Button & Popup */}
            <div className="relative">
              <button
                onClick={() => setShowCustomDateModal(!showCustomDateModal)}
                className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer font-estedad ${
                  selectedRange === "custom"
                    ? "bg-[#172554] text-white border-[#172554]"
                    : "bg-white hover:bg-[#faf8f5] text-[#172554] border-[#dfd9cc]"
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>تقویم دلخواه</span>
              </button>

              {showCustomDateModal && (
                <div className="absolute left-0 top-11 z-30 w-72 bg-white rounded-2xl border border-[#dfd9cc] shadow-xl p-4 space-y-3 font-estedad">
                  <div className="text-xs font-bold text-[#172554]">انتخاب بازه زمانی دلخواه</div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-500 block">از تاریخ:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-[#dfd9cc] text-xs font-estedad"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-500 block">تا تاریخ:</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-[#dfd9cc] text-xs font-estedad"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1.5">
                    <button
                      onClick={() => {
                        if (!startDate) {
                          toast.error("لطفاً تاریخ شروع را تعیین نمایید");
                          return;
                        }
                        setSelectedRange("custom");
                        setShowCustomDateModal(false);
                        fetchStats(false, "custom");
                      }}
                      className="flex-1 h-8 rounded-lg bg-[#172554] text-white text-xs font-bold cursor-pointer"
                    >
                      اعمال
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomDateModal(false);
                      }}
                      className="h-8 px-3 rounded-lg bg-stone-100 text-stone-600 text-xs font-semibold cursor-pointer"
                    >
                      بستن
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4 Key Executive Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-estedad">
          {/* Metric 1: Total Visitors */}
          <div className="bg-white rounded-3xl p-6 border border-[#dfd9cc] shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#8c7b64]">کل بازدیدکنندگان</span>
              <div className="w-10 h-10 rounded-2xl bg-[#eff6ff] flex items-center justify-center text-[#172554]">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-[#172554] tracking-tight font-estedad">
                {toPersianDigits(summary.totalVisitors.toLocaleString())}
              </div>
              <p className="text-[11px] text-[#555f6d] mt-1.5 flex items-center gap-2 font-estedad">
                <span>موبایل: {toPersianDigits(data?.devices.mobile.toLocaleString())} ({toPersianDigits(data?.devices.mobileShare)}٪)</span>
                <span>·</span>
                <span>دسکتاپ: {toPersianDigits(data?.devices.desktop.toLocaleString())}</span>
              </p>
            </div>
          </div>

          {/* Metric 2: Total Leads (Calls & WhatsApp) */}
          <div className="bg-white rounded-3xl p-6 border border-[#dfd9cc] shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-emerald-800">کل لیدهای تماس (Lead)</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <Phone className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight font-estedad">
                {toPersianDigits(summary.totalLeads.toLocaleString())}
              </div>
              <p className="text-[11px] text-[#555f6d] mt-1.5 flex items-center gap-2 font-estedad">
                <span>تماس تلفنی: {toPersianDigits(summary.totalCalls.toLocaleString())}</span>
                <span>·</span>
                <span>چت واتس‌اپ: {toPersianDigits(summary.totalWhatsApp.toLocaleString())}</span>
              </p>
            </div>
          </div>

          {/* Metric 3: Conversion Rate */}
          <div className="bg-white rounded-3xl p-6 border border-[#dfd9cc] shadow-xs relative overflow-hidden flex flex-col justify-between bg-gradient-to-br from-white to-amber-50/40">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-amber-900">نرخ تبدیل لید (CR %)</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-100/70 flex items-center justify-center text-amber-800">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-amber-900 tracking-tight font-estedad flex items-baseline gap-1">
                <span>{toPersianDigits(summary.conversionRate)}</span>
                <span className="text-xl font-bold">٪</span>
              </div>
              <p className="text-[11px] text-[#8c7b64] mt-1.5 font-estedad">
                از هر ۱۰۰ بازدیدکننده، حدود {toPersianDigits(summary.conversionRate)} نفر تماس می‌گیرند
              </p>
            </div>
          </div>

          {/* Metric 4: Top Performing Room */}
          <div className="bg-white rounded-3xl p-6 border border-[#dfd9cc] shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#8c7b64]">بیشترین استعلام اتاق</span>
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-[#172554]">
                <Hotel className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-[#172554] truncate">
                {summary.topRoom}
              </div>
              <p className="text-[11px] text-[#555f6d] mt-1.5 font-estedad">
                کانال برتر ورودی: <strong className="text-[#172554]">{summary.topSource}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Visual Trend Chart: Activity over Time */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#dfd9cc] shadow-xs space-y-5 font-estedad">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f0ece1]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#172554]" />
                <h2 className="text-base sm:text-lg font-bold text-[#172554]">
                  روند زمانی ترافیک و سرنخ‌ها ({toPersianDigits(data?.summary.dateRangeLabel)})
                </h2>
              </div>
              <p className="text-xs text-[#555f6d]">
                مقایسه تعداد بازدیدکنندگان یکتا با لیدهای ثبت‌شده (تماس و واتس‌اپ) در طول بازه انتخابی
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-semibold font-estedad">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#172554]" />
                <span className="text-[#172554]">بازدیدکننده</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-500" />
                <span className="text-emerald-800">لید (تماس/واتس‌اپ)</span>
              </div>
            </div>
          </div>

          {/* Bars Visualizer */}
          {data?.hourlyActivity && data.hourlyActivity.length > 0 ? (
            <div className="pt-4 pb-2">
              <div className="grid grid-flow-col auto-cols-fr gap-2 sm:gap-4 items-end h-44 sm:h-52 px-2 border-b border-[#dfd9cc]/60">
                {(() => {
                  const maxVisitors = Math.max(
                    ...data.hourlyActivity.map((a) => Math.max(a.visitors, a.leads)),
                    1
                  );
                  return data.hourlyActivity.map((point, idx) => {
                    const visHeight = Math.max(Math.round((point.visitors / maxVisitors) * 100), point.visitors > 0 ? 8 : 3);
                    const leadHeight = Math.max(Math.round((point.leads / maxVisitors) * 100), point.leads > 0 ? 8 : 3);

                    return (
                      <div key={idx} className="flex flex-col items-center justify-end h-full gap-2 group font-estedad">
                        {/* Values preview tooltip on hover */}
                        <div className="text-[10px] font-bold text-[#555f6d] opacity-0 group-hover:opacity-100 transition-opacity font-estedad whitespace-nowrap">
                          {point.leads > 0 && <span className="text-emerald-700">{toPersianDigits(point.leads)} لید / </span>}
                          <span>{toPersianDigits(point.visitors)} باز</span>
                        </div>

                        {/* Bars cluster */}
                        <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-36">
                          {/* Visitor Bar */}
                          <div
                            className="w-3 sm:w-6 rounded-t-lg bg-[#172554] hover:bg-[#0f172a] transition-all duration-300 relative group-hover:scale-y-105"
                            style={{ height: `${visHeight}%` }}
                            title={`بازدیدکنندگان: ${toPersianDigits(point.visitors)}`}
                          />
                          {/* Lead Bar */}
                          <div
                            className="w-3 sm:w-6 rounded-t-lg bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 relative group-hover:scale-y-105"
                            style={{ height: `${leadHeight}%` }}
                            title={`لیدها: ${toPersianDigits(point.leads)}`}
                          />
                        </div>

                        {/* Label beneath bar */}
                        <div className="text-[10px] sm:text-xs font-semibold text-[#8c7b64] font-estedad mt-1 truncate">
                          {toPersianDigits(point.hour)}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              داده‌ای برای این بازه زمانی یافت نشد.
            </div>
          )}
        </div>

        {/* Behavior & Traffic Quality (Engagement & UX) */}
        <div className="space-y-4 font-estedad">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <MousePointerClick className="w-5 h-5 text-[#172554]" />
              <h2 className="text-base sm:text-lg font-bold text-[#172554]">
                رفتار و کیفیت ترافیک مسافران (User Engagement & Friction)
              </h2>
            </div>
            <span className="text-xs text-[#8c7b64]">سنجش عمق توجه و نقاط کلیک</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1: Scroll Depth Funnel */}
            <div className="bg-white rounded-3xl p-6 border border-[#dfd9cc] shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#8c7b64]" />
                    <span className="text-xs font-bold text-[#172554]">عمق پیمایش صفحه (Scroll Depth)</span>
                  </div>
                  <span className="text-[11px] text-[#8c7b64]">قیف مطالعه</span>
                </div>
                <p className="text-[11px] text-[#555f6d] mt-2 mb-4 leading-relaxed">
                  چند درصد از مخاطبان بخش‌های مختلف لندینگ را تا انتها اسکرول کرده‌اند:
                </p>

                <div className="space-y-3">
                  {[
                    { label: "هیرو و معرفی عمارت (۲۵٪)", pct: data?.engagement?.scrollDepth.depth25 ?? 84 },
                    { label: "مشاهده و انتخاب اتاق‌ها (۵۰٪)", pct: data?.engagement?.scrollDepth.depth50 ?? 68 },
                    { label: "موقعیت و جاذبه‌های اصفهان (۷۵٪)", pct: data?.engagement?.scrollDepth.depth75 ?? 46 },
                    { label: "انتهای صفحه و گالری (۱۰۰٪)", pct: data?.engagement?.scrollDepth.depth100 ?? 29 },
                  ].map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[#555f6d] text-[11px]">{s.label}</span>
                        <span className="text-[#172554] font-bold font-estedad">{toPersianDigits(s.pct)}٪</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#f0ece1] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#172554] transition-all duration-500"
                          style={{ width: `${s.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#f0ece1] text-[11px] text-emerald-800 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200/50">
                نرخ خروج سریع (Bounce): حدود {toPersianDigits(Math.max(100 - (data?.engagement?.scrollDepth.depth25 ?? 84), 5))}٪
              </div>
            </div>

            {/* Card 2: Average Dwell Time */}
            <div className="bg-white rounded-3xl p-6 border border-[#dfd9cc] shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-[#8c7b64]" />
                    <span className="text-xs font-bold text-[#172554]">مدت حضور در سایت (Dwell Time)</span>
                  </div>
                  <span className="text-[11px] text-[#8c7b64]">میانگین زمان</span>
                </div>

                <div className="my-6 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-[#172554] tracking-tight font-estedad">
                    {toPersianDigits(data?.summary.avgDwellTimeFormatted || "۲ دقیقه و ۱۵ ثانیه")}
                  </div>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    شاخص ماندگاری مطلوب
                  </span>
                </div>

                <p className="text-[11px] text-[#555f6d] leading-relaxed">
                  میانگین زمانی که هر مسافر صرف بررسی تصاویر، امکانات و اتاق‌های هتل آوات می‌کند.
                </p>
              </div>

              <div className="pt-3 border-t border-[#f0ece1] text-[11px] text-[#8c7b64] leading-relaxed bg-[#faf8f5] p-3 rounded-2xl border border-[#dfd9cc]/70">
                💡 کاربرانی که بیش از <strong>۹۰ ثانیه</strong> در صفحه می‌مانند، بیش از ۳ برابر شانس تماس تلفنی یا واتس‌اپ دارند.
              </div>
            </div>

            {/* Card 3: CTA Placement Attribution */}
            <div className="bg-white rounded-3xl p-6 border border-[#dfd9cc] shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
                  <div className="flex items-center gap-2">
                    <MousePointerClick className="w-4 h-4 text-[#8c7b64]" />
                    <span className="text-xs font-bold text-[#172554]">محل اقدام به تماس (CTA Placement)</span>
                  </div>
                  <span className="text-[11px] text-[#8c7b64]">سهم دکمه‌ها</span>
                </div>
                <p className="text-[11px] text-[#555f6d] mt-2 mb-4 leading-relaxed">
                  مسافران بیشتر از کدام بخش صفحه روی تماس یا واتس‌اپ کلیک کرده‌اند:
                </p>

                <div className="space-y-3">
                  {data?.engagement?.ctaPlacements && data.engagement.ctaPlacements.length > 0 ? (
                    data.engagement.ctaPlacements.map((p, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-[#172554] text-[11px] truncate max-w-[180px]">{p.label}</span>
                          <span className="text-[#8c7b64] font-estedad">
                            {toPersianDigits(p.count)} لید ({toPersianDigits(p.share)}٪)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#f0ece1] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                            style={{ width: `${Math.min(p.share * 1.5, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-6">داده‌ای ثبت نشده است.</p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#f0ece1] text-[11px] text-stone-500 flex items-center justify-between">
                <span>برترین نقطه تبدیل:</span>
                <strong className="text-[#172554]">
                  {data?.engagement?.ctaPlacements?.[0]?.label || "دکمه شناور موبایل"}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap Section: Peak Inquiry Hours & Days */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#dfd9cc] shadow-xs space-y-6 font-estedad">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f0ece1]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-600" />
                <h2 className="text-base sm:text-lg font-bold text-[#172554]">
                  نقشه حرارتی ساعات طلایی و روزهای اوج تقاضا (Peak Demand Heatmap)
                </h2>
              </div>
              <p className="text-xs text-[#555f6d]">
                تراکم ثبت لید و تماس‌های مسافران به تفکیک ۲۴ ساعت شبانه‌روز و روزهای هفته (به وقت اصفهان)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 font-estedad">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>ساعت طلایی تماس:</span>
                <span className="text-[#172554]">{toPersianDigits(data?.heatmap?.peakHourLabel || "۲۰:۰۰ الی ۲۳:۰۰")}</span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1.5 font-estedad">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>روزهای اوج رزرو:</span>
                <span className="text-[#172554]">{toPersianDigits(data?.heatmap?.peakDayLabel || "چهارشنبه و پنج‌شنبه")}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 24-Hours Heat Grid */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#8c7b64] font-semibold">
                <span>شدت تقاضا در ۲۴ ساعت شبانه‌روز:</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>کم</span>
                  <span className="w-3 h-3 rounded bg-[#faf8f5] border border-[#dfd9cc]" />
                  <span className="w-3 h-3 rounded bg-[#bfdbfe]" />
                  <span className="w-3 h-3 rounded bg-[#3b82f6]" />
                  <span className="w-3 h-3 rounded bg-[#172554]" />
                  <span>زیاد (اوج)</span>
                </div>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2 pt-1">
                {data?.heatmap?.byHour.map((h) => {
                  let bgClass = "bg-[#faf8f5] text-[#555f6d] border-[#dfd9cc]";
                  if (h.intensity > 75) bgClass = "bg-[#172554] text-white border-[#172554] font-bold shadow-xs";
                  else if (h.intensity > 45) bgClass = "bg-[#3b82f6] text-white border-[#2563eb] font-semibold";
                  else if (h.intensity > 20) bgClass = "bg-[#bfdbfe] text-[#172554] border-[#93c5fd]";
                  else if (h.intensity > 0) bgClass = "bg-[#eff6ff] text-[#1e3a8a] border-[#dbeafe]";

                  return (
                    <div
                      key={h.hour}
                      className={`rounded-xl p-2 text-center border transition-all duration-200 hover:scale-105 cursor-default ${bgClass}`}
                      title={`${toPersianDigits(h.hourLabel)}: ${toPersianDigits(h.leads)} لید تماس / ${toPersianDigits(h.visitors)} بازدید`}
                    >
                      <div className="text-[10px] font-estedad opacity-80">{toPersianDigits(h.hourLabel)}</div>
                      <div className="text-xs font-bold font-estedad mt-0.5">
                        {toPersianDigits(h.leads)}
                        <span className="text-[9px] mr-0.5 font-normal">لید</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-stone-500 pt-1">
                * کادرهای سرمه‌ای و آبی پررنگ نشان‌دهنده بازه‌های زمانی هستند که مسافران بیشترین آمادگی را برای تماس و واریز بیعانه داشته‌اند.
              </p>
            </div>

            {/* 7 Days of Week Distribution */}
            <div className="lg:col-span-4 bg-[#faf8f5] rounded-2xl p-4 sm:p-5 border border-[#dfd9cc]/80 space-y-3">
              <div className="text-xs font-bold text-[#172554] pb-2 border-b border-[#dfd9cc]/60 flex items-center justify-between">
                <span>توزیع تقاضای هفتگی</span>
                <span className="text-[10px] text-[#8c7b64]">سهم هر روز</span>
              </div>

              <div className="space-y-2.5">
                {data?.heatmap?.byDayOfWeek.map((day) => (
                  <div key={day.dayIndex} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#172554] text-[11px]">{day.dayName}</span>
                      <span className="text-[#8c7b64] font-estedad text-[11px]">
                        {toPersianDigits(day.leads)} لید ({toPersianDigits(day.share)}٪)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#f0ece1] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#172554]"
                        style={{ width: `${Math.min(day.share * 2.5, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Channels & Rooms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-estedad">
          {/* Channel Attribution Breakdown (Table) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-[#dfd9cc] shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#f0ece1]">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#172554]">
                  عملکرد به تفکیک کانال‌های ورودی (UTM Attribution)
                </h2>
                <p className="text-xs text-[#555f6d] mt-1">
                  کدام کمپین‌ها بیشترین ترافیک و تماس تلفنی را وارد چرخه فروش کرده‌اند؟
                </p>
              </div>
              <SlidersHorizontal className="w-4 h-4 text-[#8c7b64]" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs font-estedad">
                <thead>
                  <tr className="border-b border-[#f0ece1] text-[#8c7b64] font-bold">
                    <th className="pb-3 pr-2">کانال ورودی (Source)</th>
                    <th className="pb-3 text-center">کمپین (Campaign)</th>
                    <th className="pb-3 text-center">بازدیدکننده</th>
                    <th className="pb-3 text-center">تماس تلفنی</th>
                    <th className="pb-3 text-center">واتس‌اپ</th>
                    <th className="pb-3 text-center">مجموع لیدها</th>
                    <th className="pb-3 text-left pl-2">نرخ تبدیل (CR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f7f5f0]">
                  {data?.channels.map((chan, idx) => (
                    <tr key={idx} className="hover:bg-[#faf8f5] transition-colors">
                      <td className="py-3.5 pr-2 font-bold text-[#172554]">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-[#faf8f5] border border-[#dfd9cc]">
                          {chan.source}
                        </span>
                      </td>
                      <td className="py-3.5 text-center text-[#555f6d] font-estedad text-[11px]" dir="ltr">
                        {chan.campaign || "—"}
                      </td>
                      <td className="py-3.5 text-center font-estedad font-semibold text-[#172554]">
                        {toPersianDigits(chan.visitors.toLocaleString())}
                      </td>
                      <td className="py-3.5 text-center font-estedad text-emerald-700 font-bold">
                        {toPersianDigits(chan.calls.toLocaleString())}
                      </td>
                      <td className="py-3.5 text-center font-estedad text-emerald-700 font-bold">
                        {toPersianDigits(chan.whatsapp.toLocaleString())}
                      </td>
                      <td className="py-3.5 text-center font-estedad font-black text-[#172554]">
                        {toPersianDigits(chan.leads.toLocaleString())}
                      </td>
                      <td className="py-3.5 text-left pl-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-50 text-amber-900 border border-amber-200 font-estedad">
                          {toPersianDigits(chan.conversionRate)}٪
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!data?.channels || data.channels.length === 0) && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-400">
                        داده‌ای برای این بازه زمانی ثبت نشده است.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Room Inquiry Share (Card) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-[#dfd9cc] shadow-xs space-y-5 font-estedad">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#172554]">
                تقاضای رزرو به تفکیک اتاق‌ها
              </h2>
              <p className="text-xs text-[#555f6d] mt-1">
                سهم هر اتاق از کل تماس‌ها و چت‌های دریافتی
              </p>
            </div>

            <div className="space-y-3.5">
              {data?.rooms.slice(0, 6).map((r, idx) => (
                <div key={idx} className="space-y-1.5 font-estedad">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#172554]">{r.room}</span>
                    <span className="text-[#8c7b64] font-estedad">
                      {toPersianDigits(r.leads.toLocaleString())} لید ({toPersianDigits(r.share)}٪)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#f0ece1] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#172554]"
                      style={{ width: `${Math.min(r.share * 2.5, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              {(!data?.rooms || data.rooms.length === 0) && (
                <p className="text-xs text-slate-400 text-center py-6">هنوز لیدی برای اتاق‌ها ثبت نشده است.</p>
              )}
            </div>
          </div>
        </div>

        {/* Live Leads Stream & Link Generator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-estedad">
          {/* Live Recent Inquiries Feed */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#dfd9cc] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8c7b64]" />
                <h2 className="text-base font-bold text-[#172554]">جریان زنده لیدها (Live Activity Stream)</h2>
              </div>
              <span className="text-xs text-[#8c7b64]">آخرین رویدادهای تماس</span>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {data?.recentLeads.map((lead, idx) => {
                const isCall = lead.eventName.includes("call");
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#faf8f5] border border-[#dfd9cc]/70 text-xs font-estedad"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isCall ? "bg-emerald-100 text-emerald-800" : "bg-emerald-500 text-white"
                          }`}
                      >
                        {isCall ? <Phone className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-[#172554]">
                          {lead.room || "استعلام عمومی هتل"}
                        </div>
                        <div className="text-[11px] text-[#555f6d] flex items-center gap-1.5 mt-0.5">
                          <span>منبع: <strong className="text-[#172554]">{lead.utmSource || "direct"}</strong></span>
                          {lead.utmCampaign && <span>· کمپین: {lead.utmCampaign}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="text-left text-[11px] text-[#8c7b64] font-estedad font-bold">
                      {toPersianDigits(
                        new Date(lead.timestamp).toLocaleTimeString("fa-IR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      )}
                    </div>
                  </div>
                );
              })}
              {(!data?.recentLeads || data.recentLeads.length === 0) && (
                <p className="text-center py-8 text-xs text-slate-400">
                  هنوز تماسی در این بازه زمانی ثبت نشده است.
                </p>
              )}
            </div>
          </div>

          {/* Campaign Link Generator */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#dfd9cc] shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#172554]">ابزار ساخت لینک کمپین (UTM Builder)</h2>
              <p className="text-xs text-[#555f6d] mt-1">
                برای استوری اینستاگرام، پیامک اسنپ‌تریپ یا اینفلوئنسرها لینک اختصاصی بسازید تا دقیق تفکیک شوند:
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#8c7b64] block mb-1">منبع (utm_source):</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {["instagram", "snapp_sms", "google", "telegram", "influencer", "direct"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setGenSource(s)}
                      className={`h-8 rounded-lg text-xs font-semibold border transition-all ${genSource === s
                        ? "bg-[#172554] text-white border-[#172554]"
                        : "bg-[#faf8f5] text-[#555f6d] border-[#dfd9cc] hover:bg-white"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#8c7b64] block mb-1">نوع رسانه (medium):</label>
                  <input
                    type="text"
                    value={genMedium}
                    onChange={(e) => setGenMedium(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg border border-[#dfd9cc] text-xs font-mono text-left bg-[#faf8f5]"
                    dir="ltr"
                    placeholder="story / banner / cpc"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#8c7b64] block mb-1">نام کمپین (campaign):</label>
                  <input
                    type="text"
                    value={genCampaign}
                    onChange={(e) => setGenCampaign(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg border border-[#dfd9cc] text-xs font-mono text-left bg-[#faf8f5]"
                    dir="ltr"
                    placeholder="pilot_shiraz"
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="p-2.5 rounded-xl bg-[#faf8f5] border border-[#dfd9cc] font-mono text-[11px] break-all text-[#172554] text-left select-all" dir="ltr">
                  {generatedUrl}
                </div>
                <button
                  type="button"
                  onClick={copyGeneratedLink}
                  className="mt-2.5 w-full h-10 rounded-xl bg-[#172554] hover:bg-[#0f172a] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "لینک در کلیپ‌بورد کپی شد!" : "کپی لینک اختصاصی کمپین"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
