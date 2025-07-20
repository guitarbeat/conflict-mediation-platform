import React from "react";
import { Card, CardContent } from "./ui/card";

const StepCard = ({ children, className = "" }) => {
  return (
    <Card className={`w-full h-auto ${className}`}>
      <CardContent className="px-2 sm:px-3 lg:px-4 pb-2 sm:pb-3 lg:pb-4 pt-0 max-h-[80vh] overflow-y-auto">
        <div className="fixed-content">{children}</div>
      </CardContent>
    </Card>
  );
};

export default StepCard;
