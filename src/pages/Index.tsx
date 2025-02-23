
import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import ToolCard from "@/components/ToolCard";
import { categories } from "@/data/tools";
import { supabase } from "@/integrations/supabase/client";
import type { Workflow } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: workflows = [], isLoading, refetch } = useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workflow")
        .select("*");

      if (error) {
        console.error("Error fetching workflows:", error);
        throw error;
      }

      return data as Workflow[];
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileContent = await file.text();
      const workflows = JSON.parse(fileContent);

      if (!Array.isArray(workflows)) {
        throw new Error("Invalid JSON format. Expected an array of workflows.");
      }

      // Validate workflow objects
      const isValid = workflows.every(workflow => 
        typeof workflow.workflow_name === 'string' &&
        typeof workflow.workflow_url === 'string' &&
        typeof workflow.workflow_description === 'string' &&
        typeof workflow.creator_name === 'string' &&
        typeof workflow.creator_avatar === 'string' &&
        Array.isArray(workflow.icon_urls) &&
        (workflow.paid_or_free === 'Free' || workflow.paid_or_free === 'Paid')
      );

      if (!isValid) {
        throw new Error("Invalid workflow data structure");
      }

      const { error } = await supabase
        .from('workflow')
        .insert(workflows);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully imported ${workflows.length} workflows`,
      });

      // Refresh the workflows list
      refetch();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import workflows",
        variant: "destructive",
      });
    }

    // Reset the input
    event.target.value = '';
  };

  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch = workflow.workflow_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.workflow_description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || workflow.category_url?.includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-5xl font-bold mb-4 max-w-2xl">Discover Powerful AI Workflows</h1>
              <p className="text-xl text-gray-300 max-w-xl">
                Find and implement pre-built AI workflows to automate your business processes and boost productivity
              </p>
            </div>
            <div>
              <input
                type="file"
                id="json-upload"
                accept="application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="json-upload">
                <Button 
                  variant="outline" 
                  className="bg-white text-black hover:bg-gray-100 cursor-pointer"
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Workflows
                  </span>
                </Button>
              </label>
            </div>
          </div>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
          </aside>
          
          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading workflows...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredWorkflows.map((workflow) => (
                  <ToolCard key={workflow.id} workflow={workflow} />
                ))}
              </div>
            )}
            
            {!isLoading && filteredWorkflows.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 text-lg">No workflows found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                  className="mt-4 text-black hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
