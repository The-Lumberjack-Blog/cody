
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import ToolCard from "@/components/ToolCard";
import { workflows, categories } from "@/data/tools";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
          <h1 className="text-5xl font-bold mb-4 max-w-2xl">Discover Powerful AI Workflows</h1>
          <p className="text-xl text-gray-300 max-w-xl mb-8">
            Find and implement pre-built AI workflows to automate your business processes and boost productivity
          </p>
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
            <div className="grid grid-cols-1 gap-6">
              {filteredWorkflows.map((workflow) => (
                <ToolCard key={workflow.workflow_url} workflow={workflow} />
              ))}
            </div>
            
            {filteredWorkflows.length === 0 && (
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
