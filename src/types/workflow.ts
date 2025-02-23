
export type Workflow = {
  id: string;
  workflow_url: string;
  workflow_name: string;
  workflow_description: string;
  creator_avatar: string;
  creator_name: string;
  created_at: string;
  paid_or_free: "Free" | "Paid";
  icon_urls: string[];
  category_url?: string;
  created_by: string;
};
