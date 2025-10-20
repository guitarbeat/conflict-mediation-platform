import React from "react";
import { Card, CardContent } from "./ui/card";

const StepCard = ({ children, className = "" }) => {
  return (
    <Card className={`w-full h-auto py-4 sm:py-6 ${className}`}>
      <CardContent className="px-3 sm:px-4 lg:px-6 pb-24 sm:pb-6 lg:pb-8 pt-0 max-h-[calc(100vh-10rem)] sm:max-h-[80vh] overflow-y-auto">
        <div className="fixed-content">{children}</div>
      </CardContent>
    </Card>
  );
};

export default StepCard;
