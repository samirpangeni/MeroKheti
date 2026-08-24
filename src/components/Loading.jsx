import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center">

        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-[3px] border-border" />

          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-primary" />
        </div>

        <div className="mt-4 flex items-center gap-1">
          <span className="text-sm font-medium text-foreground">
            Loading
          </span>

          <span className="flex gap-1">
            <span className="h-1 w-1 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-primary" />
          </span>
        </div>

      </div>
    </div>
  );
};

export default Loading;