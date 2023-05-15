import React from "react";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const AllDataCardShimmer = () => {
  return (
    <div className="flex flex-col gap-4">
      <Card className="flex items-center gap-2 bg-ternary px-3 xs:h-16 lg:h-24 ">
        <Skeleton className="h-12 w-12 rounded-full  " />
        <Skeleton className="h-8 w-full rounded-full  " />
      </Card>
      <Card className="flex items-center gap-2 bg-ternary px-3 xs:h-16 lg:h-24 ">
        <Skeleton className="h-12 w-12 rounded-full  " />
        <Skeleton className="h-8 w-full rounded-full  " />
      </Card>
    </div>
  );
};

export default AllDataCardShimmer;
