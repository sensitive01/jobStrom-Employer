import React, { useState, useEffect, useRef } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  getEmployerDetailsFull,
  updateEmployerProfile,
  uploadEmployerProfilePic,
  uploadEmployerCoverPic,
} from "../../../../api/service/employerService";
import { toast } from "react-toastify";
import {
  Building2,
  MapPin,
  Globe,
  Upload,
  Save,
  Twitter,
  Linkedin,
  Facebook,
  UploadCloud,
  User,
} from "lucide-react";

const CompanyProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const profilePicRef = useRef(null);
  const coverPicRef = useRef(null);

  const empId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    companyName: "",
    institutionType: "",
    website: "",
    contactPerson: "",
    contactEmail: "",
    mobileNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    schoolName: "",
    board: "",
    userProfilePic: "",
    userCoverPic: "",
    linkedin: "",
    twitter: "",
    facebook: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (empId) {
          const response = await getEmployerDetailsFull(empId);
          const data = response?.data || response;
          if (data) {
            setFormData({
              companyName: data.companyName || "",
              institutionType: data.institutionType || "",
              website: data.website || "",
              contactPerson: data.contactPerson || "",
              contactEmail: data.contactEmail || "",
              mobileNumber: data.mobileNumber || "",
              address: data.address || "",
              city: data.city || "",
              state: data.state || "",
              pincode: data.pincode || "",
              schoolName: data.schoolName || "",
              board: data.board || "",
              userProfilePic: data.userProfilePic || "",
              userCoverPic: data.userCoverPic || "",
              linkedin: data.linkedin || "",
              twitter: data.twitter || "",
              facebook: data.facebook || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching company profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [empId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingProfile(true);
      const form = new FormData();
      form.append("file", file);
      const res = await uploadEmployerProfilePic(empId, form);
      if (res && res.data && res.data.file) {
        setFormData((prev) => ({ ...prev, userProfilePic: res.data.file.url }));
        toast.success("Profile picture updated!");
        const cachedData = JSON.parse(
          localStorage.getItem("employerData") || "{}",
        );
        cachedData.userProfilePic = res.data.file.url;
        localStorage.setItem("employerData", JSON.stringify(cachedData));
        localStorage.setItem("userProfilePic", res.data.file.url);
      } else {
        toast.error("Profile picture upload failed.");
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploadingProfile(false);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingCover(true);
      const form = new FormData();
      form.append("file", file);
      const res = await uploadEmployerCoverPic(empId, form);
      if (res && res.data && res.data.file) {
        setFormData((prev) => ({ ...prev, userCoverPic: res.data.file.url }));
        toast.success("Cover picture updated!");
      } else {
        toast.error("Cover picture upload failed.");
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploadingCover(false);
    }
  };

  const triggerProfileSetup = () => profilePicRef.current?.click();
  const triggerCoverSetup = () => coverPicRef.current?.click();

  const handleSave = async () => {
    try {
      setSaving(true);
      if (!empId) return;

      const response = await updateEmployerProfile(empId, formData);

      if (response && !response.isAxiosError) {
        toast.success("Profile updated successfully!");

        const cachedData = JSON.parse(
          localStorage.getItem("employerData") || "{}",
        );
        const newCache = { ...cachedData, ...formData };
        localStorage.setItem("employerData", JSON.stringify(newCache));
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </MainLayout>
    );
  }

  // Generate Initials
  const getInitials = (name) => {
    if (!name) return "CO";
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <MainLayout>
      <input
        type="file"
        ref={profilePicRef}
        className="hidden"
        accept="image/*"
        onChange={handleProfileUpload}
      />
      <input
        type="file"
        ref={coverPicRef}
        className="hidden"
        accept="image/*"
        onChange={handleCoverUpload}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
              Company Profile
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              Manage your company's brand and public information.
            </p>
          </div>
          <button
            disabled={saving}
            onClick={handleSave}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save size={16} />
            )}
            Save Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Identity Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center relative overflow-hidden">
              <div className="relative mb-4 mt-2">
                <div className="w-24 h-24 bg-[#0A4737] text-white text-3xl font-bold rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                  {formData.userProfilePic ? (
                    <img
                      src={formData.userProfilePic}
                      alt={formData.companyName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(formData.companyName)
                  )}
                </div>
                {/* Upload Button overlay */}
                <button
                  onClick={triggerProfileSetup}
                  disabled={uploadingProfile}
                  className="absolute -bottom-2 -right-2 bg-[#5B4FEA] hover:bg-indigo-700 text-white p-2 rounded-full shadow-md border-2 border-white transition-colors z-10"
                >
                  {uploadingProfile ? (
                    <div className="animate-spin h-3.5 w-3.5 border-b-2 border-white rounded-full"></div>
                  ) : (
                    <Upload size={14} />
                  )}
                </button>
              </div>

              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                {formData.companyName || "Company Name"}
              </h2>
              <p className="text-sm text-gray-500 mb-5">
                {formData.institutionType || "Industry & Technology"}
              </p>

              <div className="w-full border-t border-gray-100 pt-4 space-y-3 test-left">
                <div className="flex items-center text-sm text-gray-600 gap-3">
                  <MapPin size={16} className="text-gray-400 shrink-0" />
                  <span className="truncate">
                    {[formData.city, formData.state]
                      .filter(Boolean)
                      .join(", ") || "Location not provided"}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 gap-3">
                  <Globe size={16} className="text-gray-400 shrink-0" />
                  <span className="truncate">
                    {formData.website
                      ? formData.website.replace(/^https?:\/\//, "")
                      : "Website not provided"}
                  </span>
                </div>
                {formData.contactPerson && (
                  <div className="flex items-center text-sm text-gray-600 gap-3">
                    <User size={16} className="text-gray-400 shrink-0" />
                    <span className="truncate">
                      Contact: {formData.contactPerson}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Image Upload Card Mockup */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">
                  Cover Image
                </h3>
              </div>
              <div className="p-5">
                <div
                  onClick={triggerCoverSetup}
                  className={`border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 transition-colors overflow-hidden relative group ${formData.userCoverPic ? "h-32" : "py-8 px-4"}`}
                >
                  {formData.userCoverPic ? (
                    <img
                      src={formData.userCoverPic}
                      alt="Cover"
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  ) : null}
                  <div
                    className={`flex flex-col items-center justify-center w-full h-full p-4 relative z-10 ${formData.userCoverPic ? "opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity" : ""}`}
                  >
                    {uploadingCover ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mb-2"></div>
                    ) : (
                      <UploadCloud
                        size={24}
                        className={
                          formData.userCoverPic
                            ? "text-white mb-2"
                            : "text-gray-400 mb-2"
                        }
                      />
                    )}
                    <p
                      className={`text-sm font-medium ${formData.userCoverPic ? "text-white" : "text-gray-700"}`}
                    >
                      {uploadingCover ? "Uploading..." : "Upload Cover"}
                    </p>
                    {!formData.userCoverPic && (
                      <p className="text-xs text-gray-400 mt-1">
                        1200x400px recommended
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Details Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900">
                  Company Details
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="pl-10 w-full border border-gray-300 rounded-lg py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g. TechCorp Inc."
                      />
                    </div>
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry / Type
                    </label>
                    <select
                      name="institutionType"
                      value={formData.institutionType}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select industry</option>
                      <option value="Internet & Technology">
                        Internet & Technology
                      </option>
                      <option value="Education">Education</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="pl-10 w-full border border-gray-300 rounded-lg py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="https://company.com"
                      />
                    </div>
                  </div>

                  {/* Contact Person */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="support@company.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  {/* Location Area - spans full width */}
                  <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                    {/* Headquarters / City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Headquarters (City)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="pl-10 w-full border border-gray-300 rounded-lg py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="e.g. San Francisco"
                        />
                      </div>
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State / Province
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g. CA"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Registration Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Local Street Address"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900">
                  Social Media
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Linkedin size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="pl-10 w-full border border-gray-300 rounded-lg py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="linkedin.com/company/techcorp"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Twitter
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Twitter size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleChange}
                        className="pl-10 w-full border border-gray-300 rounded-lg py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="twitter.com/techcorp"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Facebook
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Facebook size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleChange}
                        className="pl-10 w-full border border-gray-300 rounded-lg py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="facebook.com/techcorp"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CompanyProfile;
