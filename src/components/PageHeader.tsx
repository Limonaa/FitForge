import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  rightSlot,
  children,
}) => {
  return (
    <div className="flex flex-col items-start justify-center w-full">
      <div className="flex justify-between items-center w-full">
        <div>
          <p className="text-2xl md:text-3xl font-bold tracking-wide mb-1 sm:mb-2">
            {title}
          </p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {rightSlot && <div>{rightSlot}</div>}
      </div>
      {children && <div className="w-full mt-6">{children}</div>}
    </div>
  );
};

export default PageHeader;
