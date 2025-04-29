import React from 'react';
import 'jspdf-autotable';
import ReportPageContent from '../../components/admin/reports/ReportPageContent';

const RevenueReportPage: React.FC = () => {

    return (
        <div className="bg-white min-h-screen p-6">
            <ReportPageContent />
        </div>
    );
};

export default RevenueReportPage;