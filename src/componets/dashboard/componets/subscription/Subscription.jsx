import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  getEmployerDetailsFull,
  getAllEmployerPlans,
} from "../../../../api/service/employerService";
import { Loader2, Check, X, Zap, Star, Shield, ArrowLeft } from "lucide-react";

// Mapping icons for dynamic rendering based on the schema's "iconType" enum
const ICON_MAP = {
  bolt: { component: Zap, bgColor: "bg-blue-50", color: "text-blue-500" },
  star: { component: Star, bgColor: "bg-orange-50", color: "text-orange-400" },
  shield: {
    component: Shield,
    bgColor: "bg-purple-50",
    color: "text-purple-500",
  },
};

const Subscription = () => {
  const [employerData, setEmployerData] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlans, setShowPlans] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const employerId = localStorage.getItem("employerId");
      if (employerId) {
        // Fetch current employer details to see active subscription
        const employerRes = await getEmployerDetailsFull(employerId);
        if (employerRes.status === 200) {
          setEmployerData(employerRes.data);
        }
      }

      // Fetch all available employer plans created by admin
      const plansRes = await getAllEmployerPlans();
      const planData = plansRes?.data?.data || plansRes?.data || [];
      if (Array.isArray(planData)) {
        // Filter out inactive ones just in case
        setPlans(planData.filter((p) => p.isActive));
      }
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
      </MainLayout>
    );
  }

  const activeSub = employerData?.employer?.currentSubscription;
  const isTrial =
    employerData?.employer?.trial === "false" ||
    employerData?.employer?.trial === false;
  const isSubscriptionActive =
    employerData?.employer?.subscription === "true" ||
    employerData?.employer?.subscription === true;

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto font-sans">
        {/* Top Header Section */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              {showPlans && (
                <button
                  onClick={() => setShowPlans(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition"
                  title="Back to Current Plan"
                >
                  <ArrowLeft size={24} />
                </button>
              )}
              {showPlans ? "Available Upgrade Plans" : "My Subscription"}
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              {showPlans
                ? "Choose the best plan to supercharge your recruitment and hiring process."
                : "Manage your active subscription, billing, and current usage quotas."}
            </p>
          </div>
          {!showPlans && (
            <button
              onClick={() => setShowPlans(true)}
              className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20"
            >
              <Zap size={18} /> Upgrade Plan
            </button>
          )}
        </div>

        {!showPlans ? (
          /* CURRENT SUBSCRIPTION VIEW */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    Current Status:
                    {isSubscriptionActive ? (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 text-sm rounded-full font-bold">
                        ACTIVE
                      </span>
                    ) : isTrial ? (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full font-bold">
                        TRIAL MODE
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-3 py-1 text-sm rounded-full font-bold">
                        EXPIRED / NONE
                      </span>
                    )}
                  </h2>
                  <p className="text-slate-500 mt-2">
                    {isTrial
                      ? "You are currently experiencing the platform on a free trial."
                      : "Here is the overview of your current plan and limits."}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Usage Quotas */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-6">
                  Your Usage & Quotas
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-600 font-medium">
                      Subscription Days Left
                    </span>
                    <span className="text-xl font-bold text-indigo-600">
                      {employerData?.employer?.subscriptionleft || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-600 font-medium">
                      Job Postings Left
                    </span>
                    <span className="text-xl font-bold text-indigo-600">
                      {employerData?.employer?.postjobleft || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-600 font-medium">
                      Unlocked Candidates Left
                    </span>
                    <span className="text-xl font-bold text-indigo-600">
                      {employerData?.employer?.unlockedcandidatesleft || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Plan Details */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-6">
                  Active Plan Overview
                </h3>
                {activeSub ? (
                  <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="text-indigo-600" size={24} />
                      <h4 className="text-xl font-bold text-indigo-900">
                        {activeSub.planName || "Premium Plan"}
                      </h4>
                    </div>
                    <ul className="space-y-3 mt-4">
                      {activeSub.startDate && (
                        <li className="flex justify-between text-sm">
                          <span className="text-indigo-700 font-medium">
                            Started On:
                          </span>
                          <span className="text-indigo-900 font-bold">
                            {new Date(activeSub.startDate).toLocaleDateString()}
                          </span>
                        </li>
                      )}
                      {activeSub.endDate && (
                        <li className="flex justify-between text-sm">
                          <span className="text-indigo-700 font-medium">
                            Expires On:
                          </span>
                          <span className="text-indigo-900 font-bold">
                            {new Date(activeSub.endDate).toLocaleDateString()}
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 p-8 rounded-2xl flex flex-col items-center justify-center text-center h-full">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Zap className="text-slate-400" size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-700 mb-2">
                      No Premium Plan
                    </h4>
                    <p className="text-slate-500 text-sm mb-4">
                      Upgrade to a premium plan to unlock unlimited candidates
                      and job postings.
                    </p>
                    <button
                      onClick={() => setShowPlans(true)}
                      className="text-indigo-600 font-bold text-sm hover:underline"
                    >
                      View Upgrade Options
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* PLANS VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const iconConfig = ICON_MAP[plan.iconType] || ICON_MAP.bolt;
              const IconComp = iconConfig.component;

              let cycleLabel = "";
              if (plan.billingCycle === "monthly") cycleLabel = "/mo";
              else if (plan.billingCycle === "yearly") cycleLabel = "/yr";
              else if (plan.validityDays) cycleLabel = `/${plan.validityDays}d`;

              return (
                <div
                  key={plan.id || plan._id}
                  className={`relative bg-white rounded-3xl p-8 flex flex-col hover:-translate-y-1 transition-all duration-300 border ${
                    plan.isPopular
                      ? "border-indigo-500 shadow-xl shadow-indigo-500/10"
                      : "border-slate-200 shadow-lg shadow-slate-200/50"
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.isPopular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider z-10 uppercase shadow-md shadow-indigo-500/30">
                      Most Popular
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${iconConfig.bgColor}`}
                  >
                    <IconComp size={24} className={iconConfig.color} />
                  </div>

                  {/* Title & Tagline */}
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                    {plan.name}
                  </h2>
                  <p className="text-slate-500 text-sm mb-6 min-h-[40px] leading-relaxed">
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline mb-8">
                    <span className="text-slate-900 text-4xl font-extrabold tracking-tight">
                      ₹{plan.price?.toLocaleString()}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-slate-500 ml-1 text-sm font-medium">
                        {cycleLabel}
                      </span>
                    )}
                  </div>

                  {/* Features List Base - Mapping over arbitrary text features */}
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.jobPostingLimit > 0 && (
                      <li className="flex items-start">
                        <Check
                          className="w-5 h-5 text-emerald-500 mr-3 shrink-0"
                          strokeWidth={2.5}
                        />
                        <span className="text-sm text-slate-700 font-bold">
                          {plan.jobPostingLimit} Active Job Posts
                        </span>
                      </li>
                    )}
                    {plan.profileViews > 0 && (
                      <li className="flex items-start">
                        <Check
                          className="w-5 h-5 text-emerald-500 mr-3 shrink-0"
                          strokeWidth={2.5}
                        />
                        <span className="text-sm text-slate-700 font-bold">
                          {plan.profileViews} Profile Views
                        </span>
                      </li>
                    )}
                    {plan.downloadResume > 0 && (
                      <li className="flex items-start">
                        <Check
                          className="w-5 h-5 text-emerald-500 mr-3 shrink-0"
                          strokeWidth={2.5}
                        />
                        <span className="text-sm text-slate-700 font-bold">
                          {plan.downloadResume} Resume Downloads
                        </span>
                      </li>
                    )}
                    {plan.perDayLimit > 0 && (
                      <li className="flex items-start">
                        <Check
                          className="w-5 h-5 text-emerald-500 mr-3 shrink-0"
                          strokeWidth={2.5}
                        />
                        <span className="text-sm text-slate-700 font-bold">
                          {plan.perDayLimit} Actions Limit / Day
                        </span>
                      </li>
                    )}

                    {/* Dynamically typed bullet points */}
                    {(plan.featuresList || []).map((feat, idx) => (
                      <li key={idx} className="flex items-start">
                        {feat.included ? (
                          <Check
                            className="w-5 h-5 text-emerald-500 mr-3 shrink-0"
                            strokeWidth={2.5}
                          />
                        ) : (
                          <X
                            className="w-5 h-5 text-slate-300 mr-3 shrink-0"
                            strokeWidth={2.5}
                          />
                        )}
                        <span
                          className={`text-sm ${feat.included ? "text-slate-700 font-medium" : "text-slate-400 line-through"}`}
                        >
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Select Plan Button */}
                  <button
                    className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all ${
                      plan.isPopular
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
                        : plan.buttonText === "Contact Sales"
                          ? "bg-white text-slate-900 border-2 border-slate-200 hover:border-slate-300"
                          : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                    }`}
                  >
                    {plan.buttonText || "Choose Plan"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Subscription;
