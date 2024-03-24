'use client';
import {
  ArrowUpOnSquareIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'ui';

const Page = () => {
  return (
    <div className="flex w-full text-black flex-col gap-6 px-12">
      <h1 className="text-2xl font-bold">Waldo Dashboard</h1>
      <div className="space-y-3 md:space-y-0 md:flex md:flex-col lg:flex lg:flex-row gap-2 items-stretch w-full">
        <Card className="bg-black text-white rounded-lg flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Uploads</CardTitle>
            <ArrowUpOnSquareIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">129</div>
            <p className="text-xs text-yellow-400">+20.1% recently</p>
          </CardContent>
        </Card>
        <Card className="bg-black text-white rounded-lg flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Reviews</CardTitle>
            <PencilSquareIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">812</div>
            <p className="text-xs text-yellow-400">+20.1% recently</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
