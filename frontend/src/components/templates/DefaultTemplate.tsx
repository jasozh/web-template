import React, { ReactNode } from "react";
import { Navbar } from "@/components";

interface DefaultTemplateProps {
  children: ReactNode;
}

const DefaultTemplate = ({ children }: DefaultTemplateProps) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="px-6 sm:px-12 py-6 sm:py-12">
        <div className="max-w-7xl mx-auto p-4">{children}</div>
      </div>
    </div>
  );
};

export default DefaultTemplate;
