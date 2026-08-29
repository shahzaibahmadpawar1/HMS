import { getDoctorSettings } from "@/app/actions/settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, Palette, Shield, Database } from "lucide-react";
import ProfileTab from "./components/profile-tab";
import LetterheadTab from "./components/letterhead-tab";
import DesignTab from "./components/design-tab";
import SecurityTab from "./components/security-tab";
import MasterDataTab from "./components/master-data-tab";

export const revalidate = 0; // Disable caching

export default async function SettingsPage() {
  const settings = await getDoctorSettings();

  // If no settings exist yet, we'll pass an empty object. 
  // In a real app, the default row is inserted via SQL.
  const data = settings || {};

  return (
    <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Doctor profile, account settings, and prescription setup</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full justify-start h-auto p-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6 overflow-x-auto flex-nowrap shrink-0">
          <TabsTrigger value="profile" className="gap-2 rounded-lg py-2.5 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="letterhead" className="gap-2 rounded-lg py-2.5 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white whitespace-nowrap">
            <FileText className="h-4 w-4" /> Prescription Letterhead
          </TabsTrigger>
          <TabsTrigger value="design" className="gap-2 rounded-lg py-2.5 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white whitespace-nowrap">
            <Palette className="h-4 w-4" /> Prescription Design
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 rounded-lg py-2.5 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white whitespace-nowrap">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="master-data" className="gap-2 rounded-lg py-2.5 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white whitespace-nowrap">
            <Database className="h-4 w-4" /> Master Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="m-0">
          <ProfileTab initialData={data} />
        </TabsContent>

        <TabsContent value="letterhead" className="m-0">
          <LetterheadTab initialData={data} />
        </TabsContent>

        <TabsContent value="design" className="m-0">
          <DesignTab initialData={data} />
        </TabsContent>

        <TabsContent value="security" className="m-0">
          <SecurityTab initialData={data} />
        </TabsContent>

        <TabsContent value="master-data" className="m-0">
          <MasterDataTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
