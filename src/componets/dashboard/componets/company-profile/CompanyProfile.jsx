import React from "react";
import MainLayout from "../../layout/MainLayout";

const CompanyProfile = () => {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Company Profile
        </h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600">
            This is the Company Profile mockup page.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default CompanyProfile;
